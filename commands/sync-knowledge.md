---
description: "Synchronize knowledge with source code changes"
allowed-tools: "Read, Write, Bash, Glob, Grep, AskUserQuestion"
---

# /sync-knowledge

## Variables

```
KNOWLEDGE_PATH = CONFIG.BASE_PATH + "/knowledge"
STATE_PATH = CONFIG.BASE_PATH + "/.knowledge-state"
```

## 1. Resolve Configuration

- Execute: `python ~/.claude/scripts/resolve_config.py "$CWD" retrieving-knowledge`
- Parse JSON output → CONFIG
- CONFIG.BASE_PATH required → Error if missing: "CONFIG.BASE_PATH not set"

## 2. Validate Knowledge State

- Check STATE_PATH exists
- If not exists → Error: ".knowledge-state not found. Run /collect-knowledge first."

## 3. Detect Source Changes

For each state file in STATE_PATH:
- Read .knowledge-state/{category}/{id}.json
- Execute: `git diff --name-status {commit}..HEAD`
- Compare refs with changed files
- Classify: high (D:deleted) / medium (M,R:modified/renamed) / low (unchanged)

## 4. Report Changes

Display summary:
- High impact: files requiring immediate knowledge update
- Medium impact: files potentially needing review
- Low impact: no action needed

## 5. Update Knowledge (Interactive)

For high/medium impact items:
- AskUserQuestion: "Update this knowledge? [Y/n]"
- If Y: Read source changes, update knowledge content
- Update commit hash in state file

## 6. Rebuild Index

- Execute: `python ~/.claude/scripts/build_tag_index.py "$KNOWLEDGE_PATH"`

## 7. Report

Display summary:
- Knowledge files updated
- New commit hash recorded

