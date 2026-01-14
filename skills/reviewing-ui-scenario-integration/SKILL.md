---
name: reviewing-ui-scenario-integration
description: "Reviews UI test scenarios for consolidation opportunities. Identifies scenarios that can be merged to reduce operation counts. Use as part of parallel UI test scenario review."
allowed-tools: Read, Grep, Glob
context: fork
---

## Review criteria

### Critical
- Sequential flows: scenario A's end state = scenario B's precondition
- Redundant navigation: multiple scenarios navigate to same screen separately
- Repeated operations: same operation sequence appears across multiple scenarios
- Operation explosion: excessive scenarios for feature scope

### Standard
- Common preconditions: multiple scenarios share identical setup
- Duplicate verifications: same assertion appears in multiple scenarios
- Ungrouped verifications: verifications on same screen split across scenarios

### Supplementary
- Similar flows: scenarios with minor variations that could be parameterized

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

Extract preconditions, steps, end states from each scenario. Identify consolidation opportunities by analyzing flow continuity.

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
## UI Scenario Integration Review

Found X issues:

1. [Score: 95] Description

   merge: scenario_A, scenario_B → new_scenario_name
   action: delete scenario_A, scenario_B after merge

2. [Score: 82] Description

   merge: scenario_C, scenario_D, scenario_E → new_scenario_name
   action: delete scenario_C, scenario_D, scenario_E after merge
```
