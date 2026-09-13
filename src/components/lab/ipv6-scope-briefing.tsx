import { LabFigure } from '@/components/lab/figure'
import { cn } from '@/lib/utils'

const ZONES = [
  { tag: '呢條線', where: '呢條 Wi-Fi', sample: 'fe80::23' },
  { tag: '呢間屋', where: '屋企自己編', sample: 'fd12:3456::23' },
  { tag: '出得街', where: '街上搵到', sample: '2001:db8:cafe::23' },
] as const

const STRIPS: { tag: string; bytes: string[]; hot: number[] }[] = [
  { tag: '呢條線', bytes: ['fe', '80', ...Array.from({ length: 14 }, () => '00')], hot: [0, 1] },
  { tag: '呢間屋', bytes: ['fd', '00', ...Array.from({ length: 14 }, () => '00')], hot: [0] },
  { tag: '出得街', bytes: ['20', '01', '0d', 'b8', 'ca', 'fe', ...Array.from({ length: 10 }, () => '00')], hot: [0, 1, 2, 3] },
]

export function Ipv6ScopeBriefing() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {ZONES.map((zone) => (
          <div key={zone.tag} className="rounded-xl border border-ipv6/40 bg-ipv6/8 p-3 text-center">
            <p className="text-sm font-semibold">{zone.where}</p>
            <p className="text-muted-foreground mt-1 text-xs">{zone.tag}</p>
            <p className="text-ipv6 mt-2 font-mono text-sm break-all">{zone.sample}</p>
          </div>
        ))}
      </div>
      <LabFigure caption="圖 · 三種開頭（16 byte）。下一節先寫喺封包上。">
        <div className="space-y-4 p-1">
          {STRIPS.map((row) => (
            <div key={row.tag} className="space-y-1">
              <p className="text-ipv6 font-mono text-xs">{row.tag}</p>
              <div className="flex flex-wrap gap-0.5">
                {row.bytes.map((b, i) => (
                  <span
                    key={i}
                    className={cn('hex-byte', row.hot.includes(i) && 'hot', b === '00' && !row.hot.includes(i) && 'dim')}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LabFigure>
    </div>
  )
}
