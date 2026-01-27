#!/usr/bin/env node
/**
 * Build tag index from knowledge files.
 *
 * WHY: Creates searchable index for tag-based knowledge lookup.
 * Migrated from Python build_tag_index.py.
 *
 * Usage:
 *   node build-tag-index.js <knowledge_path>
 *   node build-tag-index.js <knowledge_path> --output <output_path>
 *
 * Output:
 *   Creates tag-index.json in the knowledge directory (or specified output path).
 */

const fs = require('fs');
const path = require('path');

// Deprecated fields to filter out from frontmatter
const DEPRECATED_FIELDS = new Set(['category', 'requires', 'provides']);

/**
 * Extract YAML frontmatter from markdown content.
 *
 * WHY: Frontmatter contains metadata (id, tags) needed for indexing.
 *
 * @param {string} content - Markdown file content
 * @returns {Object} Parsed frontmatter (excluding deprecated fields)
 */
function extractFrontmatter(content) {
    if (!content.startsWith('---')) {
        return {};
    }

    const lines = content.split('\n');
    let endIndex = -1;

    // Find closing ---
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) {
        return {};
    }

    const frontmatter = {};
    let currentKey = null;
    let currentList = null;

    for (let i = 1; i < endIndex; i++) {
        const line = lines[i];
        if (!line.trim()) {
            continue;
        }

        // Check for key: value
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
            const key = match[1];
            const value = match[2].trim();

            // Handle inline list: tags: [a, b, c]
            if (value.startsWith('[') && value.endsWith(']')) {
                const items = value.slice(1, -1).split(',');
                frontmatter[key] = items
                    .map(item => item.trim())
                    .filter(item => item !== '');
                currentKey = null;
                currentList = null;
            } else if (value) {
                frontmatter[key] = value;
                currentKey = null;
                currentList = null;
            } else {
                // Start of a multiline list
                currentKey = key;
                currentList = [];
                frontmatter[key] = currentList;
            }
        } else if (currentList !== null && line.trim().startsWith('-')) {
            // List item
            const item = line.trim().slice(1).trim();
            currentList.push(item);
        }
    }

    // Filter out deprecated fields
    const result = {};
    for (const [key, value] of Object.entries(frontmatter)) {
        if (!DEPRECATED_FIELDS.has(key)) {
            result[key] = value;
        }
    }

    return result;
}

/**
 * Recursively find all markdown files in a directory.
 *
 * @param {string} dir - Directory to search
 * @param {string} [baseDir] - Base directory for relative paths
 * @returns {Array<{path: string, relativePath: string}>} List of file paths
 */
function findMarkdownFiles(dir, baseDir = dir) {
    const results = [];

    if (!fs.existsSync(dir)) {
        return results;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            results.push(...findMarkdownFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            results.push({ path: fullPath, relativePath });
        }
    }

    return results;
}

/**
 * Build tag index from all markdown files in knowledge directory.
 *
 * WHY: Creates searchable index for tag-based knowledge lookup.
 *
 * @param {string} knowledgePath - Path to knowledge directory
 * @returns {Object} Tag index with { tags: { tagName: [files...] } }
 */
function buildTagIndex(knowledgePath) {
    const tagsMap = {}; // tag -> list of file paths

    const mdFiles = findMarkdownFiles(knowledgePath);

    for (const { path: filePath, relativePath } of mdFiles) {
        // Read and parse frontmatter
        let content;
        try {
            content = fs.readFileSync(filePath, 'utf-8');
        } catch (e) {
            continue;
        }

        const frontmatter = extractFrontmatter(content);
        const tags = frontmatter.tags || [];
        const fileId = frontmatter.id || path.basename(filePath, '.md');

        if (tags.length === 0) {
            continue;
        }

        // Build file path key (category/id.md format)
        const relativeDir = path.dirname(relativePath);
        const category = relativeDir === '.' ? 'root' : relativeDir.replace(/\\/g, '/');
        const fileKey = `${category}/${fileId}.md`;

        for (const tag of tags) {
            if (!tagsMap[tag]) {
                tagsMap[tag] = [];
            }
            if (!tagsMap[tag].includes(fileKey)) {
                tagsMap[tag].push(fileKey);
            }
        }
    }

    // Sort tags and file lists for consistent output
    for (const tag of Object.keys(tagsMap)) {
        tagsMap[tag].sort();
    }

    // Sort tags alphabetically
    const sortedTags = {};
    for (const key of Object.keys(tagsMap).sort()) {
        sortedTags[key] = tagsMap[key];
    }

    return {
        tags: sortedTags
    };
}

/**
 * Main CLI function.
 */
function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error('Usage: node build-tag-index.js <knowledge_path> [--output <output_path>]');
        process.exit(1);
    }

    const knowledgePath = args[0];

    if (!fs.existsSync(knowledgePath)) {
        console.error(`Error: Knowledge path does not exist: ${knowledgePath}`);
        process.exit(1);
    }

    // Parse optional output path
    let outputPath = path.join(knowledgePath, 'tag-index.json');
    const outputIndex = args.indexOf('--output');
    if (outputIndex !== -1 && outputIndex + 1 < args.length) {
        outputPath = args[outputIndex + 1];
    }

    // Build index
    const index = buildTagIndex(knowledgePath);

    // Write output
    fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8');

    // Print success (no statistics)
    console.log(JSON.stringify({
        status: 'success',
        output: outputPath
    }));
}

// Run main if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    extractFrontmatter,
    buildTagIndex
};
