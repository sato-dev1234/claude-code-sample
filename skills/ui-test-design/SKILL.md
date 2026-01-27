---
name: ui-test-design
description: "Generates UI test scenarios and RALPH charts for test design"
user-invocable: true
allowed-tools: Read, Bash, Task, Skill, Glob, Grep, AskUserQuestion, Write, Edit
hooks:
  Stop:
    - hooks:
        - type: command
          command: "bash -c 'node ~/.claude/scripts/task-runner-hook.js'"
---

# /ui-test-design

Generates UI test scenarios and RALPH charts for test design.

## Progress Checklist

```
- [ ] Step 1: Parse args
- [ ] Step 2: Resolve ticket
- [ ] Step 3: Load project knowledge
- [ ] Step 4: Read templates
- [ ] Step 5: Launch Explore agent
- [ ] Step 6: Launch generators in parallel
- [ ] Step 7: Report in Japanese
- [ ] Step 8: Invoke /refine-loop
```

## Steps

1. Parse args: `iterations=N` → MAX_ITERATIONS (default: 10)

2. Resolve ticket:
   - If TICKET_ID provided in args → use it
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH

3. Load project knowledge:
   - Invoke knowledge-reader agent: `OPERATION=resolve TICKET_PATH=$TICKET_PATH WORKFLOW=/ui-test-design`
   - If KNOWLEDGE_ERROR=true → KNOWLEDGE = []
   - If KNOWLEDGE_STATUS=empty → KNOWLEDGE = []
   - Otherwise → KNOWLEDGE = parsed knowledge array

4. Read templates:
   - SCENARIO_TEMPLATE = Read ./templates/scenario-template.md
   - DESIGN_TEMPLATE = Read ./templates/design-template.md
   - RALPH_TEMPLATE = Read ./templates/ralph-chart-template.md

5. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (uncommitted changes). Read changed files. Return diff and file contents."

6. Launch 2 agents in parallel:
   - ui-scenario-generator agent: `TICKET_PATH=$TICKET_PATH GATHERED_INFO=$GATHERED_INFO KNOWLEDGE=$KNOWLEDGE SCENARIO_TEMPLATE=$SCENARIO_TEMPLATE DESIGN_TEMPLATE=$DESIGN_TEMPLATE`
   - ralph-chart-generator agent: `TICKET_PATH=$TICKET_PATH GATHERED_INFO=$GATHERED_INFO KNOWLEDGE=$KNOWLEDGE RALPH_TEMPLATE=$RALPH_TEMPLATE`

7. Report in Japanese: output path, generated files, next steps

8. Invoke `/refine-loop type=ui-tests ticket={TICKET_PATH} iterations={MAX_ITERATIONS}`
