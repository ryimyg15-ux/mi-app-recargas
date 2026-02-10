import RecargaCard from './components/RecargaCard';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#002A8F] via-[#f8fafc] to-white">
            {/* Encabezado Compacto y Elegante */}
            <header className="relative bg-[#002A8F] pt-8 pb-20 px-4 overflow-hidden">
                {/* Luces de fondo ajustadas */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-[80px]"></div>

                {/* Barra informativa compacta con efecto de brillo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-[30px] transition-all duration-500 hover:border-white/30">
                    <div className="flex items-center gap-4 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10 group cursor-default">
                        <span className="text-blue-400 text-xl font-bold italic transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">01</span>
                        <p className="text-white text-xs font-bold uppercase tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">Procesado en minutos</p>
                    </div>

                    <div className="flex items-center gap-4 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10 group cursor-default">
                        <span className="text-green-400 text-xl font-bold italic transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">02</span>
                        <p className="text-white text-xs font-bold uppercase tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">Pago PIX o SEPA/IBAN</p>
                    </div>

                    <div className="flex items-center gap-4 px-4 py-2 group cursor-default">
                        <span className="text-yellow-400 text-xl font-bold italic transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">03</span>
                        <p className="text-white text-xs font-bold uppercase tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">Tasa: 1€ = 5.50 BRL</p>
                    </div>
                </div>

                {/* Línea superior decorativa */}
                <div className="absolute top-0 left-0 w-full h-1 flex">
                    <div className="flex-1 bg-[#009739]"></div>
                    <div className="flex-1 bg-[#FEDD00]"></div>
                    <div className="flex-1 bg-[#002A8F]"></div>
                    <div className="flex-1 bg-[#CF142B]"></div>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Nav más ajustado */}
                    <nav className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-[#002A8F] font-black text-lg">N</span>
                            </div>
                            <span className="text-white font-bold tracking-tighter text-xl">
                                NEXUS <span className="text-blue-300 font-light">R&DAY</span>
                            </span>
                        </div>
                        <div className="hidden md:flex gap-6 text-blue-100/70 text-xs font-bold uppercase tracking-widest">
                            <span className="hover:text-white cursor-pointer transition-colors">Servicios</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Nosotros</span>
                            <span className="border border-white/20 px-3 py-1 rounded-full text-white bg-white/5">Soporte 24/7</span>
                        </div>
                    </nav>

                    {/* Hero Grid más pequeño */}
                    <div className="grid md:grid-cols-2 gap-8 items-center mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-black text-blue-100 tracking-[0.2em] uppercase">Sistema Live</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                                Conectando <span className="text-blue-300">Mundos</span> <br />
                                en Segundos.
                            </h1>

                            <p className="text-sm md:text-base text-blue-100/70 font-medium leading-relaxed max-w-sm">
                                Premium Hub de recargas para Cuba desde Brasil y Europa.
                                Rapidez garantizada y seguridad bancaria.
                            </p>
                        </div>

                        {/* Widget de confianza simplificado */}
                        <div className="hidden md:flex gap-4">
                            <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-3xl">
                                <p className="text-white font-bold text-sm mb-1">PIX Inmediato</p>
                                <p className="text-blue-200/50 text-[10px] uppercase font-bold tracking-widest">Brasil</p>
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-3xl">
                                <p className="text-white font-bold text-sm mb-1">Entrega Directa</p>
                                <p className="text-blue-200/50 text-[10px] uppercase font-bold tracking-widest">Sin Intermediarios</p>
                            </div>
                        </div>
                    </div>

                    {/* ¿Cómo funciona? - Versión Compacta */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-[30px]">
                        <div className="flex items-center gap-4 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10">
                            <span className="text-blue-400 text-xl font-bold italic">01</span>
                            <p className="text-white text-xs font-bold uppercase tracking-tighter">Procesado en minutos</p>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10">
                            <span className="text-green-400 text-xl font-bold italic">02</span>
                            <p className="text-white text-xs font-bold uppercase tracking-tighter">Pago PIX o SEPA/IBAN</p>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-2">
                            <span className="text-yellow-400 text-xl font-bold italic">03</span>
                            <p className="text-white text-xs font-bold uppercase tracking-tighter text-nowrap">Tasa: 1€ = 5.50 BRL</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Configurador */}
            <div className="relative -mt-12 px-4 pb-20">
                <div className="max-w-4xl mx-auto drop-shadow-[0_20px_50px_rgba(0,42,143,0.15)]">
                    <RecargaCard />
                </div>
            </div>

            <footer className="py-12 text-center text-slate-400">
                <div className="flex justify-center gap-6 mb-4 opacity-20 grayscale text-sm font-black">
                    <span>PIX</span><span>ZELLE</span><span>ETECSA</span><span>IBAN</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 Nexus R&DAY • Tecnologia em Recargas</p>
            </footer>


        </main>
    );
}