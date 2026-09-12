/** Size the moving packet so the full destination stays readable. Never truncate. */
export function packetBoxSize(dest: string): { width: number; height: number } {
  const text = dest.trim() || '?'
  const charW = 7.6
  const padX = 18
  const padY = 12
  const lineH = 13
  const maxLineChars = 20
  const lines = Math.max(1, Math.ceil(text.length / maxLineChars))
  const longest = Math.min(text.length, maxLineChars)
  return {
    width: Math.min(248, Math.max(108, Math.ceil(longest * charW + padX))),
    height: Math.max(30, lines * lineH + padY),
  }
}
