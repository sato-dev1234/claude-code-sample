---
name: writing-documents
description: "Technical documentation creation with focus on clarity, UI terminology consistency, and Japanese writing quality. Use when creating or reviewing technical documentation, API docs, feature specifications, or user guides."
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, AskUserQuestion
---

## Quick start

Documentation structure:
```markdown
## Overview
[1-2 sentences: what and why]

## Details
[Step-by-step or feature breakdown]

## Technical Notes
[Implementation details for developers]
```

Run textlint validation:
```bash
npx textlint docs/your-document.md
```

## Document writing workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Read principles
- [ ] Step 3: Parse REQUIREMENTS and KNOWLEDGE
- [ ] Step 4: Create documentation
- [ ] Step 5: Run textlint check
- [ ] Step 6: Generate report
```

**Step 1: Parse task prompt**

Parse from task prompt:
- language: (default: "ja")

**Step 2: Read principles**

Read ./reference/principles.md for 14 documentation principles.

**Step 3: Parse REQUIREMENTS and KNOWLEDGE**

Parse REQUIREMENTS from task prompt (document type, source info, target audience).

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/doc-write" --base "${CONFIG.BASE_PATH}"`

- On success/partial: use `knowledge[].content` for Terminology section

**Step 4: Create documentation**

Create documentation following principles:
- Use language from config (default: Japanese)
- If Japanese: Use natural Japanese (avoid programming jargon)
- Match UI terminology from project dictionary
- Structure with Overview → Details → Technical flow

**Step 5: Run textlint check**

Run textlint check if available, fix violations.

**Step 6: Generate report**

Generate report: created files, principles applied, any issues found.
