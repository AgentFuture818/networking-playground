import type { ReactNode } from 'react'

export function LabFigure({
  caption,
  children,
}: {
  caption: string
  children: ReactNode
}) {
  return (
    <figure className="overflow-hidden rounded-xl border bg-card">
      <div className="lab-grid relative min-h-52 w-full overflow-x-auto p-3 sm:p-4">{children}</div>
      <figcaption className="text-muted-foreground border-t px-4 py-2 text-xs leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  )
}
