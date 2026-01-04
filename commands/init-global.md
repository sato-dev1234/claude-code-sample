---
description: "Initialize global configuration (storage_path)"
allowed-tools: "Read, Write, Bash, AskUserQuestion"
---

# /init-global

## 1. Check Existing

```
CONFIG_PATH = ~/.claude/global-config.yaml
```

- CONFIG_PATH exists → Read `paths.storage_path`, AskUserQuestion: "Update existing storage_path: <current>?" (Yes/No)
- User selects No → Exit

## 2. Get storage_path

AskUserQuestion:
- Question: "storage_path を入力してください（プロジェクトデータの保存先）"
- Default: `~/Documents/project-management`

## 3. Validate & Create

- Expand `~` to absolute path
- Parent directory not exists → Error
- storage_path directory not exists → Create it

## 4. Write

```yaml
# ~/.claude/global-config.yaml
paths:
  storage_path: "<INPUT>"
```

## 5. Output

```
✓ Global configuration initialized
- storage_path: <storage_path>
```
