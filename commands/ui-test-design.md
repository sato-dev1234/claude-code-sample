---
description: "Generate UI test scenarios and RALPH charts for test design"
allowed-tools: Read, Bash, Task, Glob, Grep, AskUserQuestion, Write
---

# /ui-test-design

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Use AskUserQuestion for scope: uncommitted, branch, or specific range

3. Gather: diff + changed file contents → `GATHERED_INFO`

4. Launch 2 agents in parallel:

   Agent 1: generating-ui-test-scenarios sonnet agent
   Read ~/.claude/skills/generating-ui-test-scenarios/SKILL.md and execute with GATHERED_INFO, output_path=TICKET_PATH.

   Agent 2: generating-ralph-charts sonnet agent
   Read ~/.claude/skills/generating-ralph-charts/SKILL.md and execute with GATHERED_INFO, output_path=TICKET_PATH.

5. Report in Japanese: output path, generated files, next steps

6. Mark `/ui-test-design` as completed in <TICKET_PATH>/tasks.md Workflow section

7. Update <TICKET_PATH>/tasks.md Tasks section: mark test design items as completed based on generated artifacts (ui-test-scenario.md, ralph-chart.md)
