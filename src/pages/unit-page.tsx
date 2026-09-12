import { Link, useParams } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import { getUnit, lessonPath, drillPath, playPolicy } from '@/content/catalog'
import { useProgress } from '@/context/progress-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function UnitPage() {
  const { trackId = '', unitId = '' } = useParams()
  const unit = getUnit(trackId, unitId)
  const { state } = useProgress()

  if (!unit) {
    return (
      <Alert variant="destructive">
        <AlertTitle>冇呢個單元</AlertTitle>
        <AlertDescription>
          <Link to="/" className="underline">返總覽</Link>
        </AlertDescription>
      </Alert>
    )
  }

  if (unit.status !== 'open') {
    return (
      <div className="space-y-5">
        <div>
          <Badge tone="muted">
            <Lock className="mr-1 size-3" />
            單元 {unit.number} · 鎖住
          </Badge>
          <h1 className="mt-2 text-3xl font-semibold">{unit.title}</h1>
        </div>
        <section className="space-y-1">
          <p className="text-primary text-xs font-semibold tracking-wider uppercase">問題</p>
          <p className="leading-7">{unit.problem}</p>
        </section>
        {unit.usecase ? (
          <section className="space-y-1">
            <p className="text-ipv4 text-xs font-semibold tracking-wider uppercase">日常見到</p>
            <p className="leading-7">{unit.usecase}</p>
          </section>
        ) : null}
        <section className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">之後會摸</p>
          <p className="text-muted-foreground leading-7">{unit.touch}</p>
        </section>
        <Alert>
          <AlertTitle>內容未解鎖</AlertTitle>
          <AlertDescription>
            地圖預告得呢度。課文同 lab 之後先寫，避免而家變成定義清單。
            {unit.id === 'dns'
              ? ' 呢課只解決名點變地址。Wi-Fi 連到但上網無能好多時係 DNS；未講點揀邊個國家嗰份副本。'
              : ''}
            {unit.id === 'ping-icmp'
              ? ' 極短提點：有人想 ping host:8080。ICMP echo 冇 port；呢頁唔會假裝瀏覽器可以 ping 外網。'
              : ''}
            {unit.id === 'http-generations'
              ? ' 同一個新聞頁貫穿三代：連線成本 → multiplex 仍然捱 TCP head-of-line → HTTP 改行 QUIC／UDP。'
              : ''}
            {unit.id === 'tls-https'
              ? ' HTTP 係明信片、HTTPS 係信封。SSL 係退休舊名；而家用 TLS。證書要認人，唔止加密。'
              : ''}
            {unit.id === 'cdn'
              ? ' 呢課只講 cache HIT／MISS。點樣令香港行去附近嗰份，下一格先問。'
              : ''}
            {unit.id === 'nearby-copy'
              ? ' 要見到幾個答法並排：unicast origin、GeoDNS、anycast（同一個 IP、好多道門）、應用層自己揀。'
              : ''}
            {unit.id === 'telnet-nc'
              ? ' 真公共 MX／真 SMTP 出網唔玩；之後先有假 SMTP／假 HTTP 手打。'
              : ''}
            {unit.id === 'warp'
              ? ' WARP 係 overlay 隧道（MASQUE／QUIC），唔係 CDN cache。排喺地圖最後。'
              : ''}
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertTitle>{playPolicy.title}</AlertTitle>
          <AlertDescription>{playPolicy.body}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/">返課程地圖</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">
          <Link to={`/tracks/${trackId}`} className="underline">
            課程地圖
          </Link>
          {' · '}
          單元 {unit.number}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{unit.title}</h1>
        <div className="mt-4 space-y-3 text-sm leading-7">
          <p>
            <span className="text-primary font-medium">問題：</span>
            {unit.problem}
          </p>
          <p>
            <span className="text-ipv4 font-medium">日常：</span>
            {unit.usecase}
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">要摸：</span>
            {unit.touch}
          </p>
        </div>
      </div>
      <ol className="space-y-2">
        {unit.lessons.map((lesson, i) => {
          const done = state.completed.includes(lesson.id)
          return (
            <li key={lesson.id} className="rounded-lg border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">
                    {i + 1} · 約 {lesson.minutes} 分鐘
                    {done ? (
                      <Badge tone="ok" className="ml-2">
                        <Check className="size-3" />
                        完成
                      </Badge>
                    ) : null}
                  </p>
                  <p className="mt-1 font-medium">{lesson.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{lesson.outcome}</p>
                </div>
                <Button asChild variant={done ? 'outline' : 'default'}>
                  <Link to={lessonPath(lesson.id)}>{done ? '重做' : '開始'}</Link>
                </Button>
              </div>
            </li>
          )
        })}
      </ol>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">練習</h2>
        <ul className="space-y-2">
          {unit.drills.map((drill) => {
            const done = state.completed.includes(drill.id)
            const score = state.scores[drill.id]
            return (
              <li key={drill.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{drill.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{drill.outcome}</p>
                    {score ? (
                      <p className="text-muted-foreground mt-1 text-xs">
                        最近 {score.correct}/{score.total} · 最好 {score.best}/{score.total}
                      </p>
                    ) : (
                      <p className="text-muted-foreground mt-1 text-xs">未交過卷</p>
                    )}
                  </div>
                  <Button asChild variant={done ? 'outline' : 'default'}>
                    <Link to={drillPath(drill.id)}>{done ? '再做' : '開始'}</Link>
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
