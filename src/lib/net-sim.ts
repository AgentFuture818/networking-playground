import {
  addressScope,
  classifyAddress,
  expandIPv6,
  parseIPv4Octets,
  sameIPv4Prefix,
} from '@/lib/ip'

export type NodeKind = 'lan-host' | 'router' | 'wan-host'

export type LabNode = {
  id: string
  label: string
  kind: NodeKind
  x: number
  y: number
  v4?: string
  v6Ula?: string
  v6Global?: string
  v6Link?: string
}

export const LAB_NODES: LabNode[] = [
  { id: 'laptop', label: '屋企電腦', kind: 'lan-host', x: 118, y: 168, v4: '192.168.1.23', v6Ula: 'fd12:3456::23', v6Global: '2001:db8:cafe::23', v6Link: 'fe80::23' },
  { id: 'phone', label: '屋企電話', kind: 'lan-host', x: 118, y: 64, v4: '192.168.1.45', v6Ula: 'fd12:3456::45', v6Global: '2001:db8:cafe::45', v6Link: 'fe80::45' },
  { id: 'router', label: '家用閘道', kind: 'router', x: 340, y: 116, v4: '192.168.1.1', v6Ula: 'fd12:3456::1', v6Global: '2001:db8:cafe::1' },
  { id: 'friend', label: '外網朋友', kind: 'wan-host', x: 560, y: 64, v4: '203.0.113.80', v6Global: '2001:db8:f00d::80' },
  { id: 'web', label: '公開網站', kind: 'wan-host', x: 560, y: 168, v4: '198.51.100.10', v6Global: '2001:db8:aaaa::10' },
]

export const ROUTER_WAN_V4 = '198.51.100.50'

export type SimResult = {
  ok: boolean
  hops: string[]
  reason: string
  destFamily: 'v4' | 'v6' | null
  destScope: string
  natRewrite?: { from: string; to: string }
  simulated: true
}

function nodeById(id: string): LabNode | undefined {
  return LAB_NODES.find((n) => n.id === id)
}

function allAddrs(node: LabNode): string[] {
  return [node.v4, node.v6Ula, node.v6Global, node.v6Link].filter((x): x is string => Boolean(x))
}

function findDestNode(dest: string): LabNode | undefined {
  const want = dest.trim().toLowerCase()
  const wantExp = expandIPv6(want)
  return LAB_NODES.find((n) =>
    allAddrs(n).some((addr) => {
      if (addr.toLowerCase() === want) return true
      const exp = expandIPv6(addr)
      return Boolean(wantExp && exp && exp === wantExp)
    }),
  )
}

function srcAddrForFamily(node: LabNode, family: 'v4' | 'v6', destScope: string): string | null {
  if (family === 'v4') return node.v4 ?? null
  if (destScope === 'link-local') return node.v6Link ?? node.v6Ula ?? node.v6Global ?? null
  if (destScope === 'ula') return node.v6Ula ?? node.v6Global ?? null
  return node.v6Global ?? node.v6Ula ?? null
}

