'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function RecargaCard() {
    // 1. ESTADOS
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<any | null>(null);
    const [numero, setNumero] = useState('');
    const [montoRemesa, setMontoRemesa] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(55);
    const [error, setError] = useState('');

    // 2. CONFIGURACIÓN DEL MENÚ
    const menuCategorias = [
        { id: 'RECARGAS', icon: '📱', servicios: ['Recarga (ETECSA)', 'Recarga (NAUTA)'] },
        { id: 'TIENDA', icon: '🛒', servicios: ['Combo de Comida/Aseo', 'Electrodomésticos'] },
        { id: 'DINERO', icon: '💸', servicios: ['Envío de Dinero'] },
    ];

    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // 3. CARGA DE DATOS
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                // BUSCAR TASA: En tu Excel se llama "Transferencia a Cuba"
                const filaTasa = data.find((o: any) =>
                    normalizar(o.nombre).includes('transferencia a cuba')
                );

                if (filaTasa) {
                    // Limpiamos "R$92,00" para obtener solo el número 92
                    const valorLimpio = filaTasa.precio.replace('R$', '').replace(',', '.').trim();
                    const tasaNumerica = parseFloat(valorLimpio);

                    if (!isNaN(tasaNumerica)) {
                        setTasaCup(tasaNumerica);
                        console.log("Tasa cargada correctamente:", tasaNumerica);
                    }
                }
            }
        });
    }, []);

    // 4. FILTRADO
    const ofertasFiltradas = useMemo(() => {
        const servicioNormalizado = normalizar(servicio);
        return todasLasOfertas.filter((o) => {
            const catExcel = normalizar(o.categoria);
            return catExcel && (servicioNormalizado.includes(catExcel) || catExcel.includes(servicioNormalizado));
        });
    }, [servicio, todasLasOfertas]);

    useEffect(() => {
        setOfertaSeleccionada(ofertasFiltradas[0] || null);
    }, [ofertasFiltradas]);

    // 5. VALIDACIÓN
    const validarDato = (valor: string) => {
        const soloNumeros = valor.replace(/\D/g, '');
        setNumero(soloNumeros);
        setError('');
        if (categoriaActiva === 'DINERO') {
            if (soloNumeros.length > 0 && soloNumeros.length !== 16) setError('Tarjeta inválida (16 dígitos)');
        } else if (servicio.includes('ETECSA')) {
            if (soloNumeros.length > 0 && !soloNumeros.startsWith('5')) setError('Debe empezar con 5');
            else if (soloNumeros.length > 0 && soloNumeros.length !== 8) setError('Deben ser 8 dígitos');
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 flex items-center justify-center font-sans text-slate-900">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* HEADER CON LOGO */}
                <div className="bg-slate-900 p-6 text-center">
                    <h1 className="text-white font-black tracking-tighter text-2xl">NEXUS R&DAY</h1>
                    <p className="text-blue-400 text-[9px] font-bold uppercase tracking-[0.3em]">Premium Service Agency</p>
                </div>

                {/* --- MENÚ DE CATEGORÍAS --- */}
                <div className="flex justify-around bg-slate-100 p-2 m-4 rounded-2xl">
                    {menuCategorias.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setCategoriaActiva(cat.id);
                                setServicio(cat.servicios[0]);
                                setNumero('');
                            }}
                            className={`flex flex-col items-center flex-1 py-2 rounded-xl transition-all ${
                                categoriaActiva === cat.id ? 'bg-white shadow-sm scale-105' : 'opacity-50 grayscale'
                            }`}
                        >
                            <span className="text-xl">{cat.icon}</span>
                            <span className="text-[8px] font-black mt-1">{cat.id}</span>
                        </button>
                    ))}
                </div>

                <div className="px-6 pb-8 space-y-6">
                    {/* SUB-SERVICIOS SEGÚN CATEGORÍA */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Selecciona el tipo</label>
                        <div className="flex gap-2">
                            {menuCategorias.find(c => c.id === categoriaActiva)?.servicios.map(s => (
                                <button key={s} onClick={() => setServicio(s)}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold border transition-all ${
                                            servicio === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-200'
                                        }`}>
                                    {s.split('(')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MÉTODOS DE PAGO */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Pagas desde</label>
                        <select
                            value={pago}
                            onChange={(e) => setPago(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold outline-none"
                        >
                            <option>Brasil (PIX)</option>
                            <option>EE.UU (Zelle)</option>
                            <option>Europa (Euros)</option>
                        </select>
                    </div>

                    {/* LISTA DINÁMICA DE PRODUCTOS O CALCULADORA */}
                    <div className="min-h-[140px]">
                        {categoriaActiva === 'DINERO' ? (
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                                <p className="text-[10px] font-black text-blue-900 mb-2 uppercase">Calculadora de Envío</p>
                                <div className="flex items-center justify-center gap-4">
                                    <input type="number" value={montoRemesa} onChange={e => setMontoRemesa(Number(e.target.value))}
                                           className="w-24 p-2 rounded-lg border-2 border-blue-200 text-center font-black text-blue-600" />
                                    <span className="font-bold text-blue-300">➜</span>
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black italic">
                                        {Math.round(montoRemesa * tasaCup).toLocaleString()} CUP
                                    </div>
                                </div>
                                <p className="text-[8px] text-blue-400 mt-2 font-bold uppercase">Tasa: 1 BRL = {tasaCup} CUP</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {ofertasFiltradas.map((o, idx) => (
                                    <button key={idx} onClick={() => setOfertaSeleccionada(o)}
                                            className={`w-full flex justify-between p-3 rounded-xl border-2 transition-all ${
                                                ofertaSeleccionada?.nombre === o.nombre ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'
                                            }`}>
                                        <span className="text-[10px] font-bold">{o.nombre}</span>
                                        <span className="text-[10px] font-black text-blue-600">{o.precio}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DATOS DEL BENEFICIARIO */}
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={categoriaActiva === 'DINERO' ? "NÚMERO DE TARJETA (16 DÍGITOS)" : "TELÉFONO (+53)"}
                                value={numero}
                                onChange={(e) => validarDato(e.target.value)}
                                className={`w-full p-4 rounded-2xl bg-slate-100 text-center font-black text-sm outline-none border-2 transition-all ${
                                    error ? 'border-red-400' : 'focus:border-blue-600 focus:bg-white border-transparent'
                                }`}
                            />
                            {error && <span className="absolute -bottom-4 left-0 right-0 text-center text-[8px] text-red-500 font-black">{error}</span>}
                        </div>

                        <button
                            disabled={!!error || !numero}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${
                                error || !numero ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-blue-700 active:scale-95'
                            }`}>
                            Confirmar Pedido 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}