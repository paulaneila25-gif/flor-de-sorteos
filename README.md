# FLOR DE SORTEOS ⚜️

Web app automática para sorteos:
- Cliente elige número.
- Se reserva 10 minutos.
- Paga con Mercado Pago Checkout Pro.
- Webhook confirma pago y marca número como vendido.
- Si no paga, la reserva vence y el número vuelve a estar libre.

## Pasos
1. Crear proyecto en Supabase.
2. Ejecutar el SQL de `supabase/schema.sql`.
3. Copiar `.env.example` a `.env.local` y completar claves.
4. Instalar dependencias: `npm install`
5. Ejecutar: `npm run dev`
6. Publicar en Vercel.
7. En Mercado Pago, configurar webhook a:
   `https://TU-DOMINIO/api/mercadopago/webhook`

## Primer sorteo cargado por defecto
Escurridor premium, 35 números, $3000.
