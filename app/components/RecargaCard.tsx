'use client';
import { useState, useEffect } from 'react';
// @ts-ignore
import Papa from 'papaparse';

export default function RecargaCard() {
    const [todasLasOfertas, setTodasLasOfertas] = useState<any[]>([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState<any[]>([]);
    const [servicio, setServicio] = useState('Recarga a Cuba (ETECSA)');
    const [pago, setPago] = useState('Brasil (PIX)');
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<any>(null);
    const [numero, setNumero] = useState('');

    useEffect(() => {
        const SHEET_ID = '1x4ClX7vmGGsfn2U7YmcS7Uq5VQm88-haaOvBDGsvvQs';
        const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;
        Papa.parse(URL, {
            download: true, header: true,
            complete: (res: any) => {
                setTodasLasOfertas(res.data);
                const iniciales = res.data.filter((o: any) => o.categoria === 'Recarga a Cuba (ETECSA)');
                setOfertasFiltradas(iniciales);
                setOfertaSeleccionada(iniciales[0]); // Selecciona solo la primera
            }
        });
    }, []);

    // RESET DE SELECCIÓN: Al cambiar servicio, se limpia y se pone solo la primera
    useEffect(() => {
        const filtradas = todasLasOfertas.filter(o => o.categoria === servicio);
        setOfertasFiltradas(filtradas);
        if (filtradas.length > 0) {
            setOfertaSeleccionada(filtradas[0]);
        } else {
            setOfertaSeleccionada(null);
        }
    }, [servicio]);

    const calcularPrecio = (precioBase: string) => {
        if (!precioBase) return "0.00";
        const numBase = parseFloat(precioBase.replace(',', '.').replace(/[^0-9.]/g, ''));
        if (isNaN(numBase)) return precioBase;
        let total = numBase;
        if (pago.includes('Europa')) total = numBase / 5.50;
        else if (pago.includes('EE.UU')) total = numBase / 5.80;

        const simbolo = pago.includes('Brasil') ? 'R$' : pago.includes('Europa') ? '€' : '$';
        return `${simbolo} ${total.toFixed(2)}`;
    };

    return (
        <div className="p-4 md:p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SERVICIOS - Estilo Cuba (Azul/Rojo) */}
                <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#CF142B] border-l-2 border-[#CF142B] pl-2">01. Servicio</label>
                    <div className="flex flex-col gap-1.5">
                        {['Recarga a Cuba (ETECSA)', 'Recarga Nauta (Internet)', 'Combo de Comida/Aseo'].map(s => (
                            <button key={s} onClick={() => setServicio(s)}
                                    className={`text-left px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all border-l-4 ${servicio === s ? 'bg-[#002A8F] text-white border-[#CF142B] shadow-md' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}>
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MONEDA - Estilo Brasil (Verde/Amarillo) */}
                <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#009739] border-l-2 border-[#FEDD00] pl-2">02. Pago</label>
                    <div className="grid grid-cols-1 gap-1.5">
                        {['Brasil (PIX)', 'EE.UU (Zelle)', 'Europa (Euros)'].map(m => (
                            <button key={m} onClick={() => setPago(m)}
                                    className={`text-left px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all ${pago === m ? 'bg-slate-900 text-white ring-2 ring-[#FEDD00]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* OFERTAS - Lista Compacta */}
                <div className="md:col-span-2 space-y-3 pt-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">03. Seleccione la oferta</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                        {ofertasFiltradas.map((o, i) => (
                            <div key={i} onClick={() => setOfertaSeleccionada(o)}
                                 className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${ofertaSeleccionada?.nombre === o.nombre ? 'border-[#002A8F] bg-blue-50' : 'border-slate-50 bg-white hover:border-slate-200'}`}>
                                <span className="text-[10px] font-black text-slate-700 uppercase">{o.nombre}</span>
                                <span className="text-[12px] font-black text-[#002A8F]">{calcularPrecio(o.precio)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NÚMERO */}
                <div className="md:col-span-2 pt-2">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">CU +53</span>
                        <input type="number" placeholder="NÚMERO DE TELÉFONO" value={numero} onChange={e => setNumero(e.target.value)}
                               className="w-full bg-slate-100 p-3 pl-16 rounded-xl font-black text-sm focus:bg-white focus:ring-2 focus:ring-[#002A8F] outline-none transition-all"/>
                    </div>
                </div>
            </div>

            <button onClick={() => window.open(`https://wa.me/5547999222521?text=NexusRday`, '_blank')}
                    className="w-full mt-6 bg-[#002A8F] hover:bg-[#CF142B] text-white font-black py-3.5 rounded-xl text-[11px] uppercase tracking-[0.3em] shadow-lg transition-all active:scale-95">
                Confirmar Operación
            </button>
        </div>
    );
}