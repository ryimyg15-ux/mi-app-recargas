'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    categoria: string;
    precio: string;
    descripcion?: string;
}

export default function RecargaCard() {
    // 1. ESTADOS
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');
    const [montoOperacion, setMontoOperacion] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(0);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

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
                const data: Oferta[] = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                const filaTasa = data.find((o: any) =>
                    normalizar(o.nombre).includes('transferencia a cuba')
                );

                if (filaTasa) {
                    const valorLimpio = filaTasa.precio.replace('R$', '').replace(',', '.').replace(/[^0-9.]/g, '').trim();
                    const tasaNumerica = parseFloat(valorLimpio);
                    if (!isNaN(tasaNumerica)) setTasaCup(tasaNumerica);
                }
                setCargando(false);
            }
        });
    }, []);

    // 4. FILTRADO
    const ofertasFiltradas = useMemo(() => {
        const servicioNormalizado = normalizar(servicio);
        return todasLasOfertas.filter((o) => {
            const catExcel = normalizar(o.categoria);
            return catExcel === servicioNormalizado;
        });
    }, [servicio, todasLasOfertas]);

    useEffect(() => {
        setOfertaSeleccionada(ofertasFiltradas.length > 0 ? ofertasFiltradas[0] : null);
        setNumero('');
        setError('');
    }, [ofertasFiltradas]);

    // 5. VALIDACIÓN
    const validarDato = (valor: string) => {
        const soloNumeros = valor.replace(/\D/g, '');
        setNumero(soloNumeros);
        setError('');

        if (categoriaActiva === 'DINERO') {
            if (soloNumeros.length > 0 && soloNumeros.length !== 16) setError('La tarjeta debe tener 16 dígitos');
        } else if (servicio.includes('ETECSA')) {
            if (soloNumeros.length > 0 && !soloNumeros.startsWith('5')) setError('Debe empezar con 5');
            else if (soloNumeros.length > 0 && soloNumeros.length !== 8) setError('Deben ser 8 dígitos');
        }
    };

    const enviarPedido = () => {
        if (!numero || error) return alert("Verifica el número o tarjeta.");

        let detalle = categoriaActiva === 'DINERO'
            ? `💸 *OPERACIÓN DE ENVÍO*\n💰 *Envía:* ${montoOperacion} BRL\n🇨🇺 *Recibe:* ${(montoOperacion * tasaCup).toLocaleString()} CUP\n📈 *Tasa:* 1:${tasaCup}`
            : `🛒 *PRODUCTO:* ${ofertaSeleccionada?.nombre}\n💵 *Precio:* ${ofertaSeleccionada?.precio}`;

        const mensaje = `*NEXUS R&DAY*\n\n` +
            `👤 *Operación:* ${servicio}\n` +
            `💳 *Pago:* ${pago}\n` +
            `📍 *ID/Número:* ${numero}\n\n` +
            `${detalle}`;

        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 flex items-center justify-center font-sans text-slate-900">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* HEADER */}
                <div className="bg-slate-900 p-6 text-center">
                    <h1 className="text-white font-black tracking-tighter text-2xl">NEXUS R&DAY</h1>
                    <p className="text-blue-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-1">Conectando Mundos</p>
                </div>

                {/* MENÚ DE CATEGORÍAS */}
                <div className="flex justify-around bg-slate-100 p-2 m-4 rounded-2xl">
                    {menuCategorias.map((cat) => (
                        <button key={cat.id}
                                onClick={() => { setCategoriaActiva(cat.id); setServicio(cat.servicios[0]); }}
                                className={`flex flex-col items-center flex-1 py-2 rounded-xl transition-all ${
                                    categoriaActiva === cat.id ? 'bg-white shadow-md scale-105' : 'opacity-40 grayscale'
                                }`}>
                            <span className="text-xl">{cat.icon}</span>
                            <span className="text-[8px] font-black mt-1">{cat.id}</span>
                        </button>
                    ))}
                </div>

                <div className="px-6 pb-8 space-y-6">
                    {/* SUB-SERVICIOS */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Selecciona el tipo</label>
                        <div className="flex gap-2">
                            {menuCategorias.find(c => c.id === categoriaActiva)?.servicios.map(s => (
                                <button key={s} onClick={() => setServicio(s)}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold border transition-all ${
                                            servicio === s ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                        }`}>
                                    {s.split('(')[0].trim()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ÁREA DINÁMICA */}
                    <div className="min-h-[140px]">
                        {cargando ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : categoriaActiva === 'DINERO' ? (
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-3xl text-white shadow-xl">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-center flex-1">
                                        <p className="text-[7px] font-bold uppercase opacity-70 mb-1">Envías (BRL)</p>
                                        <input type="number" value={montoOperacion} onChange={e => setMontoOperacion(Number(e.target.value))}
                                               className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-center font-black text-lg outline-none" />
                                    </div>
                                    <span className="text-xl mt-4 opacity-50">➜</span>
                                    <div className="text-center flex-1">
                                        <p className="text-[7px] font-bold uppercase opacity-70 mb-1">Reciben (CUP)</p>
                                        <div className="bg-white text-blue-700 p-2 rounded-xl font-black text-lg shadow-inner">
                                            {Math.round(montoOperacion * tasaCup).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <span className="bg-green-400 text-green-900 text-[8px] font-black px-3 py-1 rounded-full animate-pulse">
                                        TASA: 1 BRL = {tasaCup} CUP ⚡
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                {ofertasFiltradas.length > 0 ? ofertasFiltradas.map((o, idx) => (
                                    <button key={idx} onClick={() => setOfertaSeleccionada(o)}
                                            className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                                                ofertaSeleccionada === o ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                                            }`}>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase">{o.nombre}</p>
                                            <p className="text-[8px] text-slate-400 font-bold leading-tight">{o.descripcion}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-blue-600 ml-2 whitespace-nowrap">{o.precio}</span>
                                    </button>
                                )) : (
                                    <p className="text-center text-[10px] text-slate-400 py-10">No hay productos disponibles.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* DATOS Y BOTÓN */}
                    <div className="space-y-4 pt-2">
                        <div className="relative">
                            <input type="text"
                                   placeholder={categoriaActiva === 'DINERO' ? "NÚMERO DE TARJETA (16 DÍGITOS)" : "TELÉFONO DE CUBA (+53)"}
                                   value={numero} onChange={(e) => validarDato(e.target.value)}
                                   className={`w-full p-4 rounded-2xl bg-slate-100 text-center font-black text-xs outline-none border-2 transition-all ${
                                       error ? 'border-red-400 text-red-600' : 'focus:border-blue-600 focus:bg-white border-transparent'
                                   }`} />
                            {error && <p className="absolute -bottom-5 left-0 right-0 text-center text-[8px] text-red-500 font-black uppercase">{error}</p>}
                        </div>

                        <button onClick={enviarPedido} disabled={!!error || !numero}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                                    error || !numero ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-700'
                                }`}>
                            {error ? 'Dato Incorrecto' : 'Confirmar Operación 🚀'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}