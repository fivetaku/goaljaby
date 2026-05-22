# goaljaby handoff: Korean outputs + launch UX cleanup

Date: 2026-05-22
Scope: `plugins/goaljaby`
Status: review complete, implementation not started

## Background

`goaljaby` currently generates the five goal setup documents and then prints a long `/goal ...` body for the user to copy back into Claude Code. Two UX issues were identified:

1. Generated documents mix Korean and English, so Korean-speaking users cannot comfortably review and approve the goal setup.
2. The final long prompt/code block is awkward to copy from terminal output, can break formatting, and makes the "approval" step feel disconnected from the generated documents.

The requested fix is not to change the product concept. Keep `goaljaby` as a PRD-to-goal bridge, but make the generated review surface Korean-first and remove the long prompt copy-paste UX where possible.

## Current Findings

### 1. Generated document language is English-first

Main source:

- `skills/goaljaby/references/templates.md`

Problem areas:

- `VALIDATION.md` template uses English headings and checklist text:
  - `Required Checks`
  - `Targeted Checks`
  - `Manual Verification`
  - `Acceptance Criteria Mapping`
  - `Not Done If`
- `RECOVERY.md` template is mostly English:
  - `Core Rule`
  - `Failure Loop`
  - `Retry Limit`
  - `Scope Control`
  - `Reorientation Rule`
  - `Revert Rule`
- `PLAN.md` and `PROGRESS.md` use English section names:
  - `Goal`
  - `Source Documents`
  - `Final Completion Criteria`
  - `Current Goal`
  - `Failed Attempts`
  - `Handoff Notes`
- `goal-command.md` templates F-1 through F-6 all start and continue in English:
  - `/goal Implement...`
  - `/goal Fix...`
  - `/goal Write...`
  - `/goal Migrate...`
  - `/goal Optimize...`

Secondary source:

- `skills/goaljaby/references/task-type-templates.md`

Problem areas:

- `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` and `{TASK_TYPE_SCOPE_ADDITIONS}` values are English.
- UI/doc/migration/eval additions therefore leak English into otherwise Korean output.

### 2. Validation rules are coupled to English text

Main sources:

- `skills/goaljaby/SKILL.md`
- `skills/goaljaby/references/compact-strategy.md`

Problem areas:

- Step 7 checks that `goal-command.md` starts with:
  - `^/goal (Execute|Implement|Fix|Write|Migrate|Optimize)`
- protected-clause regexes assume English phrases:
  - `until [^.]+(passes|complete|satisfied)`
  - `Do not ... (expand|change) ... scope`
  - `Read ... (PRD|VALIDATION|RECOVERY|PLAN)`
  - `[Uu]pdate PROGRESS.md`

If the templates are simply translated to Korean, Step 7 may reject valid Korean goal commands. The validation rules must be updated together with the templates.

### 3. Final workflow is copy-paste heavy

Main sources:

- `skills/goaljaby/SKILL.md`
- `commands/goaljaby.md`
- `README.md`
- `README.ko.md`

Current flow:

1. Generate five files.
2. Ask user whether they reviewed the files.
3. On approval, print the `/goal ...` body in a code block.
4. User copies it and pastes it into the next Claude Code message.

Problem:

- The user is unlikely to read all generated documents directly.
- A long `/goal` code block is fragile in terminal UI.
- Approval should happen after a readable summary, not after a list of file paths.

## Recommended Target Flow

Replace the final review/launch UX with this flow:

1. Generate the five files:
   - `VALIDATION.md`
   - `RECOVERY.md`
   - `PLAN.md`
   - `PROGRESS.md`
   - `goal-command.md`
2. Read those files back.
3. Generate a Korean review brief, for example `GOAL_BRIEF.md`.
4. Show the brief in chat:
   - goal summary
   - milestone summary
   - required validation commands
   - recovery rules
   - scope locks / non-goals
   - user decisions still needed
5. Ask for approval:
   - approve
   - revise
   - cancel / later
6. On approval, avoid dumping the long `/goal` body into the terminal. Instead:
   - record approval in `PROGRESS.md`
   - keep the full command in `goal-command.md`
   - show a short next action

Important limitation:

- Do not assume a skill can inject a new native `/goal ...` slash command into the same Claude Code session as if it were a user message. The current docs already state slash command auto-launch is not supported. The UX should minimize manual work, but should not promise fully automatic native `/goal` execution unless verified in Claude Code itself.

## Korean Output Policy

Use this policy for the patch:

- Keep file names and command identifiers as-is:
  - `PRD.md`
  - `VALIDATION.md`
  - `RECOVERY.md`
  - `PLAN.md`
  - `PROGRESS.md`
  - `goal-command.md`
  - `/goal`
- Keep shell commands, paths, code symbols, and exact validation commands as-is.
- Translate human-facing headings, tables, checklist labels, explanations, and recovery instructions into Korean.
- Prefer Korean task wording inside `goal-command.md`.
- If keeping the initial `/goal Implement/Fix/...` verb is necessary for compatibility, keep only that minimal English command verb and make the rest Korean.
- If fully Korean `/goal` text is desired, update Step 7 regexes to accept Korean command starts and Korean protected clauses.

## Concrete Edit Map

### `skills/goaljaby/references/templates.md`

Highest priority. Translate all generated document templates:

- `VALIDATION.md`
  - `Required Checks` -> `필수 검증`
  - `Targeted Checks` -> `마일스톤별 검증`
  - `Manual Verification` -> `수동 확인`
  - `Acceptance Criteria Mapping` -> `완료 기준 매핑`
  - `Not Done If` -> `완료로 보지 않는 조건`
  - table headers -> Korean
  - checklist items -> Korean
