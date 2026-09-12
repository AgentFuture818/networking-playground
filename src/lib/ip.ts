export type AddressKind = 'ipv4' | 'ipv6' | 'invalid'

export type AddressScope =
  | 'private'
  | 'loopback'
  | 'link-local'
  | 'ula'
  | 'global'
  | 'invalid'

const CANON_OCTET = /^(0|[1-9]\d{0,2})$/

export function parseIPv4Octets(raw: string): number[] | null {
  const s = raw.trim()
  const parts = s.split('.')
  if (parts.length !== 4) return null
  const octets: number[] = []
  for (const part of parts) {
    if (!CANON_OCTET.test(part)) return null
    const n = Number(part)
    if (n > 255) return null
    octets.push(n)
  }
  return octets
}

export function isIPv4(raw: string): boolean {
  return parseIPv4Octets(raw) !== null
}

export function ipv4ToBits(octets: number[]): number[] {
  return octets.flatMap((octet) =>
    Array.from({ length: 8 }, (_, i) => (octet >> (7 - i)) & 1),
  )
}

export function octetToBits(octet: number): number[] {
  return Array.from({ length: 8 }, (_, i) => (octet >> (7 - i)) & 1)
}

function validHextet(group: string): boolean {
  return /^[0-9a-f]{1,4}$/.test(group)
}

function expandIpv4Tail(addr: string): string | null {
  if (!addr.includes('.')) return addr
  const match = addr.match(/^(.*:)(\d{1,3}(?:\.\d{1,3}){3})$/)
  if (!match) return null
  const octets = parseIPv4Octets(match[2])
  if (!octets) return null
  const hi = ((octets[0] << 8) | octets[1]).toString(16)
  const lo = ((octets[2] << 8) | octets[3]).toString(16)
  return `${match[1]}${hi}:${lo}`
}

function groupsOf(side: string): string[] | null {
  if (side === '') return []
  const groups = side.split(':')
  if (groups.some((g) => g === '' || !validHextet(g))) return null
  return groups
}

export function isIPv6(raw: string): boolean {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return false
  const percent = trimmed.indexOf('%')
  const bare = percent === -1 ? trimmed : trimmed.slice(0, percent)
  const zone = percent === -1 ? '' : trimmed.slice(percent + 1)
  if (percent !== -1 && !/^[0-9a-z._-]+$/.test(zone)) return false

  const converted = expandIpv4Tail(bare)
  if (converted === null) return false
  if (converted.includes('.')) return false
  if (!/^[0-9a-f:]+$/.test(converted)) return false
  if (converted.includes(':::')) return false

  const pieces = converted.split('::')
  if (pieces.length > 2) return false

  if (pieces.length === 1) {
    const groups = converted.split(':')
    return groups.length === 8 && groups.every(validHextet)
  }

  const left = groupsOf(pieces[0] ?? '')
  const right = groupsOf(pieces[1] ?? '')
  if (!left || !right) return false
  return left.length + right.length < 8
}

export function classifyAddress(raw: string): AddressKind {
  const s = raw.trim()
  if (!s) return 'invalid'
  if (isIPv4(s)) return 'ipv4'
  if (isIPv6(s)) return 'ipv6'
  return 'invalid'
}

export function compressIPv6(full: string): string | null {
  const s = full.trim().toLowerCase()
  const groups = s.split(':')
  if (groups.length !== 8 || !groups.every(validHextet)) return null
  const norm = groups.map((g) => g.replace(/^0+(?=\w)/, '') || '0')

  let bestStart = -1
  let bestLen = 0
  let i = 0
  while (i < 8) {
    if (norm[i] !== '0') {
      i += 1
      continue
    }
    let j = i
    while (j < 8 && norm[j] === '0') j += 1
    const len = j - i
    if (len > bestLen) {
      bestStart = i
      bestLen = len
    }
    i = j
  }

  if (bestLen < 2) return norm.join(':')
  const left = norm.slice(0, bestStart).join(':')
  const right = norm.slice(bestStart + bestLen).join(':')
  return `${left}::${right}`
}

export function expandIPv6(raw: string): string | null {
  const s = raw.trim().toLowerCase()
  if (!isIPv6(s)) return null
  const bare = s.split('%')[0] ?? s
  const converted = expandIpv4Tail(bare)
  if (!converted) return null
  if (!converted.includes('::')) {
    return converted
      .split(':')
      .map((g) => g.padStart(4, '0'))
      .join(':')
  }
  const [leftRaw, rightRaw] = converted.split('::')
  const left = leftRaw ? leftRaw.split(':') : []
  const right = rightRaw ? rightRaw.split(':') : []
  const missing = 8 - left.length - right.length
  const zeros = Array.from({ length: missing }, () => '0')
  return [...left, ...zeros, ...right].map((g) => g.padStart(4, '0')).join(':')
}

export function formatOctets(octets: number[]): string {
  return octets.join('.')
}

export function ipv4Scope(octets: number[]): AddressScope {
  const a = octets[0] ?? 0
  const b = octets[1] ?? 0
  if (a === 127) return 'loopback'
  if (a === 10) return 'private'
  if (a === 192 && b === 168) return 'private'
  if (a === 172 && b >= 16 && b <= 31) return 'private'
  if (a === 169 && b === 254) return 'link-local'
  return 'global'
}

function ipv6LeadingByte(expanded: string): number {
  const first = expanded.slice(0, 4)
  return Number.parseInt(first, 16)
}

export function ipv6Scope(raw: string): AddressScope {
  const expanded = expandIPv6(raw)
  if (!expanded) return 'invalid'
  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0001') return 'loopback'
  const lead = ipv6LeadingByte(expanded)
  if ((lead & 0xffc0) === 0xfe80) return 'link-local'
  if ((lead & 0xfe00) === 0xfc00) return 'ula'
  return 'global'
}

export function addressScope(raw: string): AddressScope {
  const kind = classifyAddress(raw)
  if (kind === 'ipv4') {
    const octets = parseIPv4Octets(raw)
    return octets ? ipv4Scope(octets) : 'invalid'
  }
  if (kind === 'ipv6') return ipv6Scope(raw)
  return 'invalid'
}

export function sameIPv4Prefix(a: number[], b: number[], prefixLen: number): boolean {
  const bitsA = ipv4ToBits(a)
  const bitsB = ipv4ToBits(b)
  return bitsA.slice(0, prefixLen).join('') === bitsB.slice(0, prefixLen).join('')
}
