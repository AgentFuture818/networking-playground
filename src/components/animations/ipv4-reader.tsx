import { useMemo, useState } from 'react'
import { LabFigure } from '@/components/lab/figure'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { octetToBits } from '@/lib/ip'
import { cn } from '@/lib/utils'

const DEFAULT = [192, 168, 1, 23]

export function Ipv4Reader() {
  const [octets, setOctets] = useState(DEFAULT)
  const [prefix, setPrefix] = useState(24)
  const [focus, setFocus] = useState(0)

  const bits = useMemo(() => octets.flatMap((o) => octetToBits(o)), [octets])

  function update(index: number, raw: string) {
    const n = Number(raw)
    if (!Number.isInteger(n) || n < 0 || n > 255) return
    setOctets((prev) => prev.map((v, i) => (i === index ? n : v)))
  }

  return (
    <div className="space-y-4">
      <LabFigure caption="圖 · 四個 byte 四格。青色框住嘅係 prefix（網絡字首），其餘係 host。">
        <div className="space-y-4 p-2">
          <div className="grid gap-3 sm:grid-cols-4">
            {octets.map((octet, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFocus(i)}
                className={cn(
                  'rounded-lg border p-3 text-left transition-colors',
                  focus === i ? 'border-ipv4 bg-ipv4/10' : 'border-border bg-background/40',
                )}
              >
                <div className="text-muted-foreground mb-1 text-[11px]">格 {i + 1}</div>
                <div className="font-mono text-2xl text-ipv4 tabular-nums">{octet}</div>
                <div className="mt-2 flex gap-1">
                  {octetToBits(octet).map((bit, bi) => (
                    <span key={bi} className={cn('bit-cell', bit === 1 && 'on')}>
                      {bit}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-[11px]">32-bit 一排（由 MSB 開始）</div>
            <div className="flex flex-wrap gap-1">
              {bits.map((bit, i) => (
                <span
                  key={i}
                  className={cn('bit-cell', bit === 1 && 'on', i < prefix && 'prefix')}
                  title={`bit ${i}`}
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </LabFigure>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>改四格（0–255）</Label>
          <div className="grid grid-cols-4 gap-2">
            {octets.map((octet, i) => (
              <Input
                key={i}
                inputMode="numeric"
                value={String(octet)}
                onChange={(e) => update(i, e.target.value)}
                onFocus={() => setFocus(i)}
                aria-label={`格 ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            {octets.join('.')}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prefix">prefix length：/{prefix}</Label>
          <input
            id="prefix"
            type="range"
            step={1}
            min={0}
            max={32}
            value={prefix}
            onChange={(e) => setPrefix(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <p className="text-muted-foreground text-sm leading-relaxed">
            /{prefix} 即係前 {prefix} bit 標示網絡，其餘 {32 - prefix} bit 標示嗰個網絡入面嘅 host。
            例如 /24 即前三格係 network prefix。
          </p>
        </div>
      </div>
    </div>
  )
}
