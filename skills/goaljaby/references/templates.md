# 5개 파일 + acceptance.json + /goal 명령어 템플릿

골잡이 Step 5에서 슬롯 치환에 사용한다. 메서돌로지 `99_부록_템플릿모음.md` B/C/D/E/F의 한국어 적용판.

**언어 정책 (policy-excerpt.md §1·§5)**: 아래 템플릿은 **한국어로 표기**돼 있지만, 실제 생성 시 **모든 헤딩·본문을 `output_lang`(사용자 요청 언어)으로 렌더링**한다. 식별자(파일명/명령/`PRD` 같은 약어/`{SLOT}` 토큰)는 번역하지 않는다. 헤딩은 아래 **§헤딩 맵**의 canonical 번역을 쓰고, 맵에 없는 언어는 en 열을 기준으로 옮긴다. **한국 제작이라고 한국어를 기본값으로 두지 말 것.**

작업 유형별 강조 항목은 `task-type-templates.md` 참조.

슬롯 표기: `{SLOT_NAME}` — Step 1/3/4에서 추출한 값으로 치환. 비어 있으면 해당 줄 자체 제거 (placeholder 잔존 금지).

`{PRD_FILE}`은 Step 1에서 찾은 **실제 메인 PRD 파일 이름**이다(예: `01_PRD.md`). 템플릿 어디에도 `PRD.md`를 고정 이름으로 쓰지 않는다. PRD가 여러 파일이면 acceptance criteria가 든 파일을 고르고, Step 0-B에서 임시로 만든 경우에만 `PRD.md`가 된다.

## 상태는 한 곳에만 (v0.9.0)

| 무엇 | 정본 | 다른 문서는 |
|------|------|-------------|
| 작업이 끝났는지 | PLAN.md 체크리스트 마커 `[ ]`/`[>]`/`[x]`/`[!]` | 상태를 따로 적지 않는다 |
| 완료 기준이 검증됐는지 | `acceptance.json`의 `passes`·`evidence` | VALIDATION.md 매핑 표는 어떤 명령으로 확인하는지만 적는다 |
| 검증 명령을 마지막으로 돌린 결과 | VALIDATION.md 필수 검증 표 | PROGRESS.md는 요약·커밋 해시만 남긴다 |

## §헤딩 맵 (canonical heading set — Step 7 #6 검증과 1:1)

생성 문서의 `## ` 헤딩은 `output_lang`에 맞춰 아래 표대로 렌더링한다. ko/en은 1급(결정론적 검증), 그 외 언어는 en 열을 번역한다. 슬롯(`{N}`,`{NAME}`)은 유지.

| 파일 | ko | en |
|------|-----|-----|
| VALIDATION | 필수 검증 | Required Checks |
| VALIDATION | 마일스톤별 검증 | Targeted Checks |
| VALIDATION | 사람 확인 항목 | Human Checks |
| VALIDATION | 완료 기준 매핑 | Acceptance Criteria Mapping |
| VALIDATION | 완료 계약 (acceptance.json) | Completion Contract (acceptance.json) |
| VALIDATION | 완료로 보지 않는 조건 | Not Done If |
| VALIDATION | 시각 검증 (UI 작업) | Visual Verification |
| RECOVERY | 기본 원칙 | Core Rule |
| RECOVERY | 실패 루프 | Failure Loop |
| RECOVERY | 재시도 한계와 BLOCKED 종료 | Retry Limit and BLOCKED Exit |
| RECOVERY | git 체크포인트 | Git Checkpoints |
| RECOVERY | 컴팩션 뒤 재개 | Resuming After Compaction |
| RECOVERY | scope 잠금 | Scope Control |
| RECOVERY | 방향 재확인 규칙 | Reorientation Rule |
| RECOVERY | 되돌리기 규칙 | Revert Rule |
| PLAN | 목표 | Goal |
| PLAN | 참조 문서 | Source Documents |
| PLAN | 최종 완료 기준 | Final Completion Criteria |
| PLAN | 마일스톤 {N}: {NAME} | Milestone {N}: {NAME} |
| PROGRESS | 재개 순서 | Resume Order |
| PROGRESS | 현재 골 | Current Goal |
| PROGRESS | 현재 마일스톤 | Current Milestone |
| PROGRESS | 체크포인트 커밋 | Checkpoint Commits |
| PROGRESS | 마지막 검증 결과 | Last Validation |
| PROGRESS | 실패 시도 | Failed Attempts |
| PROGRESS | 결정 기록 | Decision Log |
| PROGRESS | 현재 가장 안정적인 상태 | Current Best State |
| PROGRESS | 다음 단계 | Next Step |
| PROGRESS | 리스크 / 블로커 | Risks / Blockers |
| PROGRESS | 인수인계 메모 | Handoff Notes |

