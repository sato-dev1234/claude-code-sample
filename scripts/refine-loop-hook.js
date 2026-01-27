#!/usr/bin/env node

/**
 * Refine Loop Stop Hook
 *
 * Prevents session exit when a refine-loop is active.
 * Exits when ISSUE_COUNT = 0 or max iterations reached.
 */

const fs = require('fs');
const path = require('path');

/**
 * Find active refine-loop state file
 * @param {string} baseDir - Base directory for refine-loop state
 * @returns {{ stateFile: string, type: string } | null}
 */
function findActiveRefineState(baseDir) {
    if (!fs.existsSync(baseDir)) return null;

    const typeDirectories = ['code', 'tests', 'ui-tests', 'skills', 'docs', 'ac'];

    for (const typeDir of typeDirectories) {
        const stateFile = path.join(baseDir, typeDir, 'state.local.md');
        if (fs.existsSync(stateFile)) {
            return { stateFile, type: typeDir };
        }
    }
    return null;
}

/**
 * Parse markdown frontmatter (YAML between ---)
 * @param {string} content - File content
 * @returns {Object} - Parsed frontmatter fields
 */
function parseFrontmatter(content) {
    const lines = content.split('\n');
    const frontmatter = {};

    let inFrontmatter = false;
    for (const line of lines) {
        if (line.trim() === '---') {
            if (inFrontmatter) break;
            inFrontmatter = true;
            continue;
        }
        if (inFrontmatter) {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                frontmatter[match[1]] = value;
            }
        }
    }
    return frontmatter;
}

/**
 * Extract prompt text (everything after the closing ---)
 * @param {string} content - File content
 * @returns {string}
 */
function extractPromptText(content) {
    const lines = content.split('\n');
    let dashCount = 0;
    const promptLines = [];

    for (const line of lines) {
        if (line.trim() === '---') {
            dashCount++;
            continue;
        }
        if (dashCount >= 2) {
            promptLines.push(line);
        }
    }
    return promptLines.join('\n').trim();
}

/**
 * Check if ISSUE_COUNT = 0 in the output
 * @param {string} output - Last assistant output
 * @returns {boolean}
 */
function hasZeroIssueCount(output) {
    return /ISSUE_COUNT\s*=\s*0/.test(output);
}

/**
 * Check if all issues are unfixable
 * @param {string} output - Last assistant output
 * @returns {boolean}
 */
function hasAllUnfixable(output) {
    const hasUnfixable = /UNFIXABLE_COUNT\s*=\s*[1-9]/.test(output);
    const hasZeroIssues = hasZeroIssueCount(output);
    return hasUnfixable && hasZeroIssues;
}

/**
 * Check for completion promise
 * @param {string} output - Last assistant output
 * @param {string} promise - Completion promise string
 * @returns {boolean}
 */
function hasCompletionPromise(output, promise) {
    if (!promise || promise === 'null') return false;
    return output.includes(`<promise>${promise}</promise>`);
}

/**
 * Cleanup refine state directory
 * @param {string} baseDir - Base directory
 * @param {string} typeDir - Type subdirectory
 */
