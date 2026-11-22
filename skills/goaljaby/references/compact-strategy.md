# 골 조건 길이 관리 — 목표 600자, 4,000자 컴팩트는 비상용

`/goal` 완료 판정은 작고 빠른 모델이 조건 문장과 대화만 보고 내린다(명령 실행·파일 읽기 없음). 그래서 `goal-command.md` 본문은 **판정할 수 있는 짧은 조건 한 문단**이다 — `templates.md` §F의 뼈대(끝난 상태 + 출력·종료 코드 증거 + 첫 행동 + 작업 상태 규칙 + 제약 + BLOCKED 출구)를 따르면 보통 450~600자로 끝난다.

| 기준 | 값 | 성격 |
|------|-----|------|
| 목표 길이 | **600자 이하**, 빈 줄 없는 한 문단 | 기본 템플릿이 지켜야 할 목표. 넘으면 아래 줄이기 단계를 먼저 적용 |
| 공식 상한 | 4,000자 | 절대 넘지 않는다. 아래 5단계 컴팩트는 이 상한을 넘을 때 쓰는 **비상용 폴백**이고, F 템플릿을 따르면 거의 쓸 일이 없다 |

경고로 끝내지 않는다. 사용자에게 결정을 미루지 않는다. 줄이기와 컴팩트는 스킬이 직접 수행한다.

**언어 정책 (policy-excerpt.md)**: `goal-command.md` 본문은 `output_lang`(사용자 언어) + 영어 식별자. PROTECTED_CLAUSES 정규식은 한국어/영어 둘 다 매칭하는 OR 패턴이라 ko/en 본문은 그대로 검증되고, 그 외 언어는 각 보호절에 ko 또는 en 앵커 표현을 유지해 매칭되게 한다.

## 보호 영역 (PROTECTED_CLAUSES)

다음 5개 절은 어떤 단계에서도 삭제·축약하지 않는다. 골의 안전성을 보장하는 핵심 절이기 때문이다.

| ID | 절 | 정규식 (한·영 OR 패턴, `grep -P` 기준) |
|----|-----|------|
| P1 | 명시적 정지 조건 | `(통과\|만족\|완료\|도달\|일치\|끝날 때까지\|passes?\|complete\|satisfied)` |
| P2 | scope 잠금 | `(scope\s*확장.{0,20}금지\|Do not.{0,40}(expand\|change).{0,20}scope)` |
| P3 | 3회 실패 규칙 | `(3회\|3 attempts\|three attempts)` |
| P4 | 문서 참조 | `(PRD\|VALIDATION\|RECOVERY\|PLAN)\.md.{0,200}(읽\|Read)\|(읽\|Read).{0,200}(PRD\|VALIDATION\|RECOVERY\|PLAN)\.md` |
| P5 | PROGRESS.md 업데이트 | `(PROGRESS\.md[를을]?\s*업데이트\|[Uu]pdate PROGRESS\.md)` |

컴팩트 직후 5개 모두 정규식 매칭에 성공해야 한다. 하나라도 실패하면 컴팩트 결과를 폐기하고 구조적 오버플로우로 보고한다.

### 추가 검사 (v0.9.0 — P1~P5에 더해 함께 통과해야 함, P1~P5를 대신하지 않음)

| ID | 검사 | 정규식 / 기준 |
|----|------|------|
| S1 | 막혔을 때의 출구 (`BLOCKED` 종료) | `BLOCKED` **그리고** `(멈춘다\|중단한다\|stop)` |
| S2 | 출력·종료 코드를 대화에 남기는 규칙 | `(종료 코드\|exit code)` **그리고** `(출력\|output)` |
| S3 | 한 문단 | 본문에 빈 줄(`\n\s*\n`)이 없다 — 훅이 마지막 문단만 실행한다 |
| L1 | 목표 길이 | 600자 이하. 넘으면 실패가 아니라 **경고** — 아래 5단계 중 2·4·5단계를 적용해 다시 잰다. 그래도 넘으면 Step 8 요약에 길이와 사유를 한 줄로 알린다 |

S1·S2·S3 중 하나라도 실패하면 결과를 폐기하고 F 템플릿의 해당 문장을 다시 넣어 재검증한다.

## 5단계 우선순위 (비상용 — 600자 목표 또는 4,000자 상한을 넘을 때만, 한도 안에 들면 즉시 중단)

