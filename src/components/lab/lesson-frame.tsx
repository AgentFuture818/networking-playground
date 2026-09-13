import type { ReactNode } from 'react'

export function PedagogyFrame({
  problem,
  usecase,
  teach,
  lab,
}: {
  problem: ReactNode
  usecase: ReactNode
  teach?: ReactNode
  lab?: ReactNode
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">問題</p>
        <div className="space-y-3 text-[0.95rem] leading-7">{problem}</div>
      </section>
      <section className="space-y-2">
        <p className="text-ipv4 text-xs font-semibold tracking-wider uppercase">日常</p>
        <div className="space-y-3 text-[0.95rem] leading-7">{usecase}</div>
      </section>
      {teach ? (
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-amber-200 uppercase">講解</p>
          {teach}
        </section>
      ) : null}
      {lab ? (
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-cyan-300 uppercase">先至玩</p>
          {lab}
        </section>
      ) : null}
    </div>
  )
}
