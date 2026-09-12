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
  title: string
  blurb: string
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

export const IP_UNIT_ID = 'ip-address'
export const NETWORK_TRACK_ID = 'network'
export const OPS_TRACK_ID = 'ops'

export const ipLessons: LessonMeta[] = [
  {
    id: 'why-address',
    title: '點解主機要有 IP 地址',
    minutes: 8,
    outcome: '解釋 packet-switched network 點解需要 unique 嘅 network-layer identifier。',
  },
  {
    id: 'read-ipv4',
    title: '點樣讀 IPv4：octet 同 prefix',
    minutes: 10,
    outcome: '將 dotted decimal 對應到 32-bit，同埋讀 /prefix length。',
  },
  {
    id: 'send-packet',
    title: '用 IPv4 地址傳送封包',
    minutes: 10,
    outcome: '描述 hop-by-hop 轉發點樣讀 destination address。',
  },
  {
    id: 'why-ipv6',
    title: 'IPv6 點解出現、點樣寫',
    minutes: 10,
    outcome: '說明位址耗盡、128-bit hex 記法同 :: 壓縮。',
  },
  {
    id: 'compare',
    title: 'IPv4、IPv6 同 dual-stack',
    minutes: 8,
    outcome: '比較兩種位址，並解釋雙棧共存。',
  },
]

export const ipDrills: DrillMeta[] = [
  {
    id: 'classify',
    title: '練習：分辨位址類型',
    outcome: '即時判斷 IPv4、IPv6 定格式錯誤，並講得出規則。',
  },
  {
    id: 'assemble',
    title: '練習：砌同修正位址',
    outcome: '由 bit／hextet 還原合法地址，或者改走常見錯誤。',
  },
]

export const tracks: TrackMeta[] = [
  {
    id: NETWORK_TRACK_ID,
    title: '網絡傳送',
    blurb: '由 network layer 位址開始，睇封包點樣被標址同轉發。之後會加 header、CIDR、DNS 等單元。',
    status: 'open',
    units: [
      {
        id: IP_UNIT_ID,
        title: 'IPv4 同 IPv6 位址',
        blurb:
          '第一個實驗單元：unique address、IPv4 octet、hop-by-hop 傳送、IPv6 記法、dual-stack。',
        status: 'open',
        lessons: ipLessons,
        drills: ipDrills,
      },
      {
        id: 'packet-header',
        title: '封包結構同 header 欄位',
        blurb: 'Version、TTL／Hop Limit、protocol／next header。稍後開放。',
        status: 'soon',
        lessons: [],
        drills: [],
      },
      {
        id: 'cidr-forwarding',
        title: '子網、CIDR 同最長字首配對',
        blurb: '由 prefix 做 forwarding decision。稍後開放。',
        status: 'soon',
        lessons: [],
        drills: [],
      },
      {
        id: 'dns',
        title: 'DNS：名點樣解成位址',
        blurb: '人用名、機用 IP。稍後開放。',
        status: 'soon',
        lessons: [],
        drills: [],
      },
    ],
  },
  {
    id: OPS_TRACK_ID,
    title: '伺服器維護',
    blurb: '獨立軌道，唔會同網絡基礎課混一齊。計劃由 log、服務狀態同重啟手順開始。',
    status: 'soon',
    units: [
      {
        id: 'logs',
        title: '讀 log 同狀態',
        blurb: '稍後開放。',
        status: 'soon',
        lessons: [],
        drills: [],
      },
      {
        id: 'restart',
        title: '重啟服務同基本排查',
        blurb: '稍後開放。',
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
  return [...ipLessons.map((l) => l.id), ...ipDrills.map((d) => d.id)]
}

export function lessonPath(lessonId: string): string {
  return `/tracks/${NETWORK_TRACK_ID}/units/${IP_UNIT_ID}/lessons/${lessonId}`
}

export function drillPath(drillId: string): string {
  return `/tracks/${NETWORK_TRACK_ID}/units/${IP_UNIT_ID}/drills/${drillId}`
}

export function unitPath(): string {
  return `/tracks/${NETWORK_TRACK_ID}/units/${IP_UNIT_ID}`
}

export function nextItemPath(currentId: string): string | null {
  const sequence = [
    ...ipLessons.map((l) => ({ id: l.id, path: lessonPath(l.id) })),
    ...ipDrills.map((d) => ({ id: d.id, path: drillPath(d.id) })),
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
