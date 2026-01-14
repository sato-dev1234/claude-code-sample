---
description: "Self-refine UI test scenarios using knowledge-based review with auto-fix loop"
allowed-tools: "Read, Edit, Bash, Glob, Grep, Task, AskUserQuestion, Write"
---

# /ui-test-self-refine

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read `<TICKET_PATH>/ui-test-scenario.md` and `<TICKET_PATH>/ralph-chart.md` → `GATHERED_INFO`

3. Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" ui-test-self-refine`

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

   **Review**: Launch 4 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - reviewing-ui-wording (sonnet)
   - reviewing-ui-behavior (sonnet)
   - reviewing-ui-scenario-integration (sonnet)
   - reviewing-ui-coverage (sonnet)

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
   Instructions: "Fix issues with score >= 80. For integration issues: merge scenarios and delete original scenarios as specified in action field. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 2 to update GATHERED_INFO

5. Write report to `<TICKET_PATH>/ui-test-self-refine-report.md`

6. Report summary in Japanese

7. Mark `/ui-test-self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section

