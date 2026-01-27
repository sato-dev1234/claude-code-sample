## 詳細

### 背景

{{BACKGROUND}}

### 要件

{{#each REQUIREMENTS}}
- {{this}}
{{/each}}

### 追加機能

{{FEATURE_DESCRIPTION}}

**使用パターンと出力例**

| 使用パターン | 出力例 |
|-------------|-------|
{{#each USAGE_PATTERNS}}
| {{PATTERN}} | {{OUTPUT}} |
{{/each}}

{{#if HAS_FEATURE_TABLE}}
**機能の特徴**

| 特徴 | 説明 |
|------|------|
{{#each FEATURES}}
| {{NAME}} | {{DESCRIPTION}} |
{{/each}}
{{/if}}

### 実装内容

**処理フロー**

| Step | 処理 | 内容 |
|------|------|------|
{{#each FLOW_STEPS}}
| {{STEP}} | {{PROCESS}} | {{DETAIL}} |
{{/each}}

**技術参考**:
- 影響ファイル: {{AFFECTED_FILES}}
- テスト追加: {{ADDED_TESTS}}
