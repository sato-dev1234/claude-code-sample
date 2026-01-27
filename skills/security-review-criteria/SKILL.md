---
name: security-review-criteria
description: "Security review criteria based on OWASP Top 10. Covers severity levels, trust boundaries, detection patterns, and language-specific checks for security vulnerabilities."
user-invocable: false
---

## Trust Boundaries

The following are considered trusted:
- Environment variables
- CLI flags and arguments
- Configuration files in repository

Modern frameworks (React, Angular, Vue) are considered XSS-safe unless:
- dangerouslySetInnerHTML or equivalent is used
- innerHTML is directly manipulated
- eval() or Function() is used with user input

## Severity Levels

### Critical (Immediate Exploitation Risk)
- SQL/NoSQL injection with data access potential
- Command injection allowing arbitrary execution
- Hardcoded credentials (API keys, passwords, tokens)
- Authentication bypass vulnerabilities
- Remote code execution vectors

### High (Significant Security Risk)
- Cross-site scripting (XSS) with session/data theft potential
- Insecure deserialization
- Path traversal with file read/write capability
- Broken access control (privilege escalation)
- CSRF on state-changing operations

### Medium (Moderate Security Concern)
- Information disclosure (stack traces, debug info)
- Missing security headers
- Weak cryptographic implementations
- Insecure random number generation
- XML external entity (XXE) processing

### Low (Best Practice Violation - Not Reported)
- Missing HTTP-only cookie flag
- Verbose error messages (non-sensitive)
- Outdated but non-vulnerable dependencies

Note: Low severity findings are NOT included in output.

## Review Criteria (OWASP Top 10)

### A01: Broken Access Control
- Missing authorization checks on endpoints
- Insecure direct object references (IDOR)
- Privilege escalation paths
- CORS misconfiguration

### A02: Cryptographic Failures
- Hardcoded secrets (grep patterns: password, secret, api_key, token)
- Weak encryption algorithms (MD5, SHA1 for security)
- Missing encryption for sensitive data
- Insecure key storage

### A03: Injection
- SQL injection (string concatenation in queries)
- NoSQL injection (object injection in queries)
- Command injection (shell execution with user input)
- Code injection (eval, Function, exec)
- LDAP injection

### A04: Insecure Design
- Missing input validation
- Business logic flaws (skip - requires domain knowledge)

### A05: Security Misconfiguration
- Debug mode enabled in production code
- Default credentials
- Unnecessary features enabled

### A06: Vulnerable Components
- Run `npm audit` / `pip check` for changed package files
- Flag HIGH/CRITICAL vulnerabilities only

### A07: Authentication Failures
- Weak password policies in code
- Missing brute force protection
- Session fixation vulnerabilities
- Insecure session storage

### A08: Data Integrity Failures
- Insecure deserialization (pickle, yaml.load, JSON.parse of untrusted)
- Missing integrity checks on downloads/updates

### A09: Security Logging Failures
- Sensitive data in logs (passwords, tokens, PII)

### A10: Server-Side Request Forgery (SSRF)
- URL fetching with user-controlled input
- Missing URL validation/allowlisting

## Detection Patterns

| Vulnerability | Pattern Examples |
|---------------|------------------|
| Hardcoded secrets | `(password\|secret\|api_key\|token)\s*[:=]\s*['"][^'"]+['"]` |
| SQL injection | `execute\(.*\+.*\)`, `query\(.*\$\{`, `WHERE.*\+.*user` |
| Command injection | `exec\(.*\+`, `system\(.*\$`, `spawn\(.*input` |
| eval injection | `eval\(.*user`, `Function\(.*req`, `new Function\(` |
| Path traversal | `path\.join\(.*req`, `readFile\(.*user` |

## Fix Guidelines

- Remove hardcoded credentials (replace with environment variable references)
- Add parameterized queries for SQL injection
- Sanitize user input before command execution
- Add input validation where missing
- Replace dangerous functions with safe alternatives
