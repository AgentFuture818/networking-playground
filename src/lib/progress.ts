const STORAGE_KEY = 'netlab.progress.v1'
const CODE_PREFIX = 'NL1'

export type GameScore = {
  correct: number
  total: number
  best: number
}

export type ProgressState = {
  v: 1
  completed: string[]
  scores: Record<string, GameScore>
  lastPath: string | null
  updatedAt: number
  storageError: string | null
}

type WireV1 = {
  v: 1
  d: string[]
  s: Record<string, GameScore>
  p: string | null
  t: number
}

export function emptyProgress(): ProgressState {
  return {
    v: 1,
    completed: [],
    scores: {},
    lastPath: null,
    updatedAt: Date.now(),
    storageError: null,
  }
}

function isScore(value: unknown): value is GameScore {
  if (!value || typeof value !== 'object') return false
  const s = value as GameScore
  return (
    typeof s.correct === 'number' &&
    typeof s.total === 'number' &&
    typeof s.best === 'number'
  )
}

function normalize(input: unknown): ProgressState | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as Partial<ProgressState> & Partial<WireV1>
  const completed = raw.completed ?? raw.d
  const scores = raw.scores ?? raw.s
  const lastPath = raw.lastPath ?? raw.p ?? null
  const updatedAt = raw.updatedAt ?? raw.t
  if (!Array.isArray(completed) || completed.some((id) => typeof id !== 'string')) {
    return null
  }
  if (!scores || typeof scores !== 'object') return null
  const cleanScores: Record<string, GameScore> = {}
  for (const [key, value] of Object.entries(scores)) {
    if (isScore(value)) cleanScores[key] = value
  }
  if (lastPath !== null && typeof lastPath !== 'string') return null
  if (typeof updatedAt !== 'number') return null
  return {
    v: 1,
    completed: [...new Set(completed)],
    scores: cleanScores,
    lastPath,
    updatedAt,
    storageError: null,
  }
}

function toWire(state: ProgressState): WireV1 {
  return {
    v: 1,
    d: state.completed,
    s: state.scores,
    p: state.lastPath,
    t: state.updatedAt,
  }
}

function fnv1a(text: string): string {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36).padStart(4, '0').slice(-4)
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function base64UrlToBytes(text: string): Uint8Array | null {
  const padded = text.replaceAll('-', '+').replaceAll('_', '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  try {
    const bin = atob(padded + pad)
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i)
    return out
  } catch {
    return null
  }
}

export function encodeProgressCode(state: ProgressState): string {
  const json = JSON.stringify(toWire(state))
  const payload = bytesToBase64Url(new TextEncoder().encode(json))
  return `${CODE_PREFIX}.${payload}.${fnv1a(payload)}`
}

export type CodeError = 'empty' | 'format' | 'checksum' | 'payload' | 'version'

export type DecodeResult =
  | { ok: true; state: ProgressState }
  | { ok: false; error: CodeError }

export function decodeProgressCode(raw: string): DecodeResult {
  const text = raw.trim().replaceAll(/\s+/g, '')
  if (!text) return { ok: false, error: 'empty' }
  const parts = text.split('.')
  if (parts.length !== 3 || parts[0] !== CODE_PREFIX) {
    return { ok: false, error: 'format' }
  }
  const payload = parts[1] ?? ''
  const checksum = parts[2] ?? ''
  if (!payload || !checksum) return { ok: false, error: 'format' }
  if (fnv1a(payload) !== checksum) return { ok: false, error: 'checksum' }
  const bytes = base64UrlToBytes(payload)
  if (!bytes) return { ok: false, error: 'payload' }
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes))
    const state = normalize(parsed)
    if (!state) return { ok: false, error: 'version' }
    return { ok: true, state }
  } catch {
    return { ok: false, error: 'payload' }
  }
}

export function progressToFileJson(state: ProgressState): string {
  return `${JSON.stringify(
    {
      app: '網絡傳送實驗',
      format: 1,
      exportedAt: new Date(state.updatedAt).toISOString(),
      progress: toWire(state),
    },
    null,
    2,
  )}\n`
}

export function parseProgressFile(raw: string): DecodeResult {
  const text = raw.trim()
  if (!text) return { ok: false, error: 'empty' }
  try {
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'payload' }
    const body = parsed as { progress?: unknown; v?: unknown }
    const state = normalize(body.progress ?? parsed)
    if (!state) return { ok: false, error: 'version' }
    return { ok: true, state }
  } catch {
    return { ok: false, error: 'payload' }
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const state = normalize(JSON.parse(raw) as unknown)
    if (!state) {
      return { ...emptyProgress(), storageError: 'local-storage' }
    }
    return state
  } catch {
    return { ...emptyProgress(), storageError: 'local-storage' }
  }
}

export function saveProgress(state: ProgressState): string | null {
  try {
    const { storageError: _ignored, ...rest } = state
    void _ignored
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    return null
  } catch {
    return 'local-storage-write'
  }
}

export function clearStoredProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}
