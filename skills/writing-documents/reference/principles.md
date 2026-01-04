# Documentation Principles

LLMが生成する読みづらい文章を矯正するための原則。

## LLM矯正原則

### 日本語品質（1-3）

- 1. **Use Natural Japanese** - Avoid programming jargon (スローする, リターンする), use general Japanese
- 2. **Follow Textlint Rules** - Avoid redundant expressions (〜を行う → 〜する) and doubled particles
- 3. **Avoid Sentence-Ending Colons** - Do not end sentences with `:` or `：`

### 簡潔性（4-8）

- 4. **Eliminate Redundant Explanations** - If process flow is clear, results are self-evident (この仕組みにより〜 を削除)
- 5. **Keep Overview Sections Concise** - State document purpose only (1-3 sentences), details belong in specific sections
- 6. **Avoid Outcome/Benefit Statements** - If feature description is clear, benefits are self-evident (〜できます, 〜を削減 を削除)
- 7. **Avoid Abstract Verbs** - Specify concrete changes, not "improved" or "optimized" (改善しました → 具体的な変更内容)
- 8. **Explain Reasons Concisely** - Provide technical justification in 2-3 sentences

### 視覚表現（9）

- 9. **Use Emphasis Sparingly** - H2→H3→H4 only; 1 bold per sentence maximum

### 技術文書（10-12）

- 10. **Avoid Implementation Details** - Describe what features do, not how they're implemented; no internal class/method names
- 11. **Explicitly State Conditional Behavior** - Clearly state when behavior varies by conditions; avoid "always"/"must"
- 12. **Distinguish Admonitions** - Use correct admonition types (see below)

## プロジェクト固有（13-14）

- 13. **Match UI Terminology** - Use exact terms users see in the interface
- 14. **Standardize Document Structure** - Use consistent structure: Overview → Process Flow → Error Cases


## よくある間違い

### 実装詳細の露出

```
❌ LoanRepository.ExtendLoanPeriod() を呼び出して貸出期間を延長します。
✅ 貸出期間を延長します。
```

### 抽象動詞の使用

```
❌ エラーハンドリングを改善しました。
✅ 接続タイムアウト時に3回まで自動リトライします。
```

### 効果の明示

```
❌ 貸出期限超過時に自動通知が可能になり、手作業を大幅に削減できます。
✅ 貸出期限超過時に自動通知が可能になります。
```

### 冗長な日本語表現

```
❌ 書籍の返却を行います。
✅ 書籍を返却します。
```

### プログラミング用語

```
❌ エラーが発生した場合、例外をスローします。
✅ エラーが発生した場合、処理を失敗させます。
```

### 冗長な概要

```
❌ ## 概要
このドキュメントでは、会員退会機能について説明します。
まず未返却書籍を確認し、次に貸出履歴をアーカイブし、最後に退会フラグを設定します。

✅ ## 概要
このドキュメントでは、会員退会機能の動作仕様を説明します。
```

### 太字の誤用

```
❌ 次に、**extendLoan() を呼び出し**、貸出期間を延長します。

✅ ### 貸出期間の延長 - extendLoan()
貸出期間を延長します。
```

### 文末コロン

```
❌ このエラーは、以下のシナリオで発生する可能性があります：
✅ このエラーは以下のシナリオで発生します。
```


## Admonition使い分け

| 種類 | 目的 |
|------|------|
| `:::info` | ドキュメント自体のお知らせ（スコープ、参照先） |
| `:::note` | 設計や実装の補足説明・理由 |
| `:::tip` | ベストプラクティスや推奨事項 |
| `:::warning` | ドキュメントの状態（TODO、工事中） |
| `:::caution` | 操作時に注意が必要な事項 |
| `:::danger` | 重大なリスクや取り返しのつかない操作 |

### info vs note の区別

| 観点 | `:::info` | `:::note` |
|------|-----------|-----------|
| 対象 | ドキュメント自体 | 設計・実装 |
| 内容 | スコープ、参照先 | 技術的理由、制約 |
| 読者の疑問 | 「どこに書いてある？」 | 「なぜそうなっている？」 |

### 誤用パターン

**スコープ説明に note を使用:**
```markdown
❌ :::note
貸出履歴の統計機能についてはこのページには記載しません。
:::

✅ :::info
貸出履歴の統計機能についてはこのページには記載しません。
:::
```

**設計理由に info を使用:**
```markdown
❌ :::info
会員退会時に貸出履歴を保持する理由は、監査対応のためです。
:::

✅ :::note
会員退会時に貸出履歴を保持する理由は、監査対応のためです。
:::
```

**操作の注意に warning を使用:**
```markdown
❌ :::warning
書籍の完全削除は慎重に行ってください。
:::

✅ :::caution
書籍の完全削除は慎重に行ってください。貸出履歴も含めて復元できません。
:::
```
