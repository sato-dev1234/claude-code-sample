---
name: cancel-refine-loop
description: "Cancels active refine loops by removing state files from .claude/refine-loop/ directories. Use when you need to stop a running quality improvement cycle."
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash, AskUserQuestion
---

# /cancel-refine-loop

Cancel an active refine loop.

## Progress Checklist

```
- [ ] Step 1: Check for active refine loops
- [ ] Step 2: List active types
- [ ] Step 3: Handle no active loops
- [ ] Step 4: Handle active loops found
- [ ] Step 5: Cancel selected types
```

## Steps

1. Check for active refine loops in `.claude/refine-loop/` subdirectories

2. List active types by checking for `state.local.md` in each subdirectory:
   - `code/state.local.md` → Code refine loop active
   - `tests/state.local.md` → Tests refine loop active
   - `ui-tests/state.local.md` → UI Tests refine loop active
   - `skills/state.local.md` → Skills refine loop active

3. If no active loops found:
   - Output: "No active refine loop"

4. If active loops found:
   - List active types to user
   - Ask: "Cancel all or select specific type?" via AskUserQuestion
     - All → Remove all active type directories
     - Specific → Let user select which type(s) to cancel

5. For each cancelled type:
   - Remove directory: `rm -rf .claude/refine-loop/{type}/`
   - Output: "{type} refine loop cancelled"
