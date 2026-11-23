# Codex에서 실행할 때 (goaljaby)

SKILL.md 절차는 그대로 따르고, 아래 차이만 적용한다.

## 질문 = 질문 도구 (이번 세션 도구 목록으로 판단)

1. `request_user_input_async`가 있으면 질문 1콜 = 이 도구 1콜(문항 ≤4).
   - 형식: `{"questions":[{"title":"헤더 — 한 줄 질문","options":["추천안 (추천) — 설명","대안 — 설명"]}]}`
   - 문항에는 `title`·`options`만. `question`·`header`·`id`를 넣으면 파싱 오류가 난다. 추천안을 맨 앞에, "기타" 옵션은 넣지 않는다.
   - 부른 뒤 "위 질문에 답해 주시면 이어서 진행합니다" 한 줄만 쓰고 턴을 끝낸다. 답은 다음 사용자 메시지로 온다.
2. Plan 모드라 `request_user_input`만 있으면: 1콜 3문항까지. `header`(12자 이내)·`id`(snake_case)·`question`, 선택지 2~3개(`label`·`description`), 추천 라벨 끝에 `(Recommended)`.
3. 둘 다 없으면 채팅에 번호 블록(`Q1. …` / `1. 추천안 (추천) — …` / `2. 대안 — …` / 답 형식 안내)으로 묻는다.
4. `codex exec`처럼 사람이 답할 수 없는 실행이면 묻지 않고 추천안으로 진행하되, **Step 9 승인은 받을 수 없으므로 골을 시작하지 않고** 파일 위치만 안내하고 끝낸다.
- Step 9 승인 게이트는 어느 경로로든 우회하지 않는다.

## 골 시작 (create_goal) — Step 10 대체

1. Step 9에서 사용자가 시작을 승인했을 때만 진행한다. `goal-command.md` 본문 전체에서 맨 앞의 `/goal `만 제거한다. 여러 줄 완료 조건과 보호절(BLOCKED 출구 포함)을 모두 `objective`에 넣는다.
2. 현재 세션의 `create_goal` 도구에 `objective`를 전달한다(사용자가 명시한 토큰 예산이 있을 때만 `token_budget` 추가). 이미 진행 중인 목표가 있거나 결과가 불확실하면 `get_goal`로 확인한다. 같은 목표가 활성이면 그대로 이어가고, 다른 활성 목표가 있으면 상태를 알리고 시작을 보류한다. 상태 갱신이 필요하면 `update_goal`.
3. 활성을 확인한 뒤에만 PROGRESS.md에 시작 기록(시작 시각, 사용 CLI: codex)을 남기고 첫 미완료 작업을 같은 턴에 진행한다. 재개 시 기존 시작 기록은 보존한다.
4. 도구가 없거나 생성이 실패하면 이유와 `goal-command.md` 위치를 알려 수동 실행하게 한다. 실패한 시도는 시작으로 기록하지 않는다.

## 그 밖의 차이

- 첫 실행 설정(`setup/setup.sh`)은 Claude Code 전용이다. Codex에서는 실행하지 않는다.
- `hooks/hooks.json`은 mod 모듈(`register.ts`)만 선언한다. Codex는 명령 훅만 실행하고 mod는 무시하므로 오류 없이 건너뛴다(훅 없음). 그래서 `/goal` 줄 자동 실행은 Codex에서 일어나지 않고 위 `create_goal`이 그 역할을 한다.
- `/show-me-the-prd` 위임(Step 0-B)은 Codex의 show-me-the-prd 스킬 SKILL.md를 열어 따른다.
- 서브에이전트(`Task`)는 쓰지 않는다. 항상 순차 실행.
