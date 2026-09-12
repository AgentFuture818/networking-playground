import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LabFigure } from '@/components/lab/figure'
import { cn } from '@/lib/utils'

type Mode = 'unaddressed' | 'addressed'

const NODES = [
  { id: 'a', label: 'Host A', ip: '192.0.2.10', x: 70, y: 118 },
  { id: 'r', label: 'Router', ip: 'lookup', x: 320, y: 70 },
  { id: 'b', label: 'Host B', ip: '198.51.100.20', x: 570, y: 118 },
  { id: 'c', label: 'Host C', ip: '203.0.113.8', x: 570, y: 200 },
] as const

function pointAlong(points: { x: number; y: number }[], t: number) {
  const segs: { a: { x: number; y: number }; b: { x: number; y: number }; len: number }[] = []
  let total = 0
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]!
    const b = points[i + 1]!
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    segs.push({ a, b, len })
    total += len
  }
  let remain = t * total
  for (const seg of segs) {
    if (remain <= seg.len) {
      const u = seg.len === 0 ? 0 : remain / seg.len
      return { x: seg.a.x + (seg.b.x - seg.a.x) * u, y: seg.a.y + (seg.b.y - seg.a.y) * u }
    }
    remain -= seg.len
  }
  const last = points[points.length - 1]!
  return { x: last.x, y: last.y }
}

export function AddressNeedScene() {
  const [mode, setMode] = useState<Mode>('unaddressed')
  const [run, setRun] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)

  const path = useMemo(() => {
    if (mode === 'unaddressed') {
      return [
        { x: 108, y: 118 },
        { x: 320, y: 88 },
        { x: 430, y: 88 },
        { x: 500, y: 60 },
      ]
    }
    return [
      { x: 108, y: 118 },
      { x: 300, y: 88 },
      { x: 534, y: 118 },
    ]
  }, [mode])

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
    const duration = mode === 'unaddressed' ? 2200 : 2600
    const step = (now: number) => {
      if (start === null) start = now
      const p = Math.min(1, (now - start) / duration)
      setT(p)
      if (p < 1) frame = requestAnimationFrame(step)
      else setPlaying(false)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [playing, run, mode])

  const pkt = pointAlong(path, t)
  const atRouter = t > 0.38 && t < 0.62
  const dropped = mode === 'unaddressed' && t > 0.85
  const delivered = mode === 'addressed' && t > 0.92

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={mode === 'unaddressed' ? 'default' : 'outline'}
          onClick={() => {
            setMode('unaddressed')
            setT(0)
            setPlaying(false)
          }}
        >
          destination 空
        </Button>
        <Button
          size="sm"
          variant={mode === 'addressed' ? 'default' : 'outline'}
          onClick={() => {
            setMode('addressed')
            setT(0)
            setPlaying(false)
          }}
        >
          寫低 198.51.100.20
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setT(0)
            setRun((n) => n + 1)
            setPlaying(true)
          }}
        >
          傳送
        </Button>
      </div>
      <LabFigure
        caption={
          mode === 'unaddressed'
            ? '圖 1 · header 冇 destination 時，router 做唔到 lookup，封包喺轉發平面被丟棄。'
            : '圖 2 · destination = 198.51.100.20，router 用 prefix 198.51.100.0/24 配到去 Host B 嗰邊介面。'
        }
      >
        <svg viewBox="0 0 640 240" className="h-auto w-full min-w-[36rem]" role="img">
          <title>Hop-by-hop 轉發示意</title>
          <path d="M108 118 H300" stroke="oklch(0.55 0.04 250)" strokeWidth="2" fill="none" />
          <path d="M340 88 H534" stroke="oklch(0.55 0.04 250)" strokeWidth="2" fill="none" />
          <path d="M340 88 L534 200" stroke="oklch(0.4 0.03 250)" strokeWidth="2" fill="none" strokeDasharray="5 5" />

          {NODES.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x - 52}
                y={node.y - 28}
                width="104"
                height="56"
                rx="8"
                className={cn(
                  node.id === 'r' && atRouter && playing ? 'hop-active' : undefined,
                )}
                fill={
                  node.id === 'b' && delivered
                    ? 'oklch(0.45 0.08 150)'
                    : 'oklch(0.24 0.03 250)'
                }
                stroke={node.id === 'r' && atRouter ? 'oklch(0.8 0.12 196)' : 'oklch(0.45 0.04 250)'}
                strokeWidth="1.5"
              />
              <text x={node.x} y={node.y - 4} textAnchor="middle" fill="oklch(0.93 0.01 95)" fontSize="12">
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 14}
                textAnchor="middle"
                fill="oklch(0.82 0.13 82)"
                fontSize="10"
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
              >
                {node.ip}
              </text>
            </g>
          ))}

          <g transform={`translate(${pkt.x - 34}, ${pkt.y - 16})`} opacity={dropped ? 0.25 : 1}>
            <rect width="68" height="28" rx="6" fill="oklch(0.8 0.12 196)" />
            <text
              x="34"
              y="18"
              textAnchor="middle"
              fontSize="9"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
              fill="oklch(0.18 0.04 250)"
            >
              {mode === 'unaddressed' ? 'dst: —' : 'dst: …100.20'}
            </text>
          </g>

          {dropped ? (
            <text x="500" y="48" fill="oklch(0.7 0.16 25)" fontSize="12">
              drop（唔知送去邊）
            </text>
          ) : null}
        </svg>
      </LabFigure>
    </div>
  )
}
