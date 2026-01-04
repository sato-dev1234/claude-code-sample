# Anti-Patterns to Avoid

## No Verification Summary

### Problem
No quantifiable overview of checklist completeness.

### Bad Example
```markdown
## Acceptance Criteria
- [ ] Item 1
- [ ] Item 2
... (50+ items with no summary)
```

### Required Format
```markdown
## Verification Summary

| Category | Item Count | Status |
|----------|-----------|--------|
| Acceptance Criteria | 3 (15 sub-items) | Pending |
| Edge Cases | 6 | Pending |
| Technical Items | 6 | Pending |
| Role Scenarios | 4 | Pending |
| Documentation | 4 | Pending |
| **Total** | **35** | **Pending** |
```
