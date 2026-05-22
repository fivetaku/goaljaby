English | [한국어](README.ko.md)

# goaljaby (골잡이)

<p align="center">
  <img src="assets/goaljaby-hero-01.png" alt="goaljaby" width="320">
</p>

> **PRD-to-/goal bridge for Claude Code — Korean review docs, then the goal starts right after your approval.**

goaljaby takes a PRD folder (manual or from `/show-me-the-prd`) and auto-produces five Korean review documents wrapping a verify/recover loop — VALIDATION, RECOVERY, PLAN, PROGRESS, and the `/goal` command body. The Korean review summary is shown directly in chat (no extra file), and a 4-line summary is prepended to PROGRESS.md for handoff. You read in Korean, approve once, and the goal starts on the next turn — the assistant emits the `/goal` line for you.

[Quick Start](#quick-start) • [Why goaljaby?](#why-goaljaby) • [How it works](#how-it-works) • [Outputs](#outputs) • [Task types](#task-types) • [Commands](#commands) • [Requirements](#requirements)

---

## Quick Start

### 1. Add the marketplace

```
/plugin marketplace add https://github.com/fivetaku/gptaku_plugins.git
```

### 2. Install

```
/plugin install goaljaby
```

### 3. Restart Claude Code

### 4. Run

With an existing PRD directory — **absolute path recommended**:

```
/goaljaby /Users/<username>/my-project/PRD/
```

Without a PRD — goaljaby offers to delegate to `/show-me-the-prd`:

```
/goaljaby
```

Or just say it naturally:

- "골잡이 호출"
- "골 셋업 만들어줘"
- "PRD에서 골 만들어줘"
- "set up goal from PRD"

---

## Why goaljaby?

- **A PRD alone isn't enough** — A PRD says *what* to build. `/goal` requires *how to prove it's done* and *how to recover when it goes wrong*. Missing either, the goal stops at "looks plausible" or drifts off-scope.
- **Korean review, not English boilerplate** — Generated documents are Korean-first so users actually read and review before approving. Headings like 필수 검증, 완료 기준 매핑, 완료로 보지 않는 조건 — not their English equivalents.
- **Review summary lives in chat** — No extra brief file. Step 8 shows a Korean review summary directly in chat and prepends a 4-line summary to PROGRESS.md so handoff still works.
- **Approve once, work begins** — After your approval, the assistant emits `/goal {body}` on the last line of its reply and the session starts the goal on the next turn. You read the Korean review summary, approve, and the work begins.
- **4,000-char compact is enforced, not warned** — Claude Code's `/goal` has a 4,000-character ceiling. goaljaby applies a 5-stage compact and aborts cleanly with a structural-overflow report if it still cannot fit. No silent truncation.
- **PROTECTED_CLAUSES are uncuttable** — Stop condition, scope lock, 3-attempt rule, doc-read directive, and PROGRESS update are verified by Korean+English OR regex after compact. If any clause is missing post-compact, the output is discarded.
- **Mandatory human approval gate** — Step 9's AskUserQuestion is non-bypassable. The goal only starts after your explicit approval.

---

## How it works

```
PRD directory
     │
     ▼
[Step 0-1] Pre-check + analysis
     │   No PRD? → delegate to /show-me-the-prd
     │   Extract acceptance / non-goals / task type
     ▼
[Step 2-4] Interview (1-2 rounds)
     │   task_type, validation methods, strictness, milestones
     ▼
[Step 5] Slot-fill 5 Korean documents
     │   VALIDATION / RECOVERY / PLAN / PROGRESS / goal-command
     ▼
[Step 6] Auto-compact goal-command.md to ≤4,000 chars
     │   normalize → externalize → abbreviate → summarize → trim
     ▼
[Step 7] Deterministic self-verification
     │   grep -P against 5 Korean+English OR PROTECTED_CLAUSES
     │   + character count + English-heading-leak check
     │   On failure → structural overflow report + DISCARD
     ▼
[Step 8] Show Korean review summary in chat
     │   + prepend 4-line summary to PROGRESS.md (handoff)
     ▼
[Step 9] AskUserQuestion — approve / revise / later / cancel
     ▼
[Step 10] On approval:
          • Record start time in PROGRESS.md
          • Emit `/goal {body}` as the last line of the reply
          • Session starts the goal on the next turn
```

---

## Outputs

```
[PRD directory]/
├── VALIDATION.md      ← 필수 검증 / 완료 기준 매핑 / 완료로 보지 않는 조건
├── RECOVERY.md        ← 기본 원칙 / 실패 루프 / 재시도 한계 / scope 잠금
├── PLAN.md            ← 목표 / 마일스톤(≤5) / 최종 완료 기준
├── PROGRESS.md        ← 빈 초기 템플릿 + Step 8 4-line summary prepended
└── goal-command.md    ← /goal 본문 (한국어, ≤4,000 chars)
```

All five are Korean-first. The Step 8 review summary is shown in chat only (no extra file). File names, command identifiers, and shell commands stay as-is.

---

## Task types

| Task type | VALIDATION emphasis | RECOVERY emphasis | /goal template |
|-----------|---------------------|-------------------|----------------|
| 기능 구현 (Feature) | Unit + integration tests | scope lock | F-2 |
| 버그 수정 (Bugfix) | Original repro + regression | No unrelated module edits | F-1 |
| UI 구현 | Screenshots + viewport checks | design token protection | F-3 |
| 문서 집필 | Section-by-section review | Frozen-once-approved sections | F-4 |
| 마이그레이션 | Parity check + rollback | public API immutability | F-5 |
| eval 개선 | Score vs baseline | One prompt change at a time | F-6 |

Task type is auto-estimated from PRD content (weighted Korean + English keyword matching) and finalized by the user in Step 3.

---

## Core promises

- **Generated docs are Korean-first** — English-heading leak is detected in Step 7. If found, results are discarded. No half-English output.
- **Review summary stays in chat** — No separate brief file. PROGRESS.md gets a 4-line summary at the top for handoff.
- **`goal-command.md` is always ≤4,000 characters** — If compact can't fit, the file is not saved; a structural-overflow report is printed instead.
- **PROTECTED_CLAUSES are inviolate** — Stop condition, scope lock, 3-attempt rule, doc references, and PROGRESS update are protected by Korean+English OR regex.
- **Step 9 approval gate cannot be bypassed** — Step 10 only fires after explicit human approval.
- **Self-demonstrating** — building this skill itself is a valid goaljaby target.

---

## Commands

| Command | Description |
|---------|-------------|
| `/goaljaby [PRD directory]` | Start with an existing PRD directory |
| `/goaljaby` | Interactive — offers to delegate to `/show-me-the-prd` if no PRD |

### Natural language triggers

- "골잡이 호출"
- "골 셋업 만들어줘"
- "PRD에서 골 만들어줘"
- "VALIDATION RECOVERY 만들어줘"
- "set up goal from PRD"
- "make goal scaffolding"
- "prep goal docs"

---

## Requirements

- [Claude Code](https://docs.anthropic.com/claude-code) CLI **v2.1.139+**
- Hooks active (`disableAllHooks` / `allowManagedHooksOnly` unset)

### Optional plugins (recommended)

| Plugin | What it adds |
|--------|--------------|
| `show-me-the-prd` | goaljaby auto-delegates in Step 0 when no PRD exists |

The plugin works without it — Step 0 falls back to a manual PRD path or a single-line light-mode goal.

---

## Source

Claude Code `/goal`: https://code.claude.com/docs/en/goal

---

## License

MIT

---

<div align="center">

**Read in Korean. Approve. The goal begins.**

</div>
