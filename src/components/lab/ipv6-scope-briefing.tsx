import { LabFigure } from '@/components/lab/figure'

export function Ipv6ScopeBriefing() {
  return (
    <div className="space-y-3">
      <p>
        IPv6 唔止「長啲嘅 IP」。有啲號碼只喺<strong>呢條網線</strong>有效；有啲只喺<strong>呢間屋／呢間公司</strong>
        內部用；有啲先至係<strong>全世界送得到</strong>。抄錯一種俾外網朋友，結果同抄 192.168 一樣：ping 唔到。
      </p>
      <p>
        日常：部手機 Wi-Fi 詳情成日見到 <span className="font-mono text-ipv6">fe80:</span> 開頭。呢串只喺而家連住嗰條 link 有用，出到門口就冇人識路。屋企有時仲會自己編一串內部 IPv6；ISP 先至會再俾一串出得街嘅。
      </p>
      <LabFigure caption="圖 · 三種 IPv6 範圍。中間嗰種好似 IPv4 私人地址，但唔等於左邊嗰種「只喺呢條線」。">
        <div className="grid gap-3 p-1 lg:grid-cols-3">
          <div className="rounded-lg border border-ipv6/35 bg-ipv6/8 p-3">
            <p className="text-xs font-semibold tracking-wider text-ipv6 uppercase">只喺呢條線</p>
            <p className="mt-1 font-mono text-sm text-ipv6">fe80::/10</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              同一條 Wi-Fi／網線上面嘅機互認得到。外網朋友用呢個搵你，一定唔得。安名：<strong>link-local</strong>
              。
            </p>
          </div>
          <div className="rounded-lg border border-ipv6/35 bg-ipv6/8 p-3">
            <p className="text-xs font-semibold tracking-wider text-ipv6 uppercase">呢間屋內部</p>
            <p className="mt-1 font-mono text-sm text-ipv6">fc00::/7</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              角色接近 IPv4 嗰三塊私人範圍：內部用、預設唔喺公網路由。規格寫 <span className="font-mono">fc00::/7</span>
              ，而家實際派發常見 <span className="font-mono">fd00::/8</span>
              。安名：<strong>ULA</strong>（Unique Local Address）。佢<strong>唔係</strong> link-local——範圍係「呢個場地」，唔係「呢條線」。
            </p>
          </div>
          <div className="rounded-lg border border-cyan-400/35 bg-cyan-400/8 p-3">
            <p className="text-xs font-semibold tracking-wider text-cyan-200 uppercase">出得街</p>
            <p className="mt-1 font-mono text-sm text-cyan-200">2001:db8:cafe::/64</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              文件用嘅 <strong>global</strong> IPv6。呢個 lab 入面，外網朋友送到呢個，閘道可以轉入 LAN，通常唔使 NAT。
            </p>
          </div>
        </div>
      </LabFigure>
      <p>
        記對照：ULA ≈ IPv6 嘅「RFC 1918 近親」；<span className="font-mono">fe80::/10</span> 係另一種更窄嘅本地。下面封包場先至會寫出
        <span className="font-mono"> fd12:3456::23</span> 同 <span className="font-mono">fe80::23</span>。
      </p>
    </div>
  )
}
