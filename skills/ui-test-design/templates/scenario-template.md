# {{FEATURE_NAME}} テストシナリオ

{{#each TEST_CASES}}
## {{INDEX}}. {{TITLE}}

**前提**: {{PRECONDITION}}

### 手順
{{#each STEPS}}
{{INDEX}}. {{OPERATION}}
{{#if VERIFICATIONS}}
   - [ ] {{VERIFICATION}}
{{/if}}
{{/each}}

{{/each}}
