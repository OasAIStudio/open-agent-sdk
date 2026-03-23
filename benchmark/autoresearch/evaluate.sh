#!/usr/bin/env bash
set -euo pipefail

#
# evaluate.sh — Run terminal-bench tasks with multiple trials per task,
# compute pass@k and pass^k metrics.
#
# Metrics:
#   pass@k  = fraction of tasks where at least 1 of k trials succeeded (capability)
#   pass^k  = fraction of tasks where all k trials succeeded (reliability)
#   pass@1  = simple single-trial pass rate (when k=1, pass@1 = pass@k = pass^k)
#
# Usage:
#   ./benchmark/autoresearch/evaluate.sh [options]
#

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

TASKS_FILE="${REPO_ROOT}/benchmark/terminalbench/task-lists/smoke-5.txt"
MODEL="MiniMax-M2.5"
K=3
TAG="eval"
OUTPUT=""
DATASET="terminal-bench@2.0"
ENV_TYPE="docker"
AGENT_IMPORT_PATH="harbor.agents.installed.open_agent_sdk:OpenAgentSDKAgent"
AGENT_TIMEOUT_MULTIPLIER="0.6"
SLEEP_BETWEEN=3

usage() {
  cat <<'EOF'
Usage: evaluate.sh [options]

Options:
  --tasks-file FILE    Task list file, one task per line (default: smoke-5.txt)
  --model MODEL        LLM model name (default: MiniMax-M2.5)
  -k N                 Trials per task (default: 3)
  --tag TAG            Label for this run (default: "eval")
  --output FILE        Append TSV summary to file
  --sleep N            Seconds between trials (default: 3)
  -h, --help           Show help

Output:
  Per-task results: task_name, pass_count/k, pass@k (0|1), pass^k (0|1)
  Aggregate:        pass@k rate, pass^k rate, avg per-trial rate
EOF
}

while (($#)); do
  case "$1" in
    --tasks-file) TASKS_FILE="${2:-}"; shift 2 ;;
    --model) MODEL="${2:-}"; shift 2 ;;
    -k) K="${2:-}"; shift 2 ;;
    --tag) TAG="${2:-}"; shift 2 ;;
    --output) OUTPUT="${2:-}"; shift 2 ;;
    --sleep) SLEEP_BETWEEN="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

if [ ! -f "$TASKS_FILE" ]; then
  echo "Tasks file not found: $TASKS_FILE" >&2
  exit 1
fi

if ! [[ "$K" =~ ^[1-9][0-9]*$ ]]; then
  echo "-k must be a positive integer, got: $K" >&2
  exit 1
fi

