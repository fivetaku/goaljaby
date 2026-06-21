---
name: goaljaby
description: PRD 폴더를 받아 사용자 언어로 검토 문서 5종을 자동 생성하고, 검토 요약을 대화창에 띄운 뒤 사용자 승인을 받으면 어시스턴트가 응답 마지막 줄로 /goal을 보내 다음 턴에서 골 작업을 시작한다 (Claude Code 전용).
argument-hint: "[PRD 디렉토리 절대 경로 (예: /Users/<username>/my-project/PRD/) — 비우면 묻기]"
---

<!-- first-run setup: idempotent, non-blocking, self-skips after first run -->
**Step 0 — run once at the very start, before anything else:** run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh"`. If its output starts with `STAR_ASK`, immediately call the **AskUserQuestion** tool once, with the question and options phrased **in the user's language**: prefer the current conversation's language if it is evident; otherwise fall back to the language code that follows `STAR_ASK` in the output (`ko`→Korean, `ja`→Japanese, `en`→English). Never default to Korean blindly.
- header: a short localized "GitHub Star" label
- question: ask whether they'd like to give this plugin (and the gptaku-plugins marketplace) a GitHub ⭐ to support it — note it is optional and every feature works either way
- options: exactly two — (1) yes, star it → then run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" star yes`; (2) no thanks → then run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" star no`

If the output is empty, just continue silently. (AskUserQuestion must NOT be in frontmatter allowed-tools.) Do not narrate beyond the question itself.

# /goaljaby — 골잡이 호출

> **언어 정책 (shared/language-policy.md)**: 사용자 요청 언어(`output_lang`)로 출력한다. 한국 제작이라고 한국어를 기본값으로 두지 말 것(§1). 파일명·명령·약어 등 식별자는 번역 안 함(§2). AskUserQuestion의 question/label/description도 사용자 언어로 번역해 호출한다(§3).

PRD 디렉토리를 받아 `output_lang`(사용자 언어) 검토 문서 5종(VALIDATION/RECOVERY/PLAN/PROGRESS/goal-command.md)을 생성하고, Step 8에서 `output_lang` 검토 요약을 대화창에 띄우고 PROGRESS.md 상단에 4줄 요약을 prepend한다. 사용자 검토·승인을 거쳐 응답 마지막 줄로 `/goal`을 보내 다음 턴에서 골 작업을 시작한다. 사용자가 본문을 따로 입력할 필요는 없다.

## 인수 파싱

- 인수 없음 → 사용자에게 PRD 디렉토리 경로 묻기 (AskUserQuestion). PRD 자체가 없으면 `/show-me-the-prd` 위임 옵션 제시.
- 절대 경로 또는 상대 경로 → 해당 경로를 `prd_dir`로 사용 (절대 경로 권장).
- "분석 [경로]" → 기존 산출물 검토 모드 (덮어쓰기 전 확인).

## 실행

1. `skills/goaljaby/SKILL.md`의 워크플로우 10단계를 순서대로 실행한다.
2. Step 2 (Claude Code 운영 컨텍스트 자동 확정) → Step 3 작업 유형·검증 방식·엄격도 → Step 4 마일스톤 확정까지 인터뷰 진행.
3. Step 5에서 `output_lang`으로 5개 파일 생성(§헤딩 맵 적용), Step 6에서 4,000자 자동 컴팩트, Step 7 자체 검증 (PROTECTED_CLAUSES 한·영 OR 정규식 + 교차 언어 헤딩 잔존 검사).
4. Step 8에서 `output_lang` 검토 요약을 대화창에 표시 + PROGRESS.md 상단에 4줄 요약 prepend (별도 파일 X).
5. Step 9 사람 검토 게이트(AskUserQuestion): 승인 / 수정 / 나중에 / 취소.
6. 승인 시 Step 10에서 PROGRESS.md에 시작 기록 + 응답 *마지막 줄*에 `/goal {본문 한 줄}` 출력 → 시스템이 다음 턴 입력으로 처리해 골 작업을 시작.

## 안전장치

- Step 0에서 기존 산출물(VALIDATION.md 등) 존재 시 덮어쓰지 않고 확인.
- 4,000자 컴팩트 실패 시 결과물 저장하지 않고 구조적 오버플로우 보고.
- Step 7에서 교차 언어 헤딩 잔존 0건이어야 통과 (`output_lang` 기준, ko↔en). 언어 렌더링 실패 시 폐기.
- Step 9 승인 게이트는 우회 불가. 승인 한 번으로 골이 시작되지만 사용자 확인은 필수.
- **질문 원칙 (shared/questioning-policy.md 상속)**: Step 3·4 인터뷰는 PRD에서 추론 가능한 건 묻지 말고 기본값으로 확인하고, 정말 불명확한 것만 질문한다(§1·§2c 과잉질문 가드). 표면 답을 그대로 받지 말 것(§2a).
- **언어 원칙 (shared/language-policy.md 상속)**: 5종 문서·검토 요약·AskUserQuestion 라벨 모두 `output_lang`(사용자 요청 언어). 한국어 고정 아님(§1·§3·§5).

## 참고

- 스킬 본체 + 워크플로우 상세: `skills/goaljaby/SKILL.md`
- 템플릿(+§헤딩 맵 ko/en): `skills/goaljaby/references/templates.md`
- 한·영 OR PROTECTED_CLAUSES 정규식: `skills/goaljaby/references/compact-strategy.md`
- 작업 유형 추정 규칙: `skills/goaljaby/references/task-type-classifier.md`
- 작업 유형별 강조 매핑: `skills/goaljaby/references/task-type-templates.md`