> 본문 단락·체크리스트·표 내용도 `output_lang`으로 번역한다(식별자 제외). F-1~F-6의 `/goal` 본문도 동일하되, PROTECTED_CLAUSES 앵커(정지조건/scope/3회/문서참조/PROGRESS)와 추가 검사 앵커(`BLOCKED`, 출력·종료 코드)는 `compact-strategy.md`의 ko·en OR 정규식에 매칭되게 유지한다. `acceptance.json`은 키 이름(`id`·`criterion`·`check_command`·`passes`·`evidence`)을 번역하지 않는다.

---

## B. VALIDATION.md

````md
# VALIDATION — {PROJECT_NAME}

## 필수 검증

골을 끝내기 전에 아래 명령을 모두 실행한다. 실행할 때마다 명령의 실제 출력과 종료 코드(exit code)를 대화에 그대로 보이고, 이 표의 오른쪽 두 칸을 실제 결과로 채운다. 표에 적힌 명령과 기대 결과는 고치지 않는다.

| 명령 | 기대 결과 | 마지막 실행 결과 | 실행 시각 |
| --- | --- | --- | --- |
{REQUIRED_CHECK_ROWS}

## 마일스톤별 검증

각 마일스톤 끝에 실행하고, 출력과 종료 코드를 대화에 보인다.

```bash
{TARGETED_CHECK_COMMANDS}
```

## 사람 확인 항목

사람이 눈으로 봐야 하는 확인이다. 골은 사람 없이 돌기 때문에 이 항목은 **필수 검증이 아니며 완료를 막지 않는다** — `{PRD_FILE}`이 막는 항목으로 정한 경우만 예외다(줄 끝에 `(완료를 막음)` 표시). 골은 이 항목을 `[!]`로 남겨 두고 끝낸다. 막는 항목이 남아 있으면 다른 일을 다 끝낸 뒤 PROGRESS.md에 `BLOCKED: 사람 확인 필요`를 적고 멈춘다.

{HUMAN_CHECK_ROWS_OR_NONE}

{VISUAL_VERIFICATION_BLOCK_OR_OMIT}

## 완료 기준 매핑

| PRD 완료 기준 | 확인 방법 (명령 또는 사람 확인) | acceptance.json id |
| --- | --- | --- |
{ACCEPTANCE_MAPPING_ROWS}

완료 여부는 이 표에 적지 않는다. 작업 상태는 PLAN.md, 기준 통과 여부는 `acceptance.json`이 정본이다.

## 완료 계약 (acceptance.json)

이 폴더의 `acceptance.json`은 완료 기준을 기계가 읽을 수 있게 적은 파일이다. 규칙:

- 해당 항목의 `check_command`를 실제로 실행해 통과한 뒤에만 `passes`를 `true`로 바꾸고, `evidence`에 출력 요약·종료 코드·실행 시각을 적는다.
- 바꿀 수 있는 칸은 `passes`와 `evidence` 둘뿐이다. `id`·`criterion`·`check_command`를 고치거나 항목을 지우지 않는다.
- 나중에 같은 명령이 실패하면 `passes`를 다시 `false`로 돌리고 `evidence`에 실패를 적는다.

## 완료로 보지 않는 조건

- 필수 검증이 하나라도 실패했거나, 그 출력·종료 코드가 대화와 위 표에 없음
- `acceptance.json`의 기준·명령을 고쳤거나 항목을 지움
- 검증을 통과시키려고 테스트를 지우거나 건너뜀
{TASK_TYPE_NOT_DONE_IF_ADDITIONS}
- 그 밖의 금지는 RECOVERY.md의 scope 잠금을 따른다.
````

`{REQUIRED_CHECK_ROWS}` 한 행 형식: `` | `{명령}` | exit 0 | (아직 실행 안 함) | - | ``. 기대 결과는 "exit 0", "exit 0, 출력에 `3 passed`" 처럼 대화 속 출력만 보고 판정할 수 있게 쓴다.

