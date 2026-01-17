---
name: init-project
description: "Initialize project configuration"
user-invocable: true
allowed-tools: Read, Write, Bash, AskUserQuestion, Glob
---

# /init-project

## Variables

```
GLOBAL_CONFIG = ~/.claude/global-config.yaml
TEMPLATE = ~/.claude/templates/project-template.yaml
storage_path = GLOBAL_CONFIG.paths.storage_path
PROJECT_NAME = $(python ~/.claude/scripts/get_project_name.py "$(pwd)")
BASE_PATH = {storage_path}/{PROJECT_NAME}
```

## 1. Require Global Config

- GLOBAL_CONFIG not exists OR storage_path not set → Error: "Run /init-global first"

## 2. Confirm Project Name

AskUserQuestion: "Project name?" (default: PROJECT_NAME)
- Empty → Error

## 3. Require Template

- TEMPLATE not exists → Error

## 4. Check Existing Config

- `BASE_PATH/project-config.yaml` exists → AskUserQuestion: "Overwrite?" (Yes/No)
- No → Exit

## 5. Create Directories

Read STATUSES from TEMPLATE.tickets.statuses

```
BASE_PATH/
├── tickets/{STATUSES}/
└── knowledge/
```

Create categories.json:
```json
{
  "categories": {
    "ui": { "description": "UI画面、コンポーネント、UIロジック" },
    "api": { "description": "HTTPエンドポイント、REST API仕様" },
    "common": { "description": "システム横断的な知識、共通処理" }
  }
}
```

Write to: `BASE_PATH/knowledge/categories.json`

## 6. Generate Config

Read TEMPLATE, apply replacements:

| Placeholder | Value |
|-------------|-------|
| `PROJ-` | TICKET_PREFIX (各単語頭文字 + "-") |

Write to `BASE_PATH/project-config.yaml`

## 7. Output

```
✓ Project initialized
- Project: <PROJECT_NAME>
- Base Path: <BASE_PATH>
```
