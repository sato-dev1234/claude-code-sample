---
description: "Review comments using reviewing-comments skill"
allowed-tools: "Read, Write, Bash, Task, Glob, Grep, AskUserQuestion"
---

# /comment-review

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Use gathering-git-info skill → `GATHERED_INFO`
   - No file filtering (all changed files are reviewed)

4. Execute reviewing-comments:
   - Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" reviewing-comments`
   - Read ~/.claude/skills/reviewing-comments/SKILL.md and execute with GATHERED_INFO, TICKET_PATH, and CONFIG

5. Write report to `<TICKET_PATH>/comment-review-report.md`

   Format (numbered list, sorted by score descending):
   ```markdown
   # Comment Review Report

   Found X issues:

   1. [Score: 95] Description
      file:line

   2. [Score: 75] Description
      file:line

   3. [Score: 60] Description
      file:line
   ```

   If no issues found (X = 0):
   ```markdown
   # Comment Review Report

   問題なし - コメント品質に関する問題は検出されませんでした。
   ```

6. Report summary in Japanese
   - All findings sorted by score (high to low)

7. Mark `/comment-review` as completed in <TICKET_PATH>/tasks.md Workflow section
