---
name: implementing-tdd
description: "TDD workflow executor using Canon TDD (Red-Green-Refactor). Supports test list creation, failing test writing, minimal implementation, and refactoring with test verification. Use when implementing features with TDD approach."
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Quick start

RED-GREEN-REFACTOR cycle:
```
1. RED: Write failing test → verify it fails
2. GREEN: Implement minimal code → verify test passes
3. REFACTOR: Improve code → verify tests still pass
```

Run tests:
```bash
npm test  # or pytest, gradle test, etc.
```

## TDD workflow

Copy this checklist and track your progress:

```
Progress:
- [ ] Step 1: Parse REQUIREMENTS, DESIGN, and KNOWLEDGE
- [ ] Step 2: Create test list
- [ ] Step 3: Execute RED-GREEN-REFACTOR cycle
- [ ] Step 4: Generate completion report
```

**Step 1: Parse REQUIREMENTS, DESIGN, and KNOWLEDGE**

Parse REQUIREMENTS from task prompt (ticket AC or user requirements).

Parse DESIGN from task prompt (design document from /design command).

Run: `python ~/.claude/scripts/resolve_knowledge.py --refs "${TICKET_PATH}/knowledge-refs.md" --workflow "/tdd" --base "${CONFIG.BASE_PATH}"`

On success/partial: use `knowledge[].content` for Troubleshooting section

**Step 2: Create test list**

Create test list from requirements and design, ordered simple to complex.

Consider from DESIGN:
- Design constraints and architectural decisions
- Interface contracts and data structures
- Error handling patterns specified in design

## Implementation principles

Before starting RED-GREEN-REFACTOR cycle, internalize these principles:

- **WHY-first comments**: Write reasons (business constraints, security requirements), not HOW
- **Declarative comments**: Avoid conversational tone in comments, state facts
- **Input validation first**: For functions receiving external input, implement validation first

**Step 3: Execute RED-GREEN-REFACTOR cycle**

Execute RED-GREEN-REFACTOR cycle for each test item:
- RED: Write failing test
- GREEN: Verify failure, implement minimal code
- REFACTOR: If needed, improve code

Apply implementation principles during GREEN and REFACTOR phases.

**Step 4: Generate completion report**

Generate completion report with test list status and implementation summary.