**사람 없이 도는 골의 검증 규칙**: Step 3에서 "수동 재현"·"스크린샷 비교"처럼 사람이 해야 하는 방식을 골랐으면, 먼저 명령으로 바꿀 수 있는지 본다(재현 스크립트, 헤드리스 테스트, 스크린샷 저장 명령 등). 바꿀 수 있으면 필수 검증 표에 넣고, 바꿀 수 없으면 `{HUMAN_CHECK_ROWS_OR_NONE}`에 `- [!] H{K}: <무엇을 어떻게 보는지>` 행으로 넣는다. 사람 확인 항목을 필수 검증 표에 넣지 않는다. 항목이 없으면 `없음` 한 줄로 둔다.

`{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` 는 UI 작업일 때만 다음 블록을 삽입, 그 외에는 행 자체 제거:

```md
## 시각 검증 (UI 작업)

- [ ] 데스크톱 viewport 확인
- [ ] 모바일 viewport 확인
- [ ] 텍스트 겹침·잘림 없음
- [ ] 스크린샷 저장 위치: {SCREENSHOT_PATH}
```

---

## C. RECOVERY.md

골은 사람 없이 돈다. 그래서 "사람의 결정을 기다린다"는 규칙을 쓰지 않는다. 기다리는 동안 골 판정은 계속 "아직"이 되어 같은 자리를 맴돌기 때문이다. 막히면 기록하고 **멈추는 것**이 정해진 출구다(`BLOCKED` 종료).

````md
# RECOVERY

## 기본 원칙

검증이 실패하면 곧바로 광범위한 수정에 들어가지 않는다. 진단부터 한다.

## 실패 루프

검증 단계가 실패하면 다음 순서를 따른다.

1. 실패 출력을 끝까지 읽는다.
2. 실패 유형을 분류한다: 구현 버그 / 잘못된 테스트 / 의존성 누락 / 환경 문제 / 요구사항 불명확 / scope 충돌.
3. {PRD_FILE}, PLAN.md, VALIDATION.md와 비교한다.
4. 가장 작은 가역 수정 1회를 한다.
5. 가장 작은 관련 검증부터 재실행하고, 출력과 종료 코드를 대화에 보인다.
6. PROGRESS.md를 업데이트한다.

요구사항이 모호하면 되돌리기 쉬운 쪽을 골라 PROGRESS.md `결정 기록`에 남기고 계속한다. 되돌리기 어려운 결정(데이터 삭제, 외부 발송, public API 확정 등)만 아래 BLOCKED 종료로 넘긴다.

## 재시도 한계와 BLOCKED 종료

같은 검증이 서로 다른 3회 시도(3 attempts) 후에도 실패하거나, 구조적으로 막혀 더 할 수 있는 안전한 일이 없으면(권한·외부 서비스·사람만 정할 수 있는 결정·완료를 막는 사람 확인 항목):

1. 자기 변경 중 검증을 깬 부분을 되돌려 마지막으로 검증을 통과한 커밋 상태로 맞춘다(되돌리기 규칙).
2. PROGRESS.md의 `리스크 / 블로커`에 다음 형식으로 적는다.
   ```text
   BLOCKED: <한 줄 사유>
   - 실패한 명령 또는 기준: <명령>
   - 시도 1: <변경> → <결과>
   - 시도 2: <변경> → <결과>
   - 시도 3: <변경> → <결과>
   - 다음 안전한 선택지: <사람이 고를 수 있는 길 1~2개>
   ```
3. 막힌 작업의 PLAN.md 마커를 `[!]`로 바꾼다.
4. 같은 내용을 대화에 보이고 **작업을 멈춘다.** 이것도 정당한 종료다. 사람이 PROGRESS.md를 보고 결정한 뒤 골을 다시 시작한다.

## git 체크포인트

- 작업 하나가 자기 검증을 통과하면 바로 커밋한다. 메시지에 작업 ID를 넣는다(예: `M1-T2: 저장값 복원`).
- 커밋 짧은 해시(`git rev-parse --short HEAD`)를 PROGRESS.md `체크포인트 커밋`에 적는다.
- 검증이 실패한 상태로는 커밋하지 않는다. 그래서 마지막 체크포인트 커밋이 항상 "마지막으로 통과한 상태"다.
- git 저장소가 아니면 이 규칙 대신 PROGRESS.md에 변경 파일 목록을 남긴다.

## 컴팩션 뒤 재개

대화가 요약(컴팩션)됐거나, 지금까지 무엇을 했는지 기억이 확실하지 않으면 기억으로 이어 가지 않는다. PROGRESS.md 맨 위의 `재개 순서`를 그대로 따른다.

## scope 잠금

