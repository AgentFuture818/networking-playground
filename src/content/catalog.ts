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
    outcome: '用「朋友 ping 唔到 192.168.1.23」呢個問題，再問點解屋企唔使每部機都有公網號碼。',
  },
  {
    id: 'v6-write',
    title: 'IPv6 點寫：16 個 byte',
    minutes: 8,
    outcome: '用圖：4 byte vs 16 byte、點解 fd、fe80::23 展開、:: 只可以一個洞。',
  },
  {
    id: 'lan-lab',
    title: '虛擬 lab：屋企互傳到、出面傳唔入',
    minutes: 12,
    outcome: '親手送封包，睇屋企互傳到、出面傳唔入；IPv6 內部同出街唔同路。',
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
    id: 'dns',
    number: 2,
    title: '人記名、機記號：DNS',
    problem: '你唔會記一串 IP。你打 google.com，部機仍然要有個地址先送得出。',
    usecase:
      '網址列每個字都係先問名。ping 一個名之前都要先問。Wi-Fi 連到但「上網無能」好多時係 DNS 問唔到，唔係「冇網」。',
    touch:
      '動畫：你部機問 resolver →（快取沒有就）root → .com → 嗰個站嘅權威伺服器 → 答案係 IP，仲有 TTL。可選 dig example.com。呢課只解決「名點變地址」。未講點揀邊個國家嗰份副本。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'ping-icmp',
    number: 3,
    title: '對方喺唔喺度？Ping 同 ICMP',
    problem: '地址填對咗，點知部機醒緊未？Ping 一個名嘅話，會用返上一課 DNS。',
    usecase: 'ping host:8080 係笑點——ICMP 冇 port。',
    touch: '虛擬 lab + 可選真 ping。瀏覽器唔可以 ICMP 出網。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'subnet-switch-router',
    number: 4,
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
    number: 5,
    title: 'broadcast / multicast：會唔會浸死網絡？',
    problem: '發現服務 vs 送去一班人。而家點解無事。',
    usecase: '',
    touch: 'hub 洪水 vs switch／IGMP。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'packet-loss',
    number: 6,
    title: 'Packet loss',
    problem: '網絡唔保證到齊。lag vs 下載唔可以爛。',
    usecase: '',
    touch: '虛擬 lab 掉包率。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'tcp-udp',
    number: 7,
    title: 'TCP vs UDP',
    problem: '掉包之後補定丟。為後面 HTTP 代同 QUIC 鋪路，呢課唔提前安 HTTP/3。',
    usecase: '網頁 vs 實況。Ping 都唔係 TCP。',
    touch: '同一條丟包線兩邊對照。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'http-port',
    number: 8,
    title: 'HTTP 係咩、點解有時見到 port',
    problem: '部機上面唔止一個服務；瀏覽器要同「網頁呢個服務」用大家識嘅問法。',
    usecase: '手打 GET / HTTP/1.1。https://example.com 冇寫門號 vs :8080。',
    touch: '扮 lab 手打；可選 nc example.com 80。呢課講「問法 + 門號」。下一課先講 1／2／3；加密（TLS）再之後。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'http-generations',
    number: 9,
    title: 'HTTP/1 → 2 → 3：每一代救緊一個唔同嘅痛',
    problem:
      '同一個新聞站：HTML + 幾十張圖 + CSS + 字體。唔好一排三個縮寫，而係每一代救緊一個唔同嘅痛。',
    usecase:
      '同一頁貫穿。HTTP/1.0：每張圖一條新連線，握手貴到荒謬。HTTP/1.1：連線可以留住，但一條線上要排隊，唯有開好多條並行。HTTP/2：一條 TCP 入面多條 stream（multiplex），header 壓縮；但呢一條 TCP 掉一個包，所有 stream 一齊停（傳輸層 head-of-line）。HTTP/3：HTTP 改行 QUIC，QUIC 行 UDP——唔係冇傳輸層；一條 stream 掉包唔擋第二條。',
    touch: '同一個「新聞頁」三個 lab 並排計時間／卡關；可選真站 DevTools 對 http/1.1、h2、h3。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'tls-https',
    number: 10,
    title: '路上有人睇：人人講 SSL，而家其實係 TLS',
    problem: 'HTTP 係明信片。Cafe Wi-Fi、ISP 可以睇到你密碼、仲可以改內容。',
    usecase:
      'http://neverssl.com vs 鎖匙圖示。badssl.com 證書玩壞會點。SSL 係 1990 年代 Netscape 嘅 Secure Sockets Layer，SSL 2／3 已經破、停用。TLS 係 IETF 接手之後嘅後繼（而家日常 TLS 1.2／1.3）。阿婆仲講「SSL 證書」，實際用緊 TLS。HTTPS = HTTP 行喺 TLS 上面。證書唔止加密，仲要認人（連去真係 bank.com，唔係咖啡店冒認）。',
    touch: '明信片 vs 信封動畫；假證書／過期證書；可選 neverssl／badssl。唔好一開波學 SSL 點 handshake。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'webrtc',
    number: 11,
    title: 'WebRTC',
    problem: '視訊要低延遲雙向，普通「問一次等一次」嘅 HTTP 唔夠。',
    usecase: '視訊通話、畫面分享。',
    touch: '兩個分頁真實 WebRTC。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'telnet-nc',
    number: 12,
    title: '手打協議：telnet／nc 去 port',
    problem: '呢個 port 有冇人聽、講緊邊種語言。Ping 答唔到。',
    usecase: 'telnet host 25／而家 nc host 80。用嚟 debug 係因為佢只係一條裸 TCP 喉。',
    touch: '假 SMTP／HTTP 對話。真公共 MX 唔玩。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'ssh',
    number: 13,
    title: 'SSH',
    problem: '登入部機唔可以明文。Debug 用裸 TCP、登入用 SSH，唔矛盾。',
    usecase: '管 server。SSH 加密 + 認證；port 22。',
    touch: '扮 lab 對照明文 telnet 登入 vs SSH；可選 ssh -T git@github.com 睇 banner。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'cdn',
    number: 14,
    title: 'CDN：遠同 origin 捱死',
    problem:
      '部 origin 喺一個國家。香港同巴西都去嗰度：慢（光速 + 好多跳）同埋所有人打爆同一部。',
    usecase:
      '全世界下載同一個 JS 庫、同一張 logo。解法先講 cache 副本：近你嘅機房有份複本，HIT 就唔使煩 origin，MISS 先去問。Cloudflare／CloudFront／Fastly 係做呢行嘅代表。',
    touch:
      '地圖 HIT/MISS。呢課只講 cache。下一課先問香港點知去香港嗰份，而唔係去美國嗰份。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'nearby-copy',
    number: 15,
    title: '唔同國家點行近：GeoDNS、anycast、同其他答法',
    problem:
      '副本散咗全世界之後，香港部機點會連去香港附近，而唔係 Virginia？「最短」唔一定係地圖直線，而係網絡上面較近、較唔塞嗰條。',
    usecase:
      '答法 A：人人去同一個 unicast origin IP，遠嘅人永遠繞路（無 CDN 細站就係咁）。答法 B：GeoDNS 按地區答唔同 IP（resolver 位置未必係你本人；TTL 可能去錯城）。答法 C：anycast——好多機房用 BGP 宣告同一個 IP，你好似只識一個地址，後面其實好多道門。答法 D：應用層自己量度再跳／GSLB。仲有：DNS anycast + 內容仍然係地區 unicast。',
    touch:
      '同一香港用戶，四種答法並排：unicast origin vs GeoDNS「問完名先話你去邊」vs anycast「地址相同、路由送你入近門」vs 應用層自己揀。要見到同一 IP、好多個入口。',
    status: 'soon',
    lessons: [],
    drills: [],
  },
  {
    id: 'warp',
    number: 16,
    title: 'WARP 唔係 CDN',
    problem: '想一出家門就加密、借人哋骨幹；你 visit 緊嘅站唔一定有 cache。',
    usecase:
      '1.1.1.1 WARP app。以前多 WireGuard；而家新裝以 MASQUE（HTTP/3／QUIC 隧道）為主。同單元 14「把檔案 cache 近你」唔同題：WARP 係部機 overlay 入 Cloudflare 張網再出街。',
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
  touch:
    'IPv4 點睇、IPv6 點解出現、local vs global（私網地址唔係假，係出唔到你家門）。虛擬 lab：兩部屋企機互傳到，外網朋友傳唔入。',
  status: 'open',
  lessons: unit1Lessons,
  drills: unit1Drills,
}

export const tracks: TrackMeta[] = [
  {
    id: NETWORK_TRACK_ID,
    title: '網絡傳送',
    blurb:
      '由「點樣搵到對方」開始。地圖一次過睇晒十六格；而家只解鎖單元 1。扮 lab 係主菜，公開資源之後先做白名單。',
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
