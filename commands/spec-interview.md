---
description: "Interview user to refine spec using AskUserQuestion"
allowed-tools: "Read, Write, AskUserQuestion"
---

# /spec-interview

1. Select target ticket via managing-tickets → `TICKET_PATH`

2. Read `<TICKET_PATH>/requirements.md`

3. Interview me in detail using AskUserQuestion about literally anything:
   technical implementation, UI & UX, concerns, tradeoffs, etc.
   But make sure the questions are not obvious.

4. Be very in-depth and continue interviewing continually until it's complete.

5. Write the spec to `<TICKET_PATH>/requirements.md`

6. Mark `/spec-interview` as completed in `<TICKET_PATH>/tasks.md` Workflow section

7. Execute managing-tickets skill with add-knowledge-ref operation to regenerate knowledge-refs.md from the updated requirements.md