다음은 금지한다:
- 무관한 모듈을 다시 작성
- PLAN.md에 명시되지 않은 public API 변경
- SDD.md에 명시되지 않은 DB 스키마 변경
- 검증을 통과시키기 위해 테스트를 삭제·skip
- 이해 없이 에러를 침묵 처리
- 좁은 문제를 광범위한 refactor로 해결
- 검증 명령 자체를 다른 명령으로 교체
{TASK_TYPE_SCOPE_ADDITIONS}

## 방향 재확인 규칙

접근법을 바꾸기 전에:

1. 골 문장을 다시 읽는다.
2. {PRD_FILE}의 Non-goals를 다시 읽는다.
3. PLAN.md의 현재 마일스톤을 다시 읽는다.
4. 다음 수정이 현재 마일스톤에 직접 기여하는지 확인한다.

## 되돌리기 규칙

되돌릴 기준점은 **마지막으로 검증을 통과한 git 커밋**(PROGRESS.md `체크포인트 커밋`의 마지막 해시)이다. 자기 자신의 실패 변경만 되돌린다. 단, 다음 중 하나일 때:
- 변경이 검증을 더 악화시켰을 때
- 무관한 변경을 함께 들여왔을 때
- PRD / PLAN과 충돌할 때

사용자가 수동으로 만든 변경은 명시적 지시 없이 절대 되돌리지 않는다.
````

---

## D. PLAN.md

`{MILESTONES_BLOCK}` 은 마일스톤 1~5개의 반복.

````md
# PLAN — {PROJECT_NAME}

## 목표

{GOAL_ONE_LINER}

## 참조 문서

- {PRD_FILE}
- VALIDATION.md
- RECOVERY.md
- PROGRESS.md
- acceptance.json

{MILESTONES_BLOCK}

## 최종 완료 기준

아래가 모두 사실이면 골이 끝난다. 체크박스로 두지 않는다 — 상태의 정본은 위 작업 줄 마커와 `acceptance.json`이다.

- 모든 작업 줄이 `[x]`다 (완료를 막지 않는 사람 확인 항목만 `[!]`로 남을 수 있다)
- VALIDATION.md 필수 검증 표의 모든 명령이 기대 결과대로 끝났고, 그 출력과 종료 코드가 대화에 있다
- `acceptance.json`의 모든 `passes`가 `true`이고 `evidence`가 채워져 있다
- scope 위반이 없다
````

마일스톤 1개 형식:

```md
## 마일스톤 {N}: {MILESTONE_NAME}
- 목적: {MILESTONE_PURPOSE}
- 범위(Scope): {MILESTONE_SCOPE}
- 완료 조건: {MILESTONE_COMPLETION}
- 검증: {MILESTONE_VALIDATION}

작업 (상태: `[ ]` 대기 · `[>]` 진행 · `[x]` 완료 · `[!]` 사람 대기)
{MILESTONE_TASK_ROWS}
```

**`{MILESTONE_PURPOSE}` 생성 규칙 (v0.7.2)** — 진행 보드(playmaker)가 마일스톤 설명으로 보여 주는 줄이다.
- 이 마일스톤을 왜 하는지, 끝나면 무엇이 생기는지를 쉬운 말 한 문장으로 쓴다(60자 안팎). 예: `- 목적: 세 방식이 같은 조건에서 끝까지 돌아가는지 첫 과제로 먼저 확인한다`
- 범위 줄을 다시 옮겨 적지 않는다. 범위는 "무엇을 하나", 목적은 "왜 하나·끝나면 뭐가 남나"다.
- 줄 이름은 `output_lang`으로 옮긴다(en: `- Purpose:`). 이어가기 분기·사람이 쓴 기존 PLAN에는 소급 삽입하지 않는다.
- 범위·완료 조건 줄과 `## 목표`의 `{GOAL_ONE_LINER}`에도 아래 쉬운 말 규칙을 적용한다. 보드는 이 줄들을 그대로 "하는 일"·"다 되면"·"목표"로 보여 준다.

