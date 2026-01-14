---
name: reviewing-ui-coverage
description: "Reviews UI test scenarios for RALPH chart and AC coverage. Detects uncovered constraints and acceptance criteria. Use as part of parallel UI test scenario review."
allowed-tools: Read, Grep, Glob
context: fork
---

## Review criteria

### Critical
- Uncovered constraints: RALPH chart constraint has no covering scenario
- Uncovered AC: acceptance criteria has no covering scenario
- Missing combinations: required factor combinations not tested

### Standard
- Partial coverage: constraint/AC mentioned but not fully verified
- Implicit coverage: scenario covers constraint/AC without explicit reference

### Supplementary
- Coverage depth: constraint/AC covered by single vs multiple scenarios

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

1. Read TICKET_PATH/ralph-chart.md and extract Constraints
2. Read TICKET_PATH/requirements.md and extract AC (acceptance criteria)
3. For each Constraint and AC, check if any scenario covers it
4. Judge coverage by semantic matching, not keyword matching

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
## Coverage Review

Found X issues:

1. [Score: 95] Description

   scenario:constraint/AC

2. [Score: 82] Description

   scenario:constraint/AC
```
