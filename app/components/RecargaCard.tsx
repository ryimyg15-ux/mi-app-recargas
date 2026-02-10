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

    // Estados para Remesas
    const [montoRemesa, setMontoRemesa] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(55); // 55 como respaldo

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true, header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                // BUSCAR TASA: Busca la fila "Transferencia a Cuba"
                const filaTasa = data.find((o: any) =>
                    o.nombre.trim().toLowerCase() === 'transferencia a cuba'
                );
                if (filaTasa) {
                    const valor = parseFloat(filaTasa.precio.replace(',', '.').replace(/[^0-9.]/g, ''));
                    if (!isNaN(valor)) setTasaCup(valor);
                }

                const iniciales = data.filter((o: any) => o.categoria === servicio);
                setOfertasFiltradas(iniciales);
                setOfertaSeleccionada(iniciales[0]);
            }
        });
    }, []);

    // Sincronizar ofertas al cambiar de servicio
    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        setOfertaSeleccionada(filtradas[0] || null);
    }, [servicio, todasLasOfertas]);

    const calcularPrecio = (precioBase: string) => {
        if (!precioBase) return "0.00";
        const numBase = parseFloat(precioBase.replace(',', '.').replace(/[^0-9.]/g, ''));
        if (isNaN(numBase)) return precioBase;

        let total = numBase;
        if (pago.includes('Europa')) total = numBase / 5.50;
        else if (pago.includes('EE.UU')) total = numBase / 5.80;

        const simbolo = pago.includes('Brasil') ? 'R$' : pago.includes('Europa') ? '€' : '$';
        return `${simbolo} ${total.toFixed(2)}`;
    };

    const enviarPedido = () => {
        if (!numero) return alert("Por favor, indique el número o tarjeta del beneficiario.");

        const detalle = servicio === 'Envío de Dinero'
            ? `💸 REMESA\n💰 Entrega: ${montoRemesa} BRL\n🇨🇺 Recibe: ${(montoRemesa * tasaCup).toLocaleString()} CUP\n📈 Tasa: 1 BRL = ${tasaCup} CUP`
            : `🛒 PRODUCTO: ${ofertaSeleccionada?.nombre}\n💵 TOTAL: ${calcularPrecio(ofertaSeleccionada?.precio)}`;

        const mensaje = `*NEXUS R&DAY - ORDEN REGISTRADA*\n\n` +
            `👤 *Operación:* ${servicio}\n` +
            `💳 *Método:* ${pago}\n` +
            `${detalle}\n` +
            `📍 *Beneficiario:* ${numero}`;

        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            {/* Header Técnico */}
            <div className="bg-slate-900 p-2 text-center">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.6em]">Secure Transaction Interface</p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Botones de Categoría */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servicio</p>
                        {['Recarga a Cuba (ETECSA)', 'Combo de Comida/Aseo', 'Envío de Dinero'].map(s => (
                            <button key={s} onClick={() => setServicio(s)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border ${
                                        servicio === s ? 'bg-[#002A8F] text-white border-[#002A8F] shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Botones de Moneda */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pago desde</p>
                        {['Brasil (PIX)', 'Europa (Euros)'].map(m => (
                            <button key={m} onClick={() => setPago(m)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border ${
                                        pago === m ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-[#FEDD00]/30' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Área Dinámica (Calculadora o Lista) */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                    {servicio === 'Envío de Dinero' ? (
                        <div className="py-2 space-y-4">
                            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Envías (BRL)</p>
                                    <input
                                        type="number"
                                        value={montoRemesa}
                                        onChange={(e) => setMontoRemesa(Number(e.target.value))}
                                        className="bg-white border border-slate-200 rounded-lg p-2 w-24 text-center text-xl font-black text-[#002A8F] outline-none focus:ring-2 focus:ring-[#002A8F]/20"
                                    />
                                </div>
                                <div className="hidden sm:block text-[#FEDD00] text-2xl font-black">➜</div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Reciben (CUP)</p>
                                    <div className="bg-[#009739] text-white px-5 py-2 rounded-lg shadow-md">
                                        <p className="text-xl font-black italic">
                                            {(montoRemesa * tasaCup).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                Cotización: 1 BRL = {tasaCup} Pesos Cubanos
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                            {ofertasFiltradas.map((o, i) => (
                                <button key={i} onClick={() => setOfertaSeleccionada(o)}
                                        className={`flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                                            ofertaSeleccionada?.nombre === o.nombre ? 'border-[#002A8F] bg-white' : 'border-transparent opacity-60'
                                        }`}>
                                    <span className="text-[10px] font-black uppercase">{o.nombre}</span>
                                    <span className="text-[11px] font-black text-[#002A8F]">{calcularPrecio(o.precio)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input de Identificación */}
                <input
                    type="text"
                    placeholder="NRO. TELÉFONO O TARJETA BANCARIA"
                    value={numero}
                    onChange={e => setNumero(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-black text-xs text-center focus:bg-white focus:border-[#002A8F] outline-none transition-all uppercase"
                />

                {/* Botón de Acción */}
                <button onClick={enviarPedido}
                        className="w-full bg-[#002A8F] hover:bg-[#CF142B] text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-lg transition-all active:scale-95">
                    Procesar con Nexus 🚀
                </button>
            </div>
        </div>
    );
}