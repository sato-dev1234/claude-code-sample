---
description: "Self-refine code using reviewing-code skill with auto-fix loop"
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion"
---

# /self-refine

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed files. Return diff and file contents."

4. Self-Refine Loop:

   Copy this checklist and execute each unchecked item in order:

   ```
   - [ ] Review 1
   - [ ] Fix 1 (skip if no issues)
   - [ ] Review 2 (skip if Fix 1 skipped)
   - [ ] Fix 2 (skip if no issues)
   - [ ] Review 3 (skip if Fix 2 skipped)
   - [ ] Fix 3 (skip if no issues)
   ```

   **Review**: Launch 1 agent with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - reviewing-code (sonnet)

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
   Instructions: "Fix issues with score >= 80. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 3 to update GATHERED_INFO

5. Write report to `<TICKET_PATH>/self-refine-report.md`

6. Report summary in Japanese

7. Mark `/self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section
