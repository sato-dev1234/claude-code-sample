---
name: reviewing-ui-wording
description: "Reviews UI test scenarios for wording accuracy. Detects variables and dynamic values that cannot be verified from actual UI. Use as part of parallel UI test scenario review."
allowed-tools: Read, Grep, Glob
context: fork
---

## Review criteria

### Critical
- Variable syntax: expected text contains `${...}`, `{{...}}`, `%s`, `{0}` patterns
- Dynamic values: timestamps, UUIDs, sequential IDs that change between runs
- Placeholder text: TODO, TBD, xxx, dummy values in expected results

### Standard
- Technical terms: code-level terms not visible in actual UI
- Unverifiable descriptions: text that cannot be confirmed by looking at screen

### Supplementary
- Ambiguous references: "the value" instead of specific UI label

## Review workflow

Copy this checklist and track your progress:

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
- GATHERED_INFO: UI test scenario content
- TICKET_PATH: target ticket folder path
- CONFIG: project configuration

**Step 2: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/ui-test-design" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for context
- On failure: continue without knowledge

**Step 3: Check criteria and detect violations**

Read each scenario and judge whether expected text can be visually verified from actual UI. Context-based judgment required.

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
## UI Wording Review

Found X issues:

1. [Score: 95] Description

   scenario:line

2. [Score: 82] Description

   scenario:line
```
