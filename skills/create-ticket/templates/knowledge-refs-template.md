# 関連ナレッジ

チケット: {{TICKET_ID}}

{{#if design_refs}}
## /design

{{#each design_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if tdd_refs}}
## /tdd

{{#each tdd_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if ui_test_design_refs}}
## /ui-test-design

{{#each ui_test_design_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if write_documents_refs}}
## /write-documents

{{#each write_documents_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if write_release_notes_refs}}
## /write-release-notes

{{#each write_release_notes_refs}}
- path: {{path}}
{{/each}}
{{/if}}