- `RECOVERY.md`
  - all headings and bullets -> Korean
  - keep `PRD.md`, `PLAN.md`, `VALIDATION.md`, `PROGRESS.md` file names unchanged
- `PLAN.md`
  - headings and milestone fields -> Korean
- `PROGRESS.md`
  - headings and table headers -> Korean
- `goal-command.md`
  - convert F-1 through F-6 bodies to Korean-first instructions
  - preserve all five protected concepts:
    - explicit finish condition
    - scope lock
    - 3-attempt stop rule
    - required document reads
    - `PROGRESS.md` update rule

### `skills/goaljaby/references/task-type-templates.md`

Translate type-specific additions:

- Not-done-if additions
- Scope-control additions
- UI visual verification labels
- Doc/migration/eval-specific instructions

### `skills/goaljaby/references/compact-strategy.md`

Update protected-clause definitions and verification examples.

Recommended approach:

- Accept Korean and English variants during transition.
- Keep regexes simple and deterministic.
- Add examples for Korean compacted goal text.

Example conceptual mapping:

- finish condition:
  - English: `until ... passes|complete|satisfied`
  - Korean: `완료 기준|검증|통과|만족|끝날 때까지`
- scope lock:
  - English: `Do not expand/change scope`
  - Korean: `범위를 확장하지 말 것`, `스코프를 변경하지 말 것`
- 3-attempt rule:
  - English: `3 attempts`
  - Korean: `3회`, `세 번`
- read docs:
  - English: `Read PRD.md...`
  - Korean: `PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md를 먼저 읽`
- progress update:
  - English: `Update PROGRESS.md`
  - Korean: `PROGRESS.md를 업데이트`, `PROGRESS.md에 기록`

### `skills/goaljaby/SKILL.md`

Update the workflow text:

- State that generated outputs are Korean-first.
- Step 7 should reference Korean/English-compatible protected-clause checks.
- Replace Step 8-10 with the new brief-and-approval flow.
- Remove the claim that Step 10 prints the full `/goal` body as a code block for paste-back.
- Add `GOAL_BRIEF.md` as a generated review artifact if that file is adopted.

### `commands/goaljaby.md`

Update command behavior summary:

- Say that Step 8 generates and shows a Korean review brief.
- Say that Step 9 asks for approval based on the brief.
- Say that Step 10 records approval and gives a short next action, not a long copy-paste block.
- Remove stale external methodology reference:
  - current stale line: `../../00_왜_이_흐름인가.md 외 7개 문서`
  - replace with plugin-local references under `skills/goaljaby/references/`

### `README.md` and `README.ko.md`

Update user-facing docs:

- Remove "paste-back into the same Claude Code session" as the main UX promise.
- Explain Korean-first generated docs.
- Explain the brief approval flow.
- Be honest that native `/goal` launch may still require a final user action.
- Prefer `README.ko.md` as the most complete learner-facing explanation.

### Tests / Fixtures

Existing fixture:

- `tests/fixtures/settings-persistence-prd/expected-outputs/goal-command.md`

Required updates:

- Replace English expected goal output with Korean-first expected output.
- Add or update a Korean PRD fixture so language behavior is tested from Korean input.
- Add a check that generated files do not contain the old English headings:
  - `Required Checks`
  - `Targeted Checks`
  - `Manual Verification`
  - `Not Done If`
  - `Core Rule`
  - `Failure Loop`
  - `Final Completion Criteria`

If no automated test harness exists, include a manual smoke test in the release checklist.

## Acceptance Criteria

The patch is done only when all are true:

- Generated `VALIDATION.md`, `RECOVERY.md`, `PLAN.md`, and `PROGRESS.md` are Korean-first.
- `goal-command.md` is Korean-first or intentionally keeps only the minimal English `/goal` verb for compatibility.
- Step 7 validation passes with the new Korean protected clauses.
- Step 8 shows a Korean summary of the generated docs, not just file paths.
- Step 9 approval is based on the summary.
- Step 10 does not dump a long `/goal` prompt for copy-paste.
- Docs no longer promise long code block paste-back as the primary flow.
- Existing plugin packaging remains valid.

## Manual Smoke Test

Use a small Korean PRD directory and run `/goaljaby <absolute PRD path>`.

Verify:

1. The generated 5 files exist.
2. The generated document headings are Korean.
3. No old English template headings remain.
4. `goal-command.md` is `<= 4000` characters.
5. Protected-clause validation passes.
6. The chat output shows a Korean review brief.
7. Approval flow offers revise/cancel paths.
8. Approval does not require copying a long terminal code block.

## Release Checklist

Follow the marketplace/submodule checklist from the repo `AGENTS.md` after implementation:

1. Commit and push inside `plugins/goaljaby`.
2. Bump `.claude-plugin/plugin.json`.
3. Update `CHANGELOG.md` if present or add one if the plugin convention requires it.
4. Commit the parent submodule pointer.
5. Sync the marketplace clone.
6. Replace the Claude plugin cache for `goaljaby`.
7. Update `installed_plugins.json`.
8. Restart Claude Code before claiming the new behavior is active.

## Suggested Next-Agent Prompt

```text
You are working in the gptaku_plugins repo. Focus only on plugins/goaljaby.

Implement the handoff in plugins/goaljaby/HANDOFF-ko-output-and-launch-ux-20260522.md.

Goals:
1. Make all goaljaby-generated review documents Korean-first.
2. Update protected-clause validation so Korean goal-command text passes.
3. Replace the final long /goal copy-paste UX with a Korean summary/approval flow.
4. Keep file names, command names, paths, and shell commands unchanged.
5. Do not touch unrelated dirty files in the parent repo.

After edits, run a fixture/manual smoke check and report exact changed files plus any remaining limitation around native /goal auto-launch.
```