**`{MILESTONE_TASK_ROWS}` 생성 규칙 (v0.7.0)** — 세부 작업 상태의 정본이다.
- 범위·완료 조건·검증을 실행 가능한 작업 단위로 나눈다. 마일스톤마다 2~6개.
- 각 행은 `- [ ] M{N}-T{K}: <동사로 끝나는 작업 한 문장>`. `M{N}-T{K}`는 안정 ID — 번역·변경하지 않는다.
- 마지막 작업은 그 마일스톤의 검증 실행으로 둔다(예: `- [ ] M2-T4: 마일스톤 검증을 돌려 결과를 VALIDATION.md 표에 적고 커밋한다`).
- 실행 중에는 **마커만** 바꾼다: 시작 `[>]`, 완료 `[x]`, 사람 판단·외부 입력 대기 `[!]`. 작업 문장·범위·완료 조건·검증 문장은 수정하지 않는다.
- `[>]`는 한 번에 하나만 둔다. 다음 작업을 `[>]`로 바꾸기 전에 지금 작업을 `[x]` 또는 `[!]`로 정리한다.
- `[x]`는 그 작업의 검증 출력과 종료 코드를 대화에 보인 뒤에만 쓴다.
- 작업을 추가해야 하면 그 마일스톤 맨 끝에 다음 번호로 덧붙인다. 기존 번호는 재사용하지 않는다.
- `작업 (상태: ...)` 안내 줄은 `output_lang`으로 옮긴다(en: `Tasks (status: [ ] waiting · [>] doing · [x] done · [!] needs human)`). `##` 헤딩이 아니므로 §헤딩 맵 검사 대상이 아니다.
- 이어가기 분기·사람이 쓴 기존 PLAN에는 소급 삽입하지 않는다.

**쉬운 말 규칙 (v0.7.1)** — 작업 행과 `{MILESTONE_NAME}`은 진행 보드(playmaker)에 카드 한 장으로 따로 보인다. PRD를 읽지 않은 사람이 그 한 줄만 보고도 무엇을 하는지 알아야 한다.
- PRD 안에서만 통하는 약칭·코드명(예: "A팔·C팔", "T1·T2", "원장", "하네스", "답변 카드")을 그대로 쓰지 않는다. 일반 단어로 풀어 쓰고, 꼭 써야 하면 처음 나올 때 괄호로 뜻을 붙인다(예: "비교 실험의 세 가지 실행 방식(팔)").
- 비유·은어·업계 속어를 쓰지 않는다. 실험·업무 용어를 빌린 표현("팔(arm)", "하네스", "원장", "파일럿", "시드", "런", "블라인드 패키지")은 그 대상을 가리키는 평범한 말("실행 방식 A", "실행 기록 스크립트", "기록표", "시험 실행", "출발 재료", "실행 1회", "이름을 가린 사본")로 바꾼다. PRD가 그런 말을 썼어도 PLAN에는 풀어 쓴다.
- 과제·대상을 코드명(T1·T2)으로만 부르지 않는다. "첫 과제(T1 sejong-gwageo)"처럼 처음엔 무엇인지 붙이고, 그 뒤엔 "첫 과제"처럼 순서나 이름으로 부른다.
- 한 줄에 주된 일 하나만 쓴다. "~이 생기면 ~하고 ~한다"처럼 조건·동작이 셋 이상 이어지면 작업을 나눈다.
- "기록한다"·"처리한다"·"검증한다"만으로 끝내지 않는다. 무엇을 어디에 남기는지, 끝나면 무엇이 생기는지 쓴다.
- 커밋 해시·파일 경로 같은 식별자는 꼭 필요할 때만 문장 끝 괄호에 둔다.
- 작업 문장은 40자 안팎, 마일스톤 이름은 20자 안팎을 넘기지 않는다.
- 예: ✗ `M2-T3: 세 팔의 질문을 답변 카드로 처리하고 개입을 원장에 기록한다` → ✓ `M2-T3: 실행 중 나온 질문에 미리 정한 답을 주고, 사람이 끼어든 횟수를 기록표에 적는다`
- 예: ✗ 마일스톤 `T1 파일럿 3팔 실행` → ✓ `첫 과제로 시험 실행`
- 예: ✗ 목표 `T1~T3 × A·B·C 팔 9런을 ... 블라인드 채점으로 비교` → ✓ `개발 과제 3개를 세 가지 방식으로 한 번씩, 모두 9번 개발시키고 ... 이름 가린 채점으로 비교한다`
- 이 규칙은 PLAN의 목표·목적·범위·완료 조건과 VALIDATION·RECOVERY·PROGRESS 본문 문장에도 똑같이 적용한다. 명령어·파일명·`{SLOT}`·작업 ID는 바꾸지 않는다.

---

## E. PROGRESS.md (초기 빈 템플릿)

`## 재개 순서`는 고정 문구다 — 항상 파일 맨 위에 두고 실행 중에 고치지 않는다(Step 8 요약은 이 섹션 바로 아래에 넣는다).

````md
# PROGRESS

## 재개 순서

골을 처음 시작할 때, 대화가 요약된 뒤, 기억이 확실하지 않을 때 이 순서를 그대로 따른다.