| 단계 | 작업 | 절감 효과 | 위험 |
|------|------|----------|------|
| 1. 정규화 | 중복 공백, 빈 줄 정리 | 5~10% | 없음 |
| 2. 외부화 | 운영 규칙을 RECOVERY.md로 옮기고 본문엔 "RECOVERY.md를 따른다"만 남김 | 20~30% | 낮음 (사용자가 RECOVERY를 읽음을 전제) |
| 3. 약어 치환 | `VALIDATION.md → V.md` `RECOVERY.md → R.md` `PLAN.md → P.md` `PROGRESS.md → PR.md` + 본문 상단에 1줄 범례 | 10~15% | 중간 (가독성 저하) |
| 4. 마일스톤 요약 | 본문에 마일스톤 이름만 두고 상세는 PLAN.md에 위임 | 15~25% | 낮음 |
| 5. 작업 유형별 군더더기 제거 | 해당 작업 유형에 무관한 표준 문구 삭제 (예: 문서 집필 골에서 빌드 관련 문구) | 5~10% | 낮음 |

### 단계 1: 정규화

```python
text = re.sub(r"[ \t]+", " ", text)           # 다중 공백 → 단일
text = re.sub(r"\n{3,}", "\n\n", text)        # 3+ 줄바꿈 → 2개
text = text.replace("  ", " ").strip()
```

### 단계 2: 외부화 (Externalization)

원본:
```
- 검증이 실패하면 먼저 실패 유형을 진단한다.
- 에러를 침묵 처리하지 않는다. 테스트를 skip 처리하지 않는다.
- 같은 검증이 3회(3 attempts) 실패하면 PROGRESS.md에 `BLOCKED:` 블록을 적고 멈춘다.
- PLAN.md에 명시되지 않은 public API 변경은 금지한다.
```

컴팩트 후:
```
- scope 확장은 금지하고, 같은 검증이 3회 실패하면 PROGRESS.md에 `BLOCKED:`를 적고 멈춘다. 그 밖의 실패 처리는 RECOVERY.md를 따른다.
```

PROTECTED_CLAUSES P2·P3와 추가 검사 S1은 한 줄 안에 압축되어 정규식 매칭이 유지된다. BLOCKED 출구 문장 자체는 외부화하지 않는다 — 판정 모델이 정당한 종료를 알아보려면 조건 안에 있어야 한다.

### 단계 3: 약어 치환

본문 최상단에 추가:
```
[약어] V.md=VALIDATION.md, R.md=RECOVERY.md, P.md=PLAN.md, PR.md=PROGRESS.md
```

본문 내부:
```
편집 전에 V.md, R.md, P.md, PR.md를 읽는다.
```

자체 검증: 본문 어디서도 정의 안 된 약어가 등장하지 않는지 확인.

**치환 예외 (v0.7.0)**: 다음 두 문장 안의 파일명은 약어로 바꾸지 않는다 — 정규식 검사가 원래 파일명을 찾기 때문이다.
- P5 문장의 `PROGRESS.md` ("… PROGRESS.md를 업데이트한다" / "Update PROGRESS.md …"). 바꾸면 P5 정규식이 매칭되지 않아 컴팩트가 실패한다(v0.6.x까지의 잠복 충돌).
- 작업 상태 규칙 문장의 `PLAN.md` ("작업을 시작하면 PLAN.md의 해당 줄을 `[>]` …"). `TASK_STATUS_RULE` 검사 대상이다.

### 단계 4: 마일스톤 요약

원본:
```
마일스톤 1: Auth refactor — /api/login을 세션에서 JWT로 마이그레이션, 테스트 갱신.
마일스톤 2: 프로필 페이지 — avatar 업로드 포함 새 레이아웃.
마일스톤 3: 설정 — 토글 영속화.
```

컴팩트 후:
```
P.md의 마일스톤을 순서대로 진행한다 (Auth refactor → 프로필 → 설정).
```

상세는 PLAN.md에 위임. PLAN.md가 단일 진실 원천이 된다.

### 단계 5: 작업 유형별 군더더기 제거

작업 유형이 "문서 집필"인데 본문에 빌드 관련 표준 문구가 있으면 삭제. 작업 유형 분류표는 `task-type-templates.md` 참조.

## 컴팩트 후 자체 검증

