import type { ReactNode } from 'react'
import { AddressNeedScene } from '@/components/animations/address-need-scene'
import { CompareScene } from '@/components/animations/compare-scene'
import { Ipv4Reader } from '@/components/animations/ipv4-reader'
import { Ipv6Scene } from '@/components/animations/ipv6-scene'
import { PacketSendScene } from '@/components/animations/packet-send'

function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-3 text-[0.95rem] leading-7">{children}</div>
}

function Term({ children }: { children: ReactNode }) {
  return <span className="font-mono text-primary">{children}</span>
}

export function LessonBody({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'why-address':
      return (
        <Prose>
          <p>
            你而家見到嘅係 packet-switched network：資料切成
            <Term> packet（封包）</Term>
            ，每包自己帶住足夠資訊，沿途嘅轉發設備先至知送去邊。
            呢層用嘅識別唔係「阿明部電腦」呢種社交標籤，而係
            <Term> network-layer address</Term>
            ——而家最常見就係 IP。
          </p>
          <p>
            類比可以停喺系統層面：郵政能夠運作，係因為每個投遞點有
            <strong> 穩定、可被轉發系統讀取</strong>
            嘅地址，而唔係信封上面畫個笑臉。IP 做緊同一類工作。類比完就要入正題：router
            睇嘅係 header 入面嘅 destination 欄位，再對住自己嘅 forwarding table 做
            <Term> longest-prefix match</Term>
            。
          </p>
          <p>
            如果 destination 空缺或者唔合法，轉發平面冇 lookup key，封包到唔到 intended
            host。下面呢個實驗把同一個 topology 走兩次：一次 header 冇地址，一次寫低
            <Term> 198.51.100.20</Term>
            。
          </p>
          <AddressNeedScene />
          <p>
            小結：IP 地址嘅第一個職責係
            <strong> 唯一（或者至少喺嗰個 scope 內唯一）噉標示一個 interface</strong>
            ，等 packet 可以 hop-by-hop 被轉發。下一節先拆 IPv4 點樣用 32 bit 寫呢個識別。
          </p>
        </Prose>
      )
    case 'read-ipv4':
      return (
        <Prose>
          <p>
            IPv4 address 係 <Term>32-bit</Term> 無號整數。人讀嘅時候拆成四個
            <Term> octet（八位元組）</Term>
            ，每個 8 bit，所以十進制範圍係 0 到 255，再用 <Term>.</Term> 接埋，叫做
            <Term> dotted decimal</Term>
            。例：<Term>192.0.2.81</Term>。
          </p>
          <p>
            講網絡範圍就會用 <Term>prefix length</Term>（字首長度），寫法
            <Term> 192.0.2.0/24</Term>
            。<Term>/24</Term> 即前 24 bit 係 network prefix，其餘 8 bit 標 host。
            呢個單元唔做完整 subnetting，但你要識得讀呢個記法，因為下一節 router 就係用 prefix 配對。
          </p>
          <Ipv4Reader />
          <p>
            實務備註：呢個 lab 要求 canonical 寫法——唔好寫 <Term>192.168.001.001</Term>
            。有啲舊 parser 會當 leading zero 係 octal。課堂同設定檔一律寫十進制、唔補零。
          </p>
        </Prose>
      )
    case 'send-packet':
      return (
        <Prose>
          <p>
            IPv4 header 前面幾個你而家要識嘅欄位：source address、destination address、同
            <Term> TTL（Time To Live）</Term>
            。TTL 每過一跳減 1，到 0 就丟，用來截斷 routing loop。
          </p>
          <p>
            中間嘅 router <strong>唔需要</strong> 讀 payload 先決定點轉。佢用 destination
            對 forwarding table 做 prefix match，揀一個出介面，改好 L2 header，再送去下一跳。
            你而家見到嘅動畫：封包由 Host A 出發，經過 R1、R2，destination bits 會喺每跳被核對一次。
          </p>
          <PacketSendScene />
          <p>
            地址用緊 RFC 5737 文件前綴（<Term>192.0.2.0/24</Term>、<Term>198.51.100.0/24</Term>
            ），避免示範時寫實網地址。下一節會解釋點解 32-bit 空間唔夠，同 IPv6 點寫。
          </p>
        </Prose>
      )
    case 'why-ipv6':
      return (
        <Prose>
          <p>
            IPv4 公網位址大約 2³² ≈ 43 億。全球 host、手提電話、雲主機一齊要 unique public
            address 就明顯唔夠。 <Term>NAT</Term> 可以共用一個公網 IPv4，但係權宜：破壞 end-to-end、
            增加狀態同故障面。IPv6 把地址擴到 <Term>128-bit</Term>，先從根本上放大位址空間。
          </p>
          <p>
            寫法係 8 個 <Term>hextet</Term>（16-bit 一組、最多四粒 hex digit），用 <Term>:</Term> 分隔。
            連續全 0 嘅組可以壓成 <Term>::</Term>，而且成個地址最多一次。常見 LAN prefix 係
            <Term> /64</Term>。link-local 由 <Term>fe80::/10</Term> 開始，只喺同一個 link 有效。
          </p>
          <Ipv6Scene />
          <p>
            你唔使背晒 2¹²⁸ 個具體數字，但要識：IPv6 唔係「長啲嘅 IPv4 加多兩個 octet」，而係另一套
            128-bit 空間同另一套文字記法。
          </p>
        </Prose>
      )
    case 'compare':
      return (
        <Prose>
          <p>
            並排嚟睇：IPv4 32-bit、dotted decimal、耗盡後靠 NAT 續命；IPv6 128-bit、colon-hex、
            設計上希望還原 end-to-end。兩者 <strong>唔係</strong> 同一個 header 入面可以隨便混寫成一個地址。
          </p>
          <p>
            過渡期主流係 <Term>dual-stack（雙棧）</Term>
            ：同一部主機、同一個 interface 同時設定 IPv4 同 IPv6。送去 IPv4 目的地就行 IPv4
            路徑，送去 IPv6 目的地就行 IPv6。作業系統仲可能用 Happy Eyeballs 決定邊條連線先。
            另外你會見到 <Term>::ffff:192.0.2.1</Term> 呢種 IPv4-mapped IPv6，用嚟喺 IPv6 API 表達 IPv4 端點。
          </p>
          <CompareScene />
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="px-3 py-2 font-medium">項目</th>
                  <th className="px-3 py-2 font-medium">IPv4</th>
                  <th className="px-3 py-2 font-medium">IPv6</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2">長度</td>
                  <td className="px-3 py-2 font-mono">32-bit</td>
                  <td className="px-3 py-2 font-mono">128-bit</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">文字記法</td>
                  <td className="px-3 py-2">dotted decimal（4 octet）</td>
                  <td className="px-3 py-2">colon-hex（8 hextet，可 ::）</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">典型 LAN prefix</td>
                  <td className="px-3 py-2 font-mono">/24 好常見</td>
                  <td className="px-3 py-2 font-mono">/64</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">loopback</td>
                  <td className="px-3 py-2 font-mono">127.0.0.1</td>
                  <td className="px-3 py-2 font-mono">::1</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">文件用前綴</td>
                  <td className="px-3 py-2 font-mono">192.0.2.0/24 等</td>
                  <td className="px-3 py-2 font-mono">2001:db8::/32</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            下一節兩項練習會考你分類同修正。答錯會即時講規則，唔係淨係打個叉。
          </p>
        </Prose>
      )
    default:
      return <p>搵唔到呢節內容。</p>
  }
}
