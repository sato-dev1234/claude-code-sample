---
name: tdd
description: "Execute complete TDD workflow: TDD → self-refine"
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Task, Glob, Grep, AskUserQuestion
---

# /tdd

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read `<TICKET_PATH>/requirements.md`
   - If not exists → Error: "requirements.md not found at <TICKET_PATH>", END with exit code 1

3. Read `<TICKET_PATH>/design.md`
   - If not exists → Error: "design.md not found at <TICKET_PATH>. Run /design first.", END with exit code 1

4. Format requirements as `REQUIREMENTS`

5. Format design as `DESIGN`

6. Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" tdd`

7. Execute TDD workflow (see below) with REQUIREMENTS, DESIGN, TICKET_PATH, CONFIG
   - Capture: TDD_FILES, TDD_TEST_COUNT

8. Update <TICKET_PATH>/tasks.md: mark completed items based on TDD_FILES

9. Determine base branch: `git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'` → `BASE_BRANCH`

10. Launch Explore agent to gather git info → `GATHERED_INFO`
    - "Get git diff with `git diff <BASE_BRANCH>...HEAD`. Read changed files. Return diff and file contents."

11. Self-Refine Loop:

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
    - code-review (sonnet)
    - test-review (sonnet)

    Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

    **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
    Instructions: "Fix issues with score >= 80. Use ~/.claude/templates/self-refine-report.md"
    After fix: Re-run step 10 to update GATHERED_INFO

    Capture: `REFINE_ITERATIONS`, `REFINE_FIXES`

12. Write report to `<TICKET_PATH>/self-refine-report.md`

13. Mark `/self-refine` as completed in <TICKET_PATH>/tasks.md Workflow section

14. Report summary in Japanese

15. Mark `/tdd` as completed in <TICKET_PATH>/tasks.md Workflow section

---

## TDD workflow

### Quick start

RED-GREEN-REFACTOR cycle:
```
1. RED: Write failing test → verify it fails
2. GREEN: Implement minimal code → verify test passes
3. REFACTOR: Improve code → verify tests still pass
```

Run tests:
```bash
npm test  # or pytest, gradle test, etc.
```

### Workflow

```
Progress:
- [ ] Step 1: Load project knowledge
- [ ] Step 2: Create test list
- [ ] Step 3: Execute RED-GREEN-REFACTOR cycle
- [ ] Step 4: Generate completion report
```

**Step 1: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/tdd" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for Troubleshooting section
- On failure: continue without knowledge

**Step 2: Create test list**

Create test list from REQUIREMENTS and DESIGN, ordered simple to complex.

### Implementation principles

Before starting RED-GREEN-REFACTOR cycle, internalize these principles:

- **WHY-first comments**: Write reasons (business constraints, security requirements), not HOW
- **Declarative comments**: Avoid conversational tone in comments, state facts
- **Input validation first**: For functions receiving external input, implement validation first

**Step 3: Execute RED-GREEN-REFACTOR cycle**

Execute RED-GREEN-REFACTOR cycle for each test item:
- RED: Write failing test
- GREEN: Verify failure, implement minimal code
- REFACTOR: If needed, improve code

Apply implementation principles during GREEN and REFACTOR phases.

**Step 4: Generate completion report**

Generate completion report with test list status and implementation summary.
