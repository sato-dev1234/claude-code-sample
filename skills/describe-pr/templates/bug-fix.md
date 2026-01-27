## 詳細

### 問題点

{{PROBLEM}}

### 原因

{{CAUSE}}

**技術参考**: {{TECH_REFERENCE}}

### 修正内容

{{FIX_DESCRIPTION}}

**修正前後の動作比較**

| 操作 | 修正前 | 修正後 |
|------|-------|-------|
{{#each COMPARISON}}
| {{OPERATION}} | {{BEFORE}} | {{AFTER}} |
{{/each}}

**実装変更**

{{#each IMPLEMENTATION_CHANGES}}
- {{this}}
{{/each}}

**技術参考**:
- 影響ファイル: {{AFFECTED_FILES}}
- テスト追加: {{ADDED_TESTS}}
