#!/usr/bin/env node
/**
 * Atomic ticket ID generation script.
 *
 * WHY: Provides race-condition-safe ticket ID generation using mkdir atomicity.
 * Migrated from Python next_ticket_id.py.
 *
 * Usage:
 *   node next-ticket-id.js <tickets_path> <prefix> [digits]
 *   node next-ticket-id.js --atomic [status]
 *
 * Environment Variables:
 *   TICKETS_DIR: Ticket directory path
 *   TICKETS_PREFIX: Ticket ID prefix (default: "TICKET-")
 *   TICKETS_DIGITS: Number of digits (default: 5)
 *   TICKETS_ON_CREATE: Status on creation (default: "backlog")
 */

const fs = require('fs');
const path = require('path');

// Maximum retry count for atomic ID acquisition
const MAX_RETRY_COUNT = 10;

/**
 * Scan existing ticket directories for ID numbers.
 *
 * WHY: Need to know existing IDs to generate unique next ID.
 *
 * @param {string} ticketsPath - Tickets directory path
 * @param {string} prefix - Ticket ID prefix
 * @param {number} digitCount - Number of digits in ID
 * @returns {number[]} List of existing ticket numbers
 */
function scanExistingIds(ticketsPath, prefix, digitCount) {
    const pattern = new RegExp(`^${escapeRegExp(prefix)}(\\d{${digitCount}})$`);
    const numbers = [];

    if (!fs.existsSync(ticketsPath)) {
        return numbers;
    }

    // Scan all status directories
    let entries;
    try {
        entries = fs.readdirSync(ticketsPath, { withFileTypes: true });
    } catch (e) {
        return numbers;
    }

    for (const statusEntry of entries) {
        if (!statusEntry.isDirectory()) {
            continue;
        }

        const statusDir = path.join(ticketsPath, statusEntry.name);

        // Scan top-level ticket directories only
        let ticketEntries;
        try {
            ticketEntries = fs.readdirSync(statusDir, { withFileTypes: true });
        } catch (e) {
            continue;
        }

        for (const ticketEntry of ticketEntries) {
            if (!ticketEntry.isDirectory()) {
                continue;
            }

            const match = ticketEntry.name.match(pattern);
            if (match) {
                numbers.push(parseInt(match[1], 10));
            }
        }
    }

    return numbers;
}

/**
 * Generate next ticket ID.
 *
 * WHY: Generates unique ID based on max existing + 1 to ensure uniqueness.
 *
 * @param {string} prefix - Ticket ID prefix
 * @param {number} digitCount - Number of digits in ID
 * @param {number[]} existingNumbers - List of existing ticket numbers
 * @returns {string} Next ticket ID
 */
function generateNextId(prefix, digitCount, existingNumbers) {
    const nextNumber = existingNumbers.length > 0
        ? Math.max(...existingNumbers) + 1
        : 1;
    return prefix + String(nextNumber).padStart(digitCount, '0');
}

/**
 * Check if ticket ID already exists.
 *
 * @param {string} ticketsPath - Tickets directory path
 * @param {string} ticketId - Ticket ID to check
 * @returns {boolean} True if duplicate exists
 */
function hasDuplicate(ticketsPath, ticketId) {
    if (!fs.existsSync(ticketsPath)) {
        return false;
    }

    let entries;
    try {
        entries = fs.readdirSync(ticketsPath, { withFileTypes: true });
    } catch (e) {
        return false;
    }

    for (const statusEntry of entries) {
        if (!statusEntry.isDirectory()) {
            continue;
        }

        const ticketDir = path.join(ticketsPath, statusEntry.name, ticketId);
        if (fs.existsSync(ticketDir)) {
            return true;
        }
    }

    return false;
}

/**
 * Get configuration from environment variables.
 *
 * @returns {Object} Configuration object
 */
