# {{FEATURE_NAME}} テストシナリオ

{{#if TERMINOLOGY}}
> **用語定義**: 本ドキュメントでは以下の用語を使用します。
{{#each TERMINOLOGY}}
> - **{{TERM}}**: {{DEFINITION}}
{{/each}}
{{/if}}

{{#if COMMON_STEPS}}
## 共通手順

以下の手順は全シナリオで共通です。各シナリオは{{COMMON_STEPS_COMPLETE_STATE}}から開始してください。

{{#each COMMON_STEPS}}
{{INDEX}}. {{STEP}}
{{/each}}

---
{{/if}}

{{#each TEST_CASES}}
## {{INDEX}}. {{TITLE}}

**前提**: {{PRECONDITION}}

### 手順
{{#each STEPS}}
{{INDEX}}. {{OPERATION}}
{{#if VERIFICATION_GROUPS}}
{{#each VERIFICATION_GROUPS}}

#### {{GROUP_NAME}}
{{#each VERIFICATIONS}}
- [ ] {{VERIFICATION}}
{{/each}}
{{/each}}
{{else if VERIFICATIONS}}
{{#each VERIFICATIONS}}
   - [ ] {{VERIFICATION}}
{{/each}}
{{/if}}
{{#if PATTERN_TABLE}}

{{PATTERN_TABLE}}

- [ ] 上記{{PATTERN_COUNT}}パターンすべてで{{PATTERN_VERIFICATION}}を確認
{{/if}}
{{/each}}

{{/each}}

{{#if SUPPLEMENTARY}}
## 補足事項
{{SUPPLEMENTARY}}
{{/if}}
