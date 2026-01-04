---
name: reviewing-flaky-patterns
description: "Detects test flakiness patterns including timing issues, environmental dependencies, state pollution, and non-deterministic behaviors. Use as part of parallel test review execution."
allowed-tools: Read, Grep, Glob
---

## Review criteria

### Critical
- Fixed sleep/wait: use condition-based waiting instead
- Race conditions: await all async operations
- Shared static state: avoid mutable static/global state in tests
- Test order dependency: tests must be independent

### Standard
- Insufficient timeouts: use reasonable timeouts (>= 1s)
- Hardcoded paths: use OS-agnostic paths
- Environment variables: provide fallback values
- Missing cleanup: match setup with teardown

### Supplementary
- Random values: use fixed test data
- Current time: mock time in tests
- External API calls: mock external services

## Review workflow

```
Progress:
- [ ] Step 1: Parse GATHERED_INFO, TICKET_PATH, and CONFIG
- [ ] Step 2: Load project knowledge
- [ ] Step 3: Check criteria and detect violations
- [ ] Step 4: Score each finding (0-100)
- [ ] Step 5: Generate report
```

**Step 1: Parse GATHERED_INFO, TICKET_PATH, and CONFIG**

Parse from task prompt:
- GATHERED_INFO: test code changes to review
- TICKET_PATH: target ticket folder path
- CONFIG: project configuration

**Step 2: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/test-review" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for context
- On failure: continue without knowledge

**Step 3: Check criteria and detect violations**

Check each criterion in Review criteria section against GATHERED_INFO and detect violations.

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
## Flaky Patterns Review

Found X issues:

1. [Score: 95] Description

   file:line

2. [Score: 82] Description

   file:line
```
