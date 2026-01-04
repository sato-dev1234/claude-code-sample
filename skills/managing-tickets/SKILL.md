---
name: managing-tickets
description: "Manages project tickets - list, show, create, update, and move. Use when listing tickets, showing ticket details, creating new tickets, updating ticket content, or moving tickets between statuses."
allowed-tools: Read, Write, Grep, Glob, AskUserQuestion, Bash
---

## Quick start

List all tickets:
```bash
find $TICKETS_PATH -name "README.md" -exec grep -l "Status:" {} \;
```

Create new ticket:
```bash
mkdir -p $TICKETS_PATH/{ON_CREATE}/$TICKET_ID
# Generate: README.md, requirements.md, tasks.md
```

Move ticket:
```bash
mv $TICKETS_PATH/{old_status}/$TICKET_ID $TICKETS_PATH/{new_status}/$TICKET_ID
```

## Ticket management workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Resolve configuration
- [ ] Step 2: Parse task prompt
- [ ] Step 3: Resolve paths
- [ ] Step 4: Read templates
- [ ] Step 5: Read reference materials
- [ ] Step 6: Execute operation
```

**Step 1: Resolve configuration**

Resolve configuration:
- Execute: `python ~/.claude/scripts/resolve_config.py "$CWD" managing-tickets`
- Parse JSON output → `CONFIG`
- CONFIG contains: BASE_PATH, TICKETS

**Step 2: Parse task prompt**

Parse from task prompt:
- output_path: "tickets"
- TICKET_PREFIX: from CONFIG.TICKETS.prefix (e.g., "CCMD-")
- TICKET_DIGITS: from CONFIG.TICKETS.digits (default: 5)
- STATUSES: from CONFIG.TICKETS.statuses
- ON_CREATE: from CONFIG.TICKETS.on_create
- ON_START: from CONFIG.TICKETS.on_start
- ON_COMPLETE: from CONFIG.TICKETS.on_complete
- OPERATION: "list" | "show" | "create" | "update" | "move" | "add-knowledge-ref" | (not specified)
- TICKET_ID (optional)
- REQUIREMENTS (optional): Requirements description from user

**Step 3: Resolve paths**

Resolve paths:
- TICKETS_PATH = CONFIG.BASE_PATH + "/" + output_path

**Step 4: Read templates**

Read templates (Handlebars format):
- ./templates/readme-template.md
- ./templates/requirements-template.md
- ./templates/tasks-template.md
- ./templates/knowledge-refs-template.md

**Step 5: Read reference materials**

Read reference materials:
- ./examples/good.md and ./examples/bad.md for quality guidance

**Step 6: Execute operation**

Execute based on OPERATION:

| OPERATION | Summary |
|-----------|---------|
| (not specified) | Interactive ticket selection |
| list | Display all tickets |
| show | Display ticket details |
| create | Create new ticket |
| update | Update ticket files |
| move | Move ticket to new status |
| add-knowledge-ref | Regenerate knowledge-refs.md from requirements.md |

### (not specified) - Interactive Selection
- Display ticket list (same as "list")
- Ask user to select ticket or "新規作成"
- Existing ticket selected:
  - Extract status from TICKET_PATH directory name
  - If status == ON_CREATE:
    - Ask: "このチケットは{status}にあります。{ON_START}に移動しますか？"
    - If Yes: mv to {ON_START}, update TICKET_PATH
  - Output: TICKET_PATH=<selected_ticket_folder_path>, END
- "新規作成" selected → proceed to "create"

### list
- Glob pattern="**/README.md" in TICKETS_PATH
- Display ticket list with status and title
- END

### show
- TICKET_ID not provided → ask via AskUserQuestion
- Read ticket folder contents (README.md, requirements.md, tasks.md)
- Display ticket details
- Output: TICKET_PATH=<ticket_folder_path>
- END

### create

#### Auto-numbering (when TICKET_ID not provided)
Execute:
```bash
python ~/.claude/scripts/next_ticket_id.py "$TICKETS_PATH" "$TICKET_PREFIX" "$TICKET_DIGITS"
```
→ GENERATED_ID

If script fails → show error message from stderr, END with exit code 1

#### Identify ticket ID
0. Determine candidate ID:
   - If TICKET_ID provided → use as candidate
   - If not provided → use GENERATED_ID as candidate

1. Confirm with AskUserQuestion:
   - Pre-fill candidate ID
   - If user accepts → proceed with candidate
   - If user modifies → use modified ID as candidate

2. Validate candidate ID:
   - Pattern check: candidate starts with TICKET_PREFIX and has correct digit count
   - Duplicate check: `find $TICKETS_PATH -type d -name "$CANDIDATE_ID"` returns empty
   - If invalid → show error, go back to step 2

#### Gather requirements
- If REQUIREMENTS provided in task prompt → use REQUIREMENTS
- If REQUIREMENTS not provided → ask user for requirements (direct text or file path)
- If file path provided → read file content into REQUIREMENTS

#### Parse requirements
- Extract AC items (search for "AC:", numbered lists with "must/should")
- Extract context (timeline, feature name)
- Identify edge cases and technical constraints

#### Generate files following template structure
- README.md: Overview, Context, Scope, Files links
- requirements.md: AC items, Edge Cases, Technical Considerations, Verification Summary
- tasks.md: Current Phase, Tasks (Design, Implementation, Review, Documentation)
- knowledge-refs.md: Related knowledge references
  - KNOWLEDGE_PATH = CONFIG.BASE_PATH + "/knowledge"
  - Tag-based selection flow:
    1. Extract keywords from requirements
    2. Read KNOWLEDGE_PATH/tag-index.json
       - If not exists → Error: "tag-index.json not found at <path>", END with exit code 1
    3. Match keywords against tags in index using strict matching:
       - Exact match (case-insensitive): keyword == tag
       - Word boundary match: keyword as whole word in tag (regex: \bkeyword\b)
       - Delimiter-separated match: keyword matches hyphen/underscore/space-separated part
       - Example: "test" matches "test", "test-driven", "unit-test" but NOT "contest"
    4. For matching tags → collect candidate knowledge files
    5. Display candidates with matched tags
    6. Determine workflow section for each knowledge file using LLM (design/tdd/code-review/ui-test-design/doc-write/doc-review)
    7. Create data structure:
       ```json
       {
         "TICKET_ID": "<ticket_id>",
         "design_refs": [{"path": "knowledge/..."}, ...],
         "tdd_refs": [...],
         "code_review_refs": [...],
         "ui_test_design_refs": [...],
         "doc_write_refs": [...],
         "doc_review_refs": [...]
       }
       ```
    8. If no matches → data structure has empty arrays for all sections
    9. Execute: `echo '<json>' | python ~/.claude/scripts/regenerate_knowledge_refs.py "$TICKET_PATH" "$KNOWLEDGE_PATH"`
       - If error → Error: display error message, END with exit code 1

#### Write files
- Write all 4 files to TICKETS_PATH/{ON_CREATE}/<TICKET_ID>/

- Output: TICKET_PATH=<TICKETS_PATH>/{ON_CREATE}/<TICKET_ID>/
- END

### update
- TICKET_ID not provided → ask via AskUserQuestion to select ticket
- Read current ticket files (requirements.md, tasks.md)
- Ask update target:
  - "requirements" → update requirements.md
  - "workflow" → update tasks.md (includes Workflow and Tasks)
  - "both" → update both files
- For requirements.md:
  - Display current AC items with status
  - Ask which items to mark as completed
  - Update checkbox states ([ ] → [x])
  - Recalculate Verification Summary counts
- For tasks.md:
  - Display current Workflow commands with status
  - Display current Tasks with status
  - Ask which items to mark as completed/skipped
  - Update checkbox states ([ ] → [x] or [-] for skip)
  - Update Current Phase if needed
  - Update Summary table
- Write updated files
- Output: TICKET_PATH=<ticket_folder_path>
- END

### move
- TICKET_ID not provided → ask via AskUserQuestion to select ticket
- Read current ticket location and status
- Ask new status: {STATUSES}
- Moving to "{ON_COMPLETE}" with unchecked items → warn user: "チェックリストに未完了項目があります" → ask confirmation
- Move folder: `mv <old_path> <new_path>`
- Update README.md Status field
- Output: TICKET_PATH=<new_ticket_folder_path>
- END

### add-knowledge-ref
- TICKET_ID not provided → ask via AskUserQuestion to select ticket
- Read TICKET_PATH/requirements.md (full content)
- Extract keywords using LLM (extract related technical terms/concepts from requirements.md content)
- Read KNOWLEDGE_PATH/tag-index.json
  - If not exists → Error: "tag-index.json not found at <path>", END with exit code 1
- Tag matching: strict match using word boundaries
  - Exact match (case-insensitive): keyword == tag
  - Word boundary match: keyword as whole word in tag (regex: \bkeyword\b)
  - Delimiter-separated match: keyword matches hyphen/underscore/space-separated part
  - Example: "test" matches "test", "test-driven", "unit-test" but NOT "contest"
- Verify existence of matched knowledge files:
  - For each matched file path in tag-index.json:
    - If file not exists → Error: "Knowledge file not found: <path> (referenced in tag-index.json)", END with exit code 1
- If matched count > 50 → Warning: "N matches found (may be too many)"
- Determine workflow section for each knowledge file using LLM (design/tdd/code-review/ui-test-design/doc-write/doc-review)
- Create data structure:
  ```json
  {
    "TICKET_ID": "<ticket_id>",
    "design_refs": [{"path": "knowledge/..."}, ...],
    "tdd_refs": [...],
    "code_review_refs": [...],
    "ui_test_design_refs": [...],
    "doc_write_refs": [...],
    "doc_review_refs": [...]
  }
  ```
- If no matches → data structure has empty arrays for all sections
- Execute: `echo '<json>' | python ~/.claude/scripts/regenerate_knowledge_refs.py "$TICKET_PATH" "$KNOWLEDGE_PATH"`
  - If error → Error: display error message, END with exit code 1
- Output: TICKET_PATH=<ticket_folder_path>
- END
