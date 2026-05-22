/goal PRD.md의 모든 acceptance criterion이 만족되고 VALIDATION.md의 필수 검증이 통과될 때까지 멈추지 말고 PLAN.md의 설정 영속화 기능을 구현한다.

먼저 PRD.md, VALIDATION.md, RECOVERY.md, PLAN.md를 읽는다.
마일스톤 단위로 작업한다.
PRD.md와 PLAN.md를 벗어나는 scope 확장은 금지한다.
Non-goals 항목이나 선택 기능은 구현하지 않는다.
각 마일스톤이 끝나면 검증을 실행한다.
각 마일스톤이 끝나면 PROGRESS.md를 업데이트한다.
요구사항이 충돌하거나 검증이 3회(3 attempts) 실패하면 자체 수정을 멈추고 사람의 결정을 기다린다 (Claude Code는 /goal pause를 지원하지 않음).
