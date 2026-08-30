# Changelog


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

