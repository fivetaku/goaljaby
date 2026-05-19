---
name: goaljaby
description: This skill should be used when the user asks to "/goaljaby", "골잡이", "골잡이 호출", "골 셋업 만들어줘", "골 셋업해줘", "PRD에서 골 만들어줘", "PRD 골 변환", "VALIDATION RECOVERY 만들어줘", "골 실행 준비", "set up goal from PRD", "goaljaby", "prep goal docs", "make goal scaffolding". Use this whenever the user has a PRD folder and wants to bridge into a /goal-driven long-running session — generating VALIDATION/RECOVERY/PLAN/PROGRESS/goal-command.md with a 4,000-character compact-enforced /goal command. Make sure to use this skill whenever the user mentions converting PRD to a goal, preparing goal scaffolding, or generating goal validation/recovery docs.
---

# 골잡이 (goaljaby)

> PRD를 `/goal` 운영 계약으로 변환하는 브릿지 스킬. 검토와 복구 루프가 들어간 5종 문서를 생성하고, 사람 승인 후 `/goal`까지 실행한다.

## 이 스킬을 쓰는 이유

PRD가 "무엇을 만들지"라면, `/goal`은 "어떻게 끝났음을 증명하고 실패에서 어떻게 돌아올지"의 운영 계약이다. 두 단계 사이의 빈 구간(VALIDATION/RECOVERY/PLAN 작성 + 4,000자 컴팩트)을 매번 손으로 채우는 대신 자동화한다.

## 입력

- **필수**: PRD 디렉토리 경로 (최소 1개 `.md` 파일, acceptance criteria 포함 권장)
- **선택**: 작업 유형(자동 추정 가능), 골 엄격도, 출력 위치

PRD가 없으면 `/show-me-the-prd`를 먼저 호출하라고 안내한다.

## 출력

### 항상 생성되는 5개 파일

```
[output_dir]/
├── VALIDATION.md      — PRD acceptance criterion 매핑 + Not Done If
├── RECOVERY.md        — 3회 룰 + scope 잠금 + 작업 유형별 복구 규칙
├── PLAN.md            — 마일스톤 (≤5) + Final Completion Criteria
├── PROGRESS.md        — 빈 초기 템플릿
└── goal-command.md    — /goal 실행 문장 (Claude Code 4,000자 강제)
```

### target_cli ∈ {codex_cli, both}일 때 추가 생성

```
└── codex-handoff.md   — Codex 세션 시작용 핸드오프 프롬프트 (메서돌로지 05번 §3-3 기반)
```

이 파일은 Codex CLI를 새 세션으로 띄울 때 첫 메시지로 그대로 붙여넣는 용도다. 단순히 `/goal` 문장만 던지면 Codex는 PRD/VALIDATION 위치를 모르므로, 핸드오프 프롬프트로 컨텍스트를 먼저 잡고 그 뒤에 `/goal`로 진입한다. 자세한 구조는 `references/codex-handoff-template.md` 참조.

**보장사항**: `goal-command.md` 본문은 항상 4,000자 이하다. 컴팩트로도 못 맞추면 결과물을 저장하지 않고 구조적 오버플로우로 보고한다. 사용자에게 경고만 던지고 끝내지 않는다.

## 워크플로우 (10단계)

### Step 0: PRD 사전 확인 + 입력 분기
**타입**: Bash + AskUserQuestion (조건부)

PRD 디렉토리 인수와 내용을 확인한다.

**0-A) 인수 있음 + 디렉토리 존재 + `.md` 1개 이상**
- Bash로 acceptance criteria 패턴(`- [ ]`, "Acceptance Criteria", "완료 판정", "completion criteria") 확인. 없으면 Step 1에서 경고하지만 진행은 계속한다.
- 기존 산출물(VALIDATION.md / RECOVERY.md / PLAN.md / PROGRESS.md / goal-command.md 중 하나라도) 존재 시 AskUserQuestion: 덮어쓰기 / 이어가기(기존 PROGRESS.md 읽고 골 재실행만 안내) / 취소.
- → Step 1 진입.

**0-B) 인수 없음 OR 디렉토리 없음 OR `.md` 0개**

AskUserQuestion: "PRD가 아직 없네요. 어떻게 시작할까요?"
- `/show-me-the-prd`로 지금 만든다 (추천) — Skill 도구로 `show-me-the-prd:show-me-the-prd` 위임 호출. PRD 폴더 생성 후 골잡이가 그 경로로 0-A 재진입.
- 수동 작성한 PRD 폴더 경로를 알려준다 — 경로 받아 0-A 재진입.
- PRD 없이 한 줄 목표만 입력하고 진행 — 임시 PRD.md 생성 (한 문장 goal + 자동 추출 1~2 acceptance), `light` 엄격도 + 마일스톤 1개 강제.
- 취소.

### Step 1: PRD 분석
**타입**: prompt + Bash

PRD 본문을 읽고 추출:
- acceptance criteria (없으면 사용자에게 경고)
- non-goals
- open questions
- 작업 유형 추정 (한/영 키워드 동시 매칭 — `references/task-type-classifier.md` 참조)

