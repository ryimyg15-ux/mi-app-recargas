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

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
        Papa.parse(URL, {
            download: true, header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre); // Limpiar filas vacías
                setTodasLasOfertas(data);
                const iniciales = data.filter((o: any) => o.categoria === servicio);
                setOfertasFiltradas(iniciales);
                setOfertaSeleccionada(iniciales[0]);
            }
        });
    }, []);

    // LÓGICA DE SELECCIÓN ÚNICA: Al cambiar servicio, se resetea a la primera oferta
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
        if (!numero || numero.length < 8) return alert("Por favor, ingrese un número válido.");
        const mensaje = `*NEXUS R&DAY - NUEVO PEDIDO*\n\n` +
            `🔹 *Servicio:* ${servicio}\n` +
            `🔹 *Oferta:* ${ofertaSeleccionada?.nombre}\n` +
            `🔹 *Pago:* ${pago}\n` +
            `🔹 *Total:* ${calcularPrecio(ofertaSeleccionada?.precio)}\n` +
            `🔹 *Número:* +53 ${numero}`;
        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white text-slate-900">
            {/* Cabecera Interna de la Tarjeta */}
            <div className="bg-slate-900 p-4 text-center">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Configurador de Orden</span>
            </div>

            <div className="p-5 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* SECCIÓN 1: SERVICIO (Estilo Cuba) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#CF142B]"></div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">01. Seleccione Servicio</label>
                        </div>
                        <div className="grid gap-2">
                            {['Recarga a Cuba (ETECSA)', 'Recarga Nauta (Internet)', 'Combo de Comida/Aseo'].map(s => (
                                <button key={s} onClick={() => setServicio(s)}
                                        className={`text-left px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${
                                            servicio === s
                                                ? 'bg-[#002A8F] border-[#002A8F] text-white shadow-lg translate-x-1'
                                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                                        }`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN 2: PAGO (Estilo Brasil) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#009739]"></div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">02. Método de Pago</label>
                        </div>
                        <div className="grid gap-2">
                            {['Brasil (PIX)', 'EE.UU (Zelle)', 'Europa (Euros)'].map(m => (
                                <button key={m} onClick={() => setPago(m)}
                                        className={`text-left px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${
                                            pago === m
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-[#FEDD00]/50'
                                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                                        }`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 3: OFERTAS (Listado Refinado) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block text-center">03. Ofertas Disponibles</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {ofertasFiltradas.map((o, i) => (
                            <button key={i} onClick={() => setOfertaSeleccionada(o)}
                                    className={`flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                                        ofertaSeleccionada?.nombre === o.nombre
                                            ? 'border-[#002A8F] bg-blue-50/50'
                                            : 'border-slate-50 bg-white hover:border-slate-200'
                                    }`}>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{o.nombre}</p>
                                    <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">{o.descripcion?.substring(0, 20)}...</p>
                                </div>
                                <span className="text-xs font-black text-[#002A8F] italic">{calcularPrecio(o.precio)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SECCIÓN 4: NÚMERO */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="max-w-xs mx-auto relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 tracking-tighter border-r border-slate-200 pr-3">+53 CUBA</span>
                        <input
                            type="number"
                            placeholder="5XXXXXXX"
                            value={numero}
                            onChange={e => setNumero(e.target.value)}
                            className="w-full bg-slate-50 p-4 pl-24 rounded-2xl font-black text-sm tracking-[0.1em] border-2 border-transparent focus:border-[#002A8F] focus:bg-white outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* BOTÓN FINAL */}
                <button onClick={enviarPedido}
                        className="w-full bg-[#002A8F] hover:bg-[#CF142B] text-white font-black py-5 rounded-[20px] text-[11px] uppercase tracking-[0.4em] shadow-xl transition-all active:scale-95 group relative overflow-hidden">
                    <span className="relative z-10">Confirmar Transacción ⚡</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
            </div>
        </div>
    );
}