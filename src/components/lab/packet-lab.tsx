import { useEffect, useMemo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LabFigure } from '@/components/lab/figure'
import { LAB_NODES, LAB_PRESETS, ROUTER_WAN_V4, simulateSend, type LabNode } from '@/lib/net-sim'
import { octetToBits, parseIPv4Octets } from '@/lib/ip'
import { packetBoxSize } from '@/lib/packet-label'
import { cn } from '@/lib/utils'

export type AddressLayer = 'v4' | 'v6'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function positionAlong(ids: string[], t: number): { x: number; y: number } {
  if (ids.length === 0) return { x: 0, y: 0 }
  const pts = ids.map((id) => {
    const n = LAB_NODES.find((x) => x.id === id)!
    return { x: n.x, y: n.y }
  })
  if (pts.length === 1) return pts[0]!
  const scaled = t * (pts.length - 1)
  const i = Math.min(pts.length - 2, Math.floor(scaled))
  const u = scaled - i
  const a = pts[i]!
  const b = pts[i + 1]!
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) }
}

function AddrLine({ node, layer }: { node: LabNode; layer: AddressLayer }) {
  return (
    <div className="font-mono text-[9px] leading-[1.15] break-all">
      {node.v4 ? <div className="text-ipv4">{node.v4}</div> : null}
      {node.kind === 'router' ? <div className="text-ipv4">WAN {ROUTER_WAN_V4}</div> : null}
      {layer === 'v6' && node.v6Link ? <div className="text-ipv6 opacity-90">{node.v6Link}</div> : null}
      {layer === 'v6' && node.v6Ula ? <div className="text-ipv6 opacity-90">{node.v6Ula}</div> : null}
      {layer === 'v6' && node.v6Global ? <div className="text-ipv6">{node.v6Global}</div> : null}
    </div>
  )
}

function MovingPacket({
  dest,
  x,
  y,
  faded,
  ok,
}: {
  dest: string
  x: number
  y: number
  faded: boolean
  ok: boolean
}) {
  const box = packetBoxSize(dest)
  const fill = ok ? 'oklch(0.8 0.12 196)' : 'oklch(0.65 0.18 25)'
  return (
    <g transform={`translate(${x - box.width / 2}, ${y - box.height / 2})`} opacity={faded ? 0.35 : 1}>
      <rect width={box.width} height={box.height} rx="6" fill={fill} />
      <foreignObject width={box.width} height={box.height}>
        <div
          className="box-border flex h-full w-full items-center justify-center px-1.5 py-1 text-center font-mono text-[10px] leading-[1.25] break-all"
          style={{ color: 'oklch(0.18 0.04 250)' }}
        >
          {dest}
        </div>
      </foreignObject>
    </g>
  )
}