### Step 2: CLI 타깃 선택
**타입**: AskUserQuestion

```
질문: "어느 CLI에서 골을 운영할 예정인가요?"
- Claude Code (추천) — 기본 활성, 4,000자 제한, hooks 기반
- Codex CLI — pause/resume 지원, 옵트인 활성화 필요
- 둘 다 — 두 CLI 모두에서 안전한 공통 문장만 사용
```

CLI별 운영 규칙은 `references/cli-rules.md` 참조.

### Step 3: 작업 유형 + 검증 방식 + 엄격도
**타입**: AskUserQuestion (1~2회로 압축)

- 작업 유형 6종: 기능 구현 / 버그 수정 / UI 구현 / 문서 집필 / 마이그레이션 / eval 개선
- 자동 검증 방식 (multiSelect): 단위 테스트 / 빌드 / 수동 재현 / 스크린샷 / 섹션 자가 검토 / eval 스코어 / 통합 / 패리티
- 엄격도: 표준(추천) / 엄격 / 가벼움

### Step 4: 마일스톤 추출 + 사용자 확정
**타입**: prompt + AskUserQuestion

PRD acceptance criteria를 그룹화하여 마일스톤 초안 생성. ≤5개 강제. 5개 초과 시 우선순위 상위 5개만 1차로 가져가고 나머지는 메모로 분리.

사용자에게 마일스톤 목록을 preview로 보여주고 확정.

### Step 5: 5개 파일 슬롯 채움
**타입**: rag + generate

`references/templates.md`의 5개 템플릿을 PRD 내용에 맞춰 슬롯 치환. 작업 유형에 따라 강조 항목이 달라진다 — 매핑 표는 `references/task-type-templates.md` 참조.

### Step 6: goal-command.md 4,000자 자동 컴팩트
**타입**: prompt + Bash

`compact-strategy.md`의 5단계를 인라인으로 적용한다. 텍스트 변환은 Claude가 수행, 단계별 길이 측정은 `python3 -c "print(len(open('goal-command.md').read()))"`로 결정론적으로 측정.

우선순위 5단계:

1. 정규화 (공백·줄바꿈)
2. 운영 규칙 외부화 (본문엔 "Follow RECOVERY.md"만)
3. 약어 치환 (V.md/R.md/P.md + 본문 상단 범례)
4. 마일스톤 요약 (이름만 두고 상세는 PLAN.md에 위임)
5. 작업 유형별 군더더기 제거

**PROTECTED_CLAUSES**: 정지조건/scope잠금/3회룰/문서참조/PROGRESS업데이트 5종은 절대 삭제 금지. 상세는 `references/compact-strategy.md` 참조.

### Step 7: 자체 검증
**타입**: Bash + Read

LLM 인지에만 의존하지 않는다. Bash 도구로 결정론적 검증한다.

1. **문자수 ≤ 4,000자**: `python3 -c "import sys; print(len(open(sys.argv[1]).read()))" goal-command.md` (UTF-8 char 단위. `wc -c`는 byte 단위라 한글 있으면 부정확).
2. **PROTECTED_CLAUSES 5종 정규식 매칭**: `compact-strategy.md` §보호 영역의 5개 정규식을 `grep -P` 또는 Python으로 매칭. 5개 모두 hit 필수.
3. **명령형 동사 시작**: `grep -cE '^/goal (Execute|Implement|Fix|Write|Migrate|Optimize)' goal-command.md` 결과가 1 이상이어야 함.
4. **약어 치환 후 미정의 약어 없음**: 본문에서 `\b[A-Z]+\.md\b` 패턴 추출 후 표준 약어(VALIDATION/RECOVERY/PLAN/PROGRESS/PRD/SDD)와 본문 상단 `[Abbreviations]` 범례 정의 외에 등장하는지 확인.
5. **acceptance 매핑 누락 없음**: VALIDATION.md의 `## Acceptance Criteria Mapping` 테이블 행 수가 PRD acceptance criterion 수 이상인지 확인.

하나라도 실패 → `compact-strategy.md` §구조적 오버플로우 보고로 분기. **`goal-command.md`를 저장하지 않는다.**

### Step 8: 결과물 출력 + 검토 안내
**타입**: generate

5개 파일 경로를 사용자에게 안내. 검토 우선순위 명시:
1. VALIDATION.md — 자동 검증 명령이 실제로 실행 가능한지
2. RECOVERY.md — 3회 룰과 scope 잠금이 자기 작업에 맞는지
3. PLAN.md — 마일스톤 분리가 합리적인지
4. goal-command.md — 4,000자 이내인지 + 종료 조건이 명확한지

### Step 9: 사람 검토 + 승인 대기
**타입**: AskUserQuestion (필수 게이트)

```
질문: "5개 문서 검토하셨나요? 어떻게 진행할까요?"
- 승인 — 지금 바로 /goal 실행 (추천)
- 수정 필요 — 어떤 파일을 어떻게 바꿀지 말씀해 주세요
- 나중에 직접 실행 — goal-command.md 안내만 받고 종료
```

