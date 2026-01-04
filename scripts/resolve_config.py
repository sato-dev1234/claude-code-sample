#!/usr/bin/env python3
"""
Configuration resolver for Claude Code skills.

This module resolves configuration settings for Claude Code skills by loading
global and project-specific YAML configuration files. It provides a deterministic
way to obtain settings with proper path resolution, replacing the previous
LLM-based config-resolution.md approach.

Usage:
    python resolve_config.py <cwd> [required_settings...]

Arguments:
    cwd: Current working directory path (used to derive project name)
    required_settings: Space-separated list of skill setting names to extract

Output:
    JSON to stdout with BASE_PATH, SETTINGS, and TICKETS

Error Handling Strategy:
    - Global config errors (missing file, parse error, missing storage_path): Fatal (exit 1)
    - Project config errors (missing file, parse error): Non-fatal (warning, continue with defaults)
    This asymmetric behavior exists because global config is required for the system
    to function, while project config is optional and provides overrides.

Exit Codes:
    0: Success
    1: Configuration error (missing global config, missing storage_path, parse error)
"""

import sys
import os
import json
import re
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

from claude_utils import normalize_path, resolve_path, get_project_name


# Constants
PATH_SETTING_SUFFIX = "_path"
ALLOWED_SETTING_PATTERN = re.compile(r"^[a-z][a-z0-9_-]*$")


def get_global_config_path() -> Path:
    """
    Get the global Claude Code configuration file path.

    The global config is located at ~/.claude/global-config.yaml and contains
    system-wide settings like storage_path.

    Returns:
        Path object pointing to the global config file
    """
    home = Path(os.environ.get("USERPROFILE", os.environ.get("HOME", "")))
    return home / ".claude" / "global-config.yaml"


def validate_cwd(cwd: str) -> bool:
    """
    Validate that cwd is a plausible directory path.

    Args:
        cwd: Path to validate

    Returns:
        True if valid, False otherwise
    """
    if not cwd or not cwd.strip():
        return False
    if "\x00" in cwd:
        return False
    return True


def validate_setting_name(name: str) -> bool:
    """
    Validate that a setting name matches the allowed pattern.

    Setting names must be lowercase alphanumeric with underscores or hyphens,
    starting with a letter (e.g., managing-tickets, creating-release-notes).

    Args:
        name: Setting name to validate

    Returns:
        True if valid, False otherwise
    """
    return bool(ALLOWED_SETTING_PATTERN.match(name))


def load_yaml_file(path: Path) -> dict[str, Any]:
    """
    Load a YAML file and return its contents as a dictionary.

    Args:
        path: Path to the YAML file

    Returns:
        Dictionary containing the YAML content, or empty dict if file is empty

    Raises:
        yaml.YAMLError: If YAML parsing fails
        OSError: If file cannot be read (permission denied, etc.)
    """
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def resolve_setting_paths(skill_settings: dict[str, Any], base_path: str) -> dict[str, Any]:
    """
    Resolve path settings within a skill configuration.

    Settings with keys ending in '_path' are resolved from relative
    to absolute paths based on base_path.

    Args:
        skill_settings: Skill configuration dictionary
        base_path: Base directory for path resolution

    Returns:
        New dictionary with paths resolved
    """
    result = skill_settings.copy()
    for key, value in result.items():
        if key.endswith(PATH_SETTING_SUFFIX) and isinstance(value, str):
            result[key] = resolve_path(base_path, value)
    return result


def extract_settings(
    config: dict[str, Any],
    required_settings: list[str],
    base_path: str
) -> dict[str, dict[str, Any]]:
    """
    Extract required skill settings from configuration and resolve paths.

    Args:
        config: Full project configuration dictionary
        required_settings: List of skill setting names to extract
        base_path: Base directory for path resolution

    Returns:
        Dictionary mapping setting names to their resolved configurations
    """
    skills_config = config.get("skills", {})
    result: dict[str, dict[str, Any]] = {}

    for setting_name in required_settings:
        if setting_name in skills_config:
            skill_settings = skills_config[setting_name]
            result[setting_name] = resolve_setting_paths(skill_settings, base_path)

    return result


def extract_tickets_config(config: dict[str, Any]) -> dict[str, Any] | None:
    """
    Extract tickets configuration from project config.

    Args:
        config: Full project configuration dictionary

    Returns:
        Tickets configuration dict, or None if not configured
    """
    return config.get("tickets")


def main() -> None:
    """
    Main entry point for the configuration resolver.

    Parses command-line arguments, loads configuration files,
    and outputs the resolved configuration as JSON.
    """
    if len(sys.argv) < 2:
        print("Usage: python resolve_config.py <cwd> [required_settings...]", file=sys.stderr)
        sys.exit(1)

    cwd = sys.argv[1]
    required_settings = sys.argv[2:] if len(sys.argv) > 2 else []

    if not validate_cwd(cwd):
        print(f"Error: Invalid cwd argument: {cwd}", file=sys.stderr)
        sys.exit(1)

    for setting in required_settings:
        if not validate_setting_name(setting):
            print(f"Error: Invalid setting name: {setting}", file=sys.stderr)
            sys.exit(1)

    global_config_path = get_global_config_path()
    if not global_config_path.exists():
        print(f"Error: Global config not found: {global_config_path}", file=sys.stderr)
        sys.exit(1)

    try:
        global_config = load_yaml_file(global_config_path)
    except yaml.YAMLError as e:
        print(f"Error: Failed to parse global config: {e}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error: Failed to read global config: {e}", file=sys.stderr)
        sys.exit(1)

    storage_path = global_config.get("paths", {}).get("storage_path")
    if not storage_path:
        print("Error: storage_path not set in ~/.claude/global-config.yaml", file=sys.stderr)
        sys.exit(1)

    project_name = get_project_name(cwd)
    base_path = normalize_path(str(Path(storage_path) / project_name))
    config_path = Path(base_path) / "project-config.yaml"

    settings: dict[str, dict[str, Any]] = {}
    tickets: dict[str, Any] | None = None

    if config_path.exists():
        try:
            project_config = load_yaml_file(config_path)
            settings = extract_settings(project_config, required_settings, base_path)
            tickets = extract_tickets_config(project_config)
        except yaml.YAMLError as e:
            print(f"Warning: Failed to parse project config, using defaults: {e}", file=sys.stderr)
        except OSError as e:
            print(f"Warning: Failed to read project config, using defaults: {e}", file=sys.stderr)

    result = {
        "BASE_PATH": base_path,
        "SETTINGS": settings,
        "TICKETS": tickets
    }

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