export function simulateSend(fromId: string, destRaw: string): SimResult {
  const dest = destRaw.trim()
  const src = nodeById(fromId)
  const kind = classifyAddress(dest)
  if (!src) {
    return { ok: false, hops: [], reason: '搵唔到來源主機。', destFamily: null, destScope: 'invalid', simulated: true }
  }
  if (kind === 'invalid') {
    return {
      ok: false,
      hops: [src.id],
      reason: '目的地唔係合法 IPv4 或者 IPv6，封包未出發。',
      destFamily: null,
      destScope: 'invalid',
      simulated: true,
    }
  }

  const family = kind === 'ipv4' ? 'v4' : 'v6'
  const scope = addressScope(dest)
  const srcAddr = srcAddrForFamily(src, family, scope)
  if (!srcAddr) {
    return {
      ok: false,
      hops: [src.id],
      reason: `來源主機冇 ${family === 'v4' ? 'IPv4' : 'IPv6'} 地址，送唔出。`,
      destFamily: family,
      destScope: scope,
      simulated: true,
    }
  }

  const destNode = findDestNode(dest)

  if (family === 'v4') {
    const srcOct = parseIPv4Octets(srcAddr)
    const dstOct = parseIPv4Octets(dest)
    if (!srcOct || !dstOct) {
      return { ok: false, hops: [src.id], reason: 'IPv4 解析失敗。', destFamily: 'v4', destScope: scope, simulated: true }
    }

    if (src.kind === 'lan-host' && destNode?.kind === 'lan-host' && sameIPv4Prefix(srcOct, dstOct, 24)) {
      return {
        ok: true,
        hops: [src.id, destNode.id],
        reason: '同一條屋企 LAN（192.168.1.0/24）。探測封包送到另一部屋企機。',
        destFamily: 'v4',
        destScope: scope,
        simulated: true,
      }
    }

    if (src.kind === 'lan-host' && destNode?.id === 'router' && dest === '192.168.1.1') {
      return {
        ok: true,
        hops: [src.id, 'router'],
        reason: '送到家用閘道嘅 LAN 口。',
        destFamily: 'v4',
        destScope: scope,
        simulated: true,
      }
    }

    if (src.kind === 'lan-host' && scope === 'global') {
      const hops = destNode ? [src.id, 'router', destNode.id] : [src.id, 'router']
      if (!destNode) {
        return {
          ok: false,
          hops,
          reason: '出到閘道之後，呢個模擬入面冇呢部公網主機。地址形態係 global，但實驗場淨係擺咗網站同朋友。',
          destFamily: 'v4',
          destScope: scope,
          natRewrite: { from: srcAddr, to: ROUTER_WAN_V4 },
          simulated: true,
        }
      }
      return {
        ok: true,
        hops,
        reason: '屋企機出街：閘道做 NAT，來源由私網地址改成 WAN 公網地址，然後送到目的地。',
        destFamily: 'v4',
        destScope: scope,
        natRewrite: { from: srcAddr, to: ROUTER_WAN_V4 },
        simulated: true,
      }
    }

    if (src.kind === 'wan-host' && (scope === 'private' || scope === 'loopback' || scope === 'link-local')) {
      return {
        ok: false,
        hops: [src.id, 'router'],
        reason: '外網朋友送到 192.168.x／私網地址：閘道唔會把你家 LAN 公告出去。地址唔係假，只係出唔到你家門。',
        destFamily: 'v4',
        destScope: scope,
        simulated: true,
      }
    }

    if (src.kind === 'wan-host' && destNode?.kind === 'wan-host') {
      return {
        ok: true,
        hops: [src.id, destNode.id],
        reason: '兩個都係公網可達嘅地址，探測封包送到。',
        destFamily: 'v4',
        destScope: scope,
        simulated: true,
      }
    }

    if (src.kind === 'wan-host' && dest === ROUTER_WAN_V4) {
      return {
        ok: true,
        hops: [src.id, 'router'],
        reason: '送到你家閘道嘅 WAN 口。呢個唔等於入到 192.168.1.23。',
        destFamily: 'v4',
        destScope: 'global',
        simulated: true,
      }
    }

    return {
      ok: false,
      hops: [src.id],
      reason: '呢條路徑喺呢個模擬入面冇定義。試下用預設場景：室友、外網朋友、網站。',
      destFamily: 'v4',
      destScope: scope,
      simulated: true,
    }
  }

  // IPv6
  if (scope === 'link-local') {
    if (src.kind === 'lan-host' && destNode?.kind === 'lan-host') {
      return {
        ok: true,
        hops: [src.id, destNode.id],
        reason: 'fe80::/10 link-local 只喺同一條 link 有效。屋企兩部機互送到；外網朋友根本冇呢條路。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
    return {
      ok: false,
      hops: [src.id],
      reason: 'link-local 出唔到呢條 link。外網朋友用 fe80 搵你，一定唔得。',
      destFamily: 'v6',
      destScope: scope,
      simulated: true,
    }
  }

  if (scope === 'ula') {
    if (src.kind === 'lan-host' && destNode?.kind === 'lan-host') {
      return {
        ok: true,
        hops: [src.id, destNode.id],
        reason: 'ULA（fd00::/8）好似 IPv4 私網：屋企入面用得，預設唔喺公網路由。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
    if (src.kind === 'wan-host') {
      return {
        ok: false,
        hops: [src.id, 'router'],
        reason: '朋友喺外網送去 ULA：互聯網唔會幫你送到你家 fd12:3456::/64。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
  }

  if (scope === 'global') {
    if (src.kind === 'lan-host' && destNode?.kind === 'lan-host') {
      return {
        ok: true,
        hops: [src.id, destNode.id],
        reason: '兩部屋企機都有 global IPv6 時，同一條 LAN 都可以用 2001:db8:cafe::/64 互送。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
    if (src.kind === 'lan-host' && destNode?.kind === 'wan-host') {
      return {
        ok: true,
        hops: [src.id, 'router', destNode.id],
        reason: 'IPv6 global 出街通常唔使 NAT：來源仍然係你嘅 global 地址。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
    if (src.kind === 'wan-host' && destNode?.kind === 'lan-host' && destNode.v6Global && expandIPv6(dest) === expandIPv6(destNode.v6Global)) {
      return {
        ok: true,
        hops: [src.id, 'router', destNode.id],
        reason: '朋友送去你嘅 global IPv6：閘道把封包轉入 LAN。對照 IPv4 私網，呢條路先至「出得街」。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
    if (src.kind === 'wan-host' && destNode?.kind === 'wan-host') {
      return {
        ok: true,
        hops: [src.id, destNode.id],
        reason: '兩個 global IPv6 端點互送到。',
        destFamily: 'v6',
        destScope: scope,
        simulated: true,
      }
    }
  }

  return {
    ok: false,
    hops: [src.id],
    reason: '呢條 IPv6 路徑喺呢個模擬入面冇定義。',
    destFamily: 'v6',
    destScope: scope,
    simulated: true,
  }
}

export type Preset = { id: string; label: string; fromId: string; dest: string }

export const LAB_PRESETS: Preset[] = [
  { id: 'roommate-v4', label: '室友 → 192.168.1.23', fromId: 'phone', dest: '192.168.1.23' },
  { id: 'friend-v4-private', label: '外網朋友 → 192.168.1.23', fromId: 'friend', dest: '192.168.1.23' },
  { id: 'friend-v4-web', label: '外網朋友 → 網站 IPv4', fromId: 'friend', dest: '198.51.100.10' },
  { id: 'home-v4-web', label: '屋企電腦 → 網站 IPv4', fromId: 'laptop', dest: '198.51.100.10' },
  { id: 'friend-v6-ula', label: '外網朋友 → ULA', fromId: 'friend', dest: 'fd12:3456::23' },
  { id: 'friend-v6-global', label: '外網朋友 → global IPv6', fromId: 'friend', dest: '2001:db8:cafe::23' },
  { id: 'roommate-v6-ula', label: '室友 → ULA', fromId: 'phone', dest: 'fd12:3456::23' },
]
