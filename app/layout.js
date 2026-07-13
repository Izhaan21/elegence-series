import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Elegence Series — Luxury Chandeliers & Pendants',
    template: '%s | Elegence Series',
  },
  description:
    'Discover meticulously curated architectural lighting designed to transform spaces into masterpieces of modern elegance. Free insured international shipping.',
  keywords: ['chandeliers', 'luxury lighting', 'pendant lights', 'architectural lighting', 'wall sconces'],
  openGraph: {
    title: 'Elegence Series',
    description: 'Illuminate your grandeur with our curated collection.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
