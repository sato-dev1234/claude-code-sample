# Good PR Patterns

## Key Success Patterns

| # | Pattern | Example |
|---|---------|---------|
| 1 | Clear Problem Statement | "検索フィルターで「すべて」を選択時に貸出中書籍が除外される" |
| 2 | Specific Root Cause | "`BookSearchService.kt:142` で `loanStatus` を参照していなかった" |
| 3 | Concrete Solutions | "- `SearchFilterBuilder` で `loanStatus` を考慮するよう修正" |
| 4 | Reproducible Verification | "1. 検索フィルターを「すべて」に設定 → 2. 検索実行 → 3. 貸出中書籍が含まれることを確認" |
| 5 | Regression Awareness | "- [ ] 既存の `availableOnly` フィルターが引き続き動作" |

## Section Formats

### 問題点 (Table Format)

| 観点 | 状態 |
|------|------|
| 影響AC | AC2: ... |
| 影響画面 | 管理画面 > ... |
| 症状 | ... |
| 影響範囲 | ... |
| 再現率 | 100% |

### 原因 (AC Gap Table)

| AC要件 | 期待動作 | 実際の動作 | ギャップ |
|--------|----------|-----------|---------|

### 解決策 (Before/After Table)

| 観点 | Before | After |
|------|--------|-------|

### AC対応表

| AC項目 | 対応変更 | 検証方法 |
|--------|---------|---------|
