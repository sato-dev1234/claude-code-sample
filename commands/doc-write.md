---
description: "Create technical documentation following 14 principles"
allowed-tools: "Read, Write, Edit, Bash, Task, Glob, Grep, AskUserQuestion"
---

# /doc-write

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Gather: diff + changed file contents → `GATHERED_INFO`

4. Detect documentation destination from project structure (e.g., `docs/`, `README.md`). If unknown, ask user.

5. Execute writing-documents:
   - Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" writing-documents`
   - Read ~/.claude/skills/writing-documents/SKILL.md and execute with GATHERED_INFO, TICKET_PATH, and CONFIG

6. Report summary in Japanese: created files, principles applied, any issues found

7. Mark `/doc-write` as completed in <TICKET_PATH>/tasks.md Workflow section

