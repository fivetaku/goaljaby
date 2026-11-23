# Changelog

## 0.10.0 (2026-11-23)

- **Codex에서도 같은 스킬로 동작**: 검토 문서 5종·acceptance.json·PLAN/PROGRESS 형식은 두 하네스가 같다. Claude Code는 Step 9 승인 뒤 응답 마지막 줄 `/goal`을 훅이 실행하는 기존 동작 그대로이고, Codex는 승인 뒤 `create_goal`로 골을 시작한다(`skills/goaljaby/references/codex.md`).
- 질문 도구 4단계(async, Plan, 번호 블록, `codex exec`는 묻지 않음) 안내, SKILL 설명의 "Claude Code 전용" 표현 제거, 명령 파일은 SKILL.md를 읽고 따르는 얇은 형태로 정리.

## 0.9.0 (2026-11-22)

- **판정 가능한 골 조건**: `/goal` 본문을 절차서(최대 4,000자)에서 한 문단 조건(목표 600자)으로 바꿨다 — 끝난 상태 + 검증 출력·종료 코드를 대화에 보이는 규칙 + 제약 + `BLOCKED` 출구. 판정 모델은 조건과 대화만 보기 때문이다. 4,000자 컴팩트는 비상용으로 내렸고, 조건 모양 검사(S1 BLOCKED·S2 출력/종료 코드·S3 한 문단)를 P1~P5에 더했다.
- **막히면 멈춤**: RECOVERY의 "사람을 기다린다"를 `BLOCKED` 종료(PROGRESS.md 기록 후 멈춤)로 바꿨다. git 체크포인트(작업 통과 시 커밋·해시 기록), 되돌리기 기준 = 마지막 통과 커밋, 컴팩션 뒤 재개 규칙 추가.
- **완료 계약 `acceptance.json`** 신설. 상태 정본 정리: 작업 = PLAN 마커, 완료 기준 = acceptance.json. VALIDATION 매핑 표 상태 열 삭제, 필수 검증은 명령·기대 결과·마지막 실행 결과·시각 표.
- 사람 없이 도는 골에서 "수동 재현"은 필수 검증이 아니다 — 명령으로 바꾸거나 `사람 확인 항목`(`[!]`, 완료를 막지 않음)으로 옮긴다. 문서 집필 유형에도 검사 명령을 둔다.
- PROGRESS에 `재개 순서`(고정)·`결정 기록`·`체크포인트 커밋` 추가, `[>]`는 한 번에 하나. 템플릿의 `PRD.md` 고정 이름을 `{PRD_FILE}`(실제 파일, 예: `01_PRD.md`)로 바꿨다.

## 0.8.1 (2026-11-04)

- 문서 정합: 남아 있던 "다음 턴에서 시작" 표현 8곳을 훅 자동 실행 설명으로 바꾸고, 승인 뒤 사용자에게 복사·붙여넣기를 요청하지 않는다는 문장을 Step 2·Step 9에 명시했다. 동작 변경 없음.

## 0.8.0 (2026-11-03)

- **승인 뒤 /goal 자동 실행**: 응답 마지막 줄의 `/goal {본문}`을 훅(`hooks/register.ts`, `turn.complete`)이 턴 종료 시 `/goal` 명령으로 실행한다. 지금까지는 "다음 턴 입력으로 처리된다"고 문서에 썼지만 실제로는 사람이 그 줄을 다시 입력해야 했다(세션 기록 95건 전부 수동 재입력). 헤드리스 `claude -p`에서도 동작(`Goal set:` 기록 확인).
- 제외: `/goal clear` 같은 관리 명령, 서브에이전트 턴, 중단·오류로 끝난 턴. 실패하면 토스트로 goal-command.md의 줄을 보내라고 안내한다. Step 9 승인 게이트는 그대로다.
- 테스트 `goaljaby.test.ts`(`claude plugin test`), 5건.


## 0.7.3 (2026-10-21)

- **비유·은어 금지**: 쉬운 말 규칙에 "팔·하네스·원장·파일럿·시드·런" 같은 비유·업계 속어를 평범한 말로 바꾸는 규칙과, 과제를 코드명(T1)으로만 부르지 않는 규칙을 추가했다. 목표 예시 추가. Step 7 4-2 점검 대상에 포함.

## 0.7.2 (2026-10-21)

- **마일스톤 목적 줄**: 새 PLAN.md의 각 마일스톤 첫 줄에 `- 목적:`(en `- Purpose:`)을 쓴다. 왜 하는지, 끝나면 무엇이 남는지 쉬운 말 한 문장. 쉬운 말 규칙을 목표·범위·완료 조건에도 적용한다.
- 진행 보드 playmaker 0.1.2가 이 줄을 목표·범위·완료 조건과 함께 마일스톤 설명으로 보여 준다. Step 7 4-1에 목적 줄 존재 검사 추가.

## 0.7.1 (2026-10-21)

