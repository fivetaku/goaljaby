English | [한국어](README.ko.md)

# goaljaby (골잡이)

<p align="center">
  <img src="assets/goaljaby-hero-01.png" alt="goaljaby" width="320">
</p>

> **PRD-to-/goal bridge for Claude Code — turn your spec into a verifiable, recoverable, runnable goal.**

goaljaby takes a PRD folder (manual or from `/show-me-the-prd`) and auto-produces five documents wrapping a verify/recover loop — VALIDATION, RECOVERY, PLAN, PROGRESS, and a runnable `/goal` command — then surfaces the `/goal` body as a code block for paste-back into the same Claude Code session, after a mandatory human approval gate.

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

Relative paths also work:

```
/goaljaby ./PRD/
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
- **Verify + Recover is the real workload** — VALIDATION (acceptance mapping + Not Done If) and RECOVERY (3-attempt rule + scope lock) keep a multi-turn goal honest. goaljaby auto-generates both from the PRD.
- **4,000-char compact is enforced, not warned** — Claude Code's `/goal` has a 4,000-character ceiling. goaljaby applies a 5-stage compact and aborts cleanly with a structural-overflow report if it still cannot fit. No silent truncation, no advisory warnings.
- **PROTECTED_CLAUSES are uncuttable** — Stop condition, scope lock, 3-attempt rule, doc-read directive, and PROGRESS update are required and verified by regex after compact. If any clause is missing post-compact, the output is discarded.
- **Mandatory human approval gate** — Step 10 will not surface the `/goal` body until human approval comes back from Step 9.

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
[Step 5] Slot-fill into 5 documents
     │   VALIDATION.md / RECOVERY.md / PLAN.md / PROGRESS.md / goal-command.md
     ▼
[Step 6] Auto-compact goal-command.md to ≤4,000 chars
     │   normalize → externalize → abbreviate → summarize → trim
     ▼
[Step 7] Deterministic self-verification
     │   grep -P against 5 PROTECTED_CLAUSES + char count
     │   On failure → structural overflow report + DISCARD output
     ▼
[Step 8-9] Show outputs + REQUIRED human approval gate
     ▼
[Step 10] Print /goal body as a code block for paste-back
```

---

## Outputs

```
[PRD directory]/
├── VALIDATION.md      ← acceptance mapping + Not Done If
├── RECOVERY.md        ← 3-attempt rule + scope lock + task-type recovery
├── PLAN.md            ← milestones (≤5) + Final Completion Criteria
├── PROGRESS.md        ← empty initial template
└── goal-command.md    ← /goal body (always ≤4,000 chars)
```

Each document's emphasis adapts to the task type (Feature / Bugfix / UI / Doc / Migration / Eval).

---

## Task types

| Task type | VALIDATION emphasis | RECOVERY emphasis | /goal template |
|-----------|---------------------|-------------------|----------------|
| Feature | Unit + integration tests | Scope lock | F-2 |
| Bugfix | Original repro + regression | No unrelated module edits | F-1 |
| UI | Screenshots + viewport checks | Design token protection | F-3 |
| Doc | Section-by-section review | Frozen-once-approved sections | F-4 |
| Migration | Parity check + rollback | Public API immutability | F-5 |
| Eval | Score vs baseline | One prompt change at a time | F-6 |

Task type is auto-estimated from PRD content (weighted Korean + English keyword matching) and finalized by the user in Step 3.

---

## Core promises

- **`goal-command.md` is always ≤4,000 characters** — If compact can't fit, the file is not saved; a structural-overflow report is printed instead. No warnings-and-shrug.
- **PROTECTED_CLAUSES are inviolate** — Stop condition, scope lock, 3-attempt rule, doc references, and PROGRESS update are protected by regex at compact time.
- **Step 9 approval gate cannot be bypassed** — Step 10 will not surface the /goal body until human approval comes back.
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

**Don't just start a goal. Finish it correctly.**

</div>
