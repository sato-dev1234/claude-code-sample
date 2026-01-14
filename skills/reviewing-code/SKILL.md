---
name: reviewing-code
description: "Generic code review for production code. Use as part of parallel code review execution."
allowed-tools: Read, Grep, Glob
context: fork
---

## Review workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Parse GATHERED_INFO, TICKET_PATH, and CONFIG
- [ ] Step 2: Load CLAUDE.md
- [ ] Step 3: Check criteria and detect violations
- [ ] Step 4: Score each finding (0-100)
- [ ] Step 5: Generate report
```

**Step 1: Parse GATHERED_INFO, TICKET_PATH, and CONFIG**

Parse from task prompt:
- GATHERED_INFO: code changes to review
- TICKET_PATH: target ticket folder path
- CONFIG: project configuration

**Step 2: Load CLAUDE.md**

Read CLAUDE.md from project root (CONFIG.BASE_PATH or current working directory):
- Use `Read` tool to read CLAUDE.md
- Extract project-specific conventions, constraints, and guidelines
- On failure: continue without project conventions (use general best practices)

**Step 3: Check criteria and detect violations**

Review code changes and provide feedback on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns
- Test coverage

Use CLAUDE.md for project-specific guidance.
Be constructive and helpful in your feedback.

**Step 4: Score each finding (0-100)**

For each finding, assign confidence score based on evidence strength:
- **100**: Absolutely certain, definitely real
- **75**: Highly confident, real and important
- **50**: Moderately confident, real but minor
- **25**: Somewhat confident, might be real
- **0**: Not confident, false positive

**Step 5: Generate report**

Output format:
```markdown
## Code Review

Found X issues:

1. [Score: 95] Description (with CLAUDE.md reference or bug explanation)

   file:line

2. [Score: 82] Description

   file:line
```
