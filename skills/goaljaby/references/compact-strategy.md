# 4,000자 자동 컴팩트 전략

골잡이의 핵심 약속 중 하나: `goal-command.md` 본문은 **항상 4,000자 이하**다. 경고로 끝내지 않는다. 사용자에게 결정을 미루지 않는다. 컴팩트는 스킬이 직접 수행한다.

## 보호 영역 (PROTECTED_CLAUSES)

다음 5개 절은 어떤 단계에서도 삭제·축약하지 않는다. 골의 안전성을 보장하는 핵심 절이기 때문이다.

| ID | 절 | 정규식 (구현 기준) |
|----|-----|--------------------|
| P1 | 명시적 정지 조건 | `until [^.]+(passes|complete|satisfied)` |
| P2 | scope 잠금 | `Do not [a-zA-Z ]*(expand|change)[a-zA-Z ]*scope` |
| P3 | 3회 실패 pause 룰 | `(3 attempts|three attempts|same failure repeats 3)` |
| P4 | 읽어야 할 문서 목록 | `Read [a-zA-Z., /]*(PRD|VALIDATION|RECOVERY|PLAN)` |
| P5 | PROGRESS.md 업데이트 지시 | `[Uu]pdate PROGRESS\.md` |

컴팩트 직후 5개 모두 정규식 매칭에 성공해야 한다. 하나라도 실패하면 컴팩트 결과를 폐기하고 구조적 오버플로우로 보고한다.

## 5단계 우선순위 (한도 도달 시 즉시 중단)

| 단계 | 작업 | 절감 효과 | 위험 |
|------|------|----------|------|
| 1. 정규화 | 중복 공백, 빈 줄, 영문 표현 통일 | 5~10% | 없음 |
| 2. 외부화 | 운영 규칙을 RECOVERY.md로 옮기고 본문엔 "Follow RECOVERY.md"만 남김 | 20~30% | 낮음 (사용자가 RECOVERY를 읽음을 전제) |
| 3. 약어 치환 | `VALIDATION.md → V.md` `RECOVERY.md → R.md` `PLAN.md → P.md` + 본문 상단에 1줄 범례 추가 | 10~15% | 중간 (가독성 저하) |
| 4. 마일스톤 요약 | 본문에 마일스톤 이름만 두고 상세는 PLAN.md에 위임 | 15~25% | 낮음 |
| 5. 작업 유형별 군더더기 제거 | 해당 작업 유형에 무관한 표준 문구 삭제 (예: 문서 집필 골에서 "build" 관련 문구) | 5~10% | 낮음 |

### 단계 1: 정규화

```python
text = re.sub(r"[ \t]+", " ", text)           # 다중 공백 → 단일
text = re.sub(r"\n{3,}", "\n\n", text)        # 3+ 줄바꿈 → 2개
text = text.replace("  ", " ").strip()
```

### 단계 2: 외부화 (Externalization)

원본:
```
- If validation fails, diagnose the failure category first.
- Do not silence errors. Do not skip tests.
- If the same failure persists after 3 attempts, pause and ask for guidance.
- Do not change public APIs unless PLAN says so.
```

컴팩트 후:
```
- Follow RECOVERY.md for all failure handling, scope rules, and the 3-attempt pause.
```

PROTECTED_CLAUSES P2·P3는 한 줄 안에 압축되어 정규식 매칭이 유지된다.

### 단계 3: 약어 치환

본문 최상단에 추가:
```
[Abbreviations] V.md=VALIDATION.md, R.md=RECOVERY.md, P.md=PLAN.md, PR.md=PROGRESS.md
```

본문 내부:
```
Read V.md, R.md, P.md, PR.md before editing.
```

자체 검증: 본문 어디서도 정의 안 된 약어가 등장하지 않는지 확인.

### 단계 4: 마일스톤 요약

원본:
```
Milestone 1: Auth refactor - migrate /api/login from session to JWT, update tests.
Milestone 2: Profile page - new layout with avatar upload.
Milestone 3: Settings - toggle persistence.
```

컴팩트 후:
```
Work milestones in order from P.md (Auth refactor → Profile → Settings).
```

상세는 PLAN.md에 위임. PLAN.md가 단일 진실 원천이 된다.

### 단계 5: 작업 유형별 군더더기 제거

작업 유형이 "문서 집필"인데 본문에 "Run npm test" 같은 코드 작업 표준 문구가 있으면 삭제. 작업 유형 분류표는 `task-type-templates.md` 참조.

## 컴팩트 후 자체 검증

```python
def verify_compact(text: str) -> list[str]:
    failures = []
    if len(text) > 4000:
        failures.append(f"length: {len(text)} > 4000")
    for pid, regex in PROTECTED_CLAUSES.items():
        if not re.search(regex, text):
            failures.append(f"protected clause missing: {pid}")
    if not re.match(r"^/goal (Execute|Implement|Fix|Write|Migrate|Optimize)", text.strip()):
        failures.append("must start with imperative verb")
    abbreviations_used = re.findall(r"\b([A-Z]+)\.md\b", text)
    abbreviations_defined = set()
    if "[Abbreviations]" in text:
        legend = text.split("[Abbreviations]")[1].split("\n")[0]
        abbreviations_defined = set(re.findall(r"([A-Z]+)\.md=", legend))
    standard = {"VALIDATION", "RECOVERY", "PLAN", "PROGRESS", "PRD", "SDD"}
    for abbr in abbreviations_used:
        if abbr not in standard and abbr not in abbreviations_defined:
            failures.append(f"undefined abbreviation: {abbr}.md")
    return failures
```

`failures`가 비어 있어야 컴팩트 통과. 비어 있지 않으면 결과 폐기 + 구조적 오버플로우 보고.

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
