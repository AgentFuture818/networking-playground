import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { getUnit, lessonPath, drillPath } from '@/content/catalog'
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
      <Alert>
        <AlertTitle>{unit.title}稍後開放</AlertTitle>
        <AlertDescription>{unit.blurb}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">
          <Link to={`/tracks/${trackId}`} className="underline">
            軌道
          </Link>
          {' · '}
          實驗單元
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{unit.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl leading-7">{unit.blurb}</p>
      </div>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">學習目標</h2>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {unit.lessons.map((lesson) => (
            <li key={lesson.id}>{lesson.outcome}</li>
          ))}
          {unit.drills.map((drill) => (
            <li key={drill.id}>{drill.outcome}</li>
          ))}
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-medium">講解</h2>
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
                    <Link to={lessonPath(lesson.id)}>{done ? '重睇' : '開始'}</Link>
                  </Button>
                </div>
              </li>
            )
          })}
        </ol>
      </section>
      <section className="space-y-3">
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
