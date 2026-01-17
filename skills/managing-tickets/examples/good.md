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

### 3-File Structure

1. **README.md**: Overview, Context, Scope, Files links
2. **requirements.md**: AC items, Edge Cases, Technical Considerations, Verification Summary
3. **tasks.md**: Current Phase, Workflow (commands), Tasks (work items)

### Operations

| Operation | Description |
|-----------|-------------|
| create | Generate all 3 files in backlog/<TICKET_ID>/ |
| update | Update requirements.md and/or tasks.md (targets: requirements, workflow, both) |
| move | Move ticket folder to new status, update README.md |

### Workflow Section (tasks.md)

Default workflow commands:

```markdown
## Workflow

- [ ] /spec-interview - 仕様インタビュー
- [ ] /create-branch - ブランチ作成
- [ ] /design - 設計ドキュメント生成
- [ ] /tdd - TDD実装 + コード品質改善 + テスト品質改善
- [ ] /comment-self-refine - コメント品質自動改善
- [ ] /writing-documents - ドキュメント作成
- [ ] /reviewing-documents - ドキュメントレビュー
- [ ] /ui-test-design - UIテスト設計
```

Status markers:
- `[ ]` - Pending
- `[x]` - Completed
- `[-]` - Skipped

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
