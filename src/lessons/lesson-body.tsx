import { PedagogyFrame } from '@/components/lab/lesson-frame'
import { PacketLab } from '@/components/lab/packet-lab'
import { Rfc1918Briefing } from '@/components/lab/rfc1918-briefing'
import { Ipv6ScopeBriefing } from '@/components/lab/ipv6-scope-briefing'
import { CastIntro } from '@/components/lab/cast-intro'
import { Ipv6WriteLab } from '@/components/animations/ipv6-write-lab'
import { Ipv4Reader } from '@/components/animations/ipv4-reader'
import { PingStoryScene } from '@/components/animations/ping-story-scene'

export function LessonBody({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case 'problem':
      return (
        <PedagogyFrame
          problem={<p>朋友喺外網，ping 你抄俾佢嘅 192.168 號碼。</p>}
          usecase={<p>同一種四格數字：公開網站到，屋企號碼唔到。</p>}
          teach={<PingStoryScene />}
        />
      )
    case 'cast':
      return (
        <PedagogyFrame
          problem={<p>邊個喺廳，邊個喺街上。</p>}
          usecase={<p>之後每一節都係呢五位。唔好當佢哋全部出得街。</p>}
          teach={<CastIntro />}
        />
      )
    case 'ipv4-read':
      return (
        <PedagogyFrame
          problem={<p>四格點睇。鄰居屋企都可以叫同一個 192.168.1.1。</p>}
          usecase={<p>家用 router 出廠成日係 192.168.1.1。公司常見 10.x。</p>}
          teach={
            <div className="space-y-6">
              <Ipv4Reader />
              <Rfc1918Briefing />
            </div>
          }
        />
      )
    case 'v6-write':
      return (
        <PedagogyFrame
          problem={
            <p>
              IPv6 係 16 個 byte。螢幕成日寫短嘅：<span className="font-mono text-ipv6">fe80::23</span>。
            </p>
          }
          usecase={
            <p>
              兩個 <span className="font-mono">::</span> 並排就唔合法。屋企內部常見開頭{' '}
              <span className="font-mono">fd</span>。
            </p>
          }
          teach={<Ipv6WriteLab />}
        />
      )
    case 'v6-scope':
      return (
        <PedagogyFrame
          problem={<p>開頭唔同，去得唔同遠。</p>}
          usecase={
            <p>
              Wi-Fi 詳情抄到 <span className="font-mono">fe80</span>
              。屋企自己編常見 <span className="font-mono">fd</span>
              。下一節先寫喺封包上。
            </p>
          }
          teach={<Ipv6ScopeBriefing />}
        />
      )
    case 'lab':
      return (
        <PedagogyFrame
          problem={<p>用前面講過嘅人同地址，送一包睇通唔通。</p>}
          usecase={<p>廳入面互傳到。街上打廳入面嘅號碼，入唔到。</p>}
          lab={<PacketLab addressLayer="v6" />}
        />
      )
    default:
      return <p>搵唔到呢節內容。</p>
  }
}
