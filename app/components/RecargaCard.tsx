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
    const [mostrarTicket, setMostrarTicket] = useState(false);

    // --- SINTETIZADOR DE AUDIO ---
    const playSound = (freq = 800, type: 'sine' | 'square' = 'sine') => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            g.gain.setValueAtTime(0.05, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) { console.log("Audio not supported"); }
    };

    // --- FIX PRECIO EXCEL ---
    const parseCurrency = (val: string) => {
        if (!val) return 0;
        const clean = val.toString().replace('R$', '').replace(/\s/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
    };

    // --- LÓGICA DE VALIDACIÓN ---
    const esNumeroValido = numero.length >= 8;
    const tasaActual = monto >= 1000 ? tasas.r4 : monto >= 500 ? tasas.r3 : monto >= 100 ? tasas.r2 : tasas.r1;

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
                    const f = data.find((o: any) => o.nombre?.toLowerCase().includes(n.toLowerCase()));
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

    // Simulación de Escaneo
    useEffect(() => {
        if (numero.length === 10 && !escaneando) {
            setEscaneando(true);
            playSound(440, 'square');
            setTimeout(() => {
                setEscaneando(false);
                playSound(1000, 'sine');
            }, 2500);
        }
    }, [numero]);

    return (
        <main className="min-h-screen bg-[#020408] text-white font-sans overflow-x-hidden relative selection:bg-blue-500/50">

            {/* BACKGROUND ESTRUCTURAL */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 border-2 border-blue-500 rounded-xl flex items-center justify-center font-black italic group-hover:bg-blue-500 transition-all group-hover:text-black">N</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Nexus <span className="text-blue-500">Security</span></span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* INFO PANEL */}
                    <div className="lg:col-span-5 space-y-8">
                        <h2 className="text-7xl font-black leading-[0.8] tracking-tighter italic uppercase">
                            Digital <br /> <span className="text-blue-600">Assets</span>
                        </h2>
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Estado del Servidor</span>
                                <span className="text-[9px] font-black text-emerald-500 uppercase">Activo 24/7</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[92%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* APP CARD */}
                    <div className="lg:col-span-7 relative group">
                        <div className={`absolute -inset-1 rounded-[3rem] blur-2xl transition-all duration-1000 ${escaneando ? 'bg-red-500/20' : 'bg-blue-500/10'}`}></div>

                        <div className="relative bg-[#0a0c14]/90 border border-white/10 rounded-[3rem] p-8 md:p-10 backdrop-blur-3xl overflow-hidden">

                            {/* SCANNER LINE */}
                            {escaneando && (
                                <div className="absolute inset-0 z-50 pointer-events-none">
                                    <div className="w-full h-1 bg-blue-400 shadow-[0_0_25px_#3b82f6] animate-[scan_2.5s_ease-in-out_infinite] absolute"></div>
                                    <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
                                </div>
                            )}

                            {/* TABS */}
                            <div className="flex gap-2 mb-10">
                                {['RECARGAS', 'TIENDA', 'DINERO'].map(cat => (
                                    <button key={cat} onClick={() => { playSound(); setCategoriaActiva(cat); }}
                                            className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${categoriaActiva === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* MAIN CALCULATOR */}
                            <div className="min-h-[280px]">
                                {categoriaActiva === 'DINERO' ? (
                                    <div className="space-y-6">
                                        <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5">
                                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-4">Monto Envío (BRL)</p>
                                            <input type="number" value={monto} onChange={e => setMonto(Number(e.target.value))} className="bg-transparent text-5xl font-black w-full outline-none text-white tracking-tighter" />
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-8 rounded-[2rem] shadow-2xl relative">
                                            <p className="text-[8px] font-black uppercase text-white/40 mb-2">Crédito en Cuba (CUP)</p>
                                            <p className="text-4xl font-black">
                                                {(monto * tasaActual).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                <span className="text-lg ml-2 opacity-40 font-bold tracking-normal">CUP</span>
                                            </p>
                                            <div className="absolute top-8 right-8 bg-black/20 px-3 py-1 rounded-full text-[9px] font-black">1 : {tasaActual}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[280px] overflow-y-auto no-scrollbar">
                                        {todasLasOfertas.filter(o => o.categoria?.toLowerCase().includes(categoriaActiva.toLowerCase().slice(0,3))).map((o, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => playSound(600)}>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest">{o.nombre}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold">{o.descripcion?.slice(0,40)}</p>
                                                </div>
                                                <p className="text-xs font-black text-blue-400">R$ {parseCurrency(o.precio).toFixed(2).replace('.', ',')}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* DESTINATION INPUT */}
                            <div className="mt-10 space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ID / TARJETA / TELÉFONO"
                                        value={numero}
                                        onChange={e => setNumero(e.target.value.toUpperCase())}
                                        className={`w-full bg-black/50 border ${escaneando ? 'border-red-500/50' : esNumeroValido ? 'border-emerald-500/50' : 'border-white/10'} p-6 rounded-2xl text-center font-black tracking-[0.4em] text-xs transition-all outline-none`}
                                    />
                                    {escaneando && <p className="absolute -bottom-6 left-0 w-full text-center text-[7px] font-black text-red-500 animate-pulse tracking-widest">ENCRIPTANDO TRANSMISIÓN...</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setMostrarTicket(true)} className="bg-white text-black py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Generar Orden</button>
                                    <button className="bg-white/5 text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest border border-white/10">Soporte</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL TICKET DIGITAL */}
            {mostrarTicket && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setMostrarTicket(false)}>
                    <div className="bg-white text-black w-full max-w-xs rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.2)]" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-900 p-6 text-white text-center">
                            <p className="text-[10px] font-black tracking-widest uppercase mb-1">Nexus Order</p>
                            <p className="text-[8px] opacity-40 uppercase">Válido por 15 minutos</p>
                        </div>
                        <div className="p-8 space-y-4 text-center">
                            <div className="bg-slate-100 p-4 rounded-2xl inline-block mx-auto">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NexusOrder-${numero}`} alt="QR" className="w-32 h-32 opacity-80" />
                            </div>
                            <div className="space-y-2 py-4 border-y border-slate-100">
                                <div className="flex justify-between text-[10px] font-bold"><span>ENVÍA:</span> <span>{monto} BRL</span></div>
                                <div className="flex justify-between text-[10px] font-bold text-blue-600"><span>RECIBE:</span> <span>{monto * tasaActual} CUP</span></div>
                                <div className="text-[9px] font-black opacity-30 tracking-tighter">ID: {numero || 'SIN ASIGNAR'}</div>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-widest">Enviar a WhatsApp</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scan { 
                    0%, 100% { top: 0%; opacity: 0; } 
                    10%, 90% { opacity: 1; }
                    50% { top: 100%; }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </main>
    );
}