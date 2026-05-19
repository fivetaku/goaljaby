# CLI 운영 규칙

`target_cli` 인터뷰(Step 2) 결과에 따라 Step 5/10이 분기한다. CLI 비교 배경·환경 검증 절차·공식 URL은 강의 자료 `03_골_실행과_루프.md` §2 참조.

## target_cli == claude_code

- **RECOVERY.md**: pause/resume 언급 금지. "조건 도달 시 자동 종료" 또는 "`/goal clear` 후 재설정"으로 표현한다.
- **goal-command.md**: 4,000자 강제 (공식 제약).
- **Step 10**: 스킬은 슬래시 커맨드를 직접 호출하지 못한다. `/goal {본문}` 한 줄을 코드블럭으로 화면에 출력하고, 사용자가 다음 메시지로 직접 입력해 발사한다. `codex-handoff.md`는 생성하지 않는다.

## target_cli == codex_cli

- **RECOVERY.md**: 3회 룰 트리거 시 `/goal pause` 사용 명시 + 사람 결정 후 `/goal resume`.
- **goal-command.md**: 4,000자 강제 (공식 제약은 없으나 가독성·재현성을 위해 동일 기준).
- **Step 10**: `codex-handoff.md` 생성 + 본문을 코드블럭으로 화면에 출력 (사용자가 새 Codex CLI 세션에 붙여넣음). 활성화 사전 확인 3줄을 안내한다(버전 0.128.0+, `~/.codex/config.toml`의 `[features] goals = true` 또는 `/experimental` 토글, 새 Codex 세션을 작업 디렉토리에서 시작).

## target_cli == both

- 두 CLI 모두에서 안전한 공통 문장만 사용. pause/resume 같은 Codex 전용 표현 금지.
- `codex-handoff.md`는 항상 생성 (나중에 Codex로 옮길 수 있도록).
- Step 10에서 한 번 더 묻는다: "지금 이 세션(Claude Code)에서 시작? 아니면 Codex 핸드오프?" 답에 따라 위 두 분기 중 하나로 진행한다.
