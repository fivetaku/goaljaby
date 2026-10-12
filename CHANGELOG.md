# Changelog


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

