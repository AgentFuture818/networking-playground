import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  className,
  tone = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'ipv4' | 'ipv6' | 'muted' | 'ok' | 'bad'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        tone === 'default' && 'border-border bg-secondary text-secondary-foreground',
        tone === 'ipv4' && 'border-ipv4/40 bg-ipv4/15 text-ipv4',
        tone === 'ipv6' && 'border-ipv6/40 bg-ipv6/15 text-ipv6',
        tone === 'muted' && 'text-muted-foreground',
        tone === 'ok' && 'border-primary/40 bg-primary/15 text-primary',
        tone === 'bad' && 'border-destructive/40 bg-destructive/15 text-destructive',
        className,
      )}
      {...props}
    />
  )
}
