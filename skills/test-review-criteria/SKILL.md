---
name: test-review-criteria
description: "Test code review criteria covering test code quality, flaky pattern detection, and assertion quality validation. Applied by test review and fix agents."
user-invocable: false
---

## Severity Levels

### Critical (Must Fix)
- Flaky test patterns (fixed sleep, race conditions, shared state)
- Missing assertions
- Test order dependency

### High (Test Quality)
- Incomplete coverage of critical paths
- Hardcoded paths/values without fallback
- External API calls without mocking

### Medium (Best Practices)
- Missing edge case coverage
- Assertion could be more specific
- Inappropriate comments

## Test Code Review Criteria

Review test code changes and provide feedback on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns
- Test coverage
- Comment quality

Read CLAUDE.md from project root for project-specific guidance.

## Flaky Patterns Review Criteria

Review for common flaky test patterns:
- Non-deterministic behavior (fixed sleep, race conditions, shared state, test order dependency)
- Environment sensitivity (hardcoded paths, missing env fallbacks, missing cleanup)
- External dependencies (random values, current time, external API calls)

## Assertion Quality Review Criteria

Review assertion quality:
- Use exact value assertions when values are known
- Validate all essential properties of result objects
- Assert collection size before accessing elements

## Fix Guidelines

- Fix flaky patterns (replace sleep with proper waits, remove shared state)
- Improve assertion quality (exact values, complete validation)
- Remove inappropriate comments (design rationale, LLM traces, etc.)
