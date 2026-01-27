---
name: init-project
description: "Initializes project configuration"
user-invocable: true
allowed-tools: Read, Write, Bash, AskUserQuestion, Glob
---

# /init-project

Initializes project configuration.

## Progress Checklist

```
- [ ] Step 1: Check Global Config
- [ ] Step 2: Confirm Project Name
- [ ] Step 3: Check Existing Config
- [ ] Step 4: Create Directories
- [ ] Step 5: Detect Test File Patterns
- [ ] Step 6: Get Ticket Prefix
- [ ] Step 7: Update settings.local.json
- [ ] Step 8: Update .git/info/exclude
- [ ] Step 9: Output
```

## Steps

### Variables

```
GLOBAL_SH = ~/.claude/global.sh
PROJECT_NAME = $(basename "$(git remote get-url origin)" .git) || $(basename "$(pwd)")
PROJECT_DATA_DIR = $STORAGE_DIR/$PROJECT_NAME
```

### 1. Check Global Config

- Source GLOBAL_SH to get STORAGE_DIR
- If GLOBAL_SH not exists OR STORAGE_DIR not set:
  - Execute Global Setup Flow (below), then continue to Step 2

#### Global Setup Flow

1. AskUserQuestion: "storage_dir を入力してください（プロジェクトデータの保存先）"
   - Default: `~/Documents/project-management`
2. Validate:
   - Expand `~` to absolute path
   - Parent directory not exists → Error
   - storage_dir directory not exists → Create it
3. Write to `~/.claude/global.sh` (convert to Unix format: `D:/path` → `/d/path`):
   ```bash
   export STORAGE_DIR="<INPUT>"
   ```
4. Set STORAGE_DIR variable and continue

### 2. Confirm Project Name

AskUserQuestion: "Project name?" (default: $PROJECT_NAME)
- Empty → Error

### 3. Check Existing Config

Read `.claude/settings.local.json` in project root.

If file exists AND has `env.PROJECT_NAME`:
- AskUserQuestion: "既存の設定を上書きしますか？" (Yes/No)
- No → Exit

### 4. Create Directories

Create directories:
- `$PROJECT_DATA_DIR/tickets/backlog/`
- `$PROJECT_DATA_DIR/tickets/in-progress/`
- `$PROJECT_DATA_DIR/tickets/in-review/`
- `$PROJECT_DATA_DIR/tickets/blocked/`
- `$PROJECT_DATA_DIR/tickets/pending/`
- `$PROJECT_DATA_DIR/tickets/completed/`
- `$PROJECT_DATA_DIR/tickets/archived/`
- `$PROJECT_DATA_DIR/knowledge/`

Write `$PROJECT_DATA_DIR/knowledge/categories.json` (skip if exists):
```json
{
  "categories": {
    "ui": { "description": "UI画面、コンポーネント、UIロジック" },
    "api": { "description": "HTTPエンドポイント、REST API仕様" },
    "common": { "description": "システム横断的な知識、共通処理" }
  }
}
```

### 5. Detect Test File Patterns

Glob for test files → collect matching glob patterns

If patterns found:
- AskUserQuestion: "使用するテストファイルパターンは？" (multiSelect)
  - Options: detected patterns + "なし"
- Set $TEST_FILTER = selected pattern(s), comma-separated

If no patterns found:
- $TEST_FILTER = ""

### 6. Get Ticket Prefix

AskUserQuestion: "チケットIDのプレフィックスを入力してください"
- Default: "PROJ-"
- Set $TICKETS_PREFIX = input

### 7. Update settings.local.json

Path: `.claude/settings.local.json` (in project root)

Calculate paths (convert to Unix format: `D:/path` → `/d/path`):
- `TICKETS_DIR` = `$PROJECT_DATA_DIR/tickets`
- `KNOWLEDGE_DIR` = `$PROJECT_DATA_DIR/knowledge`
- `STATE_DIR` = `$PROJECT_DATA_DIR/.knowledge-state`
- `SKILLS_DIR` = `~/.claude/skills` (expand to absolute path)

Merge into env section:
- PROJECT_NAME, TICKETS_DIR, KNOWLEDGE_DIR, STATE_DIR, SKILLS_DIR
- TEST_FILTER, TICKETS_PREFIX
- TICKETS_DIGITS = "5"
- TICKETS_ON_CREATE = "backlog"
- TICKETS_ON_START = "in-progress"
- TICKETS_ON_COMPLETE = "completed"

Keep other sections unchanged (permissions, etc.)

### 8. Update .git/info/exclude

If `.git/info/exclude` exists, append entries not yet listed:
- `.claude/settings.local.json`
- `.claude/refine-loop/`
- `.claude/auto-run/`

### 9. Output

Display PROJECT_NAME and PROJECT_DATA_DIR
