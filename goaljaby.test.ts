import { test, expect, describe } from 'claude-code/testing'
import { trailingGoal } from './hooks/register'

describe('trailingGoal', () => {
  test('마지막 줄의 /goal 본문을 뽑는다', () => {
    expect(trailingGoal('검토하신 골을 시작합니다.\n\n/goal PRD.md의 기준이 만족될 때까지 구현한다')).toBe('PRD.md의 기준이 만족될 때까지 구현한다')
  })
  test('마지막 줄이 아니면 무시', () => {
    expect(trailingGoal('/goal 본문\n그 뒤 설명')).toBeNull()
  })
  test('관리 명령·빈 본문·일반 답은 무시', () => {
    expect(trailingGoal('정리했습니다.\n/goal clear')).toBeNull()
    expect(trailingGoal('/goal')).toBeNull()
    expect(trailingGoal('T1을 끝냈습니다.')).toBeNull()
    expect(trailingGoal('')).toBeNull()
  })
})

const END = { durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' as const }

describe('turn.complete', () => {
  test('승인 응답 마지막 줄의 /goal을 이 세션에서 실행한다', async ($, on) => {
    const runs: any[] = []
    on('command.run', ($: any, e: any) => { runs.push({ command: e.command, args: e.args }); return { text: `Goal set: ${e.args}` } })
    on('turn.complete', (_: any, e: any) => ({ text: e.answer }))
    await $.turn.complete({ ...END, answer: '시작합니다.\n\n/goal PLAN.md의 M1을 구현한다' })
    expect(runs).toEqual([{ command: 'goal', args: 'PLAN.md의 M1을 구현한다' }])
  })
  test('서브에이전트 턴·중단된 턴·/goal clear는 실행하지 않는다', async ($, on) => {
    const runs: any[] = []
    on('command.run', ($: any, e: any) => { runs.push(e.command); return { text: 'x' } })
    on('turn.complete', (_: any, e: any) => ({ text: e.answer }))
    await $.turn.complete({ ...END, agentId: 'a1', answer: '/goal PLAN.md의 M1을 구현한다' })
    await $.turn.complete({ ...END, reason: 'aborted', isAborted: true, answer: '/goal PLAN.md의 M1을 구현한다' })
    await $.turn.complete({ ...END, answer: '정리.\n/goal clear' })
    expect(runs).toEqual([])
  })
})
