import { useState } from 'react'
import { useProgress } from '@/context/progress-context'
import { compressIPv6, expandIPv6, parseIPv4Octets } from '@/lib/ip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

type Kind = 'exact' | 'ipv4' | 'compress'

type Puzzle = {
  prompt: string
  hint: string
  kind: Kind
  expected: string
}

const PUZZLES: Puzzle[] = [
  {
    prompt: '室友抄低你部機 bit：11000000.10101000.00000001.00010111。還原做 dotted decimal。呢個出唔出到你家門？',
    hint: '11000000₂=192，10101000₂=168。私網。',
    kind: 'ipv4',
    expected: '192.168.1.23',
  },
  {
    prompt: '有人把網站地址寫成 198.51.100.512。最後一個 octet 爆咗。題目本意係 10。',
    hint: 'octet 0–255。呢個先至係出得街嘅形態（文件用前綴）。',
    kind: 'ipv4',
    expected: '198.51.100.10',
  },
  {
    prompt: '屋企電話應該係 192.168.1.45。octet 次序亂咗：45 · 1 · 192 · 168。',
    hint: '私網 /24，最後一個 octet 係 host。',
    kind: 'ipv4',
    expected: '192.168.1.45',
  },
  {
    prompt: '將 2001:0db8:cafe:0000:0000:0000:0000:0023 壓成最短寫法（global IPv6 形態）。',
    hint: '刪 leading zero；最長連續 0 變 ::。注意 cafe 唔好加錯 0。',
    kind: 'compress',
    expected: '2001:db8:cafe::23',
  },
  {
    prompt: '將 fd12:3456::23 展開成 8 個 hextet（每組 4 hex）。呢個 ULA 外網朋友用唔用得？',
    hint: '補 0。答案只要展開式。',
    kind: 'exact',
    expected: 'fd12:3456:0000:0000:0000:0000:0000:0023',
  },
]

function matches(puzzle: Puzzle, raw: string): boolean {
  const value = raw.trim().toLowerCase()
  if (puzzle.kind === 'ipv4') {
    const got = parseIPv4Octets(value)
    const exp = parseIPv4Octets(puzzle.expected)
    return Boolean(got && exp && got.join('.') === exp.join('.'))
  }
  if (puzzle.kind === 'compress') {
    const expanded = expandIPv6(value)
    if (!expanded) return false
    return compressIPv6(expanded) === puzzle.expected
  }
  return value === puzzle.expected
}

export function AssembleDrill() {
  const { recordScore, state } = useProgress()
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle')
  const [empty, setEmpty] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [showScore, setShowScore] = useState(false)

  const puzzle = PUZZLES[index]!
  const finished = showScore && results.length === PUZZLES.length
  const correctCount = results.filter(Boolean).length
  const best = state.scores.assemble?.best ?? 0

  function check() {
    if (!draft.trim()) {
      setEmpty(true)
      setStatus('idle')
      return
    }
    setEmpty(false)
    const ok = matches(puzzle, draft)
    setStatus(ok ? 'ok' : 'bad')
    if (results.length === index) {
      const next = [...results, ok]
      setResults(next)
      if (next.length === PUZZLES.length) {
        const correct = next.filter(Boolean).length
        recordScore('assemble', { correct, total: PUZZLES.length, best: correct })
      }
    }
  }

  function goNext() {
    if (index < PUZZLES.length - 1) {
      setIndex((n) => n + 1)
      setDraft('')
      setStatus('idle')
      setEmpty(false)
    }
  }

  function restart() {
    setIndex(0)
    setDraft('')
    setStatus('idle')
    setEmpty(false)
    setResults([])
    setShowScore(false)
  }

  if (finished) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTitle>呢輪完咗</AlertTitle>
          <AlertDescription>
            你做啱 {correctCount}／{PUZZLES.length}。
            {correctCount === PUZZLES.length ? ' 全對，已標記完成。' : ' 未全對可以再做；全對先會當完成。'}
            {best ? ` 歷史最好 ${Math.max(best, correctCount)}。` : ''}
          </AlertDescription>
        </Alert>
        <Button onClick={restart}>再做一輪</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          第 {index + 1}／{PUZZLES.length} 題
        </p>
        <Badge>{correctCount} 題已啱</Badge>
      </div>
      <p className="leading-relaxed">{puzzle.prompt}</p>
      <p className="text-muted-foreground text-sm">{puzzle.hint}</p>
      <div className="space-y-2">
        <Label htmlFor="assemble-answer">你嘅答案</Label>
        <Input
          id="assemble-answer"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setStatus('idle')
            setEmpty(false)
          }}
          className="font-mono"
          spellCheck={false}
          placeholder="喺呢度輸入"
        />
      </div>
      {empty ? (
        <Alert variant="destructive">
          <AlertDescription>答案係空嘅。輸入完整位址再核對。</AlertDescription>
        </Alert>
      ) : null}
      {status === 'ok' ? (
        <Alert>
          <AlertTitle>啱</AlertTitle>
          <AlertDescription>格式同數值都符合呢題。</AlertDescription>
        </Alert>
      ) : null}
      {status === 'bad' ? (
        <Alert variant="destructive">
          <AlertTitle>未啱</AlertTitle>
          <AlertDescription>
            正確答案：<span className="mt-1 block font-mono">{puzzle.expected}</span>
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {status === 'idle' ? <Button onClick={check}>核對</Button> : null}
        {status !== 'idle' && index < PUZZLES.length - 1 ? (
          <Button onClick={goNext}>下一題</Button>
        ) : null}
        {status !== 'idle' && index === PUZZLES.length - 1 ? (
          <Button onClick={() => setShowScore(true)}>睇成績</Button>
        ) : null}
      </div>
    </div>
  )
}
