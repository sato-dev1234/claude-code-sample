---
description: "Collect knowledge from source code analysis"
allowed-tools: "Read, Write, Bash, AskUserQuestion, Glob, Grep"
---

# /collect-knowledge

## Variables

```
KNOWLEDGE_PATH = CONFIG.BASE_PATH + "/knowledge"
STATE_PATH = CONFIG.BASE_PATH + "/.knowledge-state"
```

## 1. Resolve Configuration

- Execute: `python ~/.claude/scripts/resolve_config.py "$CWD" retrieving-knowledge`
- Parse JSON output → CONFIG
- CONFIG.BASE_PATH required → Error if missing: "CONFIG.BASE_PATH not set"

## 2. Get Source Files

AskUserQuestion: "Source file path or glob pattern?"
- Resolve globs → SOURCE_FILES
- Validate files exist

## 3. Analyze Source Code

For each source file:
- Read file content
- Extract documentation-worthy concepts

## 4. Load or Create Categories

- Read: KNOWLEDGE_PATH/categories.json
- If not exists → Create empty template: `{"categories": {}}`

## 5. Generate Knowledge Entries

For each identified concept:
- Determine category (from existing or propose new)
- If new category → Add to categories.json
- Generate id, tags, related
- Structure content (Terminology, Specifications, Troubleshooting)

## 6. Confirm Bulk Creation

AskUserQuestion: Show all entries for confirmation
- Options: [Create all] [Modify] [Cancel]

## 7. Create Files

For each confirmed entry:
- Create KNOWLEDGE_PATH/{category}/{id}.md with YAML frontmatter
- Create STATE_PATH/{category}/{id}.json with refs and commit

## 8. Rebuild Index

- Execute: `python ~/.claude/scripts/build_tag_index.py "$KNOWLEDGE_PATH"`

## 9. Report

Display summary:
- Categories used
- Knowledge files created
- Source files analyzed