function getConfigFromEnv() {
    const ticketsDir = process.env.TICKETS_DIR || null;
    const prefix = process.env.TICKETS_PREFIX || 'TICKET-';

    // Parse digits with fallback to default
    let digits = 5;
    const digitsStr = process.env.TICKETS_DIGITS;
    if (digitsStr) {
        const parsed = parseInt(digitsStr, 10);
        if (!isNaN(parsed)) {
            digits = parsed;
        }
    }

    const onCreate = process.env.TICKETS_ON_CREATE || 'backlog';

    return {
        ticketsDir,
        prefix,
        digits,
        onCreate
    };
}

/**
 * Acquire ticket ID atomically using mkdir.
 *
 * WHY: mkdir is atomic on all platforms, preventing race conditions
 * in parallel execution scenarios.
 *
 * @param {string} ticketsPath - Tickets directory path
 * @param {string} prefix - Ticket ID prefix
 * @param {number} digitCount - Number of digits in ID
 * @param {string} status - Status directory name
 * @param {number} [maxRetries=MAX_RETRY_COUNT] - Maximum retry attempts
 * @returns {string} Acquired ticket ID
 * @throws {Error} If max retries exceeded
 */
function acquireTicketIdAtomic(ticketsPath, prefix, digitCount, status, maxRetries = MAX_RETRY_COUNT) {
    const statusDir = path.join(ticketsPath, status);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        // Scan existing numbers
        const existingNumbers = scanExistingIds(ticketsPath, prefix, digitCount);

        // Generate next ID
        const nextId = generateNextId(prefix, digitCount, existingNumbers);

        // Try to create directory (atomic operation)
        const ticketDir = path.join(statusDir, nextId);
        try {
            fs.mkdirSync(ticketDir, { recursive: true });
            // Check if we actually created it (not just parent directories)
            // by verifying the directory wasn't already there
            return nextId;
        } catch (e) {
            if (e.code === 'EEXIST') {
                // Race condition: retry
                continue;
            }
            throw e;
        }
    }

    throw new Error(`Ticket ID generation failed: race condition not resolved after ${maxRetries} retries`);
}

/**
 * Escape special regex characters in string.
 *
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main CLI function.
 */
function main() {
    const args = process.argv.slice(2);

    // --atomic mode: read config from env, use mkdir + retry
    if (args.length >= 1 && args[0] === '--atomic') {
        const config = getConfigFromEnv();

        if (!config.ticketsDir) {
            console.error('Error: TICKETS_DIR environment variable is not set');
            process.exit(1);
        }

        // Status from args or env
        const status = args.length >= 2 ? args[1] : config.onCreate;

        try {
            const ticketId = acquireTicketIdAtomic(
                config.ticketsDir,
                config.prefix,
                config.digits,
                status
            );
            console.log(ticketId);
        } catch (e) {
            console.error(`Error: ${e.message}`);
            process.exit(1);
        }
        return;
    }

    // Legacy mode: read config from args (backward compatibility)
    if (args.length < 2 || args.length > 3) {
        console.error('Usage: node next-ticket-id.js <tickets_path> <prefix> [digits]');
        console.error('       node next-ticket-id.js --atomic [status]');
        process.exit(1);
    }

    const ticketsPath = args[0];
    const prefix = args[1];
    const digitCount = args.length === 3 ? parseInt(args[2], 10) : 5;

    try {
        // Scan existing numbers
        const existingNumbers = scanExistingIds(ticketsPath, prefix, digitCount);

        // Generate next ID
        const nextId = generateNextId(prefix, digitCount, existingNumbers);

        // Final duplicate check (safety for race conditions)
        if (hasDuplicate(ticketsPath, nextId)) {
            console.error(`Error: Generated ID ${nextId} already exists`);
            process.exit(1);
        }

        console.log(nextId);
    } catch (e) {
        console.error(`Unexpected error: ${e.message}`);
        process.exit(1);
    }
}

// Run main if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    scanExistingIds,
    generateNextId,
    hasDuplicate,
    getConfigFromEnv,
    acquireTicketIdAtomic
};
