#!/usr/bin/env python3
"""
Get project name for Claude Code init-project command.

Usage:
    python get_project_name.py <cwd>

Args:
    cwd: Current working directory path

Output:
    stdout: Project name only
    stderr: Error messages and warnings from claude_utils

Exit Codes:
    0: Success
    1: Error (invalid arguments, path not found, etc.)
"""

import os
import sys


def main() -> None:
    """Main entry point."""
    if len(sys.argv) != 2:
        print("Usage: python get_project_name.py <cwd>", file=sys.stderr)
        sys.exit(1)

    cwd = sys.argv[1]

    if not os.path.exists(cwd):
        print(f"Error: Path does not exist: {cwd}", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(cwd):
        print(f"Error: Not a directory: {cwd}", file=sys.stderr)
        sys.exit(1)

    # sys.path cleanup not needed - script exits immediately after use
    scripts_path = os.path.join(os.path.expanduser("~"), ".claude", "scripts")
    sys.path.insert(0, scripts_path)

    try:
        from claude_utils import get_project_name
    except ImportError as e:
        print(f"Error: Failed to import claude_utils: {e}", file=sys.stderr)
        sys.exit(1)

    project_name = get_project_name(cwd)

    if not project_name or not project_name.strip():
        print("Error: Failed to determine project name", file=sys.stderr)
        sys.exit(1)

    print(project_name.strip())


if __name__ == "__main__":
    main()
