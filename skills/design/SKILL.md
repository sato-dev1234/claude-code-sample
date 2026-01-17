---
name: design
description: "Generate design document with Simple Made Easy evaluation"
user-invocable: true
allowed-tools: Read, Write, Bash, Task, Glob, Grep, AskUserQuestion
---

# /design

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read ticket contents → `TICKET_INFO`

3. Load project knowledge for `/design` workflow:
   ```bash
   python ~/.claude/scripts/resolve_knowledge.py \
     --refs "<TICKET_PATH>/knowledge-refs.md" \
     --workflow "/design" \
     --base "$CONFIG.BASE_PATH"
   ```

4. Launch Plan agent to create design document with TICKET_INFO, KNOWLEDGE, CONFIG, and Simple Made Easy evaluation.

   Plan agent (opus)

5. Save design.md:
   - If exists: Ask user for overwrite confirmation, create backup if yes
   - Write <TICKET_PATH>/design.md

6. Update tasks.md:
   - Mark `/design` as completed in Workflow section

7. Report summary in Japanese
