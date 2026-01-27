---
name: collect-knowledge
description: "Collects knowledge from source code analysis"
user-invocable: true
allowed-tools: Read, Bash, AskUserQuestion, Glob, Grep, Task
---

# /collect-knowledge

Orchestrator for knowledge collection from source code.

## Progress Checklist

```
- [ ] Step 1: Get source files
- [ ] Step 2: Analyze source code
- [ ] Step 3: Load categories
- [ ] Step 4: Generate knowledge entries
- [ ] Step 5: Confirm bulk creation
- [ ] Step 6: Create files
- [ ] Step 7: Rebuild index
- [ ] Step 8: Report
```

## Steps

1. Get source files:
   - AskUserQuestion: "Source file path or glob pattern?"
   - Resolve globs → SOURCE_FILES
   - Validate files exist

2. Analyze source code:
   - For each source file: read and extract documentation-worthy concepts
   - Build CONCEPTS list with category, id, tags, content

3. Load categories:
   - Invoke knowledge-reader: `OPERATION=list`
   - Parse CATEGORY_LIST

4. Generate knowledge entries:
   - For each concept:
     - Determine category (from existing or propose new)
     - Generate id, tags, related
     - Structure content

5. Confirm bulk creation:
   - AskUserQuestion: Show all entries for confirmation
   - Options: [Create all] [Modify] [Cancel]
   - If Cancel → END

6. Create files:
   - Get current commit: `git rev-parse HEAD`
   - For each confirmed entry:
     - Invoke knowledge-writer:
       ```
       OPERATION=create
       CATEGORY=$CATEGORY
       ID=$ID
       TAGS=$TAGS
       RELATED=$RELATED
       CONTENT=$CONTENT
       SOURCE_REFS=$SOURCE_REFS
       COMMIT_HASH=$COMMIT_HASH
       ```

7. Rebuild index:
   - Invoke knowledge-writer: `OPERATION=rebuild-index`

8. Report:
   - Display summary: categories used, files created, sources analyzed
   - END
