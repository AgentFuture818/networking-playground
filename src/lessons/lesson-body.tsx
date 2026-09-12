import { PedagogyFrame } from '@/components/lab/lesson-frame'
import { PacketLab } from '@/components/lab/packet-lab'
import { Rfc1918Briefing } from '@/components/lab/rfc1918-briefing'
import { Ipv6ScopeBriefing } from '@/components/lab/ipv6-scope-briefing'
import { Ipv4Reader } from '@/components/animations/ipv4-reader'
import { Ipv6Scene } from '@/components/animations/ipv6-scene'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Link } from 'react-router-dom'
import { unitPath } from '@/content/catalog'

export function LessonBody({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'problem':
      return (
        <PedagogyFrame
          problem={
            <>
              <p>
                世界上同時有幾十億個網路介面。你要送一包資料出去，轉發設備憑咩決定「交去邊」？如果冇一個可以寫喺封包上面、沿途讀得到嘅識別，封包就只可以撞大運。
              </p>
            </>
          }
          usecase={
            <>
              <p>
                日常：你喺屋企 <span className="font-mono">ipconfig</span>／<span className="font-mono">ip addr</span> 抄到
                <span className="font-mono text-ipv4"> 192.168.1.23</span>
                ，WhatsApp 俾朋友，叫佢「ping 下我」。朋友喺另一度網絡，話 ping 唔到。你改俾一個網站 IP，佢就得。
              </p>
              <p>
                同一串「四個數字」，點解有條得、有條唔得？先唔好背格式——認人、認私人範圍，再送包。
              </p>
            </>
          }
          prep={<Rfc1918Briefing />}
          lab={
            <PacketLab
              addressLayer="v4"
              compactPresets={[
                'roommate-v4',
                'friend-v4-private',
                'friend-v4-10',
                'friend-v4-172',
                'friend-v4-web',
              ]}
            />
          }
          terms={
            <>
              <p>
                你而家摸過嘅嘢，先至安名。寫喺封包目的地嗰串，叫
                <strong> IP 地址</strong>
                。<span className="font-mono">192.168.1.23</span>、<span className="font-mono">10.0.0.8</span>、
                <span className="font-mono">172.16.1.9</span> 都係
                <strong> local／私網</strong>
                ：IANA 喺 RFC 1918 劃咗 <span className="font-mono">10.0.0.0/8</span>、
                <span className="font-mono">172.16.0.0/12</span>、
                <span className="font-mono">192.168.0.0/16</span>
                。屋企或者寫字樓入面用得，預設<strong>唔會</strong>喺公網路由。朋友喺外網用呢個號碼，閘道唔會幫你開門。
              </p>
              <p>
                網站嗰個係 <strong>global／公網</strong> 形態（呢個 lab 用文件用前綴 198.51.100.0/24，唔好當真實網站）。私網地址唔係假，係 <strong>scope</strong> 唔同：出唔到你家門。
              </p>
              <p>
                真正嘅 <span className="font-mono">ping</span> 用 ICMP，下一單元先拆。呢度只係模擬「送一包去呢個地址通唔通」。瀏覽器做唔到真 ICMP 出網。
              </p>
            </>
          }
        />
      )
    case 'lan-lab':
      return (
        <PedagogyFrame
          problem={
            <>
              <p>
                單睇 IPv4 私人範圍未夠。而家部機會同時有 IPv4 同 IPv6。IPv6 亦有「只喺呢條線」「只喺呢間屋」「出得街」三種唔同範圍——抄錯一種俾外網朋友，一樣 ping 唔到。
              </p>
            </>
          }
          usecase={
            <>
              <p>
                室友同你連同一條 router，互傳檔案得。外網朋友抄你 <span className="font-mono">ipconfig</span> 嗰個 192.168 就唔得。部機會列出多串 IPv6：有啲只喺而家呢條 Wi-Fi 有效，有啲只喺屋企內部，有啲先至全世界送得到。
              </p>
            </>
          }
          prep={<Ipv6ScopeBriefing />}
          lab={<PacketLab addressLayer="v6" />}
          terms={
            <>
              <p>
                同一部屋企電腦呢個 lab 擺咗幾種地址（你上面已經對過三種 IPv6 範圍先至見到盒上面嘅字）：
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <span className="font-mono text-ipv4">192.168.1.23</span> — IPv4 RFC 1918 私網。LAN 互傳到；外網朋友傳唔入。出街要經閘道 <strong>NAT</strong>（來源被改成 WAN 公網地址）。
                </li>
                <li>
                  <span className="font-mono text-ipv6">fe80::23</span> — <strong>link-local</strong>（<span className="font-mono">fe80::/10</span>），只喺呢條 link。
                </li>
                <li>
                  <span className="font-mono text-ipv6">fd12:3456::23</span> — IPv6 <strong>ULA</strong>（<span className="font-mono">fc00::/7</span>，常見 <span className="font-mono">fd00::/8</span>）。角色接近 RFC 1918，<strong>唔係</strong> link-local。
                </li>
                <li>
                  <span className="font-mono text-ipv6">2001:db8:cafe::23</span> — 文件用 <strong>global IPv6</strong>。朋友由外網送到呢個，閘道可以轉入 LAN，通常唔使 NAT。
                </li>
              </ul>
              <p>
                IPv6 出現，係因為公網 IPv4 位址空間唔夠；NAT 只係權宜。你而家見到嘅分別唔係「IPv6 長啲」，而係 <strong>scope</strong> 同出唔出到你家門。
              </p>
            </>
          }
        />
      )
    case 'read-after':
      return (
        <PedagogyFrame
          problem={
            <>
              <p>
                你已經用 192.168.1.23、10.0.0.8、172.16.1.9，同 2001:db8:cafe::23 送過包。而家先問：呢兩串點讀、點認邊啲 bit 係「呢個網絡」？
              </p>
            </>
          }
          usecase={
            <>
              <p>
                抄俾朋友之前，你要識認：呢個係四個 0–255 嘅 IPv4，定係 colon-hex 嘅 IPv6；係 RFC 1918 私人範圍（10／172.16–31／192.168），定係出得街嘅 global；IPv6 仲要分 fe80、ULA、global。認錯 scope，朋友就會再 ping 唔到。
              </p>
            </>
          }
          lab={
            <div className="space-y-6">
              <Ipv4Reader />
              <Ipv6Scene />
            </div>
          }
          terms={
            <>
              <p>
                先至安名：IPv4 每個 8 bit 叫 <strong>octet</strong>，四個 octet 合共 32-bit，用 dotted decimal 寫。<strong>prefix length</strong>（例如 /24）講前幾多 bit 標網絡。IPv6 係 128-bit、八個 hextet，可用 <span className="font-mono">::</span> 壓連續 0。
              </p>
              <p>
                一部機同時有 IPv4 同 IPv6，叫 <strong>dual-stack（雙棧）</strong>。送去邊個棧，取決於你寫嘅目的地係邊種地址——你喺 lab 已經試過。
              </p>
              <Alert>
                <AlertTitle>單元 2 預告（未解鎖）</AlertTitle>
                <AlertDescription>
                  你唔會記一串 IP。打 <span className="font-mono">google.com</span> 之前，部機都要先問名先至有地址送得出。Wi-Fi 連到但「上網無能」，好多時係 DNS 問唔到，唔係「冇網」。呢課只解決名 → 地址。
                  <Link to={unitPath('dns')} className="mt-1 block underline">
                    睇單元 2 地圖預告
                  </Link>
                </AlertDescription>
              </Alert>
            </>
          }
        />
      )
    default:
      return <p>搵唔到呢節內容。</p>
  }
}
