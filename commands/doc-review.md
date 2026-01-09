---
description: "Review documentation following document-writer principles"
allowed-tools: "Read, Bash, Task, Glob, Grep, AskUserQuestion"
---

# /doc-review

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine target via AskUserQuestion: `markdown file path` or `"キャンセル"`

3. Gather: document content → `GATHERED_INFO`

4. Execute reviewing-documents:
   - Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" reviewing-documents`
   - Read ~/.claude/skills/reviewing-documents/SKILL.md and execute with GATHERED_INFO, TICKET_PATH, and CONFIG

5. Process findings:
   a. Filter: remove findings with score < 80
   b. Group: organize by priority (Critical→Standard→Supplementary)

6. Report summary in Japanese
   - Findings with score >= 80 (grouped by priority)
   - Filtered findings with score < 80 (for reference, collapsed)

7. Mark `/doc-review` as completed in <TICKET_PATH>/tasks.md Workflow section

