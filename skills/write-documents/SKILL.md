---
name: write-documents
description: "Creates technical documentation with focus on clarity, UI terminology consistency, and Japanese writing quality. Supports API docs, feature specifications, and user guides."
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Task, Skill, Glob, Grep, AskUserQuestion
hooks:
  Stop:
    - hooks:
        - type: command
          command: "bash -c 'node ~/.claude/scripts/task-runner-hook.js'"
---

# /write-documents

Creates technical documentation with focus on clarity and Japanese writing quality.

## Quick Reference

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

## Progress Checklist

```
- [ ] Step 1: Resolve ticket
- [ ] Step 2: Determine scope
- [ ] Step 3: Launch Explore agent
- [ ] Step 4: Detect documentation destination
- [ ] Step 5: Load project knowledge
- [ ] Step 6: Execute document writing workflow
- [ ] Step 7: Report summary in Japanese
```

## Steps

1. Resolve ticket:
   - If TICKET_ID provided in args → use it
   - Else → invoke ticket-reader list, ask user to select via AskUserQuestion → TICKET_PATH

2. Determine scope via AskUserQuestion: uncommitted (`git diff HEAD`) or branch (`git diff <BASE>...HEAD`)

3. Launch Explore agent (via Task tool with subagent_type=Explore) to gather git info → `GATHERED_INFO`
   - "Get git diff (use scope from Step 2). Read changed files. Return diff and file contents."

4. Detect documentation destination from project structure (e.g., `docs/`, `README.md`). If unknown, ask user.

5. Load project knowledge:
   - Invoke knowledge-reader agent: `OPERATION=resolve TICKET_PATH=$TICKET_PATH WORKFLOW=/write-documents`
   - If KNOWLEDGE_ERROR=true → KNOWLEDGE = []
   - If KNOWLEDGE_STATUS=empty → KNOWLEDGE = []
   - Otherwise → KNOWLEDGE = parsed knowledge array

6. Execute document writing workflow:

   ### 6.1 Parse task prompt
   - language: (default: "ja")

   ### 6.2 Invoke document-writer agent
   ```
   CONTENT = GATHERED_INFO + expected structure (Overview → Details → Technical Notes)
   KNOWLEDGE = KNOWLEDGE from Step 5
   LANGUAGE = language from Step 6.1
   ```
   - If DOCUMENT_ERROR=true → display ERROR_MESSAGE, END
   - Otherwise → DOCUMENT_CONTENT = generated content

   ### 6.3 Write output
   - Write DOCUMENT_CONTENT to destination from Step 4

   ### 6.4 Run textlint check
   - Run textlint check if available, fix violations

   ### 6.5 Generate report
   - Generate report: created files, any issues found

7. Report summary in Japanese: created files, any issues found
