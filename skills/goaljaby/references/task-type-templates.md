# 작업 유형 × 5개 파일 강조 매핑 (Step 5)

작업 유형 6종 각각에 대해 VALIDATION/RECOVERY 슬롯 추가 항목 + 사용할 /goal 끝난 상태 문장(F-1~F-6)을 정의한다.

**언어 정책 (policy-excerpt.md)**: 아래 추가 항목은 한국어로 표기돼 있으나 생성 시 `output_lang`으로 렌더링한다. 식별자(`feature flag`, `viewport`, `design token`, `scope`, `refactor`, `public API`, `DB 스키마`, `eval` 등)는 번역하지 않는다.

기본 템플릿은 `templates.md` 참조. 이 파일은 **유형별 추가/오버라이드**만 명시한다.

**공통 규칙 (v0.9.0)**: `{REQUIRED_CHECK_ROWS}`에는 사람 없이 실행해 종료 코드로 판정할 수 있는 명령만 넣는다. 사람이 봐야 하는 확인은 `{HUMAN_CHECK_ROWS_OR_NONE}`(`- [!] H{K}: ...`)로 보내고 완료를 막지 않는다 — PRD가 막는 항목으로 정한 경우만 `(완료를 막음)` 표시. 명령마다 `acceptance.json` 항목을 하나 이상 연결한다.

## 1. 기능 구현 (Feature)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_ROWS}` | 단위 테스트 명령 + 통합 테스트 명령 (Step 3 multiSelect 결과), 기대 결과 `exit 0` |
| `{HUMAN_CHECK_ROWS_OR_NONE}` | 보통 `없음`. 자동화할 수 없는 사용성 확인만 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- 기능 토글이 켜졌으나 내부 플래그가 연결되지 않음` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- 문서·롤백 경로 없는 feature flag 추가 금지` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 끝난 상태 문장 | **F-2** |

## 2. 버그 수정 (Bugfix)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_ROWS}` | 버그를 재현하는 자동 테스트(또는 재현 스크립트) + 회귀 테스트 명령. 손으로 하는 재현은 넣지 않는다 |
| `{HUMAN_CHECK_ROWS_OR_NONE}` | 재현을 명령으로 만들 수 없을 때만 `- [!] H1: <재현 절차> 후 증상이 없는지 본다` |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- 재현 테스트가 여전히 실패`<br>`- 재현 scope 밖 모듈을 수정함` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- 수정 중 무관한 모듈 refactor 금지` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 끝난 상태 문장 | **F-1** |

## 3. UI 구현 (UI)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_ROWS}` | 빌드 명령 (예: `npm run build`) + viewport별 스크린샷 저장 명령(파일이 생기면 통과) |
| `{HUMAN_CHECK_ROWS_OR_NONE}` | `- [!] H1: 저장된 스크린샷을 참조 화면과 눈으로 비교한다` |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- 텍스트 겹침·잘림 발생`<br>`- 모바일 viewport 미확인` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- PLAN 승인 없이 design token·전역 스타일 변경 금지` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | `templates.md`의 시각 검증 블록 포함 |
| /goal 끝난 상태 문장 | **F-3** |

## 4. 문서 집필 (Doc)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_ROWS}` | 문서 검사 명령을 반드시 하나 이상 둔다. 예: PLAN 섹션 제목이 모두 있는지(`for h in '## 개요' '## 설치'; do grep -qF "$h" docs/guide.md \|\| { echo "missing $h"; exit 1; }; done`), 남은 자리표시 없음(`! grep -n 'TODO\|TBD' docs/guide.md`), 상대 링크 대상 파일 존재 확인 스크립트, markdown lint(`npx markdownlint-cli2 docs/**/*.md`)가 있으면 포함 |
| `{TARGETED_CHECK_COMMANDS}` | 섹션 하나를 끝낼 때 돌리는 위 검사의 해당 섹션판 |
| `{HUMAN_CHECK_ROWS_OR_NONE}` | `- [!] H1: 톤·정확성을 사람이 읽고 확인한다` (명령으로 판정할 수 없는 품질 확인은 여기로) |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- 인용해야 할 참고 자료가 섹션에서 누락됨`<br>`- 문서 중간에 톤이 바뀜` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- 승인된 섹션은 톤·구조 변경 금지` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 끝난 상태 문장 | **F-4** |

## 5. 마이그레이션 (Migration)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_ROWS}` | 패리티 체크 명령 + 롤백 리허설 명령 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- 패리티 체크 실패`<br>`- 롤백 리허설 증거 없음` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- PLAN/SDD 명시 없이 public API surface·DB 스키마 변경 금지` |
| `{SDD_INCLUDE}` | `, SDD.md` (PRD 디렉토리에 SDD가 있으면 F-5 읽기 목록에 추가) |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 끝난 상태 문장 | **F-5** |

## 6. eval 개선 (Eval)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_ROWS}` | eval suite 실행 명령 + 베이스라인 비교 명령(목표 점수 미달이면 exit 1) |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- 베이스라인 대비 점수 회귀`<br>`- eval 데이터셋 자체를 변경함` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- 한 번에 하나 이상의 프롬프트 변경 금지`<br>`- eval 데이터셋 수정 금지` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 끝난 상태 문장 | **F-6** |

## 적용 순서

1. Step 1에서 작업 유형 추정 (`task-type-classifier.md`)
2. Step 3에서 사용자가 최종 확정
3. Step 5에서 위 표의 해당 행을 가져와 `templates.md`의 슬롯 치환
4. 빈 슬롯이 남으면 해당 줄 자체 제거 (placeholder 잔존 금지)
