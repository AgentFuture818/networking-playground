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
  id: string
  prompt: string
  hint: string
  kind: Kind
  expected: string
}

const PUZZLES: Puzzle[] = [
  {
    id: 'bits',
    prompt: '將 11000000 . 00000000 . 00000010 . 00000001 寫成 dotted decimal。',
    hint: '每個 octet 8 bit，MSB 在左。11000000₂ = 192。',
    kind: 'ipv4',
    expected: '192.0.2.1',
  },
  {
    id: 'order',
    prompt: 'Host 應該係 198.51.100.33。而家 octet 次序亂咗：33 · 100 · 198 · 51。寫返正確地址。',
    hint: '文件用前綴 198.51.100.0/24，最後一個 octet 先係 host。',
    kind: 'ipv4',
    expected: '198.51.100.33',
  },
  {
    id: 'fix',
    prompt: '修正 203.0.113.512。題目本意係最後一個 octet 想表達 2，但寫爆咗 9-bit。',
    hint: '一個 octet 盛唔到 512。按題意改返 0–255 範圍。',
    kind: 'ipv4',
    expected: '203.0.113.2',
  },
  {
    id: 'compress',
    prompt: '將 2001:0db8:0000:0000:0000:0000:0000:0001 壓成最短標準寫法。',
    hint: '刪 hextet leading zero；最長連續 0 段變 ::。',
    kind: 'compress',
    expected: '2001:db8::1',
  },
  {
    id: 'expand',
    prompt: '將 fe80::1 展開成 8 個 hextet（每組 4 粒 hex，補 0）。',
    hint: 'link-local。:: 補足缺少嘅 0 組。',
    kind: 'exact',
    expected: 'fe80:0000:0000:0000:0000:0000:0000:0001',
  },
  {
    id: 'prefix-host',
    prompt: '網絡 192.0.2.0/24，host bits 全部為 0 嘅係網絡地址。寫出呢個網絡第一個可用嚟標 host 嘅地址（host bits = 1）。',
    hint: '/24 即最後一個 octet 係 host。通常 .0 係 network，.1 係第一個 host（呢題按呢個慣例）。',
    kind: 'ipv4',
    expected: '192.0.2.1',
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
    const target = expandIPv6(puzzle.expected)
    if (!expanded || !target) return false
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
            {correctCount === PUZZLES.length
              ? ' 全對，呢項練習已標記完成。'
              : ' 未全對可以再做；全對先會當完成。'}
            {best ? ` 歷史最好係 ${Math.max(best, correctCount)} 題。` : ''}
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
          <AlertDescription>格式同數值都符合呢題要求。</AlertDescription>
        </Alert>
      ) : null}
      {status === 'bad' ? (
        <Alert variant="destructive">
          <AlertTitle>未啱</AlertTitle>
          <AlertDescription>
            對照規則再改。需要嘅話可以睇返上一節嘅 octet／hextet 動畫。正確答案：
            <span className="mt-1 block font-mono">{puzzle.expected}</span>
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
