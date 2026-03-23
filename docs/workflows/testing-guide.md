# Testing Guide

## TDD Decision Rules

### ✅ Use TDD (Tests First) For:

- Core agent logic (ReAct loop, tool execution, subagent spawning)
- New tool implementations
- Provider integrations (API calls, response parsing, retry logic, abort handling)
- Permission system (rule evaluation, inheritance, deny/allow logic)

### ✅ Tests After Implementation OK For:

- Simple utility functions
- Documentation updates
- Configuration changes
- Obvious bug fixes

## Test Organization

**Location**: `tests/` directory (mirrors `src/` structure)
**Naming**: `foo.ts` → `foo.test.ts`

## Integration Tests with LLM APIs

### Environment Variables

Integration tests can use API keys or a local Codex OAuth login, depending on provider:
```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Google Gemini
GEMINI_API_KEY=...

# Anthropic
ANTHROPIC_API_KEY=...

# Codex OAuth
codex login
CODEX_MODEL=gpt-5.4

# Optional Codex overrides
CODEX_HOME=~/.codex
OAS_CODEX_AUTH_PATH=/custom/path/auth.json

# Optional proxy
OPENAI_BASE_URL=https://api.openai.com/v1
HTTP_PROXY=http://localhost:7890
```

### Running with Environment

```bash
env $(cat .env | xargs) bun test
```

For the real Codex smoke test, you can also rely on your existing local login state without an `.env` file:

```bash
cd packages/core
bun test tests/e2e/providers/codex.test.ts
```

### Skip Pattern

```typescript
const hasOpenAI = !!process.env.OPENAI_API_KEY;
describe.skipIf(!hasOpenAI)('OpenAI Integration', () => { ... });

const skipCodex = skipIfNoProvider('codex');
describe.skipIf(skipCodex)('Codex Integration', () => { ... });
```

## Coverage Targets

- **Overall**: > 80%
- **Core Logic**: > 90% (agent loop, tools, providers)
- **Utilities**: > 70%

## CI Behavior

- Integration tests **skipped** in CI (no API keys)
- Only unit tests and mocked tests run
- Coverage reports generated
