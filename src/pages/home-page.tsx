import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { NETWORK_TRACK_ID, playPolicy, tracks, unit1, lessonPath, codeErrorCopy } from '@/content/catalog'
import { useProgress } from '@/context/progress-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { UnitMap } from '@/components/lab/unit-map'

export function HomePage() {
  const { state, completedCount, totalCount } = useProgress()
  const continueTo = state.lastPath

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge>大專實驗課 · 書面廣東話</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">網絡傳送實驗</h1>
        <p className="text-muted-foreground max-w-2xl leading-7">
          唔會一開波背格式。每格都係<strong>問題 → 日常 → 講解 → 玩</strong>
          。而家開放單元 1：點樣搵到對方。先講解，後送包。
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to={lessonPath('problem')}>
              開始單元 1
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
          單元 1 完成度 {completedCount}/{totalCount}。
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
            進度寫入呢個瀏覽器 localStorage。換機前去「進度」複製進度碼。
          </AlertDescription>
        </Alert>
      ) : null}

      <Alert>
        <AlertTitle>{playPolicy.title}</AlertTitle>
        <AlertDescription>{playPolicy.body}</AlertDescription>
      </Alert>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">課程地圖</h2>
            <p className="text-muted-foreground text-sm">十六格一次過睇到。鎖住嘅只顯示問題同 usecase；課文同 lab 未寫。</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={`/tracks/${NETWORK_TRACK_ID}`}>網絡傳送軌道</Link>
          </Button>
        </div>
        <UnitMap units={tracks[0]!.units} />
      </section>

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
                  <Badge tone="ok">單元 {unit1.number} 進行中</Badge>
                )}
              </div>
              <CardDescription>{track.blurb}</CardDescription>
            </CardHeader>
            <CardContent>
              {track.status === 'open' ? (
                <Button asChild variant="secondary">
                  <Link to={`/tracks/${track.id}`}>打開軌道</Link>
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">內容未寫，只佔位。</p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
