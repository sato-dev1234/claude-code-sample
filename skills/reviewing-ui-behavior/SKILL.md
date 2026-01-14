---
name: reviewing-ui-behavior
description: "Reviews UI test scenarios for behavioral appropriateness. Detects design tests (colors, fonts, layout) that should not be in scenario tests. Use as part of parallel UI test scenario review."
allowed-tools: Read, Grep, Glob
context: fork
---

## Review criteria

### Critical
- Visual design tests: color values, font styles, pixel positions as expected results
- Layout tests: spacing, alignment, margins as verification targets
- Non-verifiable visuals: design details that cannot be confirmed by human eye

### Standard
- Subjective appearance: "looks good", "properly styled" without objective criteria
- Animation details: specific timing or easing that humans cannot verify

### Supplementary
- Mixed tests: behavioral test with unnecessary design assertions

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

Read each scenario and judge whether test target is behavior or design. Context-based judgment required (e.g., "button turns red" - error state behavior or visual design check?).

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
## UI Behavior Review

Found X issues:

1. [Score: 95] Description

   scenario:line

2. [Score: 82] Description

   scenario:line
```
