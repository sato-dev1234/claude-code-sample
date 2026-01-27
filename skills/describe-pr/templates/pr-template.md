## 概要

{{SUMMARY}}

## 詳細

### 問題点

{{PROBLEM}}

### 原因

{{CAUSE}}

### 解決策

{{#each CHANGES}}
- [{{COMPONENT}}]: {{DESCRIPTION}}
{{/each}}

## 確認項目

{{#each VERIFICATION_ITEMS}}
- [ ] {{this}}
{{/each}}

### 確認手順

{{#each VERIFICATION_STEPS}}
#### {{TITLE}}
{{#each STEPS}}
{{INDEX}}. {{this}}
{{/each}}
{{/each}}

{{#if HAS_EVIDENCE}}
### 証跡

{{EVIDENCE}}
{{/if}}

### リグレッション確認

{{#each REGRESSION_ITEMS}}
- [ ] {{this}}
{{/each}}

{{#if HAS_CONCERNS}}
## 懸念点・注意点

{{#each CONCERNS}}
- {{this}}
{{/each}}
{{/if}}
