---
name: test-review
description: "Reviews test code for quality issues including flaky patterns, assertion quality, and test isolation. Use when verifying test robustness and reliability."
user-invocable: true
allowed-tools: Read, Write, Bash, Task, Glob, Grep, AskUserQuestion
---

# /test-review

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Determine test file filter via AskUserQuestion: e.g., `*Test.kt`, `*.spec.ts`, `*_test.py`

4. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed test files matching filter from Step 3. Return diff and file contents."

5. Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" test-review`

6. Launch 3 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - Test Code Review (sonnet) - see below
   - Flaky Patterns Review (sonnet) - see below
   - Assertion Quality Review (haiku) - see below

7. Process findings:
   a. Collect: gather results from all reviews
   b. Deduplicate: merge by file:line, keep highest score
   c. Filter: remove findings with score < 80

8. Write report to `<TICKET_PATH>/test-review-report.md`

   Format (numbered list, grouped by review type):
   ```markdown
   # Test Review Report

   ## Test Code Review

   Found X issues:

   1. [Score: 95] Description
      file:line

   2. [Score: 82] Description
      file:line

   ## Flaky Patterns Review

   Found Y issues:

   1. [Score: 88] Description
      file:line

   ## Assertion Quality Review

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

9. Report summary in Japanese
   - Findings with score >= 80 (grouped by review type)
   - Filtered findings with score < 80 (for reference, collapsed)

10. Mark `/test-review` as completed in <TICKET_PATH>/tasks.md Workflow section

---

## Test Code Review

Review test code changes and provide feedback on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns
- Test coverage

Read CLAUDE.md from project root for project-specific guidance.

---

## Flaky Patterns Review

### Review criteria

**Critical**
- Fixed sleep/wait: use condition-based waiting instead
- Race conditions: await all async operations
- Shared static state: avoid mutable static/global state in tests
- Test order dependency: tests must be independent

**Standard**
- Insufficient timeouts: use reasonable timeouts (>= 1s)
- Hardcoded paths: use OS-agnostic paths
- Environment variables: provide fallback values
- Missing cleanup: match setup with teardown

**Supplementary**
- Random values: use fixed test data
- Current time: mock time in tests
- External API calls: mock external services

---

## Assertion Quality Review

### Review criteria

**Critical**
- Assertion strictness: use exact value assertions when value is known
- Property coverage: validate all essential properties of result objects
- Collection size validation: assert size before accessing elements

**Standard**
- Greater than zero: use exact count when known
- Not empty checks: use exact value when known

**Supplementary**
- Truthy/Falsy: prefer property-based assertions over boolean checks

---

## Common workflow for each review

```
Progress:
- [ ] Step 1: Load project knowledge
- [ ] Step 2: Check criteria and detect violations
- [ ] Step 3: Score each finding (0-100)
- [ ] Step 4: Generate report
```

**Step 1: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/test-review" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for context
- On failure: continue without knowledge

**Step 2: Check criteria and detect violations**

Check each criterion against GATHERED_INFO and detect violations.

**Step 3: Score each finding (0-100)**

For each finding, assign confidence score based on evidence strength:
- **100**: Absolutely certain, definitely real
- **75**: Highly confident, real and important
- **50**: Moderately confident, real but minor
- **25**: Somewhat confident, might be real
- **0**: Not confident, false positive

**Step 4: Generate report**

Output format per review type:
```markdown
## [Review Type] Review

Found X issues:

1. [Score: 95] Description

   file:line

2. [Score: 82] Description

   file:line
```
