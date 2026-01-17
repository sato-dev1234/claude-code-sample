# RALPH Chart: {{PURPOSE_FUNCTION}}

**Extracted from**: {{SOURCE_FILE}}
**Domain**: {{DOMAIN}}

## Structure Diagram

```
                    ┌─────────────────────────────────┐
                    │      Active Noise (AN)          │
{{#each ACTIVE_NOISE_FACTORS}}
                    │  ・{{this}}                     │
{{/each}}
                    └─────────────────────────────────┘
                                   ↓
                    ┌─────────────────────────────────┐
                    │          Noise (N)              │
{{#each NOISE_FACTORS}}
                    │  ・{{this}}                     │
{{/each}}
                    └─────────────────────────────────┘
                                   ↓
    ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
    │   Input     │      │    State     │      │   Output     │
{{#each INPUT_FACTORS}}
    │ ・{{this}}  │      │              │      │              │
{{/each}}
{{#each STATE_FACTORS}}
    │             │  →   │ ・{{this}}   │  →   │              │
{{/each}}
{{#each OUTPUT_FACTORS}}
    │             │      │              │      │ ・{{this}}   │
{{/each}}
    └─────────────┘      └──────────────┘      └──────────────┘
```

## Factor-Level Tables

### Input（信号因子）

| 因子 | 水準 | 説明 | 抽出元 |
|------|------|------|--------|
{{#each INPUT_DETAILS}}
| {{NAME}} | {{LEVELS}} | {{DESCRIPTION}} | {{SOURCE}} |
{{/each}}

### State（状態因子）

| 因子 | 水準 | 説明 | 抽出元 |
|------|------|------|--------|
{{#each STATE_DETAILS}}
| {{NAME}} | {{LEVELS}} | {{DESCRIPTION}} | {{SOURCE}} |
{{/each}}

### Output（出力因子）

| 因子 | 水準 | 説明 | 抽出元 |
|------|------|------|--------|
{{#each OUTPUT_DETAILS}}
| {{NAME}} | {{LEVELS}} | {{DESCRIPTION}} | {{SOURCE}} |
{{/each}}

### Noise（外乱因子）

| 因子 | 水準 | 説明 | 抽出元 |
|------|------|------|--------|
{{#each NOISE_DETAILS}}
| {{NAME}} | {{LEVELS}} | {{DESCRIPTION}} | {{SOURCE}} |
{{/each}}

### Active Noise（能動外乱因子）

| 因子 | 水準 | 説明 | 抽出元 |
|------|------|------|--------|
{{#each ACTIVE_NOISE_DETAILS}}
| {{NAME}} | {{LEVELS}} | {{DESCRIPTION}} | {{SOURCE}} |
{{/each}}

## Constraints

| ID | Factor 1 | Factor 2 | Reason | Source |
|----|----------|----------|--------|--------|
{{#each CONSTRAINTS}}
| {{ID}} | {{FACTOR1}} | {{FACTOR2}} | {{REASON}} | {{SOURCE}} |
{{/each}}

## YAML Structure

```yaml
ui-test-design:
  metadata:
    purpose_function: "{{PURPOSE_FUNCTION}}"
    extracted_from: "{{SOURCE_FILE}}"
    sample_domain: "{{DOMAIN}}"

  factors:
    input:
{{#each INPUT_DETAILS}}
      - name: "{{NAME}}"
        levels: [{{LEVELS_ARRAY}}]
        source: "{{SOURCE}}"
{{/each}}
    state:
{{#each STATE_DETAILS}}
      - name: "{{NAME}}"
        levels: [{{LEVELS_ARRAY}}]
        source: "{{SOURCE}}"
{{/each}}
    output:
{{#each OUTPUT_DETAILS}}
      - name: "{{NAME}}"
        levels: [{{LEVELS_ARRAY}}]
        source: "{{SOURCE}}"
{{/each}}
    noise:
{{#each NOISE_DETAILS}}
      - name: "{{NAME}}"
        levels: [{{LEVELS_ARRAY}}]
        source: "{{SOURCE}}"
{{/each}}
    active_noise:
{{#each ACTIVE_NOISE_DETAILS}}
      - name: "{{NAME}}"
        levels: [{{LEVELS_ARRAY}}]
        source: "{{SOURCE}}"
{{/each}}

  constraints:
{{#each CONSTRAINTS}}
    - id: "{{ID}}"
      factors: ["{{FACTOR1}}", "{{FACTOR2}}"]
      reason: "{{REASON}}"
{{/each}}

  coverage_metrics:
    total_factors: {{TOTAL_FACTORS}}
    total_levels: {{TOTAL_LEVELS}}
    pairwise_combinations: {{PAIRWISE_COMBINATIONS}}
    constrained_exclusions: {{CONSTRAINED_EXCLUSIONS}}
    effective_combinations: {{EFFECTIVE_COMBINATIONS}}
```

## 推奨テスト設計

**因子数**: {{TOTAL_FACTORS}}
**水準総数**: {{TOTAL_LEVELS}}
**有効組み合わせ数**: {{EFFECTIVE_COMBINATIONS}}

**推奨手法**: {{RECOMMENDED_METHOD}}

**理由**:
{{#each RECOMMENDATION_REASONS}}
- {{this}}
{{/each}}

**期待テストケース数**: {{EXPECTED_TEST_CASES}}

**優先順位**:
{{#each PRIORITIES}}
{{INDEX}}. {{PRIORITY}}: {{DESCRIPTION}}
{{/each}}
