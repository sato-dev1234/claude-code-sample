---
name: documentation-principles
description: "14 documentation principles for Japanese quality, conciseness, visual expression, technical documents, and project-specific rules. Applied by document review, fix, and writing agents."
user-invocable: false
---

## 14 Documentation Principles

### Japanese Quality (1-3)

1. **Use Natural Japanese** - Avoid programming jargon
   - NG: スローする, リターンする, フェッチする
   - OK: 発生させる, 返す, 取得する

2. **Follow Textlint Rules** - Avoid redundant expressions
   - NG: 〜を行う, 〜することができる
   - OK: 〜する, 〜できる

3. **Avoid Sentence-Ending Colons** - Do not end sentences with `:` or `：`
   - NG: 以下のシナリオで発生する可能性があります：
   - OK: 以下のシナリオで発生します。

### Conciseness (4-8)

4. **Eliminate Redundant Explanations** - If process flow is clear, results are self-evident
   - Remove: この仕組みにより〜, これによって〜

5. **Keep Overview Sections Concise** - State document purpose only (1-3 sentences)
   - Details belong in specific sections

6. **Avoid Outcome/Benefit Statements** - If feature description is clear, benefits are self-evident
   - Remove: 〜できます, 〜を削減, 〜が可能になり

7. **Avoid Abstract Verbs** - Specify concrete changes
   - NG: 改善しました, 最適化しました
   - OK: 接続タイムアウト時に3回まで自動リトライします

8. **Explain Reasons Concisely** - Provide technical justification in 2-3 sentences

### Visual Expression (9)

9. **Use Emphasis Sparingly**
   - Headers: H2→H3→H4 only
   - Bold: 1 per sentence maximum

### Technical Documentation (10-12)

10. **Avoid Implementation Details** - Describe what features do, not how
    - NG: LoanRepository.ExtendLoanPeriod() を呼び出して貸出期間を延長します
    - OK: 貸出期間を延長します

11. **Explicitly State Conditional Behavior** - Clearly state when behavior varies
    - Avoid: always, must (unless truly unconditional)

12. **Distinguish Admonitions** - Use correct types:
    | Type | Purpose |
    |------|---------|
    | `:::info` | Document scope, references |
    | `:::note` | Design rationale, technical reasons |
    | `:::tip` | Best practices, recommendations |
    | `:::warning` | Document status (TODO, WIP) |
    | `:::caution` | Operation warnings |
    | `:::danger` | Critical risks, irreversible actions |

### Project-Specific (13-14)

13. **Match UI Terminology** - Use exact terms from KNOWLEDGE
    - Check KNOWLEDGE for project-specific terms

14. **Standardize Document Structure** - Use consistent structure
    - Overview → Process Flow → Error Cases

## Severity Levels

| Level | Violation Type |
|-------|----------------|
| Critical | Principles 1-3 (Japanese Quality) |
| High | Principles 4-8, 10-12 (Conciseness, Technical) |
| Medium | Principles 9, 13-14 (Visual, Project-specific) |
