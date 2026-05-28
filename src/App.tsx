import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

const Home = lazy(() =>
  import('./components/Home').then((module) => ({ default: module.Home })),
)
const LineupPage = lazy(() =>
  import('./components/LineupPage').then((module) => ({
    default: module.LineupPage,
  })),
)
const TicketsPage = lazy(() =>
  import('./components/TicketsPage').then((module) => ({
    default: module.TicketsPage,
  })),
)
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const Perfil = lazy(() => import('./components/Perfil'))
const MyTickets = lazy(() => import('./components/MyTickets'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AdminSidebar = lazy(() => import('./modules/admin/AdminSidebar'))
const StagesManager = lazy(() => import('./components/admin/StagesManager'))
const ScheduleManager = lazy(() => import('./components/admin/ScheduleManager'))

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-white">
      <div className="rounded-3xl border border-white/10 bg-black/40 px-8 py-10 shadow-[0_0_40px_rgba(168,85,247,0.15)] backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
          Carregando experiência
        </p>
        <h2 className="mt-3 text-2xl font-semibold neon-text">
          Preparando o festival
        </h2>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lineup" element={<LineupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/meus-ingressos" element={<MyTickets />} />
              <Route path="/ingressos" element={<TicketsPage />} />
            </Route>

            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminSidebar />}>
                <Route index element={<AdminDashboard />} />
                <Route path="palcos" element={<StagesManager />} />
                <Route path="programacao" element={<ScheduleManager />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
