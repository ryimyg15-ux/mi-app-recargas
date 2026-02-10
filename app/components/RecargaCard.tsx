'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function RecargaCard() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<any | null>(null);
    const [numero, setNumero] = useState('');
    const [montoRemesa, setMontoRemesa] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(0); // Iniciamos en 0 para detectar la carga
    const [error, setError] = useState('');

    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                // BUSCAR TASA: Según tu imagen, la fila se llama "Transferencia a Cuba"
                const filaTasa = data.find((o: any) =>
                    normalizar(o.nombre).includes('transferencia a cuba')
                );

                if (filaTasa) {
                    // Limpiamos el valor "R$92,00" -> "92.00"
                    const valorLimpio = filaTasa.precio.replace('R$', '').replace(',', '.').replace(/[^0-9.]/g, '').trim();
                    const tasaNumerica = parseFloat(valorLimpio);
                    if (!isNaN(tasaNumerica)) setTasaCup(tasaNumerica);
                }
            }
        });
    }, []);

    const ofertasFiltradas = useMemo(() => {
        const servicioNormalizado = normalizar(servicio);
        return todasLasOfertas.filter((o) => {
            const catExcel = normalizar(o.categoria);
            return catExcel && (servicioNormalizado.includes(catExcel) || catExcel.includes(servicioNormalizado));
        });
    }, [servicio, todasLasOfertas]);

    useEffect(() => {
        setOfertaSeleccionada(ofertasFiltradas[0] || null);
    }, [ofertasFiltradas]);

    return (
        <div className="bg-slate-50 min-h-screen p-4 flex items-center justify-center font-sans">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* HEADER */}
                <div className="bg-slate-900 p-6 text-center">
                    <h1 className="text-white font-black text-2xl tracking-tighter">NEXUS R&DAY</h1>
                    <div className="inline-block bg-blue-500/20 px-3 py-1 rounded-full mt-2">
                        <p className="text-blue-400 text-[8px] font-black uppercase tracking-widest">Conectando Mundos</p>
                    </div>
                </div>

                {/* CALCULADORA DE DINERO CON ALERTA DE TASA */}
                <div className="px-6 py-6 space-y-6">
                    {categoriaActiva === 'DINERO' && (
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-200">
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">Calculadora de Remesas</span>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-[8px] font-bold uppercase mb-1 opacity-70">Envías (BRL)</p>
                                        <input type="number" value={montoRemesa} onChange={e => setMontoRemesa(Number(e.target.value))}
                                               className="w-20 bg-white/10 border border-white/20 rounded-xl p-2 text-center font-black text-xl outline-none focus:bg-white/20 transition-all" />
                                    </div>
                                    <span className="text-2xl mt-4">➜</span>
                                    <div className="text-center">
                                        <p className="text-[8px] font-bold uppercase mb-1 opacity-70">Reciben (CUP)</p>
                                        <div className="bg-white text-blue-700 px-5 py-2 rounded-xl font-black text-xl shadow-inner">
                                            {Math.round(montoRemesa * (tasaCup || 92)).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* CARTELES DE TASA DINÁMICA */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="bg-green-400 text-green-900 text-[8px] font-black px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                                        <span className="w-1.5 h-1.5 bg-green-900 rounded-full"></span>
                                        TASA ACTUALIZADA: 1 BRL = {tasaCup || '--'} CUP
                                    </div>
                                    <p className="text-[7px] font-medium opacity-50 italic">Cálculo basado en el mercado actual de hoy</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RESTO DE LA INTERFAZ (Ofertas, Input de teléfono, etc.) */}
                    {/* ... (Se mantiene el código de selección y envío por WhatsApp anterior) */}

                    <div className="space-y-3">
                        <button
                            className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
                            Confirmar Operación 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}