1. 이 파일(PROGRESS.md)을 끝까지 읽는다. `BLOCKED:` 줄이 아직 풀리지 않았으면 그 사유부터 본다.
2. PLAN.md에서 `[>]` 줄을 찾는다. 없으면 첫 `[ ]` 줄이 다음 작업이다.
3. `git log --oneline -5`로 마지막 체크포인트 커밋을 확인하고 아래 `체크포인트 커밋`과 맞는지 본다.
4. VALIDATION.md 필수 검증 명령을 한 번씩 돌려 지금 상태를 확인하고, 출력과 종료 코드를 대화에 보인다.
5. 그 작업부터 이어서 한다.

## 현재 골

{GOAL_ONE_LINER}

## 현재 마일스톤

마일스톤 1 시작 전

## 체크포인트 커밋

작업이 검증을 통과해 커밋할 때마다 한 줄씩 더한다. 작업이 끝났는지는 PLAN.md 마커가 정본이고, 이 표는 되돌릴 기준점을 찾는 기록이다.

| 작업 ID | 커밋 | 통과한 검증 |
| --- | --- | --- |

## 마지막 검증 결과

```text
(골 실행 전)
```

## 실패 시도

| 시도 | 변경 | 결과 | 배운 점 |
| --- | --- | --- | --- |

## 결정 기록

모호한 점이 생기면 되돌리기 쉬운 기본값을 골라 여기에 적고 계속한다. 되돌리기 어려운 결정만 RECOVERY.md의 BLOCKED 종료로 넘긴다.

| 날짜 | 결정 | 이유 | 되돌리기 쉬움? |
| --- | --- | --- | --- |

## 현재 가장 안정적인 상태

골 실행 전 — 초기 상태

## 다음 단계

PLAN.md의 마일스톤 1부터 시작

## 리스크 / 블로커

{OPEN_QUESTIONS_FROM_PRD_OR_NONE}

막혀서 멈출 때는 이 섹션에 `BLOCKED:` 블록을 적는다(형식은 RECOVERY.md).

## 인수인계 메모

이 PROGRESS.md는 골잡이가 생성한 실행 로그다. 작업 상태의 정본은 PLAN.md 체크리스트(`[ ]`/`[>]`/`[x]`/`[!]`), 완료 기준의 정본은 `acceptance.json`이다. 이 파일에는 커밋 해시·검증 요약·결정·리스크·인수인계를 체크포인트마다 남긴다.
````

---

## F. goal-command.md (작업 유형별 본문 — 6종)

### 왜 짧게 쓰나

`/goal`의 완료 판정은 작고 빠른 모델이 **조건 문장과 대화만 보고** 내린다. 그 모델은 명령을 실행하지도, 파일을 읽지도 않는다. 그래서 조건은 절차서가 아니라 "대화만 보고 끝났는지 판단할 수 있는 문장"이어야 한다. 절차(어떻게 고치고, 어떻게 복구하는지)는 PLAN.md·RECOVERY.md에 두고 조건에는 넣지 않는다.

좋은 조건의 뼈대 (이 순서로 한 문단):

1. **끝난 상태 하나** — PLAN.md 작업이 모두 `[x]`이고 VALIDATION.md 필수 검증이 통과한다(작업 유형마다 조금 다르다).
2. **증거를 대화에 남기는 규칙** — "각 검증 명령의 실제 출력과 종료 코드(exit code)를 대화에 그대로 보인다". 판정 모델이 볼 수 있는 것은 대화뿐이다.
3. **첫 행동** — `{PRD_FILE}`, PLAN.md, VALIDATION.md, RECOVERY.md, PROGRESS.md를 읽고 재개 순서를 따른다.
4. **작업 상태 규칙** — PLAN.md 마커 `[>]`/`[x]`/`[!]`, PROGRESS.md를 업데이트.
5. **지켜야 할 제약** — scope 확장 금지, 테스트를 지우거나 건너뛰지 않기, 작업 유형별 금지 하나.
6. **막혔을 때의 출구** — 같은 검증 3회 실패 또는 구조적으로 막힘 → PROGRESS.md에 `BLOCKED:` 사유·시도 3개·다음 안전한 선택지를 적고 멈춘다. 이것도 정당한 종료다. 이 출구가 없으면 판정 모델이 계속 "아직"이라고 답해 같은 자리를 맴돈다.

