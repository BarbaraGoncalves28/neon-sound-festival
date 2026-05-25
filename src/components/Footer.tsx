import { ArrowUp } from "lucide-react";

export function Footer() {
    return (
<footer className="border-t border-purple-500/30 relative">
  <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

    {/* BRAND */}
    <div>
      <h3 className="text-2xl font-extrabold neon-text mb-4">
        Neon Sound Festival
      </h3>
      <p className="text-gray-400 text-sm">
        A experiência musical mais intensa da noite brasileira.
      </p>
    </div>

    {/* NAVEGAÇÃO */}
    <div>
      <h4 className="text-white font-semibold mb-4">Explorar</h4>
      <ul className="space-y-2 text-gray-400">
        <li><a href="/lineup" className="hover:text-purple-400">Line-up</a></li>
        <li><a href="/ingressos" className="hover:text-purple-400">Ingressos</a></li>
        <li><a href="/palcos" className="hover:text-purple-400">Palcos</a></li>
        <li><a href="/faq" className="hover:text-purple-400">FAQ</a></li>
      </ul>
    </div>

    {/* CONTATO */}
    <div>
      <h4 className="text-white font-semibold mb-4">Contato</h4>
      <ul className="space-y-2 text-gray-400">
        <li>contato@neonsoundfestival.com</li>
        <li>imprensa@neonsoundfestival.com</li>
        <li>Parcerias & Patrocínio</li>
      </ul>
    </div>

    {/* REDES */}
    <div>
      <h4 className="text-white font-semibold mb-4">Siga-nos</h4>
      <div className="flex gap-4 text-gray-400">
        <a href="#" className="hover:text-purple-400">Instagram</a>
        <a href="#" className="hover:text-purple-400">TikTok</a>
        <a href="#" className="hover:text-purple-400">YouTube</a>
      </div>
    </div>

  </div>

  {/* Linha inferior */}
  <div className="border-t border-purple-500/20 py-6 text-center text-gray-500 text-sm">
    ©Bárbara Gonçalves 2026 Neon Sound Festival. Todos os direitos reservados.
  </div>

  {/* BOTÃO VOLTAR AO TOPO */}
  <button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
    );
}