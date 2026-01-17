---
name: create-branch
description: "Git Flow branch creation workflow with worktree support. Creates feature/, release/, hotfix/ branches with automatic worktree setup. Use when creating branches for new work items."
user-invocable: true
allowed-tools: Read, Bash, AskUserQuestion, Grep, Glob
---

## Quick start

```bash
git worktree add ../<branch-name> -b <branch-type>/<branch-name>
```

Branch types: feature/, release/, hotfix/

## Branch creation workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Resolve configuration
- [ ] Step 2: Parse task prompt
- [ ] Step 3: Validate inputs
- [ ] Step 4: Check base branch up-to-date
- [ ] Step 5: Create branch with worktree
- [ ] Step 6: Report results
```

**Step 1: Resolve configuration**

Run: `python ~/.claude/scripts/resolve_config.py "$CWD" creating-branches`
- Parse JSON output -> `CONFIG`
- CONFIG contains: BASE_PATH

**Step 2: Parse task prompt**

Parse from task prompt:
- BRANCH_TYPE: "feature" | "release" | "hotfix" (default: "feature")
- TICKET_ID: Optional ticket ID (e.g., "CCMD-00001")
- BRANCH_NAME: Branch description or ticket title

If TICKET_ID provided:
- Read ticket README.md to get title
- Combine TICKET_ID and title: "{TICKET_ID} {title}"
- Use combined string as BRANCH_NAME
  - Example: "PROJ-00123 Add User Authentication" → "proj-00123-add-user-authentication"

**Step 3: Validate inputs**

Validate:
- BRANCH_TYPE must be one of: feature, release, hotfix
- BRANCH_NAME must not be empty

Convert BRANCH_NAME to kebab-case:
- Use `to_kebab_case()` from claude_utils.py
- Or manually: lowercase, replace spaces/underscores with hyphens, remove non-alphanumeric

Full branch name format: `<BRANCH_TYPE>/<kebab-case-name>`

**Step 4: Check base branch up-to-date**

Detect base branch (develop > main > master) → `BASE_BRANCH`

Fetch and compare commits

If different:
- AskUserQuestion: Update base branch?
  - Yes → Update with pull --ff-only
  - No → Continue

**Step 5: Create branch with worktree**

```bash
PARENT_DIR=$(dirname "$CONFIG.BASE_PATH")
WORKTREE_PATH="$PARENT_DIR/<kebab-case-name>"
git worktree add "$WORKTREE_PATH" -b "<BRANCH_TYPE>/<kebab-case-name>" {BASE_BRANCH}
```

On success:
- Worktree created at: `$PARENT_DIR/<kebab-case-name>`
- Branch created: `<BRANCH_TYPE>/<kebab-case-name>` from `{BASE_BRANCH}`

On failure:
- Display error message
- Common issues: branch already exists, worktree path exists

**Step 6: Report results**

Display summary:
```
Branch created: <BRANCH_TYPE>/<kebab-case-name> (from {BASE_BRANCH})
Worktree path: <absolute-path-to-worktree>
```

Suggest next step: `cd <worktree-path>`
