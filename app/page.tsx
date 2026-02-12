'use client';
import RecargaCard from './components/RecargaCard';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">

            {/* FONDO DE FUSIÓN DE BANDERAS (Abstracto y Elegante) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                {/* Lado Brasil (Verde/Amarillo) - Esquina Superior Izquierda */}
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-[#009739] to-[#FFDF00] rounded-full blur-[140px] opacity-30"></div>

                {/* Lado Cuba (Azul/Rojo) - Esquina Inferior Derecha */}
                <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-tl from-[#CF142B] to-[#002A8F] rounded-full blur-[140px] opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* NAV PREMIUM */}
                <nav className="flex justify-between items-center mb-16 bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#009739] to-[#002A8F] rounded-2xl blur-sm opacity-50"></div>
                            <div className="relative w-12 h-12 bg-[#002A8F] rounded-xl flex items-center justify-center shadow-xl">
                                <span className="text-white font-black text-2xl tracking-tighter italic">N</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-[#002A8F] font-black tracking-tighter text-2xl leading-none">NEXUS</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-[8px] font-black tracking-[0.3em] uppercase">Premium Bridge</span>
                                <div className="flex gap-1">
                                    <span className="w-2 h-1 bg-[#009739] rounded-full"></span>
                                    <span className="w-2 h-1 bg-[#CF142B] rounded-full"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button className="bg-gradient-to-r from-[#009739] to-[#002A8F] text-white px-8 py-3 rounded-full text-[10px] font-black tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
                            SOPORTE WHATSAPP
                        </button>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                            <span className="flex gap-1">
                                <span className="w-3 h-3 rounded-full bg-[#009739]"></span>
                                <span className="w-3 h-3 rounded-full bg-[#002A8F]"></span>
                                <span className="w-3 h-3 rounded-full bg-[#CF142B]"></span>
                            </span>
                            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Brazil ⟷ Cuba Direct Link</span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black text-[#002A8F] leading-[0.9] tracking-tighter">
                            De Corazón <br />
                            <span className="text-[#009739]">a Corazón.</span>
                        </h2>

                        <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-lg">
                            La unión perfecta entre la agilidad del <span className="text-[#009739] font-bold">PIX Brasileño</span> y la alegría de recibir en <span className="text-[#CF142B] font-bold">Cuba</span>. Sin vueltas, sin esperas.
                        </p>

                        {/* FLOW STEPS */}
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                <div className="w-12 h-12 rounded-full bg-[#009739] border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">BR</div>
                                <div className="w-12 h-12 rounded-full bg-[#CF142B] border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">CU</div>
                            </div>
                            <div className="h-[1px] w-12 bg-slate-300"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                                Transferencias <br/> Instantáneas
                            </p>
                        </div>
                    </div>

                    {/* TARJETA DE RECARGA (El componente) */}
                    <div className="relative group">
                        {/* El "Brillo" con los colores de la bandera */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#009739] via-[#FFDF00] to-[#CF142B] rounded-[3.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>

                        <div className="relative bg-white rounded-[3rem] shadow-2xl border border-white p-2">
                            <div className="rounded-[2.5rem] overflow-hidden bg-white">
                                <RecargaCard />
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO BANNER */}
                <div className="grid md:grid-cols-4 gap-4">
                    {[
                        {color: '#009739', t: 'PIX', d: 'Pago Local Brasil'},
                        {color: '#002A8F', t: 'ETECSA', d: 'Recarga Directa'},
                        {color: '#CF142B', t: 'COMBOS', d: 'Entrega en Mano'},
                        {color: '#FFDF00', t: 'SEGURIDAD', d: 'Nexus Certified'}
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full" style={{backgroundColor: item.color}}></div>
                            <h4 className="font-black text-sm text-[#002A8F] mb-1">{item.t}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.d}</p>
                        </div>
                    ))}
                </div>

                <footer className="mt-20 py-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                        © 2026 Nexus R&DAY Premium Connectivity
                    </p>
                    <div className="flex gap-4 items-center">
                        <span className="w-8 h-5 bg-[#009739] rounded-sm opacity-50"></span>
                        <span className="w-8 h-5 bg-[#002A8F] rounded-sm opacity-50"></span>
                        <span className="w-8 h-5 bg-[#CF142B] rounded-sm opacity-50"></span>
                    </div>
                </footer>
            </div>
        </main>
    );
}