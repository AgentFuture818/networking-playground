import { useMemo, useState } from 'react'
import { useProgress } from '@/context/progress-context'
import { classifyAddress, type AddressKind } from '@/lib/ip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type Item = {
  prompt: string
  answer: AddressKind
  why: string
}

const ITEMS: Item[] = [
  {
    prompt: '192.0.2.44',
    answer: 'ipv4',
    why: '四個 decimal octet、每個 0–255。192.0.2.0/24 係 RFC 5737 文件用前綴，課堂示範應該用呢類，而唔係隨便填公網地址。',
  },
  {
    prompt: '2001:db8:85a3::8a2e:370:7334',
    answer: 'ipv6',
    why: '合法壓縮 IPv6：:: 只出現一次，代表中間連續 0 嘅 hextet。2001:db8::/32 同樣係文件用前綴。',
  },
  {
    prompt: '172.16.300.4',
    answer: 'invalid',
    why: '300 超出一個 octet 嘅上限 255（8 bit 最大值係 2⁸−1）。所以根本唔係 IPv4。',
  },
  {
    prompt: '::1',
    answer: 'ipv6',
    why: 'loopback。:: 壓縮晒前面嘅 0，最後一個 hextet 係 1，即 ::1。',
  },
  {
    prompt: '10.0.0',
    answer: 'invalid',
    why: 'IPv4 一定要四個 octet。三組數字可能係口語上講 B-class 網絡，但唔係一個 host address 嘅寫法。',
  },
  {
    prompt: 'fe80::1ff:fe23:4567',
    answer: 'ipv6',
    why: 'link-local（fe80::/10）。呢類地址只喺同一個 link 有效，router 唔會當 global 轉發。',
  },
  {
    prompt: '2001:db8::g3',
    answer: 'invalid',
    why: 'hextet 只可以係 0–9 同 a–f。g 唔係十六進制 digit。',
  },
  {
    prompt: '255.255.255.255',
    answer: 'ipv4',
    why: '呢個係 limited broadcast（全部 bit 為 1）。格式上仍然係合法 IPv4，雖然唔會當普通 host 用。',
  },
  {
    prompt: '::ffff:192.0.2.1',
    answer: 'ipv6',
    why: 'IPv4-mapped IPv6。前綴 ::ffff:/96，尾段用 dotted decimal 寫 IPv4。表示「喺 IPv6 socket 入面裝住一個 IPv4 端點」，本身分類仍然係 IPv6 地址形式。',
  },
  {
    prompt: '01.2.3.4',
    answer: 'invalid',
    why: '呢個 lab 用 canonical dotted decimal：除咗 0 本身，唔接受 leading zero。歷史上有啲 stack 會當 octal 解析，容易搞出 silent bug。',
  },
]

const LABELS: { id: AddressKind; text: string }[] = [
  { id: 'ipv4', text: 'IPv4' },
  { id: 'ipv6', text: 'IPv6' },
  { id: 'invalid', text: '唔合法' },
]

export function ClassifyDrill() {
  const { recordScore, state } = useProgress()
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<AddressKind | null>(null)
  const [log, setLog] = useState<{ ok: boolean }[]>([])
  const [emptySubmit, setEmptySubmit] = useState(false)
  const [showScore, setShowScore] = useState(false)

  const item = ITEMS[index]!
  const judged = choice !== null && log.length === index + 1
  const finished = showScore && log.length === ITEMS.length
  const correctCount = log.filter((x) => x.ok).length

  const best = state.scores.classify?.best ?? 0

  const summary = useMemo(() => {
    if (!finished) return null
    return { correct: correctCount, total: ITEMS.length, best: Math.max(best, correctCount) }
  }, [finished, correctCount, best])

  function submit() {
    if (log.length !== index) return
    if (choice === null) {
      setEmptySubmit(true)
      return
    }
    setEmptySubmit(false)
    const ok = choice === item.answer
    const nextLog = [...log, { ok }]
    setLog(nextLog)
    if (nextLog.length === ITEMS.length) {
      const correct = nextLog.filter((x) => x.ok).length
      recordScore('classify', { correct, total: ITEMS.length, best: correct })
    }
  }

  function next() {
    if (index < ITEMS.length - 1) {
      setIndex((n) => n + 1)
      setChoice(null)
    }
  }

  function restart() {
    setIndex(0)
    setChoice(null)
    setLog([])
    setEmptySubmit(false)
    setShowScore(false)
  }

  if (finished && summary) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTitle>呢輪完咗</AlertTitle>
          <AlertDescription>
            你答啱 {summary.correct}／{summary.total}。
            {summary.correct === summary.total
              ? ' 全對，呢項練習已標記完成。'
              : ' 未全對都可以再做；全對先會當完成。'}
            {best ? ` 歷史最好係 ${Math.max(best, summary.correct)} 題。` : ''}
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
          第 {index + 1}／{ITEMS.length} 題
        </p>
        <Badge>{correctCount} 題已啱</Badge>
      </div>
      <p className="font-mono text-2xl break-all text-primary sm:text-3xl">{item.prompt}</p>
      <p className="text-muted-foreground text-sm">
        用 classifyAddress 規則：canonical IPv4、壓縮／完整 IPv6（包括 v4-mapped），其餘當唔合法。
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {LABELS.map((opt) => (
          <Button
            key={opt.id}
            type="button"
            variant={choice === opt.id ? 'default' : 'outline'}
            onClick={() => {
              setChoice(opt.id)
              setEmptySubmit(false)
            }}
            disabled={judged}
          >
            {opt.text}
          </Button>
        ))}
      </div>
      {emptySubmit ? (
        <Alert variant="destructive">
          <AlertDescription>未揀類型。揀 IPv4、IPv6 或者「唔合法」再核對。</AlertDescription>
        </Alert>
      ) : null}
      {judged ? (
        <Alert variant={choice === item.answer ? 'default' : 'destructive'}>
          <AlertTitle>
            {choice === item.answer ? '啱' : `唔啱（正確：${item.answer === 'invalid' ? '唔合法' : item.answer}）`}
          </AlertTitle>
          <AlertDescription>
            {item.why} 自動分類結果：{classifyAddress(item.prompt)}。
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {!judged ? (
          <Button onClick={submit}>核對</Button>
        ) : (
          <Button onClick={next} className={cn(index === ITEMS.length - 1 && 'hidden')}>
            下一題
          </Button>
        )}
        {judged && index === ITEMS.length - 1 ? (
          <Button onClick={() => setShowScore(true)}>睇成績</Button>
        ) : null}
      </div>
    </div>
  )
}
