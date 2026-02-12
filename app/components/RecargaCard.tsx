'use client';
import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Oferta {
    nombre: string;
    categoria: string;
    precio: string;
    descripcion?: string;
    foto?: string;
}

export default function NexusApp() {
    // --- ESTADOS ---
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');
    const [montoOperacion, setMontoOperacion] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(0);
    const [fotoGrande, setFotoGrande] = useState<string | null>(null);
    const [error, setError] = useState('');

    const menuCategorias = [
        { id: 'RECARGAS', icon: '📱', servicios: ['Recarga (ETECSA)', 'Recarga (NAUTA)'] },
        { id: 'TIENDA', icon: '🛒', servicios: ['Combo de Comida/Aseo', 'Electrodomésticos'] },
        { id: 'DINERO', icon: '💸', servicios: ['Envío de Dinero'] },
    ];

    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);
                const filaTasa = data.find((o: any) => normalizar(o.nombre).includes('transferencia a cuba'));
                if (filaTasa) {
                    const valor = parseFloat(filaTasa.precio.replace('R$', '').replace(',', '.').replace(/[^0-9.]/g, ''));
                    if (!isNaN(valor)) setTasaCup(valor);
                }
            }
        });
    }, []);

    const ofertasFiltradas = useMemo(() => {
        return todasLasOfertas.filter(o => normalizar(o.categoria) === normalizar(servicio));
    }, [servicio, todasLasOfertas]);

    useEffect(() => {
        setOfertaSeleccionada(ofertasFiltradas[0] || null);
    }, [ofertasFiltradas]);

    // --- LÓGICA DE ENVÍO ---
    const enviarPedido = () => {
        if (!numero || error) return alert("Por favor, revisa los datos.");

        let detalle = categoriaActiva === 'DINERO'
            ? `💸 *OPERACIÓN DE ENVÍO*\n💰 *Envía:* ${montoOperacion} BRL\n🇨🇺 *Recibe:* ${(montoOperacion * tasaCup).toLocaleString()} CUP\n📈 *Tasa:* 1:${tasaCup}`
            : `🛒 *PRODUCTO:* ${ofertaSeleccionada?.nombre}\n💵 *Precio:* ${ofertaSeleccionada?.precio}`;

        const mensaje = `*NEXUS R&DAY*\n\n` +
            `👤 *Servicio:* ${servicio}\n` +
            `💳 *Pago:* ${pago}\n` +
            `📍 *ID/Número:* ${numero}\n\n` +
            `${detalle}`;

        window.open(`https://wa.me/5547999222521?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-[#E0E5EC] min-h-screen p-4 flex items-center justify-center font-sans text-slate-700">

            {/* Modal de Imagen Ampliada */}
            {fotoGrande && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setFotoGrande(null)}>
                    <img src={fotoGrande} className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border-4 border-white/10" alt="Vista previa" />
                    <p className="absolute bottom-10 text-white font-bold tracking-widest uppercase text-xs">Toca para cerrar</p>
                </div>
            )}

            <div className="bg-[#F0F2F5] w-full max-w-md rounded-[3.5rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-hidden border border-white/50">

                {/* HEADER PREMIUM */}
                <div className="bg-[#121212] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent"></div>
                    <h1 className="text-white font-black text-3xl tracking-tighter relative z-10">NEXUS R&DAY</h1>
                    <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.4em] mt-2 relative z-10">Conectando Mundos</p>
                </div>

                <div className="p-8 space-y-10">

                    {/* CATEGORÍAS NEUMÓRFICAS */}
                    <div className="space-y-4">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Categorías</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                            {menuCategorias.map((cat) => (
                                <button key={cat.id}
                                        onClick={() => { setCategoriaActiva(cat.id); setServicio(cat.servicios[0]); }}
                                        className={`flex flex-col items-center justify-center min-w-[85px] aspect-square rounded-[2rem] transition-all ${
                                            categoriaActiva === cat.id
                                                ? 'bg-[#0084FF] text-white shadow-[inset_4px_4px_8px_#0066cc,4px_4px_12px_#ffffff]'
                                                : 'bg-[#F0F2F5] text-slate-400 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]'
                                        }`}>
                                    <span className="text-2xl mb-1">{cat.icon}</span>
                                    <span className="text-[8px] font-black uppercase">{cat.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN DINÁMICA (AZUL) */}
                    <div className="bg-gradient-to-br from-[#00A2FF] to-[#0052FF] p-7 rounded-[3rem] shadow-[0_20px_40px_rgba(0,132,255,0.25)] relative">
                        <div className="absolute top-4 right-8 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>

                        {categoriaActiva === 'DINERO' ? (
                            <div className="flex items-center justify-between gap-4 text-white py-2">
                                <div className="text-center flex-1">
                                    <p className="text-[8px] font-black mb-3 opacity-60 uppercase tracking-widest">Envías (BRL)</p>
                                    <input type="number" value={montoOperacion} onChange={e => setMontoOperacion(Number(e.target.value))}
                                           className="w-full bg-white/20 rounded-2xl p-4 text-center font-black text-2xl outline-none border border-white/20 focus:bg-white/30 transition-all" />
                                </div>
                                <div className="text-3xl mt-6 opacity-40">→</div>
                                <div className="text-center flex-1">
                                    <p className="text-[8px] font-black mb-3 opacity-60 uppercase tracking-widest">Reciben (CUP)</p>
                                    <div className="bg-white/10 border border-white/20 p-4 rounded-2xl font-black text-2xl shadow-inner">
                                        {(montoOperacion * tasaCup).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar py-1">
                                {ofertasFiltradas.map((o, idx) => (
                                    <button key={idx} onClick={() => setOfertaSeleccionada(o)}
                                            className={`flex items-center gap-4 w-full p-4 rounded-[2rem] transition-all border ${
                                                ofertaSeleccionada === o
                                                    ? 'bg-white text-blue-600 border-white shadow-xl scale-[1.03]'
                                                    : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                                            }`}>
                                        {o.foto && (
                                            <img src={o.foto}
                                                 onClick={(e) => { e.stopPropagation(); setFotoGrande(o.foto!); }}
                                                 className="w-12 h-12 rounded-2xl object-cover shadow-md cursor-zoom-in"
                                            />
                                        )}
                                        <div className="text-left flex-1 overflow-hidden">
                                            <p className="text-[10px] font-black uppercase truncate">{o.nombre}</p>
                                            <p className={`text-[7px] font-bold mt-0.5 truncate ${ofertaSeleccionada === o ? 'text-blue-400' : 'text-white/50'}`}>
                                                {o.descripcion || 'Ver detalles...'}
                                            </p>
                                        </div>
                                        <span className="font-black text-[11px] whitespace-nowrap">{o.precio}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SELECTORES Y DATOS */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Pago</label>
                                <select value={pago} onChange={e => setPago(e.target.value)}
                                        className="w-full bg-[#F0F2F5] p-5 rounded-[1.8rem] text-[10px] font-black shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] outline-none appearance-none text-center">
                                    <option>Brasil (PIX)</option>
                                    <option>EE.UU (Zelle)</option>
                                    <option>Europa (Euros)</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Número/ID</label>
                                <input type="text" value={numero} onChange={e => setNumero(e.target.value.replace(/\D/g, ''))}
                                       placeholder="8 dígitos"
                                       className="w-full bg-[#F0F2F5] p-5 rounded-[1.8rem] text-[10px] font-black shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] outline-none text-center placeholder:opacity-30" />
                            </div>
                        </div>

                        {/* BOTÓN FINAL ACCIÓN */}
                        <button onClick={enviarPedido}
                                className="w-full bg-[#0084FF] py-6 rounded-[2.5rem] text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(0,132,255,0.35)] hover:bg-[#0070da] active:scale-95 transition-all mt-4">
                            Confirmar Pedido 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}