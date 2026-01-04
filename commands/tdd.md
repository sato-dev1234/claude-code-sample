---
description: "Execute complete TDD workflow: TDD → self-refine → test-self-refine"
allowed-tools: "Read, Write, Edit, Bash, Task, Glob, Grep, AskUserQuestion"
---

# /tdd

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read `<TICKET_PATH>/requirements.md` for AC
   - If not exists → Error: "requirements.md not found at <TICKET_PATH>", END with exit code 1

3. Read `<TICKET_PATH>/design.md` for design information
   - If not exists → Error: "design.md not found at <TICKET_PATH>. Run /design first.", END with exit code 1

4. Format requirements as `REQUIREMENTS` variable

5. Format design as `DESIGN` variable

6. Launch agent to implement with TDD:

   Agent 1: implementing-tdd sonnet agent
   Execute Canon TDD workflow (Red-Green-Refactor) with Self-Refine quality improvement. Read ~/.claude/skills/implementing-tdd/SKILL.md and execute with REQUIREMENTS and DESIGN.

   Capture: `TDD_FILES` (files created/modified), `TDD_TEST_COUNT` (test count)

7. Mark `/tdd` as completed in <TICKET_PATH>/tasks.md Workflow section

8. Update <TICKET_PATH>/tasks.md Tasks/Implementation section: mark completed items based on TDD_FILES

9. Determine base branch via git: `git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'` → `BASE_BRANCH`

10. Gather: `git diff <BASE_BRANCH>...HEAD` + changed file contents → `GATHERED_INFO`

11. Self-Refine Loop (Code):

   Copy this checklist and execute each unchecked item in order:

   ```
   - [ ] Review 1
   - [ ] Fix 1 (skip if no issues)
   - [ ] Review 2 (skip if Fix 1 skipped)
   - [ ] Fix 2 (skip if no issues)
   - [ ] Review 3 (skip if Fix 2 skipped)
   - [ ] Fix 3 (skip if no issues)
   ```

   **Review**: Launch 2 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - reviewing-code (sonnet)
   - reviewing-comments (sonnet)

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
   Instructions: "Fix issues with score >= 80. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 10 to update GATHERED_INFO

   Capture: `CODE_REFINE_ITERATIONS`, `CODE_REFINE_FIXES`

12. Write report to `<TICKET_PATH>/self-refine-report.md`:
    - Iterations count, total fixes applied
    - Per-iteration details
    - Remaining issues

13. Mark `/self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section

14. Gather: `git diff <BASE_BRANCH>...HEAD` + changed test file contents → `GATHERED_INFO`
    - Test file patterns: `*Test.kt`, `*Test.java`, `*.spec.ts`, `*.test.ts`, `*_test.go`, `*_test.py`, `test_*.py`

15. Self-Refine Loop (Test):

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
    - reviewing-test (sonnet)
    - reviewing-comments (sonnet)
    - reviewing-flaky-patterns (sonnet)
    - reviewing-assertion-quality (haiku)

    Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

    **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
    Instructions: "Fix issues with score >= 80. Do not fix issues requiring fundamental test design changes or production code changes. Use ~/.claude/templates/self-refine-report.md"
    After fix: Re-run step 14 to update GATHERED_INFO

    Capture: `TEST_REFINE_ITERATIONS`, `TEST_REFINE_FIXES`

16. Write report to `<TICKET_PATH>/test-self-refine-report.md`:
    - Iterations count, total fixes applied
    - Per-iteration details
    - Remaining issues

17. Mark `/test-self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section

18. Report in Japanese with captured variables:

    ```
    ## TDD Complete ワークフロー完了

    ### TDD実装
    - テストリスト: <TDD_TEST_COUNT>個
    - 作成/変更ファイル: <TDD_FILES>

    ### コード品質改善
    - イテレーション数: <CODE_REFINE_ITERATIONS>回
    - 修正された問題: <CODE_REFINE_FIXES>件

    ### テスト品質改善
    - イテレーション数: <TEST_REFINE_ITERATIONS>回
    - 修正された問題: <TEST_REFINE_FIXES>件

    詳細レポート:
    - <TICKET_PATH>/self-refine-report.md
    - <TICKET_PATH>/test-self-refine-report.md
    ```

19. Mark `/tdd` as completed in <TICKET_PATH>/tasks.md Workflow section
