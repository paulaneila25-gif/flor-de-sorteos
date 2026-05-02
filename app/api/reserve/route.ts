
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: Request) {
  const { raffleId, number, customerName, customerPhone } = await req.json();
  if (!raffleId || !number || !customerName || !customerPhone) {
    return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
  }

  const { data: raffle } = await supabaseAdmin.from('raffles').select('*').eq('id', raffleId).single();
  if (!raffle) return NextResponse.json({ error: 'Sorteo no encontrado.' }, { status: 404 });

  const { data: current } = await supabaseAdmin.from('raffle_numbers').select('*').eq('raffle_id', raffleId).eq('number', number).single();
  if (!current || current.status !== 'free') {
    return NextResponse.json({ error: 'Ese número ya no está disponible.' }, { status: 409 });
  }

  const reservedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabaseAdmin.from('raffle_numbers').update({
    status: 'reserved',
    customer_name: customerName,
    customer_phone: customerPhone,
    reserved_until: reservedUntil
  }).eq('raffle_id', raffleId).eq('number', number);

  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
  const preference = new Preference(client);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const pref = await preference.create({
    body: {
      items: [{
        id: `${raffleId}-${number}`,
        title: `FLOR DE SORTEOS - ${raffle.prize} - Número ${number}`,
        quantity: 1,
        unit_price: raffle.price,
        currency_id: 'ARS'
      }],
      metadata: { raffle_id: raffleId, number, customer_name: customerName, customer_phone: customerPhone },
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      back_urls: {
        success: `${siteUrl}/success?number=${number}`,
        failure: `${siteUrl}/`,
        pending: `${siteUrl}/`
      },
      auto_return: 'approved'
    }
  });

  await supabaseAdmin.from('raffle_numbers').update({ preference_id: pref.id }).eq('raffle_id', raffleId).eq('number', number);

  return NextResponse.json({ init_point: pref.init_point });
}
