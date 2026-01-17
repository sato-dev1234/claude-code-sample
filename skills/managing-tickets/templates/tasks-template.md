# {{TICKET_ID}} - Progress

## Current Phase

{{CURRENT_PHASE}}

## Workflow

{{#if WORKFLOW_COMMANDS}}
{{#each WORKFLOW_COMMANDS}}
- [ ] {{COMMAND}} - {{DESCRIPTION}}
{{/each}}
{{else}}
- [ ] /spec-interview - 仕様インタビュー
- [ ] /create-branch - ブランチ作成
- [ ] /design - 設計ドキュメント生成
- [ ] /tdd - TDD実装 + コード品質改善 + テスト品質改善
- [ ] /comment-self-refine - コメント品質自動改善
- [ ] /writing-documents - ドキュメント作成
- [ ] /reviewing-documents - ドキュメントレビュー
- [ ] /ui-test-design - UIテスト設計
{{/if}}

## Tasks

{{#each TASK_SECTIONS}}
### {{NAME}}

{{#each TASKS}}
- [ ] {{this}}
{{/each}}

{{/each}}

## Summary

| Phase | Status |
|-------|--------|
{{#each PHASE_STATUS}}
| {{NAME}} | {{STATUS}} |
{{/each}}
