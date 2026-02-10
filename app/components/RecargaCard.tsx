'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    categoria: string;
    precio: string;
}

// ... (resto del código anterior se mantiene igual)

export default function RecargaCard() {
    // ... (estados anteriores)
    const [error, setError] = useState('');

    // --- NUEVA LÓGICA DE VALIDACIÓN ---
    const esRemesa = normalizar(servicio).includes('dinero');

    const validarDato = (valor: string) => {
        setNumero(valor.replace(/\D/g, '')); // Solo números
        setError('');

        if (esRemesa) {
            // Validación para Tarjetas CUP/MLC (ejemplo: 16 dígitos)
            if (valor.length > 0 && valor.length !== 16) {
                setError('La tarjeta debe tener 16 dígitos');
            }
        } else if (normalizar(servicio).includes('etecsa')) {
            // Validación para Celulares Cuba (deben empezar con 5 y tener 8 dígitos)
            if (valor.length > 0 && !valor.startsWith('5')) {
                setError('El número debe empezar con 5');
            } else if (valor.length > 8) {
                setError('Máximo 8 dígitos');
            } else if (valor.length > 0 && valor.length < 8) {
                setError('Faltan dígitos (deben ser 8)');
            }
        }
    };

    const enviarPedido = () => {
        if (!numero) return alert("Por favor, ingresa el número o tarjeta.");
        if (error) return alert("Corrige los errores en el número antes de continuar.");

        // ... (resto de la lógica de enviarPedido se mantiene igual)
    };

    return (
        // ... (Header y selectores de servicio)

        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder={esRemesa ? "NÚMERO DE TARJETA (16 DÍGITOS)" : "TELÉFONO (EJ. 52345678)"}
                    value={numero}
                    onChange={e => validarDato(e.target.value)}
                    maxLength={esRemesa ? 16 : 8}
                    className={`w-full bg-slate-100 border-2 p-4 rounded-xl font-black text-[10px] text-center outline-none transition-all uppercase placeholder:text-slate-300 ${
                        error ? 'border-red-500 text-red-600' : 'border-slate-100 focus:border-[#002A8F] focus:bg-white'
                    }`}
                />
                {error && (
                    <p className="absolute -bottom-5 left-0 right-0 text-center text-[8px] text-red-500 font-bold uppercase">
                        {error}
                    </p>
                )}
            </div>

            <button
                onClick={enviarPedido}
                disabled={!!error || !numero}
                className={`w-full font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-lg transition-all active:scale-95 ${
                    error || !numero
                        ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                        : 'bg-[#002A8F] hover:bg-[#CF142B] text-white shadow-blue-900/20'
                }`}>
                {error ? 'Dato Inválido ❌' : 'Confirmar Operación 🚀'}
            </button>
        </div>
</div>
</div>
);
}