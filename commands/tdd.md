---
description: "Execute complete TDD workflow: TDD → self-refine"
allowed-tools: "Read, Write, Edit, Bash, Task, Glob, Grep, AskUserQuestion"
---

# /tdd

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read `<TICKET_PATH>/requirements.md`
   - If not exists → Error: "requirements.md not found at <TICKET_PATH>", END with exit code 1

3. Read `<TICKET_PATH>/design.md`
   - If not exists → Error: "design.md not found at <TICKET_PATH>. Run /design first.", END with exit code 1

4. Format requirements as `REQUIREMENTS`

5. Format design as `DESIGN`

6. Create test list with dependency information from REQUIREMENTS and DESIGN → `TEST_LIST`

7. If test count < 5 → Step 8, else → Step 9

8. Sequential TDD execution:
   - Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" implementing-tdd`
   - Execute implementing-tdd skill with REQUIREMENTS, DESIGN, TICKET_PATH, CONFIG, TEST_LIST
   - Capture: TDD_FILES, TDD_TEST_COUNT
   - Skip to Step 11

9. Group TEST_LIST by dependency into max 5 groups → `GROUPED_TESTS`

10. Parallel TDD execution:
    - For each group: Launch Task agent (general-purpose) to execute implementing-tdd skill with group's TEST_LIST
    - Merge results: TDD_FILES, TDD_TEST_COUNT

11. Update <TICKET_PATH>/tasks.md: mark completed items based on TDD_FILES

12. Determine base branch: `git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'` → `BASE_BRANCH`

13. Launch Explore agent to gather git info → `GATHERED_INFO`
    - "Get git diff with `git diff <BASE_BRANCH>...HEAD`. Read changed files. Return diff and file contents."

14. Self-Refine Loop:

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
    - reviewing-code (sonnet)
    - reviewing-test (sonnet)
    - reviewing-flaky-patterns (sonnet)
    - reviewing-assertion-quality (haiku)

    Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

    **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
    Instructions: "Fix issues with score >= 80. Use ~/.claude/templates/self-refine-report.md"
    After fix: Re-run step 13 to update GATHERED_INFO

    Capture: `REFINE_ITERATIONS`, `REFINE_FIXES`

15. Write report to `<TICKET_PATH>/self-refine-report.md`

16. Mark `/self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section

17. Report summary in Japanese

18. Mark `/tdd` as completed in <TICKET_PATH>/tasks.md Workflow section
