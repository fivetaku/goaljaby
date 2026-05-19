[English](README.md) | 한국어

# goaljaby (골잡이)

<p align="center">
  <img src="assets/goaljaby-hero-01.png" alt="goaljaby" width="320">
</p>

> **Claude Code용 PRD→/goal 브릿지 — 명세를 검증·복구 가능한 실행형 골로 바꿔준다.**

goaljaby는 PRD 폴더(수동 또는 `/show-me-the-prd` 결과물)를 받아 **검토·복구 루프가 들어간 5종 문서** — VALIDATION, RECOVERY, PLAN, PROGRESS, 실행형 `/goal` 명령 — 를 자동 생성하고, 사람 검토·승인을 거쳐 `/goal` 본문을 코드블럭으로 안내한다.

[빠른 시작](#빠른-시작) • [왜 goaljaby인가](#왜-goaljaby인가) • [작동 방식](#작동-방식) • [생성 파일](#생성-파일) • [작업 유형](#작업-유형) • [명령어](#명령어) • [요구사항](#요구사항)

---

## 빠른 시작

### 1. 마켓플레이스 등록

```
/plugin marketplace add https://github.com/fivetaku/gptaku_plugins.git
```

### 2. 설치

```
/plugin install goaljaby
```

### 3. Claude Code 재시작

### 4. 실행

기존 PRD 디렉토리가 있다면 — **절대 경로 권장**:

```
/goaljaby /Users/<username>/my-project/PRD/
```

상대 경로도 동작:

```
/goaljaby ./PRD/
```

PRD가 없으면 — goaljaby가 `/show-me-the-prd` 위임을 제안:

```
/goaljaby
```

자연어로도 됩니다:

- "골잡이 호출"
- "골 셋업 만들어줘"
- "PRD에서 골 만들어줘"
- "set up goal from PRD"

---

## 왜 goaljaby인가

- **PRD만으로는 부족하다** — PRD는 *무엇*을 만들지를 정의한다. `/goal`은 *완료를 어떻게 증명할 것인가*와 *잘못 갔을 때 어떻게 돌아올 것인가*까지 명시되어야 한다. 둘 중 하나라도 빠지면 골은 "그럴듯한 결과"에서 멈추거나 잘못된 방향으로 새 나간다.
- **검토 + 복구 루프가 본체다** — VALIDATION(acceptance 매핑 + Not Done If)과 RECOVERY(3회 룰 + scope 잠금)가 장기 골을 정직하게 유지한다. goaljaby는 PRD에서 두 루프를 자동 생성한다.
- **4,000자 컴팩트는 경고가 아니라 강제다** — Claude Code `/goal`은 공식 4,000자 제한이 있다. goaljaby는 5단계 컴팩트를 적용하고, 그래도 못 맞추면 구조적 오버플로우 보고로 깔끔하게 중단한다. 조용한 truncation도, 권고성 경고도 없다.
- **PROTECTED_CLAUSES는 불가침이다** — 정지조건·scope잠금·3회룰·문서참조·PROGRESS업데이트 5종은 컴팩트 후 정규식으로 검증된다. 누락 시 결과물을 폐기한다.
- **사람 검토 게이트는 우회 불가** — `/goal` 본문이 준비돼도 Step 10은 Step 9 승인 없이는 노출하지 않는다.

---

## 작동 방식

```
PRD 디렉토리
     │
     ▼
[Step 0-1] 사전 확인 + 분석
     │   PRD 없음? → /show-me-the-prd 위임
     │   acceptance / non-goals / 작업 유형 추출
     ▼
[Step 2-4] 인터뷰 (1-2회)
     │   task_type, validation 방식, 엄격도, 마일스톤
     ▼
[Step 5] 5개 문서 슬롯 채움
     │   VALIDATION.md / RECOVERY.md / PLAN.md / PROGRESS.md / goal-command.md
     ▼
[Step 6] goal-command.md 4,000자 자동 컴팩트
     │   정규화 → 외부화 → 약어 → 마일스톤 요약 → 군더더기 제거
     ▼
[Step 7] 결정론적 자체 검증
     │   PROTECTED_CLAUSES 5종 grep -P 매칭 + 문자수
     │   실패 시 → 구조적 오버플로우 보고 + 결과물 폐기
     ▼
[Step 8-9] 결과 안내 + 사람 검토 게이트 (필수)
     ▼
[Step 10] /goal 본문 코드블럭 출력 (사용자가 다음 메시지로 붙여넣음)
```

---

## 생성 파일

```
[PRD 디렉토리]/
├── VALIDATION.md      ← acceptance 매핑 + Not Done If
├── RECOVERY.md        ← 3회 룰 + scope 잠금 + 작업 유형별 복구
├── PLAN.md            ← 마일스톤(≤5) + Final Completion Criteria
├── PROGRESS.md        ← 빈 초기 템플릿
└── goal-command.md    ← /goal 본문 (항상 4,000자 이하)
```

각 문서의 강조 항목은 작업 유형(기능 구현 / 버그 수정 / UI / 문서 / 마이그레이션 / eval)에 따라 달라진다.

---

## 작업 유형

| 작업 유형 | VALIDATION 강조 | RECOVERY 강조 | /goal 템플릿 |
|----------|---------------|-------------|-----------|
| 기능 구현 | 단위 + 통합 테스트 | scope 잠금 | F-2 |
| 버그 수정 | 원본 재현 + 회귀 | 무관 모듈 변경 금지 | F-1 |
| UI 구현 | 스크린샷 + viewport 검증 | 디자인 토큰 보호 | F-3 |
| 문서 집필 | 섹션별 자가 검토 | 완성 섹션 동결 | F-4 |
| 마이그레이션 | 패리티 + 롤백 | public API 불변 | F-5 |
| eval 개선 | 베이스라인 대비 점수 | 한 번에 한 프롬프트만 | F-6 |

작업 유형은 PRD 본문에서 한·영 키워드 가중치 매칭으로 자동 추정되고, Step 3에서 사용자가 최종 확정한다.

---

## 핵심 약속

- **`goal-command.md`는 항상 4,000자 이하** — 컴팩트로 못 맞추면 결과물을 저장하지 않고 구조적 원인을 보고한다. 경고만 하고 끝내지 않는다.
- **PROTECTED_CLAUSES는 불가침** — 정지조건·scope잠금·3회룰·문서참조·PROGRESS업데이트는 컴팩트 단계에서 보호된다.
- **Step 9 승인 게이트는 우회 불가** — 사람 승인이 돌아오기 전에는 Step 10이 `/goal` 본문을 노출하지 않는다.
- **자기 시연 가능** — 이 스킬을 만드는 작업도 goaljaby로 가능하다.

---

## 명령어

| 명령어 | 설명 |
|--------|------|
| `/goaljaby [PRD 디렉토리]` | 기존 PRD 디렉토리로 시작 |
| `/goaljaby` | 인터랙티브 — PRD 없으면 `/show-me-the-prd` 위임 옵션 제시 |

### 자연어 트리거

- "골잡이 호출"
- "골 셋업 만들어줘"
- "PRD에서 골 만들어줘"
- "VALIDATION RECOVERY 만들어줘"
- "set up goal from PRD"
- "make goal scaffolding"
- "prep goal docs"

---

## 요구사항

- [Claude Code](https://docs.anthropic.com/claude-code) CLI **v2.1.139+**
- hooks 활성화 (`disableAllHooks` / `allowManagedHooksOnly` 미설정)

### 선택 플러그인 (권장)

| 플러그인 | 추가 효과 |
|--------|-----------|
| `show-me-the-prd` | PRD 없을 때 Step 0에서 자동 위임 |

없어도 동작 — Step 0에서 수동 PRD 경로 또는 한 줄 가벼운 목표로 fallback.

---

## 출처

Claude Code `/goal`: https://code.claude.com/docs/en/goal

---

## 라이선스

MIT

---

<div align="center">

**골을 그냥 시작하지 말고, 끝까지 제대로 가게 만들자.**

</div>
