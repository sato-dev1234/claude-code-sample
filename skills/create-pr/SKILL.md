---
name: create-pr
description: "Creates Draft PR from current branch with ticket integration and PR description generation"
user-invocable: true
allowed-tools: Read, Bash, Task, Skill, Glob, Grep, AskUserQuestion
---

# /create-pr

Creates Draft PR from current branch with ticket integration.

## Progress Checklist

```
- [ ] Step 1: Resolve TICKET_PATH
- [ ] Step 2: Read ticket contents
- [ ] Step 3: Get current branch info
- [ ] Step 4: Generate PR description
- [ ] Step 5: Create Draft PR
- [ ] Step 6: Move ticket to completed status
- [ ] Step 7: Report results
```

## Steps

1. Resolve ticket:
   - If TICKET_ID provided in args → use it
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH

2. Read ticket contents:
   - `<TICKET_PATH>/README.md` → Title, Context, TICKET_ID
   - `<TICKET_PATH>/requirements.md` → AC items
   - `<TICKET_PATH>/design.md` → Technical approach (if exists)

3. Get current branch info:
   ```bash
   git branch --show-current
   git log --oneline origin/main..HEAD
   git diff origin/main...HEAD --stat
   git diff origin/main...HEAD
   ```

4. Invoke document-writer agent:
   ```
   CONTENT = ticket info (Step 2) + git info (Step 3) + expected structure:

   以下の情報からPR説明を生成してください。

   ## チケット情報
   - チケットID: {TICKET_ID}
   - タイトル: {title from README.md}
   - 受入条件: {AC from requirements.md}
   - 設計概要: {from design.md if exists}

   ## Git情報
   - コミット: {git log}
   - 変更ファイル: {git diff --stat}
   - 詳細差分: {git diff の要約または重要部分}

   ## 出力構造
   1. チケット - Close {TICKET_ID} format
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
   - If DOCUMENT_ERROR=true → display ERROR_MESSAGE, END
   - Otherwise → PR_BODY = DOCUMENT_CONTENT

5. Create Draft PR:
   ```bash
   gh pr create --draft --title "<title from ticket>" --body "<PR_BODY>"
   ```

6. Move ticket to completed status:
   - Extract TICKET_ID from TICKET_PATH
   - Invoke ticket-writer agent:
     ```
     OPERATION=complete
     TICKET_ID=$TICKET_ID
     ```
   - If TICKET_COMPLETED=true: display "Ticket moved to completed"
   - If TICKET_ERROR=true: display warning, continue

7. Report in Japanese:
   - PR URL
   - Title
   - Next steps (review, CI checks)
