# 5개 파일 + /goal 명령어 템플릿

골잡이 Step 5에서 슬롯 치환에 사용한다. 메서돌로지 `99_부록_템플릿모음.md` B/C/D/E/F의 골잡이 적용판.

작업 유형별 강조 항목은 `task-type-templates.md` 참조.

슬롯 표기: `{SLOT_NAME}` — Step 1/3/4에서 추출한 값으로 치환. 비어 있으면 해당 줄 자체 제거 (placeholder 잔존 금지).

---

## B. VALIDATION.md

````md
# VALIDATION: {PROJECT_NAME}

## Required Checks

다음 명령은 골 완료로 마크하기 전 반드시 실행한다.

```bash
{REQUIRED_CHECK_COMMANDS}
```

## Targeted Checks

각 마일스톤 종료 시 실행한다.

```bash
{TARGETED_CHECK_COMMANDS}
```

## Manual Verification

{MANUAL_VERIFICATION_STEPS}

{VISUAL_VERIFICATION_BLOCK_OR_OMIT}

## Acceptance Criteria Mapping

| PRD criterion | Validation method | Status |
| --- | --- | --- |
{ACCEPTANCE_MAPPING_ROWS}

## Not Done If

- Any required check fails
- Scope changed outside PLAN.md
- Public API changed without explicit approval
- Manual repro still fails
- Artifact is generated but not inspected
- Test was deleted or skipped to pass the check
- Error was silenced without diagnosis
{TASK_TYPE_NOT_DONE_IF_ADDITIONS}
````

`{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` 는 UI 작업일 때만 다음 블록을 삽입, 그 외에는 행 자체 제거:

```md
## Visual Verification

- [ ] Desktop viewport checked
- [ ] Mobile viewport checked
- [ ] Text does not overlap
- [ ] Screenshot saved at: {SCREENSHOT_PATH}
```

---

## C. RECOVERY.md

`{RETRY_LIMIT_ACTIONS_BY_CLI}` 는 Claude Code 전용으로 고정된 문구다:

"골이 진단·검토에 진입하고 자체 수정을 멈춘다. `/goal pause`는 Claude Code가 지원하지 않으므로 사람 결정을 기다린다. 필요 시 `/goal clear` 후 재설정."

````md
# RECOVERY

## Core Rule

If validation fails, do not immediately make a broad change. Diagnose first.

## Failure Loop

When a validation step fails:

1. Read the full failure output.
2. Identify failure category: implementation bug / incorrect test / missing dependency / environment / unclear requirement / scope conflict.
3. Compare against PRD.md, PLAN.md, and VALIDATION.md.
4. Make the smallest reversible fix.
5. Re-run the smallest relevant validation first.
6. Update PROGRESS.md.

## Retry Limit

If the same validation fails after 3 distinct attempts:

{RETRY_LIMIT_ACTIONS_BY_CLI}

Report:
- failing command or criterion
- three attempted fixes
- why each failed
- safest next options
- whether user/product guidance is needed

## Scope Control

Do not:
- rewrite unrelated modules
- change public APIs unless PLAN.md says so
- change database schema unless SDD.md says so
- remove or skip tests to make checks pass
- silence errors without understanding them
- introduce broad refactors while fixing a narrow issue
- replace the validation command itself
{TASK_TYPE_SCOPE_ADDITIONS}

## Reorientation Rule

Before changing approach:

1. Reread the goal statement.
2. Reread Non-goals in PRD.md.
3. Reread current milestone in PLAN.md.
4. Confirm the next edit directly serves the current milestone.

## Revert Rule

Only revert your own last failed change if:
- it made validation worse,
- it introduced unrelated changes,
- or it conflicts with PRD / PLAN.

Do not revert user changes unless explicitly instructed.
````

---

## D. PLAN.md

`{MILESTONES_BLOCK}` 은 마일스톤 1~5개의 반복.

````md
# PLAN: {PROJECT_NAME}

## Goal

{GOAL_ONE_LINER}

## Source Documents

- PRD.md ({PRD_PATH})
- VALIDATION.md
- RECOVERY.md

{MILESTONES_BLOCK}

## Final Completion Criteria

- [ ] All milestones complete
- [ ] All checks in VALIDATION.md pass
- [ ] No scope violations
- [ ] PROGRESS.md updated
````

마일스톤 1개 형식:

```md
## Milestone {N}: {MILESTONE_NAME}
- Scope: {MILESTONE_SCOPE}
- Completion: {MILESTONE_COMPLETION}
- Validation: {MILESTONE_VALIDATION}
```

---

## E. PROGRESS.md (초기 빈 템플릿)

````md
# PROGRESS

## Current Goal

{GOAL_ONE_LINER}

## Current Milestone

Milestone 1 시작 전

## Completed

(없음)

## Last Validation

```text
(골 실행 전)
```

## Failed Attempts

| Attempt | Change | Result | Lesson |
| --- | --- | --- | --- |

## Current Best State

골 실행 전 — 초기 상태

## Next Step

PLAN.md의 Milestone 1부터 시작

## Risks / Blockers

{OPEN_QUESTIONS_FROM_PRD_OR_NONE}

