import RecargaCard from './components/RecargaCard';

export default function Home() {
  return (
      <main className="min-h-screen bg-white">
        {/* Hero Section con Gradiente */}
        <header className="bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 py-20 px-4 shadow-2xl rounded-b-[50px]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-medium mb-4">
              🚀 Recargas Instantáneas a Cuba
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight mb-4">
              NESUS <span className="text-yellow-400">R&</span> DAY
            </h1>
            <p className="text-blue-100 text-xl font-light max-w-xl mx-auto">
              La forma más rápida y segura de enviar saldo a los tuyos.
              Sin registros complicados.
            </p>
          </div>
        </header>

        {/* Sección de Tarjetas */}
        <section className="max-w-6xl mx-auto px-4 -mt-10 mb-20">
          <RecargaCard />
        </section>

        {/* Footer / Info adicional */}
        <footer className="bg-slate-50 border-t py-12 text-center text-slate-400 text-sm">
          <p>© 2026 Tu Negocio Name - Todos los derechos reservados</p>
          <p className="mt-2 font-medium text-slate-600">Soporte 24/7 vía WhatsApp</p>
        </footer>
      </main>
  );
}