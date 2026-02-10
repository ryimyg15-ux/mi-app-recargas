'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function RecargaCard() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState<any[]>([]);
    const [servicio, setServicio] = useState('Recarga a Cuba (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<any>(null);
    const [numero, setNumero] = useState('');
    const [montoRemesa, setMontoRemesa] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(55); // Tasa por defecto si falla el Excel

    // Función para normalizar texto (quitar tildes y espacios)
    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true, header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                // Buscar la tasa con limpieza de texto
                const filaTasa = data.find((o: any) => normalizar(o.nombre) === 'transferencia a cuba');
                if (filaTasa) {
                    const valor = parseFloat(filaTasa.precio.replace(',', '.').replace(/[^0-9.]/g, ''));
                    if (!isNaN(valor)) setTasaCup(valor);
                }

                const iniciales = data.filter((o: any) => normalizar(o.categoria) === normalizar(servicio));
                setOfertasFiltradas(iniciales);
                setOfertaSeleccionada(iniciales[0]);
            }
        });
    }, [servicio]);

    // Calcular precios para recargas/combos
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
        if (!numero) return alert("Por favor, rellena los datos.");
        const esRemesa = normalizar(servicio).includes('dinero');

        const detalle = esRemesa
            ? `💸 REMESA\n💰 Envía: ${montoRemesa} BRL\n🇨🇺 Recibe: ${(montoRemesa * tasaCup).toLocaleString()} CUP\n📈 Tasa: 1:${tasaCup}`
            : `🛒 PRODUCTO: ${ofertaSeleccionada?.nombre}\n💵 TOTAL: ${calcularPrecio(ofertaSeleccionada?.precio)}`;

        const mensaje = `*NEXUS R&DAY*\n\n` +
            `👤 *Operación:* ${servicio}\n` +
            `💳 *Método:* ${pago}\n` +
            `${detalle}\n` +
            `📍 *ID/Número:* ${numero}`;

        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-xl mx-auto">
            <div className="bg-slate-900 py-3 text-center">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Nexus System v2.0</span>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* SERVICIOS */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">1. Operación</label>
                        {['Recarga a Cuba (ETECSA)', 'Combo de Comida/Aseo', 'Envío de Dinero'].map(s => (
                            <button key={s} onClick={() => setServicio(s)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black transition-all border ${
                                        servicio === s ? 'bg-[#002A8F] text-white border-[#002A8F]' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* PAGOS */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">2. Pago Desde</label>
                        {['Brasil (PIX)', 'EE.UU (Zelle)', 'Europa (Euros)'].map(m => (
                            <button key={m} onClick={() => setPago(m)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black transition-all border ${
                                        pago === m ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-yellow-400/20' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AREA DINÁMICA */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {normalizar(servicio).includes('dinero') ? (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between px-2">
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Entregas (BRL)</p>
                                    <input type="number" value={montoRemesa} onChange={e => setMontoRemesa(Number(e.target.value))}
                                           className="w-20 text-center font-black text-xl text-[#002A8F] bg-white rounded-md border border-slate-200 outline-none" />
                                </div>
                                <div className="text-xl font-black text-slate-300">➜</div>
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Reciben (CUP)</p>
                                    <div className="bg-[#009739] text-white px-4 py-1.5 rounded-md font-black text-xl italic shadow-sm">
                                        {(montoRemesa * tasaCup).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                Tasa actual: 1 BRL = {tasaCup} CUP
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {ofertasFiltradas.map((o, i) => (
                                <button key={i} onClick={() => setOfertaSeleccionada(o)}
                                        className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                                            ofertaSeleccionada?.nombre === o.nombre ? 'border-[#002A8F] bg-white' : 'border-transparent opacity-50'
                                        }`}>
                                    <span className="text-[9px] font-black uppercase">{o.nombre}</span>
                                    <span className="text-[10px] font-black text-[#002A8F]">{calcularPrecio(o.precio)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* INPUT BENEFICIARIO */}
                <input type="text" placeholder="TELÉFONO O TARJETA DEL BENEFICIARIO" value={numero} onChange={e => setNumero(e.target.value)}
                       className="w-full bg-slate-100 border-2 border-slate-100 p-3 rounded-xl font-black text-[10px] text-center focus:bg-white focus:border-[#002A8F] outline-none transition-all uppercase" />

                <button onClick={enviarPedido}
                        className="w-full bg-[#002A8F] hover:bg-[#CF142B] text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-lg transition-all active:scale-95">
                    Confirmar Operación 🚀
                </button>
            </div>
        </div>
    );
}