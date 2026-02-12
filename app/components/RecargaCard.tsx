'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function NexusTradingDashboard() {
    // ESTADOS DE DATOS
    const [data, setData] = useState<any[]>([]);
    const [tasas, setTasas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [history, setHistory] = useState<any[]>([]);

    // ESTADOS DE OPERACIÓN
    const [monto, setMonto] = useState<number>(100);
    const [beneficiario, setBeneficiario] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // FETCH DE DATOS (NEXUS ENGINE v2)
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const filtered = res.data.filter((o: any) => o.nombre);
                setData(filtered);

                // Parser avanzado de tasas
                const findTasa = (name: string, fallback: number) => {
                    const row = filtered.find((o: any) => o.nombre?.toLowerCase().includes(name.toLowerCase()));
                    if (!row) return fallback;
                    const val = row.precio.toString().replace('R$', '').replace(/\./g, '').replace(',', '.');
                    return parseFloat(val) || fallback;
                };

                setTasas({
                    r1: findTasa('Tasa Rango 1', 92),
                    r2: findTasa('Tasa Rango 2', 96),
                    r3: findTasa('Tasa Rango 3', 97),
                    r4: findTasa('Tasa Rango 4', 98)
                });
            }
        });
    }, []);

    // CÁLCULOS DINÁMICOS
    const tasaActual = useMemo(() => {
        if (monto >= 1000) return tasas.r4;
        if (monto >= 500) return tasas.r3;
        if (monto >= 100) return tasas.r2;
        return tasas.r1;
    }, [monto, tasas]);

    const totalCUP = monto * tasaActual;

    // MANEJO DE ÓRDENES
    const ejecutarOrden = () => {
        if (!beneficiario) return alert("Ingrese un beneficiario");
        setIsProcessing(true);

        setTimeout(() => {
            const nuevaOrden = {
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                time: new Date().toLocaleTimeString(),
                montoBRL: monto,
                tasa: tasaActual,
                totalCUP: totalCUP,
                target: beneficiario
            };
            setHistory([nuevaOrden, ...history]);
            setIsProcessing(false);
            setBeneficiario('');
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#05070a] text-slate-300 p-4 md:p-8 font-mono">

            {/* TOP BAR / TICKER */}
            <div className="flex flex-wrap gap-4 mb-8">
                {Object.entries(tasas).map(([key, val], i) => (
                    <div key={key} className="bg-[#0a0f1a] border border-blue-500/20 p-3 rounded-lg flex-1 min-w-[120px]">
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Tier {i+1} Rate</p>
                        <p className="text-xl font-black text-white">1:{val.toFixed(2).replace('.', ',')}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-6">

                {/* PANEL IZQUIERDO: CALCULADORA DE TRADING */}
                <section className="lg:col-span-8 space-y-6">
                    <div className="bg-[#0a0f1a] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 3v18h18M7 16l4-4 4 4 5-8" /></svg>
                        </div>

                        <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Market Operations</h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-3">Amount (BRL)</label>
                                    <input
                                        type="number"
                                        value={monto}
                                        onChange={(e) => setMonto(Number(e.target.value))}
                                        className="bg-transparent text-6xl font-black text-white outline-none w-full tracking-tighter"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-3">Beneficiary Account</label>
                                    <input
                                        type="text"
                                        placeholder="Enter ID / Card Number"
                                        value={beneficiario}
                                        onChange={(e) => setBeneficiario(e.target.value.toUpperCase())}
                                        className="bg-white/5 border border-white/10 w-full p-4 rounded-xl text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-8 flex flex-col justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Execution Price</p>
                                    <p className="text-5xl font-black text-white">
                                        {totalCUP.toLocaleString('es-CU' as Intl.LocalesArgument, { minimumFractionDigits: 2 })}
                                        <span className="text-sm ml-2 opacity-40">CUP</span>
                                    </p>
                                </div>
                                <button
                                    onClick={ejecutarOrden}
                                    disabled={isProcessing}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isProcessing ? 'bg-slate-800' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]'}`}
                                >
                                    {isProcessing ? 'Verifying...' : 'Execute Transaction'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* GRÁFICO SIMULADO / TENDENCIA */}
                    <div className="bg-[#0a0f1a] border border-white/5 rounded-2xl p-6 h-48 flex items-end gap-1">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/50 transition-all rounded-t-sm"
                                style={{ height: `${Math.random() * 80 + 20}%` }}
                            ></div>
                        ))}
                    </div>
                </section>

                {/* PANEL DERECHO: HISTORIAL DE ÓRDENES */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0a0f1a] border border-white/5 rounded-2xl p-6 h-full min-h-[500px]">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Recent Activity</h3>

                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <div className="text-center py-20 opacity-20">
                                    <p className="text-xs uppercase font-bold tracking-widest">No active orders</p>
                                </div>
                            ) : (
                                history.map((order) => (
                                    <div key={order.id} className="bg-white/5 border border-white/5 p-4 rounded-xl animate-in slide-in-from-right-4 duration-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black text-blue-500">#{order.id}</span>
                                            <span className="text-[9px] text-slate-600">{order.time}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-bold text-white">{order.montoBRL} BRL</p>
                                                <p className="text-[8px] text-slate-500 uppercase tracking-tighter">Target: {order.target.slice(0,12)}...</p>
                                            </div>
                                            <p className="text-sm font-black text-emerald-500">+{order.totalCUP.toFixed(0)} CUP</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {/* FOOTER DE ESTADO */}
            <footer className="mt-8 flex justify-between items-center text-[8px] font-bold text-slate-600 uppercase tracking-[0.4em]">
                <div>Nexus OS v4.0.2 // Global Connectivity</div>
                <div className="flex gap-4">
                    <span className="text-emerald-500">Sync: OK</span>
                    <span className="text-blue-500">Lat: 22ms</span>
                </div>
            </footer>
        </main>
    );
}