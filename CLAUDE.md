# CLAUDE.md

## Philosophy

- **Simple Made Easy**: Prefer simplicity over complexity
- **Agent-First**: Delegate to specialized agents/skills
- **Parallel Execution**: Run multiple agents concurrently when possible
- **Plan Before Execute**: Use plan mode for complex operations
- **TDD**: Test-driven development
- **Security-First**: Never compromise on security

## Constraints

- No destructive git operations (reset --hard, rebase, force) without explicit request
- Git push: Ask permission before execution
- Scope: Execute ONLY what user explicitly requested
- Commit messages: No meta information (no "Generated with Claude Code", no "Co-Authored-By", no ticket IDs)
- Answer questions directly first

## Preferences

### Code Style

- Many small files over few large files
- Prefer immutability
- No emojis unless requested

### Git

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Small, focused commits

## Success Criteria

- Tests pass
- ISSUE_COUNT = 0
- Simple Made Easy principles followed
