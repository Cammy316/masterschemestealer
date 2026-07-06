# SchemeStealer LLM Skills

Four portable skills for any capable LLM (Claude Opus/Sonnet, Gemini Pro, GPT, etc.)
working on Cammy316/masterschemestealer.

## Installation

**Claude Code:** copy the four folders into `.claude/skills/` at the repo root (or
`~/.claude/skills/` for global use). Claude Code auto-discovers `SKILL.md` files.

**Other LLMs (Gemini, GPT, etc.):** the files are plain Markdown with YAML frontmatter.
Paste `schemestealer-core/SKILL.md` into the system prompt for every session, then add
the task-relevant skill(s) alongside it.

## Load order

1. `schemestealer-core` — ALWAYS. The constitution: invariants, architecture, working rules.
2. Then by task:
   - Colour detection / classification / matching / mixing → `schemestealer-colour-science`
     (plus the repo-local `skill.color-expert/` for deep theory)
   - React / UI / theme / copy → `schemestealer-frontend`
   - Paint JSON / schema / SEO pages → `schemestealer-data`

Tasks often need two (e.g. anchor changes = colour-science + data; offline detection
changes = colour-science + frontend).

## Maintenance rule

These skills record the verified state as of the last read-only diagnosis
(COLOUR_ANALYSIS_FINDINGS.md era). **Live code always wins.** When a remediation stage
lands (e.g. Stage 1 anchor fixes, Stage 4 white balance), update the corresponding bug
section in schemestealer-colour-science so the skills never teach a stale mechanism.