## Handoff Notes

이 PROGRESS.md는 골잡이가 생성했다. 골 실행 중 매 체크포인트마다 갱신된다.
````

---

## F. goal-command.md (작업 유형별 본문 6종)

본문은 `/goal ...` 명령형 다중 줄로 들어간다. Step 6 컴팩트 5단계 적용 전 원본은 다음 6개 중 작업 유형에 맞는 것을 사용한다.

`{RETRY_PAUSE_PHRASE_BY_CLI}` 는 Claude Code 전용으로 고정된 문구다:

"stop self-edits and pause for human decision (Claude Code does not support /goal pause)"

> ⚠️ 모든 F 템플릿은 PROTECTED_CLAUSES 5종(P1~P5)을 반드시 포함하도록 작성됐다. 슬롯 치환 후에도 5종 정규식이 모두 매칭되어야 한다 (Step 7 검증).

### F-1. 버그 수정

```text
/goal Fix {BUG_NAME} until the bug repro is fixed and all checks are satisfied.

Read PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md first.
Only touch {SCOPE_MODULES} and related tests.
Do not expand scope beyond PRD.md and PLAN.md.
Do not change {NO_TOUCH_AREAS}.
Reproduce the bug before fixing.
Update PROGRESS.md after each checkpoint.
If the same validation fails after 3 attempts, {RETRY_PAUSE_PHRASE_BY_CLI}.
```

### F-2. 기능 구현

```text
/goal Implement the feature described in PLAN until every PRD acceptance criterion is satisfied and all required validation passes.

Read PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md.
Work milestone by milestone.
Do not expand scope beyond PRD.md and PLAN.md.
Do not implement optional features or change Non-goals.
Validate after each milestone.
Update PROGRESS.md after each milestone.
If validation fails after 3 attempts or requirements conflict, {RETRY_PAUSE_PHRASE_BY_CLI}.
```

### F-3. UI 구현

```text
/goal Implement the UI described in PLAN until every viewport check is complete and reference screens match per VALIDATION.

Read PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md.
Use existing design patterns in the app.
Do not expand scope beyond PRD.md and PLAN.md.
Verify {VIEWPORTS_LIST} layouts.
Capture screenshots as evidence.
Update PROGRESS.md after each viewport check.
If visual output does not match after 3 attempts, {RETRY_PAUSE_PHRASE_BY_CLI}.
```

### F-4. 문서 집필

```text
/goal Write the document described in PLAN until every section is complete and all review checks are satisfied.

Read PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md.
Write one section at a time.
Do not expand scope beyond PRD.md and PLAN.md.
After each section, self-review against VALIDATION.md.
If a section fails review, rewrite only that section, do not patch.
Update PROGRESS.md after each section.
If the same section fails review after 3 attempts, {RETRY_PAUSE_PHRASE_BY_CLI}.
Do not change tone, scope, or structure outside PRD.md.
```

### F-5. 마이그레이션

```text
/goal Migrate {MIGRATION_TARGET} until the new path passes all contract tests and parity is satisfied.

Read PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md{SDD_INCLUDE}.
Keep legacy path available unless PLAN says otherwise.
Do not expand scope beyond PRD.md and PLAN.md.
No public API change unless approved.
Run parity checks after each phase.
Update PROGRESS.md after each phase.
If parity fails after 3 attempts, {RETRY_PAUSE_PHRASE_BY_CLI}.
```

### F-6. 프롬프트/eval 개선

```text
/goal Optimize the prompts in PLAN until the eval target is satisfied and all checks pass.

Read PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md.
Record baseline scores first.
Do not expand scope beyond PRD.md and PLAN.md.
Make one prompt change at a time.
Run the eval after each change.
Update PROGRESS.md after each eval run.
If the same eval target fails after 3 attempts, {RETRY_PAUSE_PHRASE_BY_CLI}.
```

---

## 슬롯 채움 순서 (Step 5 알고리즘)

1. Step 1 결과에서 `{PROJECT_NAME}`, `{GOAL_ONE_LINER}`, `{ACCEPTANCE_MAPPING_ROWS}`, `{OPEN_QUESTIONS_FROM_PRD_OR_NONE}` 추출
2. Step 2/3/4 인터뷰 결과에서 `{TARGET_CLI}`, `{TASK_TYPE}`, 검증 명령 multiSelect, 마일스톤 확정 결과 추출
3. `task-type-templates.md`에서 `{TASK_TYPE}` 행을 읽어 `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}`, `{TASK_TYPE_SCOPE_ADDITIONS}`, 사용할 /goal 템플릿(F-1~F-6) 결정
4. CLI 슬롯 (`{RETRY_LIMIT_ACTIONS_BY_CLI}`, `{RETRY_PAUSE_PHRASE_BY_CLI}`) 은 Claude Code 전용 고정 문구로 치환 (위 참조)
5. 5개 파일 본문 생성. 마지막에 빈 `{...}` 슬롯 잔존 여부 확인 — 있으면 해당 줄 제거 또는 합리적 기본값으로 치환
6. goal-command.md만 Step 6 컴팩트로 전달
