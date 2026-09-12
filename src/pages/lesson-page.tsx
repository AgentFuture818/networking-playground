import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getLesson, nextItemPath, unitPath } from '@/content/catalog'
import { useProgress } from '@/context/progress-context'
import { LessonBody } from '@/lessons/lesson-body'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function LessonPage() {
  const { trackId = '', unitId = '', lessonId = '' } = useParams()
  const lesson = getLesson(trackId, unitId, lessonId)
  const { markComplete, setLastPath, state } = useProgress()
  const location = useLocation()

  useEffect(() => {
    setLastPath(location.pathname)
  }, [location.pathname, setLastPath])

  if (!lesson) {
    return (
      <Alert variant="destructive">
        <AlertTitle>搵唔到呢節</AlertTitle>
        <AlertDescription>
          單元路徑錯咗。<Link to={unitPath()} className="underline">返 IPv4／IPv6 單元</Link>
        </AlertDescription>
      </Alert>
    )
  }

  const done = state.completed.includes(lesson.id)
  const next = nextItemPath(lesson.id)

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          <Link to={unitPath()} className="underline">
            IPv4 同 IPv6 位址
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold">{lesson.title}</h1>
          {done ? <Badge tone="ok">已完成</Badge> : null}
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          學習目標：{lesson.outcome}
        </p>
      </header>
      <LessonBody lessonId={lesson.id} />
      <footer className="flex flex-wrap gap-2 border-t pt-4">
        <Button
          onClick={() => {
            markComplete(lesson.id)
          }}
        >
          {done ? '已標記完成' : '標記完成'}
        </Button>
        {next ? (
          <Button asChild variant="outline">
            <Link to={next}>下一節</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to={unitPath()}>返單元目錄</Link>
          </Button>
        )}
      </footer>
    </article>
  )
}
