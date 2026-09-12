import type { ReactNode } from 'react'

export function PedagogyFrame({
  problem,
  usecase,
  lab,
  terms,
}: {
  problem: ReactNode
  usecase: ReactNode
  lab: ReactNode
  terms: ReactNode
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">問題</p>
        <div className="space-y-3 text-[0.95rem] leading-7">{problem}</div>
      </section>
      <section className="space-y-2">
        <p className="text-ipv4 text-xs font-semibold tracking-wider uppercase">日常見到</p>
        <div className="space-y-3 text-[0.95rem] leading-7">{usecase}</div>
      </section>
      <section className="space-y-3">
        <p className="text-xs font-semibold tracking-wider text-cyan-300 uppercase">親手玩</p>
        {lab}
      </section>
      <section className="space-y-2">
        <p className="text-ipv6 text-xs font-semibold tracking-wider uppercase">先至安名</p>
        <div className="space-y-3 text-[0.95rem] leading-7">{terms}</div>
      </section>
    </div>
  )
}
