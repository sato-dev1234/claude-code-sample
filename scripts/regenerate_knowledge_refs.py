#!/usr/bin/env python3
"""
Regenerate knowledge-refs.md from JSON data using template.

Usage:
    echo '{"design_refs": [...]}' | python regenerate_knowledge_refs.py <ticket_path> <knowledge_path>

Reads JSON from stdin and generates knowledge-refs.md using knowledge-refs-template.md.
"""

import sys
import json
from pathlib import Path

try:
    from pybars import Compiler
except ImportError:
    print("Error: pybars3 is not installed. Install with: pip install pybars3", file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print("Usage: python regenerate_knowledge_refs.py <ticket_path> <knowledge_path>", file=sys.stderr)
        print("JSON data should be provided via stdin", file=sys.stderr)
        sys.exit(1)

    ticket_path = Path(sys.argv[1])
    knowledge_path = Path(sys.argv[2])

    # Validate paths
    if not ticket_path.exists():
        print(f"Error: Invalid TICKET_PATH: {ticket_path}", file=sys.stderr)
        sys.exit(1)

    # Read JSON from stdin
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    # Find template
    # Try multiple locations for template
    template_locations = [
        Path(__file__).parent.parent / "skills/managing-tickets/templates/knowledge-refs-template.md",
        Path.home() / ".claude/skills/managing-tickets/templates/knowledge-refs-template.md",
    ]

    template_path = None
    for loc in template_locations:
        if loc.exists():
            template_path = loc
            break

    if not template_path:
        print(f"Error: knowledge-refs-template.md not found in expected locations", file=sys.stderr)
        sys.exit(1)

    # Read template
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template_content = f.read()
    except OSError as e:
        print(f"Error: Failed to read template: {e}", file=sys.stderr)
        sys.exit(1)

    # Render template
    try:
        compiler = Compiler()
        template = compiler.compile(template_content)
        output = template(data)
    except Exception as e:
        print(f"Error: Template rendering failed: {e}", file=sys.stderr)
        sys.exit(1)

    # Write output
    output_file = ticket_path / "knowledge-refs.md"
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(output)
    except OSError as e:
        print(f"Error: Failed to write knowledge-refs.md: {e}", file=sys.stderr)
        sys.exit(1)

    # Success message
    print(f"knowledge-refs.md regenerated successfully at {output_file}")


if __name__ == "__main__":
    main()
