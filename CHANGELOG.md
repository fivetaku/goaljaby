# Changelog

## 0.5.1 — 2026-06-21

- The GitHub-star prompt is now shown in the user's current language instead of hardcoded Korean.
- GitHub star is now **opt-in** — on first run the command asks once via AskUserQuestion (`네, ⭐ 눌러주기` / `아니요`) instead of auto-starring. The star logic moved into `setup.sh` and records the choice (`~/.gptaku-setup/<plugin>.star.json`) so it never re-asks. `setup.sh` no longer stars anything automatically.

