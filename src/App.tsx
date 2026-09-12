import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/context/progress-context'
import { AppShell } from '@/components/layout/app-shell'
import { HomePage } from '@/pages/home-page'
import { TrackPage } from '@/pages/track-page'
import { UnitPage } from '@/pages/unit-page'
import { LessonPage } from '@/pages/lesson-page'
import { DrillPage } from '@/pages/drill-page'
import { ProgressPage } from '@/pages/progress-page'
import { NotFoundPage } from '@/pages/not-found-page'

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tracks/:trackId" element={<TrackPage />} />
            <Route path="/tracks/:trackId/units/:unitId" element={<UnitPage />} />
            <Route path="/tracks/:trackId/units/:unitId/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/tracks/:trackId/units/:unitId/drills/:drillId" element={<DrillPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}
