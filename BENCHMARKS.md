# Benchmarks

This document defines the reproducible evaluation entry points for Open Agent SDK.

## Principles

- Reproducible first: all benchmark runs should be executable from scripts in this repository.
- Artifacts first: each run should emit machine-readable outputs (reports, logs, trajectories).
- Comparable metrics: report at least success/pass, latency, and cost when available.

## SWE-bench Lite

Entry docs:
- `benchmark/swebench/README.md`

Primary scripts:
- `benchmark/swebench/scripts/run_oas_smoke_one.sh`
- `benchmark/swebench/scripts/run_oas_smoke_batch.sh`
- `benchmark/swebench/scripts/run_oas_overnight.sh`
- `benchmark/swebench/scripts/summarize_reports.py`

Quick run:

```bash
cd benchmark/swebench
SWEBENCH_SMOKE_COUNT=5 OAS_MAX_TURNS=12 ./scripts/run_oas_smoke_batch.sh
python ./scripts/summarize_reports.py --reports-dir ./outputs/reports --limit 20
```

Artifacts:
- `benchmark/swebench/outputs/predictions/`
- `benchmark/swebench/outputs/reports/`
- `benchmark/swebench/outputs/trajectories/`
- `benchmark/swebench/outputs/logs/<instance_id>/open-agent-transcript/`

## Terminal-bench

Entry docs:
- `benchmark/terminalbench/README.md`
- `benchmark/terminalbench/open_agent_sdk_harbor/README.md`

Primary scripts:
- `benchmark/terminalbench/scripts/run-terminalbench-overnight.sh`
- `benchmark/terminalbench/scripts/cleanup-terminalbench-images.sh`

Quick run:

```bash
env -u https_proxy -u http_proxy -u all_proxy \
    -u HTTPS_PROXY -u HTTP_PROXY -u ALL_PROXY \
harbor run -d terminal-bench@2.0 \
  --env docker \
  --agent-import-path "harbor.agents.installed.open_agent_sdk:OpenAgentSDKAgent" \
  --model MiniMax-M2.5 \
  --n-concurrent 1
```

Artifacts:
- `jobs/<run>/result.json`
- `jobs/<run>/<trial>/result.json`
- `jobs/<run>/<trial>/agent/open-agent-transcript/`

## Reporting Template

When publishing benchmark updates, include:
- Run date (YYYY-MM-DD)
- Model and provider
- Dataset split / task list
- Pass rate or success rate
- Median latency (if available)
- Cost estimate (if available)
- Link to raw artifacts in this repo

## Capability Snapshot (Open Agent SDK)

| Capability | Status | Evidence |
|---|---|---|
| Tool permission gating | Available | `canUseTool` + mode system in SDK/examples |
| Hooks lifecycle | Available | `docs/api-reference.md` hooks section |
| Subagent/task orchestration | Available | `docs/api-reference.md` task tools |
| SWE-bench harness | Available | `benchmark/swebench/` |
| Terminal-bench harness | Available | `benchmark/terminalbench/` |
| Session persistence/resume | Available | `examples/code-agent/` |

Note: external framework comparisons should only be added with direct links to upstream docs and a dated snapshot.
