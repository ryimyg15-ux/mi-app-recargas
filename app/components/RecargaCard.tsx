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
    const [tasas, setTasas] = useState<Record<string, number>>({});

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
                const iniciales = data.filter((o: Oferta) => o.categoria === 'Recarga a Cuba (ETECSA)');
                setOfertasFiltradas(iniciales);
                setOfertaSeleccionada(iniciales[0]);
            }
        });

        // Tasas de cambio (Puedes mover esto a tu Excel después)
        setTasas({
            'Brasil (PIX)': 1.0,
            'EE.UU (Zelle)': 0.18,
            'Europa (Euros)': 0.16
        });
    }, []);

    const calcularPrecio = (precioBase: string) => {
        const numBase = parseFloat(precioBase.replace(/[^0-9.]/g, ''));
        const tasaActual = tasas[pago] || 1.0;
        const total = (numBase * tasaActual).toFixed(2);

        if (pago.includes('Brasil')) return `R$ ${total}`;
        if (pago.includes('EE.UU')) return `$ ${total} USD`;
        if (pago.includes('Europa')) return `€ ${total}`;
        return total;
    };

    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        setOfertaSeleccionada(filtradas.length > 0 ? filtradas[0] : null);
    }, [servicio, todasLasOfertas]);

    // Función de estilo dinámico (Ahora fuera del return)
    const getEstiloBoton = () => {
        if (pago.includes('Brasil')) return 'from-[#009739] to-[#007b2e] shadow-green-200';
        if (pago.includes('EE.UU')) return 'from-[#002A8F] to-[#001f6d] shadow-blue-200';
        if (pago.includes('Europa')) return 'from-[#CF142B] to-[#a51022] shadow-red-200';
        return 'from-slate-800 to-slate-900';
    };

    const enviarWhatsApp = () => {
        if (!numero || numero.length < 8) { alert("Introduce el número"); return; }
        const precioFinal = calcularPrecio(ofertaSeleccionada?.precio || "0");
        const mensajeTexto = `Hola Nexus R&DAY 🚀
Quiero hacer una recarga móvil.

📱 *Tipo de servicio:* ${servicio}
🇧🇷 *Origen del pago:* ${pago}
✅ *Recarga seleccionada:* ${ofertaSeleccionada?.nombre}
💰 *Monto Final:* ${precioFinal}
☎️ *Número a recargar:* +53 ${numero}

🌐 Vengo desde: nexusR&DAY.com`;

        window.open(`https://wa.me/+5547999222521?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/20 overflow-hidden mb-20">
            <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
                    <div className="space-y-8">
                        <div>
                            <label className="text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4 block">1. Configuración</label>
                            <div className="space-y-3">
                                {['Recarga a Cuba (ETECSA)', 'Recarga Nauta (Internet)', 'Combo de Comida/Aseo'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setServicio(s)}
                                        className={`w-full p-4 rounded-2xl text-left transition-all ${
                                            servicio === s ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        } font-bold text-sm`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4 block">2. Moneda de Pago</label>
                            <select
                                value={pago}
                                onChange={(e) => setPago(e.target.value)}
                                className="w-full p-5 rounded-2xl bg-slate-900 text-white font-bold outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option>Brasil (PIX)</option>
                                <option>EE.UU (Zelle)</option>
                                <option>Europa (Euros)</option>
                            </select>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: OFERTAS */}
                    <div className="space-y-6">
                        <label className="text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4 block">3. Ofertas Disponibles</label>
                        <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                            {ofertasFiltradas.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setOfertaSeleccionada(item)}
                                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                                        ofertaSeleccionada?.nombre === item.nombre ? 'border-green-500 bg-green-50/50' : 'border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-slate-800 leading-tight">{item.nombre}</p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">{item.descripcion}</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-blue-600 font-black text-lg whitespace-nowrap">{calcularPrecio(item.precio)}</p>
                                            <p className="text-[8px] text-slate-400 uppercase tracking-tighter">Tasa Nexus</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <label className="text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4 block">4. Número del Beneficiario</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">+53</span>
                                <input
                                    type="number"
                                    placeholder="5XXXXXXX"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="w-full p-5 pl-16 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 font-bold text-xl outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aviso de Seguridad */}
                <div className="mt-8 flex items-center justify-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </div>
                    <p className="text-[11px] font-bold text-blue-800 uppercase tracking-tighter">
                        Transacción segura: <span className="font-light">Cifrado de extremo a extremo activo • Nexus SafePay v2.4</span>
                    </p>
                </div>

                {/* Aquí debajo ya iría tu <button onClick={enviarWhatsApp}... */}
                {/* BOTÓN FINAL CON ESTILO DINÁMICO */}
                <button
                    onClick={enviarWhatsApp}
                    className={`w-full mt-12 bg-gradient-to-r ${getEstiloBoton()} text-white font-black py-6 rounded-[25px] shadow-2xl transition-all duration-500 active:scale-95 text-xl tracking-widest flex items-center justify-center gap-3`}
                >
                    {pago.includes('Brasil') && <span>🇧🇷</span>}
                    {pago.includes('EE.UU') && <span>🇺🇸</span>}
                    {pago.includes('Europa') && <span>🇪🇺</span>}
                    GENERAR PEDIDO {pago.split(' ')[0].toUpperCase()}
                </button>

                <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    🔒 Transacción protegida por cifrado Nexus R&DAY
                </p>
            </div>
        </div>
    );
}