'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function NexusUltra() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [tasas, setTasas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [monto, setMonto] = useState<number>(100);
    const [numero, setNumero] = useState('');
    const [fotoGrande, setFotoGrande] = useState<string | null>(null);

    // Carga de datos desde tu Excel
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
        <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">

            {/* SISTEMA DE PARTÍCULAS DIGITALES */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-blue-500/20 rounded-full blur-xl animate-pulse"
                        style={{
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 10 + 5}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* MALLA DE FONDO (GRID) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                {/* NAV ESTILO CRISTAL */}
                <nav className="flex justify-between items-center mb-24 bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#009739] to-[#002A8F] rounded-xl flex items-center justify-center font-black text-xl italic shadow-blue-500/20 shadow-lg">N</div>
                        <h1 className="font-black tracking-[0.2em] text-sm uppercase">Nexus <span className="text-blue-500">Premium</span></h1>
                    </div>
                    <div className="hidden md:flex gap-8 items-center">
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Status: <span className="text-emerald-500">Online</span></span>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <button className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Soporte</button>
                    </div>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* TEXTO DE IMPACTO */}
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sincronización en tiempo real</span>
                        </div>
                        <h2 className="text-7xl md:text-9xl font-black leading-[0.8] tracking-tighter italic uppercase">
                            Connect <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009739] via-white to-[#CF142B]">Global.</span>
                        </h2>
                        <p className="text-slate-500 text-xl font-medium max-w-md leading-relaxed">
                            Infraestructura avanzada para el envío de remesas y servicios digitales entre <span className="text-white">Brasil</span> y <span className="text-white">Cuba</span>.
                        </p>

                        <div className="flex items-center gap-8 opacity-40">
                            <div className="text-center">
                                <p className="text-2xl font-black">99.9%</p>
                                <p className="text-[8px] font-black uppercase tracking-widest">Uptime</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">AES-256</p>
                                <p className="text-[8px] font-black uppercase tracking-widest">Cifrado</p>
                            </div>
                        </div>
                    </div>

                    {/* INTERFAZ "NEXUS GLASS" */}
                    <div className="relative">
                        {/* Brillo perimetral */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-red-500 rounded-[3rem] blur-xl opacity-20 animate-pulse"></div>

                        <div className="relative bg-[#0A0F1E]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl">

                            {/* SELECTOR CATEGORÍAS */}
                            <div className="grid grid-cols-3 gap-3 mb-12">
                                {[
                                    {id:'RECARGAS', icon:'📱'}, {id:'TIENDA', icon:'🛒'}, {id:'DINERO', icon:'💸'}
                                ].map(cat => (
                                    <button key={cat.id} onClick={() => setCategoriaActiva(cat.id)}
                                            className={`flex flex-col items-center py-4 rounded-[2rem] transition-all border ${categoriaActiva === cat.id ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-transparent text-white/40 opacity-50 hover:opacity-100'}`}>
                                        <span className="text-xl mb-1">{cat.icon}</span>
                                        <span className="text-[8px] font-black tracking-widest uppercase">{cat.id}</span>
                                    </button>
                                ))}
                            </div>

                            {/* CALCULADORA / LISTA */}
                            <div className="min-h-[300px]">
                                {categoriaActiva === 'DINERO' ? (
                                    <div className="space-y-8 animate-in fade-in duration-700">
                                        <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Monto Envío (BRL)</p>
                                            <div className="flex items-baseline gap-4">
                                                <input type="number" value={monto} onChange={e => setMonto(Number(e.target.value))} className="bg-transparent text-5xl font-black outline-none w-full text-blue-500" />
                                                <span className="text-2xl font-black opacity-20 italic text-white">BRL</span>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-[#009739] to-[#014d1d] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                            <div className="absolute -right-4 -top-4 text-9xl font-black italic opacity-10 group-hover:scale-110 transition-transform">CU</div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-2">Total Recibido (CUP)</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black">{(monto * tasaActual).toLocaleString()}</span>
                                                <span className="text-xl font-black">CUP</span>
                                            </div>
                                            <div className="mt-6 flex justify-between items-center bg-black/20 p-3 rounded-2xl">
                                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Tasa Aplicada</span>
                                                <span className="text-xs font-black">1 : {tasaActual}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 no-scrollbar animate-in slide-in-from-bottom-4 duration-500">
                                        {todasLasOfertas.filter(o => o.categoria?.toLowerCase().includes(categoriaActiva.toLowerCase().slice(0,4))).map((o, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all">
                                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner">📦</div>
                                                <div className="flex-1">
                                                    <h4 className="text-[10px] font-black uppercase tracking-tight">{o.nombre}</h4>
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{o.descripcion?.slice(0, 40)}...</p>
                                                </div>
                                                <p className="text-xs font-black text-blue-400">{o.precio}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* FOOTER ACCIÓN */}
                            <div className="mt-12 space-y-4">
                                <div className="relative">
                                    <input type="text" placeholder="ID DE DESTINO / NÚMERO" value={numero} onChange={e => setNumero(e.target.value)}
                                           className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center font-black tracking-[0.2em] text-xs focus:border-blue-500 outline-none uppercase transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-white text-black py-5 rounded-3xl font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Contacto David</button>
                                    <button className="bg-blue-600 text-white py-5 rounded-3xl font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">Contacto Jonathan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MARCAS DE CONFIANZA */}
                <div className="mt-32 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 opacity-20 grayscale">
                    <span className="text-2xl font-black italic">PIX PAYMENT</span>
                    <span className="text-2xl font-black italic">ZELLE PRO</span>
                    <span className="text-2xl font-black italic">ETECSA HUB</span>
                    <span className="text-2xl font-black italic">BANK TRANSFER</span>
                </div>
            </div>

            {/* MODAL IMAGEN */}
            {fotoGrande && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setFotoGrande(null)}>
                    <img src={fotoGrande} className="max-w-full max-h-[80vh] rounded-[3rem] shadow-2xl border border-white/10" />
                </div>
            )}
        </main>
    );
}