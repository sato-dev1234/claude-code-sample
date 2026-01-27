---
name: create-branch
description: "Git Flow branch creation workflow with worktree support. Creates feature/, release/, hotfix/ branches with automatic worktree setup for new work items."
user-invocable: true
allowed-tools: Read, Bash, Task, AskUserQuestion, Grep, Glob
---

# /create-branch

Git Flow branch creation workflow with worktree support.

## Quick Reference

```bash
gwq add -b <branch-type>/<branch-name>
```

Branch types: feature/, release/, hotfix/

**Prerequisite**: gwq must be installed. See `docs/prerequisites.md`.

## Progress Checklist

```
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Validate inputs
- [ ] Step 3: Check base branch up-to-date
- [ ] Step 4: Create branch with worktree
- [ ] Step 5: Copy configuration files
- [ ] Step 6: Move ticket to started status
- [ ] Step 7: Report results
```

## Steps

1. Parse task prompt:
   - BRANCH_TYPE: "feature" | "release" | "hotfix" (default: "feature")
   - TICKET_ID: Optional ticket ID (e.g., "CCMD-00001")
   - BRANCH_NAME: Branch description or ticket title
   - If TICKET_ID provided:
     - Read ticket README.md to get title
     - Combine TICKET_ID and title: "{TICKET_ID} {title}"
     - Use combined string as BRANCH_NAME
     - Example: "PROJ-00123 Add User Authentication" → "proj-00123-add-user-authentication"

2. Validate inputs:
   - BRANCH_TYPE must be one of: feature, release, hotfix
   - BRANCH_NAME must not be empty
   - Convert BRANCH_NAME to kebab-case:
     - Lowercase, replace spaces/underscores with hyphens, remove non-alphanumeric
   - Full branch name format: `<BRANCH_TYPE>/<kebab-case-name>`

3. Check base branch up-to-date:
   - Detect base branch (develop > main > master) → `BASE_BRANCH`
   - Fetch and compare commits
   - If different:
     - AskUserQuestion: Update base branch?
       - Yes → Update with pull --ff-only
       - No → Continue

4. Create branch with worktree:
   - Checkout base branch and create worktree in a single command (required due to Bash tool's stateless nature):
     ```bash
     git checkout {BASE_BRANCH} && gwq add -b "<BRANCH_TYPE>/<kebab-case-name>"
     ```
   - gwq automatically:
     - Uses configured worktree root directory
     - Creates worktree with consistent naming
   - On success:
     - Worktree created (location shown in gwq output)
     - Branch created: `<BRANCH_TYPE>/<kebab-case-name>` from current branch
   - On failure:
     - Display error message
     - Common issues: branch already exists, worktree path exists

5. Copy configuration files to new worktree:
   - Copy from current worktree to new worktree:
     - `.claude/settings.local.json`
   - Skip if source missing or target exists
   - On error: warn and continue

6. Move ticket to started status (if TICKET_ID provided):
   - Invoke ticket-writer agent:
     ```
     OPERATION=start
     TICKET_ID=$TICKET_ID
     ```
   - If TICKET_STARTED=true: display "Ticket moved to in-progress"
   - If TICKET_ERROR=true: display warning, continue
   - If TICKET_ID not provided: skip this step

7. Report results:
   - Display summary:
     ```
     Branch created: <BRANCH_TYPE>/<kebab-case-name>
     Worktree path: <path-shown-in-gwq-output>

     To work in this worktree:
     1. In your terminal: cd <worktree-path>
     2. Or start a new Claude Code session in that directory
     ```
