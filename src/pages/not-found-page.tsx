import { Link } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <Alert variant="destructive">
      <AlertTitle>呢頁唔存在</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Hash 路徑無對應單元。可能係舊書籤，或者進度碼入面嘅 lastPath 已經改名。</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/">返總覽</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
