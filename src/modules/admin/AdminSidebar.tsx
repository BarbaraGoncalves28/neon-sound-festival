import { Outlet, Link } from "react-router-dom";
import { Home, Calendar, Layers, Menu, ChevronLeft, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/images/logo.jpg";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}
      <aside
        className={`
          ${isOpen ? "w-52" : "w-20"}
          sticky top-0 h-screen bg-black border-r border-purple-500/30
          p-6 flex flex-col justify-between
          transition-all duration-300
        `}
      >
        <div>

          {/* TOGGLE BUTTON */}
          <div className="flex justify-between items-center mb-10">
            {isOpen && (
  <div className="flex items-center gap-3">
    <img src={logo} alt="logo" className="rounded-full h-20 w-auto"/>
  </div>
)}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition -ml-2 cursor-pointer"
            >
              {isOpen ? <ChevronLeft size={20} className="text-purple-400"/> : <Menu size={20} className="text-purple-400"/>}
            </button>
          </div>

          <nav className="space-y-6">

            <Link
              to="/"
              className="flex items-center gap-3 hover:text-purple-400 transition"
            >
              <Home size={20} className="text-purple-400"/>
              {isOpen && <span className="neon-text">Início</span>}
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-3 hover:text-purple-400 transition"
            >
              <LayoutDashboard size={20} className="text-purple-400"/>
              {isOpen && <span className="neon-text">Dashboard</span>}
            </Link>

            <Link
              to="/admin/palcos"
              className="flex items-center gap-3 hover:text-purple-400 transition"
            >
              <Layers size={20} className="text-purple-400"/>
              {isOpen && <span className="neon-text">Gerenciar Palcos</span>}
            </Link>

            <Link
              to="/admin/programacao"
              className="flex items-center gap-3 hover:text-purple-400 transition"
            >
              <Calendar size={20} className="text-purple-400"/>
              {isOpen && <span className="neon-text">Programação</span>}
            </Link>

          </nav>
        </div>

        {isOpen && (
          <div className="text-xs text-gray-400">
            Neon Sound Admin ©2026
          </div>
        )}
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10 transition-all duration-300">
        <Outlet />
      </main>

    </div>
  );
}