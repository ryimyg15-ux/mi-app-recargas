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
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
    const [numero, setNumero] = useState('');
    const [montoOperacion, setMontoOperacion] = useState<number>(100);
    const [tasaCup, setTasaCup] = useState<number>(0);
    const [fotoGrande, setFotoGrande] = useState<string | null>(null);

    const menuCategorias = [
        { id: 'RECARGAS', icon: '📱', servicios: ['Recarga (ETECSA)', 'Recarga (NAUTA)'] },
        { id: 'TIENDA', icon: '🛒', servicios: ['Combo de Comida/Aseo', 'Electrodomésticos'] },
        { id: 'DINERO', icon: '💸', servicios: ['Envío de Dinero'] },
    ];

    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

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

    return (
        <div className="bg-[#E0E5EC] min-h-screen p-4 flex items-center justify-center font-sans text-slate-700">
            {/* Modal de Foto Grande */}
            {fotoGrande && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setFotoGrande(null)}>
                    <img src={fotoGrande} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="Preview" />
                </div>
            )}

            <div className="bg-[#F0F2F5] w-full max-w-md rounded-[3rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-hidden border border-white/50">

                {/* HEADER NEGRO */}
                <div className="bg-[#1A1A1A] p-8 text-center">
                    <h1 className="text-white font-black text-3xl tracking-tighter">NEXUS R&DAY</h1>
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Conectando Mundos</p>
                </div>

                <div className="p-6 space-y-8">

                    {/* SECCIÓN CATEGORÍAS */}
                    <div className="space-y-3">
                        <h2 className="text-[12px] font-black text-slate-400 uppercase ml-2 tracking-widest">Categorías</h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {menuCategorias.map((cat) => (
                                <button key={cat.id}
                                        onClick={() => { setCategoriaActiva(cat.id); setServicio(cat.servicios[0]); }}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-[10px] transition-all whitespace-nowrap ${
                                            categoriaActiva === cat.id
                                                ? 'bg-[#0084FF] text-white shadow-[inset_4px_4px_8px_#0066cc,4px_4px_12px_#ffffff]'
                                                : 'bg-[#F0F2F5] text-slate-400 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]'
                                        }`}>
                                    <span>{cat.icon}</span> {cat.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ÁREA AZUL DINÁMICA */}
                    <div className="bg-gradient-to-br from-[#00A2FF] to-[#0052FF] p-6 rounded-[2.5rem] shadow-xl shadow-blue-200">
                        <h3 className="text-white/70 text-[10px] font-black uppercase mb-4 text-center">Detalles de Operación</h3>

                        {categoriaActiva === 'DINERO' ? (
                            <div className="flex items-center justify-between gap-2 text-white">
                                <div className="text-center flex-1">
                                    <p className="text-[8px] font-bold mb-2 uppercase opacity-60">Envías</p>
                                    <input type="number" value={montoOperacion} onChange={e => setMontoOperacion(Number(e.target.value))}
                                           className="w-full bg-white/10 rounded-2xl p-3 text-center font-black text-xl outline-none" />
                                </div>
                                <div className="text-2xl mt-4">→</div>
                                <div className="text-center flex-1">
                                    <p className="text-[8px] font-bold mb-2 uppercase opacity-60">Reciben</p>
                                    <div className="bg-white/20 p-3 rounded-2xl font-black text-xl">
                                        {(montoOperacion * tasaCup).toLocaleString()} <span className="text-[10px]">CUP</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {ofertasFiltradas.map((o, idx) => (
                                    <button key={idx} onClick={() => setOfertaSeleccionada(o)}
                                            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                                ofertaSeleccionada === o ? 'bg-white text-blue-600 shadow-lg scale-[1.02]' : 'bg-white/10 text-white'
                                            }`}>
                                        {o.foto && <img src={o.foto} onClick={(e) => { e.stopPropagation(); setFotoGrande(o.foto!); }}
                                                        className="w-10 h-10 rounded-lg object-cover border border-white/20" />}
                                        <div className="text-left flex-1">
                                            <p className="text-[10px] font-black uppercase leading-none">{o.nombre}</p>
                                            <p className={`text-[7px] font-bold ${ofertaSeleccionada === o ? 'text-blue-400' : 'text-white/60'}`}>{o.descripcion?.substring(0, 30)}...</p>
                                        </div>
                                        <span className="font-black text-[10px]">{o.precio}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INPUTS DE CONTROL */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Método de Pago</label>
                                <select value={pago} onChange={e => setPago(e.target.value)}
                                        className="w-full bg-[#F0F2F5] p-4 rounded-2xl text-[10px] font-bold shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] outline-none">
                                    <option>Brasil (PIX)</option>
                                    <option>EE.UU (Zelle)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Destinatario</label>
                                <input type="text" value={numero} onChange={e => setNumero(e.target.value)} placeholder="Número"
                                       className="w-full bg-[#F0F2F5] p-4 rounded-2xl text-[10px] font-bold shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] outline-none placeholder:text-slate-300" />
                            </div>
                        </div>

                        {/* BOTÓN FINAL */}
                        <button className="w-full bg-[#0084FF] py-5 rounded-[2rem] text-white font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(0,132,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                            Enviar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}