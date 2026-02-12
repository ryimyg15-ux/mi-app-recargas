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
    // 1. ESTADOS
    const [todasLasOfertas, setTodasLasOfertas] = useState<Oferta[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState('RECARGAS');
    const [servicio, setServicio] = useState('Recarga (ETECSA)');
    const [tasasDinamicas, setTasasDinamicas] = useState({ r1: 92, r2: 96, r3: 97, r4: 98 });
    const [monto, setMonto] = useState<number>(100);
    const [numero, setNumero] = useState('');
    const [cargando, setCargando] = useState(true);
    const [fotoGrande, setFotoGrande] = useState<string | null>(null);

    const menuCategorias = [
        { id: 'RECARGAS', icon: '📱', servicios: ['Recarga (ETECSA)', 'Recarga (NAUTA)'] },
        { id: 'TIENDA', icon: '🛒', servicios: ['Combo de Comida/Aseo', 'Electrodomésticos'] },
        { id: 'DINERO', icon: '💸', servicios: ['Envío de Dinero'] },
    ];

    const normalizar = (texto: string) =>
        texto ? texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // 2. CARGA DE DATOS DESDE TU EXCEL
    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (res: any) => {
                const data = res.data.filter((o: any) => o.nombre);
                setTodasLasOfertas(data);

                // Extraer tasas del rango DINERO de tu Excel
                const buscarTasa = (nombre: string, defecto: number) => {
                    const fila = data.find((f: any) => normalizar(f.nombre) === normalizar(nombre));
                    if (fila) return parseFloat(fila.precio.replace(/[^0-9.]/g, '')) || defecto;
                    return defecto;
                };

                setTasasDinamicas({
                    r1: buscarTasa('Tasa Rango 1', 92),
                    r2: buscarTasa('Tasa Rango 2', 96),
                    r3: buscarTasa('Tasa Rango 3', 97),
                    r4: buscarTasa('Tasa Rango 4', 98)
                });
                setCargando(false);
            }
        });
    }, []);

    // 3. LÓGICA DE FILTRADO Y CÁLCULO
    const ofertasFiltradas = useMemo(() => {
        return todasLasOfertas.filter(o => normalizar(o.categoria) === normalizar(servicio));
    }, [servicio, todasLasOfertas]);

    const tasaActual = monto >= 1000 ? tasasDinamicas.r4 :
        monto >= 500  ? tasasDinamicas.r3 :
            monto >= 100  ? tasasDinamicas.r2 : tasasDinamicas.r1;

    const enviarWhatsapp = (agente: string) => {
        const telf = agente === 'Jonathan' ? '5547999222521' : '5547988884444';
        let detalle = categoriaActiva === 'DINERO'
            ? `💸 OPERACIÓN DE ENVÍO\n💰 Envía: ${monto} BRL\n🇨🇺 Recibe: ${monto * tasaActual} CUP`
            : `🛒 PRODUCTO: ${servicio}\n📍 Número/ID: ${numero}`;

        const mensaje = `*NEXUS R&DAY*\n\n${detalle}\n💳 Tasa: 1:${tasaActual}`;
        window.open(`https://wa.me/${telf}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="bg-[#F1F5F9] min-h-screen p-4 flex items-center justify-center font-sans text-slate-800">

            {/* Modal de Imagen */}
            {fotoGrande && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setFotoGrande(null)}>
                    <img src={fotoGrande} className="max-w-full max-h-full rounded-2xl shadow-2xl" />
                </div>
            )}

            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">

                {/* HEADER */}
                <div className="bg-slate-900 p-8 text-center">
                    <h1 className="text-white font-black text-2xl tracking-tighter">NEXUS R&DAY</h1>
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Brasil ⟷ Cuba</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* CATEGORÍAS */}
                    <div className="flex justify-around bg-slate-100 p-2 rounded-2xl">
                        {menuCategorias.map((cat) => (
                            <button key={cat.id} onClick={() => { setCategoriaActiva(cat.id); setServicio(cat.servicios[0]); }}
                                    className={`flex flex-col items-center flex-1 py-2 rounded-xl transition-all ${categoriaActiva === cat.id ? 'bg-white shadow-md scale-105' : 'opacity-40 grayscale'}`}>
                                <span className="text-xl">{cat.icon}</span>
                                <span className="text-[8px] font-black mt-1">{cat.id}</span>
                            </button>
                        ))}
                    </div>

                    {/* SELECTOR DE SUB-SERVICIO */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {menuCategorias.find(c => c.id === categoriaActiva)?.servicios.map(s => (
                            <button key={s} onClick={() => setServicio(s)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${servicio === s ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* ÁREA CENTRAL DINÁMICA */}
                    <div className="min-h-[200px]">
                        {categoriaActiva === 'DINERO' ? (
                            <div className="space-y-4">
                                {/* TABLERO DE TASAS */}
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        {r: '10+', v: tasasDinamicas.r1},
                                        {r: '100+', v: tasasDinamicas.r2},
                                        {r: '500+', v: tasasDinamicas.r3},
                                        {r: '1000+', v: tasasDinamicas.r4},
                                    ].map((t, i) => (
                                        <div key={i} className={`p-2 rounded-xl border text-center ${tasaActual === t.v ? 'border-blue-500 bg-blue-50' : 'border-slate-100 opacity-40'}`}>
                                            <p className="text-[7px] font-black">{t.r}</p>
                                            <p className="text-xs font-black text-blue-700">{t.v}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* CALCULADORA */}
                                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2rem] text-white shadow-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex-1">
                                            <p className="text-[8px] font-bold opacity-70 uppercase mb-1">Envías (BRL)</p>
                                            <input type="number" value={monto} onChange={e => setMonto(Number(e.target.value))}
                                                   className="w-full bg-white/10 border-none rounded-xl p-2 text-xl font-black outline-none" />
                                        </div>
                                        <div className="px-4 text-xl">→</div>
                                        <div className="flex-1 text-right">
                                            <p className="text-[8px] font-bold opacity-70 uppercase mb-1">Reciben (CUP)</p>
                                            <p className="text-xl font-black">{(monto * tasaActual).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-center border-t border-white/10 pt-3">
                                        <span className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">Tasa aplicada: 1:{tasaActual}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ofertasFiltradas.map((o, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all group">
                                        {o.foto ? (
                                            <img src={o.foto} onClick={() => setFotoGrande(o.foto!)} className="w-12 h-12 rounded-xl object-cover cursor-pointer hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-lg">📦</div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase text-slate-700">{o.nombre}</p>
                                            <p className="text-[8px] text-slate-400 font-bold leading-tight">{o.descripcion}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-blue-600">{o.precio}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INPUTS DE DESTINO */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <input type="text" placeholder="Número de teléfono o tarjeta" value={numero} onChange={e => setNumero(e.target.value)}
                               className="w-full bg-slate-100 p-4 rounded-2xl text-xs font-black text-center outline-none focus:bg-white focus:ring-2 ring-blue-500/20 transition-all" />

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => enviarWhatsapp('Jonathan')} className="bg-[#25D366] text-white p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:brightness-90 transition-all">WhatsApp Jonathan</button>
                            <button onClick={() => enviarWhatsapp('David')} className="bg-slate-900 text-white p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:brightness-90 transition-all">WhatsApp David</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}