'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Package, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getOrders, getProducts } from '@/lib/firestore';

function StatCard({ label, value, icon: Icon }) {
  return (
    <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-lumen-muted)' }}>
          {label}
        </p>
        <div style={{ width: '2.25rem', height: '2.25rem', border: '1px solid var(--color-lumen-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={14} strokeWidth={1.5} style={{ color: 'var(--color-lumen-gold)' }} />
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-family-sans)', fontSize: '2.25rem', color: 'var(--color-lumen-black)', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:    { bg: '#fffbeb', border: 'rgba(201,169,110,0.4)', text: 'var(--color-lumen-gold)' },
    processing: { bg: '#e3f2fd', border: '#1565c0', text: '#1565c0' },
    shipped:    { bg: '#ede7f6', border: '#512da8', text: '#512da8' },
    delivered:  { bg: '#e8f5e9', border: '#2d7a4f', text: '#2d7a4f' },
    paid:       { bg: '#e8f5e9', border: '#2d7a4f', text: '#2d7a4f' },
    cancelled:  { bg: '#ffebee', border: '#c62828', text: '#c62828' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ fontSize: '0.6875rem', padding: '0.25rem 0.6rem', background: s.bg, border: `1px solid ${s.border}`, color: s.text, borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashStats, orders, products] = await Promise.all([
          getDashboardStats(),
          getOrders(),
          getProducts(),
        ]);
        setStats(dashStats);
        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(products.filter((p) => Number(p.stock || 0) < 5).slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const avgOrderValue = stats?.totalOrders > 0 ? Math.round(stats.totalSales / stats.totalOrders) : 0;

  const STAT_CARDS = [
    { label: 'Total Revenue',    value: stats ? `$${stats.totalSales.toLocaleString()}` : '—', icon: DollarSign },
    { label: 'Total Orders',     value: stats ? String(stats.totalOrders) : '—',               icon: ShoppingBag },
    { label: 'New Orders',       value: stats ? String(stats.newOrders) : '—',                 icon: Package },
    { label: 'Avg. Order Value', value: stats ? `$${avgOrderValue.toLocaleString()}` : '—',    icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--color-lumen-gold)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>Loading dashboard…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-lumen-border)' }}>
        <h1 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.5rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>
          Welcome back. Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="admin-dash-grid">
        {/* Recent Orders */}
        <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-lumen-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1rem', color: 'var(--color-lumen-black)', fontWeight: 600 }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--color-lumen-gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={12} strokeWidth={2} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-lumen-border)', background: 'var(--color-lumen-bg)' }}>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-lumen-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>
                      No orders yet. Orders will appear here after customers complete checkout.
                    </td>
                  </tr>
                ) : recentOrders.map((order, i) => (
                  <tr key={order.id}
                    style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid var(--color-lumen-border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-lumen-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-lumen-gold)', fontFamily: 'monospace' }}>{order.id?.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-lumen-black)' }}>{order.customerName || order.customer || '—'}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-lumen-muted)', textAlign: 'center' }}>{order.items?.length || '—'}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>
                      ${(order.totalAmount || order.amount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <StatusBadge status={order.orderStatus || order.status || 'pending'} />
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', color: 'var(--color-lumen-muted)', whiteSpace: 'nowrap' }}>
                      {order.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-lumen-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1rem', color: 'var(--color-lumen-black)', fontWeight: 600 }}>Low Stock Alerts</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {lowStockProducts.length === 0 ? (
              <li style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>
                No low stock alerts. All products are well stocked.
              </li>
            ) : lowStockProducts.map((item, i) => (
              <li key={item.id} style={{
                padding: '1rem 1.5rem',
                borderBottom: i < lowStockProducts.length - 1 ? '1px solid var(--color-lumen-border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', marginBottom: '0.2rem' }}>{item.name || item.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-lumen-muted)' }}>{item.sku || '—'}</p>
                </div>
                <span style={{
                  fontSize: '0.8125rem', padding: '0.25rem 0.875rem',
                  background: Number(item.stock) <= 3 ? 'var(--color-lumen-error-light)' : '#fffbeb',
                  border: `1px solid ${Number(item.stock) <= 3 ? 'rgba(204,0,0,0.25)' : 'rgba(201,169,110,0.4)'}`,
                  color: Number(item.stock) <= 3 ? 'var(--color-lumen-error)' : 'var(--color-lumen-gold)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap',
                }}>
                  {item.stock} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) {
          .admin-dash-grid { grid-template-columns: 1fr 22rem !important; }
        }
      `}</style>
    </div>
  );
}
