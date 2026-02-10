'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';


interface Oferta {
    nombre: string;
    precio: string;
    desc: string;
    popular: string; // Google Sheets lo envía como texto
}

export default function RecargaCard() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [seleccionada, setSeleccionada] = useState<string | null>(null);

    useEffect(() => {
        // Sustituye con el ID de tu hoja de Google Sheets
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
                    onClick={() => setSeleccionada(item.nombre)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        seleccionada === item.nombre ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                >
                    {item.popular === 'true' && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">
              Más vendido
            </span>
                    )}
                    <h3 className="text-xl font-bold">{item.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                    <p className="text-3xl font-black text-blue-600 mb-6">{item.precio}</p>


                    <button
                        onClick={(e) => { e.stopPropagation(); enviarWhatsApp(item.nombre); }}
                        className="w-full bg-[#009739] hover:bg-[#007b2e] text-[#FEDD00] font-black py-4 rounded-xl shadow-md transform transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">➔</span> SOLICITAR AHORA

                    </button>

                </div>
            ))}
        </div>
    );
}