import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function SequenceLock({
  previousTitle,
  previousPath,
}: {
  previousTitle: string
  previousPath: string
}) {
  return (
    <Alert>
      <Lock className="size-4" />
      <AlertTitle>上一節未標記完成</AlertTitle>
      <AlertDescription>
        單元 1 跟住行。先完成「{previousTitle}」，先至開呢一節。
        <Link to={previousPath} className="mt-2 block underline">
          返上一節
        </Link>
      </AlertDescription>
    </Alert>
  )
}
