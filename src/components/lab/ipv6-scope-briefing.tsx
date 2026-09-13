import { LabFigure } from '@/components/lab/figure'
import { cn } from '@/lib/utils'

const STRIPS: { tag: string; bytes: string[]; hot: number[] }[] = [
  { tag: '呢條線', bytes: ['fe', '80', ...Array.from({ length: 14 }, () => '00')], hot: [0, 1] },
  { tag: '呢間屋', bytes: ['fd', '00', ...Array.from({ length: 14 }, () => '00')], hot: [0] },
  { tag: '出得街', bytes: ['20', '01', '0d', 'b8', 'ca', 'fe', ...Array.from({ length: 10 }, () => '00')], hot: [0, 1, 2, 3] },
]

export function Ipv6ScopeBriefing() {
  return (
    <LabFigure caption="三種開頭（16 byte）。fe80 = 呢條 Wi-Fi。fd = 屋企自己編（L=1）。2001:db8 = 呢個 lab 當出得街。">
      <div className="space-y-4 p-1">
        {STRIPS.map((row) => (
          <div key={row.tag} className="space-y-1">
            <p className="text-ipv6 font-mono text-xs">{row.tag}</p>
            <div className="flex flex-wrap gap-0.5">
              {row.bytes.map((b, i) => (
                <span key={i} className={cn('hex-byte', row.hot.includes(i) && 'hot', b === '00' && !row.hot.includes(i) && 'dim')}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LabFigure>
  )
}
