---
name: refine-loop
description: "Runs a review + fix loop that continues until ISSUE_COUNT = 0 or max iterations for iterative code quality improvements."
user-invocable: true
allowed-tools: Bash, Write, Read, AskUserQuestion, Skill, Task
hooks:
  Stop:
    - hooks:
        - type: command
          command: "bash -c 'node ~/.claude/scripts/refine-loop-hook.js'"
---

# /refine-loop

Start a review + fix loop that continues until ISSUE_COUNT = 0 or max iterations.

## Progress Checklist

```
- [ ] Step 1: Parse args and set variables
- [ ] Step 2: Collect type-specific context
- [ ] Step 3: Determine type directory name
- [ ] Step 4: Save context
- [ ] Step 5: Create state file
- [ ] Step 6: Execute the loop
```

## Steps

1. Parse args and set variables:
   - `type=code` → set type to code
   - `type=tests` → set type to tests
   - `type=code-tests` → set type to code-tests
   - `type=ui-tests` → set type to ui-tests
   - `type=docs` → set type to docs
   - `type=ac` → set type to ac
   - `iterations=N` → MAX_ITERATIONS = N (default: 10)
   - `scope` → use provided value, skip corresponding question in Step 2
   - `ticket` → use provided value, skip ticket selection in Step 2
   - `file` → use provided value, skip file path question in Step 2 (docs mode)

   If type not specified, ask user to select type via AskUserQuestion:

   | Option | Agent | Description |
   |--------|-------|-------------|
   | code | code-reviewer/fixer + security-reviewer/fixer | コード + セキュリティレビュー（並列） |
   | tests | tests-reviewer/fixer | テストコードレビュー + 修正 |
   | docs | document-reviewer/fixer | ドキュメントレビュー + 修正 |
   | ac | ac-reviewer | ACレビュー（レポートのみ、修正なし） |

2. Collect type-specific context:

   **If code selected:**
   - Resolve ticket:
     - If `ticket` arg provided → TICKET_PATH = ticket value
     - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH
   - "スコープは？" → Uncommitted / Branch
     - Uncommitted → `SCOPE` = "uncommitted"
     - Branch → `SCOPE` = "branch"

   **If tests selected:**
   - Resolve ticket:
     - If `ticket` arg provided → TICKET_PATH = ticket value
     - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH
   - "スコープは？" → Uncommitted / Branch
     - Uncommitted → `SCOPE` = "uncommitted"
     - Branch → `SCOPE` = "branch"
   - If $TEST_FILTER is empty or "<test-filter>": Error "Run /init-project first to configure test filter"

   **If code-tests type (from args):**
   - If `ticket` arg provided → `TICKET_PATH` = ticket value
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH
   - "スコープは？" → Uncommitted / Branch
     - Uncommitted → `SCOPE` = "uncommitted"
     - Branch → `SCOPE` = "branch"
   - If $TEST_FILTER is empty or "<test-filter>": Error "Run /init-project first to configure test filter"

   **If ui-tests type (from args):**
   - If `ticket` arg provided → `TICKET_PATH` = ticket value
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH

   **If docs selected:**
   - If `file` arg provided → `FILE_PATH` = file value
   - Else → "どのドキュメントをチェックしますか？" → File path input via AskUserQuestion → `FILE_PATH`
   - Read document file → `CONTENT`
   - Invoke knowledge-reader agent: `OPERATION=resolve WORKFLOW=/refine-loop` → `KNOWLEDGE`

   **If ac selected:**
   - Resolve ticket:
     - If `ticket` arg provided → TICKET_PATH = ticket value
     - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH
   - "スコープは？" → Uncommitted / Branch
     - Uncommitted → `SCOPE` = "uncommitted"
     - Branch → `SCOPE` = "branch"

3. Determine type directory name:
   - code → `code`
   - tests → `tests`
   - code-tests → `code` and `tests` (creates both)
   - ui-tests → `ui-tests`
   - docs → `docs`
   - ac → `ac`

4. Save context to `.claude/refine-loop/{type}/context.json`:
   - code: `{"TICKET_PATH": "...", "SCOPE": "..."}`
   - tests/code-tests: `{"TICKET_PATH": "...", "SCOPE": "..."}`
   - ui-tests: `{"TICKET_PATH": "..."}`
   - docs: `{"FILE_PATH": "...", "CONTENT": "...", "KNOWLEDGE": [...]}`
   - ac: `{"TICKET_PATH": "...", "SCOPE": "..."}`

5. Create state file `.claude/refine-loop/{type}/state.local.md` with checklist:

```markdown
---
type: {TYPE}
max_iterations: {MAX_ITERATIONS}
iteration: 1
---

# Refine Loop

- [ ] Iteration 1: Review
- [ ] Iteration 1: Fix
- [ ] Iteration 2: Review
- [ ] Iteration 2: Fix
... (max_iterations)
- [ ] False Positive Check
- [ ] Report
- [ ] Cleanup
```

6. Execute the loop following the Protocol below

## Protocol

