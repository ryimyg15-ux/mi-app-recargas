'use client';
import RecargaCard from './components/RecargaCard';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0F172A] relative overflow-hidden font-sans">
            {/* Fondo Decorativo Estilo Bandera */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#009739] rounded-full blur-[150px]"></div>
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#CF142B] rounded-full blur-[150px]"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[70%] h-[50%] bg-[#002A8F] rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
                {/* Header Minimalista */}
                <nav className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <span className="text-[#002A8F] font-black text-2xl">N</span>
                        </div>
                        <div>
                            <h1 className="text-white font-black tracking-tighter text-2xl leading-none">NEXUS</h1>
                            <span className="text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase">R&DAY Premium</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex gap-6 text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                            <span className="hover:text-white cursor-pointer transition-colors">Servicios</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Nosotros</span>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full text-white text-[10px] font-black tracking-widest transition-all">
                            SOPORTE 24/7
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-12">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Global Connection System</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 italic tracking-tighter">
                            Conectando <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-green-400">
                Mundos.
              </span>
                        </h2>

                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                            La plataforma más rápida y segura para enviar recargas y combos a Cuba.
                            Tecnología de punta con el respaldo de <span className="text-white font-bold italic">Nexus R&DAY</span>.
                        </p>

                        {/* Badges de Confianza */}
                        <div className="flex gap-4 mt-10">
                            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-white font-bold text-sm">PIX</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Inmediato</p>
                            </div>
                            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-white font-bold text-sm">Directo</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Sin Terceros</p>
                            </div>
                        </div>
                    </div>

                    {/* El Configurador (RecargaCard) */}
                    <div className="relative group">
                        {/* Brillo de fondo para la tarjeta */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-[45px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-[#F1F5F9] rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
                            <RecargaCard />
                        </div>
                    </div>
                </div>

                {/* Barra Informativa Estilo Banner */}
                <div className="grid md:grid-cols-3 gap-6 bg-white/5 border border-white/10 rounded-[35px] p-2 backdrop-blur-md">
                    <div className="flex items-center gap-5 p-5 bg-white/5 rounded-[28px] border border-white/5">
                        <span className="text-blue-500 font-black text-2xl italic tracking-tighter">01</span>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">Procesado en <br/> cuestión de minutos</p>
                    </div>
                    <div className="flex items-center gap-5 p-5 bg-white/5 rounded-[28px] border border-white/5">
                        <span className="text-green-500 font-black text-2xl italic tracking-tighter">02</span>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">Pagos por PIX <br/> o SEPA/IBAN</p>
                    </div>
                    <div className="flex items-center gap-5 p-5 bg-white/5 rounded-[28px] border border-white/5">
                        <span className="text-yellow-500 font-black text-2xl italic tracking-tighter">03</span>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">Tasa Oficial: <br/> 1 EUR = 5.50 BRL</p>
                    </div>
                </div>

                <footer className="mt-20 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                        © 2026 Nexus R&DAY • Premium Connectivity
                    </p>
                    <div className="flex gap-8 opacity-20 grayscale">
                        <span className="text-white text-xl font-black italic">PIX</span>
                        <span className="text-white text-xl font-black italic">ZELLE</span>
                        <span className="text-white text-xl font-black italic">ETECSA</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}