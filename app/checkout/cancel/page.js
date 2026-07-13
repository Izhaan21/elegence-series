import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export const metadata = {
  title: 'Payment Cancelled',
  description: 'Your payment was cancelled. Your cart is still saved.',
};

export default function CheckoutCancelPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: '5rem', textAlign: 'center', maxWidth: '32rem', margin: '0 auto' }}>

          {/* Cancel icon */}
          <div style={{
            width: '5rem', height: '5rem',
            borderRadius: '50%',
            background: '#fff5f5',
            border: '1px solid #e0b0b0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
          }}>
            <XCircle size={36} strokeWidth={1.5} style={{ color: 'var(--color-lumen-error)' }} />
          </div>

          <h1 className="font-serif" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.1 }}>
            Payment Cancelled
          </h1>

          <p style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Your payment was not completed. No charges have been made. Your cart items are still saved — you can return and try again at any time.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cart" className="btn-primary">Return to Cart</Link>
            <Link href="/shop" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