규칙:
- **목표 600자 이하, 빈 줄 없는 한 문단.** 상한 4,000자는 공식 제한일 뿐이다. 600자를 넘으면 `compact-strategy.md`의 줄이기 단계를 먼저 적용한다.
- 마일스톤 목록·실패 처리 절차·검증 명령 전체를 조건에 옮겨 적지 않는다.
- 아래 F-1~F-6은 한국어 표기 예시다. 생성 시 `output_lang`으로 옮기되, PROTECTED_CLAUSES P1~P5와 추가 검사(BLOCKED 출구·출력/종료 코드 증거) 앵커가 계속 매칭되어야 한다(Step 7, `compact-strategy.md`). `output_lang`이 ko/en이 아니면 각 앵커에 ko 또는 en 표현을 남긴다.
- 영어 렌더링 예(F-2): `/goal Done when every task in PLAN.md is [x] and all VALIDATION.md required checks pass. Show each check command's real output and exit code in the conversation. First Read {PRD_FILE}, PLAN.md, VALIDATION.md, RECOVERY.md, PROGRESS.md and follow the PROGRESS.md resume order. ... Do not expand scope beyond {PRD_FILE} and PLAN.md ... Update PROGRESS.md after each task. If the same check fails 3 attempts or you are structurally blocked, write BLOCKED: with the reason, the 3 attempts and the next safe options in PROGRESS.md and stop — that is a valid end.`

공통 꼬리(모든 F에 그대로 붙는 부분, `{TYPE_CONSTRAINT}`만 유형별로 바뀜):

```text
각 검증 명령의 실제 출력과 종료 코드(exit code)를 대화에 그대로 보이고, acceptance.json은 그 검증을 돌린 뒤에만 `passes`를 바꾼다. 먼저 {PRD_FILE}, PLAN.md, VALIDATION.md, RECOVERY.md, PROGRESS.md를 읽고 PROGRESS.md의 재개 순서를 따른다. 작업을 시작하면 PLAN.md의 해당 줄을 `[>]`, 끝나면 `[x]`, 사람 판단이 필요하면 `[!]`로 바꾸고, 작업마다 PROGRESS.md를 업데이트한다. {PRD_FILE}와 PLAN.md 밖으로 scope 확장은 금지하고 {TYPE_CONSTRAINT}, 테스트를 지우거나 건너뛰지 않는다. 같은 검증이 3회 실패하거나 구조적으로 막히면 PROGRESS.md에 `BLOCKED:` 사유·시도 3개·다음 안전한 선택지를 적고 멈춘다 — 이것도 정당한 종료다.
```

아래 각 유형은 **끝난 상태 문장**과 `{TYPE_CONSTRAINT}`만 정한다. 실제 본문 = `/goal ` + 끝난 상태 문장 + 공통 꼬리.

### F-1. 버그 수정

- 끝난 상태: `{BUG_NAME} 버그를 재현하는 테스트가 통과(exit 0)하고, PLAN.md의 모든 작업이 `[x]`이며 VALIDATION.md 필수 검증이 모두 통과하면 완료다.`
- `{TYPE_CONSTRAINT}`: `{NO_TOUCH_AREAS}는 바꾸지 않으며`
- PLAN.md 첫 작업은 "버그를 재현하는 실패 테스트를 먼저 만든다"로 둔다(수정 전 재현은 조건이 아니라 PLAN·RECOVERY의 절차).

### F-2. 기능 구현

- 끝난 상태: `PLAN.md의 모든 작업이 `[x]`이고 VALIDATION.md 필수 검증이 모두 통과하면 완료다.`
- `{TYPE_CONSTRAINT}`: `Non-goals는 구현하지 않으며`

### F-3. UI 구현

- 끝난 상태: `PLAN.md의 모든 작업이 `[x]`이고, VALIDATION.md 필수 검증(빌드·스크린샷 저장 명령 포함)이 모두 통과하면 완료다.`
- `{TYPE_CONSTRAINT}`: `기존 디자인 패턴과 design token을 바꾸지 않으며`
- 참조 화면과 눈으로 비교하는 일은 VALIDATION.md `사람 확인 항목`으로 둔다. viewport 목록({VIEWPORTS_LIST})은 스크린샷 명령과 PLAN 작업에 넣는다.

### F-4. 문서 집필

- 끝난 상태: `PLAN.md의 모든 섹션 작업이 `[x]`이고 VALIDATION.md의 문서 검사 명령(섹션·링크·lint)이 모두 통과하면 완료다.`
- `{TYPE_CONSTRAINT}`: `승인된 섹션의 톤·구조를 바꾸지 않으며`
- 한 번에 한 섹션씩 쓰고, 검사에 실패한 섹션은 그 섹션만 다시 쓰는 규칙은 PLAN 작업과 RECOVERY에 둔다.

