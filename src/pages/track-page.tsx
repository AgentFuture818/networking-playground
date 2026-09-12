import { Link, useParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { getTrack } from '@/content/catalog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
          {track.status === 'open' ? '開放' : '稍後開放'}
        </Badge>
        <h1 className="mt-2 text-3xl font-semibold">{track.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl leading-7">{track.blurb}</p>
      </div>
      {track.status === 'soon' ? (
        <Alert>
          <AlertTitle>伺服器維護仲未寫</AlertTitle>
          <AlertDescription>
            資訊架構已經分開：網絡傳送同伺服器維護係兩條軌道。而家只開放 IPv4／IPv6 位址單元。
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-3">
        {track.units.map((unit, i) => (
          <Card key={unit.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-xs">單元 {i + 1}</p>
                  <CardTitle className="mt-1">{unit.title}</CardTitle>
                  <CardDescription className="mt-2">{unit.blurb}</CardDescription>
                </div>
                {unit.status === 'soon' ? (
                  <Badge tone="muted">
                    <Lock className="mr-1 size-3" />
                    稍後
                  </Badge>
                ) : (
                  <Badge tone="ok">可做</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {unit.status === 'open' ? (
                <Button asChild>
                  <Link to={`/tracks/${track.id}/units/${unit.id}`}>打開單元</Link>
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">內容未寫，只佔位。唔好當已經有課。</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
