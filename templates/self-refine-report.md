## 修正した問題

{{#each FIXED_ISSUES}}
- [Score: {{SCORE}}] {{FILE}}:{{LINE}} - {{PROBLEM}} → {{FIX}}
{{/each}}

## 修正しなかった問題（スコア80以上）

{{#each UNFIXED_ISSUES}}
- [Score: {{SCORE}}] {{FILE}}:{{LINE}} - {{PROBLEM}} - {{REASON}}
{{/each}}

## 参考（スコア80未満）

{{#each REFERENCE_ISSUES}}
- [Score: {{SCORE}}] {{FILE}}:{{LINE}} - {{PROBLEM}}
{{/each}}

## Fixes Applied

{{FIXES_APPLIED}}
