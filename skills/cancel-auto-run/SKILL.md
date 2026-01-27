---
name: cancel-auto-run
description: "Cancels automatic task execution"
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Bash
---

# /cancel-auto-run

Cancel automatic task execution.

## Progress Checklist

```
- [ ] Step 1: Check state file
- [ ] Step 2: Delete state directory
- [ ] Step 3: Output
```

## Steps

1. Check state file:
   - If `.claude/auto-run/state.local.md` does not exist → "Auto-run is not active."

2. Delete state directory:
   ```bash
   rm -rf .claude/auto-run/
   ```

3. Output: "Auto-run cancelled."
