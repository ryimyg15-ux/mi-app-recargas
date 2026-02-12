'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function RecargaCard() {
    const [monto, setMonto] = useState<number>(100);
    const [tasaBase, setTasaBase] = useState<number>(92);
    const [tipoDestino, setTipoDestino] = useState('CUP');
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [nombreTitular, setNombreTitular] = useState('');

    // Tasas escalonadas según el monto (Lógica de negocio profesional)
    const tasasEscalonadas = [
        { rango: '10-99 BRL', tasa: 92, color: 'border-blue-200' },
        { rango: '100-499 BRL', tasa: 96, color: 'border-green-200' },
        { rango: '500-999 BRL', tasa: 97, color: 'border-orange-200' },
        { rango: '1000+ BRL', tasa: 98, color: 'border-purple-200' },
    ];

    // Determinar tasa actual
    const tasaActual = monto >= 1000 ? 98 : monto >= 500 ? 97 : monto >= 100 ? 96 : 92;

    const abrirWhatsapp = (agente: string) => {
        const mensaje = `*NUEVA OPERACIÓN*\n\n💰 *Monto:* ${monto} BRL\n📈 *Tasa aplicada:* 1:${tasaActual}\n🇨🇺 *Recibe en Cuba:* ${monto * tasaActual} CUP\n📍 *Destino:* ${tipoDestino}\n💳 *Tarjeta:* ${numeroTarjeta || 'N/A'}\n👤 *Titular:* ${nombreTitular || 'N/A'}`;
        const telf = agente === 'Jonathan' ? '5547999222521' : '5547988884444';
        window.open(`https://wa.me/${telf}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-sm max-w-2xl mx-auto border border-slate-100">

            {/* 1. INDICADOR DE PAÍSES */}
            <div className="flex justify-center items-center gap-3 mb-8">
                <span className="text-2xl">🇧🇷</span>
                <span className="text-slate-300">→</span>
                <span className="text-2xl">🇨🇺</span>
            </div>

            <h2 className="text-center text-[#002A8F] font-bold text-xl mb-6">Brasil → Cuba (Transferencia)</h2>

            {/* 2. GRID DE TASAS ESCALONADAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                {tasasEscalonadas.map((t, i) => (
                    <div key={i} className={`p-3 rounded-2xl border-2 text-center transition-all ${tasaActual === t.tasa ? 'bg-blue-50 border-blue-500 scale-105 shadow-md' : 'bg-slate-50 border-transparent opacity-60'}`}>
                        <p className="text-[8px] font-black text-slate-400 uppercase">{t.rango}</p>
                        <p className="text-xl font-black text-[#002A8F]">{t.tasa}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">CUP/BRL</p>
                    </div>
                ))}
            </div>

            {/* 3. SELECTOR DE DESTINO */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { id: 'CUP', label: 'CUP', sub: 'Tradicional', icon: '🏛️', color: 'blue' },
                    { id: 'CLASSIC', label: 'Clásica', sub: 'Mínimo 20 USD', icon: '💳', color: 'orange' },
                    { id: 'TROPICAL', label: 'Tráfico', sub: 'Sin comisión', icon: '🟢', color: 'emerald' },
                ].map((item) => (
                    <button key={item.id} onClick={() => setTipoDestino(item.id)}
                            className={`p-4 rounded-3xl border-2 flex flex-col items-center transition-all ${tipoDestino === item.id ? 'border-blue-500 bg-white shadow-lg' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                        <span className="text-xl mb-1">{item.icon}</span>
                        <p className="text-[10px] font-black uppercase text-slate-800">{item.label}</p>
                        <p className="text-[8px] text-slate-400 font-bold">{item.sub}</p>
                    </button>
                ))}
            </div>

            {/* 4. INPUT DE MONTO */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Monto a enviar (BRL)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                    <input type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))}
                           className="w-full bg-white p-4 pl-12 rounded-2xl text-xl font-black text-[#002A8F] outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" />
                </div>
            </div>

            {/* 5. RESULTADO DEL CÁLCULO */}
            <div className="bg-emerald-50/50 p-6 rounded-[2rem] border-2 border-emerald-100 mb-8 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Monto enviado:</span>
                    <span className="font-bold">R$ {monto.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Tasa aplicada:</span>
                    <span className="text-blue-600 font-black">1 BRL = {tasaActual} CUP</span>
                </div>
                <div className="h-[1px] bg-emerald-200/50 w-full my-2"></div>
                <div className="flex justify-between items-center">
                    <span className="text-emerald-700 font-black text-sm uppercase">Recibirá en Cuba:</span>
                    <span className="text-3xl font-black text-emerald-600">{(monto * tasaActual).toLocaleString()} <small className="text-sm">CUP</small></span>
                </div>
            </div>

            {/* 6. DATOS OPCIONALES */}
            <div className="space-y-3 mb-8">
                <input type="text" placeholder="Número de tarjeta o cuenta (Opcional)" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)}
                       className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border border-slate-100 outline-none focus:bg-white" />
                <input type="text" placeholder="Nombre completo del beneficiario" value={nombreTitular} onChange={(e) => setNombreTitular(e.target.value)}
                       className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border border-slate-100 outline-none focus:bg-white" />
            </div>

            {/* 7. BOTONES DE ACCIÓN */}
            <div className="space-y-3">
                <p className="text-center text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest italic">Selecciona un contacto para continuar:</p>
                <button onClick={() => abrirWhatsapp('Jonathan')}
                        className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:brightness-95 transition-all">
                    <span>WhatsApp Jonathan</span>
                    <span className="opacity-60 text-[8px]">+55 47 99222-2521</span>
                </button>
                <button onClick={() => abrirWhatsapp('David')}
                        className="w-full bg-[#128C7E] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:brightness-95 transition-all">
                    <span>WhatsApp David</span>
                    <span className="opacity-60 text-[8px]">+55 47 98844-4444</span>
                </button>
            </div>

            {/* FOOTER DE CONFIANZA */}
            <div className="grid grid-cols-3 gap-2 mt-8 opacity-40 grayscale">
                <div className="flex flex-col items-center">
                    <span className="text-xs">⚡</span>
                    <span className="text-[7px] font-black uppercase">Entrega Rápida</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs">🛡️</span>
                    <span className="text-[7px] font-black uppercase">Pago Seguro</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs">💬</span>
                    <span className="text-[7px] font-black uppercase">Soporte 24/7</span>
                </div>
            </div>
        </div>
    );
}