import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LabFigure } from '@/components/lab/figure'
import { cn } from '@/lib/utils'

const V4 = ['192', '168', '1', '23']
const FE80_GROUPS = ['fe80', '0000', '0000', '0000', '0000', '0000', '0000', '0023']
const FULL_ONCE = ['fe80', '0000', '0000', '0000', '0000', '0100', '0000', '0023']
const OK_WRITE = 'fe80::0100:0000:0023'
const BAD_WRITE = 'fe80::0100::0023'

function HexByteRow({
  bytes,
  hot,
}: {
  bytes: string[]
  hot?: number[]
}) {
  const hotSet = new Set(hot ?? [])
  return (
    <div className="flex flex-wrap items-end gap-x-2 gap-y-2">
      {Array.from({ length: 8 }, (_, g) => (
        <div key={g} className="space-y-1">
          <div className="flex gap-0.5">
            {[0, 1].map((k) => {
              const i = g * 2 + k
              const b = bytes[i] ?? '00'
              return (
                <span key={i} className={cn('hex-byte', hotSet.has(i) && 'hot', b === '00' && !hotSet.has(i) && 'dim')}>
                  {b}
                </span>
              )
            })}
          </div>
          <p className="text-muted-foreground text-center font-mono text-[10px]">{g + 1}</p>
        </div>
      ))}
    </div>
  )
}

function GroupRow({
  groups,
  filled,
}: {
  groups: string[]
  filled?: number[]
}) {
  const fill = new Set(filled ?? [])
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {groups.map((g, i) => (
        <span key={i} className={cn('hex-group', fill.has(i) && 'fill', g === '0000' && !fill.has(i) && 'zero')}>
          {g}
        </span>
      ))}
    </div>
  )
}

