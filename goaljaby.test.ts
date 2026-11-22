import { test, expect, describe } from 'claude-code/testing'
import { trailingGoal } from './hooks/register'

describe('trailingGoal', () => {
  test('마지막 줄의 /goal 본문을 뽑는다', () => {
    expect(trailingGoal('검토하신 골을 시작합니다.\n\n/goal PRD.md의 기준이 만족될 때까지 구현한다')).toBe('PRD.md의 기준이 만족될 때까지 구현한다')
  })
  test('마지막 문단이 아니면 무시', () => {
    expect(trailingGoal('/goal 본문\n\n그 뒤 설명')).toBeNull()
  })
  test('마지막 문단이 여러 줄이면 공백 하나로 이어 붙인다', () => {
    expect(trailingGoal('시작합니다.\n\n/goal PLAN.md의 M1~M3을\n  순서대로 구현하고\nPROGRESS.md에 기록한다\n')).toBe('PLAN.md의 M1~M3을 순서대로 구현하고 PROGRESS.md에 기록한다')
  })
  test('한 줄짜리 /goal은 그대로', () => {
    expect(trailingGoal('/goal PRD.md 기준까지 구현한다')).toBe('PRD.md 기준까지 구현한다')
  })
  test('여러 줄이어도 관리 명령만이면 무시', () => {
    expect(trailingGoal('정리했습니다.\n\n/goal\nclear')).toBeNull()
    expect(trailingGoal('정리했습니다.\n\n/goal status')).toBeNull()
  })
  test('앞 문단에만 /goal이 있으면 무시', () => {
    expect(trailingGoal('예시:\n/goal PLAN.md를 구현한다\n\n위처럼 쓰면 됩니다.')).toBeNull()
  })
  test('끝의 코드 펜스 안 /goal 예시는 무시', () => {
    expect(trailingGoal('예시입니다.\n\n```\n/goal PLAN.md를 구현한다\n```')).toBeNull()
    expect(trailingGoal('예시입니다.\n\n```text\n설명\n\n/goal PLAN.md를 구현한다\n```')).toBeNull()
    expect(trailingGoal('예시입니다.\n\n```text\n설명\n\n/goal PLAN.md를 구현한다')).toBeNull()
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
  test('여러 줄 /goal 문단도 이어 붙여 실행한다', async ($, on) => {
    const runs: any[] = []
    on('command.run', ($: any, e: any) => { runs.push({ command: e.command, args: e.args }); return { text: `Goal set: ${e.args}` } })
    on('turn.complete', (_: any, e: any) => ({ text: e.answer }))
    await $.turn.complete({ ...END, answer: '시작합니다.\n\n/goal PLAN.md의 M1을\n구현한다' })
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
