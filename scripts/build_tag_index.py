#!/usr/bin/env python3
"""
Build tag index from knowledge files.

Usage:
    python build_tag_index.py <knowledge_path>
    python build_tag_index.py <knowledge_path> --output <output_path>

Output:
    Creates tag-index.json in the knowledge directory (or specified output path).
"""

import json
import sys
import re
from pathlib import Path


def extract_frontmatter(content: str) -> dict:
    """Extract YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}

    lines = content.split('\n')
    end_index = -1
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            end_index = i
            break

    if end_index == -1:
        return {}

    frontmatter = {}
    current_key = None
    current_list = None

    for line in lines[1:end_index]:
        if not line.strip():
            continue

        # Check for key: value
        match = re.match(r'^(\w+):\s*(.*)$', line)
        if match:
            key = match.group(1)
            value = match.group(2).strip()

            # Handle inline list: tags: [a, b, c]
            if value.startswith('[') and value.endswith(']'):
                items = value[1:-1].split(',')
                frontmatter[key] = [item.strip() for item in items if item.strip()]
                current_key = None
                current_list = None
            elif value:
                frontmatter[key] = value
                current_key = None
                current_list = None
            else:
                # Start of a list
                current_key = key
                current_list = []
                frontmatter[key] = current_list
        elif current_list is not None and line.strip().startswith('-'):
            # List item
            item = line.strip()[1:].strip()
            current_list.append(item)

    # Filter out deprecated fields
    deprecated_fields = {'category', 'requires', 'provides'}
    return {k: v for k, v in frontmatter.items() if k not in deprecated_fields}


def build_tag_index(knowledge_path: Path) -> dict:
    """Build tag index from all markdown files in knowledge directory."""
    tags_map = {}  # tag -> list of file paths

    for md_file in knowledge_path.rglob('*.md'):
        # Skip tag-index.json itself and any non-knowledge files
        relative_path = md_file.relative_to(knowledge_path)
        path_str = str(relative_path).replace('\\', '/')

        # Read and parse frontmatter
        try:
            content = md_file.read_text(encoding='utf-8')
        except Exception:
            continue

        frontmatter = extract_frontmatter(content)
        tags = frontmatter.get('tags', [])
        file_id = frontmatter.get('id', md_file.stem)

        if not tags:
            continue

        # Build file path key (category/id.md format)
        category = str(relative_path.parent).replace('\\', '/') if relative_path.parent != Path('.') else 'root'
        file_key = f"{category}/{file_id}.md"

        for tag in tags:
            if tag not in tags_map:
                tags_map[tag] = []
            if file_key not in tags_map[tag]:
                tags_map[tag].append(file_key)

    # Sort tags and file lists for consistent output
    for tag in tags_map:
        tags_map[tag].sort()

    return {
        "tags": dict(sorted(tags_map.items()))
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python build_tag_index.py <knowledge_path> [--output <output_path>]", file=sys.stderr)
        sys.exit(1)

    knowledge_path = Path(sys.argv[1])

    if not knowledge_path.exists():
        print(f"Error: Knowledge path does not exist: {knowledge_path}", file=sys.stderr)
        sys.exit(1)

    # Parse optional output path
    output_path = knowledge_path / "tag-index.json"
    if "--output" in sys.argv:
        output_index = sys.argv.index("--output")
        if output_index + 1 < len(sys.argv):
            output_path = Path(sys.argv[output_index + 1])

    # Build index
    index = build_tag_index(knowledge_path)

    # Write output
    output_path.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding='utf-8')

    # Print success (no statistics)
    print(json.dumps({
        "status": "success",
        "output": str(output_path)
    }))


if __name__ == "__main__":
    main()
