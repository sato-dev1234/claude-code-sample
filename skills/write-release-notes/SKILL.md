---
name: write-release-notes
description: "Creates release notes from git changes with templates (bug-fix/improvement/new-feature) for non-technical stakeholders. Prepares release communications and changelog documentation."
user-invocable: true
allowed-tools: Bash, Read, Write, Skill, Grep, Glob, AskUserQuestion, Task
---

# /write-release-notes

Creates release notes from git changes for non-technical stakeholders.

## Progress Checklist

```
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Resolve TICKET_PATH
- [ ] Step 3: Load project knowledge
- [ ] Step 4: Analyze git changes
- [ ] Step 5: Read templates
- [ ] Step 6: Invoke document-writer agent
- [ ] Step 7: Write output
- [ ] Step 8: Report summary in Japanese
```

## Steps

1. Parse task prompt:
   - output_filename: "release-note.md"
   - BASE_BRANCH: Base branch for comparison (default: develop)

2. Resolve ticket:
   - If TICKET_ID provided in args → use it
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH

3. Load project knowledge:
   - Invoke knowledge-reader agent: `OPERATION=resolve TICKET_PATH=$TICKET_PATH WORKFLOW=/write-release-notes`
   - If KNOWLEDGE_ERROR=true → KNOWLEDGE = []
   - If KNOWLEDGE_STATUS=empty → KNOWLEDGE = []
   - Otherwise → KNOWLEDGE = parsed knowledge array (for Terminology and Specifications sections)

4. Analyze git changes to determine template type:
   - Execute `git log <BASE_BRANCH>...HEAD --oneline` and `git diff <BASE_BRANCH>...HEAD --stat`
   - Classify by commit messages:
     - Bug Fix: "fix", "修正", "不具合", "bug"
     - Improvement: "改善", "improve", "enhance", "refactor"
     - New Feature: "新機能", "add", "feature", "implement"
   - Ambiguous → ask user via AskUserQuestion

5. Read templates (Handlebars format):
   - ./templates/bug-fix.md, ./templates/improvement.md, or ./templates/new-feature.md (based on classification)

6. Invoke document-writer agent via Task tool:
```
CONTENT = git info (Step 4) + template structure (Step 5) + release-note principles:

以下のgit情報からリリースノートを生成してください。

## 入力情報
- コミット: {git log output}
- 変更ファイル: {git diff --stat output}
- テンプレート種別: {bug-fix | improvement | new-feature}
- ビジネス情報: ファイル分類（Frontend/Backend/Database/Configuration）、影響画面、影響API

## リリースノート4原則

以下の原則を適用してください。

1. **ビジネス言語優先**: 非技術者向けに記述。技術用語（API, データベース等）を避け、ビジネス影響で説明。
   - NG: "LoanService.renewを追加"
   - OK: "会員が延長できるようになりました"

2. **影響範囲の明確化**: 影響範囲を明確化。「影響なし」も明示的に記載。
   - 影響がある機能と影響がない機能を両方記載

3. **リグレッション範囲の明示**: テスト範囲を明示。
   - 必須テスト項目とテスト不要項目を記載

4. **対象ユーザーの具体化**: 影響対象を具体化
   - すべてのユーザー / 特定組織 / 新機能のため影響なし

## 出力構造
{テンプレート内容 from Step 5}

KNOWLEDGE = {KNOWLEDGE from Step 3}
LANGUAGE = "ja"
```

If DOCUMENT_ERROR=true → display ERROR_MESSAGE, END
Otherwise → RELEASE_NOTE = DOCUMENT_CONTENT

7. Write RELEASE_NOTE to TICKET_PATH/release-note.md

8. Report summary in Japanese
