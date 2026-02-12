'use client';
import RecargaCard from './components/RecargaCard';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans selection:bg-blue-500/30">

            {/* FONDO CINEMÁTICO: Mesh Gradients Suaves */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Luz de acento superior */}
                <div className="absolute top-[-20%] left-[10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                {/* Luz de acento inferior */}
                <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[100px]"></div>

                {/* Grid sutil de fondo */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-6">

                {/* HEADER CORPORATIVO */}
                <nav className="flex justify-between items-center mb-20 backdrop-blur-md bg-black/5 p-4 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
                                <span className="text-black font-black text-xl tracking-tighter">N</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-white font-black tracking-widest text-lg leading-none">NEXUS</h1>
                            <span className="text-slate-500 text-[8px] font-black tracking-[0.4em] uppercase">R&DAY PREMIUM</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <div className="flex gap-8 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                            <span className="hover:text-blue-400 cursor-pointer transition-all hover:translate-y-[-1px]">Servicios</span>
                            <span className="hover:text-blue-400 cursor-pointer transition-all hover:translate-y-[-1px]">Tarifas</span>
                            <span className="hover:text-blue-400 cursor-pointer transition-all hover:translate-y-[-1px]">Soporte</span>
                        </div>
                        <div className="h-6 w-[1px] bg-white/10"></div>
                        <button className="relative group overflow-hidden bg-white px-8 py-3 rounded-full transition-all active:scale-95">
                            <span className="relative z-10 text-black text-[10px] font-black tracking-widest uppercase">Iniciar Operación</span>
                        </button>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
                    <div className="pt-10">
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-10 backdrop-blur-xl">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-blue-100 text-[9px] font-black uppercase tracking-[0.3em]">Sistema de Enlace Global</span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-10 tracking-tighter">
                            Pure <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-600 animate-gradient-x">
                                Connection.
                            </span>
                        </h2>

                        <p className="text-slate-400 text-lg font-light leading-relaxed max-w-lg mb-12">
                            Simplificamos la logística de envíos y recargas con <span className="text-white font-medium italic">tecnología de grado bancario</span>. Rápido, privado y sin intermediarios.
                        </p>

                        {/* MÉTRICAS / TRUST BOX */}
                        <div className="flex flex-wrap gap-4">
                            {[
                                {label: 'TIEMPO MEDIO', val: '2.4 min'},
                                {label: 'PAÍSES', val: '12+ Global'},
                                {label: 'SEGURIDAD', val: 'End-to-End'}
                            ].map((stat, i) => (
                                <div key={i} className="px-6 py-4 bg-gradient-to-b from-white/5 to-transparent rounded-[24px] border border-white/10">
                                    <p className="text-slate-500 text-[7px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-white font-bold text-sm tracking-tight">{stat.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WRAPPER DEL CONFIGURADOR */}
                    <div className="relative mx-auto w-full max-w-[440px]">
                        {/* Efecto de Aura Radiante detrás de la tarjeta */}
                        <div className="absolute -inset-10 bg-blue-600/20 rounded-full blur-[100px] opacity-50"></div>

                        {/* Borde de luz sutil */}
                        <div className="relative p-[1px] rounded-[50px] bg-gradient-to-b from-white/20 to-transparent shadow-2xl">
                            <div className="bg-[#0A0A0A] rounded-[49px] overflow-hidden shadow-2xl border border-white/5">
                                <RecargaCard />
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -right-6 top-20 bg-emerald-500 text-black px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-tighter -rotate-12 shadow-2xl border-2 border-[#0A0A0A]">
                            Tasa Actualizada
                        </div>
                    </div>
                </div>

                {/* BANNER DE VALORES */}
                <div className="grid md:grid-cols-3 gap-4 pb-20">
                    {[
                        {n: '01', t: 'Velocidad Crítica', d: 'Infraestructura optimizada para entrega inmediata.'},
                        {n: '02', t: 'Multidivisa Real', d: 'Soporte nativo para BRL, USD, EUR y CUP.'},
                        {n: '03', t: 'Soporte Directo', d: 'Atención personalizada sin bots de espera.'}
                    ].map((item, i) => (
                        <div key={i} className="group p-8 bg-white/[0.02] border border-white/[0.05] rounded-[40px] hover:bg-white/[0.05] transition-all hover:border-white/10">
                            <span className="block text-blue-500 font-black text-3xl mb-4 italic tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">{item.n}</span>
                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">{item.t}</h4>
                            <p className="text-slate-500 text-[11px] leading-relaxed uppercase font-medium">{item.d}</p>
                        </div>
                    ))}
                </div>

                <footer className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">
                            © 2026 Nexus R&DAY Premium Systems
                        </p>
                    </div>

                    <div className="flex items-center gap-10 opacity-30">
                        <div className="flex flex-col items-center">
                            <span className="text-white text-[10px] font-black tracking-widest uppercase">Encryption</span>
                            <span className="text-blue-500 text-[8px] font-bold tracking-widest">AES-256</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/20"></div>
                        <div className="flex gap-6 italic font-black text-slate-400 text-sm">
                            <span>PIX</span>
                            <span>ZELLE</span>
                            <span>SEPA</span>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}