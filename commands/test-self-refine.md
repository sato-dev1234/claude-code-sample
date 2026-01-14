---
description: "Self-refine test code using existing review skills with auto-fix loop"
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion"
---

# /test-self-refine

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Determine test file filter via AskUserQuestion: e.g., `*Test.kt`, `*.spec.ts`, `*_test.py`

4. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed test files matching filter from Step 3. Return diff and file contents."

5. Self-Refine Loop:

   Copy this checklist and execute each unchecked item in order:

   ```
   - [ ] Review 1
   - [ ] Fix 1 (skip if no issues)
   - [ ] Review 2 (skip if Fix 1 skipped)
   - [ ] Fix 2 (skip if no issues)
   - [ ] Review 3 (skip if Fix 2 skipped)
   - [ ] Fix 3 (skip if no issues)
   ```

   **Review**: Launch 3 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - reviewing-test (sonnet)
   - reviewing-flaky-patterns (sonnet)
   - reviewing-assertion-quality (haiku)

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
   Instructions: "Fix issues with score >= 80. Do not fix issues requiring fundamental test design changes or production code changes. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 4 to update GATHERED_INFO

6. Write report to `<TICKET_PATH>/test-self-refine-report.md`

7. Report summary in Japanese

8. Mark `/test-self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section
