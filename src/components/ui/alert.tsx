import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Alert({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        variant === 'default' && 'border-border bg-card',
        variant === 'destructive' && 'border-destructive/50 bg-destructive/10 text-destructive',
        className,
      )}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('mb-1 font-medium', className)} {...props} />
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-relaxed [&_a]:underline', className)} {...props} />
}
