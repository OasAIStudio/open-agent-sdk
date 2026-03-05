# Demo Gallery

This page lists runnable demos that can be used for videos, social posts, and reproducible onboarding.

## 1) Interactive Code Agent (Permissioned Tools)

Path: `examples/code-agent/`

What it demonstrates:
- ReAct loop with streaming responses
- Built-in tools (`Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`)
- Permission workflow for sensitive tools
- Session save/resume

Run:

```bash
cd examples/code-agent
bun install
GEMINI_API_KEY=your_key bun dev
```

## 2) Quickstart Package (Basic + Session + Tools)

Path: `examples/quickstart/`

What it demonstrates:
- One-shot prompt call
- Multi-turn session workflow
- Tool usage (`Glob`, `Bash`, `WebSearch`)

Run:

```bash
cd examples/quickstart
bun install
GEMINI_API_KEY=your_key bun test
```

## 3) Skill System Demo

Path: `examples/skills-demo.ts` and `examples/skills/`

What it demonstrates:
- Skill loading from local directories
- Skill instruction injection into system prompt
- Task-specialized behavior with reusable skill files

Run:

```bash
OPENAI_API_KEY=your_key bun run examples/skills-demo.ts
```

## 4) Structured Output Demo

Path: `examples/structured-output-demo.ts`

What it demonstrates:
- Typed/structured result handling
- Stable output shape for downstream pipelines

Run:

```bash
OPENAI_API_KEY=your_key bun run examples/structured-output-demo.ts
```

## 5) SWE-bench Lite Smoke Eval

Path: `benchmark/swebench/`

What it demonstrates:
- Reproducible local eval harness workflow
- Prediction/report artifact generation
- Batch run and report summarization

Run:

```bash
cd benchmark/swebench
./scripts/run_oas_smoke_one.sh
python ./scripts/summarize_reports.py --reports-dir ./outputs/reports --limit 20
```

## Artifact Convention

For demos intended for external sharing, store outputs under:
- `./outputs/` for local demo outputs
- `benchmark/.../outputs/` for benchmark artifacts

Suggested social posting bundle per demo:
- 20-30 second terminal recording
- exact run command
- output snippet or report JSON
