---
name: retrieving-knowledge
description: "Retrieves project knowledge resources by browsing categories, searching tags, or filtering by keywords. Use when exploring existing knowledge or finding specific documentation entries."
allowed-tools: Read, Grep, Glob
---

## Quick start

List knowledge:
```bash
ls $KNOWLEDGE_PATH/*/  # List categories
grep -r "keyword" $KNOWLEDGE_PATH/
```

## Knowledge retrieval workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Resolve configuration
- [ ] Step 2: Parse search parameters
- [ ] Step 3: Execute search
- [ ] Step 4: Display results
```

**Step 1: Resolve configuration**

- Run: `python ~/.claude/scripts/resolve_config.py "$CWD" retrieving-knowledge`
- Parse JSON output → CONFIG
- CONFIG contains: BASE_PATH

**Step 2: Parse search parameters**

Parse from task prompt:
- CATEGORY (optional): カテゴリ名
- TAG (optional): タグ名
- KEYWORD (optional): 検索キーワード

**Step 3: Execute search**

Resolve paths:
- CONFIG.BASE_PATH required → Error: "CONFIG.BASE_PATH not set"
- KNOWLEDGE_PATH = CONFIG.BASE_PATH + "/knowledge"

| Filter | Method |
|--------|--------|
| CATEGORY | List files in KNOWLEDGE_PATH/{CATEGORY}/ |
| TAG | Read tag-index.json, find matching entries |
| KEYWORD | Grep across all knowledge files |
| (none) | List all categories and counts |

**Step 4: Display results**

- Show matching entries
- Include: category, id, tags
- Offer to show full content

END

---

## Category Management

Knowledge categories are managed in `knowledge/categories.json`.

Categories field contains flat structure:
- All categories evaluated equally
- No priority or hierarchy

