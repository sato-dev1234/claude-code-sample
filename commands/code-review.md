---
description: "Code review using reviewing-code skill"
allowed-tools: "Read, Write, Bash, Glob, Grep, AskUserQuestion"
---

# /code-review

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Use gathering-git-info skill → `GATHERED_INFO`

4. Execute reviewing-code:
   - Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" reviewing-code`
   - Read ~/.claude/skills/reviewing-code/SKILL.md and execute with GATHERED_INFO, TICKET_PATH, and CONFIG

5. Process findings:
   a. Filter: remove findings with score < 80

6. Write report to `<TICKET_PATH>/code-review-report.md`

   Format (numbered list):
   ```markdown
   # Code Review Report

   Found X issues:

   1. [Score: 95] Description
      file:line

   2. [Score: 82] Description
      file:line

   ---

   ## Filtered findings (score < 80)

   <details>
   <summary>N findings below threshold</summary>

   1. [Score: 75] Description
      file:line

   </details>
   ```

7. Report summary in Japanese
   - Findings with score >= 80
   - Filtered findings with score < 80 (for reference, collapsed)

8. Mark `/code-review` as completed in <TICKET_PATH>/tasks.md Workflow section
