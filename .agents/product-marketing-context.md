# Product Marketing Context

*Last updated: 2026-03-04*

## Product Overview
**One-liner:**
Open Agent SDK is an open-source TypeScript agent SDK implemented against Claude Agent SDK APIs, with broader provider choices and plugin-style extensibility.

**What it does:**
Open Agent SDK provides a ReAct-style runtime for AI agents, with built-in support for tools, sessions, permissions, hooks, and MCP integration. It is implemented to follow Claude Agent SDK API patterns and workflows so teams can onboard quickly, while adding more provider and extension options for custom stacks. The monorepo also includes a product website and a dedicated docs site for adoption and migration.

**Product category:**
AI agent SDK / agent runtime framework

**Product type:**
Developer infrastructure SaaS-compatible OSS SDK (open-source developer tool)

**Business model:**
Open-source core (MIT) with public package distribution (`open-agent-sdk@alpha`); open development on GitHub; commercial/monetization model: TBD

## Target Audience
**Target companies:**
Developer tooling teams, AI product teams, startups, and engineering orgs building LLM agents

**Decision-makers:**
Founders, CTOs, Engineering Managers, Staff/Principal Engineers, AI platform leads

**Primary use case:**
Build and run reliable AI agent workflows in TypeScript with tool orchestration and provider portability

**Jobs to be done:**
- Ship agent-powered features faster without reinventing runtime primitives
- Standardize tool execution, session lifecycle, and permission controls
- Switch or mix LLM providers with minimal integration churn

**Use cases:**
- Internal copilots and workflow agents
- Multi-step automation with tool calls and checkpointed sessions
- Teams migrating from Claude Agent SDK concepts

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| AI Platform Engineer (User/Champion) | API clarity, type safety, extensibility | Building robust agent runtime from scratch is slow and error-prone | Typed SDK with ready-to-use primitives for tools, sessions, permissions, hooks |
| Engineering Manager (Decision Maker) | Delivery speed, reliability, maintainability | Prototype agents break in production and are hard to govern | Production-minded architecture with explicit control surfaces and testability |
| Founder/Tech Lead (Financial Buyer) | Time-to-market and strategic flexibility | Vendor lock-in risk and costly rewrites | Multi-provider support and open architecture reduce lock-in |

## Problems & Pain Points
**Core problem:**
Teams can prototype agent behavior quickly but struggle to productionize tool use, state, and safety controls without giving up familiar Claude-like ergonomics.

**Why alternatives fall short:**
- Raw SDK usage often lacks opinionated runtime structure for multi-step agent execution
- Claude-only paths can limit provider and extension flexibility for mixed stacks
- Ad hoc implementations produce inconsistent permission and session handling

**What it costs them:**
Longer delivery timelines, brittle agent behavior, repeated rework, and slower experimentation

**Emotional tension:**
Fear of shipping unreliable autonomous behavior and concern about long-term architecture bets

## Competitive Landscape
**Direct:** Claude Agent SDK — strongest baseline for API/workflow expectations; falls short for teams that need broader provider/plugin flexibility in one SDK

**Secondary:** Build in-house runtime over provider SDKs (OpenAI/Anthropic/Gemini directly) — high engineering overhead and maintenance burden

**Indirect:** Manual operations or non-agent automations — less flexible for complex, multi-step reasoning workflows

## Differentiation
**Key differentiators:**
- ReAct-style agent loop with multi-turn execution
- Claude Agent SDK API-aligned implementation and Claude-like developer experience
- Open-source MIT-licensed core with transparent code and workflows
- First-class tools, sessions, permissions, and hooks
- Multi-provider support (OpenAI, Google Gemini, Anthropic)
- MCP integration support
- Strong TypeScript typing across public APIs

**How we do it differently:**
Provide a cohesive TypeScript-first runtime abstraction implemented around Claude Agent SDK API patterns while exposing broader provider options and plugin-style extension points.

