---
name: ui-test-design
description: "Generate UI test scenarios and RALPH charts for test design"
user-invocable: true
allowed-tools: Read, Bash, Task, Glob, Grep, AskUserQuestion, Write, Edit
---

# /ui-test-design

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Use AskUserQuestion for scope: uncommitted, branch, or specific range

3. Launch Explore agent to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed files. Return diff and file contents."

4. Launch 2 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - UI Test Scenario Generation (sonnet) - see below
   - RALPH Chart Generation (sonnet) - see below

5. Report in Japanese: output path, generated files, next steps

6. Update <TICKET_PATH>/tasks.md Tasks section: mark test design items as completed based on generated artifacts (ui-test-scenario.md, ralph-chart.md)

7. Read `<TICKET_PATH>/ui-test-scenario.md` and `<TICKET_PATH>/ralph-chart.md` → update `GATHERED_INFO`

8. Self-Refine Loop:

   Copy this checklist and execute each unchecked item in order:

   ```
   - [ ] Review 1
   - [ ] Fix 1 (skip if no issues)
   - [ ] Review 2 (skip if Fix 1 skipped)
   - [ ] Fix 2 (skip if no issues)
   - [ ] Review 3 (skip if Fix 2 skipped)
   - [ ] Fix 3 (skip if no issues)
   ```

   **Review**: Launch 4 agents in parallel with GATHERED_INFO, TICKET_PATH, and CONFIG:
   - UI Wording Review (sonnet) - see below
   - UI Behavior Review (sonnet) - see below
   - UI Scenario Integration Review (sonnet) - see below
   - UI Coverage Review (sonnet) - see below

   Output: "Review N: ISSUE_COUNT = {count of score >= 80}"

   **Fix**: Launch single agent (sonnet) with GATHERED_INFO + REVIEW_RESULTS.
   Instructions: "Fix issues with score >= 80. For integration issues: merge scenarios and delete original scenarios as specified in action field. Use ~/.claude/templates/self-refine-report.md"
   After fix: Re-run step 7 to update GATHERED_INFO

9. Write report to `<TICKET_PATH>/self-refine-report.md`

10. Report in Japanese: output path, generated files, refinement summary

11. Mark `/ui-test-design` as completed in <TICKET_PATH>/tasks.md Workflow section

---

## UI Test Scenario Generation

### Quick start

```
1. Analyze code changes → identify affected screens
2. Extract factors/levels → define test coverage
3. Generate session-organized test cases
4. Template check → ensure format compliance
```

Output: `$TICKET_PATH/ui-test-scenario.md`

### Workflow

```
Progress:
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Resolve paths
- [ ] Step 3: Read templates
- [ ] Step 4: Load project knowledge
- [ ] Step 5: Analyze GATHERED_INFO
- [ ] Step 6: Generate UI test scenario
- [ ] Step 7: Template check
- [ ] Step 8: Write output
```

**Step 1: Parse task prompt**

Parse from task prompt:
- CONFIG: Project configuration (includes BASE_PATH)
- output_path: "tickets"
- output_filename: "ui-test-scenario.md"
- GATHERED_INFO: Git diff and file contents

**Step 2: Resolve paths**

- CONFIG.BASE_PATH required (error if missing)
- OUTPUT_DIR = CONFIG.BASE_PATH + "/" + output_path

**Step 3: Read templates**

Read templates:
- ./templates/scenario-template.md
- ./templates/design-template.md

**Step 4: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/ui-test-design" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content`
- On failure: Error: "ナレッジが見つかりません", END

**Step 5: Analyze GATHERED_INFO**

- Read TICKET_PATH/requirements.md and extract AC (acceptance criteria)
- Identify changed features and affected screens
- Determine test approach (UI/API/Hybrid)
- Extract factors and levels for combination testing
- Define test scope and feasibility

**Step 6: Generate UI test scenario**

Generate following scenario-template.md format:
- Each scenario: title, precondition, steps, verifications
- Steps: operation with inline verifications (indented checklist under each step)
- Verifications: place immediately after the step that triggers them

Quality guidelines:
- Verifications: must be visually confirmable from actual UI (no variables, no design details)
- Verifications: place under each step, avoid timing prefixes like "after X" or "when Y"
- Verifications: avoid repeating element name from step; step includes target, verification includes state only
- Scenarios: merge sequential flows, avoid redundant navigation to same screen
- AC coverage: create scenarios for all acceptance criteria

**Step 7: Template check**

Compare against templates (Step 3):
- Verify structure matches template format
- Check required sections exist
- Fix format violations immediately

**Step 8: Write output**

Write to OUTPUT_DIR/output_filename.

---

## RALPH Chart Generation

### Workflow

```
Progress:
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Resolve paths
- [ ] Step 3: Read templates
- [ ] Step 4: Load project knowledge
- [ ] Step 5: Analyze GATHERED_INFO
- [ ] Step 6: Generate RALPH chart
- [ ] Step 7: Write output
```

**Step 1: Parse task prompt**