**Async Handling:**
Task tool may switch to async mode automatically (due to context pressure).
- If Task returns inline result → use directly as REVIEW_RESULT/FIX_RESULT
- If Task returns "Async agent launched" with agentId → use TaskOutput(task_id=agentId, block=true) to wait and retrieve result
- If TaskOutput returns empty → retry with longer timeout or re-invoke Task

**Single type (code):**
Review Phase:
1. Review: invoke code-reviewer AND security-reviewer agents **in parallel**
   - code-reviewer: `SCOPE={scope}`
   - security-reviewer: `SCOPE={scope}`
2. Capture outputs as CODE_REVIEW_RESULT and SECURITY_REVIEW_RESULT
3. Extract ISSUE_COUNT from each (Critical/High + fixable only)
   - CODE_ISSUES from CODE_REVIEW_RESULT
   - SECURITY_ISSUES from SECURITY_REVIEW_RESULT
   - TOTAL_ISSUES = CODE_ISSUES + SECURITY_ISSUES
4. If TOTAL_ISSUES = 0: skip to Loop End

Fix Phase:
5. Fix: invoke code-fixer AND security-fixer agents **in parallel**
   - code-fixer: `SCOPE={scope} REVIEW_RESULT={code_review_result}`
   - security-fixer: `SCOPE={scope} REVIEW_RESULT={security_review_result}`
6. Continue to next iteration

**Single type (tests):**
1. Review: invoke tests-reviewer with `SCOPE={scope}` → capture output as REVIEW_RESULT
2. Extract ISSUE_COUNT from REVIEW_RESULT (Critical/High + fixable only)
3. If ISSUE_COUNT = 0: skip to Loop End
4. Fix: invoke tests-fixer with `SCOPE={scope} REVIEW_RESULT={review_result}`
5. Continue to next iteration

**Single type (ui-tests):**
1. Review: invoke ui-tests-reviewer with `TICKET_PATH={ticket_path}` → capture output as REVIEW_RESULT
2. Extract ISSUE_COUNT from REVIEW_RESULT (Critical/High + fixable only)
3. If ISSUE_COUNT = 0: skip to Loop End
4. Fix: invoke ui-tests-fixer with `TICKET_PATH={ticket_path} REVIEW_RESULT={review_result}`
5. Continue to next iteration

**code-tests type:**
This mode invokes **code-reviewer/fixer** and **tests-reviewer/fixer** agents in parallel.

Review Phase:
1. Review: invoke code-reviewer AND tests-reviewer agents in parallel
   - code-reviewer: `SCOPE={scope}`
   - tests-reviewer: `SCOPE={scope}`
2. Capture outputs as CODE_REVIEW_RESULT and TESTS_REVIEW_RESULT
3. Extract ISSUE_COUNT from each (Critical/High + fixable only) → TOTAL_ISSUES = CODE_ISSUES + TEST_ISSUES
4. If TOTAL_ISSUES = 0: skip to Loop End

Fix Phase:
5. Fix: invoke code-fixer AND tests-fixer agents in parallel
   - code-fixer: `SCOPE={scope} REVIEW_RESULT={code_review_result}`
   - tests-fixer: `SCOPE={scope} REVIEW_RESULT={tests_review_result}`
6. Continue to next iteration

**Single type (docs):**
1. Review: invoke document-reviewer with `CONTENT={content} KNOWLEDGE={knowledge}` → capture output as REVIEW_RESULT
2. Extract ISSUE_COUNT from REVIEW_RESULT (all fixable issues)
3. If ISSUE_COUNT = 0: skip to Loop End
4. Fix: invoke document-fixer with `CONTENT={content} KNOWLEDGE={knowledge} REVIEW_RESULT={review_result}`
5. Capture FIXED_CONTENT from output
6. Write FIXED_CONTENT to FILE_PATH
7. Update CONTENT = FIXED_CONTENT for next iteration
8. Continue to next iteration

**Single type (ac):**
1. Review: invoke ac-reviewer with `TICKET_PATH={ticket_path} SCOPE={scope}` → capture output as REVIEW_RESULT
2. Extract ISSUE_COUNT from REVIEW_RESULT (Critical/High, regardless of fixable flag)
3. Loop End (no fix phase)

**Loop End (after ISSUE_COUNT = 0 or max iterations):**
1. False Positive Check:
   - Review the final iteration's reported issues
   - Signs of false positive: intentional design, context misunderstanding, valid pattern flagged as violation
   - If false positive found → revert the fix, exclude from FIXED_COUNT
   - If ALL issues were false positives → treat as successful completion

2. Report:
   - Read TICKET_PATH from `.claude/refine-loop/{type}/context.json`
   - If TICKET_PATH exists: Write `<TICKET_PATH>/refine-{type}-report.md` with:
     - Summary: total iterations, total fixed issues
     - Per-iteration: REVIEW_RESULT table and FIXED_COUNT
   - If TICKET_PATH not found: skip report output

3. Cleanup: Delete `.claude/refine-loop/{type}/` directory only
   - IMPORTANT: Other types may be running in parallel, only delete the current type's directory
