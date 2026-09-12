import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { allCompletableIds } from '@/content/catalog'
import {
  decodeProgressCode,
  emptyProgress,
  loadProgress,
  parseProgressFile,
  saveProgress,
  type DecodeResult,
  type GameScore,
  type ProgressState,
} from '@/lib/progress'

type ProgressContextValue = {
  state: ProgressState
  writeError: string | null
  markComplete: (id: string) => void
  recordScore: (id: string, score: GameScore) => void
  setLastPath: (path: string) => void
  resetProgress: () => void
  importCode: (raw: string) => DecodeResult
  importFileText: (raw: string) => DecodeResult
  completedCount: number
  totalCount: number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress())
  const [writeError, setWriteError] = useState<string | null>(null)

  useEffect(() => {
    setWriteError(saveProgress(state))
  }, [state])

  const markComplete = useCallback((id: string) => {
    setState((prev) => {
      if (prev.completed.includes(id)) return prev
      return { ...prev, completed: [...prev.completed, id], updatedAt: Date.now() }
    })
  }, [])

  const recordScore = useCallback((id: string, score: GameScore) => {
    setState((prev) => {
      const prior = prev.scores[id]
      const best = Math.max(prior?.best ?? 0, score.best, score.correct)
      const completed =
        score.correct === score.total && score.total > 0 && !prev.completed.includes(id)
          ? [...prev.completed, id]
          : prev.completed
      return {
        ...prev,
        scores: { ...prev.scores, [id]: { ...score, best } },
        completed,
        updatedAt: Date.now(),
      }
    })
  }, [])

  const setLastPath = useCallback((path: string) => {
    setState((prev) => {
      if (prev.lastPath === path) return prev
      return { ...prev, lastPath: path, updatedAt: Date.now() }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setState(emptyProgress())
  }, [])

  const importCode = useCallback((raw: string) => {
    const result = decodeProgressCode(raw)
    if (result.ok) {
      setState({ ...result.state, storageError: null, updatedAt: Date.now() })
    }
    return result
  }, [])

  const importFileText = useCallback((raw: string) => {
    const result = parseProgressFile(raw)
    if (result.ok) {
      setState({ ...result.state, storageError: null, updatedAt: Date.now() })
    }
    return result
  }, [])

  const totalCount = allCompletableIds().length
  const completedCount = allCompletableIds().filter((id) => state.completed.includes(id)).length

  const value = useMemo(
    () => ({
      state,
      writeError,
      markComplete,
      recordScore,
      setLastPath,
      resetProgress,
      importCode,
      importFileText,
      completedCount,
      totalCount,
    }),
    [
      state,
      writeError,
      markComplete,
      recordScore,
      setLastPath,
      resetProgress,
      importCode,
      importFileText,
      completedCount,
      totalCount,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress 要喺 ProgressProvider 入面用')
  return ctx
}
