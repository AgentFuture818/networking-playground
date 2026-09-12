import type { HTMLAttributes, LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-sm leading-none font-medium peer-disabled:opacity-50', className)}
      {...props}
    />
  )
}

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-border h-px w-full', className)} role="separator" {...props} />
}
