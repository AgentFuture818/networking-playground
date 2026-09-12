import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getDrill, nextItemPath, unitPath } from '@/content/catalog'
import { useProgress } from '@/context/progress-context'
import { ClassifyDrill } from '@/components/drills/classify-drill'
import { AssembleDrill } from '@/components/drills/assemble-drill'
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
          <Link to={unitPath()} className="underline">返單元目錄</Link>
        </AlertDescription>
      </Alert>
    )
  }

  const done = state.completed.includes(drill.id)
  const next = nextItemPath(drill.id)

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          <Link to={unitPath()} className="underline">
            IPv4 同 IPv6 位址
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold">{drill.title}</h1>
          {done ? <Badge tone="ok">已完成</Badge> : <Badge>即時回饋</Badge>}
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{drill.outcome}</p>
      </header>
      {drill.id === 'classify' ? <ClassifyDrill /> : null}
      {drill.id === 'assemble' ? <AssembleDrill /> : null}
      <footer className="flex flex-wrap gap-2 border-t pt-4">
        {next ? (
          <Button asChild variant="outline">
            <Link to={next}>下一項練習</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to={unitPath()}>返單元目錄</Link>
          </Button>
        )}
      </footer>
    </div>
  )
}
