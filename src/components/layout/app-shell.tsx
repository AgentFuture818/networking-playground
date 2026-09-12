import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Activity, Lock } from 'lucide-react'
import { useProgress } from '@/context/progress-context'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: '總覽', end: true },
  { to: '/tracks/network', label: '網絡傳送' },
  { to: '/tracks/ops', label: '伺服器維護' },
  { to: '/progress', label: '進度' },
]

export function AppShell() {
  const { completedCount, totalCount } = useProgress()
  const location = useLocation()
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:px-3 focus:py-2"
      >
        跳去內容
      </a>
      <header className="border-border/80 sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-semibold tracking-wide">網絡傳送實驗</p>
              <p className="text-muted-foreground text-xs">IPv4／IPv6 位址 · 大專實驗課</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1" aria-label="主要">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2.5 py-1.5 text-sm',
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )
                }
              >
                {link.to === '/tracks/ops' ? (
                  <span className="inline-flex items-center gap-1">
                    {link.label}
                    <Lock className="size-3" aria-hidden />
                  </span>
                ) : (
                  link.label
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3">
          <div className="text-muted-foreground mb-1 flex justify-between text-xs">
            <span>本單元完成度</span>
            <span>
              {completedCount}/{totalCount} · {pct}%
            </span>
          </div>
          <Progress value={pct} />
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6" data-path={location.pathname}>
        <Outlet />
      </main>
      <footer className="text-muted-foreground mx-auto w-full max-w-5xl px-4 py-6 text-xs leading-relaxed">
        靜態站，無帳號、無後端。進度預設寫入呢個瀏覽器嘅 localStorage，唔用 cookie。換機請匯出進度碼。
      </footer>
    </div>
  )
}
