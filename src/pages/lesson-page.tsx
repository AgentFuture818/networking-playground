import { useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import {
  getLesson,
  LESSON_ALIASES,
  lessonPath,
  nextItemPath,
  unit1ItemPath,
  unit1ItemTitle,
  unitPath,
} from '@/content/catalog'
import { isUnit1Unlocked, previousUnit1Id } from '@/lib/unit1-lock'
import { useProgress } from '@/context/progress-context'
import { LessonBody } from '@/lessons/lesson-body'
import { SequenceLock } from '@/components/lab/sequence-lock'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function LessonPage() {
  const { trackId = '', unitId = '', lessonId = '' } = useParams()
  const alias = LESSON_ALIASES[lessonId]
  const lesson = getLesson(trackId, unitId, lessonId)
  const { markComplete, setLastPath, state } = useProgress()
  const location = useLocation()

  useEffect(() => {
    if (!alias) setLastPath(location.pathname)
  }, [alias, location.pathname, setLastPath])

  if (alias) {
    return <Navigate to={lessonPath(alias)} replace />
  }

  if (!lesson) {
    return (
      <Alert variant="destructive">
        <AlertTitle>搵唔到呢節</AlertTitle>
        <AlertDescription>
          單元路徑錯咗。
          <Link to={unitPath()} className="underline">
            返單元 1
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  const completed = new Set(state.completed)
  const unlocked = isUnit1Unlocked(lesson.id, completed)
  const previousId = previousUnit1Id(lesson.id)
  const done = state.completed.includes(lesson.id)
  const next = done ? nextItemPath(lesson.id) : null

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          <Link to={unitPath()} className="underline">
            單元 1 · 點樣搵到對方
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold">{lesson.title}</h1>
          {done ? <Badge tone="ok">已完成</Badge> : null}
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">學習目標：{lesson.outcome}</p>
      </header>
      {!unlocked && previousId ? (
        <SequenceLock previousTitle={unit1ItemTitle(previousId)} previousPath={unit1ItemPath(previousId) ?? unitPath()} />
      ) : (
        <LessonBody lessonId={lesson.id} />
      )}
      <footer className="flex flex-wrap gap-2 border-t pt-4">
        {unlocked ? (
          <Button
            onClick={() => {
              markComplete(lesson.id)
            }}
          >
            {done ? '已標記完成' : '標記完成'}
          </Button>
        ) : null}
        {next ? (
          <Button asChild variant="outline">
            <Link to={next}>下一節</Link>
          </Button>
        ) : done ? (
          <Button asChild variant="outline">
            <Link to={unitPath()}>返單元目錄</Link>
          </Button>
        ) : unlocked ? (
          <p className="text-muted-foreground self-center text-sm">標記完成之後先至去下一節。</p>
        ) : null}
      </footer>
    </article>
  )
}
