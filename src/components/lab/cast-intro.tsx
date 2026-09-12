import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type AddressLayer = 'v4' | 'v6'

const CAST = [
  {
    id: 'laptop',
    name: '屋企電腦',
    v4: '可以同屋企電話互送；出街要經家用閘道。外網朋友用你屋企內部號碼搵你，搵唔到。',
    v6: '同一條屋企網可以互送。內部用嘅 IPv6 外網朋友打唔入；出得街嗰個，朋友先有機會送到。',
  },
  {
    id: 'phone',
    name: '屋企電話',
    v4: '同電腦一樣，係屋企入面另一部機，唔係外網主機。',
    v6: '同電腦同一條 link。只喺呢條線有效嘅號碼，出到門口就冇用。',
  },
  {
    id: 'router',
    name: '家用閘道',
    v4: '一邊連住屋企，一邊連住外網。唔會把屋企內部號碼公告去互聯網。',
    v6: '負責轉入／轉出。內部範圍唔公開；全球範圍可以轉入 LAN。',
  },
  {
    id: 'friend',
    name: '外網朋友',
    v4: '喺另一個網絡。可以去公開網站；打唔入你屋企內部號碼。',
    v6: '用你屋企內部 IPv6 搵你會失敗；用出得街嗰個先有機會。',
  },
  {
    id: 'web',
    name: '公開網站',
    v4: '人人用得出街嘅號碼都可以指到佢。呢個 lab 用文件用地址，唔係真站。',
    v6: '同樣有出得街嘅 IPv6。屋企機同外網朋友都可以送去呢度。',
  },
] as const

export function CastIntro({
  addressLayer,
  onReady,
}: {
  addressLayer: AddressLayer
  onReady: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>實驗場有邊位？</CardTitle>
        <CardDescription>
          未送包之前，先認人。之後封包場入面五個盒就係呢五位——唔好當佢哋全部出得街。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="grid gap-3 sm:grid-cols-2">
          {CAST.map((role) => (
            <li key={role.id} className="rounded-lg border bg-background/40 p-3">
              <p className="font-medium">{role.name}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {addressLayer === 'v6' ? role.v6 : role.v4}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm leading-relaxed">
          記低：屋企電腦／電話互相睇到對方；外網朋友睇到公開網站；閘道係門口，唔係把廳入面嘅門牌貼去街上。
        </p>
        <Button type="button" onClick={onReady}>
          識咗呢五位，開始送包
        </Button>
      </CardContent>
    </Card>
  )
}
