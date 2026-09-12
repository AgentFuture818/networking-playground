import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { tracks, unitPath, NETWORK_TRACK_ID, codeErrorCopy } from '@/content/catalog'
import { useProgress } from '@/context/progress-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function HomePage() {
  const { state, completedCount, totalCount } = useProgress()
  const continueTo = state.lastPath

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge>大專實驗課 · 書面廣東話</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">網絡傳送實驗</h1>
        <p className="text-muted-foreground max-w-2xl leading-7">
          第一個單元集中喺 <span className="text-foreground">IPv4 同 IPv6 位址</span>
          ：點解 packet-switched network 要 unique identifier、點樣讀 octet 同 prefix、封包沿途點樣用
          destination 做 hop-by-hop 轉發、IPv6 點解出現、同 dual-stack 點樣共存。動畫顯示傳送過程，唔係淨係靜態圖。
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to={unitPath()}>
              開始 IPv4／IPv6 單元
              <ArrowRight />
            </Link>
          </Button>
          {continueTo ? (
            <Button asChild variant="outline">
              <Link to={continueTo}>由上次繼續</Link>
            </Button>
          ) : null}
          <Button asChild variant="ghost">
            <Link to="/progress">進度碼／匯出</Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          而家完成咗 {completedCount}/{totalCount} 項（五節講解 + 兩項練習）。
        </p>
      </section>

      {state.storageError ? (
        <Alert variant="destructive">
          <AlertTitle>讀進度出錯</AlertTitle>
          <AlertDescription>{codeErrorCopy[state.storageError]}</AlertDescription>
        </Alert>
      ) : null}

      {completedCount === 0 ? (
        <Alert>
          <AlertTitle>未有完成紀錄</AlertTitle>
          <AlertDescription>
            進度會自動寫入呢個瀏覽器嘅 localStorage。換機或者清站資料之前，去「進度」頁複製進度碼。
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {tracks.map((track) => (
          <Card key={track.id} className={track.status === 'soon' ? 'opacity-90' : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{track.title}</CardTitle>
                {track.status === 'soon' ? (
                  <Badge tone="muted">
                    <Lock className="mr-1 size-3" />
                    稍後開放
                  </Badge>
                ) : (
                  <Badge tone="ok">進行中</Badge>
                )}
              </div>
              <CardDescription>{track.blurb}</CardDescription>
            </CardHeader>
            <CardContent>
              {track.status === 'open' ? (
                <Button asChild variant="secondary">
                  <Link to={`/tracks/${track.id}`}>入呢條軌道</Link>
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">
                  呢條軌道預留咗位，之後先寫內容，避免同 {tracks.find((t) => t.id === NETWORK_TRACK_ID)?.title} 混在一齊。
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