- **쉬운 말 규칙**: 작업 행·마일스톤 이름·문서 본문을 PRD를 안 읽은 사람도 한 줄만 보고 알아듣게 쓴다. PRD 내부 약칭·코드명(예: "C팔", "원장", "하네스")은 풀어 쓰고, 한 줄에 주된 일 하나, "기록한다" 대신 무엇을 어디에 남기는지 쓴다. 작업 문장 40자·마일스톤 이름 20자 안팎. 진행 보드(playmaker) 카드가 읽기 어렵다는 피드백 반영.
- Step 7에 4-2 쉬운 말 점검 추가(고쳐 쓰기만, 폐기 사유 아님).

## 0.7.0 (2026-10-15)

- **작업 단위 진행 기록**: 새 PLAN.md의 각 마일스톤에 `- [ ] M{N}-T{K}: 작업` 체크리스트(2~6행)를 만든다. `/goal` 본문 F-1~F-6에 "작업을 시작하면 `[>]`, 끝나면 `[x]`, 사람 판단이 필요하면 `[!]`로 바꾼다(마커만)" 한 줄을 넣는다. 세부 작업 상태의 정본은 PLAN.md, PROGRESS.md는 실행 로그.
- Step 7에 `TASK_STATUS_RULE` 검사 추가(PLAN.md 언급 + 마커 3종). P1~P5 보호절은 그대로.
- **Fix**: 컴팩트 약어 치환이 `PROGRESS.md`를 `PR.md`로 바꿔 P5 정규식과 충돌하던 잠복 버그 — P5 문장과 작업 상태 규칙 문장의 파일명은 약어 치환에서 제외.
- 하위호환: 기존 골 폴더·이어가기 분기·사람이 쓴 PLAN은 다시 쓰지 않는다. 체크리스트가 없는 PLAN도 그대로 실행된다.
- 진행 보드: 별도 플러그인 playmaker가 이 체크리스트를 읽어 대기·진행·완료 보드로 보여 준다.

## 0.6.5 (2026-10-14)
- **gptaku-core 라우팅 조정.** 실제 대화에서 잘못 지목된 사례에 맞춰 `routing.json`의 키워드·제외어를 고쳤다. gptaku-core 0.1.1과 함께 적용된다.

## 0.6.4 (2026-10-13)
- **gptaku-core 라우팅 적용.** `gptaku-core`를 의존성으로 선언하고 `routing.json`을 추가해, 이 플러그인 스킬에 맞는 요청이 오면 직접 처리하거나 기본 도구를 쓰기 전에 이 스킬을 먼저 쓰게 했다. 기존 사용자는 업데이트 후 `/reload-plugins`를 실행하거나 플러그인을 다시 설치해야 gptaku-core가 함께 설치된다. 끄기: `GPTAKU_ROUTER=off`.

## 0.6.3 (2026-09-04)

- README(en/ko) 정합화: "한국어 우선/Korean-first" 서술을 실제 `output_lang` 정책(요청 언어 자동 감지, ko/en 1급)으로 교정 — SKILL.md·plugin.json과 모순되던 7곳 수정
- README에 승계 기능 문단 추가: 디자인 레퍼런스(v0.6.0) + kkirikkiri 게이트 규율(v0.6.2) — 코드에는 있었으나 미기재
- (kkirikkiri E2E 감사 확정 발견 반영)


## 0.6.2 (2026-08-30)

- **kkirikkiri 멀티에이전트 게이트 승계**: kkirikkiri(v0.23.0+) 설치 시 Step 5에서 RECOVERY.md에 게이트 규율 1항목 주입 — 골 세션이 팀·워크플로를 쓸 때 wf-lint 통과·경계 블록·read-only 검증자를 따르게 함. 미설치 환경은 조용히 건너뜀(무동작)


## 0.6.1 — 2026-08-24

- **Fix: first-run setup could wipe `settings.json`** — if the file was corrupted or contained comments (JSONC), the shared update-notifier installer re-wrote it as an empty object plus the hook, silently destroying all user settings. It now refuses to write when parsing fails and writes atomically (tmp + rename). Marketplace-wide propagation of the fix found in the ddiring v0.1.1 external review; reproduction-verified.

## 0.6.0 — 2026-07-09

### Added — 디자인 레퍼런스 승계 (show-me-the-prd v0.10+ 연동)

- Step 1: PRD 디렉토리에 `references/` + `sources.json`이 있으면 스타일 키워드와 keep 이미지 목록을 감지 (없으면 완전 무동작 — 재수집하지 않음).
- Step 5: UI 관련 작업 유형일 때 PLAN.md 참조 문서에 `PRD/references/` 추가 + VALIDATION.md에 "산출물이 레퍼런스 스타일 방향과 부합하는가(구현 전 이미지를 Read로 확인)" 검증 항목 + 저작권 가드(산출물 재게시 금지) 승계.
- goal-command.md 본문에는 넣지 않음 — 4,000자 예산 보호, 골 세션이 읽는 PLAN/VALIDATION으로 전달.

## 0.5.1 — 2026-06-21

- The GitHub-star prompt is shown in the user's current language; on a fresh session with no language signal yet, it falls back to the language detected from your recent Claude sessions (else English).
- GitHub star is now **opt-in** — on first run the command asks once via AskUserQuestion (`네, ⭐ 눌러주기` / `아니요`) instead of auto-starring. The star logic moved into `setup.sh` and records the choice (`~/.gptaku-setup/<plugin>.star.json`) so it never re-asks. `setup.sh` no longer stars anything automatically.