function cleanupRefineState(baseDir, typeDir) {
    if (!typeDir) return;
    const dirPath = path.join(baseDir, typeDir);
    if (fs.existsSync(dirPath)) {
        try {
            fs.rmSync(dirPath, { recursive: true });
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}

/**
 * Update iteration in state file
 * @param {string} stateFile - Path to state file
 * @param {number} newIteration - New iteration number
 */
function updateIteration(stateFile, newIteration) {
    const content = fs.readFileSync(stateFile, 'utf8');
    const updated = content.replace(/^iteration:\s*\d+/m, `iteration: ${newIteration}`);
    fs.writeFileSync(stateFile, updated, 'utf8');
}

/**
 * Get last assistant message from transcript
 * @param {string} transcriptPath - Path to transcript file
 * @returns {string | null}
 */
function getLastAssistantMessage(transcriptPath) {
    if (!fs.existsSync(transcriptPath)) return null;

    const content = fs.readFileSync(transcriptPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());

    let lastAssistantLine = null;
    for (const line of lines) {
        if (line.includes('"role":"assistant"')) {
            lastAssistantLine = line;
        }
    }
    return lastAssistantLine;
}

/**
 * Main hook logic
 * @param {Object} options - Configuration options
 * @param {string} options.cwd - Current working directory
 * @param {Object} options.hookInput - Parsed hook input
 * @returns {Object | null} - Response object or null if no action needed
 */
function runHook(options) {
    const { cwd, hookInput } = options;

    const baseDir = path.join(cwd, '.claude', 'refine-loop');
    const state = findActiveRefineState(baseDir);

    if (!state) return null;

    const { stateFile, type } = state;

    // Read and parse state file
    let content;
    try {
        content = fs.readFileSync(stateFile, 'utf8');
    } catch (e) {
        return null;
    }

    const frontmatter = parseFrontmatter(content);
    const iteration = parseInt(frontmatter.iteration, 10);
    const maxIterations = parseInt(frontmatter.max_iterations, 10);
    const completionPromise = frontmatter.completion_promise || null;

    // Validate numeric fields
    if (isNaN(iteration)) {
        console.error(`Refine loop: iteration field is invalid (got: '${frontmatter.iteration}')`);
        cleanupRefineState(baseDir, type);
        return null;
    }

    if (isNaN(maxIterations)) {
        console.error(`Refine loop: max_iterations field is invalid (got: '${frontmatter.max_iterations}')`);
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Check if max iterations reached
    if (maxIterations > 0 && iteration >= maxIterations) {
        console.error(`Refine loop: Max iterations (${maxIterations}) reached.`);
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Get transcript path from hook input
    const transcriptPath = hookInput?.transcript_path;
    if (!transcriptPath) {
        console.error('Refine loop: No transcript path in hook input');
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Normalize Windows paths
    const normalizedPath = transcriptPath.replace(/\\\\/g, '/');
    const lastMessage = getLastAssistantMessage(normalizedPath);

    if (!lastMessage) {
        console.error('Refine loop: No assistant messages found');
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Check for all-unfixable condition
    if (hasAllUnfixable(lastMessage)) {
        console.error('Refine loop: All remaining issues are unfixable. Loop complete.');
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Check for ISSUE_COUNT = 0
    if (hasZeroIssueCount(lastMessage)) {
        console.error('Refine loop: ISSUE_COUNT = 0 detected. Loop complete.');
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Check for completion promise
    if (hasCompletionPromise(lastMessage, completionPromise)) {
        console.error(`Refine loop: <promise>${completionPromise}</promise> detected.`);
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Continue loop
    const nextIteration = iteration + 1;
    const promptText = extractPromptText(content);

    if (!promptText) {
        console.error('Refine loop: No prompt text found');
        cleanupRefineState(baseDir, type);
        return null;
    }

    // Update iteration in state file
    updateIteration(stateFile, nextIteration);

    // Build system message
    let systemMsg;
    if (completionPromise && completionPromise !== 'null') {
        systemMsg = `Refine iteration ${nextIteration} | Exit: ISSUE_COUNT = 0 or <promise>${completionPromise}</promise>`;
    } else {
        systemMsg = `Refine iteration ${nextIteration} | Exit: ISSUE_COUNT = 0`;
    }

    return {
        decision: 'block',
        reason: promptText,
        systemMessage: systemMsg
    };
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findActiveRefineState,
        parseFrontmatter,
        extractPromptText,
        hasZeroIssueCount,
        hasAllUnfixable,
        hasCompletionPromise,
        cleanupRefineState,
        updateIteration,
        getLastAssistantMessage,
        runHook
    };
}

// Main execution when run directly
if (require.main === module) {
    // Read hook input from stdin synchronously
    let input = '';
    try {
        const BUFSIZE = 4096;
        const buf = Buffer.alloc(BUFSIZE);
        let bytesRead;
        try {
            while ((bytesRead = fs.readSync(0, buf, 0, BUFSIZE)) > 0) {
                input += buf.toString('utf8', 0, bytesRead);
            }
        } catch (e) {
            // EOF or error
        }
    } catch (e) {
        // Ignore stdin errors
    }

    let hookInput = {};
    try {
        hookInput = JSON.parse(input);
    } catch (e) {
        // Invalid JSON, use empty object
    }

    const result = runHook({
        cwd: process.cwd(),
        hookInput
    });

    if (result) {
        console.log(JSON.stringify(result));
    }
    process.exit(0);
}
