'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    categoria: string;
    precio: string;
}

export default function RecargaCard() {
    // 1. ESTADOS
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');
    const [montoRemesa, setMontoRemesa] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(55);
    const [error, setError] = useState('');

    // 2. UTILIDADES
    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // 3. CARGA DE DATOS (Google Sheets)
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data: Oferta[] = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                const filaTasa = data.find((o: any) => normalizar(o.nombre).includes('transferencia a cuba'));
                if (filaTasa) {
                    const valor = parseFloat(filaTasa.precio.replace(',', '.').replace(/[^0-9.]/g, ''));
                    if (!isNaN(valor)) setTasaCup(valor);
                }
            }
        });
    }, []);

    // 4. LÓGICA DE FILTRADO Y VALIDACIÓN
    const ofertasFiltradas = useMemo(() => {
        if (todasLasOfertas.length === 0) return [];
        const servicioNormalizado = normalizar(servicio);
        return todasLasOfertas.filter((o) => {
            const catExcel = normalizar(o.categoria);
            return catExcel && (servicioNormalizado.includes(catExcel) || catExcel.includes(servicioNormalizado));
        });
    }, [servicio, todasLasOfertas]);

    useEffect(() => {
        setOfertaSeleccionada(ofertasFiltradas.length > 0 ? ofertasFiltradas[0] : null);
        setNumero(''); // Limpiar número al cambiar de servicio para evitar errores de validación
        setError('');
    }, [ofertasFiltradas]);

    const esRemesa = normalizar(servicio).includes('dinero');

    const validarDato = (valor: string) => {
        const soloNumeros = valor.replace(/\D/g, '');
        setNumero(soloNumeros);
        setError('');

        if (esRemesa) {
            if (soloNumeros.length > 0 && soloNumeros.length !== 16) {
                setError('La tarjeta debe tener 16 dígitos');
            }
        } else if (normalizar(servicio).includes('etecsa')) {
            if (soloNumeros.length > 0 && !soloNumeros.startsWith('5')) {
                setError('Debe empezar con 5');
            } else if (soloNumeros.length > 0 && soloNumeros.length < 8) {
                setError('Faltan dígitos (8 totales)');
            }
        }
    };

    const calcularPrecio = (precioBase: string) => {
        if (!precioBase) return "0.00";
        const numBase = parseFloat(precioBase.replace(',', '.').replace(/[^0-9.]/g, ''));
        if (isNaN(numBase)) return precioBase;

        let total = numBase;
        if (pago.includes('Europa')) total = numBase / 5.50;
        else if (pago.includes('EE.UU')) total = numBase / 5.80;

        const simbolo = pago.includes('Brasil') ? 'R$' : '$';
        return `${simbolo} ${total.toFixed(2)}`;
    };

    const enviarPedido = () => {
        if (!numero || error) return alert("Por favor, verifica los datos.");

        const detalle = esRemesa
            ? `💸 REMESA\n💰 Envía: ${montoRemesa} BRL\n🇨🇺 Recibe: ${(montoRemesa * tasaCup).toLocaleString()} CUP\n📈 Tasa: 1:${tasaCup}`
            : `🛒 PRODUCTO: ${ofertaSeleccionada?.nombre}\n💵 TOTAL: ${calcularPrecio(ofertaSeleccionada?.precio || '0')}`;

        const mensaje = `*NEXUS R&DAY*\n\n` +
            `👤 *Operación:* ${servicio}\n` +
            `💳 *Método:* ${pago}\n` +
            `${detalle}\n` +
            `📍 *ID/Número:* ${numero}`;

        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-xl mx-auto font-sans my-10">
            {/* Header */}
            <div className="bg-slate-900 py-3 text-center">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Nexus System v2.0</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Selectores */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">1. Operación</label>
                        {['Recarga (ETECSA)', 'Recarga (NAUTA)', 'Combo de Comida/Aseo', 'Envío de Dinero'].map(s => (
                            <button key={s} onClick={() => setServicio(s)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black transition-all border ${
                                        servicio === s ? 'bg-[#002A8F] text-white border-[#002A8F]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                    }`}>{s.toUpperCase()}</button>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">2. Pago Desde</label>
                        {['Brasil (PIX)', 'EE.UU (Zelle)', 'Europa (Euros)'].map(m => (
                            <button key={m} onClick={() => setPago(m)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black transition-all border ${
                                        pago === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                    }`}>{m.toUpperCase()}</button>
                        ))}
                    </div>
                </div>

                {/* Área Dinámica */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {esRemesa ? (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between px-2">
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Entregas (BRL)</p>
                                    <input type="number" value={montoRemesa} onChange={e => setMontoRemesa(Number(e.target.value))}
                                           className="w-20 text-center font-black text-xl text-[#002A8F] bg-white rounded-md border border-slate-200 outline-none" />
                                </div>
                                <div className="text-xl font-black text-slate-300">➜</div>
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Reciben (CUP)</p>
                                    <div className="bg-[#009739] text-white px-4 py-1.5 rounded-md font-black text-xl italic shadow-sm">
                                        {Math.round(montoRemesa * tasaCup).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {ofertasFiltradas.map((o, idx) => (
                                <button key={idx} onClick={() => setOfertaSeleccionada(o)}
                                        className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                                            ofertaSeleccionada?.nombre === o.nombre ? 'bg-white border-[#002A8F] ring-1 ring-[#002A8F]' : 'bg-white/50 border-transparent'
                                        }`}>
                                    <span className="text-[10px] font-bold text-slate-700">{o.nombre}</span>
                                    <span className="text-[10px] font-black text-[#002A8F]">{calcularPrecio(o.precio)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input de Número y Botón Final */}
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={esRemesa ? "TARJETA (16 DÍGITOS)" : "TELÉFONO (8 DÍGITOS)"}
                            value={numero}
                            onChange={e => validarDato(e.target.value)}
                            maxLength={esRemesa ? 16 : 8}
                            className={`w-full bg-slate-100 border-2 p-4 rounded-xl font-black text-[10px] text-center outline-none transition-all ${
                                error ? 'border-red-500 text-red-600' : 'border-slate-100 focus:border-[#002A8F] focus:bg-white'
                            }`}
                        />
                        {error && <p className="absolute -bottom-5 left-0 right-0 text-center text-[8px] text-red-500 font-bold uppercase">{error}</p>}
                    </div>

                    <button
                        onClick={enviarPedido}
                        disabled={!!error || !numero}
                        className={`w-full font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-lg transition-all ${
                            error || !numero ? 'bg-slate-300 text-slate-500' : 'bg-[#002A8F] hover:bg-[#CF142B] text-white'
                        }`}>
                        {error ? 'Dato Inválido ❌' : 'Confirmar Operación 🚀'}
                    </button>
                </div>
            </div>
        </div>
    );
}