'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function NexusUltimate() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [tasas, setTasas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [monto, setMonto] = useState<number>(100);
    const [numero, setNumero] = useState('');
    const [fotoGrande, setFotoGrande] = useState<string | null>(null);

    // Carga de datos
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);
                const buscarTasa = (n: string, d: number) => {
                    const f = data.find((o: any) => o.nombre?.includes(n));
                    return f ? parseFloat(f.precio.replace(/[^0-9.]/g, '')) : d;
                };
                setTasas({
                    r1: buscarTasa('Tasa Rango 1', 92),
                    r2: buscarTasa('Tasa Rango 2', 96),
                    r3: buscarTasa('Tasa Rango 3', 97),
                    r4: buscarTasa('Tasa Rango 4', 98)
                });
            }
        });
    }, []);

    const tasaActual = monto >= 1000 ? tasas.r4 : monto >= 500 ? tasas.r3 : monto >= 100 ? tasas.r2 : tasas.r1;

    // Lógica de la Barra de Progreso (Basada en 10 dígitos)
    const progreso = Math.min((numero.length / 10) * 100, 100);
    const esNumeroValido = numero.length >= 8;

    return (
        <main className="min-h-screen bg-[#02040a] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">

            {/* BACKGROUND ANIMADO */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <span className="text-black font-black text-xl italic">N</span>
                        </div>
                        <h1 className="font-black tracking-[0.3em] text-[10px] uppercase">Nexus <span className="text-blue-500">Systems</span></h1>
                    </div>
                </header>

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* COLUMNA INFO */}
                    <div className="space-y-8">
                        <h2 className="text-7xl md:text-9xl font-black leading-none tracking-tighter uppercase italic">
                            Fast <br /> <span className="text-blue-500">Flow.</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-sm">
                            La plataforma de enlace directo entre el sistema bancario de <span className="text-white">Brasil</span> y servicios en <span className="text-white">Cuba</span>.
                        </p>
                    </div>

                    {/* INTERFAZ APP */}
                    <div className="relative">
                        {/* Brillo dinámico si el número es válido */}
                        <div className={`absolute -inset-1 rounded-[3rem] blur-2xl transition-all duration-1000 ${esNumeroValido ? 'bg-emerald-500/20 opacity-100' : 'bg-blue-500/10 opacity-50'}`}></div>

                        <div className="relative bg-[#0d111c] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">

                            {/* BARRA DE PROGRESO SUPERIOR */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${progreso}%` }}
                                ></div>
                            </div>

                            {/* SELECTOR CATEGORÍAS */}
                            <div className="grid grid-cols-3 gap-2 mb-10">
                                {['RECARGAS', 'TIENDA', 'DINERO'].map(cat => (
                                    <button key={cat} onClick={() => setCategoriaActiva(cat)}
                                            className={`py-3 rounded-2xl text-[8px] font-black tracking-widest transition-all ${categoriaActiva === cat ? 'bg-white text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* ÁREA DE TRABAJO */}
                            <div className="min-h-[260px] flex flex-col justify-center">
                                {categoriaActiva === 'DINERO' ? (
                                    <div className="space-y-6">
                                        <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Monto PIX (BRL)</label>
                                            <input type="number" value={monto} onChange={e => setMonto(Number(e.target.value))}
                                                   className="bg-transparent text-5xl font-black w-full outline-none text-white" />
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-900/20">
                                            <div>
                                                <p className="text-[8px] font-black uppercase opacity-60 mb-1 text-white">Reciben en Cuba</p>
                                                <p className="text-4xl font-black text-white">{(monto * tasaActual).toLocaleString()} <span className="text-sm opacity-50 font-bold">CUP</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black uppercase opacity-60 mb-1 text-white">Tasa</p>
                                                <p className="text-sm font-black text-white">1:{tasaActual}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 max-h-[260px] overflow-y-auto no-scrollbar">
                                        {todasLasOfertas.filter(o => o.categoria?.toLowerCase().includes(categoriaActiva.toLowerCase().slice(0,3))).map((o, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase">{o.nombre}</p>
                                                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-tighter">{o.descripcion?.slice(0,30)}</p>
                                                </div>
                                                <p className="text-xs font-black text-emerald-500">{o.precio}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SECCIÓN DE DESTINO CON PROGRESO */}
                            <div className="mt-10 space-y-6">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="NÚMERO DE DESTINO"
                                        value={numero}
                                        onChange={e => setNumero(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center font-black tracking-[0.3em] text-xs focus:bg-white/[0.08] transition-all outline-none"
                                    />
                                    {/* Indicador de "Listo" */}
                                    {esNumeroValido && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-bounce">
                                            ✓
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-white text-black py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:invert transition-all active:scale-95">
                                        Jonathan Pay
                                    </button>
                                    <button className="bg-blue-600 text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:brightness-125 transition-all active:scale-95">
                                        David Pay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="mt-32 opacity-20 flex justify-between items-center border-t border-white/10 pt-8">
                    <p className="text-[8px] font-black tracking-[0.5em] uppercase">© 2026 Nexus R&Day Logistics</p>
                    <div className="flex gap-6 font-black italic text-xs">
                        <span>SSL</span>
                        <span>PIX</span>
                        <span>CUP</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}