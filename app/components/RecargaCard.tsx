'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function NexusCyberSecurity() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [tasas, setTasas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [monto, setMonto] = useState<number>(100);
    const [numero, setNumero] = useState('');
    const [escaneando, setEscaneando] = useState(false);

    // --- SINTETIZADOR DE AUDIO ---
    const playSound = (freq = 800, type: 'sine' | 'square' = 'sine') => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    // --- FIX PRECIO EXCEL (Coma a Punto) ---
    const parseCurrency = (val: string) => {
        if (!val) return 0;
        const clean = val.toString().replace('R$', '').replace(/\s/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
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
                const getTasa = (n: string, d: number) => {
                    const f = data.find((o: any) => o.nombre?.includes(n));
                    return f ? parseCurrency(f.precio) : d;
                };
                setTasas({
                    r1: getTasa('Tasa Rango 1', 92),
                    r2: getTasa('Tasa Rango 2', 96),
                    r3: getTasa('Tasa Rango 3', 97),
                    r4: getTasa('Tasa Rango 4', 98)
                });
            }
        });
    }, []);

    // Simulación de Escaneo al completar número
    useEffect(() => {
        if (numero.length >= 8 && !escaneando) {
            setEscaneando(true);
            playSound(440, 'square'); // Sonido de alerta inicio
            setTimeout(() => {
                setEscaneando(false);
                playSound(1200); // Sonido de éxito
            }, 2500);
        }
    }, [numero]);

    const tasaActual = monto >= 1000 ? tasas.r4 : monto >= 500 ? tasas.r3 : monto >= 100 ? tasas.r2 : tasas.r1;

    return (
        <main className="min-h-screen bg-[#020408] text-white font-sans overflow-hidden relative selection:bg-blue-500/50">

            {/* LÍNEAS DE SEGURIDAD EN EL FONDO */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-blue-500 rounded-lg flex items-center justify-center font-black italic">N</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Nexus <span className="text-blue-500">Logistics</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        <span className="text-[8px] font-bold text-emerald-500 uppercase">Red Encriptada</span>
                    </div>
                </header>

                <div className="relative group">
                    {/* Tarjeta con Borde de Seguridad */}
                    <div className={`absolute -inset-0.5 rounded-[2.5rem] blur opacity-20 transition-all duration-500 ${escaneando ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                    <div className="relative bg-[#0a0c14] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl overflow-hidden">

                        {/* EFECTO LÁSER DE ESCANEO */}
                        {escaneando && (
                            <div className="absolute inset-0 z-50 pointer-events-none">
                                <div className="w-full h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-[scan_2.5s_ease-in-out_infinite] absolute top-0"></div>
                                <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                            </div>
                        )}

                        {/* SELECTOR */}
                        <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar">
                            {['RECARGAS', 'TIENDA', 'DINERO'].map(cat => (
                                <button key={cat} onClick={() => { playSound(); setCategoriaActiva(cat); }}
                                        className={`px-8 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${categoriaActiva === cat ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* CORE CONTENT */}
                        <div className="grid md:grid-cols-2 gap-10 items-center">

                            <div className="space-y-6">
                                {categoriaActiva === 'DINERO' ? (
                                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Envío PIX (BRL)</p>
                                        <input type="number" value={monto} onChange={e => setMonto(Number(e.target.value))} className="bg-transparent text-5xl font-black w-full outline-none" />
                                        <div className="mt-8 pt-8 border-t border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Reciben en Cuba</p>
                                            <p className="text-4xl font-black text-emerald-400">
                                                {(monto * tasaActual).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs text-white/30">CUP</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                        {todasLasOfertas.filter(o => o.categoria?.toLowerCase().includes(categoriaActiva.toLowerCase().slice(0,3))).map((o, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all group cursor-pointer" onClick={() => playSound(600)}>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black uppercase group-hover:text-blue-400 transition-colors">{o.nombre}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase">{o.descripcion?.slice(0,30)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-blue-400">R$ {parseCurrency(o.precio).toFixed(2).replace('.', ',')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* DESTINO Y SEGURIDAD */}
                            <div className="space-y-6">
                                <div className="relative">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block text-center">Identificación del Beneficiario</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        value={numero}
                                        onChange={e => setNumero(e.target.value.toUpperCase())}
                                        className={`w-full bg-black/50 border ${escaneando ? 'border-red-500/50' : esNumeroValido ? 'border-emerald-500/50' : 'border-white/10'} p-6 rounded-2xl text-center font-black tracking-[0.3em] text-xs transition-all outline-none`}
                                    />
                                    {escaneando && <p className="absolute -bottom-6 left-0 w-full text-center text-[8px] font-black text-red-500 animate-pulse">VERIFICANDO CIFRADO DE CUENTA...</p>}
                                    {!escaneando && numero.length >= 8 && <p className="absolute -bottom-6 left-0 w-full text-center text-[8px] font-black text-emerald-500 uppercase">Red Segura: Destino Verificado ✓</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 pt-4">
                                    <button className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${escaneando ? 'bg-slate-800 opacity-50' : 'bg-white text-black hover:bg-blue-500 hover:text-white shadow-xl'}`}>
                                        {escaneando ? 'Espere...' : 'Continuar con Jonathan'}
                                    </button>
                                    <button className="bg-white/5 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                                        Continuar con David
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>
            </div>
        </main>
    );
}