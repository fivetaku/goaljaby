# Codex 핸드오프 프롬프트 템플릿

`target_cli == codex_cli` 또는 `both` (Codex 선택) 일 때 골잡이가 생성하는 `codex-handoff.md`의 표준 형식이다. 사용자는 이 본문을 새 Codex CLI 세션에 첫 메시지로 그대로 붙여넣는다.

## 표준 템플릿

```text
이 세션은 Claude Code에서 골잡이(goaljaby)로 셋업한 /goal 작업을 이어받는 Codex 세션이다.

작업 디렉토리: {output_dir}

먼저 다음 파일을 순서대로 읽어줘:
1. PRD.md (또는 PRD/ 폴더 안 최신 PRD 문서)
2. VALIDATION.md
3. RECOVERY.md
4. PLAN.md
5. PROGRESS.md

아직 어떤 구현도 시작하지 마. 먼저 다음을 요약해서 보여줘:

- 현재 목표 (한 문장)
- 현재 마일스톤 (PLAN.md 기준)
- 완료된 작업 (PROGRESS.md 기준, 없으면 "없음")
- 남은 작업
- 필수 검증 명령 (VALIDATION.md의 Required Checks)
- 실패 시 복구 규칙 (RECOVERY.md의 3회 룰 + scope 잠금)
- 지금 바로 골 실행으로 진입해도 되는지, 아니면 사람 확인이 필요한 항목이 있는지

요약 후 내가 "진행해"라고 답하면 다음 /goal 문장으로 실행을 시작해.
다른 답을 하면 그 답에 따라 추가 정보를 정리하거나 질문해.

---

준비된 /goal 문장:

{goal_command_본문 — goal-command.md의 컴팩트된 4,000자 이내 문장}

---

운영 규칙 (RECOVERY.md 요약):
- 같은 검증 3회 실패 → /goal pause + PROGRESS.md에 시도 3가지 + 실패 이유 보고
- PRD/PLAN에 없는 모듈 수정 금지
- 사용자 변경은 명시적 지시 없이 되돌리지 않음
- 검증 명령 자체를 다른 명령으로 교체 금지

운영 규칙 전체는 RECOVERY.md에 있으니 그쪽을 우선 따른다.
```

## 슬롯 치환 규칙

| 슬롯 | 출처 |
|------|------|
| `{output_dir}` | 골잡이 호출 시 PRD 디렉토리 (또는 사용자 지정) |
| `{goal_command_본문}` | 4,000자 컴팩트 완료된 `goal-command.md` 본문 |

PRD 파일이 디렉토리 안에 여러 개면 첫 번째 줄에 명시적으로 안내한다:
> "PRD는 `01_PRD.md`이고 같은 디렉토리에 `02_DATA_MODEL.md` 등 보조 문서가 있어. PRD 본문은 `01_PRD.md`를 우선 읽어."

## Codex 활성화 사전 확인

핸드오프 프롬프트 출력 직전, 사용자에게 다음을 한 줄로 안내한다:

```
⚠️ Codex CLI에서 다음을 먼저 확인하세요:
   1. 버전 0.128.0+ 설치 (`codex --version`)
   2. ~/.codex/config.toml 에 [features] goals = true 또는 /experimental 토글
   3. 새 Codex 세션을 작업 디렉토리({output_dir})에서 시작
```

## 골잡이 출력 형식 (`codex-handoff.md`)

```markdown
# Codex 핸드오프 — {프로젝트 이름}

생성: {타임스탬프}
대상 CLI: Codex CLI 0.128.0+
작업 디렉토리: {output_dir}

## 사용 방법

1. 새 터미널에서 `cd {output_dir}` 후 `codex` 실행
2. Codex 세션이 열리면 아래 "핸드오프 본문"을 첫 메시지로 그대로 붙여넣기
3. Codex가 요약을 출력하면 검토 후 "진행해"로 응답
4. Codex가 `/goal` 실행으로 진입

## 핸드오프 본문

(여기에 표준 템플릿 슬롯 치환 결과)
```

## 자기검증 체크

골잡이가 `codex-handoff.md`를 생성한 뒤 다음을 자체 검증한다:

- [ ] `{output_dir}` 슬롯이 절대경로로 치환됨
- [ ] `{goal_command_본문}` 슬롯에 PROTECTED_CLAUSES 5종이 모두 들어있음
- [ ] 핸드오프 본문에 "아직 어떤 구현도 시작하지 마" 문구가 보존됨 (Codex가 바로 코딩에 들어가지 않도록)
- [ ] Codex 활성화 사전 확인 3줄이 포함됨

하나라도 실패하면 `codex-handoff.md`를 저장하지 않고 사용자에게 보고한다.
