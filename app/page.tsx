'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function NexusPremium() {
    // --- ESTADOS ---
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [tasas, setTasas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [monto, setMonto] = useState<number>(100);
    const [numero, setNumero] = useState('');
    const [fotoGrande, setFotoGrande] = useState<string | null>(null);

    // --- CARGA DE DATOS (Tu Excel) ---
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
    const ofertasFiltradas = todasLasOfertas.filter(o => o.categoria?.trim().toLowerCase() === servicio.trim().toLowerCase());

    return (
        <main className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">

            {/* AMBIENTE VISUAL (AURAS) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#009739]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#CF142B]/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

                {/* HEADER MINIMALISTA */}
                <header className="flex justify-between items-center mb-16 backdrop-blur-md bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">N</div>
                        <h1 className="font-black tracking-widest text-sm uppercase">Nexus <span className="text-blue-500">R&Day</span></h1>
                    </div>
                    <div className="hidden md:flex gap-8 text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
                        <span className="hover:opacity-100 cursor-pointer transition-all">Seguridad</span>
                        <span className="hover:opacity-100 cursor-pointer transition-all">Tasas</span>
                        <span className="hover:opacity-100 cursor-pointer transition-all">Ayuda</span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: TEXTO IMPACTO */}
                    <div className="lg:col-span-5 space-y-8 pt-10">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                            Direct Connection • BR ↔ CU
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter italic">
                            EL FUTURO ES <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-emerald-400">DIRECTO.</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Olvídate de las esperas. Envía dinero y recargas con la infraestructura más potente del mercado.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <div className="p-4 bg-white/5 rounded-3xl border border-white/5 flex-1">
                                <p className="text-2xl font-black text-emerald-500">2min</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase">Tiempo promedio</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-3xl border border-white/5 flex-1">
                                <p className="text-2xl font-black text-blue-500">24/7</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase">Soporte Activo</p>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: LA APP (GLASS CARD) */}
                    <div className="lg:col-span-7 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">

                            {/* SELECTOR CATEGORÍAS */}
                            <div className="grid grid-cols-3 gap-3 mb-10">
                                {[
                                    {id:'RECARGAS', icon:'📱', s:['Recarga (ETECSA)', 'Recarga (NAUTA)']},
                                    {id:'TIENDA', icon:'🛒', s:['Combo de Comida/Aseo', 'Electrodomésticos']},
                                    {id:'DINERO', icon:'💸', s:['Envío de Dinero']}
                                ].map(cat => (
                                    <button key={cat.id} onClick={() => { setCategoriaActiva(cat.id); setServicio(cat.s[0]); }}
                                            className={`p-4 rounded-3xl transition-all border flex flex-col items-center gap-2 ${categoriaActiva === cat.id ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20 scale-105' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}>
                                        <span className="text-xl">{cat.icon}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest">{cat.id}</span>
                                    </button>
                                ))}
                            </div>

                            {/* SELECTOR SUB-SERVICIO */}
                            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
                                {categoriaActiva !== 'DINERO' && (
                                    [...new Set(todasLasOfertas.filter(o => o.categoria?.includes(categoriaActiva === 'RECARGAS' ? 'Recarga' : '')).map(o => o.categoria))].map(s => (
                                        <button key={s} onClick={() => setServicio(s)}
                                                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${servicio === s ? 'bg-white text-black' : 'bg-white/5 text-white/40'}`}>
                                            {s}
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* CONTENIDO DINÁMICO */}
                            <div className="min-h-[280px]">
                                {categoriaActiva === 'DINERO' ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center px-4">
                                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Calculadora de Envío</span>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Tasa: 1:{tasaActual}</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                                                <p className="text-[8px] font-black opacity-40 uppercase mb-2">Tú envías (BRL)</p>
                                                <input type="number" value={monto} onChange={e => setMonto(Number(e.target.value))} className="bg-transparent text-4xl font-black outline-none w-full" />
                                            </div>
                                            <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl shadow-blue-500/20">
                                                <p className="text-[8px] font-black opacity-70 uppercase mb-2">Reciben (CUP)</p>
                                                <p className="text-4xl font-black">{(monto * tasaActual).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                {l:'10+', v:tasas.r1}, {l:'100+', v:tasas.r2}, {l:'500+', v:tasas.r3}, {l:'1000+', v:tasas.r4}
                                            ].map((t, i) => (
                                                <div key={i} className={`p-3 rounded-2xl border text-center ${tasaActual === t.v ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 opacity-30'}`}>
                                                    <p className="text-[7px] font-black">{t.l}</p>
                                                    <p className="text-xs font-black">{t.v}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                        {ofertasFiltradas.map((o, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-white/20 transition-all group/item">
                                                {o.foto ? (
                                                    <img src={o.foto} onClick={() => setFotoGrande(o.foto!)} className="w-12 h-12 rounded-xl object-cover cursor-zoom-in" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">📦</div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black uppercase">{o.nombre}</p>
                                                    <p className="text-[8px] opacity-40 font-bold uppercase tracking-tighter">{o.descripcion}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-emerald-400">{o.precio}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ACCIÓN FINAL */}
                            <div className="mt-10 space-y-4">
                                <input type="text" placeholder="Número de teléfono o Tarjeta" value={numero} onChange={e => setNumero(e.target.value)}
                                       className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center font-black tracking-widest text-sm focus:bg-white/10 transition-all outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all">Jonathan WhatsApp</button>
                                    <button className="bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all">David WhatsApp</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">© 2026 Nexus Premium Systems</p>
                    <div className="flex gap-10 opacity-20 grayscale">
                        <span className="text-lg font-black italic">PIX</span>
                        <span className="text-lg font-black italic">ZELLE</span>
                        <span className="text-lg font-black italic">ETECSA</span>
                    </div>
                </footer>
            </div>

            {/* MODAL FOTO */}
            {fotoGrande && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setFotoGrande(null)}>
                    <img src={fotoGrande} className="max-w-full max-h-[80vh] rounded-[2rem] shadow-2xl shadow-blue-500/20" />
                    <p className="absolute bottom-10 font-black text-[10px] uppercase tracking-[0.5em]">Toca para cerrar</p>
                </div>
            )}
        </main>
    );
}