# 概要

{{SUMMARY}}

# 詳細

{{DETAIL}}

## 詳細仕様

{{SPECIFICATION_LINK}}

## 主な特徴

**主な機能**

| 機能 | 説明 |
|------|------|
{{#each FEATURES}}
| {{NAME}} | {{DESCRIPTION}} |
{{/each}}

{{#if HAS_USAGE_PATTERNS}}
**使用パターンと出力例**

| パターン | 設定例 | 出力例 |
|---------|--------|-------|
{{#each USAGE_PATTERNS}}
| {{PATTERN}} | {{CONFIG}} | {{OUTPUT}} |
{{/each}}
{{/if}}

## 注意点

{{#each NOTES}}
- {{this}}
{{/each}}

## 背景

{{BACKGROUND}}

# 影響範囲

## 対象ユーザー

{{TARGET_USERS}}

## 既存機能への影響

**影響の詳細**

| 機能 | 影響の有無 | 詳細 |
|------|-----------|------|
{{#each IMPACT}}
| {{FUNCTION}} | {{HAS_IMPACT}} | {{DETAIL}} |
{{/each}}
