#!/usr/bin/env python3
"""
Knowledge resolver for Claude Code skills.

This module resolves knowledge references from knowledge-refs.md files,
reading and collecting knowledge content for skill execution.

Usage:
    python resolve_knowledge.py --refs <path> --workflow <name> --base <path>

Arguments:
    --refs: Path to knowledge-refs.md file
    --workflow: Workflow section name (e.g., "/design")
    --base: Base path for resolving relative knowledge paths

Output:
    JSON to stdout with status, workflow, knowledge, and optional warnings
"""

import sys
import re
from pathlib import Path
from typing import Any

try:
    from claude_utils import normalize_path, resolve_path
except ImportError:
    # Fallback if claude_utils not in path
    import os

    def normalize_path(path: str) -> str:
        return path.replace("\\", "/")

    def resolve_path(base_path: str, relative_path: str) -> str:
        if os.path.isabs(relative_path):
            return normalize_path(relative_path)
        base = Path(base_path).resolve()
        resolved = (base / relative_path).resolve()
        try:
            resolved.relative_to(base)
        except ValueError:
            raise ValueError(f"Path traversal detected: {relative_path}")
        return normalize_path(str(resolved))


def normalize_workflow_name(workflow: str) -> str:
    """
    Normalize workflow name to handle Git Bash path conversion on Windows.

    Git Bash (MINGW64) automatically converts arguments starting with '/' to Windows paths.
    For example, '/design' becomes 'C:/Program Files/Git/design'.

    This function extracts the original workflow name from such converted paths.

    Args:
        workflow: Workflow name (may be Git Bash converted path)

    Returns:
        Normalized workflow name starting with '/'

    Examples:
        'C:/Program Files/Git/design' -> '/design'
        '/design' -> '/design'
        '//design' -> '/design'
    """
    # Handle Git Bash path conversion (e.g., 'C:/Program Files/Git/design' -> '/design')
    # Match pattern: Windows absolute path ending with /workflow-name
    match = re.match(r'^[A-Za-z]:/.*(/[^/]+)$', workflow)
    if match:
        return match.group(1)

    # Handle double slash (user workaround: '//design' -> '/design')
    if workflow.startswith('//'):
        return workflow[1:]

    # Already normalized or other format
    return workflow


def parse_knowledge_refs(content: str, workflow: str) -> list[dict]:
    """
    Extract workflow section from knowledge-refs.md.

    This is a pure function that parses the markdown structure to find
    the specified workflow section and extract knowledge references.

    Args:
        content: Content of knowledge-refs.md file
        workflow: Workflow section name (e.g., "/design")

    Returns:
        List of knowledge reference dictionaries with 'path' key
    """
    if not content or not content.strip():
        return []

    # Find the workflow section
    section_pattern = re.compile(rf'^## {re.escape(workflow)}\s*$', re.MULTILINE)
    match = section_pattern.search(content)

    if not match:
        return []

    # Extract content from this section until the next section or end
    section_start = match.end()
    next_section_pattern = re.compile(r'^## /', re.MULTILINE)
    next_match = next_section_pattern.search(content, section_start)

    if next_match:
        section_content = content[section_start:next_match.start()]
    else:
        section_content = content[section_start:]

    # Parse list items with single regex (path only)
    results = []
    item_pattern = re.compile(
        r'^- path:\s*(.+?)\s*$',
        re.MULTILINE
    )

    for match in item_pattern.finditer(section_content):
        results.append({
            "path": match.group(1).strip()
        })

    return results


def resolve_knowledge_paths(refs: list[dict], base_path: str) -> list[dict]:
    """
    Convert relative paths to absolute paths.

    This is a pure function that resolves paths without I/O operations.

    Args:
        refs: List of knowledge reference dictionaries
        base_path: Base path for resolving relative paths

    Returns:
        List of knowledge references with resolved absolute paths
    """
    results = []
    for ref in refs:
        resolved_ref = ref.copy()
        resolved_ref["path"] = resolve_path(base_path, ref["path"])
        results.append(resolved_ref)
    return results


def read_knowledge_files(resolved: list[dict]) -> tuple[list[dict], list[str]]:
    """
    Read files and return content and warnings.

    This is an I/O function that reads the actual knowledge files.

    Args:
        resolved: List of knowledge references with absolute paths

    Returns:
        Tuple of (knowledge_list, warnings_list)
        - knowledge_list: List of dicts with path and content
        - warnings_list: List of warning messages for missing files
    """
    knowledge = []
    warnings = []

    for ref in resolved:
        file_path = Path(ref["path"])

        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                knowledge.append({
                    "path": normalize_path(ref["path"]),
                    "content": content
                })
            except OSError as e:
                warnings.append(f"Failed to read {normalize_path(ref['path'])}: {e}")
        else:
            warnings.append(f"Knowledge file not found: {normalize_path(ref['path'])}")

    return knowledge, warnings


def main() -> None:
    """Main entry point for the knowledge resolver."""
    import argparse
    import json

    parser = argparse.ArgumentParser(description="Resolve knowledge references for Claude Code skills")
    parser.add_argument("--refs", required=True, help="Path to knowledge-refs.md file")
    parser.add_argument("--workflow", required=True, help="Workflow section name (e.g., /design)")
    parser.add_argument("--base", required=True, help="Base path for resolving relative knowledge paths")

    args = parser.parse_args()

    # Normalize workflow name to handle Git Bash path conversion
    workflow = normalize_workflow_name(args.workflow)

    refs_path = Path(args.refs)

    # Check if knowledge-refs.md exists
    if not refs_path.exists():
        result = {
            "status": "error",
            "error": "knowledge-refs.md not found"
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    # Read knowledge-refs.md
    try:
        with open(refs_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError as e:
        result = {
            "status": "error",
            "error": f"Failed to read knowledge-refs.md: {e}"
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    # Parse knowledge refs
    refs = parse_knowledge_refs(content, workflow)

    # If no section found, return empty status
    if not refs:
        result = {
            "status": "empty",
            "workflow": workflow,
            "knowledge": []
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    # Resolve paths
    resolved = resolve_knowledge_paths(refs, args.base)

    # Read knowledge files
    knowledge, warnings = read_knowledge_files(resolved)

    # Determine status
    if warnings:
        if knowledge:
            status = "partial"
        else:
            status = "error"
    else:
        status = "success"

    # Build result
    result: dict[str, Any] = {
        "status": status,
        "workflow": workflow,
        "knowledge": knowledge
    }

    if warnings:
        result["warnings"] = warnings

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
