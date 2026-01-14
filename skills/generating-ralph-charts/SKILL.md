---
name: generating-ralph-charts
description: "Generates RALPH charts (factor-level analysis diagrams) for HAYST method test design. Use when designing combination tests, identifying test coverage gaps, or analyzing system behavior factors."
allowed-tools: Read, Grep, Glob, Write, AskUserQuestion
context: fork
---

## RALPH chart workflow

Copy this checklist and track your progress:

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
