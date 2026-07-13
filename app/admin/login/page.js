'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--color-lumen-bg)',
    border: '1px solid var(--color-lumen-border)',
    color: 'var(--color-lumen-black)',
    padding: '0.75rem 1rem',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-family-sans)',
    outline: 'none',
    transition: 'border-color 0.2s',
    borderRadius: '4px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-lumen-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '24rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-lumen-gold)', marginBottom: '0.5rem' }}>
            Admin Portal
          </p>
          <h1 style={{ fontFamily: 'var(--font-family-serif)', fontSize: '2rem', color: 'var(--color-lumen-black)', fontWeight: 400 }}>
            Elegence Series
          </h1>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-lumen-black)', marginBottom: '1.5rem', fontFamily: 'var(--font-family-sans)' }}>
            Sign in to continue
          </h2>

          {error && (
            <div style={{ background: 'var(--color-lumen-error-light)', border: '1px solid rgba(204,0,0,0.2)', color: 'var(--color-lumen-error)', padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1.25rem', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-lumen-black)', marginBottom: '0.375rem' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elegenceseries.com"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-lumen-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-lumen-border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-lumen-black)', marginBottom: '0.375rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-lumen-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-lumen-border)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-lumen-muted)', marginTop: '1.5rem' }}>
          Elegence Series Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
