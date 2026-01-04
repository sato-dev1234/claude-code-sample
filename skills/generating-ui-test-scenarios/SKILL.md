---
name: generating-ui-test-scenarios
description: "Generates comprehensive UI test scenarios with template-based quality check. Use when user requests UI test scenarios, manual test cases, or end-to-end test documentation."
allowed-tools: Read, Grep, Glob, Write, Edit
---

## Quick start

```
1. Analyze code changes → identify affected screens
2. Extract factors/levels → define test coverage
3. Generate session-organized test cases
4. Template check → format validation
```

Output: `$OUTPUT_DIR/ui-test-scenario.md`

## Workflow

```
Progress:
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Resolve paths
- [ ] Step 3: Read templates
- [ ] Step 4: Analyze GATHERED_INFO
- [ ] Step 5: Generate UI test scenario
- [ ] Step 6: Template check
- [ ] Step 7: Write output
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

**Step 4: Analyze GATHERED_INFO**

- Identify changed features and affected screens
- Determine test approach (UI/API/Hybrid)
- Extract factors and levels for combination testing
- Define test scope and feasibility

**Step 5: Generate UI test scenario**

- Create session-organized test cases
- Include factor-level coverage where applicable
- Add session summary table and execution flow

**Step 6: Template check**

Compare against templates (Step 3):
- Verify structure matches template format
- Check required sections exist
- Fix format violations immediately

**Step 7: Write output**

Write to OUTPUT_DIR/output_filename.
