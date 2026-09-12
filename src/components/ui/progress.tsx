import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export function Progress({
  className,
  value,
}: {
  className?: string
  value: number
}) {
  return (
    <ProgressPrimitive.Root
      className={cn('bg-secondary relative h-2 w-full overflow-hidden rounded-full', className)}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="bg-primary h-full w-full flex-1 transition-transform"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