function SizeCompare() {
  const v6Bytes = FE80_GROUPS.flatMap((g) => [g.slice(0, 2), g.slice(2, 4)])
  return (
    <LabFigure caption="IPv4 = 4 byte。IPv6 = 16 byte = 8 組 × 2 byte（每組 4 粒 hex）。">
      <div className="space-y-5 p-1">
        <div className="space-y-2">
          <p className="text-ipv4 font-mono text-sm">IPv4 · 4 byte · 每格 0–255</p>
          <div className="flex flex-wrap gap-2">
            {V4.map((n) => (
              <span key={n} className="oct-box">
                {n}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground font-mono text-xs">192.168.1.23</p>
        </div>
        <div className="space-y-2">
          <p className="text-ipv6 font-mono text-sm">IPv6 · 16 byte · 8 組</p>
          <HexByteRow bytes={v6Bytes} hot={[0, 1, 14, 15]} />
          <p className="text-muted-foreground font-mono text-xs">每兩格 = 一組 = 4 hex</p>
        </div>
      </div>
    </LabFigure>
  )
}

function FdBitStrip() {
  const [local, setLocal] = useState(true)
  const l = local ? 1 : 0
  const first = local ? 'fd' : 'fc'
  const bits = [1, 1, 1, 1, 1, 1, 0, l]
  const bytes = [first, ...Array.from({ length: 15 }, () => '00')]

  return (
    <LabFigure caption="fc00::/7：前 7 bit 鎖死。自己編就把第 8 bit（L）打開 → 第一個 byte 係 fd，唔係 fc。">
      <div className="space-y-4 p-1">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={local ? 'default' : 'outline'} onClick={() => setLocal(true)}>
            屋企自己編 L=1
          </Button>
          <Button size="sm" variant={!local ? 'secondary' : 'outline'} onClick={() => setLocal(false)}>
            L=0 → fc
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {bits.map((b, i) => (
            <span
              key={i}
              className={cn('bit-cell', b === 1 && 'on', i === 7 && 'prefix')}
              title={i === 7 ? 'L' : `bit ${7 - i}`}
            >
              {b}
            </span>
          ))}
          <span className="text-muted-foreground ml-2 font-mono text-xs">
            {i7Label(local)}
          </span>
        </div>
        <HexByteRow bytes={bytes} hot={[0]} />
        <p className="font-mono text-sm text-ipv6">
          {first}00:0000:0000:0000:0000:0000:0000:0000
        </p>
      </div>
    </LabFigure>
  )
}

function i7Label(local: boolean) {
  return local ? '11111101 = fd' : '11111100 = fc'
}

function ExpandFe80() {
  const [open, setOpen] = useState(false)
  const v6Bytes = FE80_GROUPS.flatMap((g) => [g.slice(0, 2), g.slice(2, 4)])

  return (
    <LabFigure caption="撳圖：:: 補 0000 直到 8 組。一組開頭嘅 0 可以刪（0023 → 23）。">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-accent/40 w-full space-y-3 rounded-lg p-1 text-left transition-colors"
      >
        <p className="font-mono text-sm text-ipv6">{open ? 'fe80:0000:0000:0000:0000:0000:0000:0023' : 'fe80::23'}</p>
        {open ? (
          <>
            <GroupRow groups={FE80_GROUPS} filled={[0, 7]} />
            <div className="flex flex-wrap items-center gap-2">
              <span className="hex-group zero">0023</span>
              <span className="text-muted-foreground font-mono text-xs">→</span>
              <span className="hex-group fill">23</span>
            </div>
            <HexByteRow bytes={v6Bytes} hot={[0, 1, 14, 15]} />
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="hex-group fill">fe80</span>
            <span className="hex-group fill px-3">::</span>
            <span className="hex-group fill">23</span>
            <span className="text-muted-foreground font-mono text-xs">仲欠 6 組 0000</span>
          </div>
        )}
        <p className="text-muted-foreground text-xs">{open ? '再撳 → 壓返' : '撳 → 展開 8 組'}</p>
      </button>
    </LabFigure>
  )
}

function DoubleColonTry() {
  const [pick, setPick] = useState<'idle' | 'ok' | 'bad'>('idle')

  return (
    <LabFigure caption="真身 8 組。:: 只可以一個洞。兩個洞就唔知剩餘嘅 0000 點分。">
      <div className="space-y-4 p-1">
        <GroupRow groups={FULL_ONCE} />
        <p className="text-muted-foreground font-mono text-xs">fe80:0000:0000:0000:0000:0100:0000:0023</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={pick === 'ok' ? 'default' : 'outline'} onClick={() => setPick('ok')}>
            試 {OK_WRITE}
          </Button>
          <Button
            size="sm"
            variant={pick === 'bad' ? 'destructive' : 'outline'}
            onClick={() => setPick('bad')}
          >
            試 {BAD_WRITE}
          </Button>
        </div>
        {pick === 'ok' ? (
          <div className="space-y-2">
            <GroupRow groups={FULL_ONCE} filled={[1, 2, 3, 4]} />
            <p className="font-mono text-xs text-ipv6">1 個洞 · 補 4 個 0000 · 合共 8 組</p>
          </div>
        ) : null}
        {pick === 'bad' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="hex-group fill">fe80</span>
              <div className="zero-hole">
                <span>?</span>
                <span className="text-[10px] tracking-wide">洞 A</span>
              </div>
              <span className="hex-group fill">0100</span>
              <div className="zero-hole">
                <span>?</span>
                <span className="text-[10px] tracking-wide">洞 B</span>
              </div>
              <span className="hex-group fill">0023</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {['0000', '0000', '0000', '0000', '0000'].map((z, i) => (
                <span key={i} className="hex-group zero">
                  {z}
                </span>
              ))}
            </div>
            <p className="font-mono text-xs text-destructive">寫咗 3 組 · 剩 5 個 0000 · 兩個無標籤嘅洞 · 唔知每個洞幾多</p>
          </div>
        ) : null}
      </div>
    </LabFigure>
  )
}

export function Ipv6WriteLab() {
  return (
    <div className="space-y-4">
      <SizeCompare />
      <FdBitStrip />
      <ExpandFe80 />
      <DoubleColonTry />
    </div>
  )
}
