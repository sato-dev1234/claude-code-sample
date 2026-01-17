---
name: create-pr
description: "Create Draft PR from current branch with ticket integration and PR description generation"
user-invocable: true
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# /create-pr

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read ticket contents:
   - `<TICKET_PATH>/README.md` → Title, Context
   - `<TICKET_PATH>/requirements.md` → AC items
   - `<TICKET_PATH>/design.md` → Technical approach (if exists)

3. Get current branch info:
   ```bash
   git branch --show-current
   git log --oneline origin/main..HEAD
   git diff origin/main...HEAD --stat
   ```

4. Generate PR description:
   - Title: from ticket title
   - Summary: from requirements and design
   - Test plan: from AC items
   - Related tickets: link to ticket

5. Create Draft PR:
   ```bash
   gh pr create --draft --title "<title>" --body "<body>"
   ```

6. Report in Japanese:
   - PR URL
   - Title
   - Next steps (review, CI checks)

7. Mark `/create-pr` as completed in <TICKET_PATH>/tasks.md Workflow section
