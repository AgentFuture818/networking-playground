import { LabFigure } from '@/components/lab/figure'

const CAST = [
  { id: 'laptop', name: '屋企電腦', line: '廳入面。' },
  { id: 'phone', name: '屋企電話', line: '都喺廳。' },
  { id: 'router', name: '家用閘道', line: '門口。' },
  { id: 'friend', name: '外網朋友', line: '街上另一間屋。' },
  { id: 'web', name: '公開網站', line: '街上人人搵到。' },
] as const

export function CastIntro() {
  return (
    <div className="space-y-4">
      <LabFigure caption="圖 · 五位。左廳、右街。閘道係門口，唔係把廳入面嘅門牌貼去街上。">
        <svg viewBox="0 0 680 248" className="h-auto w-full min-w-[36rem]">
          <rect
            x="24"
            y="18"
            width="250"
            height="212"
            rx="12"
            fill="oklch(0.22 0.03 250 / 0.6)"
            stroke="oklch(0.45 0.04 250)"
          />
          <text x="149" y="40" textAnchor="middle" fill="oklch(0.72 0.02 250)" fontSize="12">
            廳
          </text>
          <text x="560" y="40" textAnchor="middle" fill="oklch(0.72 0.02 250)" fontSize="12">
            街
          </text>
          <rect x="58" y="58" width="180" height="52" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="148" y="89" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="14">
            屋企電話
          </text>
          <rect x="58" y="168" width="180" height="52" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="148" y="199" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="14">
            屋企電腦
          </text>
          <rect x="274" y="98" width="132" height="52" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.8 0.12 196)" />
          <text x="340" y="129" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="14">
            家用閘道
          </text>
          <rect x="470" y="58" width="180" height="52" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="560" y="89" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="14">
            外網朋友
          </text>
          <rect x="470" y="168" width="180" height="52" rx="8" fill="oklch(0.24 0.03 250)" stroke="oklch(0.45 0.04 250)" />
          <text x="560" y="199" textAnchor="middle" fill="oklch(0.95 0.01 95)" fontSize="14">
            公開網站
          </text>
          <path d="M238 84 H274" stroke="oklch(0.55 0.04 250)" strokeWidth="2" />
          <path d="M238 194 H274" stroke="oklch(0.55 0.04 250)" strokeWidth="2" />
          <path d="M406 124 H470" stroke="oklch(0.55 0.04 250)" strokeWidth="2" />
        </svg>
      </LabFigure>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CAST.map((role) => (
          <li key={role.id} className="rounded-lg border bg-card p-3">
            <p className="font-medium">{role.name}</p>
            <p className="text-muted-foreground mt-1 text-sm">{role.line}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
