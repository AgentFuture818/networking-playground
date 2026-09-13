import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getDrill, nextItemPath, unit1ItemPath, unit1ItemTitle, unitPath } from '@/content/catalog'
import { isUnit1Unlocked, previousUnit1Id } from '@/lib/unit1-lock'
import { useProgress } from '@/context/progress-context'
import { ClassifyDrill } from '@/components/drills/classify-drill'
import { AssembleDrill } from '@/components/drills/assemble-drill'
import { SequenceLock } from '@/components/lab/sequence-lock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function DrillPage() {
  const { trackId = '', unitId = '', drillId = '' } = useParams()
  const drill = getDrill(trackId, unitId, drillId)
  const { setLastPath, state } = useProgress()
  const location = useLocation()

  useEffect(() => {
    setLastPath(location.pathname)
  }, [location.pathname, setLastPath])

  if (!drill) {
    return (
      <Alert variant="destructive">
        <AlertTitle>搵唔到呢項練習</AlertTitle>
        <AlertDescription>
          <Link to={unitPath()} className="underline">
            返單元目錄
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  const completed = new Set(state.completed)
  const unlocked = isUnit1Unlocked(drill.id, completed)
  const previousId = previousUnit1Id(drill.id)
  const done = state.completed.includes(drill.id)
  const next = done ? nextItemPath(drill.id) : null

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          <Link to={unitPath()} className="underline">
            單元 1 · 點樣搵到對方
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold">{drill.title}</h1>
          {done ? <Badge tone="ok">已完成</Badge> : <Badge>即時回饋</Badge>}
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{drill.outcome}</p>
      </header>
      {!unlocked && previousId ? (
        <SequenceLock previousTitle={unit1ItemTitle(previousId)} previousPath={unit1ItemPath(previousId) ?? unitPath()} />
      ) : (
        <>
          {drill.id === 'classify' ? <ClassifyDrill /> : null}
          {drill.id === 'assemble' ? <AssembleDrill /> : null}
        </>
      )}
      <footer className="flex flex-wrap gap-2 border-t pt-4">
        {next ? (
          <Button asChild variant="outline">
            <Link to={next}>下一項練習</Link>
          </Button>
        ) : (
          <Button asChild variant={done ? 'default' : 'outline'}>
            <Link to={unitPath()}>返單元目錄</Link>
          </Button>
        )}
      </footer>
    </div>
  )
}
