---
name: generating-ui-test-scenarios
description: "Generates comprehensive UI test scenarios with template-based quality check. Use when user requests UI test scenarios, manual test cases, or end-to-end test documentation."
allowed-tools: Read, Grep, Glob, Write, Edit
context: fork
---

## Quick start

```
1. Analyze code changes → identify affected screens
2. Extract factors/levels → define test coverage
3. Generate session-organized test cases
4. Template check → ensure format compliance
```

Output: `$OUTPUT_DIR/ui-test-scenario.md`

## UI test scenario workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Resolve paths
- [ ] Step 3: Load project knowledge
- [ ] Step 4: Analyze GATHERED_INFO
- [ ] Step 5: Read templates and generate
- [ ] Step 6: Template check
- [ ] Step 7: Write output
```

**Step 1: Parse task prompt**

Parse from task prompt:
- CONFIG: Project configuration (includes BASE_PATH)
- TICKET_PATH: target ticket folder path
- output_path: "tickets"
- output_filename: "ui-test-scenario.md"
- GATHERED_INFO: Git diff and file contents

**Step 2: Resolve paths**

Resolve paths:
- CONFIG.BASE_PATH required (error if missing: "CONFIG.BASE_PATHが未設定です")
- OUTPUT_DIR = CONFIG.BASE_PATH + "/" + output_path

**Step 3: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/ui-test-design" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content`
- On failure: Error: "ナレッジが見つかりません", END

**Step 4: Analyze GATHERED_INFO**

- Read TICKET_PATH/requirements.md and extract AC (acceptance criteria)
- Identify changed features and affected screens
- Determine test approach (UI/API/Hybrid)
- Extract factors and levels for combination testing
- Define test scope and feasibility

**Step 5: Read templates and generate**

Read templates:
- ./templates/scenario-template.md
- ./templates/design-template.md

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

**Step 6: Template check**

Compare against templates (Step 5):
- Verify structure matches template format
- Check required sections exist
- Fix format violations immediately

**Step 7: Write output**

Write to OUTPUT_DIR/output_filename.
