---
name: gathering-git-info
description: "Parallel git information and file content gathering. Executes git commands and file reads in parallel to minimize round-trips. Use when review skills need to collect git change information efficiently."
allowed-tools: Bash, Read
---

## Git info gathering workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Parse task prompt
- [ ] Step 2: Collect git information in parallel
- [ ] Step 3: Read changed files in parallel
- [ ] Step 4: Output formatted result
```

**Step 1: Parse task prompt**

Parse from task prompt:
- git_diff_command: Git diff command to execute (e.g., `git diff HEAD`)
- file_filter (optional): Glob pattern to filter files (e.g., `*Test.kt`)

**Step 2: Collect git information in parallel**

Collect git information in parallel (single message with multiple Bash calls):
- Execute `git status`
- Execute `<git_diff_command>`

**Step 3: Read changed files in parallel**

Read changed files in parallel:
- Apply file_filter if provided
- Read all filtered files in single message with multiple Read calls
- If >30 files, split into batches of 30

**Step 4: Output formatted result**

Output in format:
```
## Git Information
**Changed files**: N files
- [file list]

**Git status output**:
[output]

**Git diff output**:
[output]

## File Contents
### path/to/file.ext
[content with line numbers]
```