# Load API keys from .env
MAIN_GIT_DIR="$(git -C "$REPO_ROOT" rev-parse --git-common-dir)"
MAIN_ENV_FILE="$(cd "$MAIN_GIT_DIR/.." && pwd)/.env"
if [ -f "$MAIN_ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$MAIN_ENV_FILE"
  set +a
fi

if ! command -v harbor >/dev/null 2>&1; then
  echo "harbor not found in PATH" >&2
  exit 1
fi

# Parse tasks
TASKS_TMP="$(mktemp)"
trap 'rm -f "$TASKS_TMP"' EXIT
awk 'NF && $1 !~ /^#/' "$TASKS_FILE" > "$TASKS_TMP"
TASK_COUNT="$(wc -l < "$TASKS_TMP" | tr -d ' ')"

echo "=== autoresearch evaluate ==="
echo "tasks=$TASK_COUNT  k=$K  model=$MODEL  tag=$TAG"
echo ""

# ── Helper: build harbor command for a single task trial ──
build_harbor_cmd() {
  local task_name="$1"
  local cmd_arr=(
    harbor run -d "$DATASET"
    --env "$ENV_TYPE"
    --agent-import-path "$AGENT_IMPORT_PATH"
    --model "$MODEL"
    --task-name "$task_name"
    --n-concurrent 1
    -k 1
    --agent-timeout-multiplier "$AGENT_TIMEOUT_MULTIPLIER"
  )

  local model_lower
  model_lower="$(echo "$MODEL" | tr '[:upper:]' '[:lower:]')"
  if [[ "$model_lower" == minimax* ]]; then
    cmd_arr+=(--ae "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}")
    cmd_arr+=(--ae "ANTHROPIC_BASE_URL=${ANTHROPIC_BASE_URL:-}")
  elif [[ "$model_lower" == gemini* ]] || [[ "$model_lower" == google* ]]; then
    cmd_arr+=(--ae "GEMINI_API_KEY=${GEMINI_API_KEY:-}")
  elif [[ "$model_lower" == claude* ]]; then
    cmd_arr+=(--ae "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}")
  elif [[ "$model_lower" == gpt* ]] || [[ "$model_lower" == openai* ]]; then
    cmd_arr+=(--ae "OPENAI_API_KEY=${OPENAI_API_KEY:-}")
  fi

  echo "${cmd_arr[@]}"
}

# ── Helper: run one trial, return 1=pass 0=fail -1=error ──
run_single_trial() {
  local task_name="$1"
  local cmd_str
  cmd_str="$(build_harbor_cmd "$task_name")"

  local run_output rc
  set +e
  run_output=$(env -u http_proxy -u https_proxy -u all_proxy \
    -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY \
    bash -c "$cmd_str" 2>&1)
  rc=$?
  set -e

  if [ "$rc" -ne 0 ]; then
    echo "-1"  # error
    return
  fi

  if echo "$run_output" | grep -q '"reward": 1\|reward=1\|"reward":1'; then
    echo "1"   # pass
  else
    echo "0"   # fail
  fi
}

# ── Main evaluation loop ──
TASK_IDX=0

# Aggregates
TOTAL_TRIALS=0
TOTAL_TRIAL_PASS=0
TASKS_ANY_PASS=0      # pass@k numerator
TASKS_ALL_PASS=0      # pass^k numerator
TASKS_WITH_ERROR=0

# Per-task detail lines
DETAIL_LINES=""

while IFS= read -r task_name; do
  [ -z "$task_name" ] && continue
  TASK_IDX=$((TASK_IDX + 1))

  echo "[$TASK_IDX/$TASK_COUNT] $task_name  (k=$K)"

  task_pass=0
  task_fail=0
  task_error=0
  trial_results=""

  for trial in $(seq 1 "$K"); do
    echo -n "  trial $trial/$K ... "

    result=$(run_single_trial "$task_name")

    if [ "$result" = "1" ]; then
      task_pass=$((task_pass + 1))
      trial_results="${trial_results}P"
      echo "PASS"
    elif [ "$result" = "0" ]; then
      task_fail=$((task_fail + 1))
      trial_results="${trial_results}F"
      echo "FAIL"
    else
      task_error=$((task_error + 1))
      trial_results="${trial_results}E"
      echo "ERROR"
    fi

    TOTAL_TRIALS=$((TOTAL_TRIALS + 1))

    # Sleep between trials (not after the last one)
    if [ "$trial" -lt "$K" ] && [ "$SLEEP_BETWEEN" -gt 0 ]; then
      sleep "$SLEEP_BETWEEN"
    fi
  done

  # Per-task metrics
  TOTAL_TRIAL_PASS=$((TOTAL_TRIAL_PASS + task_pass))

  any_pass=0
  all_pass=0
  has_error=0

  if [ "$task_pass" -ge 1 ]; then
    any_pass=1
  fi
  if [ "$task_pass" -eq "$K" ]; then
    all_pass=1
  fi
  if [ "$task_error" -gt 0 ]; then
    has_error=1
  fi

  TASKS_ANY_PASS=$((TASKS_ANY_PASS + any_pass))
  TASKS_ALL_PASS=$((TASKS_ALL_PASS + all_pass))
  TASKS_WITH_ERROR=$((TASKS_WITH_ERROR + has_error))

  detail="  => $task_name: $trial_results  ($task_pass/$K pass)  pass@k=$any_pass  pass^k=$all_pass"
  echo "$detail"
  DETAIL_LINES="${DETAIL_LINES}${detail}\n"
  echo ""

done < "$TASKS_TMP"

# ── Compute aggregate metrics ──
if [ "$TASK_COUNT" -gt 0 ]; then
  PASS_AT_K=$(awk "BEGIN {printf \"%.4f\", $TASKS_ANY_PASS / $TASK_COUNT}")
  PASS_POW_K=$(awk "BEGIN {printf \"%.4f\", $TASKS_ALL_PASS / $TASK_COUNT}")
  AVG_TRIAL_RATE=$(awk "BEGIN {printf \"%.4f\", $TOTAL_TRIAL_PASS / $TOTAL_TRIALS}")
else
  PASS_AT_K="0.0000"
  PASS_POW_K="0.0000"
  AVG_TRIAL_RATE="0.0000"
fi

echo "========================================"
echo "           RESULTS SUMMARY"
echo "========================================"
echo ""
echo "Tasks:            $TASK_COUNT"
echo "Trials per task:  $K"
echo "Total trials:     $TOTAL_TRIALS"
echo "Model:            $MODEL"
echo "Tag:              $TAG"
echo ""
echo "── Aggregate Metrics ──"
echo ""
echo "  pass@$K  = $PASS_AT_K  ($TASKS_ANY_PASS/$TASK_COUNT tasks with ≥1 success)"
echo "  pass^$K  = $PASS_POW_K  ($TASKS_ALL_PASS/$TASK_COUNT tasks with $K/$K success)"
echo "  avg_trial_rate = $AVG_TRIAL_RATE  ($TOTAL_TRIAL_PASS/$TOTAL_TRIALS individual trials)"
echo ""
if [ "$TASKS_WITH_ERROR" -gt 0 ]; then
  echo "  ⚠ $TASKS_WITH_ERROR task(s) had infrastructure errors"
  echo ""
fi
echo "── Interpretation ──"
echo ""
echo "  pass@$K measures CAPABILITY: can the agent solve this at all?"
echo "  pass^$K measures RELIABILITY: does the agent solve this every time?"
echo "  gap = pass@$K - pass^$K = $(awk "BEGIN {printf \"%.4f\", $PASS_AT_K - $PASS_POW_K}") (consistency gap)"
echo ""

# ── Write machine-readable output ──
if [ -n "$OUTPUT" ]; then
  # TSV line compatible with results.tsv
  COMMIT="$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo "unknown")"
  echo -e "${COMMIT}\t${PASS_AT_K}\t${PASS_POW_K}\t${AVG_TRIAL_RATE}\t${TASKS_ANY_PASS}\t${TASKS_ALL_PASS}\t${TOTAL_TRIAL_PASS}\t${TOTAL_TRIALS}\t${TASK_COUNT}\t${K}\t${TAG}" >> "$OUTPUT"
  echo "Summary appended to $OUTPUT"
fi
