---
name: code-review
description: "Reviews production code changes for quality issues, bugs, performance, and security concerns."
user-invocable: true
allowed-tools: Read, Write, Bash, Glob, Grep, AskUserQuestion
---

# /code-review

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed files. Return diff and file contents."

4. Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" code-review`

5. Execute review workflow (see below)

6. Process findings:
   a. Filter: remove findings with score < 80

7. Write report to `<TICKET_PATH>/code-review-report.md`

   Format (numbered list):
   ```markdown
   # Code Review Report

   Found X issues:

   1. [Score: 95] Description
      file:line

   2. [Score: 82] Description
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
   - Findings with score >= 80
   - Filtered findings with score < 80 (for reference, collapsed)

9. Mark `/code-review` as completed in <TICKET_PATH>/tasks.md Workflow section

---

## Review workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Load CLAUDE.md
- [ ] Step 2: Check criteria and detect violations
- [ ] Step 3: Score each finding (0-100)
- [ ] Step 4: Generate report
```

**Step 1: Load CLAUDE.md**

Read CLAUDE.md from project root (CONFIG.BASE_PATH or current working directory):
- Use `Read` tool to read CLAUDE.md
- Extract project-specific conventions, constraints, and guidelines
- On failure: continue without project conventions (use general best practices)

**Step 2: Check criteria and detect violations**

Review code changes and provide feedback on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns
- Test coverage

Use CLAUDE.md for project-specific guidance.
Be constructive and helpful in your feedback.

**Step 3: Score each finding (0-100)**

For each finding, assign confidence score based on evidence strength:
- **100**: Absolutely certain, definitely real
- **75**: Highly confident, real and important
- **50**: Moderately confident, real but minor
- **25**: Somewhat confident, might be real
- **0**: Not confident, false positive

**Step 4: Generate report**

Output format:
```markdown
## Code Review

Found X issues:

1. [Score: 95] Description (with CLAUDE.md reference or bug explanation)

   file:line

2. [Score: 82] Description

   file:line
```
