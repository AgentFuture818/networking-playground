import { LabFigure } from '@/components/lab/figure'

const BLOCKS = [
  {
    cidr: '10.0.0.0/8',
    everyday: '公司、學校內網好常見。',
  },
  {
    cidr: '172.16.0.0/12',
    everyday: '172.16 至 172.31。中型網絡、有啲 VPN。',
  },
  {
    cidr: '192.168.0.0/16',
    everyday: '家用 router 出廠成日係 192.168.1.1。',
  },
] as const

export function Rfc1918Briefing() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        好多間屋可以同時用同一串。互聯網預設唔把呢啲當公開目的地。
      </p>
      <LabFigure caption="圖 · IANA RFC 1918 三塊私人 IPv4。">
        <div className="grid gap-3 p-1 sm:grid-cols-3">
          {BLOCKS.map((block) => (
            <div key={block.cidr} className="rounded-lg border border-ipv4/40 bg-ipv4/8 p-3">
              <p className="font-mono text-sm text-ipv4">{block.cidr}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{block.everyday}</p>
            </div>
          ))}
        </div>
      </LabFigure>
    </div>
  )
}
