---
name: reviewing-documents
description: "Systematic documentation review following document-writer principles. Use when user requests documentation review, quality check, or principle compliance verification."
allowed-tools: Read, Grep, Glob, Bash
---

## Review workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Parse GATHERED_INFO, TICKET_PATH, and CONFIG
- [ ] Step 2: Load project knowledge
- [ ] Step 3: Read 14 principles
- [ ] Step 4: Execute review checks
- [ ] Step 5: Score each finding (0-100)
- [ ] Step 6: Generate report
```

**Step 1: Parse GATHERED_INFO, TICKET_PATH, and CONFIG**

Parse from task prompt:
- GATHERED_INFO: target document content
- TICKET_PATH: target ticket folder path
- CONFIG: project configuration

**Step 2: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/doc-review" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for Terminology section
- On failure: continue without knowledge

**Step 3: Read 14 principles**

Read ~/.claude/skills/writing-documents/reference/principles.md for 14 principles.

**Step 4: Execute review checks**

Execute review checks:
- UI terminology verification
- 14 principles compliance check
- Admonition usage validation

**Step 5: Score each finding (0-100)**

For each finding, assign confidence score based on evidence strength:
- **100**: Absolutely certain, definitely real
- **75**: Highly confident, real and important
- **50**: Moderately confident, real but minor
- **25**: Somewhat confident, might be real
- **0**: Not confident, false positive

**Step 6: Generate report**

Output format:

```markdown
## ドキュメントレビュー結果

### サマリー
- 対象: [ファイル名]
- 違反数: N件

Found X issues:

1. [Score: 95] location - Description
   
   原則: [原則名]
   問題: [問題の説明]
   修正案: [修正案]

2. [Score: 82] location - Description
   
   原則: [原則名]
   問題: [問題の説明]
   修正案: [修正案]
```
