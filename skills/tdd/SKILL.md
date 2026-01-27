---
name: tdd
description: "Executes complete TDD workflow: parallel TDD → refine-loop"
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Task, Skill, Glob, Grep, TaskList, TaskGet, TaskUpdate, TaskOutput
hooks:
  Stop:
    - hooks:
        - type: command
          command: "bash -c 'node ~/.claude/scripts/task-runner-hook.js'"
---

# /tdd

Orchestrator for TDD workflow with parallel execution.

## Progress Checklist

```
- [ ] Step 1: Parse args and set variables
- [ ] Step 2: Invoke ticket-reader agent
- [ ] Step 3: Validate design exists
- [ ] Step 4: Invoke knowledge-reader agent
- [ ] Step 5: Execute TDD with parallel orchestration
- [ ] Step 6: Invoke /refine-loop (if no errors)
- [ ] Step 7: Generate report
```

## Steps

1. Parse args and set variables:
   - `ticket` → TICKET_ID (required, error if not provided)
   - `iterations` → MAX_ITERATIONS (default: 10)

2. Invoke ticket-reader agent:
   - Task prompt: `OPERATION=get TICKET_ID=$TICKET_ID`
   - If error → END
   - Parse output → TICKET_PATH

3. Validate design exists:
   - Check if <TICKET_PATH>/design.md exists
   - If not → Error: "design.md not found. Run /design first.", END

4. Invoke knowledge-reader agent:
   - Task prompt: `OPERATION=resolve TICKET_PATH=$TICKET_PATH WORKFLOW=/tdd`
   - Parse output → KNOWLEDGE (empty array if error)

5. Execute TDD with parallel orchestration:

   a. Get ready tasks:
      - Run `node ~/.claude/scripts/resolve-task-dependencies.js --ticket=$TICKET_ID --filter="Implement:"`
      - If no tasks → Error: "No implementation tasks found", END

   b. For each ready task:
      - TaskGet(task_id) to get task details
      - TaskUpdate(task_id, status="in_progress")
      - Launch tdd-runner with Task tool:
        - subagent_type: tdd-runner
        - run_in_background: true
        - prompt includes: TASK_SUBJECT, TASK_DESCRIPTION, KNOWLEDGE, CWD

   c. Monitor and iterate:
      - Use TaskOutput to check completion
      - On completion: TaskUpdate(task_id, status="completed")
      - Refresh dependencies, launch newly ready tasks
      - Repeat until all complete

   d. Collect results: TDD_FILES, TDD_TEST_COUNT, TDD_PASSED_COUNT

6. Invoke /refine-loop (if no TDD errors):
   - Args: "type=code-tests ticket={TICKET_PATH} scope=uncommitted iterations={MAX_ITERATIONS}"

7. Generate report:
   - Write to <TICKET_PATH>/tdd-report.md
