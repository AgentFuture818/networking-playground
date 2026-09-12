import { useEffect, useMemo, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LabFigure } from '@/components/lab/figure'
import { octetToBits, parseIPv4Octets } from '@/lib/ip'
import { cn } from '@/lib/utils'

const SRC = '192.0.2.10'
const DEFAULT_DST = '198.51.100.20'

const HOPS = [
  { id: 'src', label: 'Host A', x: 56, y: 110, table: 'source' },
  { id: 'r1', label: 'R1', x: 250, y: 60, table: '198.51.100.0/24 → east' },
  { id: 'r2', label: 'R2', x: 430, y: 60, table: '198.51.100.0/24 → eth1' },
  { id: 'dst', label: 'Host B', x: 610, y: 110, table: 'destination' },
] as const

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function PacketSendScene() {
  const [dstInput, setDstInput] = useState(DEFAULT_DST)
  const [committed, setCommitted] = useState(DEFAULT_DST)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [run, setRun] = useState(0)

  const octets = parseIPv4Octets(committed)
  const bits = octets ? octets.flatMap((o) => octetToBits(o)) : []
  const hopIndex = t < 0.02 ? 0 : t < 0.34 ? 1 : t < 0.67 ? 2 : 3
  const ttl = 64 - hopIndex

  const pkt = useMemo(() => {
    const xs = [92, 250, 430, 574]
    const ys = [110, 78, 78, 110]
    const seg = Math.min(3, hopIndex)
    const local = hopIndex === 0 ? t / 0.34 : hopIndex === 1 ? (t - 0.34) / 0.33 : hopIndex === 2 ? (t - 0.67) / 0.33 : 1
    const u = Math.max(0, Math.min(1, local))
    if (seg >= 3) return { x: xs[3]!, y: ys[3]! }
    return { x: lerp(xs[seg]!, xs[seg + 1]!, u), y: lerp(ys[seg]!, ys[seg + 1]!, u) }
  }, [hopIndex, t])

  useEffect(() => {
    if (!playing) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setT(1)
      setPlaying(false)
      return
    }
    let start: number | null = null
    let frame = 0
    const step = (now: number) => {
      if (start === null) start = now
      const p = Math.min(1, (now - start) / 4200)
      setT(p)
      if (p < 1) frame = requestAnimationFrame(step)
      else setPlaying(false)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [playing, run])

  function send() {
    const parsed = parseIPv4Octets(dstInput)
    if (!parsed) return
    setCommitted(parsed.join('.'))
    setT(0)
    setRun((n) => n + 1)
    setPlaying(true)
  }

  const invalid = parseIPv4Octets(dstInput) === null

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-1">
          <Label htmlFor="dst">destination IPv4（文件用位址 198.51.100.0/24）</Label>
          <Input
            id="dst"
            value={dstInput}
            onChange={(e) => setDstInput(e.target.value)}
            className="font-mono"
            spellCheck={false}
          />
        </div>
        <Button onClick={send} disabled={invalid}>
          傳送封包
        </Button>
      </div>
      {invalid ? (
        <Alert variant="destructive">
          <AlertDescription>
            呢個 destination 唔係合法 IPv4：要四個 octet、每個 0–255、唔好加 leading zero。
          </AlertDescription>
        </Alert>
      ) : null}
      <LabFigure caption="圖 4 · 封包沿途帶住 destination。每跳 router 只係讀呢個欄位（加 prefix lookup），TTL 減 1 再轉發。">
        <svg viewBox="0 0 680 230" className="h-auto w-full min-w-[38rem]">
          <path
            d="M92 110 H250 V78 H430 V110 H574"
            fill="none"
            stroke="oklch(0.5 0.04 250)"
            strokeWidth="2"
          />
          {HOPS.map((hop, i) => (
            <g key={hop.id}>
              <rect
                x={hop.x - 44}
                y={hop.y - 26}
                width="88"
                height="52"
                rx="8"
                className={cn(playing && hopIndex === i && 'hop-active')}
                fill="oklch(0.24 0.03 250)"
                stroke={hopIndex === i ? 'oklch(0.8 0.12 196)' : 'oklch(0.45 0.04 250)'}
              />
              <text x={hop.x} y={hop.y - 2} textAnchor="middle" fill="oklch(0.93 0.01 95)" fontSize="12">
                {hop.label}
              </text>
              <text
                x={hop.x}
                y={hop.y + 14}
                textAnchor="middle"
                fill="oklch(0.72 0.02 250)"
                fontSize="8"
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
              >
                {hop.table}
              </text>
            </g>
          ))}
          <g transform={`translate(${pkt.x - 40}, ${pkt.y - 18})`}>
            <rect width="80" height="32" rx="6" fill="oklch(0.8 0.12 196)" />
            <text
              x="40"
              y="13"
              textAnchor="middle"
              fontSize="8"
              fill="oklch(0.18 0.04 250)"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              TTL {ttl}
            </text>
            <text
              x="40"
              y="24"
              textAnchor="middle"
              fontSize="8"
              fill="oklch(0.18 0.04 250)"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              {committed}
            </text>
          </g>
        </svg>
        <div className="mt-3 px-1">
          <div className="text-muted-foreground mb-1 text-[11px]">
            而家呢跳正在核對嘅 destination bits（src {SRC} → dst {committed}）
          </div>
          <div className="flex flex-wrap gap-1">
            {bits.map((bit, i) => (
              <span
                key={i}
                className={cn('bit-cell', bit === 1 && 'on', playing && 'prefix')}
                style={{ transitionDelay: `${i * 18}ms` }}
              >
                {bit}
              </span>
            ))}
          </div>
        </div>
      </LabFigure>
    </div>
  )
}
