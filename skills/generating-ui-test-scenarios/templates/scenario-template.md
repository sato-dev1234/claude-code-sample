# {{FEATURE_NAME}} テストシナリオ

{{#each TEST_CASES}}
## {{INDEX}}. {{TITLE}}

### 前提条件
{{#each PRECONDITIONS}}
- {{this}}
{{/each}}

### 操作手順
{{#each OPERATIONS}}
{{INDEX}}. {{this}}
{{/each}}

### 確認項目
{{#each VERIFICATIONS}}
- [ ] {{this}}
{{/each}}

{{/each}}
