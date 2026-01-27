#!/usr/bin/env node

/**
 * resolve-task-dependencies.js
 *
 * Resolves task dependencies and categorizes tasks by execution readiness.
 * Used by /tdd skill for parallel orchestration.
 *
 * Usage:
 *   node resolve-task-dependencies.js --ticket=CCMD-00216 [--filter="Implement:"]
 *
 * Output (JSON):
 *   { ready: [...], pending: [...], completed: [...], blocked: {...} }
 */

const fs = require('fs');
const path = require('path');
const { loadTasks } = require('./task-utils.js');

/**
 * Check if a task is ready for execution (pending with all blockers resolved)
 * @param {Object} task - Task object
 * @param {Object} allTasks - Map of all tasks (id -> task)
 * @returns {boolean} - True if task is ready to execute
 */
function isTaskReady(task, allTasks) {
    // Only pending tasks can be ready
    if (task.status !== 'pending') return false;

    const blockedBy = task.blockedBy || [];
    return blockedBy.every(blockingId => {
        const blockingTask = allTasks[blockingId];
        // Task is unblocked if blocker doesn't exist or is completed
        return !blockingTask || blockingTask.status === 'completed';
    });
}

/**
 * Categorize tasks by dependency status
 * @param {Object} tasks - Map of all tasks (id -> task)
 * @param {string|null} filter - Subject filter (e.g., "Implement:")
 * @returns {{ready: string[], pending: string[], completed: string[], blocked: Object}}
 */
function categorizeTasksByDependency(tasks, filter = null) {
    const result = {
        ready: [],
        pending: [],
        completed: [],
        blocked: {}
    };

    for (const [taskId, task] of Object.entries(tasks)) {
        // Apply subject filter
        if (filter && (!task.subject || !task.subject.includes(filter))) continue;

        if (task.status === 'completed') {
            result.completed.push(taskId);
        } else if (isTaskReady(task, tasks)) {
            result.ready.push(taskId);
        } else {
            result.pending.push(taskId);
            // Record unresolved blockers
            const unresolvedBlockers = (task.blockedBy || []).filter(id => {
                const blocker = tasks[id];
                return blocker && blocker.status !== 'completed';
            });
            if (unresolvedBlockers.length > 0) {
                result.blocked[taskId] = unresolvedBlockers;
            }
        }
    }

    return result;
}

/**
 * Main function for CLI execution
 * @param {Object} options - Configuration options
 * @returns {Object} - Categorized tasks result
 */
function main(options = {}) {
    const { ticketId, filter, homeDir } = options;

    if (!ticketId) {
        return { error: 'TICKET_ID is required' };
    }

    if (!homeDir) {
        return { error: 'HOME directory not found' };
    }

    const tasksDir = path.join(homeDir, '.claude', 'tasks', ticketId);
    const loadResult = loadTasks(tasksDir, { includeMetadata: true });

    if (loadResult.error) {
        return { error: loadResult.error };
    }

    const categorized = categorizeTasksByDependency(loadResult.tasks, filter);
    if (loadResult.skippedCount > 0) {
        categorized.skippedCount = loadResult.skippedCount;
    }
    return categorized;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isTaskReady,
        categorizeTasksByDependency,
        main
    };
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const ticketArg = args.find(a => a.startsWith('--ticket='));
    const filterArg = args.find(a => a.startsWith('--filter='));

    const ticketIdFromArg = ticketArg?.split('=')[1];
    const ticketId = (ticketIdFromArg && ticketIdFromArg.trim()) || process.env.CLAUDE_CODE_TASK_LIST_ID;
    const filterFromArg = filterArg?.split('=')[1];
    const filter = (filterFromArg && filterFromArg.trim()) || null;
    const homeDir = process.env.HOME || process.env.USERPROFILE;

    const result = main({ ticketId, filter, homeDir });
    console.log(JSON.stringify(result, null, 2));
}
