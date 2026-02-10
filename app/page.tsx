import RecargaCard from './components/RecargaCard';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            {/* Encabezado Ultra Elegante */}
            <header className="relative bg-[#002A8F] pt-16 pb-32 px-4 overflow-hidden">
                {/* Elementos decorativos de fondo (luces sutiles) */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]"></div>

                {/* Línea superior decorativa (Banderas) */}
                <div className="absolute top-0 left-0 w-full h-1.5 flex">
                    <div className="flex-1 bg-[#009739]"></div> {/* Brasil */}
                    <div className="flex-1 bg-[#FEDD00]"></div> {/* Brasil */}
                    <div className="flex-1 bg-[#002A8F]"></div> {/* Cuba */}
                    <div className="flex-1 bg-[#CF142B]"></div> {/* Cuba */}
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <nav className="flex justify-between items-center mb-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-[#002A8F] font-black text-xl">N</span>
                            </div>
                            <span className="text-white font-bold tracking-tighter text-2xl">
                NEXUS <span className="text-blue-300 font-light text-xl">R&DAY</span>
              </span>
                        </div>
                        <div className="hidden md:flex gap-6 text-blue-100/70 text-sm font-medium">
                            <span className="hover:text-white cursor-pointer transition-colors">SERVICIOS</span>
                            <span className="hover:text-white cursor-pointer transition-colors">NOSOTROS</span>
                            <span className="bg-white/10 px-4 py-1 rounded-full text-white border border-white/20">SOPORTE 24/7</span>
                        </div>
                    </nav>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                                <span className="text-xs font-bold text-blue-100 tracking-widest uppercase">Sistema de Envío Operativo</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                                Conectando <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                  Mundos en Segundos.
                </span>
                            </h1>

                            <p className="text-lg text-blue-100/80 font-light leading-relaxed max-w-md">
                                Soluciones premium de recargas y combos para Cuba desde Brasil.
                                Seguridad bancaria y rapidez garantizada en cada operación.
                            </p>
                        </div>

                        <div className="hidden md:block relative">
                            {/* Widget visual de confianza */}
                            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-2xl">✓</div>
                                        <div>
                                            <p className="text-white font-bold">Transferencias PIX</p>
                                            <p className="text-blue-200/60 text-sm">Procesamiento inmediato</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-2xl">⚡</div>
                                        <div>
                                            <p className="text-white font-bold">Entrega Directa</p>
                                            <p className="text-blue-200/60 text-sm">Sin intermediarios en Cuba</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cuerpo de la aplicación (El Configurador) */}
            <div className="relative -mt-20 px-4">
                <RecargaCard />
            </div>

            <footer className="py-20 text-center text-slate-400">
                <div className="flex justify-center gap-8 mb-6 opacity-30 grayscale">
                    <span className="text-2xl font-bold italic">PIX</span>
                    <span className="text-2xl font-bold italic">ZELLE</span>
                    <span className="text-2xl font-bold italic">ETECSA</span>
                </div>
                <p className="text-sm">© 2026 Nexus R&DAY • Tecnologia em Recargas Internacionais</p>
            </footer>
        </main>
    );
}