#!/usr/bin/env node
/**
 * Knowledge resolver for Claude Code skills.
 *
 * WHY: Resolves knowledge references from knowledge-refs.md files,
 * reading and collecting knowledge content for skill execution.
 * Migrated from Python resolve_knowledge.py.
 *
 * Usage:
 *   node resolve-knowledge.js --refs <path> --workflow <name> --base <path>
 *
 * Arguments:
 *   --refs: Path to knowledge-refs.md file
 *   --workflow: Workflow section name (e.g., "/design")
 *   --base: Base path for resolving relative knowledge paths
 *
 * Output:
 *   JSON to stdout with status, workflow, knowledge, and optional warnings
 */

const fs = require('fs');
const path = require('path');
const { normalizePath, resolvePath } = require('./path-utils.js');

/**
 * Normalize workflow name to handle Git Bash path conversion on Windows.
 *
 * WHY: Git Bash (MINGW64) automatically converts arguments starting with '/'
 * to Windows paths. For example, '/design' becomes 'C:/Program Files/Git/design'.
 *
 * @param {string} workflow - Workflow name (may be Git Bash converted path)
 * @returns {string} Normalized workflow name starting with '/'
 */
function normalizeWorkflowName(workflow) {
    // Handle Git Bash path conversion (e.g., 'C:/Program Files/Git/design' -> '/design')
    // Match pattern: Windows absolute path ending with /workflow-name
    const match = workflow.match(/^[A-Za-z]:[/\\].*\/([^/]+)$/);
    if (match) {
        return '/' + match[1];
    }

    // Handle double slash (user workaround: '//design' -> '/design')
    if (workflow.startsWith('//')) {
        return workflow.slice(1);
    }

    // Already normalized or other format
    return workflow;
}

/**
 * Extract workflow section from knowledge-refs.md.
 *
 * WHY: Each workflow has its own section with knowledge references.
 *
 * @param {string} content - Content of knowledge-refs.md file
 * @param {string} workflow - Workflow section name (e.g., "/design")
 * @returns {Array<{path: string}>} List of knowledge reference objects
 */
function parseKnowledgeRefs(content, workflow) {
    if (!content || !content.trim()) {
        return [];
    }

    // Find the workflow section
    const escapedWorkflow = workflow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const sectionPattern = new RegExp(`^## ${escapedWorkflow}\\s*$`, 'm');
    const match = sectionPattern.exec(content);

    if (!match) {
        return [];
    }

    // Extract content from this section until the next section or end
    const sectionStart = match.index + match[0].length;
    const nextSectionPattern = /^## \//m;
    const nextMatch = nextSectionPattern.exec(content.slice(sectionStart));

    let sectionContent;
    if (nextMatch) {
        sectionContent = content.slice(sectionStart, sectionStart + nextMatch.index);
    } else {
        sectionContent = content.slice(sectionStart);
    }

    // Parse list items with path: value
    const results = [];
    const itemPattern = /^- path:\s*(.+?)\s*$/gm;

    let itemMatch;
    while ((itemMatch = itemPattern.exec(sectionContent)) !== null) {
        results.push({
            path: itemMatch[1].trim()
        });
    }

    return results;
}

/**
 * Convert relative paths to absolute paths.
 *
 * WHY: Need absolute paths to read knowledge files from filesystem.
 *
 * @param {Array<{path: string}>} refs - List of knowledge reference objects
 * @param {string} basePath - Base path for resolving relative paths
 * @returns {Array<{path: string}>} List with resolved absolute paths
 */
function resolveKnowledgePaths(refs, basePath) {
    const results = [];
    for (const ref of refs) {
        const resolvedRef = { ...ref };
        resolvedRef.path = resolvePath(basePath, ref.path);
        results.push(resolvedRef);
    }
    return results;
}

/**
 * Read files and return content and warnings.
 *
 * WHY: Collect actual knowledge content for skill execution.
 *
 * @param {Array<{path: string}>} resolved - List of knowledge refs with absolute paths
 * @returns {{knowledge: Array<{path: string, content: string}>, warnings: string[]}}
 */
function readKnowledgeFiles(resolved) {
    const knowledge = [];
    const warnings = [];

    for (const ref of resolved) {
        const filePath = ref.path;

        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                knowledge.push({
                    path: normalizePath(filePath),
                    content
                });
            } catch (e) {
                warnings.push(`Failed to read ${normalizePath(filePath)}: ${e.message}`);
            }
        } else {
            warnings.push(`Knowledge file not found: ${normalizePath(filePath)}`);
        }
    }

    return { knowledge, warnings };
}

/**
 * Parse command line arguments.
 *
 * @param {string[]} args - Command line arguments
 * @returns {{refs: string, workflow: string, base: string} | null}
 */
function parseArgs(args) {
    const result = { refs: null, workflow: null, base: null };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--refs' && i + 1 < args.length) {
            result.refs = args[i + 1];
            i++;
        } else if (args[i] === '--workflow' && i + 1 < args.length) {
            result.workflow = args[i + 1];
            i++;
        } else if (args[i] === '--base' && i + 1 < args.length) {
            result.base = args[i + 1];
            i++;
        }
    }

    if (!result.refs || !result.workflow || !result.base) {
        return null;
    }

    return result;
}

/**
 * Main CLI function.
 */
function main() {
    const args = process.argv.slice(2);
    const parsedArgs = parseArgs(args);

    if (!parsedArgs) {
        console.error('Usage: node resolve-knowledge.js --refs <path> --workflow <name> --base <path>');
        process.exit(1);
    }

    // Normalize workflow name to handle Git Bash path conversion
    const workflow = normalizeWorkflowName(parsedArgs.workflow);
    const refsPath = parsedArgs.refs;

    // Check if knowledge-refs.md exists
    if (!fs.existsSync(refsPath)) {
        const result = {
            status: 'error',
            error: 'knowledge-refs.md not found'
        };
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    // Read knowledge-refs.md
    let content;
    try {
        content = fs.readFileSync(refsPath, 'utf-8');
    } catch (e) {
        const result = {
            status: 'error',
            error: `Failed to read knowledge-refs.md: ${e.message}`
        };
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    // Parse knowledge refs
    const refs = parseKnowledgeRefs(content, workflow);

    // If no section found, return empty status
    if (refs.length === 0) {
        const result = {
            status: 'empty',
            workflow,
            knowledge: []
        };
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    // Resolve paths
    const resolved = resolveKnowledgePaths(refs, parsedArgs.base);

    // Read knowledge files
    const { knowledge, warnings } = readKnowledgeFiles(resolved);

    // Determine status
    let status;
    if (warnings.length > 0) {
        status = knowledge.length > 0 ? 'partial' : 'error';
    } else {
        status = 'success';
    }

    // Build result
    const result = {
        status,
        workflow,
        knowledge
    };

    if (warnings.length > 0) {
        result.warnings = warnings;
    }

    console.log(JSON.stringify(result, null, 2));
}

// Run main if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    normalizeWorkflowName,
    parseKnowledgeRefs,
    resolveKnowledgePaths,
    readKnowledgeFiles
};
