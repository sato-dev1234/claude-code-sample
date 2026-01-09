---
description: "Self-refine UI test scenarios using knowledge-based review with auto-fix loop"
allowed-tools: "Read, Edit, Bash, Glob, Grep, Task, AskUserQuestion, Write"
---

# /ui-test-self-refine

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Gather: ui-test-scenario.md + knowledge-refs.md → `GATHERED_INFO`
   - Read TICKET_PATH/ui-test-scenario.md
   - Read TICKET_PATH/knowledge-refs.md

3. Self-Refine Loop:

   Copy this checklist and execute each unchecked item in order:

   ```
   - [ ] Review 1
   - [ ] Investigate 1 (skip if no UNDEFINED findings)
   - [ ] Fix 1 (skip if no issues)
   - [ ] Review 2 (skip if Fix 1 skipped)
   - [ ] Investigate 2 (skip if no UNDEFINED findings)
   - [ ] Fix 2 (skip if no issues)
   - [ ] Review 3 (skip if Fix 2 skipped)
   - [ ] Investigate 3 (skip if no UNDEFINED findings)
   - [ ] Fix 3 (skip if no issues)
   ```

   **Review**:
   - Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" reviewing-ui-test-scenarios`
   - Read ~/.claude/skills/reviewing-ui-test-scenarios/SKILL.md and execute with GATHERED_INFO, TICKET_PATH, and CONFIG

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Investigate**: For findings marked "要調査" (UNDEFINED with score >= 80):
   Launch Explore agents (parallel, max 4) for CSS/Vue/Store/API investigation.
   Collect results → `INVESTIGATION_RESULTS`

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS + INVESTIGATION_RESULTS.
   Instructions: "Fix issues with score >= 80. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 2 to update GATHERED_INFO

4. Final Report in Japanese:
   - Summary: iterations count, total fixes applied
   - Per-iteration details (from each Fix Phase report)
   - Updated files list:
     - TICKET_PATH/ui-test-scenario.md (if modified)
   - Remaining issues

5. Mark `/ui-test-self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section
