import { LabFigure } from '@/components/lab/figure'

const BLOCKS = [
  {
    cidr: '10.0.0.0/8',
    everyday: '公司、學校內網好常見。一部印表機可以永遠叫 10.0.0.8，全世界好多間辦公室都可以用同一個號碼。',
  },
  {
    cidr: '172.16.0.0/12',
    everyday: '即 172.16.0.0 至 172.31.255.255。中型網絡、有啲 VPN 會用呢塊。',
  },
  {
    cidr: '192.168.0.0/16',
    everyday: '家用 router 出廠成日係 192.168.1.1。你抄俾外網朋友嗰個，好多時就係呢塊入面。',
  },
] as const

export function Rfc1918Briefing() {
  return (
    <div className="space-y-3">
      <p>
        公網 IPv4 唔夠分俾地球上每一部電話、每一部印表機。屋企同寫字樓亦<strong>唔需要</strong>
        每部機都有一個全世界獨一無二、出得街嘅號碼——印表機只要廳入面嘅人搵到就得。
      </p>
      <p>
        日常：你屋企 router 係 192.168.1.1，鄰居屋企都係 192.168.1.1，大家唔會撞車，因為呢個號碼只喺各自屋企有效。公司可能用 10.x。朋友 ping 你抄俾佢嘅 192.168.1.23，打中嘅係<strong>佢自己條 LAN</strong>，唔係你廳。
      </p>
      <LabFigure caption="圖 · 三塊私人 IPv4。好多間屋可以同時用同一串；互聯網預設唔會把呢啲當公開目的地。">
        <div className="grid gap-3 p-1 sm:grid-cols-3">
          {BLOCKS.map((block) => (
            <div key={block.cidr} className="rounded-lg border border-ipv4/40 bg-ipv4/8 p-3">
              <p className="font-mono text-sm text-ipv4">{block.cidr}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{block.everyday}</p>
            </div>
          ))}
        </div>
      </LabFigure>
      <p>
        負責編公網地址嘅機構叫 <strong>IANA</strong>。佢哋喺 <strong>RFC 1918</strong> 劃咗上面三塊，專登留俾私人網絡，唔喺公網路由表公告。所以 10 / 172.16–31 / 192.168 唔係「假 IP」，係
        <strong>範圍（scope）出唔到你家門</strong>。呢個 lab 屋企 LAN 用 192.168.1.0/24；你稍後可以試送去 10.x 同 172.16.x，睇下係唔係同一類失敗。
      </p>
    </div>
  )
}
