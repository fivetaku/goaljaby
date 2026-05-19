---
name: goaljaby
description: PRD 폴더를 받아 VALIDATION/RECOVERY/PLAN/PROGRESS/goal-command.md 5종을 자동 생성하고 사람 승인 후 /goal 본문을 코드블럭으로 안내한다 (Claude Code 전용).
argument-hint: "[PRD 디렉토리 절대 경로 (예: /Users/<username>/my-project/PRD/) — 비우면 묻기]"
---

# /goaljaby — 골잡이 호출

PRD 디렉토리를 받아 골 운영 5종 문서를 자동 생성하고, 검토·승인을 거쳐 `/goal` 본문을 코드블럭으로 안내한다 (사용자가 다음 메시지로 직접 붙여넣음).

## 인수 파싱

- 인수 없음 → 사용자에게 PRD 디렉토리 경로 묻기 (AskUserQuestion)
- 절대경로 또는 상대경로 → 해당 경로를 `prd_dir`로 사용
- "분석 [경로]" → 기존 산출물 검토 모드 (덮어쓰기 전 확인)

## 실행

1. `skills/goaljaby/SKILL.md`의 워크플로우 10단계를 순서대로 실행
2. Step 2 (Claude Code 운영 컨텍스트 자동 확정) → Step 3 작업 유형 → Step 4 마일스톤 확정까지 인터뷰 진행
3. Step 5에서 5개 파일 생성, Step 6에서 4,000자 자동 컴팩트, Step 7 자체 검증
4. Step 9 사람 검토 게이트에서 승인 받으면 Step 10에서 /goal 본문을 코드블럭으로 출력 (사용자가 다음 메시지로 직접 붙여넣음)

## 안전장치

- Step 0에서 기존 산출물(VALIDATION.md 등) 존재 시 덮어쓰지 않고 확인
- 4,000자 컴팩트 실패 시 결과물 저장하지 않고 구조적 오버플로우 보고
- Step 9 승인 게이트는 우회 불가 (자동 실행이라도 승인은 필수)

## 참고

- 메서돌로지 본문: `../../00_왜_이_흐름인가.md` 외 7개 문서
- 스킬 본체: `skills/goaljaby/SKILL.md`
