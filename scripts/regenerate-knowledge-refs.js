#!/usr/bin/env node
/**
 * Regenerate knowledge-refs.md from JSON data using template.
 *
 * WHY: Provides a simple template engine to generate knowledge-refs.md
 * without requiring external dependencies like pybars.
 * Migrated from Python regenerate_knowledge_refs.py.
 *
 * Usage:
 *   echo '{"design_refs": [...]}' | node regenerate-knowledge-refs.js <ticket_path> <knowledge_path>
 *
 * Reads JSON from stdin and generates knowledge-refs.md using built-in template.
 */

const fs = require('fs');
const path = require('path');

// Built-in template (matches knowledge-refs-template.md)
const TEMPLATE = `# Related Knowledge

Ticket: {{TICKET_ID}}

{{#if design_refs}}
## /design

{{#each design_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if tdd_refs}}
## /tdd

{{#each tdd_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if ui_test_design_refs}}
## /ui-test-design

{{#each ui_test_design_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if write_documents_refs}}
## /write-documents

{{#each write_documents_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if write_release_notes_refs}}
## /write-release-notes

{{#each write_release_notes_refs}}
- path: {{path}}
{{/each}}
{{/if}}

`;

/**
 * Minimal template processor supporting only:
 * - {{variable}} - Variable substitution
 * - {{#if array}}...{{/if}} - Conditional (array.length > 0)
 * - {{#each array}}...{{/each}} - Loop with {{property}} access
 *
 * WHY: knowledge-refs-template.md only uses these 3 constructs.
 * Using full Handlebars for this is over-engineering.
 *
 * @param {string} template - Template string
 * @param {Object} data - Data object for template variables
 * @returns {string} Rendered template
 */
function renderTemplate(template, data) {
    let result = template;

    // Process {{#each array}}...{{/each}} blocks first
    // WHY: Each blocks can be nested inside if blocks
    result = result.replace(
        /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
        (match, arrayName, content) => {
            const array = data[arrayName];
            if (!Array.isArray(array)) {
                return '';
            }

            return array.map(item => {
                // Replace {{property}} with item.property
                return content.replace(
                    /\{\{(\w+)\}\}/g,
                    (m, prop) => {
                        const value = item[prop];
                        return value !== undefined ? String(value) : '';
                    }
                );
            }).join('');
        }
    );

    // Process {{#if array}}...{{/if}} blocks
    // WHY: Conditionally include sections based on array presence
    result = result.replace(
        /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (match, varName, content) => {
            const value = data[varName];
            // Truthy check: array with items or non-empty value
            const isTruthy = Array.isArray(value) ? value.length > 0 : Boolean(value);
            return isTruthy ? content : '';
        }
    );

    // Process simple {{variable}} replacements
    // WHY: Replace top-level variables like TICKET_ID
    result = result.replace(
        /\{\{(\w+)\}\}/g,
        (match, varName) => {
            const value = data[varName];
            return value !== undefined ? String(value) : '';
        }
    );

    return result;
}

/**
 * Regenerate knowledge-refs.md from data.
 *
 * @param {string} ticketPath - Path to ticket directory
 * @param {Object} data - Data object containing refs arrays
 */
function regenerateKnowledgeRefs(ticketPath, data) {
    const output = renderTemplate(TEMPLATE, data);
    const outputFile = path.join(ticketPath, 'knowledge-refs.md');
    fs.writeFileSync(outputFile, output, 'utf-8');
}

/**
 * Main CLI function.
 */
function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error('Usage: node regenerate-knowledge-refs.js <ticket_path> <knowledge_path>');
        console.error('JSON data should be provided via stdin');
        process.exit(1);
    }

    const ticketPath = args[0];
    const knowledgePath = args[1]; // Kept for API compatibility, not used currently

    // Validate ticket path
    if (!fs.existsSync(ticketPath)) {
        console.error(`Error: Invalid TICKET_PATH: ${ticketPath}`);
        process.exit(1);
    }

    // Read JSON from stdin
    let inputData = '';
    const stdin = fs.readFileSync(0, 'utf-8');

    let data;
    try {
        data = JSON.parse(stdin);
    } catch (e) {
        console.error(`Error: Invalid JSON input: ${e.message}`);
        process.exit(1);
    }

    // Regenerate knowledge-refs.md
    try {
        regenerateKnowledgeRefs(ticketPath, data);
        const outputFile = path.join(ticketPath, 'knowledge-refs.md');
        console.log(`knowledge-refs.md regenerated successfully at ${outputFile}`);
    } catch (e) {
        console.error(`Error: Failed to write knowledge-refs.md: ${e.message}`);
        process.exit(1);
    }
}

// Run main if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    renderTemplate,
    regenerateKnowledgeRefs,
    TEMPLATE
};
