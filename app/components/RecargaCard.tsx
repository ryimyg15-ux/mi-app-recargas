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
    const [isSuccess, setIsSuccess] = useState(false);
    const [servicio, setServicio] = useState('Recarga a Cuba (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');

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
                setOfertaSeleccionada(iniciales[0] || null);
            },
            error: (error: any) => console.error("Error cargando Google Sheets:", error)
        });
    }, []);

    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        setOfertaSeleccionada(filtradas[0] || null);
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

        setTimeout(() => {
            window.open(`https://wa.me/+5547999222521?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-[30px] shadow-xl text-center max-w-md mx-auto">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-slate-800">¡Pedido Enviado!</h2>
                <p className="text-slate-500 mb-6 text-sm">Abriendo WhatsApp...</p>
                <button onClick={() => setIsSuccess(false)} className="text-blue-600 font-bold text-xs uppercase">← Volver</button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[30px] shadow-2xl p-6 md:p-10 text-slate-800">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Columna 1 */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-3">1. Servicio</label>
                        <div className="grid gap-2">
                            {['Recarga a Cuba (ETECSA)', 'Recarga Nauta (Internet)', 'Combo de Comida/Aseo'].map(s => (
                                <button key={s} onClick={() => setServicio(s)} className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${servicio === s ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-3">2. Moneda</label>
                        <select value={pago} onChange={(e) => setPago(e.target.value)} className="w-full p-3 rounded-xl bg-slate-900 text-white font-bold text-sm outline-none">
                            <option>Brasil (PIX)</option>
                            <option>EE.UU (Zelle)</option>
                            <option>Europa (Euros)</option>
                        </select>
                    </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-3">3. Seleccione Oferta</label>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                            {ofertasFiltradas.map((item, i) => (
                                <div key={i} onClick={() => setOfertaSeleccionada(item)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${ofertaSeleccionada?.nombre === item.nombre ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold">{item.nombre}</span>
                                        <span className="text-blue-600 font-black text-sm">{calcularPrecio(item.precio)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-3">4. Número (+53)</label>
                        <input type="number" placeholder="5XXXXXXX" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full p-3 rounded-xl bg-slate-100 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                </div>
            </div>

            <button onClick={enviarWhatsApp} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200">
                GENERAR PEDIDO
            </button>
        </div>
    );
}