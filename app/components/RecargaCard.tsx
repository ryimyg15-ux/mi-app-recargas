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

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (results) => {
                setOfertas(results.data as Oferta[]);
            },
        });
    }, []);

    const enviarWhatsApp = (oferta: string) => {
        const telefono = "+5547999222521";
        const mensaje = encodeURIComponent(`Hola, me interesa la oferta: ${oferta}`);
        window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {ofertas.map((item, index) => (
                <div
                    key={index}
                    className="relative p-6 rounded-3xl border-2 border-transparent bg-white shadow-lg hover:shadow-2xl hover:border-[#009739]/30 transition-all duration-300 group flex flex-col justify-between"
                >
                    {/* Etiqueta de Destaque */}
                    {item.popular === 'true' && (
                        <span className="absolute -top-3 right-6 bg-[#FEDD00] text-[#009739] text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-md border border-[#009739] z-10">
                            ⭐ Destaque
                        </span>
                    )}

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#002A8F] transition-colors">
                            {item.nombre}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 mb-4 h-10 overflow-hidden line-clamp-2">
                            {item.desc}
                        </p>

                        {/* Sección de Precio con Banderas */}
                        <div className="flex items-center justify-between mb-6 bg-slate-50 p-3 rounded-xl border border-dashed border-gray-300">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-400 font-bold">Precio</span>
                                <p className="text-3xl font-black text-[#002A8F]">{item.precio}</p>
                            </div>
                            <div className="flex -space-x-2">
                                <span className="text-2xl shadow-sm bg-white rounded-full w-8 h-8 flex items-center justify-center border border-gray-100">🇧🇷</span>
                                <span className="text-2xl shadow-sm bg-white rounded-full w-8 h-8 flex items-center justify-center border border-gray-100">🇨🇺</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); enviarWhatsApp(item.nombre); }}
                        className="w-full bg-[#009739] hover:bg-[#007b2e] text-[#FEDD00] font-black py-4 rounded-xl shadow-md transform transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                    >
                        <span className="text-xl">➔</span> SOLICITAR AHORA
                    </button>
                </div>
            ))}
        </div>
    );
}