### F-5. 마이그레이션

- 끝난 상태: `{MIGRATION_TARGET}의 새 경로가 VALIDATION.md의 계약 테스트와 패리티 체크를 모두 통과하고 PLAN.md의 모든 작업이 `[x]`이면 완료다.`
- `{TYPE_CONSTRAINT}`: `승인 없이 public API를 바꾸지 않으며`
- 읽기 목록에 `{SDD_INCLUDE}`(SDD가 있으면 `, SDD.md`)를 PLAN.md 앞에 넣는다. legacy 경로 유지·단계별 패리티 체크는 PLAN·RECOVERY에 둔다.

### F-6. 프롬프트 / eval 개선

- 끝난 상태: `eval 점수가 VALIDATION.md의 목표 점수 이상이고 PLAN.md의 모든 작업이 `[x]`이며 VALIDATION.md 필수 검증이 모두 통과하면 완료다.`
- `{TYPE_CONSTRAINT}`: `eval 데이터셋을 고치지 않고 한 번에 프롬프트 하나만 바꾸며`
- 베이스라인 점수 기록은 PLAN 첫 작업으로 둔다.

---

## G. acceptance.json (완료 계약)

Step 5에서 5개 문서와 함께 생성한다. PRD 완료 기준 중 **명령으로 확인할 수 있는 것**을 한 항목씩 적는다. 명령으로 확인할 수 없는 기준은 여기 넣지 않고 VALIDATION.md `사람 확인 항목`에 둔다(매핑 표의 id 칸은 `H{K}`).

```json
[
  {
    "id": "AC-01",
    "criterion": "{PRD 완료 기준 문장 — output_lang}",
    "check_command": "{이 기준을 확인하는 명령}",
    "passes": false,
    "evidence": ""
  }
]
```

규칙:
- 최상위는 배열이다. 각 항목은 정확히 `id`·`criterion`·`check_command`·`passes`·`evidence` 다섯 키를 가진다. 키 이름은 번역하지 않고, `criterion` 값만 `output_lang`으로 쓴다.
- 생성 시 모든 `passes`는 `false`, `evidence`는 `""`다.
- 골 실행 중에는 `check_command`를 실제로 돌린 뒤에만 `passes`를 `true`로 바꾸고 `evidence`에 출력 요약·종료 코드·시각을 적는다. `id`·`criterion`·`check_command` 수정과 항목 삭제는 금지다.
- `id`는 `AC-01`부터 차례로 붙이고 VALIDATION.md 매핑 표와 1:1로 맞춘다.
- 작업 상태의 정본은 여전히 PLAN.md다. 이 파일은 완료 기준(acceptance criteria)의 정본이다.

---

## 슬롯 채움 순서 (Step 5 알고리즘)

1. Step 1 결과에서 `{PROJECT_NAME}`, `{PRD_FILE}`, `{GOAL_ONE_LINER}`, `{ACCEPTANCE_MAPPING_ROWS}`, `{OPEN_QUESTIONS_FROM_PRD_OR_NONE}` 추출
2. Step 2/3/4 인터뷰 결과에서 `{TASK_TYPE}`, 검증 명령 multiSelect, 마일스톤 확정 결과 추출
3. `task-type-templates.md`에서 `{TASK_TYPE}` 행을 읽어 `{REQUIRED_CHECK_ROWS}`, `{HUMAN_CHECK_ROWS_OR_NONE}`, `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}`, `{TASK_TYPE_SCOPE_ADDITIONS}`, 사용할 /goal 템플릿(F-1~F-6) 결정. 사람이 해야 하는 검증은 위 "사람 없이 도는 골의 검증 규칙"대로 명령으로 바꾸거나 사람 확인 항목으로 옮긴다
4. 5개 파일 본문 + `acceptance.json` 생성. 마지막에 빈 `{...}` 슬롯 잔존 여부 확인 — 있으면 해당 줄 제거 또는 합리적 기본값으로 치환
5. goal-command.md는 F의 뼈대대로 한 문단으로 만들고 Step 6 길이 확인으로 전달(600자 이하면 그대로)
6. 새 PLAN의 각 마일스톤에 `{MILESTONE_PURPOSE}` 한 줄과 `{MILESTONE_TASK_ROWS}`(`- [ ] M{N}-T{K}: ...` 2~6행)를 생성한다 — 이어가기 분기에서는 생략
7. 작업 ID 중복·빈 작업 행이 없는지, `acceptance.json` id가 매핑 표와 1:1인지 확인한다
