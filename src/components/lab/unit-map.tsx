import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import type { UnitMeta } from '@/content/catalog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NETWORK_TRACK_ID } from '@/content/catalog'

export function UnitMap({ units }: { units: UnitMeta[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {units.map((unit) => (
        <li key={unit.id}>
          <Card className={unit.status === 'soon' ? 'bg-card/70' : undefined}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <p className="text-muted-foreground text-xs">單元 {unit.number}</p>
                {unit.status === 'open' ? (
                  <Badge tone="ok">可玩</Badge>
                ) : (
                  <Badge tone="muted">
                    <Lock className="mr-1 size-3" />
                    鎖住
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base leading-snug">{unit.title}</CardTitle>
              <CardDescription className="space-y-2">
                <span className="block">
                  <span className="text-foreground/80">問題：</span>
                  {unit.problem}
                </span>
                <span className="block">
                  <span className="text-foreground/80">日常：</span>
                  {unit.usecase}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unit.status === 'open' ? (
                <Button asChild size="sm">
                  <Link to={`/tracks/${NETWORK_TRACK_ID}/units/${unit.id}`}>入實驗室</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link to={`/tracks/${NETWORK_TRACK_ID}/units/${unit.id}`}>睇預告</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  )
}
