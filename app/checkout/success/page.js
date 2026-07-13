import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, Package, Mail } from 'lucide-react';

export const metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
};

export default function OrderSuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: '5rem', textAlign: 'center', maxWidth: '38rem', margin: '0 auto' }}>

          {/* Success icon */}
          <div style={{
            width: '5rem', height: '5rem',
            borderRadius: '50%',
            background: 'var(--color-lumen-success-light)',
            border: '1px solid var(--color-lumen-success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
          }}>
            <CheckCircle size={36} strokeWidth={1.5} style={{ color: 'var(--color-lumen-success)' }} />
          </div>

          <h1 className="font-serif" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.1 }}>
            Order Confirmed
          </h1>

          <p style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Thank you for your purchase. Your order has been received and our team will begin processing it shortly. A confirmation email has been sent to your inbox.
          </p>

          {sessionId && (
            <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', marginBottom: '0.25rem' }}>
                Order Reference
              </p>
              <p style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-black)', wordBreak: 'break-all' }}>
                {sessionId}
              </p>
            </div>
          )}

          {/* What happens next */}
          <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
            <h2 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>What Happens Next</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  icon: Mail,
                  title: 'Confirmation Email',
                  desc: 'A receipt and order details have been sent to your email address.',
                },
                {
                  icon: Package,
                  title: 'Order Processing',
                  desc: 'Your piece is carefully prepared and custom crated by our logistics team. Estimated dispatch within 7–14 business days.',
                },
                {
                  icon: CheckCircle,
                  title: 'Insured Delivery',
                  desc: 'Your order ships fully insured. You will receive tracking information once dispatched.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '2.5rem', height: '2.5rem', flexShrink: 0,
                    border: '1px solid var(--color-lumen-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--color-lumen-gold)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
                    <p style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary">Return to Home</Link>
            <Link href="/shop" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
