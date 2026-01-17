# {{FEATURE_NAME}} テスト設計

## 対象

- **機能**: {{AFFECTED_FEATURES}}
- **画面**: {{UI_COMPONENTS}}
- **依存**: {{DEPENDENCIES}}

{{#if HAS_FACTORS}}
## 因子・水準

| 因子 | 水準 | 制約 |
|------|------|------|
{{#each FACTORS}}
| {{NAME}} | {{LEVELS}} | {{CONSTRAINTS}} |
{{/each}}
{{/if}}

## セッション一覧

| # | セッション | ケース数 | 時間 | 観点 |
|---|-----------|---------|------|------|
{{#each SESSIONS}}
| {{INDEX}} | {{NAME}} | {{COUNT}} | {{DURATION}} | {{FOCUS}} |
{{/each}}
| | **合計** | **{{TOTAL_COUNT}}** | **{{TOTAL_DURATION}}** | |

## 実行順序

{{#each SESSIONS}}
{{INDEX}}. {{NAME}}{{#if IS_OPTIONAL}}（時間があれば）{{/if}}
{{/each}}

**部分実行**:
- 最小: {{MINIMUM_SCOPE}}
- 標準: {{STANDARD_SCOPE}}

{{#if HAS_COVERAGE_MATRIX}}
## カバレッジ

| 因子 | {{#each COVERAGE_HEADERS}}{{this}} | {{/each}}
|------|{{#each COVERAGE_HEADERS}}---|{{/each}}
{{#each COVERAGE_ROWS}}
| {{FACTOR}} | {{#each VALUES}}{{this}} | {{/each}}
{{/each}}
{{/if}}
