import { PedagogyFrame } from '@/components/lab/lesson-frame'
import { PacketLab } from '@/components/lab/packet-lab'
import { Rfc1918Briefing } from '@/components/lab/rfc1918-briefing'
import { Ipv6WriteGate, Ipv6AfterWrite } from '@/components/lab/ipv6-write-gate'
import { Ipv6WriteLab } from '@/components/animations/ipv6-write-lab'
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
    case 'v6-write':
      return (
        <PedagogyFrame
          problem={
            <p>
              IPv6 係 16 個 byte。螢幕成日寫短嘅：<span className="font-mono text-ipv6">fe80::23</span>
              。點還原成 8 組？點解屋企內部常見 <span className="font-mono">fd</span>？
            </p>
          }
          usecase={
            <p>
              Wi-Fi 詳情抄到 <span className="font-mono">fe80::23</span>
              。兩個 <span className="font-mono">::</span> 並排就唔合法——試下就知。
            </p>
          }
          lab={<Ipv6WriteLab />}
          terms={
            <p>
              8 組 × 2 byte。<span className="font-mono">::</span> 只得一個洞。自己編：L=1 → 第一個 byte{' '}
              <span className="font-mono text-ipv6">fd</span>。
            </p>
          }
        />
      )
    case 'lan-lab':
      return (
        <PedagogyFrame
          problem={
            <p>IPv4 私人範圍之外，IPv6 都有「呢條線 / 呢間屋 / 出得街」。抄錯開頭，外網朋友一樣 ping 唔到。</p>
          }
          usecase={
            <p>
              室友同一條 router 互傳得。外網朋友抄 192.168 唔得。IPv6 抄 <span className="font-mono">fe80</span> 或者{' '}
              <span className="font-mono">fd</span> 開頭，通常都出唔到門。
            </p>
          }
          lab={
            <Ipv6WriteGate>
              <Ipv6AfterWrite>
                <PacketLab addressLayer="v6" />
              </Ipv6AfterWrite>
            </Ipv6WriteGate>
          }
          terms={
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="font-mono text-ipv4">192.168.1.23</span> — RFC 1918。出街先 NAT。
              </li>
              <li>
                <span className="font-mono text-ipv6">fe80::23</span> — 呢條線。
              </li>
              <li>
                <span className="font-mono text-ipv6">fd12:3456::23</span> — L=1 自己編。似 RFC 1918，唔係 fe80。
              </li>
              <li>
                <span className="font-mono text-ipv6">2001:db8:cafe::23</span> — 出得街（文件用）。
              </li>
            </ul>
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