```python
import re

PROTECTED_CLAUSES = {
    "P1_stop":       r"(통과|만족|완료|도달|일치|끝날 때까지|passes?|complete|satisfied)",
    "P2_scope":      r"(scope\s*확장.{0,20}금지|Do not.{0,40}(expand|change).{0,20}scope)",
    "P3_3attempts":  r"(3회|3 attempts|three attempts)",
    "P4_read_docs":  r"(PRD|VALIDATION|RECOVERY|PLAN)\.md.{0,200}(읽|Read)|(읽|Read).{0,200}(PRD|VALIDATION|RECOVERY|PLAN)\.md",
    "P5_progress":   r"(PROGRESS\.md[를을]?\s*업데이트|[Uu]pdate PROGRESS\.md)",
}

def verify_compact(text: str) -> list[str]:
    failures = []
    if len(text) > 4000:
        failures.append(f"length: {len(text)} > 4000")
    for pid, regex in PROTECTED_CLAUSES.items():
        if not re.search(regex, text):
            failures.append(f"protected clause missing: {pid}")
    if not text.strip().startswith("/goal "):
        failures.append("must start with '/goal ' followed by a condition")
    # 약어 검증
    abbreviations_used = re.findall(r"\b([A-Z]+)\.md\b", text)
    abbreviations_defined = set()
    if "[약어]" in text:
        legend = text.split("[약어]")[1].split("\n")[0]
        abbreviations_defined = set(re.findall(r"([A-Z]+)\.md=", legend))
    standard = {"VALIDATION", "RECOVERY", "PLAN", "PROGRESS", "PRD", "SDD"}
    for abbr in abbreviations_used:
        if abbr not in standard and abbr not in abbreviations_defined:
            failures.append(f"undefined abbreviation: {abbr}.md")
    return failures


# v0.9.0 — 판정 가능한 조건 모양 검사 (P1~P5와 별개, 함께 통과해야 함)
TARGET_LEN = 600

def verify_condition_shape(text: str) -> tuple[list[str], list[str]]:
    failures, warnings = [], []
    if not (re.search(r"BLOCKED", text) and re.search(r"(멈춘다|중단한다|stop)", text)):
        failures.append("S1_blocked_exit: BLOCKED + stop phrase missing")
    if not (re.search(r"(종료 코드|exit code)", text) and re.search(r"(출력|output)", text)):
        failures.append("S2_evidence: output + exit code phrase missing")
    if re.search(r"\n\s*\n", text.strip()):
        failures.append("S3_single_paragraph: blank line inside condition")
    if len(text.strip()) > TARGET_LEN:
        warnings.append(f"L1_target: {len(text.strip())} > {TARGET_LEN}")
    return failures, warnings


# v0.7.0 — 생성된 PLAN.md에 작업 체크리스트가 있을 때만 적용 (P1~P5와 별개)
def verify_task_rule(text: str, plan_has_tasks: bool) -> list[str]:
    if not plan_has_tasks:
        return []
    failures = []
    if not re.search(r"PLAN\.md", text):
        failures.append("TASK_STATUS_RULE: PLAN.md not mentioned")
    for marker in ("[>]", "[x]", "[!]"):
        if marker not in text:
            failures.append(f"TASK_STATUS_RULE: marker {marker} missing")
    return failures
```

`TASK_STATUS_RULE`이 실패하면 템플릿의 작업 상태 규칙 문장(약 90자)을 P5 문장 바로 앞에 다시 넣고 재검증한다(P5는 같은 문장 끝 "PROGRESS.md를 업데이트한다"). 그래도 4,000자를 넘으면 구조적 오버플로우로 처리한다.

`verify_compact`·`verify_condition_shape`·`verify_task_rule`의 `failures`가 모두 비어 있어야 통과(`verify_condition_shape`의 `warnings`는 600자 목표 경고로, 줄이기 단계를 다시 적용하는 신호다). 비어 있지 않으면 결과 폐기 + 구조적 오버플로우 보고.

**시작 검증 메모**: v0.2.x까지는 영어 명령형 동사(`Execute|Implement|Fix|Write|Migrate|Optimize`) 시작을 강제했으나, v0.3.0부터 비영어 본문(한국어 등 `output_lang`)을 지원하기 위해 시작 동사 강제를 제거하고 `/goal ` 다음에 condition이 있는지만 검증한다. 종료 판정은 small fast model(기본 Haiku)이 비영어 condition도 처리한다.

## 구조적 오버플로우 보고 (모든 컴팩트 실패 시)

```text
🔴 골 문장이 4,000자를 자동 컴팩트로도 못 맞춥니다.

현재 길이: {current_length}자 (제한: 4,000자)
컴팩트 시도 단계: 1~5 모두 적용됨

원인 후보:
- 마일스톤이 너무 많음 (현재 {n}개 → 권장 ≤5)
- 작업 유형별 표준 문구가 모두 필수임 (엄격 모드 영향)
- PRD의 acceptance criteria 수가 많아 본문 인용이 길어짐

권장 조치:
1. PLAN.md의 마일스톤을 축소·분할 → goaljaby 재실행
2. 엄격도를 "엄격"에서 "표준"으로 변경
3. PRD 자체를 2개 골로 분할 (Phase 단위)

goal-command.md는 생성되지 않았습니다. 위 조치 후 다시 호출하세요.
```
