import {
  Calendar,
  ChevronLeft,
  Home,
  Layers,
  LayoutDashboard,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '../../assets/images/logo.jpg'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white md:flex-row">
      {/* SIDEBAR */}
      <aside
        className={`
          ${isOpen ? 'md:w-60' : 'md:w-24'}
          sticky top-0 z-20 bg-black border-r border-purple-500/30
          p-4 md:h-screen md:p-6 flex flex-col justify-between
          transition-all duration-300
        `}
      >
        <div>
          {/* TOGGLE BUTTON */}
          <div className="mb-6 flex items-center justify-between md:mb-10">
            {isOpen && (
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Logotipo do Neon Sound Festival"
                  className="h-12 w-12 rounded-full object-cover md:h-16 md:w-16"
                />
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
              aria-expanded={isOpen}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition -ml-2 cursor-pointer"
            >
              {isOpen ? (
                <ChevronLeft size={20} className="text-purple-400" />
              ) : (
                <Menu size={20} className="text-purple-400" />
              )}
            </button>
          </div>

          <nav className="grid gap-3 md:space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-purple-500/10 hover:text-purple-300 transition"
            >
              <Home size={20} className="text-purple-400" />
              {isOpen && <span className="neon-text">Início</span>}
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-purple-500/10 hover:text-purple-300 transition"
            >
              <LayoutDashboard size={20} className="text-purple-400" />
              {isOpen && <span className="neon-text">Dashboard</span>}
            </Link>

            <Link
              to="/admin/palcos"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-purple-500/10 hover:text-purple-300 transition"
            >
              <Layers size={20} className="text-purple-400" />
              {isOpen && <span className="neon-text">Gerenciar Palcos</span>}
            </Link>

            <Link
              to="/admin/programacao"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-purple-500/10 hover:text-purple-300 transition"
            >
              <Calendar size={20} className="text-purple-400" />
              {isOpen && <span className="neon-text">Artistas</span>}
            </Link>
          </nav>
        </div>

        {isOpen && (
          <div className="text-xs text-gray-400">Neon Sound Admin ©2026</div>
        )}
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 px-4 py-6 md:p-10 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  )
}
