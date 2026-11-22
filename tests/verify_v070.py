#!/usr/bin/env python3
"""goaljaby v0.7.0 회귀 검사 — compact-strategy.md의 검증 코드를 그대로 꺼내 실행한다.

1. 기대 산출물 goal-command.md: P1~P5 + TASK_STATUS_RULE + 4,000자 + 조건 모양(S1~S3)·600자 (v0.9.0)
1-1. 기대 산출물 acceptance.json: 스키마·초기값·id 중복
2. 기대 산출물 PLAN.md: 마일스톤마다 작업 행 1개 이상, ID 중복 없음
3. P5 약어 충돌: PROGRESS.md를 PR.md로 바꾸면 P5가 실패해야 한다(예외 규칙이 왜 필요한지 고정)
4. 체크리스트 없는 기존 PLAN에서는 TASK_STATUS_RULE이 면제된다
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STRATEGY = ROOT / "skills/goaljaby/references/compact-strategy.md"
EXPECTED = ROOT / "tests/fixtures/settings-persistence-prd/expected-outputs"

code = re.search(r"## 컴팩트 후 자체 검증\s+```python\n(.*?)```", STRATEGY.read_text(), re.S).group(1)
ns: dict = {}
exec(code, ns)
verify_compact, verify_task_rule = ns["verify_compact"], ns["verify_task_rule"]
verify_condition_shape = ns["verify_condition_shape"]
import json

fails = []
def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        fails.append(name)

goal = (EXPECTED / "goal-command.md").read_text()
plan = (EXPECTED / "PLAN.md").read_text()
rows = re.findall(r"^- \[[ >x!]\] (M\d+[a-z]?-T\d+):", plan, re.M)
plan_has_tasks = bool(rows)

r = verify_compact(goal)
check("goal-command: verify_compact", not r, str(r))
r = verify_task_rule(goal, plan_has_tasks)
check("goal-command: verify_task_rule", not r, str(r))
check("goal-command: 4,000자 이하", len(goal) <= 4000, str(len(goal)))
f, w = verify_condition_shape(goal)
check("goal-command: 조건 모양(S1 BLOCKED·S2 출력/종료 코드·S3 한 문단)", not f, str(f))
check("goal-command: 목표 600자 이하", not w, str(w))
check("goal-command: PRD.md 고정 이름 없음(실제 파일 01_PRD.md)", "01_PRD.md" in goal and not re.search(r"(?<![0-9_])PRD\.md", goal))
check("BLOCKED 문장 빼면 S1 실패", any("S1" in x for x in verify_condition_shape(goal.replace("BLOCKED", "보류"))[0]))
check("종료 코드 문구 빼면 S2 실패", any("S2" in x for x in verify_condition_shape(goal.replace("종료 코드(exit code)", "결과"))[0]))

acc = json.loads((EXPECTED / "acceptance.json").read_text())
K = {"id", "criterion", "check_command", "passes", "evidence"}
check("acceptance.json: 배열·5키·passes false·evidence 빈칸",
      isinstance(acc, list) and acc and all(set(x) == K and x["passes"] is False and x["evidence"] == "" for x in acc))
check("acceptance.json: id 중복 없음", len({x["id"] for x in acc}) == len(acc))
prd_ac = re.findall(r"^- \[ \] ", (ROOT / "tests/fixtures/settings-persistence-prd/01_PRD.md").read_text(), re.M)
check("acceptance.json: PRD 완료 기준 수 이상", len(acc) >= len(prd_ac), f"{len(acc)} < {len(prd_ac)}")

milestones = re.findall(r"^## 마일스톤 (\d+[a-z]?):", plan, re.M)
for m in milestones:
    check(f"PLAN: M{m} 작업 행 ≥ 1", any(x.startswith(f"M{m}-T") for x in rows))
check("PLAN: 작업 ID 중복 없음", len(rows) == len(set(rows)), str(rows))

abbr = goal.replace("PROGRESS.md를 업데이트", "PR.md를 업데이트")
check("P5 약어 충돌 재현(치환하면 P5 실패)", any("P5_progress" in x for x in verify_compact(abbr)))

check("기존 PLAN은 TASK_STATUS_RULE 면제", verify_task_rule("/goal 아무 본문", False) == [])
check("마커 빠지면 TASK_STATUS_RULE 실패", bool(verify_task_rule(goal.replace("`[!]`", ""), True)))

print(f"\n{'OK' if not fails else 'FAILED'}: {len(fails)} failure(s)")
sys.exit(1 if fails else 0)
