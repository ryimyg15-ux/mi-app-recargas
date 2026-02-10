'use client';
import { useState } from 'react';

// 1. Definimos la "forma" de nuestra oferta
interface Oferta {
    id: number;
    nombre: string;
    precio: string;
    desc: string;
    popular?: boolean; // El signo '?' indica que es opcional
}

const ofertas: Oferta[] = [
    { id: 1, nombre: 'ETECSA 2GB', precio: '€3,64', desc: '2GB + 300MB nacional' },
    { id: 2, nombre: 'ETECSA 7GB', precio: '€16,36', desc: '7GB + 300MB nacional', popular: true },
    { id: 3, nombre: 'Saldo Móvil', precio: '€5,45', desc: '360 CUP de saldo' },
];

export default function RecargaCard() {
    const [seleccionada, setSeleccionada] = useState<number | null>(null);

    const enviarWhatsApp = (oferta: string) => {
        const telefono = "+5547999222521";
        const mensaje = encodeURIComponent(`Hola, me interesa la oferta: ${oferta}`);
        window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {ofertas.map((item) => (
                <div
                    key={item.id}
                    onClick={() => setSeleccionada(item.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        seleccionada === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                >
                    {/* Aquí IntelliJ ya no marcará error porque definimos 'popular' arriba */}
                    {item.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">
              Más vendido
            </span>
                    )}

                    <h3 className="text-xl font-bold">{item.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                    <p className="text-3xl font-black text-blue-600 mb-6">{item.precio}</p>

                    <button
                        onClick={(e) => { e.stopPropagation(); enviarWhatsApp(item.nombre); }}
                        className="w-full bg-green-500 text-white font-bold py-3 rounded-xl"
                    >
                        Pedir por WhatsApp
                    </button>
                </div>
            ))}
        </div>
    );
}