이 단계는 메서돌로지의 "골 실행 전 사람 검토" 안전장치를 보존한다 — 자동 실행을 우회하지 말 것.

### Step 10: 승인 시 /goal 안내 또는 Codex 핸드오프
**타입**: prompt + Bash

승인이 들어오면 CLI 타깃에 따라 분기한다.

**`target_cli == claude_code`** — 현재 세션에 붙여넣기 안내
- 스킬은 슬래시 커맨드를 직접 호출하지 못한다. `goal-command.md`의 `/goal {본문}` 한 줄을 코드블럭으로 화면에 출력하고, 사용자에게 "위 코드블럭을 그대로 다음 메시지로 입력하면 `/goal` 실행이 시작됩니다"라고 안내한다.
- 출력 직전 PROGRESS.md에 "골 발사 안내 시각 + 사용 CLI = claude_code" 한 줄 기록

**`target_cli == codex_cli`** — 핸드오프 프롬프트 전달
- Claude Code 세션에서 Codex 세션을 직접 띄울 수 없음
- `codex-handoff.md`를 출력 디렉토리에 생성 (이미 Step 5에서 생성됐다면 최신화)
- 핸드오프 프롬프트 본문을 코드블럭으로 화면에 출력 → 사용자가 새 Codex CLI 세션에 그대로 붙여넣음
- 핸드오프 프롬프트가 자동으로 다음을 수행하도록 구성:
  1. PRD/VALIDATION/RECOVERY/PLAN/PROGRESS 5개 파일 순서대로 읽기
  2. 현재 목표·마일스톤·완료작업·남은작업·필수검증·복구규칙 요약 (구현 금지)
  3. 사용자 승인 대기
  4. 승인 시 `goal-command.md`의 /goal 문장으로 실행 진입
- PROGRESS.md에 "핸드오프 발행 시각 + 사용 CLI = codex_cli + handoff-only" 한 줄 기록

**`target_cli == both`** — 어디서 시작?
- 사용자에게 "지금 이 세션(Claude Code)에서 시작? 아니면 Codex 핸드오프?" 한 번 더 묻기
- 답에 따라 위 두 분기 중 하나로 진행

자동 실행/핸드오프 발행 후 사용자에게 "완료 조건 도달 시 PROGRESS.md를 어떻게 확인하는지"도 한 줄로 안내.

## Settings (가변 요소)

| 설정 | 기본값 | 변경 방법 |
|------|--------|-----------|
| `target_cli` | `claude_code` | Step 2 AskUserQuestion |
| `task_type` | 자동 추정 | Step 3 AskUserQuestion |
| `strictness` | `standard` | Step 3 AskUserQuestion |
| `output_dir` | PRD 디렉토리와 동일 | 호출 시 인수 |
| `overwrite_existing` | `false` (확인 받음) | Step 0 분기 |

## References

- **`references/cli-rules.md`** — target_cli별 Step 5/10 운영 규칙 (배경·비교는 강의 자료 참조)
- **`references/templates.md`** — 5개 파일 템플릿 (VALIDATION/RECOVERY/PLAN/PROGRESS/goal-command)
- **`references/task-type-classifier.md`** — 한/영 키워드 기반 작업 유형 추정 규칙
- **`references/task-type-templates.md`** — 작업 유형 6종 × 5개 파일 강조 항목 매핑
- **`references/compact-strategy.md`** — 4,000자 자동 컴팩트 5단계 우선순위 + PROTECTED_CLAUSES 정규식
- **`references/codex-handoff-template.md`** — Codex CLI 세션 시작용 첫 메시지 템플릿 (메서돌로지 05번 §3-3 기반)

## 동작 메커니즘

이 스킬은 별도 Python 스크립트 없이 인라인으로 동작한다.

- **PRD 파싱 (Step 0~1)**: Bash + Grep으로 `.md` 파일 목록·acceptance 패턴·작업 유형 키워드 추출
- **자동 컴팩트 (Step 6)**: Claude가 `compact-strategy.md`의 5단계를 순서대로 적용 (텍스트 변환)
- **검증 (Step 7)**: Bash `grep -P` + `python3 -c "print(len(...))"`로 PROTECTED_CLAUSES 정규식·문자수·매핑 누락을 결정론적으로 매칭. LLM 인지로만 통과 주장 금지.

## 핵심 원칙

- **경고로 끝내지 않는다**: 4,000자 초과는 항상 컴팩트로 해결한다. 못 맞추면 결과물을 저장하지 않고 구조적 원인을 보고한다.
- **PROTECTED_CLAUSES는 불가침**: 정지조건·scope잠금·3회룰·문서참조·PROGRESS업데이트는 어떤 컴팩트 단계에서도 삭제하지 않는다.
- **CLI 분기는 첫 단계**: 두 CLI 사양이 다르므로 모든 결정의 첫 번째 분기점이다.
- **사람 검토 안전장치 우회 금지**: 자동 실행이 있어도 Step 9 승인 게이트는 필수다.
- **자기 시연 가능**: 이 스킬 자체를 만드는 작업도 골잡이로 가능하다.
