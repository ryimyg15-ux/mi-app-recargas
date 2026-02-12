'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function RecargaCard() {
    // ESTADOS DE DATOS
    const [tasasDinamicas, setTasasDinamicas] = useState({
        r1: 92, r2: 96, r3: 97, r4: 98
    });
    const [monto, setMonto] = useState<number>(100);
    const [tipoDestino, setTipoDestino] = useState('CUP');
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [nombreTitular, setNombreTitular] = useState('');
    const [cargando, setCargando] = useState(true);

    // 1. CARGA DE TASAS DESDE GOOGLE SHEETS
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data = res.data;

                const obtenerTasa = (nombreFila: string, valorPorDefecto: number) => {
                    const fila = data.find((f: any) => f.nombre?.trim().toLowerCase() === nombreFila.toLowerCase());
                    if (fila && fila.precio) {
                        const num = parseFloat(fila.precio.replace(/[^0-9.]/g, ''));
                        return isNaN(num) ? valorPorDefecto : num;
                    }
                    return valorPorDefecto;
                };

                setTasasDinamicas({
                    r1: obtenerTasa('Tasa Rango 1', 92),
                    r2: obtenerTasa('Tasa Rango 2', 96),
                    r3: obtenerTasa('Tasa Rango 3', 97),
                    r4: obtenerTasa('Tasa Rango 4', 98)
                });
                setCargando(false);
            }
        });
    }, []);

    // 2. LÓGICA DE CÁLCULO
    const tasaActual = monto >= 1000 ? tasasDinamicas.r4 :
        monto >= 500  ? tasasDinamicas.r3 :
            monto >= 100  ? tasasDinamicas.r2 : tasasDinamicas.r1;

    const abrirWhatsapp = (agente: string) => {
        const mensaje = `*NEXUS R&DAY - OPERACIÓN*\n\n` +
            `💰 *Envía:* ${monto} BRL\n` +
            `📈 *Tasa:* 1:${tasaActual}\n` +
            `🇨🇺 *Recibe:* ${(monto * tasaActual).toLocaleString()} CUP\n` +
            `📍 *Destino:* ${tipoDestino}\n` +
            `💳 *ID/Tarjeta:* ${numeroTarjeta || 'N/A'}\n` +
            `👤 *Titular:* ${nombreTitular || 'N/A'}`;

        const telf = agente === 'Jonathan' ? '5547999222521' : '5547988884444';
        window.open(`https://wa.me/${telf}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl max-w-2xl mx-auto border border-slate-50">

            {/* INDICADOR DE CONEXIÓN */}
            <div className="flex justify-center items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <span className="text-sm">🇧🇷</span>
                    <span className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">Brasil</span>
                </div>
                <div className="h-[1px] w-8 bg-blue-200"></div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <span className="text-sm">🇨🇺</span>
                    <span className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">Cuba</span>
                </div>
            </div>

            {/* TABLERO DE TASAS DINÁMICAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { r: '10-99', v: tasasDinamicas.r1 },
                    { r: '100-499', v: tasasDinamicas.r2 },
                    { r: '500-999', v: tasasDinamicas.r3 },
                    { r: '1000+', v: tasasDinamicas.r4 }
                ].map((t, i) => (
                    <div key={i} className={`p-4 rounded-3xl border-2 transition-all duration-500 ${tasaActual === t.v ? 'bg-blue-600 border-blue-600 shadow-blue-200 shadow-lg -translate-y-1' : 'bg-slate-50 border-transparent opacity-50'}`}>
                        <p className={`text-[7px] font-black uppercase mb-1 ${tasaActual === t.v ? 'text-blue-100' : 'text-slate-400'}`}>{t.r} BRL</p>
                        <p className={`text-xl font-black ${tasaActual === t.v ? 'text-white' : 'text-[#002A8F]'}`}>{t.v}</p>
                    </div>
                ))}
            </div>

            {/* CALCULADORA */}
            <div className="space-y-6">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="flex justify-between mb-4 px-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto a enviar</label>
                        <span className="text-[10px] font-black text-blue-600 uppercase">BRL (PIX)</span>
                    </div>
                    <div className="relative">
                        <input type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))}
                               className="w-full bg-white p-5 rounded-[1.5rem] text-3xl font-black text-[#002A8F] outline-none shadow-inner border-2 border-transparent focus:border-blue-500 transition-all" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">R$</span>
                    </div>
                </div>

                {/* RESULTADO (GREEN CARD) */}
                <div className="bg-gradient-to-br from-[#009739] to-[#007a2e] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl italic font-black">CUP</div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Total que reciben en Cuba</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">{(monto * tasaActual).toLocaleString()}</span>
                        <span className="text-lg font-bold">CUP</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase opacity-60">Tasa Aplicada</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">1 BRL = {tasaActual} CUP</span>
                    </div>
                </div>

                {/* BOTONES WHATSAPP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => abrirWhatsapp('Jonathan')}
                            className="bg-[#25D366] hover:bg-[#1fb355] text-white p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95">
                        Hablar con Jonathan
                    </button>
                    <button onClick={() => abrirWhatsapp('David')}
                            className="bg-[#002A8F] hover:bg-[#001f6d] text-white p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95">
                        Hablar con David
                    </button>
                </div>
            </div>

            {/* SEGURIDAD */}
            <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mt-8 italic">
                Operación Protegida por Nexus R&Day Systems
            </p>
        </div>
    );
}