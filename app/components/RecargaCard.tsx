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
        <div className="p-6 md:p-10 text-slate-800">
            <div className="grid md:grid-cols-2 gap-10">
                {/* COLUMNA IZQUIERDA: SERVICIOS Y MONEDA */}
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#002A8F] mb-4 block">
                            01. Selección de Servicio
                        </label>
                        <div className="flex flex-col gap-3">
                            {[
                                { id: 'Recarga a Cuba (ETECSA)', icon: '🇨🇺' },
                                { id: 'Recarga Nauta (Internet)', icon: '🌐' },
                                { id: 'Combo de Comida/Aseo', icon: '📦' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setServicio(item.id)}
                                    className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                                        servicio === item.id
                                            ? 'border-[#002A8F] bg-[#002A8F] text-white shadow-xl translate-x-2'
                                            : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200'
                                    }`}
                                >
                                    <span className="font-bold text-sm uppercase tracking-tight">{item.id}</span>
                                    <span className={`text-xl transition-transform group-hover:scale-125`}>{item.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009739] mb-4 block">
                            02. Moneda de Pago
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'Brasil (PIX)', color: 'bg-[#009739]' },
                                { id: 'EE.UU (Zelle)', color: 'bg-[#002A8F]' },
                                { id: 'Europa (Euros)', color: 'bg-[#CF142B]' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setPago(m.id)}
                                    className={`p-4 rounded-2xl flex items-center gap-4 border-2 transition-all ${
                                        pago === m.id
                                            ? `border-slate-900 bg-slate-900 text-white`
                                            : 'border-slate-100 bg-white text-slate-400'
                                    }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${m.color} shadow-sm`}></div>
                                    <span className="font-bold text-xs uppercase tracking-widest">{m.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: OFERTAS Y NÚMERO */}
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CF142B] mb-4 block">
                            03. Ofertas Disponibles
                        </label>
                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            {ofertasFiltradas.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => setOfertaSeleccionada(item)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                        ofertaSeleccionada?.nombre === item.nombre
                                            ? 'border-[#002A8F] bg-blue-50/50 shadow-md'
                                            : 'border-slate-100 bg-white hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="max-w-[140px]">
                                            <p className="font-black text-slate-800 text-sm leading-tight uppercase">{item.nombre}</p>
                                            <p className="text-[9px] text-slate-400 font-bold mt-1 leading-none">{item.descripcion}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#002A8F] font-black text-lg italic">{calcularPrecio(item.precio)}</p>
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Nexus Rate</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">
                            04. Beneficiario en Cuba
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-xl">🇨🇺</span>
                                <span className="font-black text-slate-400">+53</span>
                            </div>
                            <input
                                type="number"
                                placeholder="+53XXXXXX"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                className="w-full p-5 pl-24 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#002A8F] focus:bg-white transition-all font-black text-xl outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTÓN DE ACCIÓN FINAL */}
            <button
                onClick={enviarWhatsApp}
                className="w-full mt-10 relative overflow-hidden group bg-slate-900 text-white font-black py-6 rounded-[25px] transition-all active:scale-95 shadow-2xl"
            >
                {/* Efecto de brillo que recorre el botón */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative flex items-center justify-center gap-4 tracking-[0.3em] text-sm uppercase">
                    Generar Orden Premium 🚀
                </span>
            </button>

            <p className="text-center mt-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                Secure Cloud Encryption • Nexus R&DAY API v4.0
            </p>
        </div>
    );
}