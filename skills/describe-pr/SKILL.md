---
name: describe-pr
description: "Creates comprehensive PR descriptions from git changes following project PR template. Analyzes code changes to generate problem statement, root cause, solution approach, and verification items."
user-invocable: true
allowed-tools: Bash, Read, Task, Grep, Glob, AskUserQuestion
---

# /describe-pr

Creates comprehensive PR descriptions from git changes.

## PR Description Guidelines

プロジェクト固有のPR記述ルール。LLM既知の一般原則（簡潔性、技術正確性等）は省略。

### Section Order (Required)

1. **チケット** - `Close PROJ-1234` format
2. **概要** - 1-2 sentences
3. **詳細** - 問題点/原因/解決策
4. **確認項目** - DoD + 3-5 items
5. **確認手順** - `#### 確認項目N` per item
6. **証跡** - Placeholder
7. **リグレッション** - 2-4 related features
8. **懸念点** (optional)
9. **その他** (optional)

### Required Table Formats

#### Before/After Table (MANDATORY)

解決策セクションで必須。具体的な入出力例を含めること。

```markdown
| 観点 | Before | After |
|------|--------|-------|
| 機能 | A only | A + B |
| 設定例 | `${x}` → `X-001` | `${y}` → `Y-abc` |
```

#### Problem Statement Table

問題点セクションで推奨。

```markdown
| 観点 | 状態 |
|------|------|
| 影響機能 | [機能名] |
| 影響画面 | [画面パス] |
| 制限事項 | [できないこと] |
```

#### Implementation-Verification Traceability

実装と検証の対応を明示。

```markdown
| 実装内容 | 検証方法 |
|---------|---------|
| 機能A追加 | 確認項目1 |
| バリデーション | 確認項目2 |
```

### Section Content Guidelines

| Section | Content | Avoid |
|---------|---------|-------|
| 概要 | What changed (plain language) | Technical details |
| 問題点 | User/system impact | Implementation blame |
| 原因 | file:line reference | Vague "バグがあった" |
| 解決策 | By component + Before/After table | Line-by-line changes |
| 確認項目 | Specific, testable scenarios | "動作確認", "バグ修正" |
| 確認手順 | Numbered steps + expected result | "画面で確認" |
| リグレッション | Related features (same model/API/UI) | "全機能が動く" |

### Configuration Notes

- `.env` 変更時: 別リポジトリPR作成手順を記載
- Migration必要時: その他セクションに明記

### Pre-Submit Checklist

- [ ] Before/After table with concrete examples
- [ ] 確認項目 are specific and testable
- [ ] Each 確認項目 has corresponding 確認手順
- [ ] file:line references in 原因
- [ ] Optional sections omitted if N/A

## Progress Checklist

```
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Gather git information
- [ ] Step 3: Read templates (for reference)
- [ ] Step 4: Invoke document-writer agent
- [ ] Step 5: Output PR description
```

## Steps

1. Parse task prompt:
   - BASE_BRANCH: Base branch for comparison (default: develop)
   - TICKET_ID (optional): Associated ticket number
   - TICKET_PATH (optional): Path to ticket directory

2. Gather git information:
   - Execute `git log <BASE_BRANCH>...HEAD --oneline`
   - Execute `git diff <BASE_BRANCH>...HEAD --stat`
   - Execute `git diff <BASE_BRANCH>...HEAD` (full diff for analysis)
   - Read changed files for detailed analysis

3. Read templates (for reference):
   - ./templates/pr-template.md (base structure)
   - ./templates/bug-fix.md (for bug fixes)
   - ./templates/improvement.md (for improvements)
   - ./templates/new-feature.md (for new features)
   - ./examples/good.md and ./examples/bad.md

4. Invoke document-writer agent via Task tool:
```
CONTENT = git info (Step 2) + expected structure:

以下のgit情報からPR説明を生成してください。

## 入力情報
- コミット: {git log}
- 変更ファイル: {git diff --stat}
- 詳細差分: {git diff の要約または重要部分}

## 出力構造
1. チケット - Close {TICKET_ID} format (if TICKET_ID provided)
2. 概要 - 1-2 sentences
3. 詳細
   - 問題点（Problem Statement Table含む）
   - 原因（file:line reference必須）
   - 解決策（Before/After table必須）
4. 確認項目 - DoD + 3-5 items
5. 確認手順 - 各確認項目に対応（#### 確認項目N形式）
6. 証跡 - Placeholder
7. リグレッション - 2-4 related features
8. 懸念点 (optional)
9. その他 (optional)

KNOWLEDGE = [] (or project knowledge if available)
LANGUAGE = "ja"
```

If DOCUMENT_ERROR=true → display ERROR_MESSAGE, END
Otherwise → PR_DESCRIPTION = DOCUMENT_CONTENT

5. Output PR_DESCRIPTION in markdown code block for easy copy-paste.