**Why that's better:**
Teams get a familiar developer experience for faster adoption, transparent open-source implementation for trust and control, plus lower lock-in risk and cleaner long-term migration/maintenance paths.

**Why customers choose us:**
They need an open-source Claude Agent SDK-style API with production controls and provider/plugin flexibility without building their own framework.

## Objections
| Objection | Response |
|-----------|----------|
| "We can build this ourselves quickly." | You can start quickly, but session, permission, and tool orchestration complexity compounds in production; SDK primitives reduce hidden maintenance cost. |
| "Another abstraction layer may limit us." | The SDK is open/extensible and TypeScript-native, designed for custom tools/providers/hooks. |
| "We already use Claude Agent SDK." | Open Agent SDK follows Claude Agent SDK API patterns, reducing migration friction while adding more provider and extension choices. |
| "Open-source projects can be risky." | Core code is transparent and MIT-licensed, so teams can audit behavior and avoid black-box lock-in. |
| "We're worried about lock-in." | Multi-provider architecture and open-source core are designed to reduce lock-in risk. |

**Anti-persona:**
Teams that only need lightweight single-prompt wrappers, have no tool/session/permission requirements, and do not care about Claude API alignment or multi-provider/plugin extensibility

## Switching Dynamics
**Push:**
Current ad hoc agent code is fragile, hard to govern, and expensive to evolve

**Pull:**
A typed, production-oriented runtime with Claude-like ergonomics, tools/sessions/permissions, and multi-provider support

**Habit:**
Existing internal wrappers and familiarity with current scripts

**Anxiety:**
Migration effort, API differences, and concerns about adopting an alpha release

## Customer Language
**How they describe the problem:**
- "Our demo works, but production workflows keep breaking."
- "Tool calling gets messy once we add real state and permissions."
- "We want Claude-style DX, but need more provider and plugin options."
- "We don't want to be tied to one model provider."

**How they describe us:**
- "A TypeScript SDK for production-grade AI agents."
- "A Claude Agent SDK API-aligned open-source SDK with more extension options."
- "An open-source alternative with Claude-style APIs and multi-provider support."

**Words to use:**
production-grade, open-source, MIT-licensed, Claude-like DX, aligned capabilities, typed, tool orchestration, sessions, permissions, hooks, multi-provider, extensible, plugin-friendly, migration-friendly

**Words to avoid:**
magic, no-code, fully autonomous without oversight, guaranteed outcomes

**Glossary:**
| Term | Meaning |
|------|---------|
| ReAct loop | Iterative reasoning and acting cycle with tool calls |
| Session | Persistent runtime state for multi-turn agent workflows |
| Provider | LLM backend implementation (OpenAI/Gemini/Anthropic) |
| MCP | Model Context Protocol integration for external tools/context |

## Brand Voice
**Tone:**
Technical, confident, practical

**Style:**
Direct, implementation-focused, low-hype

**Personality:**
Reliable, pragmatic, transparent, engineering-first

## Proof Points
**Metrics:**
- SWE-bench: TBD (public benchmark result placeholder)
- Terminal-bench: TBD (public benchmark result placeholder)
- Adoption/conversion metrics: TBD (docs -> install, quickstart completion, retention)

**Customers:**
TBD

**Testimonials:**
> "TBD" — TBD

**Value themes:**
| Theme | Proof |
|-------|-------|
| Production readiness | ReAct loop + session + permissions + hooks in core feature set |
| Flexibility | Multi-provider support and open/extensible architecture |
| Developer ergonomics | Strict TypeScript typing and practical docs/migration guides |

## Goals
**Business goal:**
Grow adoption of Open Agent SDK among teams building production AI agents

**Conversion action:**
Primary: docs visits to quickstart and successful first implementation; Secondary: package installation (`open-agent-sdk@alpha`) and GitHub engagement

**Current metrics:**
- SWE-bench: TBD
- Terminal-bench: TBD
- Docs -> install conversion: TBD
