export type ItemStatus = 'open' | 'soon'

export type LessonMeta = {
  id: string
  title: string
  minutes: number
  outcome: string
}

export type DrillMeta = {
  id: string
  title: string
  outcome: string
}

export type UnitMeta = {
  id: string
  number: number
  title: string
  problem: string
  usecase: string
  touch: string
  status: ItemStatus
  lessons: LessonMeta[]
  drills: DrillMeta[]
}

export type TrackMeta = {
  id: string
  title: string
  blurb: string
  status: ItemStatus
  units: UnitMeta[]
}

export const UNIT1_ID = 'find-host'
export const NETWORK_TRACK_ID = 'network'
export const OPS_TRACK_ID = 'ops'

export const unit1Lessons: LessonMeta[] = [
  {
    id: 'problem',
    title: '世界上咁多部機，封包交去邊？',
    minutes: 8,
    outcome: '用「朋友 ping 唔到 192.168.1.23」呢個問題，而唔係先背地址格式。',
  },
  {
    id: 'lan-lab',
    title: '虛擬 lab：屋企互傳到、出面傳唔入',
    minutes: 14,
    outcome: '親手送封包，睇 IPv4 私網、IPv6 ULA／global 邊條路通。',
  },
  {
    id: 'read-after',
    title: '先至讀：你用過嗰串 IPv4／IPv6',
    minutes: 10,
    outcome: '用過先至安名：octet、prefix、dual-stack、local vs global。',
  },
]

export const unit1Drills: DrillMeta[] = [
  {
    id: 'classify',
    title: '練習：朋友喺外網用唔用得呢個地址',
    outcome: '即時判斷 local／global、IPv4／IPv6，同埋唔合法格式。',
  },
  {
    id: 'assemble',
    title: '練習：砌一個出得街／出唔到街嘅地址',
    outcome: '由 bit 還原、修正爆 octet，同壓 IPv6。',
  },
]

export const playPolicy = {
  title: '玩法：扮 lab 係主菜',
  body: '網站入面嘅實驗預設全部係模擬。之後單元先至有可選公開白名單（httpbin、badssl、neverssl、example.com、1.1.1.1、icanhazip、Cloudflare 站睇 h3、ssh -T git@github.com）。唔會亂 telnet 人哋 MX、唔掃 port、真 SMTP 出網唔玩。瀏覽器亦做唔到真 ICMP／真 SSH 登入。',
}

