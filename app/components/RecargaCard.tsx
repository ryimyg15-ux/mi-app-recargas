'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    precio: string;
    desc: string;
    popular: string;
    categoria: string; // <-- Nueva columna en tu Excel
}

export default function RecargaCard() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState<Oferta[]>([]);

    // Estados de selección
    const [servicio, setServicio] = useState('Recarga a Cuba (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');

    // 1. Cargar todas las ofertas al inicio
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (results) => {
                const data = results.data as Oferta[];
                setTodasLasOfertas(data);
                // Filtrado inicial
                const iniciales = data.filter(o => o.categoria === 'Recarga a Cuba (ETECSA)');
                setOfertasFiltradas(iniciales);
                if (iniciales.length > 0) setOfertaSeleccionada(iniciales[0]);
            },
        });
    }, []);

    // 2. Efecto para filtrar cuando cambie el servicio
    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        setOfertaSeleccionada(filtradas.length > 0 ? filtradas[0] : null);
    }, [servicio, todasLasOfertas]);

    const playSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    };

    const enviarWhatsApp = () => {
        if (!numero || numero.length < 8) {
            alert("Por favor, introduce el número de teléfono");
            return;
        }
        if (!ofertaSeleccionada) {
            alert("Selecciona una oferta primero");
            return;
        }

        playSound();
        const telefono = "+5547999222521";
        const mensajeTexto = `Hola Nexus R&DAY 🚀
Quiero hacer una recarga móvil.

📱 *Tipo de servicio:* ${servicio}
🇧🇷 *Origen del pago:* ${pago}
✅ *Recarga seleccionada:* ${ofertaSeleccionada.nombre}
💰 *Monto:* ${ofertaSeleccionada.precio}
☎️ *Número a recargar:* +53 ${numero}

🌐 Vengo desde: nexusR&DAY.com`;

        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2">
                    <span className="bg-yellow-400 p-2 rounded-lg text-lg">⚙️</span> Nexus Configurator
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SELECCIÓN DE SERVICIO */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">1. ¿Qué deseas enviar?</label>
                        <div className="flex flex-col gap-2">
                            {['Recarga a Cuba (ETECSA)', 'Recarga Nauta (Internet)', 'Combo de Comida/Aseo'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setServicio(s)}
                                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                                        servicio === s ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ORIGEN DEL PAGO */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">2. Método de Pago</label>
                        <select
                            value={pago}
                            onChange={(e) => setPago(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-gray-100 outline-none focus:border-green-500 font-medium"
                        >
                            <option>Brasil (PIX)</option>
                            <option>EE.UU (Zelle)</option>
                            <option>Europa (Transferencia)</option>
                        </select>

                        {/* NÚMERO DE TELÉFONO */}
                        <label className="block text-sm font-bold text-gray-700 pt-4">3. Número del Beneficiario</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">+53</span>
                            <input
                                type="number"
                                placeholder="5XXXXXXX"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                className="w-full p-4 pl-14 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-red-500 font-bold text-lg"
                            />
                        </div>
                    </div>

                    {/* LISTA DINÁMICA DE OFERTAS */}
                    <div className="md:col-span-2 space-y-4 border-t pt-8">
                        <label className="block text-sm font-bold text-gray-700">4. Ofertas disponibles para {servicio}:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ofertasFiltradas.length > 0 ? (
                                ofertasFiltradas.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setOfertaSeleccionada(item)}
                                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${
                                            ofertaSeleccionada?.nombre === item.nombre
                                                ? 'border-[#009739] bg-green-50'
                                                : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold text-gray-800">{item.nombre}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                        <p className="font-black text-[#002A8F] bg-white px-3 py-1 rounded-lg shadow-sm">
                                            {item.precio}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 italic">No hay ofertas disponibles para esta categoría.</p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={enviarWhatsApp}
                    className="w-full mt-10 bg-[#009739] hover:bg-[#007b2e] text-[#FEDD00] font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-xl"
                >
                    🚀 GENERAR PEDIDO POR WHATSAPP
                </button>
            </div>
        </div>
    );
}