import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'

const Layout: React.FC = () => {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isAuthRoute = ['/login', '/register', '/forgot-password'].some(
    (route) => location.pathname.startsWith(route),
  )

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#0B0F1A] text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Pular para o conteúdo principal
      </a>

      {!isAdminPage && !isAuthRoute && <Navbar />}

      <main
        id="main-content"
        className={isAuthRoute ? 'min-h-screen' : 'flex-1'}
      >
        <Outlet />
      </main>

      {!isAuthRoute && !isAdminPage && <Footer />}
    </div>
  )
}

export default Layout
