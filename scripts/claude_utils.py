#!/usr/bin/env python3
"""
Shared utilities for Claude Code scripts.

This module contains common functions used across Claude Code Python scripts,
such as path normalization and resolution.
"""

import os
import re
import subprocess
from pathlib import Path


def normalize_path(path: str) -> str:
    """
    Normalize path separators for cross-platform compatibility.

    Windows uses backslashes, but forward slashes work universally and are
    preferred for consistency in JSON output consumed by various tools.

    Args:
        path: Path string to normalize

    Returns:
        Path with forward slashes only
    """
    return path.replace("\\", "/")


def resolve_path(base_path: str, relative_path: str) -> str:
    """
    Resolve a relative path to an absolute path with security checks.

    This function prevents path traversal attacks by ensuring the resolved
    path stays within the base_path directory.

    Args:
        base_path: Base directory for resolution
        relative_path: Path to resolve (absolute paths returned as-is)

    Returns:
        Resolved absolute path with normalized separators

    Raises:
        ValueError: If path traversal is detected
    """
    if os.path.isabs(relative_path):
        return normalize_path(relative_path)

    base = Path(base_path).resolve()
    resolved = (base / relative_path).resolve()

    try:
        resolved.relative_to(base)
    except ValueError:
        raise ValueError(f"Path traversal detected: {relative_path}")

    return normalize_path(str(resolved))


def to_kebab_case(text: str) -> str:
    """
    Convert text to kebab-case format.

    Converts the input text to lowercase, replaces spaces and underscores
    with hyphens, removes non-alphanumeric characters (except hyphens),
    and cleans up consecutive or leading/trailing hyphens.

    Args:
        text: Text string to convert

    Returns:
        Kebab-case formatted string

    Examples:
        >>> to_kebab_case("Fix Login Bug")
        'fix-login-bug'
        >>> to_kebab_case("user_authentication")
        'user-authentication'
        >>> to_kebab_case("Release 1.0")
        'release-1-0'
        >>> to_kebab_case("  multiple   spaces  ")
        'multiple-spaces'
        >>> to_kebab_case("")
        ''
    """
    # Convert to lowercase
    result = text.lower()
    
    # Replace non-alphanumeric characters (except hyphens) with hyphens
    # This handles spaces, underscores, dots, and other special chars
    result = re.sub(r"[^a-z0-9-]", "-", result)
    
    # Replace consecutive hyphens with a single hyphen
    result = re.sub(r"-+", "-", result)
    
    # Remove leading and trailing hyphens
    result = result.strip("-")

    return result


class GitRepoError(Exception):
    """
    Exception raised when git repository operations fail.

    Attributes:
        message: Human-readable error description
        reason: Machine-readable failure reason (e.g., "not_git_repo", "timeout")
    """

    def __init__(self, message: str, reason: str = "unknown"):
        self.message = message
        self.reason = reason
        super().__init__(message)


def get_main_repo_path(cwd: str) -> Path:
    """
    Resolve the main repository path for worktree-aware project identification.

    Worktrees create separate working directories that share the same git history.
    This function resolves to the main repository regardless of whether cwd is
    the main repo or a worktree.

    Args:
        cwd: Current working directory path

    Returns:
        Path to the main repository root

    Raises:
        GitRepoError: If git command fails with detailed reason
            - reason="not_git_repo": cwd is not inside a git repository
            - reason="timeout": git command timed out (5 second limit)
            - reason="command_not_found": git executable not found
            - reason="unknown": other subprocess errors
    """
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--path-format=absolute", "--git-common-dir"],
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode != 0:
            stderr = result.stderr.strip()
            if "not a git repository" in stderr.lower():
                raise GitRepoError(
                    f"Not a git repository: {cwd}",
                    reason="not_git_repo"
                )
            raise GitRepoError(
                f"git rev-parse failed: {stderr}",
                reason="unknown"
            )

        git_common_dir = Path(result.stdout.strip())
        return git_common_dir.parent

    except subprocess.TimeoutExpired:
        raise GitRepoError(
            "git command timed out after 5 seconds",
            reason="timeout"
        )
    except FileNotFoundError:
        raise GitRepoError(
            "git command not found. Ensure git is installed and in PATH",
            reason="command_not_found"
        )
    except OSError as e:
        raise GitRepoError(
            f"Failed to execute git: {e}",
            reason="unknown"
        )


def get_project_name(cwd: str) -> str:
    """
    Determine the project name for configuration lookup.

    Project name must be consistent across all working directories (including
    worktrees) to ensure the same configuration is loaded regardless of
    which checkout is being used.

    When in a git repository, uses the main repository directory name.
    When not in a git repository, falls back to cwd directory name.

    Args:
        cwd: Current working directory path

    Returns:
        The project name derived from:
        - Main repository root directory name (if in git repo)
        - cwd directory name (fallback)

    Note:
        This function never raises exceptions. Git errors are caught and
        result in fallback behavior with error information output to stderr.
    """
    import sys

    try:
        main_repo_path = get_main_repo_path(cwd)
        return main_repo_path.name
    except GitRepoError as e:
        print(f"Warning: {e.message}. Using directory name as project name.",
              file=sys.stderr)
        return Path(cwd).name
