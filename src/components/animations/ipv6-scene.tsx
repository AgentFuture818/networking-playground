import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LabFigure } from '@/components/lab/figure'
import { compressIPv6, expandIPv6 } from '@/lib/ip'
import { cn } from '@/lib/utils'

const FULL = '2001:0db8:0000:0000:0000:0000:0000:0001'
const POOL_MAX = 100

export function Ipv6Scene() {
  const [pool, setPool] = useState(38)
  const [lit, setLit] = useState(0)
  const [showCompress, setShowCompress] = useState(false)

  const groups = FULL.split(':')
  const expanded = expandIPv6('2001:db8::1')
  const compressed = compressIPv6(FULL)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setPool(4)
      setLit(8)
      return
    }
    const id = window.setInterval(() => {
      setPool((n) => Math.max(4, n - 1))
    }, 120)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    if (lit >= 8) return
    const id = window.setTimeout(() => setLit((n) => n + 1), 220)
    return () => window.clearTimeout(id)
  }, [lit])

  const remainingLabel = useMemo(() => {
    if (pool > 20) return 'IPv4 公網位址池：仍然有，但分配好緊張'
    if (pool > 8) return 'IPv4 公網位址池：接近耗盡（exhaustion）'
    return 'IPv4 公網位址池：耗盡 → NAT 只係權宜，唔係根治'
  }, [pool])

  return (
    <div className="space-y-3">
      <LabFigure caption="圖 5 · IPv4 得 2³² ≈ 43 億個位址。IPv6 用 128-bit，通常寫成 8 個 hextet（每個 16-bit）。">
        <div className="space-y-5 p-2">
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-ipv4">{remainingLabel}</span>
              <span className="font-mono text-ipv4">{pool}%</span>
            </div>
            <div className="bg-secondary h-3 overflow-hidden rounded-full">
              <div
                className="h-full bg-ipv4 transition-[width] duration-150"
                style={{ width: `${(pool / POOL_MAX) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {groups.map((g, i) => (
              <span key={i} className={cn('hextet', i < lit && 'lit', g === '0000' && 'zero')}>
                {g}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            文件用前綴 <span className="font-mono text-ipv6">2001:db8::/32</span>
            。LAN 上面好常見嘅係 <span className="font-mono">/64</span> prefix：前 64 bit
            標網絡，後 64 bit 標 interface。
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setShowCompress((v) => !v)}>
              {showCompress ? '睇返完整 8 組' : '做 :: 壓縮'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setLit(0)
                setPool(38)
                setShowCompress(false)
              }}
            >
              重播位元組點亮
            </Button>
          </div>
          {showCompress ? (
            <p className="font-mono text-sm text-ipv6">
              {expanded} → {compressed}
              <span className="text-muted-foreground mt-1 block font-sans">
                規則：連續最多嗰段 0 先可以壓成 ::，而且成個地址最多一次。開頭嘅 hextet 可以刪 leading zero，但唔可以刪到變成空（要用 0）。
              </span>
            </p>
          ) : null}
        </div>
      </LabFigure>
    </div>
  )
}
