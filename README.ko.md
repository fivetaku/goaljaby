[English](README.md) | 한국어

# goaljaby (골잡이)

<p align="center">
  <img src="assets/goaljaby-hero-01.png" alt="goaljaby" width="320">
</p>

> **Claude Code용 PRD→/goal 브릿지 — 한국어 검토 문서를 보고 승인하면 곧바로 골 작업이 시작된다.**

goaljaby는 PRD 폴더(수동 또는 `/show-me-the-prd` 결과물)를 받아 **한국어 검토 문서 6종** — VALIDATION, RECOVERY, PLAN, PROGRESS, `/goal` 본문, 그리고 `GOAL_BRIEF.md` 요약 — 을 자동 생성하고, 사람 승인 게이트를 거친 뒤 어시스턴트가 응답 마지막 줄로 `/goal`을 보내 다음 턴에서 골 작업을 시작한다. 한국어로 읽고, 한 번 승인하면, 작업이 진행된다.

[빠른 시작](#빠른-시작) • [왜 골잡이인가](#왜-골잡이인가) • [작동 방식](#작동-방식) • [생성 파일](#생성-파일) • [작업 유형](#작업-유형) • [명령어](#명령어) • [요구사항](#요구사항)

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

## 왜 골잡이인가

- **PRD만으로는 부족하다** — PRD는 *무엇*을 만들지를 정의한다. `/goal`은 *완료를 어떻게 증명할 것인가*와 *잘못 갔을 때 어떻게 돌아올 것인가*까지 명시되어야 한다. 둘 중 하나라도 빠지면 골은 "그럴듯한 결과"에서 멈추거나 잘못된 방향으로 새 나간다.
- **영어 보일러플레이트가 아니라 한국어 검토 문서** — 생성 문서가 한국어 우선이라 사용자가 진짜로 읽고 검토한 뒤 승인한다. 헤딩은 `필수 검증`, `완료 기준 매핑`, `완료로 보지 않는 조건` — 영어가 아니다.
- **한 번 승인하면 작업이 시작** — 승인을 누르면 어시스턴트가 응답 마지막 줄로 `/goal {본문}`을 보내고, 다음 턴에서 세션이 그 골을 시작한다. 한국어 `GOAL_BRIEF.md` 요약을 읽고 승인만 하면 작업이 진행된다.
- **4,000자 컴팩트는 경고가 아니라 강제다** — Claude Code `/goal`은 공식 4,000자 제한이 있다. goaljaby는 5단계 컴팩트를 적용하고, 그래도 못 맞추면 구조적 오버플로우 보고로 깔끔하게 중단한다. 조용한 truncation도 권고성 경고도 없다.
- **PROTECTED_CLAUSES는 불가침이다** — 정지조건·scope잠금·3회룰·문서참조·PROGRESS업데이트 5종은 컴팩트 후 한국어/영어 OR 정규식으로 검증된다. 누락 시 결과물을 폐기한다.
- **사람 승인 게이트는 우회 불가** — Step 9의 AskUserQuestion은 우회할 수 없다. 골은 명시적 승인 후에만 시작된다.

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
[Step 5] 5개 한국어 문서 슬롯 채움
     │   VALIDATION / RECOVERY / PLAN / PROGRESS / goal-command
     ▼
[Step 6] goal-command.md 4,000자 자동 컴팩트
     │   정규화 → 외부화 → 약어 → 마일스톤 요약 → 군더더기 제거
     ▼
[Step 7] 결정론적 자체 검증
     │   한국어/영어 OR PROTECTED_CLAUSES 5종 grep -P 매칭
     │   + 문자수 + 영어 헤딩 잔존 검사
     │   실패 시 → 구조적 오버플로우 보고 + 결과물 폐기
     ▼
[Step 8] 한국어 GOAL_BRIEF.md 생성 + 화면에 요약 표시
     │   목표 / 마일스톤 / 필수 검증 / scope 잠금 / 사람 결정
     ▼
[Step 9] AskUserQuestion — 승인 / 수정 / 나중에 / 취소
     ▼
[Step 10] 승인 시:
          • PROGRESS.md에 시작 시각 기록
          • 응답 마지막 줄로 `/goal {본문}`을 보냄
          • 다음 턴에서 세션이 골 작업을 시작
```

---

## 생성 파일

```
[PRD 디렉토리]/
├── VALIDATION.md      ← 필수 검증 / 완료 기준 매핑 / 완료로 보지 않는 조건
├── RECOVERY.md        ← 기본 원칙 / 실패 루프 / 재시도 한계 / scope 잠금
├── PLAN.md            ← 목표 / 마일스톤(≤5) / 최종 완료 기준
├── PROGRESS.md        ← 빈 초기 템플릿 (Step 10에서 시작 기록 append)
├── goal-command.md    ← /goal 본문 (한국어, ≤4,000자)
└── GOAL_BRIEF.md      ← Step 8 검토 요약 (한국어)
```

6개 모두 한국어 위주. 파일명·명령어·shell 명령은 영어 그대로.

---

## 작업 유형

| 작업 유형 | VALIDATION 강조 | RECOVERY 강조 | /goal 템플릿 |
|----------|---------------|-------------|-----------|
| 기능 구현 | 단위 + 통합 테스트 | scope 잠금 | F-2 |
| 버그 수정 | 원본 재현 + 회귀 | 무관 모듈 변경 금지 | F-1 |
| UI 구현 | 스크린샷 + viewport 검증 | design token 보호 | F-3 |
| 문서 집필 | 섹션별 자가 검토 | 완성 섹션 동결 | F-4 |
| 마이그레이션 | 패리티 + 롤백 | public API 불변 | F-5 |
| eval 개선 | 베이스라인 대비 점수 | 한 번에 한 프롬프트만 | F-6 |

작업 유형은 PRD 본문에서 한·영 키워드 가중치 매칭으로 자동 추정되고, Step 3에서 사용자가 최종 확정한다.

---

## 핵심 약속

- **생성 문서는 한국어 우선** — Step 7에서 영어 헤딩 잔존 검사를 한다. 발견 시 결과물 폐기. 반쯤 영어인 문서가 나오지 않는다.
- **`goal-command.md`는 항상 4,000자 이하** — 컴팩트로 못 맞추면 결과물을 저장하지 않고 구조적 오버플로우 보고로 마무리한다.
- **PROTECTED_CLAUSES는 불가침** — 정지조건·scope잠금·3회룰·문서참조·PROGRESS업데이트는 한국어/영어 OR 정규식으로 검증된다.
- **Step 9 승인 게이트는 우회 불가** — Step 10은 사람 승인 후에만 골 작업을 시작한다.
- **자기 시연 가능** — 이 스킬을 만드는 작업도 골잡이로 가능하다.

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

**한국어로 읽고, 승인하면, 골 작업이 시작된다.**

</div>
