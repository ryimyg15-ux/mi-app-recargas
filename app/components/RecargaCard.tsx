'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    precio: string;
    desc: string;
    popular: string;
}

export default function RecargaCard() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    // Estados para las selecciones del usuario
    const [servicio, setServicio] = useState('Recarga a Cuba (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (results) => {
                const data = results.data as Oferta[];
                setOfertas(data);
                if (data.length > 0) setOfertaSeleccionada(data[0]);
            },
        });
    }, []);

    const playSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    };

    const enviarWhatsApp = () => {
        if (!numero || numero.length < 8) {
            alert("Por favor, introduce un número de teléfono válido");
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
☎️ *Número a recargar:* +53 ${numero}

🌐 Vengo desde: nexusR&DAY.com`;

        const mensajeEncoded = encodeURIComponent(mensajeTexto);
        setTimeout(() => {
            window.open(`https://wa.me/${telefono}?text=${mensajeEncoded}`, '_blank');
        }, 150);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2">
                    <span className="bg-yellow-400 p-2 rounded-lg text-lg">📝</span> Configura tu Envío
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Tipo de Servicio */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">1. Tipo de Servicio</label>
                        <select
                            value={servicio}
                            onChange={(e) => setServicio(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-medium"
                        >
                            <option>Recarga a Cuba (ETECSA)</option>
                            <option>Recarga Nauta (Internet)</option>
                            <option>Combo de Comida/Aseo</option>
                        </select>
                    </div>

                    {/* 2. Origen del Pago */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">2. Origen del Pago</label>
                        <select
                            value={pago}
                            onChange={(e) => setPago(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-green-500 outline-none transition-all font-medium"
                        >
                            <option>Brasil (PIX)</option>
                            <option>Brasil (Transferencia)</option>
                            <option>EE.UU (Zelle/Card)</option>
                            <option>Europa (Euros)</option>
                        </select>
                    </div>

                    {/* 3. Selección de Oferta (Viene de Google Sheets) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">3. Selecciona la Oferta</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {ofertas.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setOfertaSeleccionada(item)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                        ofertaSeleccionada?.nombre === item.nombre
                                            ? 'border-[#009739] bg-green-50 shadow-inner'
                                            : 'border-gray-100 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <p className="font-bold text-sm text-gray-800">{item.nombre}</p>
                                    <p className="text-[#002A8F] font-black">{item.precio}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Número a Recargar */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">4. Número de Teléfono (+53)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 border-r pr-3">+53</span>
                            <input
                                type="number"
                                placeholder="5XXXXXXX"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                className="w-full p-4 pl-16 rounded-xl bg-slate-50 border-2 border-transparent focus:border-red-500 outline-none transition-all font-bold text-lg"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">* Verificamos el número antes de procesar el pago.</p>
                    </div>
                </div>

                {/* Botón Final */}
                <button
                    onClick={enviarWhatsApp}
                    className="w-full mt-8 bg-[#009739] hover:bg-[#007b2e] text-[#FEDD00] font-black py-5 rounded-2xl shadow-xl transform transition-all active:scale-95 hover:scale-[1.01] flex items-center justify-center gap-3 text-xl"
                >
                    🚀 ENVIAR RECARGA AHORA
                </button>
            </div>
        </div>
    );
}