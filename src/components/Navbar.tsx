import { LogOut, Menu, Ticket, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.jpg'
import { useAuth } from '../hooks/useAuth'
import { useProtectedNavigation } from '../hooks/useProtectedNavigation'

export function Navbar() {
  const { user, logout } = useAuth()
  const openProtectedRoute = useProtectedNavigation()
  const [imageError, setImageError] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const desktopUserMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileUserMenuRef = useRef<HTMLDivElement | null>(null)

  const hasAvatar = Boolean(
    user?.avatarUrl && user.avatarUrl.trim() !== '' && !imageError,
  )

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
        : 'text-white/75 hover:text-white'
    }`

  function closeMenus() {
    setIsMobileOpen(false)
    setIsUserMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenus()
    navigate('/login')
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (
        isMobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        closeMenus()
      }

      const desktopMenuContainsTarget =
        desktopUserMenuRef.current?.contains(target) ?? false
      const mobileMenuContainsTarget =
        mobileUserMenuRef.current?.contains(target) ?? false

      if (
        isUserMenuOpen &&
        !desktopMenuContainsTarget &&
        !mobileMenuContainsTarget
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileOpen, isUserMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  function handleProtectedPurchase(ticketId?: string) {
    const targetPath = ticketId ? `/ingressos?ticket=${ticketId}` : '/ingressos'
    openProtectedRoute(targetPath, 'Faça login para comprar ingressos.')
  }

  const userAvatar = hasAvatar ? (
    <img
      src={user?.avatarUrl ?? ''}
      alt={`Avatar de ${user?.name ?? 'usuário'}`}
      className="h-full w-full object-cover"
      onError={() => setImageError(true)}
    />
  ) : (
    <User size={16} className="text-purple-300" />
  )

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-black/85 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl'
          : 'bg-black/25 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Logotipo do Neon Sound Festival"
            className="h-12 w-12 rounded-full object-cover shadow-[0_0_20px_rgba(168,85,247,0.25)] sm:h-14 sm:w-14"
          />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm uppercase tracking-[0.3em] text-purple-300">
              Neon Sound
            </p>
            <p className="truncate text-base font-semibold text-white">
              Festival 2027
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={navLinkClassName} onClick={closeMenus}>
            Início
          </NavLink>
          <NavLink
            to="/lineup"
            className={navLinkClassName}
            onClick={closeMenus}
          >
            Line-up
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={navLinkClassName}
              onClick={closeMenus}
            >
              Dashboard
            </NavLink>
          )}

          {user ? (
            <div ref={desktopUserMenuRef} className="relative ml-2">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen((state) => !state)}
                className="flex items-center gap-3 rounded-full border border-purple-500/50 bg-white/5 px-4 py-2 text-white shadow-[0_0_6px_rgba(168,85,247,0.35)] transition hover:border-purple-400 hover:bg-white/10 cursor-pointer"
              >
                <span className="max-w-32 truncate text-sm text-purple-200 capitalize">
                  {user.name}
                </span>
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-purple-500/60 bg-black/50">
                  {userAvatar}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-purple-500/40 bg-black/95 p-2 shadow-[0_0_30px_rgba(168,85,247,0.22)] backdrop-blur-xl">
                  <Link
                    to="/perfil"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-purple-500/15 hover:text-white"
                  >
                    <User size={18} />
                    Perfil
                  </Link>
                  <Link
                    to="/meus-ingressos"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-purple-500/15 hover:text-white"
                  >
                    <Ticket size={18} />
                    Meus ingressos
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/15 hover:text-white cursor-pointer"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-full border border-purple-500/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-600 cursor-pointer"
              onClick={closeMenus}
            >
              Entrar
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleProtectedPurchase()}
            className="neon-button ml-2 rounded-full border border-purple-500 px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-purple-600 cursor-pointer"
          >
            Comprar ingresso
          </button>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          {user && (
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((state) => !state)}
              aria-label="Abrir menu do usuário"
              aria-expanded={isUserMenuOpen}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-purple-500/60 bg-black/40"
            >
              {userAvatar}
            </button>
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white"
            aria-label={
              isMobileOpen ? 'Fechar menu principal' : 'Abrir menu principal'
            }
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X size={22} className="text-purple-300" />
            ) : (
              <Menu size={22} className="text-purple-300" />
            )}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 top-18 bg-black/70 backdrop-blur-sm lg:hidden">
          <div
            ref={mobileMenuRef}
            className="mx-4 mt-4 overflow-hidden rounded-4xl border border-white/10 bg-[#080810] p-5 shadow-[0_0_35px_rgba(168,85,247,0.2)]"
          >
            <div className="flex flex-col gap-2">
              <NavLink to="/" className={navLinkClassName} onClick={closeMenus}>
                Início
              </NavLink>
              <NavLink
                to="/lineup"
                className={navLinkClassName}
                onClick={closeMenus}
              >
                Line-up
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={navLinkClassName}
                  onClick={closeMenus}
                >
                  Dashboard
                </NavLink>
              )}
            </div>

            {user ? (
              <div
                ref={mobileUserMenuRef}
                className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-purple-500/60 bg-black/50">
                    {userAvatar}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white capitalize">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <Link
                    to="/perfil"
                    onClick={closeMenus}
                    className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-purple-500/15 hover:text-white"
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/meus-ingressos"
                    onClick={closeMenus}
                    className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-purple-500/15 hover:text-white"
                  >
                    Meus ingressos
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl bg-red-500/10 px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/20 hover:text-white"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenus}
                className="mt-5 inline-flex rounded-full border border-purple-500/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-600"
              >
                Entrar
              </Link>
            )}

            <button
              type="button"
              onClick={() => handleProtectedPurchase()}
              className="neon-button mt-5 w-full rounded-full border border-purple-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-600"
            >
              Comprar ingresso
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
