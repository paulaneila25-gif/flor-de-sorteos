
'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';

type Raffle = { id:string; title:string; prize:string; price:number; total_numbers:number; image_url:string|null };
type RaffleNumber = { number:number; status:string; reserved_until:string|null };

export default function Home() {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [numbers, setNumbers] = useState<RaffleNumber[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function load() {
    const { data: r } = await supabaseBrowser.from('raffles').select('*').eq('status','active').limit(1).single();
    setRaffle(r);
    if (r) {
      const { data: nums } = await supabaseBrowser.from('raffle_numbers').select('number,status,reserved_until').eq('raffle_id', r.id).order('number');
      setNumbers(nums || []);
    }
  }

  useEffect(() => { load(); }, []);

  async function reserveAndPay() {
    if (!raffle || !selected || !name || !phone) return alert('Completá nombre y WhatsApp.');
    const res = await fetch('/api/reserve', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ raffleId: raffle.id, number: selected, customerName: name, customerPhone: phone })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'No se pudo reservar.');
    window.location.href = data.init_point;
  }

  const color = (s:string) => s === 'sold' ? 'bg-red-500' : s === 'reserved' ? 'bg-yellow-400 text-black' : 'bg-green-500';

  return (
    <main className="min-h-screen bg-[#fff9ef] text-slate-950">
      <section className="bg-gradient-to-br from-[#14112a] to-[#341044] text-white px-5 py-8 rounded-b-[2rem] shadow-xl">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black">FLOR DE SORTEOS ⚜️</h1>
          <p className="text-pink-200 mt-1">Tu número, tu suerte</p>
          {raffle && (
            <div className="mt-6 rounded-3xl bg-white/10 p-5 border border-white/10">
              <p className="uppercase text-yellow-300 font-bold">Sorteo activo</p>
              <h2 className="text-3xl font-black">{raffle.prize}</h2>
              <div className="flex gap-3 mt-4">
                <span className="bg-white text-black px-4 py-2 rounded-2xl font-black">${raffle.price.toLocaleString('es-AR')}</span>
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-2xl font-black">{raffle.total_numbers} números</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-7">
        <h3 className="text-2xl font-black mb-3">Elegí tu número</h3>
        <div className="grid grid-cols-5 gap-3">
          {numbers.map(n => (
            <button key={n.number} disabled={n.status !== 'free'} onClick={() => setSelected(n.number)}
              className={`rounded-2xl h-14 font-black shadow ${selected === n.number ? 'ring-4 ring-pink-500' : ''} ${color(n.status)}`}>
              {String(n.number).padStart(2,'0')}
            </button>
          ))}
        </div>

        <div className="mt-7 rounded-3xl bg-white p-5 shadow-xl border">
          <h3 className="text-xl font-black">Tus datos</h3>
          <p className="text-sm text-slate-500 mb-4">Número elegido: <b>{selected || '-'}</b></p>
          <input className="w-full border rounded-2xl p-3 mb-3" placeholder="Nombre completo" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border rounded-2xl p-3 mb-4" placeholder="WhatsApp" value={phone} onChange={e=>setPhone(e.target.value)} />
          <button onClick={reserveAndPay} className="w-full rounded-2xl bg-blue-500 text-white font-black py-4">Reservar y pagar con Mercado Pago</button>
          <p className="text-xs text-slate-500 mt-3">La reserva dura 10 minutos. Si no se paga, el número se libera.</p>
        </div>
      </section>
    </main>
  );
}
