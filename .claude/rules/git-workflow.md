# Git Workflow Rules

## Commit Message Format

```
type(scope): description

Examples:
feat(trainer): add pause conversation button
fix(auth): resolve session expiry bug
refactor(api): extract analysis logic
test(crypto): add encryption roundtrip test
docs(readme): update setup instructions
chore(deps): upgrade Next.js to 14.1
```

## Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Add/update tests
- `docs`: Documentation
- `chore`: Dependencies, configs

## Rules
✅ **DO:**
- Commit after each logical change
- Max 50 chars for subject
- Use present tense ("add" not "added")
- Reference issue if applicable

❌ **DON'T:**
- Commit broken code
- Mix unrelated changes
- Commit secrets/keys

## Branch Naming
```
feature/your-feature
bugfix/issue-description
hotfix/critical-fix
```
