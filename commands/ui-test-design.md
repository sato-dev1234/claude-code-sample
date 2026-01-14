---
description: "Generate UI test scenarios and RALPH charts for test design"
allowed-tools: Read, Bash, Task, Glob, Grep, AskUserQuestion, Write
---

# /ui-test-design

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Use AskUserQuestion for scope: uncommitted, branch, or specific range

3. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed files. Return diff and file contents."

4. Launch 2 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - generating-ui-test-scenarios (sonnet)
   - generating-ralph-charts (sonnet)

5. Report in Japanese: output path, generated files, next steps

6. Update <TICKET_PATH>/tasks.md Tasks section: mark test design items as completed based on generated artifacts (ui-test-scenario.md, ralph-chart.md)

7. Read `<TICKET_PATH>/ui-test-scenario.md` and `<TICKET_PATH>/ralph-chart.md` → update `GATHERED_INFO`

8. Self-Refine Loop:

   Copy this checklist and execute each unchecked item in order:

   ```
   - [ ] Review 1
   - [ ] Fix 1 (skip if no issues)
   - [ ] Review 2 (skip if Fix 1 skipped)
   - [ ] Fix 2 (skip if no issues)
   - [ ] Review 3 (skip if Fix 2 skipped)
   - [ ] Fix 3 (skip if no issues)
   ```

   **Review**: Launch 4 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - reviewing-ui-wording (sonnet)
   - reviewing-ui-behavior (sonnet)
   - reviewing-ui-scenario-integration (sonnet)
   - reviewing-ui-coverage (sonnet)

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
   Instructions: "Fix issues with score >= 80. For integration issues: merge scenarios and delete original scenarios as specified in action field. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 7 to update GATHERED_INFO

9. Write report to `<TICKET_PATH>/self-refine-report.md`

10. Report in Japanese: output path, generated files, refinement summary

11. Mark `/ui-test-design` as completed in <TICKET_PATH>/tasks.md Workflow section

