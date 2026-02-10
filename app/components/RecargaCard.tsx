'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    precio: string;
    descripcion: string;
    popular: string;
    categoria: string;
}

export default function RecargaCard() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState<Oferta[]>([]);
    const [servicio, setServicio] = useState('Recarga a Cuba (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Carga inicial de datos
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL_OFERTAS = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL_OFERTAS, {
            download: true,
            header: true,
            complete: (results: any) => {
                const data = results.data as Oferta[];
                setTodasLasOfertas(data);
                const iniciales = data.filter((o) => o.categoria === 'Recarga a Cuba (ETECSA)');
                setOfertasFiltradas(iniciales);
                setOfertaSeleccionada(iniciales[0] || null); // Selecciona la primera por defecto
            }
        });
    }, []);

    // CAMBIO CLAVE: Reiniciar selección al cambiar de servicio
    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        setOfertaSeleccionada(filtradas[0] || null); // Fuerza la selección de la primera del nuevo grupo
    }, [servicio, todasLasOfertas]);

    const calcularPrecio = (precioBase: string) => {
        if (!precioBase) return "0.00";
        const limpio = precioBase.replace(',', '.').replace(/[^0-9.]/g, '');
        const numBase = parseFloat(limpio);
        if (isNaN(numBase)) return precioBase;

        let totalNum: number;
        if (pago.includes('Europa')) totalNum = numBase / 5.50;
        else if (pago.includes('EE.UU')) totalNum = numBase / 5.80;
        else totalNum = numBase;

        const total = totalNum.toFixed(2);
        if (pago.includes('Brasil')) return `R$ ${total}`;
        if (pago.includes('EE.UU')) return `$ ${total} USD`;
        if (pago.includes('Europa')) return `€ ${total}`;
        return total;
    };

    const enviarWhatsApp = () => {
        if (!numero || numero.length < 8) { alert("Introduce el número"); return; }
        setIsSuccess(true);
        const precioFinal = calcularPrecio(ofertaSeleccionada?.precio || "0");
        const mensajeTexto = `Hola Nexus R&DAY 🚀\nServicio: ${servicio}\nPago: ${pago}\nOferta: ${ofertaSeleccionada?.nombre}\nPrecio: ${precioFinal}\nNúmero: +53 ${numero}`;
        window.open(`https://wa.me/+5547999222521?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
    };

    return (
        <div className="p-5 md:p-8 text-slate-800">
            <div className="grid md:grid-cols-2 gap-6">
                {/* COLUMNA IZQUIERDA */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#002A8F] mb-3 block">01. Servicio</label>
                        <div className="flex flex-col gap-2">
                            {[
                                { id: 'Recarga a Cuba (ETECSA)', icon: '🇨🇺' },
                                { id: 'Recarga Nauta (Internet)', icon: '🌐' },
                                { id: 'Combo de Comida/Aseo', icon: '📦' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setServicio(item.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                                        servicio === item.id
                                            ? 'border-[#002A8F] bg-[#002A8F] text-white shadow-md'
                                            : 'border-slate-100 bg-white text-slate-500 hover:border-blue-100'
                                    }`}
                                >
                                    <span className="font-bold text-[11px] uppercase">{item.id}</span>
                                    <span className="text-lg">{item.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#009739] mb-3 block">02. Moneda</label>
                        <div className="grid grid-cols-1 gap-2">
                            {['Brasil (PIX)', 'EE.UU (Zelle)', 'Europa (Euros)'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setPago(m)}
                                    className={`p-3 rounded-xl flex items-center gap-3 border-2 transition-all ${
                                        pago === m
                                            ? 'border-slate-900 bg-slate-900 text-white'
                                            : 'border-slate-100 bg-white text-slate-400'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${m.includes('Brasil') ? 'bg-[#009739]' : m.includes('EE.UU') ? 'bg-[#002A8F]' : 'bg-[#CF142B]'}`}></div>
                                    <span className="font-bold text-[10px] uppercase">{m}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#CF142B] mb-3 block">03. Oferta</label>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                            {ofertasFiltradas.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => setOfertaSeleccionada(item)}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                        ofertaSeleccionada?.nombre === item.nombre
                                            ? 'border-[#002A8F] bg-blue-50/50 shadow-sm'
                                            : 'border-slate-100 bg-white'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-black text-slate-800 text-[11px] uppercase">{item.nombre}</p>
                                        <p className="text-[#002A8F] font-black text-sm italic">{calcularPrecio(item.precio)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">04. Número (+53)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">+53</span>
                            <input
                                type="number"
                                placeholder="5XXXXXXX"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                className="w-full p-3 pl-14 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#002A8F] outline-none font-black text-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={enviarWhatsApp}
                className="w-full mt-8 bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-[#002A8F] transition-all shadow-lg text-xs uppercase tracking-[0.2em]"
            >
                Confirmar Orden Premium 🚀
            </button>
        </div>
    );
}