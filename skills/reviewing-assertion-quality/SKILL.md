---
name: reviewing-assertion-quality
description: "Reviews test code for assertion quality including precision levels, property coverage, and validation patterns. Use as part of parallel test review execution."
allowed-tools: Read, Grep, Glob
---

## Review criteria

### Critical
- Assertion strictness: use exact value assertions when value is known
- Property coverage: validate all essential properties of result objects
- Collection size validation: assert size before accessing elements

### Standard
- Greater than zero: use exact count when known
- Not empty checks: use exact value when known

### Supplementary
- Truthy/Falsy: prefer property-based assertions over boolean checks

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
## Assertion Quality Review

Found X issues:

1. [Score: 95] Description

   file:line

2. [Score: 82] Description

   file:line
```
