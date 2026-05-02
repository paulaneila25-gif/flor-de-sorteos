
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const paymentId = body?.data?.id || body?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
  const payment = new Payment(client);
  const info = await payment.get({ id: paymentId });

  if (info.status === 'approved') {
    const raffleId = info.metadata?.raffle_id;
    const number = Number(info.metadata?.number);

    if (raffleId && number) {
      await supabaseAdmin.from('raffle_numbers').update({
        status: 'sold',
        payment_id: String(paymentId),
        reserved_until: null
      }).eq('raffle_id', raffleId).eq('number', number);
    }
  }

  return NextResponse.json({ ok: true });
}
