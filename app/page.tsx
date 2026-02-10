import RecargaCard from './components/RecargaCard';

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header con fusión de banderas */}
            <header className="relative bg-gradient-to-r from-[#009739] via-[#002A8F] to-[#002A8F] py-24 px-4 shadow-2xl overflow-hidden">
                {/* Adorno: Triángulo Rojo (Inspirado en Cuba) */}
                <div className="absolute top-0 left-0 w-32 h-full bg-[#CF142B] opacity-20 skew-x-[-20deg] -translate-x-16"></div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="flex justify-center gap-2 mb-6">
                        <span className="text-2xl">🇨🇺</span>
                        <span className="bg-yellow-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Conectando Fronteras
            </span>
                        <span className="text-2xl">🇧🇷</span>
                    </div>

                    <h1 className="text-6xl font-black text-white italic tracking-tighter mb-4 drop-shadow-lg">
                        NEXUS <span className="text-yellow-400">R&DAY</span>
                    </h1>

                    <p className="text-white text-xl font-medium max-w-2xl mx-auto opacity-90">
                        Envíos al instante de Brasil a Cuba.
                        <span className="block text-sm mt-2 font-light text-blue-100 italic">
              Rápido como o samba, seguro como a família.
            </span>
                    </p>
                </div>
            </header>

            {/* Contenedor de Ofertas */}
            <section className="max-w-6xl mx-auto px-4 -mt-12 pb-20">
                <div className="bg-white p-2 rounded-3xl shadow-xl border border-gray-100">
                    <RecargaCard />
                </div>
            </section>

            {/* Footer Estilo Bandera */}
            <footer className="bg-white border-t-4 border-[#CF142B] py-10 text-center">
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
                    © 2026 Nexus R&Day | Soluciones Inteligentes.
                </p>
                <div className="flex justify-center gap-4 mt-4 opacity-50">
                    <div className="w-8 h-1 bg-[#009739]"></div>
                    <div className="w-8 h-1 bg-[#FEDD00]"></div>
                    <div className="w-8 h-1 bg-[#002A8F]"></div>
                    <div className="w-8 h-1 bg-[#CF142B]"></div>
                </div>
            </footer>
        </main>
    );
}