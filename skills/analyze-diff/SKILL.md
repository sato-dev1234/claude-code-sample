---
name: analyze-diff
description: "Explains branch changes at implementation level with detailed code analysis. Traces processing flow with actual source code quotations for understanding committed changes."
user-invocable: true
allowed-tools: Bash, Read, Task, Grep, Glob, Write, AskUserQuestion
---

# /analyze-diff

Explains branch changes at implementation level with detailed code analysis.

## Progress Checklist

```
- [ ] Step 1: Gather inputs
- [ ] Step 2: Resolve paths
- [ ] Step 3: Collect diff
- [ ] Step 4: Invoke diff-analyzer agent
- [ ] Step 5: Write report
- [ ] Step 6: Report summary in Japanese
```

## Steps

1. Gather inputs:
   - TARGET: Branch or commit range to analyze
   - TICKET_ID: Target ticket for output
   - If not provided, use AskUserQuestion to clarify these

2. Resolve paths:
   - TICKET_PATH = `find $TICKETS_DIR -type d -name "$TICKET_ID"` (first match)
   - OUTPUT_PATH = TICKET_PATH (used in Step 5 for report output)

3. Collect diff:
   - Execute `git diff $TARGET` → raw_diff
   - Execute `git diff $TARGET --stat` → file_stats
   - Read modified files for context → CHANGED_FILES

4. Invoke diff-analyzer agent via Task tool:
```
DIFF_DATA:
  raw_diff: {raw_diff from Step 3}
  target: {TARGET from Step 1}
  file_stats: {file_stats from Step 3}

CHANGED_FILES: {modified files with content from Step 3}
LANGUAGE: "ja"
```

If ANALYSIS_ERROR=true → display ERROR_MESSAGE, END
Otherwise → ANALYSIS_RESULT = agent output

5. Write report to OUTPUT_PATH as diff-navigator-report.md:
   - Include ANALYSIS_RESULT
   - Report body in Japanese, file paths in English

6. Report summary in Japanese
