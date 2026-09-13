/** Linear unit 1: later items stay locked until the previous id is marked complete. */
export const UNIT1_SEQUENCE = [
  'problem',
  'cast',
  'ipv4-read',
  'v6-write',
  'v6-scope',
  'lab',
  'classify',
  'assemble',
] as const

export type Unit1ItemId = (typeof UNIT1_SEQUENCE)[number]

export function previousUnit1Id(id: string): string | undefined {
  const index = UNIT1_SEQUENCE.indexOf(id as Unit1ItemId)
  if (index <= 0) return undefined
  return UNIT1_SEQUENCE[index - 1]
}

export function isUnit1Unlocked(id: string, completed: ReadonlySet<string>): boolean {
  const prev = previousUnit1Id(id)
  if (!prev) return UNIT1_SEQUENCE.includes(id as Unit1ItemId)
  return completed.has(prev)
}
