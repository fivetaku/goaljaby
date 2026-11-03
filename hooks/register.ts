import type { Register } from 'claude-code'

// 골잡이 Step 10: 승인 뒤 응답 *마지막 줄*의 `/goal {본문}`을 사람이 다시 입력하지 않아도
// 이 세션에서 바로 실행한다. 승인 게이트(Step 9)는 그대로 — 이 훅은 승인 뒤에 나온 줄만 받는다.
// 관리 명령(/goal clear 등)·본문 없는 줄·서브에이전트 턴·중단된 턴은 건드리지 않는다.
const ADMIN = /^(clear|stop|cancel|off|status|pause|resume)$/i

export function trailingGoal(answer: string): string | null {
  const lines = (answer || '').trimEnd().split('\n')
  const last = (lines[lines.length - 1] || '').trim()
  if (!/^\/goal\s+\S/.test(last)) return null
  const body = last.replace(/^\/goal\s+/, '').trim()
  return ADMIN.test(body) ? null : body
}

export const register: Register = on => {
  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId !== undefined || e.reason !== 'answer') return r
    const body = trailingGoal(e.answer)
    if (!body) return r
    // 세션이 쉬는 순간 큐에서 실행된다(사람이 /goal을 친 것과 같은 경로, Goal set 기록).
    void $.command.run({ command: 'goal', args: body }).catch(() => {
      $.ui.toast('골잡이: /goal을 자동으로 시작하지 못했습니다. goal-command.md의 /goal 줄을 입력창에 보내 주세요.')
    })
    return r
  })
}
