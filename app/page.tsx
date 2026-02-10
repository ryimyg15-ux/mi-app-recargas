import RecargaCard from './components/RecargaCard';

export default function Home() {
  return (
      <main className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Nexus R&DAY <span className="text-blue-600">Servicios Inteligentes</span>
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Recargas rápidas a Cuba desde cualquier parte del mundo.
            </p>
          </header>

          {/* Llamamos a nuestro componente */}
          <RecargaCard />

          <div className="mt-12 p-4 bg-blue-100 rounded-lg text-blue-800 text-center text-sm">
            💡 Selecciona una oferta y serás redirigido para completar el pago.
          </div>
        </div>
      </main>
  );
}