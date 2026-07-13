'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Lock, CreditCard } from 'lucide-react';

const STEPS = ['Cart', 'Information', 'Shipping', 'Payment'];

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <div className="section-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '3rem' }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-family-sans)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? 'var(--color-lumen-black)' : 'var(--color-lumen-muted)',
                  borderBottom: i === 0 ? '1px solid var(--color-lumen-black)' : 'none',
                  paddingBottom: '2px',
                }}>
                  {step}
                </span>
                {i < STEPS.length - 1 && (
                  <span style={{ color: 'var(--color-lumen-muted)', margin: '0 0.75rem', fontSize: '0.75rem' }}>/</span>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 ? (
            /* Empty cart */
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p className="font-serif" style={{ fontSize: '2rem', color: 'var(--color-lumen-muted)', marginBottom: '1rem' }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', marginBottom: '2rem' }}>
                Discover our curated lighting collection
              </p>
              <Link href="/shop" className="btn-primary">Browse Collection</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="lg-grid-cart">
              {/* ── Left: Product rows ── */}
              <div style={{ flex: '1 1 0%' }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--color-lumen-border)',
                  marginBottom: '1.5rem',
                }}>
                  {['Product', 'Quantity', 'Total'].map((h) => (
                    <span key={h} style={{
                      fontSize: '0.625rem',
                      fontFamily: 'var(--font-family-sans)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--color-lumen-muted)',
                    }}>{h}</span>
                  ))}
                </div>

                {/* Product rows */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        gap: '1rem',
                        alignItems: 'center',
                        paddingBottom: '1.5rem',
                        marginBottom: '1.5rem',
                        borderBottom: '1px solid var(--color-lumen-border)',
                      }}
                    >
                      {/* Product info */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '5rem', height: '5rem', background: '#f0f0f0', flexShrink: 0, overflow: 'hidden' }}>
                          {item.image && (
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-serif" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.name}</p>
                          {item.variant && (
                            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', marginBottom: '0.25rem' }}>{item.variant}</p>
                          )}
                          {item.dimensions && (
                            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', marginBottom: '0.5rem' }}>{item.dimensions}</p>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)',
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              color: 'var(--color-lumen-muted)',
                              padding: 0,
                            }}
                            className="hover:text-lumen-gold transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-lumen-border)' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ width: '2rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-lumen-muted)' }}
                          className="hover:bg-lumen-gold hover:text-white transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ width: '2rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-lumen-muted)' }}
                          className="hover:bg-lumen-gold hover:text-white transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Total */}
                      <p style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-family-sans)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Continue shopping */}
                <Link
                  href="/shop"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--color-lumen-muted)', textDecoration: 'none',
                    marginTop: '1rem',
                  }}
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* ── Right: Order Summary ── */}
              <div>
                <div className="card" style={{ padding: '2rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Order Summary</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)' }}>Subtotal</span>
                      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)' }}>
                        ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)' }}>International Shipping</span>
                      <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', fontStyle: 'italic' }}>
                        Calculated at next step
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)' }}>Estimated Tax</span>
                      <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', fontStyle: 'italic' }}>
                        Calculated at next step
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--color-lumen-border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-family-sans)', fontWeight: 500 }}>Total</span>
                      <span className="font-serif" style={{ fontSize: '1.5rem' }}>
                        ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      background: 'var(--color-lumen-error-light)',
                      border: '1px solid var(--color-lumen-error)',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-family-sans)',
                      color: 'var(--color-lumen-error)',
                    }}>
                      {error}
                    </div>
                  )}

                  {/* Checkout button */}
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Redirecting…' : 'Proceed to Checkout →'}
                  </button>

                  {/* Secure payment */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                      <Lock size={12} strokeWidth={1.5} style={{ color: 'var(--color-lumen-muted)' }} />
                      <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)' }}>
                        Secure Payment
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <CreditCard size={22} strokeWidth={1} style={{ color: 'var(--color-lumen-muted)' }} />
                      <span style={{ fontSize: '1.25rem', color: 'var(--color-lumen-muted)', letterSpacing: '-1px' }}>⊕</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', fontFamily: 'var(--font-family-sans)', fontWeight: 700 }}>G Pay</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', fontFamily: 'var(--font-family-sans)', fontWeight: 700 }}> Pay</span>
                    </div>
                    <p style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', lineHeight: 1.6, maxWidth: '18rem', margin: '0 auto' }}>
                      Transactions are encrypted and secured by Stripe. We do not store your credit card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Responsive 2-col layout for desktop */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-grid-cart {
            display: grid !important;
            grid-template-columns: 1fr 26rem !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
