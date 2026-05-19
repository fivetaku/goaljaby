# 작업 유형 × 5개 파일 강조 매핑 (Step 5)

작업 유형 6종 각각에 대해 VALIDATION/RECOVERY 슬롯 추가 항목 + 사용할 /goal 템플릿을 정의한다.

기본 템플릿은 `templates.md` 참조. 이 파일은 **유형별 추가/오버라이드**만 명시한다.

## 1. 기능 구현 (Feature)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_COMMANDS}` | 단위 테스트 명령 + 통합 테스트 명령 (Step 3 multiSelect 결과) |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- New feature toggled on but underlying flag not wired` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- Do not add feature flags without docs / no rollback path` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 템플릿 | **F-2** |

## 2. 버그 수정 (Bugfix)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_COMMANDS}` | 원본 재현 절차 + 회귀 테스트 명령 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- Bug repro still fails`<br>`- Modified module outside repro scope` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- Do not refactor unrelated modules while fixing` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 템플릿 | **F-1** |

## 3. UI 구현 (UI)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_COMMANDS}` | 빌드 명령 (e.g. `npm run build`) + 스크린샷 캡처 명령 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- Text overlaps or clips`<br>`- Mobile viewport not checked` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- Do not modify design tokens or global styles without PLAN approval` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | `templates.md`의 Visual Verification 블록 포함 |
| /goal 템플릿 | **F-3** |

## 4. 문서 집필 (Doc)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_COMMANDS}` | 자동 검증 명령 없음. markdown lint가 있으면 포함. 그 외엔 섹션별 self-review |
| `{TARGETED_CHECK_COMMANDS}` | 섹션별 self-review 체크리스트 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- A section is missing references it should cite`<br>`- Tone changed mid-document` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- Do not change tone or structure after a section is approved` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 템플릿 | **F-4** |

## 5. 마이그레이션 (Migration)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_COMMANDS}` | 패리티 체크 명령 + 롤백 가능성 확인 명령 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- Parity check fails`<br>`- No rollback rehearsal evidence` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- Do not change public API surface or DB schema unless PLAN/SDD says so` |
| `{SDD_INCLUDE}` | `, SDD.md` (PRD 디렉토리에 SDD가 있으면 추가) |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 템플릿 | **F-5** |

## 6. eval 개선 (Eval)

| 슬롯 | 값 |
|------|-----|
| `{REQUIRED_CHECK_COMMANDS}` | eval suite 실행 명령 + 베이스라인 비교 명령 |
| `{TASK_TYPE_NOT_DONE_IF_ADDITIONS}` | `- Score regression vs baseline`<br>`- Changed eval dataset itself` |
| `{TASK_TYPE_SCOPE_ADDITIONS}` | `- Do not change more than one prompt at a time`<br>`- Do not modify the eval dataset` |
| `{VISUAL_VERIFICATION_BLOCK_OR_OMIT}` | (생략) |
| /goal 템플릿 | **F-6** |

## 적용 순서

1. Step 1에서 작업 유형 추정 (`task-type-classifier.md`)
2. Step 3에서 사용자 확정
3. Step 5에서 위 표의 해당 행을 가져와 `templates.md`의 슬롯 치환
4. 빈 슬롯이 남으면 해당 줄 자체 제거 (placeholder 잔존 금지)
