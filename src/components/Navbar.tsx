import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Ticket, User, X } from "lucide-react";
import logo from "../assets/images/logo.jpg";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef(null);

  if(location.pathname === "/login") {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      isMobileOpen &&
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setIsMobileOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isMobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasAvatar = user?.avatarUrl && user.avatarUrl.trim() !== "";

  useEffect(() => {
  if (!isMobileOpen) {
    setIsUserMenuOpen(false);
  }
}, [isMobileOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl p-2 mx-auto px-6">
        <div className="flex items-center justify-between h-25">
          {/* Logo */}
          <div className="">
            <img src={logo} alt="logo" className="rounded-full h-20 w-auto"/>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center justify-center gap-8 font-medium">
            <Link to="/" className="neon-text hover:text-purple-400 transition">
              Início
            </Link>
            <Link to="/lineup" className="neon-text hover:text-purple-400 transition">
              Line-up
            </Link>

            {user?.role === "admin" && (
  <Link
    to="/admin"
    className="neon-text hover:text-purple-400 transition"
  >
    Dashboard
  </Link>
)}

            {user ? (
              <div className="relative group">
                  <div
                    className="cursor-pointer px-6 py-2 border border-purple-500 rounded-full font-medium text-white
                    shadow-[0_0_6px_rgba(168,85,247,0.7)]
                    hover:shadow-[0_0_16px_rgba(168,85,247,0.95)]
                    transition-all duration-300 flex items-center gap-3"
                    >
                    <span className="text-purple-300 text-sm truncate capitalize">{user.name}</span>

                    <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500
shadow-[0_0_6px_rgba(168,85,247,0.7)] flex items-center justify-center">

  {user?.avatarUrl && user.avatarUrl.trim() !== "" && !imageError ? (
  <img
    src={user.avatarUrl}
    alt="Avatar"
    className="w-full h-full object-cover"
    onError={() => setImageError(true)}
  />
) : (
  <User size={16} className="text-purple-400" />
)}

</div>
                  </div>

                  {/* DROPDOWN */}
                  <div
  className="absolute left-3 mt-3 w-52 rounded-xl border border-purple-500 bg-black/30 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden"
>

  <Link
    to="/perfil"
    className="flex items-center gap-3 px-4 py-3 text-purple-300
    hover:text-white hover:bg-purple-700/30
    hover:shadow-[0_0_10px_rgba(168,85,247,0.6)]
    transition-all duration-300"
  >
    <User size={18} />
    Perfil
  </Link>

  <Link
    to="/meus-ingressos"
    className="flex items-center gap-3 px-4 py-3 text-purple-300
    hover:text-white hover:bg-purple-700/30
    hover:shadow-[0_0_10px_rgba(168,85,247,0.6)]
    transition-all duration-300"
  >
    <Ticket size={18} />
    Meus ingressos
  </Link>

  <div className="border-t border-purple-500/40"></div>

  <button
    onClick={handleLogout}
    className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400
    hover:text-white hover:bg-red-600/30
    hover:shadow-[0_0_10px_rgba(239,68,68,0.6)]
    transition-all duration-300 cursor-pointer"
  >
    <LogOut size={18} />
    Sair
  </button>

</div>
              </div>
            ) : (
              <Link
  to="/login"
  className="px-6 py-2 border border-purple-500 rounded-full font-medium text-white
  shadow-[0_0_6px_rgba(168,85,247,0.7)]
  hover:bg-purple-700 hover:shadow-[0_0_14px_rgba(168,85,247,0.9)]
  transition-all duration-300"
>
  Login
</Link>
            )}

            {/* CTA */}
            <a
  href="/ingressos"
  className="neon-button transition-all duration-300 text-white py-2 hover:bg-purple-600 px-4 rounded-full border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] cursor-pointer neon-text font-bold
  "
>
   Comprar Ingresso
</a>
          </nav>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white" ref={buttonRef}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={28} className="cursor-pointer text-purple-400"/> : <Menu size={28} className="cursor-pointer text-purple-400"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div ref={mobileMenuRef} className="md:hidden fixed top-0 left-0 w-full bg-black/95 backdrop-blur px-6 pt-28 pb-8 text-white -z-1">
          <div className="flex flex-col gap-4 text-center">
            <Link to="/" onClick={() => setIsMobileOpen(false)} className="neon-text hover:text-purple-700 transition">
              Início
            </Link>
            <Link to="/lineup" onClick={() => setIsMobileOpen(false)} className="neon-text hover:text-purple-700 transition">
              Line-up
            </Link>

            {user?.role === "admin" && (
  <Link
    to="/admin"
    onClick={() => setIsMobileOpen(false)}
  >
    Dashboard
  </Link>
)}

            {user ? (
              <div className="relative flex flex-col items-center mt-10">

              <div onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
  className="cursor-pointer font-medium text-white
  shadow-[0_0_6px_rgba(168,85,247,0.7)]
  hover:shadow-[0_0_16px_rgba(168,85,247,0.95)]
  transition-all duration-300 gap-3 px-5 py-1.5 border border-purple-500 rounded-full flex items-center self-center"
>
  <span
    className="text-sm text-purple-300 truncate capitalize"
  >
    {user.name}
  </span>

  <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500
shadow-[0_0_6px_rgba(168,85,247,0.7)] flex items-center justify-center">

  {user?.avatarUrl && user.avatarUrl.trim() !== "" && !imageError ? (
    <img
      src={user.avatarUrl}
      alt="Avatar"
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  ) : (
    <User size={16} className="text-purple-400" />
  )}
</div>
</div>

{isUserMenuOpen && (
  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-52 rounded-xl border border-purple-500 bg-black/80 backdrop-blur-md overflow-hidden z-50">

    <Link
      to="/perfil"
      onClick={() => setIsMobileOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-purple-300 hover:text-white hover:bg-purple-700/30"
    >
      <User size={18} />
      Perfil
    </Link>

    <Link
      to="/meus-ingressos"
      onClick={() => setIsMobileOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-purple-300 hover:text-white hover:bg-purple-700/30"
    >
      <Ticket size={18} />
      Meus ingressos
    </Link>

    <div className="border-t border-purple-500/40"></div>

    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400 hover:text-white hover:bg-red-600/30"
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
  className="px-6 py-2 border border-purple-500 rounded-full font-medium text-white
  shadow-[0_0_6px_rgba(168,85,247,0.7)]
  hover:bg-purple-700 hover:shadow-[0_0_14px_rgba(168,85,247,0.9)]
  transition-all duration-300"
>
  Login
</Link>
            )}

            <a
              href="/ingressos"
              className="neon-button transition-all duration-300 text-sm text-white text-center px-4 py-2 rounded-full mt-5 self-center hover:bg-purple-600 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] cursor-pointer neon-text font-bold
              "
              onClick={() => setIsMobileOpen(false)}
            >
               Comprar Ingresso
            </a>
          </div>
        </div>
      )}
    </header>
  );
}