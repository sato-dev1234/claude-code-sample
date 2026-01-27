# Good AC Checklist Patterns

## Key Patterns

| # | Pattern | Description |
|---|---------|-------------|
| 1 | Hierarchical Structure | Main AC items with 3-5 detailed sub-items |
| 2 | Specific and Testable | Each item can be verified with pass/fail |
| 3 | Complete Coverage | Edge cases, technical items |
| 4 | Quantifiable | Summary table with item counts |
| 5 | Domain Consistency | Use consistent domain entities |
| 6 | Appropriate Granularity | Item count based on task complexity |

## Output Requirements

### 2-File Structure

1. **README.md**: Overview, Context, Scope, Files links
2. **requirements.md**: AC items, Edge Cases, Technical Considerations, Verification Summary

Note: Workflow tasks are managed via Claude Code's Tasks tool (TaskCreate/TaskList/TaskUpdate).

### Operations

| Operation | Description |
|-----------|-------------|
| create | Generate files in backlog/<TICKET_ID>/ + create workflow tasks |
| update | Update requirements.md |
| move | Move ticket folder to new status, update README.md |

### Verification Summary

Always include item count table in requirements.md:

```markdown
| Category | Item Count | Status |
|----------|-----------|--------|
| Acceptance Criteria | 3 | Done |
| Edge Cases | 5 | In Progress |
| Technical Items | 4 | Pending |
| **Total** | **12** | **In Progress** |
```
