---
description: "Parallel test code review using 3 specialized skills"
allowed-tools: "Read, Write, Bash, Task, Glob, Grep, AskUserQuestion"
---

# /test-review

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Determine test file filter via AskUserQuestion: e.g., `*Test.kt`, `*.spec.ts`, `*_test.py`

4. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed test files matching filter from Step 3. Return diff and file contents."

5. Launch 3 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - reviewing-test (sonnet)
   - reviewing-flaky-patterns (sonnet)
   - reviewing-assertion-quality (haiku)

   Return findings with confidence scores (0-100) with file:line references.

6. Process findings:
   a. Collect: gather results from all agents
   b. Deduplicate: merge by file:line, keep highest score
   c. Filter: remove findings with score < 80

7. Write report to `<TICKET_PATH>/test-review-report.md`

   Format (numbered list, grouped by skill):
   ```markdown
   # Test Review Report

   ## reviewing-test

   Found X issues:

   1. [Score: 95] Description
      file:line

   2. [Score: 82] Description
      file:line

   ## reviewing-flaky-patterns

   Found Y issues:

   1. [Score: 88] Description
      file:line

   ## reviewing-assertion-quality

   Found Z issues:

   1. [Score: 85] Description
      file:line

   ---

   ## Filtered findings (score < 80)

   <details>
   <summary>N findings below threshold</summary>

   1. [Score: 75] Description
      file:line

   </details>
   ```

8. Report summary in Japanese
   - Findings with score >= 80 (grouped by skill)
   - Filtered findings with score < 80 (for reference, collapsed)

9. Mark `/test-review` as completed in <TICKET_PATH>/tasks.md Workflow section
