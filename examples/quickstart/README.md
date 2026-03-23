# Open Agent SDK Quickstart Example

This is a quickstart example for `open-agent-sdk` using the workspace reference.

## 📦 Installation

This example uses the workspace reference, so dependencies are automatically linked:

```bash
bun install
```

## 🔑 Configuration

Copy `.env.example` to `.env` and add your API Key:

```bash
cp .env.example .env
# Edit .env file and add your GEMINI_API_KEY
```

Or set environment variables directly:

```bash
export GEMINI_API_KEY=your_gemini_api_key_here
```

These quickstart scripts are currently Gemini-first. For Codex OAuth usage, run `codex login` and use the main SDK or `oas --provider codex`.

## 🚀 Run Tests

### 1. Basic Test

Test basic prompt functionality, file operations, and code analysis:

```bash
bun test-basic.ts
```

### 2. Session Test

Test multi-turn conversations with context preservation:

```bash
bun test-session.ts
```

### 3. Tools Test

Test built-in tools (Glob, Bash, WebSearch):

```bash
bun test-tools.ts
```

### Run All Tests

```bash
bun run test
```

## 📝 Test Files

| File | Description |
|------|-------------|
| `test-basic.ts` | Basic functionality: Q&A, file operations, code analysis |
| `test-session.ts` | Session-based multi-turn conversation test |
| `test-tools.ts` | Tool usage test: Glob, Bash, WebSearch |

## ⚠️ Notes

1. **Model**: These quickstart scripts currently use Gemini models by default.

2. **Codex OAuth**: For Codex-backed usage, run `codex login` and use `provider: 'codex'` with a model such as `gpt-5.4`.

3. **Runtime**: This example uses **Bun** to run TypeScript files directly.

## 📚 More Documentation

- [Open Agent SDK GitHub](https://github.com/Octane0411/open-agent-sdk)
- [API Reference](../../docs/api-reference.md)
