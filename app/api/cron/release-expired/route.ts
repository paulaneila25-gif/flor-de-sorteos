
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function GET() {
  await supabaseAdmin
    .from('raffle_numbers')
    .update({ status: 'free', customer_name: null, customer_phone: null, preference_id: null, reserved_until: null })
    .eq('status', 'reserved')
    .lt('reserved_until', new Date().toISOString());

  return NextResponse.json({ ok: true });
}
