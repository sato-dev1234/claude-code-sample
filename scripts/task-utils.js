/**
 * task-utils.js
 *
 * Common utilities for loading task files from disk.
 */

const fs = require('fs');
const path = require('path');

/**
 * Load tasks from a directory.
 *
 * @param {string} tasksDir - Path to tasks directory
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeMetadata - If true, returns {tasks, error?, skippedCount}
 *                                            If false (default), returns plain tasks object
 * @param {boolean} options.logWarnings - If true, logs warnings to stderr for invalid files
 *                                        Default: same as includeMetadata
 * @returns {Object|{tasks: Object, error?: string, skippedCount: number}}
 */
function loadTasks(tasksDir, options = {}) {
    const { includeMetadata = false, logWarnings = includeMetadata } = options;

    const tasks = {};
    let skippedCount = 0;

    if (!fs.existsSync(tasksDir)) {
        return includeMetadata
            ? { tasks, skippedCount }
            : tasks;
    }

    let files;
    try {
        files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.json'));
    } catch (e) {
        if (includeMetadata) {
            return { tasks: {}, error: `Failed to read directory: ${e.message}`, skippedCount: 0 };
        }
        return tasks;
    }

    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(tasksDir, file), 'utf8');
            const task = JSON.parse(content);
            if (task && task.id) {
                tasks[task.id] = task;
            } else {
                skippedCount++;
                if (logWarnings) {
                    console.error(`Warning: Skipping file without id: ${file}`);
                }
                continue;
            }
        } catch (e) {
            if (logWarnings) {
                console.error(`Warning: Skipping invalid JSON file: ${file} - ${e.message}`);
            }
            skippedCount++;
            continue;
        }
    }

    return includeMetadata
        ? { tasks, skippedCount }
        : tasks;
}

module.exports = {
    loadTasks
};
