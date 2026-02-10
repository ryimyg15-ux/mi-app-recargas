'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    precio: string;
    descripcion: string; // <-- Corregido de 'desc' a 'descripcion'
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

    // Función para obtener icono por categoría
    const getIcono = (cat: string) => {
        if (cat.includes('ETECSA')) return '📱';
        if (cat.includes('Nauta')) return '🌐';
        if (cat.includes('Combo')) return '📦';
        return '✨';
    };

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (results) => {
                const data = results.data as Oferta[];
                setTodasLasOfertas(data);
                const iniciales = data.filter(o => o.categoria === 'Recarga a Cuba (ETECSA)');
                setOfertasFiltradas(iniciales);
                if (iniciales.length > 0) setOfertaSeleccionada(iniciales[0]);
            },
        });
    }, []);

    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        setOfertaSeleccionada(filtradas.length > 0 ? filtradas[0] : null);
    }, [servicio, todasLasOfertas]);

    const playSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => {});
    };

    const enviarWhatsApp = () => {
        if (!numero || numero.length < 8) {
            alert("Por favor, introduce el número de teléfono beneficiario");
            return;
        }
        playSound();
        const telefono = "+5547999222521";
        const mensajeTexto = `Hola Nexus R&DAY 🚀
        Quiero hacer una recarga móvil.
        
        📱 *Tipo de servicio:* ${servicio}
        🇧🇷 *Origen del pago:* ${pago}
        ✅ *Recarga seleccionada:* ${ofertaSeleccionada?.nombre}
        💰 *Monto:* ${ofertaSeleccionada?.precio}
        ☎ *Número a recargar:* +53 ${numero}
        
        🌐 Vengo desde: NEXUS-R&DAY`;

        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensajeTexto)}`, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-10">
                <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <span className="bg-blue-600 text-white p-2 rounded-xl shadow-lg">NX</span>
                    Nexus Configurator
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">1. Selecciona Servicio</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['Recarga a Cuba (ETECSA)', 'Recarga Nauta (Internet)', 'Combo de Comida/Aseo'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { playSound(); setServicio(s); }}
                                        className={`p-4 rounded-2xl text-left transition-all border-2 flex items-center gap-3 ${
                                            servicio === s
                                                ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                        }`}
                                    >
                                        <span className="text-2xl bg-white p-1 rounded-lg shadow-sm">{getIcono(s)}</span>
                                        <span className="font-bold text-sm">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">2. Origen del Pago</label>
                            <select
                                value={pago}
                                onChange={(e) => setPago(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-gray-100 outline-none focus:border-green-500 font-bold text-gray-700"
                            >
                                <option>Brasil (PIX)</option>
                                <option>Brasil (Boleto/Transf)</option>
                                <option>EE.UU (Zelle)</option>
                                <option>Europa (Euros)</option>
                            </select>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: OFERTAS Y TELÉFONO */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">3. Elige tu Oferta</label>
                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                {ofertasFiltradas.length > 0 ? (
                                    ofertasFiltradas.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => { playSound(); setOfertaSeleccionada(item); }}
                                            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                                                ofertaSeleccionada?.nombre === item.nombre
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-gray-800 leading-none">{item.nombre}</p>
                                                    <p className="text-[11px] text-gray-500 mt-2 italic">{item.descripcion}</p>
                                                </div>
                                                <span className="font-bold text-blue-700 bg-white px-2 py-1 rounded-lg text-sm shadow-sm">
                                                    {item.precio}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 bg-orange-50 text-orange-600 rounded-xl text-sm italic">
                                        Cargando ofertas disponibles...
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">4. Número en Cuba</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-600 border-r pr-3">+53</span>
                                <input
                                    type="number"
                                    placeholder="5XXXXXXX"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="w-full p-4 pl-16 rounded-2xl bg-slate-900 text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-black text-xl tracking-widest"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={enviarWhatsApp}
                    className="w-full mt-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black py-6 rounded-2xl shadow-xl shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-4 text-2xl"
                >
                    🚀 ENVIAR SOLICITUD PIX
                </button>
                <p className="text-center mt-4 text-gray-400 text-xs font-medium uppercase tracking-widest">
                    Nexus R&DAY • Seguridad Garantizada
                </p>
            </div>
        </div>
    );
}