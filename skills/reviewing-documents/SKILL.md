---
name: reviewing-documents
description: "Systematic documentation review following document-writer principles. Use when user requests documentation review, quality check, or principle compliance verification."
user-invocable: true
allowed-tools: Read, Bash, Task, Glob, Grep, AskUserQuestion
---

# /reviewing-documents

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Determine target via AskUserQuestion: `markdown file path` or `"キャンセル"`

3. Read document file (path from Step 2) → `GATHERED_INFO`

4. Resolve CONFIG: `python ~/.claude/scripts/resolve_config.py "$CWD" reviewing-documents`

5. Execute review workflow (see below)

6. Process findings:
   a. Filter: remove findings with score < 80
   b. Group: organize by priority (Critical→Standard→Supplementary)

7. Report summary in Japanese
   - Findings with score >= 80 (grouped by priority)
   - Filtered findings with score < 80 (for reference, collapsed)

8. Mark `/reviewing-documents` as completed in <TICKET_PATH>/tasks.md Workflow section

---

## Review workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Load project knowledge
- [ ] Step 2: Read 14 principles
- [ ] Step 3: Execute review checks
- [ ] Step 4: Score each finding (0-100)
- [ ] Step 5: Generate report
```

**Step 1: Load project knowledge**

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/reviewing-documents" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for Terminology section
- On failure: continue without knowledge

**Step 2: Read 14 principles**

Read ~/.claude/skills/writing-documents/reference/principles.md for 14 principles.

**Step 3: Execute review checks**

Execute review checks:
- UI terminology verification
- 14 principles compliance check
- Admonition usage validation

**Step 4: Score each finding (0-100)**

For each finding, assign confidence score based on evidence strength:
- **100**: Absolutely certain, definitely real
- **75**: Highly confident, real and important
- **50**: Moderately confident, real but minor
- **25**: Somewhat confident, might be real
- **0**: Not confident, false positive

**Step 5: Generate report**

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
