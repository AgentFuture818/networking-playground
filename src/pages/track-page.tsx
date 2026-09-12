import { Link, useParams } from 'react-router-dom'
import { getTrack } from '@/content/catalog'
import { UnitMap } from '@/components/lab/unit-map'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function TrackPage() {
  const { trackId = '' } = useParams()
  const track = getTrack(trackId)

  if (!track) {
    return (
      <Alert variant="destructive">
        <AlertTitle>冇呢條軌道</AlertTitle>
        <AlertDescription>
          路徑上嘅 track id 唔存在。<Link to="/" className="underline">返總覽</Link>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone={track.status === 'open' ? 'ok' : 'muted'}>
          {track.status === 'open' ? '開放中' : '稍後開放'}
        </Badge>
        <h1 className="mt-2 text-3xl font-semibold">{track.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl leading-7">{track.blurb}</p>
      </div>
      {track.status === 'soon' ? (
        <Alert>
          <AlertTitle>伺服器維護仲未寫</AlertTitle>
          <AlertDescription>
            資訊架構已分開：網絡傳送同伺服器維護係兩條軌道。而家只開放單元 1。
          </AlertDescription>
        </Alert>
      ) : (
        <UnitMap units={track.units} />
      )}
    </div>
  )
}
