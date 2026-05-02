
export default function Success({ searchParams }: { searchParams: { number?: string } }) {
  return (
    <main className="min-h-screen bg-[#13091d] text-white flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-white text-black rounded-[2rem] p-8 text-center shadow-2xl">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-black">¡Pago aprobado!</h1>
        <p className="mt-3">Tu número {searchParams.number} quedó reservado en FLOR DE SORTEOS ⚜️</p>
        <a href="/" className="block mt-6 bg-pink-500 text-white py-4 rounded-2xl font-black">Volver al sorteo</a>
      </div>
    </main>
  );
}
