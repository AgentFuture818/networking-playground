import { useState } from 'react'
import { LabFigure } from '@/components/lab/figure'

const HOUSE = ['192', '168', '1', '23']
const WEB = ['1', '1', '1', '1']

export function PingStoryScene() {
  const [tryHouse, setTryHouse] = useState(false)
  const [tryWeb, setTryWeb] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">撳兩條路。冇送包掣。</p>
      <LabFigure caption="圖 · 外網朋友 ping 屋企四格 vs 公開網站四格。">
        <svg viewBox="0 0 680 250" className="h-auto w-full min-w-[36rem]">
          <rect
            x="24"
            y="18"
            width="250"
            height="214"
            rx="12"
            fill="oklch(0.22 0.03 250 / 0.6)"
            stroke="oklch(0.45 0.04 250)"
          />
          <text x="149" y="42" textAnchor="middle" fill="oklch(0.72 0.02 250)" fontSize="12">
            你家
          </text>
          <rect x="70" y="90" width="158" height="72" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="149" y="122" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="13">
            屋企電腦
          </text>
          <text x="149" y="144" textAnchor="middle" fill="oklch(0.82 0.13 82)" fontSize="11" fontFamily="ui-monospace, monospace">
            192.168.1.23
          </text>

          <rect x="500" y="28" width="150" height="64" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="575" y="56" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="13">
            外網朋友
          </text>
          <text x="575" y="76" textAnchor="middle" fill="oklch(0.72 0.02 250)" fontSize="11">
            喺街上
          </text>

          <rect x="500" y="158" width="150" height="64" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="575" y="186" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="13">
            公開網站
          </text>
          <text x="575" y="206" textAnchor="middle" fill="oklch(0.82 0.13 82)" fontSize="11" fontFamily="ui-monospace, monospace">
            1.1.1.1
          </text>

          <path
            d="M500 60 H274"
            fill="none"
            stroke={tryHouse ? 'oklch(0.65 0.18 25)' : 'oklch(0.55 0.04 250)'}
            strokeWidth="2.5"
            strokeDasharray={tryHouse ? '8 6' : undefined}
          />
          {tryHouse ? (
            <text x="360" y="52" textAnchor="middle" fill="oklch(0.72 0.14 25)" fontSize="12">
              斷
            </text>
          ) : null}
          <path
            d="M500 190 H274"
            fill="none"
            stroke={tryWeb ? 'oklch(0.72 0.14 150)' : 'oklch(0.55 0.04 250)'}
            strokeWidth="2.5"
          />
          {tryWeb ? (
            <text x="360" y="182" textAnchor="middle" fill="oklch(0.72 0.14 150)" fontSize="12">
              通
            </text>
          ) : null}
        </svg>
      </LabFigure>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setTryHouse(true)}
          className={`rounded-xl border p-4 text-left transition ${
            tryHouse ? 'border-rose-400 bg-rose-500/10' : 'border-border bg-card hover:border-rose-300'
          }`}
        >
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">路 1</p>
          <p className="mt-1 font-semibold">ping 屋企號碼</p>
          <div className="mt-3 flex justify-center gap-1">
            {HOUSE.map((octet) => (
              <span
                key={octet}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-rose-300/40 bg-background font-mono text-sm text-rose-200"
              >
                {octet}
              </span>
            ))}
          </div>
          <p className="mt-3 text-center text-sm">{tryHouse ? '唔到。' : '撳睇'}</p>
        </button>
        <button
          type="button"
          onClick={() => setTryWeb(true)}
          className={`rounded-xl border p-4 text-left transition ${
            tryWeb ? 'border-emerald-400 bg-emerald-500/10' : 'border-border bg-card hover:border-emerald-300'
          }`}
        >
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">路 2</p>
          <p className="mt-1 font-semibold">ping 公開網站</p>
          <div className="mt-3 flex justify-center gap-1">
            {WEB.map((octet) => (
              <span
                key={octet}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-300/40 bg-background font-mono text-sm text-emerald-200"
              >
                {octet}
              </span>
            ))}
          </div>
          <p className="mt-3 text-center text-sm">{tryWeb ? '到。' : '撳睇'}</p>
        </button>
      </div>
    </div>
  )
}
