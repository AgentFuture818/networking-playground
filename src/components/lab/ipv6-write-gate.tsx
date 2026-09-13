import { useState } from 'react'
import { useProgress } from '@/context/progress-context'
import { Ipv6WriteLab } from '@/components/animations/ipv6-write-lab'
import { Ipv6ScopeBriefing } from '@/components/lab/ipv6-scope-briefing'
import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

export function Ipv6WriteGate({ children }: { children: ReactNode }) {
  const { state, markComplete } = useProgress()
  const already = state.completed.includes('v6-write')
  const [ready, setReady] = useState(already)

  if (ready) return children

  return (
    <div className="space-y-4">
      <Ipv6WriteLab />
      <Button
        type="button"
        onClick={() => {
          markComplete('v6-write')
          setReady(true)
        }}
      >
        識咗寫法，去送包
      </Button>
    </div>
  )
}

export function Ipv6AfterWrite({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <Ipv6ScopeBriefing />
      {children}
    </div>
  )
}
