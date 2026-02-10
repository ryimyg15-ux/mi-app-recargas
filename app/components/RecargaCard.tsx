'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    categoria: string;
    precio: string;
}

export default function RecargaCard() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');
    const [montoRemesa, setMontoRemesa] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(55);

    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // 1. Carga inicial de datos
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data: Oferta[] = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                const filaTasa = data.find((o: any) => normalizar(o.nombre).includes('transferencia a cuba'));
                if (filaTasa) {
                    const valor = parseFloat(filaTasa.precio.replace(',', '.').replace(/[^0-9.]/g, ''));
                    if (!isNaN(valor)) setTasaCup(valor);
                }
            }
        });
    }, []);

    // 2. Filtrado lógico (Corregido: Fuera del JSX)
    const ofertasFiltradas = useMemo(() => {
        if (todasLasOfertas.length === 0) return [];
        const servicioNormalizado = normalizar(servicio);

        return todasLasOfertas.filter((o) => {
            const catExcel = normalizar(o.categoria);
            return catExcel && (servicioNormalizado.includes(catExcel) || catExcel.includes(servicioNormalizado));
        });
    }, [servicio, todasLasOfertas]);

    // 3. Sincronizar selección automática cuando cambian las ofertas filtradas
    useEffect(() => {
        if (ofertasFiltradas.length > 0) {
            setOfertaSeleccionada(ofertasFiltradas[0]);
        } else {
            setOfertaSeleccionada(null);
        }
    }, [ofertasFiltradas]);

    const calcularPrecio = (precioBase: string) => {
        if (!precioBase) return "0.00";
        const numBase = parseFloat(precioBase.replace(',', '.').replace(/[^0-9.]/g, ''));
        if (isNaN(numBase)) return precioBase;

        let total = numBase;
        if (pago.includes('Europa')) total = numBase / 5.50;
        else if (pago.includes('EE.UU')) total = numBase / 5.80;

        const simbolo = pago.includes('Brasil') ? 'R$' : '$';
        return `${simbolo} ${total.toFixed(2)}`;
    };

    const enviarPedido = () => {
        if (!numero) return alert("Por favor, ingresa el número o tarjeta.");
        const esRemesa = normalizar(servicio).includes('dinero');

        const detalle = esRemesa
            ? `💸 REMESA\n💰 Envía: ${montoRemesa} BRL\n🇨🇺 Recibe: ${(montoRemesa * tasaCup).toLocaleString()} CUP\n📈 Tasa: 1:${tasaCup}`
            : `🛒 PRODUCTO: ${ofertaSeleccionada?.nombre}\n💵 TOTAL: ${calcularPrecio(ofertaSeleccionada?.precio || '0')}`;

        const mensaje = `*NEXUS R&DAY*\n\n` +
            `👤 *Operación:* ${servicio}\n` +
            `💳 *Método:* ${pago}\n` +
            `${detalle}\n` +
            `📍 *ID/Número:* ${numero}`;

        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-xl mx-auto font-sans">
            <div className="bg-slate-900 py-3 text-center">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Nexus System v2.0</span>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">1. Operación</label>
                        {['Recarga (ETECSA)', 'Recarga (NAUTA)','Combo de Comida/Aseo', 'Envío de Dinero'].map(s => (
                            <button key={s} onClick={() => setServicio(s)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black transition-all border ${
                                        servicio === s ? 'bg-[#002A8F] text-white border-[#002A8F]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                    }`}>
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">2. Pago Desde</label>
                        {['Brasil (PIX)', 'EE.UU (Zelle)', 'Europa (Euros)'].map(m => (
                            <button key={m} onClick={() => setPago(m)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black transition-all border ${
                                        pago === m ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-yellow-400/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                    }`}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {normalizar(servicio).includes('dinero') ? (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between px-2">
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Entregas (BRL)</p>
                                    <input type="number"
                                           value={montoRemesa}
                                           onChange={e => setMontoRemesa(Number(e.target.value))}
                                           className="w-20 text-center font-black text-xl text-[#002A8F] bg-white rounded-md border border-slate-200 outline-none focus:ring-2 ring-[#002A8F]/20" />
                                </div>
                                <div className="text-xl font-black text-slate-300">➜</div>
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Reciben (CUP)</p>
                                    <div className="bg-[#009739] text-white px-4 py-1.5 rounded-md font-black text-xl italic shadow-sm">
                                        {Math.round(montoRemesa * tasaCup).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                Tasa actual: 1 BRL = {tasaCup} CUP
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {ofertasFiltradas.map((o, idx) => (
                                <button key={idx}
                                        onClick={() => setOfertaSeleccionada(o)}
                                        className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                                            ofertaSeleccionada?.nombre === o.nombre
                                                ? 'bg-white border-[#002A8F] shadow-sm ring-1 ring-[#002A8F]'
                                                : 'bg-white/50 border-transparent hover:border-slate-300'
                                        }`}>
                                    <span className="text-[10px] font-bold text-slate-700">{o.nombre}</span>
                                    <span className="text-[10px] font-black text-[#002A8F]">{calcularPrecio(o.precio)}</span>
                                </button>
                            ))}
                            {ofertasFiltradas.length === 0 && (
                                <p className="text-center text-[10px] text-slate-400 py-4">No hay productos disponibles para esta categoría.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <input type="text"
                           placeholder="TELÉFONO O TARJETA DEL BENEFICIARIO"
                           value={numero}
                           onChange={e => setNumero(e.target.value)}
                           className="w-full bg-slate-100 border-2 border-slate-100 p-4 rounded-xl font-black text-[10px] text-center focus:bg-white focus:border-[#002A8F] outline-none transition-all uppercase placeholder:text-slate-300" />

                    <button onClick={enviarPedido}
                            className="w-full bg-[#002A8F] hover:bg-[#CF142B] text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                        Confirmar Operación 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}