---
name: goaljaby
description: PRD 폴더를 받아 사용자 언어로 검토 문서 5종을 자동 생성하고, 검토 요약을 대화창에 띄운 뒤 사용자 승인을 받으면 어시스턴트가 응답 마지막 줄로 /goal을 보내고 플러그인 훅이 그 줄을 바로 실행해 골 작업을 시작한다(붙여넣기 없음) (Claude Code 전용).
argument-hint: "[PRD 디렉토리 절대 경로 (예: /Users/<username>/my-project/PRD/) — 비우면 묻기]"
---

<!-- first-run setup: idempotent, non-blocking, self-skips after first run -->
**Step 0 — run once at the very start, before anything else:** run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" ask autoupdate`. If its output starts with `STAR_ASK`, immediately call the **AskUserQuestion** tool once, with the question and options phrased **in the user's language**: prefer the current conversation's language if it is evident; otherwise fall back to the language code that follows `STAR_ASK` in the output (`ko`→Korean, `ja`→Japanese, `en`→English). Never default to Korean blindly.
- header: a short localized "GitHub Star" label
- question: ask whether they'd like to give this plugin (and the gptaku-plugins marketplace) a GitHub ⭐ to support it — note it is optional and every feature works either way
- options: exactly two — (1) yes, star it → then run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" star yes`; (2) no thanks → then run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" star no`
- If the output contains a line `AUTOUPDATE_ASK <lang>`: ask the user ONCE with AskUserQuestion, written in the language the user is using in this conversation (fall back to <lang> — ko/ja/en — only if the conversation gives no signal). Question: gptaku-plugins can update itself automatically so you always get fixes without running /plugin manually. Turn on auto-update? Options (2): "Turn on auto-update" / "Not now".
  - "Turn on auto-update" → run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" autoupdate yes` (prints `AUTOUPDATE_SET <status>`; on `on`/`already` say it is enabled, otherwise say it could not be changed and point to /plugin → Marketplaces → gptaku-plugins → Turn on auto-update).
  - "Not now" → run `bash "${CLAUDE_PLUGIN_ROOT}/setup/setup.sh" autoupdate no`.
  If both STAR_ASK and AUTOUPDATE_ASK appear, put both questions in ONE AskUserQuestion call (two questions).

If the output is empty, just continue silently. (AskUserQuestion must NOT be in frontmatter allowed-tools.) Do not narrate beyond the question itself.

# /goaljaby — 골잡이 호출

인수(`$ARGUMENTS`)는 PRD 디렉토리 경로(비우면 스킬이 묻는다) 또는 "분석 [경로]"다.

`skills/goaljaby/SKILL.md`를 읽고 그 절차(Step 0~10)를 그대로 따른다. 인터뷰·승인 게이트의 `AskUserQuestion` 호출, 언어 정책(`output_lang`), 검토 문서 5종 생성, Step 9 승인 뒤 응답 마지막 줄 `/goal`(훅 실행)은 모두 SKILL.md에 있다.
