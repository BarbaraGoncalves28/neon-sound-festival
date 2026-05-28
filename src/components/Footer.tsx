import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="relative border-t border-purple-500/30 bg-black/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 xl:grid-cols-4">
        {/* BRAND */}
        <div>
          <h3 className="text-2xl font-extrabold neon-text mb-4">
            Neon Sound Festival
          </h3>
          <p className="text-sm leading-6 text-gray-300">
            A experiência musical mais intensa da noite brasileira.
          </p>
        </div>

        {/* NAVEGAÇÃO */}
        <div>
          <h4 className="text-white font-semibold mb-4">Explorar</h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/lineup" className="transition hover:text-purple-300">
                Line-up
              </Link>
            </li>
            <li>
              <Link
                to="/ingressos"
                className="transition hover:text-purple-300"
              >
                Ingressos
              </Link>
            </li>
            <li>
              <Link
                to="/meus-ingressos"
                className="transition hover:text-purple-300"
              >
                Meus ingressos
              </Link>
            </li>
            <li>
              <Link to="/" className="transition hover:text-purple-300">
                Experiência
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTATO */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contato</h4>
          <ul className="space-y-2 text-gray-300">
            <li>contato@neonsoundfestival.com</li>
            <li>imprensa@neonsoundfestival.com</li>
            <li>Parcerias & Patrocínio</li>
          </ul>
        </div>

        {/* REDES */}
        <div>
          <h4 className="text-white font-semibold mb-4">Siga-nos</h4>
          <div className="flex flex-wrap gap-4 text-gray-300">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-purple-300"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-purple-300"
            >
              TikTok
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-purple-300"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="border-t border-purple-500/20 px-6 py-6 text-center text-sm text-gray-400">
        ©Bárbara Gonçalves 2026 Neon Sound Festival. Todos os direitos
        reservados.
      </div>

      {/* BOTÃO VOLTAR AO TOPO */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Voltar ao topo da página"
        className="
  cursor-pointer
    absolute
    right-6
    bottom-20
    w-12
    h-12
    flex
    items-center
    justify-center
    rounded-full
    bg-zinc-900
    border
    border-purple-500
    text-purple-400
    transition-all
    duration-300
    hover:bg-purple-600
    hover:text-white
    hover:shadow-[0_0_20px_var(--neon-purple)]
    hover:scale-110
  "
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  )
}
