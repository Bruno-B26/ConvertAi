export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      {/* Coluna esquerda — hero */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid de fundo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,197,94,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-green-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3 3 7-7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">ConvertAI</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10">
          <div className="inline-block mb-6">
            <span className="text-xs font-mono font-semibold tracking-widest text-green-400 bg-green-400/10 border border-green-400/30 px-3 py-1 rounded-full uppercase">
              Automação + IA de Prospecção
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Sua máquina de<br />
            prospecção nunca<br />
            dorme.
          </h1>

          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            A IA busca, você aprova, o disparo no WhatsApp roda sozinho — dentro do ritmo que você define.
          </p>

          <div className="mt-8">
            <span className="text-green-400 text-sm font-mono">
              ▲ 12.400 mensagens disparadas sem soar spam
            </span>
          </div>
        </div>

        {/* Rodapé da coluna */}
        <div className="relative z-10">
          <p className="text-gray-600 text-xs">© 2026 ConvertAI. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Coluna direita — formulário */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 lg:p-16">
        {/* Logo mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-md bg-green-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3 3 7-7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">ConvertAI</span>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
