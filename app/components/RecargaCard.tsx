'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function NexusUltimateExperience() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [tasas, setTasas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [monto, setMonto] = useState<number>(100);
    const [numero, setNumero] = useState('');

    // --- SISTEMA DE AUDIO DIGITAL ---
    const playClick = () => {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.1);
    };

    // --- LIMPIADOR DE PRECIOS (FIX COMA) ---
    const limpiarPrecio = (valorStr: string): number => {
        if (!valorStr) return 0;
        // Quita símbolos, espacios, y cambia la coma por punto
        const limpio = valorStr.replace('R$', '').replace(/\s/g, '').replace(',', '.');
        return parseFloat(limpio) || 0;
    };

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
                    return f ? limpiarPrecio(f.precio) : d;
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
    const progreso = Math.min((numero.length / 10) * 100, 100);

    const handleTabChange = (cat: string) => {
        playClick();
        setCategoriaActiva(cat);
    };

    return (
        <main className="min-h-screen bg-[#010204] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">

            {/* AMBIENTE DE PARTÍCULAS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                {/* BRANDING */}
                <div className="flex items-center gap-4 mb-20 justify-center md:justify-start">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-black font-black text-2xl italic">N</span>
                    </div>
                    <div>
                        <h1 className="font-black tracking-[0.4em] text-xs uppercase">Nexus R&Day</h1>
                        <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Premium Logistics</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    <div className="hidden lg:block space-y-6">
                        <h2 className="text-8xl font-black leading-none tracking-tighter italic uppercase">
                            Fast <br /> <span className="text-blue-600">Secure</span> <br /> Money.
                        </h2>
                        <div className="h-[1px] w-20 bg-blue-500"></div>
                        <p className="text-slate-500 text-lg max-w-xs font-medium">
                            Transferencias inmediatas con el respaldo de la red Nexus.
                            Sin errores de tasa, sin esperas.
                        </p>
                    </div>

                    {/* APP CARD */}
                    <div className="relative group">
                        <div className={`absolute -inset-1 rounded-[3rem] blur-2xl transition-all duration-1000 bg-blue-500/20 opacity-40 group-hover:opacity-60`}></div>

                        <div className="relative bg-[#080a12] border border-white/5 rounded-[3rem] p-8 shadow-3xl overflow-hidden backdrop-blur-xl">

                            {/* PROGRESS BAR */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-700 ease-out"
                                    style={{ width: `${progreso}%` }}
                                ></div>
                            </div>

                            {/* TABS */}
                            <div className="flex gap-2 mb-10 bg-white/5 p-1.5 rounded-2xl">
                                {['RECARGAS', 'TIENDA', 'DINERO'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleTabChange(cat)}
                                        className={`flex-1 py-3 rounded-xl text-[8px] font-black tracking-widest transition-all ${categoriaActiva === cat ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* CORE ENGINE */}
                            <div className="min-h-[300px] flex flex-col justify-center">
                                {categoriaActiva === 'DINERO' ? (
                                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 group-focus-within:border-blue-500/50 transition-all">
                                            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Monto a Enviar (BRL)</p>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={monto}
                                                    onChange={e => { playClick(); setMonto(Number(e.target.value)); }}
                                                    className="bg-transparent text-5xl font-black w-full outline-none text-white tracking-tighter"
                                                />
                                                <span className="text-xl font-black opacity-20">BRL</span>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 rounded-[2rem] shadow-2xl">
                                            <div className="flex justify-between items-start mb-6">
                                                <p className="text-[9px] font-black uppercase text-white/60 tracking-widest">Total en Cuba</p>
                                                <span className="bg-black/20 px-3 py-1 rounded-full text-[9px] font-black">1 : {tasaActual}</span>
                                            </div>
                                            <p className="text-5xl font-black text-white">
                                                {(monto * tasaActual).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                <span className="text-lg ml-2 opacity-50 uppercase">CUP</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 no-scrollbar animate-in slide-in-from-right-4 duration-500">
                                        {todasLasOfertas.filter(o => o.categoria?.toLowerCase().includes(categoriaActiva.toLowerCase().slice(0,3))).map((o, i) => (
                                            <div key={i} onClick={playClick} className="flex justify-between items-center p-5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-tight group-hover:text-blue-400 transition-colors">{o.nombre}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase">{o.descripcion?.slice(0,35)}</p>
                                                </div>
                                                <p className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">
                                                    R$ {limpiarPrecio(o.precio).toFixed(2).replace('.', ',')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* DESTINO */}
                            <div className="mt-12 space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="NUMERO O TARJETA"
                                        value={numero}
                                        onChange={e => { setNumero(e.target.value.toUpperCase()); if(numero.length % 3 === 0) playClick(); }}
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center font-black tracking-[0.4em] text-xs focus:border-blue-500/50 transition-all outline-none placeholder:opacity-20"
                                    />
                                    {numero.length >= 8 && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 animate-pulse text-xs">READY</div>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-white text-black py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">Jonathan</button>
                                    <button className="bg-white/10 text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all">David</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-20 flex justify-between items-center opacity-20 border-t border-white/10 pt-8">
                    <p className="text-[8px] font-black uppercase tracking-[1em]">Nexus Digital Bridge 2026</p>
                    <div className="flex gap-4">
                        <div className="w-4 h-4 rounded-full bg-[#009739]"></div>
                        <div className="w-4 h-4 rounded-full bg-[#CF142B]"></div>
                    </div>
                </footer>
            </div>
        </main>
    );
}