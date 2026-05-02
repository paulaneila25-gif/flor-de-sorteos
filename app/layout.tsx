
import './globals.css';

export const metadata = {
  title: 'FLOR DE SORTEOS ⚜️',
  description: 'Sorteos automáticos con Mercado Pago',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
