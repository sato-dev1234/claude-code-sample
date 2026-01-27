/**
 * Path utilities for cross-platform compatibility.
 *
 * Provides path normalization and secure path resolution.
 * Migrated from Python claude_utils.py.
 */

const path = require('path');

/**
 * Normalize path separators for cross-platform compatibility.
 *
 * WHY: Windows uses backslashes, but forward slashes work universally
 * and are preferred for consistency in JSON output consumed by various tools.
 *
 * @param {string} inputPath - Path string to normalize
 * @returns {string} Path with forward slashes only
 */
function normalizePath(inputPath) {
    return inputPath.replace(/\\/g, '/');
}

/**
 * Resolve a relative path to an absolute path with security checks.
 *
 * WHY: Prevents path traversal attacks by ensuring the resolved
 * path stays within the base directory.
 *
 * @param {string} basePath - Base directory for resolution
 * @param {string} relativePath - Path to resolve (absolute paths returned as-is)
 * @returns {string} Resolved absolute path with normalized separators
 * @throws {Error} If path traversal is detected
 */
function resolvePath(basePath, relativePath) {
    // Input validation: absolute paths are returned as-is (normalized)
    if (path.isAbsolute(relativePath)) {
        return normalizePath(relativePath);
    }

    const base = path.resolve(basePath);
    const resolved = path.resolve(base, relativePath);

    // Security check: resolved path must be under base
    const normalizedBase = normalizePath(base);
    const normalizedResolved = normalizePath(resolved);

    // Must start with base path followed by separator or be exactly base
    if (!normalizedResolved.startsWith(normalizedBase + '/') && normalizedResolved !== normalizedBase) {
        throw new Error('Path traversal detected: ' + relativePath);
    }

    return normalizedResolved;
}

module.exports = {
    normalizePath,
    resolvePath
};