export const lockedUnits: UnitMeta[] = [
  {
    id: 'ping-icmp',
    number: 2,
    title: '對方喺唔喺度？Ping 同 ICMP',
    problem: '地址填對咗，點知部機醒緊未？',
    usecase: '「ping 下先」；有人想 ping host:8080。',
    touch: 'ICMP 冇 port。虛擬 lab + 可選真 ping。瀏覽器唔可以 ICMP 出網。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'subnet-switch-router',
    number: 3,
    title: '同一條街 vs 出街：subnet、switch、router',
    problem: '唔可以全世界一條電線。',
    usecase: '屋企印表機；switch 同 router 唔同職。',
    touch: '虛擬 lab 廣播域。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'broadcast-multicast',
    number: 4,
    title: '大叫全場 vs 叫特定一班：broadcast / multicast',
    problem: '發現服務 vs 送去一班人。',
    usecase: '會唔會浸死網絡？而家點解無事？',
    touch: 'hub 洪水 vs 而家 switch／IGMP。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'packet-loss',
    number: 5,
    title: '封包會唔會唔見？Packet loss',
    problem: '網絡唔保證到齊。',
    usecase: 'lag vs 下載唔可以爛。',
    touch: '虛擬 lab 掉包率。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'tcp-udp',
    number: 6,
    title: 'TCP vs UDP：兩個唔同問題',
    problem: '掉包之後補定丟。',
    usecase: '網頁 vs 實況。Ping 都唔係 TCP。',
    touch: '同一條丟包線兩邊對照。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'http-https',
    number: 7,
    title: 'HTTP / HTTPS：網頁點講、點解有時見到 port',
    problem: '一部機好多服務，要門號；內容 tran 路上會被人睇／改。',
    usecase: 'https://example.com（暗咗 443）vs http://127.0.0.1:8080。HTTPS = HTTP + TLS，唔係另一種「完全唔同嘅網」。',
    touch: '扮 lab 手打 GET / HTTP/1.1；可選 nc example.com 80、curl、neverssl.com vs badssl.com。DevTools 睇 80/443。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'webrtc',
    number: 8,
    title: '點解通話唔行普通 HTTP：WebRTC',
    problem: '低延遲雙向，request/response 唔夠。',
    usecase: '視訊通話、畫面分享。',
    touch: '兩個分頁真實 WebRTC。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'telnet-nc',
    number: 9,
    title: '手打協議：點解人用 telnet／nc 去 port',
    problem: '呢個 port 有冇人聽？對方講緊邊種語言？Ping 答唔到。',
    usecase: 'telnet host 25／而家 nc host 80。Telnet 本體係舊、冇加密嘅遙距終端；用嚟 debug 係因為佢只係一條裸 TCP 喉，你自己打 SMTP／HTTP。TLS 就改用 openssl s_client。',
    touch: '主菜：假 SMTP（EHLO → MAIL FROM → RCPT TO → DATA）同假 HTTP，打錯即時講邊句壞。真公共 MX／真 SMTP 出網唔玩。可選真 nc example.com 80。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'ssh',
    number: 10,
    title: 'SSH：遙距操作點解唔再用 telnet 登入',
    problem: '登入部機唔可以明文。',
    usecase: '管 server。SSH 加密 + 認證；port 22。同「nc 去 80 debug」唔矛盾——debug 用裸 TCP，登入用 SSH。',
    touch: '扮 lab 對照 telnet 登入被人睇密碼 vs SSH；可選 ssh -T git@github.com 睇真 banner。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'cdn',
    number: 11,
    title: '點解遠都快：CDN（Cloudflare 做代表）',
    problem: 'origin 喺一個地方，用戶全世界；光速同 origin 負荷。',
    usecase: '靜態檔、套件、影片邊緣。CDN = 近你嘅 cache + 通常 anycast。Cloudflare 係代表，仲有 CloudFront、Fastly。',
    touch: '虛擬地圖 HIT/MISS、origin 只捱 miss。可選 DevTools 睇 CF-Cache-Status（能睇就睇，唔好依賴 CORS）。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'http3-quic',
    number: 12,
    title: '仲可以更快：唔行 TCP 嘅 QUIC／HTTP/3',
    problem: 'TCP 要握手、一條 TCP 丟包會擋住其他 HTTP 流（head-of-line）。',
    usecase: '而家瀏覽器開 Cloudflare 這類站，DevTools Protocol 欄會見到 h3。HTTP/3 = HTTP 行 QUIC，QUIC 行 UDP（唔係「冇傳輸層」，係換咗傳輸層）。0-RTT／少 RTT、多 stream 互唔擋。',
    touch: '動畫對照 TCP+TLS 幾程握手 vs QUIC；可選真站睇 h3。呢課講網頁加速；下一課先講 WARP。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'warp',
    number: 13,
    title: 'WARP 唔係 CDN',
    problem: '你條 ISP 路徑差／想一出家門就加密，想借人哋張大骨幹，但你 visitting 嘅站唔一定喺 cache。',
    usecase: '1.1.1.1 WARP app。以前多 WireGuard；而家新裝以 MASQUE（HTTP/3／QUIC 隧道）為主。同 CDN「把檔案放近你」唔同題：WARP 係部機 overlay 入 Cloudflare 張網再出街。',
    touch: '圖解 你 → 隧道 → CF edge → 目標站 vs 你 → 近你嘅 CDN cache。唔使學生裝 WARP 先過關。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
]

export const unit1: UnitMeta = {
  id: UNIT1_ID,
  number: 1,
  title: '點樣搵到對方',
  problem: '世界上咁多部機，點知封包交去邊？',
  usecase: '你俾個地址朋友，點解 192.168.1.23 佢 ping 唔到，但網站 IP 就得。',
  touch: 'IPv4 點睇、IPv6 點解出現、local vs global（私網地址唔係假，係出唔到你家門）。虛擬 lab：兩部屋企機互傳到，外網朋友傳唔入。',
  status: 'open',
  lessons: unit1Lessons,
  drills: unit1Drills,
}

export const tracks: TrackMeta[] = [
  {
    id: NETWORK_TRACK_ID,
    title: '網絡傳送',
    blurb: '由「點樣搵到對方」開始。地圖一次過睇晒十三格；而家只解鎖單元 1。扮 lab 係主菜，公開資源之後先做白名單。',
    status: 'open',
    units: [unit1, ...lockedUnits],
  },
  {
    id: OPS_TRACK_ID,
    title: '伺服器維護',
    blurb: '獨立軌道，之後先寫。而家唔同網絡課混一齊。',
    status: 'soon',
    units: [
      {
        id: 'logs',
        number: 1,
        title: '讀 log 同狀態',
        problem: '服務死咗，你點知？',
        usecase: '稍後先寫。',
        touch: '未開放。',
        status: 'soon',
        lessons: [],
        drills: [],
      },
      {
        id: 'restart',
        number: 2,
        title: '重啟服務同基本排查',
        problem: '要唔要 reboot 先？',
        usecase: '稍後先寫。',
        touch: '未開放。',
        status: 'soon',
        lessons: [],
        drills: [],
      },
    ],
  },
]

export function getTrack(trackId: string): TrackMeta | undefined {
  return tracks.find((t) => t.id === trackId)
}

export function getUnit(trackId: string, unitId: string): UnitMeta | undefined {
  return getTrack(trackId)?.units.find((u) => u.id === unitId)
}

export function getLesson(trackId: string, unitId: string, lessonId: string): LessonMeta | undefined {
  return getUnit(trackId, unitId)?.lessons.find((l) => l.id === lessonId)
}

export function getDrill(trackId: string, unitId: string, drillId: string): DrillMeta | undefined {
  return getUnit(trackId, unitId)?.drills.find((d) => d.id === drillId)
}

export function allCompletableIds(): string[] {
  return [...unit1Lessons.map((l) => l.id), ...unit1Drills.map((d) => d.id)]
}

export function lessonPath(lessonId: string): string {
  return `/tracks/${NETWORK_TRACK_ID}/units/${UNIT1_ID}/lessons/${lessonId}`
}

export function drillPath(drillId: string): string {
  return `/tracks/${NETWORK_TRACK_ID}/units/${UNIT1_ID}/drills/${drillId}`
}

export function unitPath(unitId: string = UNIT1_ID): string {
  return `/tracks/${NETWORK_TRACK_ID}/units/${unitId}`
}

export function nextItemPath(currentId: string): string | null {
  const sequence = [
    ...unit1Lessons.map((l) => ({ id: l.id, path: lessonPath(l.id) })),
    ...unit1Drills.map((d) => ({ id: d.id, path: drillPath(d.id) })),
  ]
  const idx = sequence.findIndex((item) => item.id === currentId)
  if (idx === -1 || idx === sequence.length - 1) return null
  return sequence[idx + 1]?.path ?? null
}

export const codeErrorCopy: Record<string, string> = {
  empty: '未貼任何內容。',
  format: '格式唔啱。進度碼應該似 NL1.一段字.校驗 咁。',
  checksum: '校驗碼對唔上，好可能複製漏咗、改過，或者打錯字。',
  payload: '解碼唔到內容。如果係 JSON 檔，確認檔案係呢個實驗站匯出嘅。',
  version: '認到係進度資料，但版本或者欄位唔合規格。',
  'local-storage': '讀唔到瀏覽器 localStorage 入面嘅進度（可能資料損壞）。你可以匯入進度碼覆蓋。',
  'local-storage-write': '寫唔入 localStorage。可能係私隱模式限制，或者容量滿咗。',
}