export function PacketLab({
  compactPresets,
  addressLayer = 'v4',
}: {
  compactPresets?: string[]
  addressLayer?: AddressLayer
}) {
  const presets = compactPresets
    ? LAB_PRESETS.filter((p) => compactPresets.includes(p.id))
    : LAB_PRESETS.filter((p) => (addressLayer === 'v4' ? !p.id.includes('-v6-') : true))
  const [fromId, setFromId] = useState(presets[0]?.fromId ?? 'phone')
  const [dest, setDest] = useState(presets[0]?.dest ?? '192.168.1.23')
  const [run, setRun] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)

  const result = useMemo(() => simulateSend(fromId, dest), [fromId, dest, run])
  const hops = result.hops.length ? result.hops : [fromId]
  const pkt = positionAlong(hops, playing || t > 0 ? t : 0)
  const v4 = parseIPv4Octets(dest)
  const bits = v4 ? v4.flatMap((o) => octetToBits(o)) : []

  const nodeW = addressLayer === 'v6' ? 148 : 120
  const nodeH = addressLayer === 'v6' ? 96 : 66
  const viewH = addressLayer === 'v6' ? 300 : 248

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
      const p = Math.min(1, (now - start) / 2800)
      setT(p)
      if (p < 1) frame = requestAnimationFrame(step)
      else setPlaying(false)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [playing, run])

  function send() {
    setT(0)
    setRun((n) => n + 1)
    setPlaying(true)
  }

  const arrived = t > 0.92
  const dropNow = !result.ok && arrived
  const deliverNow = result.ok && arrived
  const caption =
    addressLayer === 'v6'
      ? '圖 · 左廳、右街。盒上係前面講過嘅地址。閘道 WAN 198.51.100.50。'
      : '圖 · 左廳（192.168.1.0/24）、右街。閘道 WAN 198.51.100.50。'

  return (
    <div className="space-y-3">
      <Alert>
        <AlertTitle>呢個係模擬</AlertTitle>
        <AlertDescription>
          封包只喺你瀏覽器入面郁。呢頁<strong>唔會</strong>真係 ICMP ping 互聯網，亦抓唔到你條 LAN 嘅真實封包。想睇自己部機嘅 local 地址，用本機 Terminal：Windows <span className="font-mono">ipconfig</span>，macOS／Linux <span className="font-mono">ip addr</span>／<span className="font-mono">ifconfig</span>。
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={fromId === p.fromId && dest === p.dest ? 'default' : 'outline'}
            onClick={() => {
              setFromId(p.fromId)
              setDest(p.dest)
              setT(0)
              setPlaying(false)
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1">
          <Label>來源</Label>
          <div className="flex flex-wrap gap-1">
            {LAB_NODES.filter((n) => n.kind !== 'router').map((n) => (
              <Button
                key={n.id}
                size="sm"
                variant={fromId === n.id ? 'secondary' : 'outline'}
                onClick={() => setFromId(n.id)}
              >
                {n.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="dest">目的地地址</Label>
          <Input
            id="dest"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="font-mono"
            spellCheck={false}
          />
        </div>
        <Button onClick={send}>送出探測封包</Button>
      </div>
      <LabFigure caption={caption}>
        <svg viewBox={`0 0 680 ${viewH}`} className="h-auto w-full min-w-[36rem]">
          <rect
            x="24"
            y="18"
            width="250"
            height={viewH - 36}
            rx="12"
            fill="oklch(0.22 0.03 250 / 0.6)"
            stroke="oklch(0.45 0.04 250)"
          />
          <text x="149" y="38" textAnchor="middle" fill="oklch(0.72 0.02 250)" fontSize="11">
            你家 LAN（出唔到門嘅範圍）
          </text>
          <path d="M274 133 H306" stroke="oklch(0.55 0.04 250)" strokeWidth="2" />
          <path d="M374 133 H520" stroke="oklch(0.55 0.04 250)" strokeWidth="2" />
          {LAB_NODES.map((node) => {
            const active = hops.includes(node.id) && playing
            const destHit = deliverNow && hops[hops.length - 1] === node.id
            const dropHit = dropNow && node.id === 'router' && !result.ok
            return (
              <g key={node.id}>
                <rect
                  x={node.x - nodeW / 2}
                  y={node.y - nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  rx="8"
                  className={cn(active && 'hop-active')}
                  fill={destHit ? 'oklch(0.42 0.08 150)' : dropHit ? 'oklch(0.35 0.08 25)' : 'oklch(0.24 0.03 250)'}
                  stroke={active ? 'oklch(0.8 0.12 196)' : 'oklch(0.45 0.04 250)'}
                />
                <text x={node.x} y={node.y - nodeH / 2 + 16} textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="11">
                  {node.label}
                </text>
                <foreignObject
                  x={node.x - nodeW / 2 + 6}
                  y={node.y - nodeH / 2 + 20}
                  width={nodeW - 12}
                  height={nodeH - 26}
                >
                  <AddrLine node={node} layer={addressLayer} />
                </foreignObject>
              </g>
            )
          })}
          {(playing || t > 0) && hops.length > 0 ? (
            <MovingPacket
              dest={dest}
              x={pkt.x}
              y={pkt.y}
              faded={dropNow}
              ok={result.ok || !arrived}
            />
          ) : null}
        </svg>
        {bits.length === 32 ? (
          <div className="mt-3 px-1">
            <div className="text-muted-foreground mb-1 text-[11px]">IPv4 destination 32 bit（傳送途中逐粒亮）</div>
            <div className="flex flex-wrap gap-1">
              {bits.map((bit, i) => (
                <span
                  key={i}
                  className={cn('bit-cell', bit === 1 && (playing || t > 0) && 'on')}
                  style={{ transitionDelay: `${i * 16}ms` }}
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {bits.length !== 32 ? (
          <p className="text-muted-foreground mt-3 px-1 text-[11px] break-all">
            IPv6 目的地（完整）：{dest}
            {result.destScope !== 'invalid' ? ` · 範圍 ${result.destScope}` : ''}
          </p>
        ) : null}
      </LabFigure>
      {t > 0.05 ? (
        <Alert variant={result.ok ? 'default' : 'destructive'}>
          <AlertTitle>
            {result.ok ? '模擬結果：送到' : '模擬結果：送唔到'}
            <Badge className="ml-2" tone="muted">
              模擬
            </Badge>
          </AlertTitle>
          <AlertDescription>
            {result.reason}
            {result.natRewrite
              ? ` NAT：${result.natRewrite.from} → ${result.natRewrite.to}。`
              : ''}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