Parse from task prompt:
- CONFIG: Project configuration (includes BASE_PATH)
- output_path: "tickets"
- output_filename: "ralph-chart.md"
- GATHERED_INFO: Git diff and file contents

**Step 2: Resolve paths**

Resolve paths:
- CONFIG.BASE_PATH required (error if missing: "CONFIG.BASE_PATHが未設定です")
- OUTPUT_DIR = CONFIG.BASE_PATH + "/" + output_path

**Step 3: Read templates**

Read templates (Handlebars format):
- ./templates/ralph-chart-template.md

**Step 4: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/ui-test-design" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for Terminology and Specifications sections

**Step 5: Analyze GATHERED_INFO**

Analyze GATHERED_INFO:
- Identify purpose function (one chart per function)
- Extract Input factors from parameters, DTOs, API query params
- Extract State factors from conditional checks, entity status
- Extract Output factors from return types, exceptions, side effects
- Infer Noise factors from try-catch, timeouts, retry logic
- Infer Active Noise factors from validation, rate limiting, concurrency

**Step 6: Generate RALPH chart**

Generate RALPH chart document:
- Create ASCII structure diagram
- Build factor-level tables for all 5 categories
- Document constraints (invalid combinations)
- Include YAML structure data
- Add test design recommendation

**Step 7: Write output**

Write output to OUTPUT_DIR/output_filename.

---

## UI Wording Review

Reviews UI test scenarios for wording accuracy. Detects variables and dynamic values that cannot be verified from actual UI.

### Review criteria

**Critical**
- Variable syntax: expected text contains `${...}`, `{{...}}`, `%s`, `{0}` patterns
- Dynamic values: timestamps, UUIDs, sequential IDs that change between runs
- Placeholder text: TODO, TBD, xxx, dummy values in expected results

**Standard**
- Technical terms: code-level terms not visible in actual UI
- Unverifiable descriptions: text that cannot be confirmed by looking at screen

**Supplementary**
- Ambiguous references: "the value" instead of specific UI label

### Workflow

Read each scenario and judge whether expected text can be visually verified from actual UI. Context-based judgment required.

---

## UI Behavior Review

Reviews UI test scenarios for behavioral appropriateness. Detects design tests (colors, fonts, layout) that should not be in scenario tests.

### Review criteria

**Critical**
- Visual design tests: color values, font styles, pixel positions as expected results
- Layout tests: spacing, alignment, margins as verification targets
- Non-verifiable visuals: design details that cannot be confirmed by human eye

**Standard**
- Subjective appearance: "looks good", "properly styled" without objective criteria
- Animation details: specific timing or easing that humans cannot verify

**Supplementary**
- Mixed tests: behavioral test with unnecessary design assertions

### Workflow

Read each scenario and judge whether test target is behavior or design. Context-based judgment required (e.g., "button turns red" - error state behavior or visual design check?).

---

## UI Scenario Integration Review

Reviews UI test scenarios for consolidation opportunities. Identifies scenarios that can be merged to reduce operation counts.

### Review criteria

**Critical**
- Sequential flows: scenario A's end state = scenario B's precondition
- Redundant navigation: multiple scenarios navigate to same screen separately
- Repeated operations: same operation sequence appears across multiple scenarios
- Operation explosion: excessive scenarios for feature scope

**Standard**
- Common preconditions: multiple scenarios share identical setup
- Duplicate verifications: same assertion appears in multiple scenarios
- Ungrouped verifications: verifications on same screen split across scenarios

**Supplementary**
- Similar flows: scenarios with minor variations that could be parameterized

### Workflow

Extract preconditions, steps, end states from each scenario. Identify consolidation opportunities by analyzing flow continuity.

### Report format

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

---

## UI Coverage Review

Reviews UI test scenarios for RALPH chart and AC coverage. Detects uncovered constraints and acceptance criteria.

### Review criteria

**Critical**
- Uncovered constraints: RALPH chart constraint has no covering scenario
- Uncovered AC: acceptance criteria has no covering scenario
- Missing combinations: required factor combinations not tested

**Standard**
- Partial coverage: constraint/AC mentioned but not fully verified
- Implicit coverage: scenario covers constraint/AC without explicit reference

**Supplementary**
- Coverage depth: constraint/AC covered by single vs multiple scenarios

### Workflow

1. Read TICKET_PATH/ralph-chart.md and extract Constraints
2. Read TICKET_PATH/requirements.md and extract AC (acceptance criteria)
3. For each Constraint and AC, check if any scenario covers it
4. Judge coverage by semantic matching, not keyword matching

---

## Common review workflow

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

Check each criterion against GATHERED_INFO and detect violations.

**Step 4: Score each finding (0-100)**

For each finding, assign confidence score based on evidence strength:
- **100**: Absolutely certain, definitely real
- **75**: Highly confident, real and important
- **50**: Moderately confident, real but minor
- **25**: Somewhat confident, might be real
- **0**: Not confident, false positive

**Step 5: Generate report**

Output format per review type:
```markdown
## [Review Type] Review

Found X issues:

1. [Score: 95] Description

   scenario:line

2. [Score: 82] Description

   scenario:line
```
