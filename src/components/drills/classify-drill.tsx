import { useMemo, useState } from 'react'
import { useProgress } from '@/context/progress-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Bucket = 'v4-local' | 'v4-global' | 'v6-local' | 'v6-global' | 'invalid'

type Item = {
  prompt: string
  answer: Bucket
  why: string
}

const ITEMS: Item[] = [
  {
    prompt: '192.168.1.23',
    answer: 'v4-local',
    why: 'IPv4 私網（192.168.0.0/16）。室友喺同一條 LAN 用得到；外網朋友用呢個 ping 唔到你家門。',
  },
  {
    prompt: '198.51.100.10',
    answer: 'v4-global',
    why: '文件用公網前綴（RFC 5737），形態上係 global。朋友喺外網可以指到「呢類」地址（真實網站另計）。',
  },
  {
    prompt: '10.0.0.8',
    answer: 'v4-local',
    why: '10.0.0.0/8 都係 RFC1918 私網。唔係假地址，係 scope 出唔到公網。',
  },
  {
    prompt: 'fd12:3456::23',
    answer: 'v6-local',
    why: 'ULA（fc00::/7）。IPv6 入面接近私網嘅角色，外網預設路由唔到。',
  },
  {
    prompt: '2001:db8:cafe::23',
    answer: 'v6-global',
    why: '2001:db8::/32 係文件用 global IPv6。形態上出得街；lab 入面朋友可以送到呢個。',
  },
  {
    prompt: 'fe80::1',
    answer: 'v6-local',
    why: 'link-local（fe80::/10）。只喺呢條 link。朋友喺另一個網絡用 fe80 搵你，一定唔得。',
  },
  {
    prompt: '172.16.300.4',
    answer: 'invalid',
    why: '300 超出一個 octet 嘅 0–255。未講 scope 已經唔係合法 IPv4。',
  },
  {
    prompt: '::1',
    answer: 'v6-local',
    why: 'IPv6 loopback。只有呢部機自己。當 local／本機，唔係俾朋友用嘅地址。',
  },
  {
    prompt: '203.0.113.80',
    answer: 'v4-global',
    why: '文件用 TEST-NET-3，形態 global。lab 入面外網朋友就係呢個。',
  },
  {
    prompt: '192.168.1.23:8080',
    answer: 'invalid',
    why: '呢個唔係 IP 地址寫法，而係 host:port。Ping／ICMP 亦冇 port——單元 3 先拆。而家當唔合法地址。',
  },
]

const LABELS: { id: Bucket; text: string }[] = [
  { id: 'v4-local', text: 'IPv4 · 出唔到你家門' },
  { id: 'v4-global', text: 'IPv4 · 出得街' },
  { id: 'v6-local', text: 'IPv6 · 出唔到你家門' },
  { id: 'v6-global', text: 'IPv6 · 出得街' },
  { id: 'invalid', text: '唔合法／唔係純地址' },
]

export function ClassifyDrill() {
  const { recordScore, state } = useProgress()
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<Bucket | null>(null)
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
    const nextLog = [...log, { ok: choice === item.answer }]
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
          第 {index + 1}／{ITEMS.length} 題 · 外網朋友用唔用得？
        </p>
        <Badge>{correctCount} 題已啱</Badge>
      </div>
      <p className="font-mono text-2xl break-all text-primary sm:text-3xl">{item.prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2">
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
          <AlertDescription>未揀。揀一個範圍，或者「唔合法」再核對。</AlertDescription>
        </Alert>
      ) : null}
      {judged ? (
        <Alert variant={choice === item.answer ? 'default' : 'destructive'}>
          <AlertTitle>{choice === item.answer ? '啱' : '未啱'}</AlertTitle>
          <AlertDescription>{item.why}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {!judged ? (
          <Button onClick={submit}>核對</Button>
        ) : index < ITEMS.length - 1 ? (
          <Button onClick={next}>下一題</Button>
        ) : (
          <Button onClick={() => setShowScore(true)}>睇成績</Button>
        )}
      </div>
    </div>
  )
}
