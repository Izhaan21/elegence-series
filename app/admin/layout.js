'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (pathname === '/admin/login') { setAuthed(true); return; }
      if (user) {
        setAuthed(true);
        setUserEmail(user.email || '');
      } else {
        router.replace('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return null;


  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-lumen-bg)',
      fontFamily: 'var(--font-family-sans)',
    }}>
      {/* ── Sidebar ── */}
      <aside
        className="admin-sidebar"
        style={{
          width: '15rem',
          background: 'var(--color-lumen-white)',
          borderRight: '1px solid var(--color-lumen-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Brand */}
        <div style={{
          padding: '1.5rem 1.5rem 1.25rem',
          borderBottom: '1px solid var(--color-lumen-border)',
        }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <p style={{
              fontFamily: 'var(--font-family-sans)',
              fontSize: '1.375rem',
              color: 'var(--color-lumen-black)',
              letterSpacing: '0.03em',
            }}>
              Elegence Series
            </p>
          </Link>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--color-lumen-gold)',
            marginTop: '0.25rem',
          }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 1rem', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1rem',
                      textDecoration: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: active ? 500 : 400,
                      color: active ? 'var(--color-lumen-black)' : 'var(--color-lumen-muted)',
                      background: active ? 'var(--color-lumen-bg)' : 'transparent',
                      borderLeft: active ? '2px solid var(--color-lumen-gold)' : '2px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = 'var(--color-lumen-gold)';
                        e.currentTarget.style.background = 'var(--color-lumen-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = 'var(--color-lumen-muted)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.75}
                      style={{ color: active ? 'var(--color-lumen-gold)' : 'inherit', flexShrink: 0 }}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem 1rem', borderTop: '1px solid var(--color-lumen-border)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.5rem 1rem', textDecoration: 'none',
              fontSize: '0.9375rem', color: 'var(--color-lumen-muted)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lumen-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lumen-muted)'}
          >
            <ExternalLink size={14} strokeWidth={1.75} />
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.5rem 1rem', background: 'none',
              border: 'none', cursor: 'pointer', width: '100%',
              fontSize: '0.9375rem', color: 'var(--color-lumen-muted)',
              textAlign: 'left', transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lumen-error)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lumen-muted)'}
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.4)', zIndex: 40 }}
          className="admin-overlay"
        />
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main">
        {/* Top bar */}
        <header style={{
          height: '56px',
          background: 'var(--color-lumen-white)',
          borderBottom: '1px solid var(--color-lumen-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.75rem',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-hamburger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-lumen-muted)', padding: '0.25rem' }}
          >
            {sidebarOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <span style={{ fontSize: '0.9375rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)' }}>
              Admin
            </span>
            <ChevronRight size={12} strokeWidth={1.5} style={{ color: 'var(--color-lumen-border-dark)' }} />
            <span style={{ fontSize: '0.9375rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-lumen-black)', fontWeight: 500 }}>
              {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || ''}
            </span>
          </div>

          {/* Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 1rem',
            border: '1px solid var(--color-lumen-border)',
            background: 'var(--color-lumen-bg)',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-lumen-gold)' }} />
            <span style={{ fontSize: '0.9375rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)' }}>
              Administrator
            </span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem 1.75rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-overlay { display: none !important; }
          .admin-main { margin-left: 15rem; }
          .admin-hamburger { display: none !important; }
        }
      `}</style>
    </div>
  );
}
