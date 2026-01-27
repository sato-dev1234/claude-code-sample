---
name: spec-interview
description: "Interviews user to refine spec using AskUserQuestion"
user-invocable: true
allowed-tools: Read, Write, Task, AskUserQuestion, TaskCreate, TaskList
hooks:
  Stop:
    - hooks:
        - type: command
          command: "bash -c 'node ~/.claude/scripts/task-runner-hook.js'"
---

# /spec-interview

Interviews user to refine specification.

## Progress Checklist

```
- [ ] Step 1: Resolve ticket
- [ ] Step 2: Read requirements.md
- [ ] Step 3: Conduct detailed interview
- [ ] Step 4: Continue interviewing
- [ ] Step 5: Write the spec
- [ ] Step 6: Regenerate knowledge-refs.md
- [ ] Step 7: Report summary in Japanese
- [ ] Step 8: Create /design task
```

## Steps

1. Resolve ticket:
   - If TICKET_ID provided in args → use it
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH

2. Read `<TICKET_PATH>/requirements.md`

3. Conduct detailed interview using AskUserQuestion about:
   technical implementation, UI/UX, concerns, tradeoffs, etc.
   Avoid obvious questions; focus on clarifying ambiguities and edge cases.

4. Continue interviewing in-depth until specification is complete.

5. Write the spec to `<TICKET_PATH>/requirements.md`

6. Regenerate knowledge-refs.md:
   - Extract keywords from updated requirements
   - Read $KNOWLEDGE_DIR/tag-index.json
   - Match keywords against tags
   - Determine workflow sections
   - Generate KNOWLEDGE_REFS_DATA JSON
   - Invoke ticket-writer:
     ```
     OPERATION=add-knowledge-ref
     TICKET_PATH=$TICKET_PATH
     KNOWLEDGE_REFS_DATA=$KNOWLEDGE_REFS_DATA
     ```

7. Report spec-interview summary in Japanese

8. Create /design task:
   - TaskCreate:
     - subject: "Run /design"
     - description: "Generate design document from requirements for ticket $TICKET_ID"
     - activeForm: "Running /design"
     - metadata: {skill: "design", args: "ticket=$TICKET_ID", autoRun: true}
