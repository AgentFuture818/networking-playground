import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LabFigure } from '@/components/lab/figure'
import { cn } from '@/lib/utils'

type Stack = 'v4' | 'v6'

export function CompareScene() {
  const [stack, setStack] = useState<Stack>('v4')
  const [sent, setSent] = useState(false)

  const dest = stack === 'v4' ? '192.0.2.80' : '2001:db8::80'

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={stack === 'v4' ? 'default' : 'outline'}
          onClick={() => {
            setStack('v4')
            setSent(false)
          }}
        >
          目的地 IPv4
        </Button>
        <Button
          size="sm"
          variant={stack === 'v6' ? 'default' : 'outline'}
          onClick={() => {
            setStack('v6')
            setSent(false)
          }}
        >
          目的地 IPv6
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setSent(true)}>
          由 dual-stack 主機送出
        </Button>
      </div>
      <LabFigure caption="圖 6 · dual-stack（雙棧）即係同一部主機同時擁有 IPv4 同 IPv6 位址。送去邊個棧，取決於 destination 用邊種地址（同 Happy Eyeballs 等政策）。">
        <svg viewBox="0 0 680 250" className="h-auto w-full min-w-[38rem]">
          <rect x="20" y="70" width="170" height="120" rx="10" fill="oklch(0.24 0.03 250)" stroke="oklch(0.5 0.04 250)" />
          <text x="105" y="96" textAnchor="middle" fill="oklch(0.93 0.01 95)" fontSize="13">
            dual-stack host
          </text>
          <text x="105" y="118" textAnchor="middle" fill="oklch(0.82 0.13 82)" fontSize="10" fontFamily="IBM Plex Mono, ui-monospace, monospace">
            192.0.2.10
          </text>
          <text x="105" y="136" textAnchor="middle" fill="oklch(0.76 0.14 305)" fontSize="10" fontFamily="IBM Plex Mono, ui-monospace, monospace">
            2001:db8::10
          </text>
          <text x="105" y="168" textAnchor="middle" fill="oklch(0.72 0.02 250)" fontSize="10">
            兩套獨立 internet layer
          </text>

          <path
            d="M190 100 H430"
            stroke="oklch(0.82 0.13 82)"
            strokeWidth="3"
            className={cn(sent && stack === 'v4' && 'opacity-100', !(sent && stack === 'v4') && 'opacity-30')}
          />
          <path
            d="M190 150 H430"
            stroke="oklch(0.76 0.14 305)"
            strokeWidth="3"
            className={cn(sent && stack === 'v6' && 'opacity-100', !(sent && stack === 'v6') && 'opacity-30')}
          />

          <rect
            x="430"
            y="78"
            width="160"
            height="44"
            rx="8"
            fill={stack === 'v4' && sent ? 'oklch(0.45 0.1 82)' : 'oklch(0.24 0.03 250)'}
            stroke="oklch(0.82 0.13 82)"
          />
          <text x="510" y="98" textAnchor="middle" fill="oklch(0.93 0.01 95)" fontSize="11">
            IPv4 路徑
          </text>
          <text x="510" y="114" textAnchor="middle" fill="oklch(0.82 0.13 82)" fontSize="10" fontFamily="IBM Plex Mono, ui-monospace, monospace">
            192.0.2.80
          </text>

          <rect
            x="430"
            y="138"
            width="160"
            height="44"
            rx="8"
            fill={stack === 'v6' && sent ? 'oklch(0.4 0.1 305)' : 'oklch(0.24 0.03 250)'}
            stroke="oklch(0.76 0.14 305)"
          />
          <text x="510" y="158" textAnchor="middle" fill="oklch(0.93 0.01 95)" fontSize="11">
            IPv6 路徑
          </text>
          <text x="510" y="174" textAnchor="middle" fill="oklch(0.76 0.14 305)" fontSize="10" fontFamily="IBM Plex Mono, ui-monospace, monospace">
            2001:db8::80
          </text>

          {sent ? (
            <g>
              <rect
                x={stack === 'v4' ? 300 : 300}
                y={stack === 'v4' ? 86 : 136}
                width="78"
                height="26"
                rx="6"
                fill={stack === 'v4' ? 'oklch(0.82 0.13 82)' : 'oklch(0.76 0.14 305)'}
              />
              <text
                x="339"
                y={stack === 'v4' ? 103 : 153}
                textAnchor="middle"
                fontSize="9"
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fill="oklch(0.18 0.04 250)"
              >
                {dest}
              </text>
            </g>
          ) : null}
        </svg>
      </LabFigure>
    </div>
  )
}
