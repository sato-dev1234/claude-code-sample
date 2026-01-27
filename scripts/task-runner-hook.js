#!/usr/bin/env node

/**
 * task-runner Stop Hook
 *
 * Reads task files directly from ~/.claude/tasks/${TICKET_ID}/
 * and checks for autoRun tasks that meet execution conditions.
 *
 * Execution conditions:
 * - status: pending
 * - metadata.autoRun: true
 * - blockedBy is empty OR all blockedBy tasks are completed
 *
 * Uses lock file to prevent infinite loops (60 second cooldown)
 */

const fs = require('fs');
const path = require('path');
const { loadTasks } = require('./task-utils.js');

/**
 * Check if a task is executable based on autoRun conditions
 * @param {Object} task - The task object
 * @param {Object} allTasks - Map of all tasks by ID
 * @returns {boolean} - True if the task should be executed
 */
function isTaskExecutable(task, allTasks) {
    // Condition 1: status must be pending
    if (task.status !== 'pending') return false;

    // Condition 2: metadata.autoRun must be true
    if (!task.metadata || task.metadata.autoRun !== true) return false;

    // Condition 3: blockedBy must be empty or all completed
    const blockedBy = task.blockedBy || [];
    return blockedBy.every(blockingId => {
        const blockingTask = allTasks[blockingId];
        // If task doesn't exist or is completed, it's resolved
        return !blockingTask || blockingTask.status === 'completed';
    });
}

/**
 * Find executable tasks from a list of tasks
 * @param {Object} tasks - Map of tasks by ID
 * @returns {Array} - Array of executable task IDs
 */
function findExecutableTasks(tasks) {
    const executable = [];
    for (const taskId of Object.keys(tasks)) {
        if (isTaskExecutable(tasks[taskId], tasks)) {
            executable.push(taskId);
        }
    }
    return executable;
}

/**
 * Check if lock file is recent (within cooldown period)
 * @param {string} lockFile - Path to lock file
 * @param {number} cooldownSeconds - Cooldown period in seconds
 * @returns {boolean} - True if lock is recent
 */
function isLockRecent(lockFile, cooldownSeconds = 60) {
    if (!fs.existsSync(lockFile)) return false;
    try {
        const stats = fs.statSync(lockFile);
        const lockAge = (Date.now() - stats.mtimeMs) / 1000;
        return lockAge < cooldownSeconds;
    } catch (e) {
        return false;
    }
}

/**
 * Main hook logic
 * @param {Object} options - Configuration options
 * @param {string} options.ticketId - Ticket ID
 * @param {string} options.homeDir - Home directory path
 * @param {string} options.cwd - Current working directory
 * @returns {Object|null} - Response object or null if no action needed
 */
function runHook(options) {
    const { ticketId, homeDir, cwd } = options;

    if (!ticketId) return null;

    // Lock file to prevent infinite loops
    const lockDir = path.join(cwd, '.claude');
    const lockFile = path.join(lockDir, 'task-runner.lock');

    if (isLockRecent(lockFile)) {
        return null;
    }

    if (!homeDir) return null;

    const tasksDir = path.join(homeDir, '.claude', 'tasks', ticketId);
    const tasks = loadTasks(tasksDir);

    if (Object.keys(tasks).length === 0) return null;

    const executableTasks = findExecutableTasks(tasks);

    if (executableTasks.length === 0) return null;

    // Create lock file
    try {
        if (!fs.existsSync(lockDir)) {
            fs.mkdirSync(lockDir, { recursive: true });
        }
        fs.writeFileSync(lockFile, '', 'utf8');
    } catch (e) {
        // Ignore lock file errors
    }

    return {
        decision: "block",
        reason: "TaskListを確認し、autoRun条件（pending, autoRun:true, blockedBy解消）を満たすタスクがあれば実行してください。該当なしなら報告不要で終了。",
        systemMessage: "task-runner: autoRunタスク検出"
    };
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isTaskExecutable,
        findExecutableTasks,
        isLockRecent,
        runHook
    };
}

// Main execution when run directly
if (require.main === module) {
    // Read hook input from stdin synchronously
    try {
        const BUFSIZE = 256;
        const buf = Buffer.alloc(BUFSIZE);
        try {
            while (fs.readSync(0, buf, 0, BUFSIZE) > 0) {
                // Consume stdin but don't use it
            }
        } catch (e) {
            // EOF or error
        }
    } catch (e) {
        // Ignore stdin errors
    }

    const result = runHook({
        ticketId: process.env.CLAUDE_CODE_TASK_LIST_ID,
        homeDir: process.env.HOME || process.env.USERPROFILE,
        cwd: process.cwd()
    });

    if (result) {
        console.log(JSON.stringify(result));
    }
    process.exit(0);
}
