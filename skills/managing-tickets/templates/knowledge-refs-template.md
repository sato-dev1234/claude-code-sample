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

{{#if code_review_refs}}
## /code-review

{{#each code_review_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if ui_test_design_refs}}
## /ui-test-design

{{#each ui_test_design_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if doc_write_refs}}
## /writing-documents

{{#each doc_write_refs}}
- path: {{path}}
{{/each}}
{{/if}}

{{#if doc_review_refs}}
## /reviewing-documents

{{#each doc_review_refs}}
- path: {{path}}
{{/each}}
{{/if}}
