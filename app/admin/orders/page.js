'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { getOrders, updateOrderStatus as updateOrderStatusDB } from '@/lib/firestore';

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:    { bg: '#fff8e1', border: '#f9a825', text: '#f57f17' },
  processing: { bg: '#e3f2fd', border: '#1565c0', text: '#1565c0' },
  shipped:    { bg: '#ede7f6', border: '#512da8', text: '#512da8' },
  delivered:  { bg: '#e8f5e9', border: '#2d7a4f', text: '#2d7a4f' },
  cancelled:  { bg: '#ffebee', border: '#c62828', text: '#c62828' },
  paid:       { bg: '#e8f5e9', border: '#2d7a4f', text: '#2d7a4f' },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#f5f5f5', border: '#ddd', text: '#555' };
  return (
    <span style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', background: c.bg, border: `1px solid ${c.border}`, color: c.text, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

function StatusMenu({ orderId, current, onChange }) {
  const [open, setOpen] = useState(false);
  const updateable = STATUS_OPTIONS.filter((s) => s !== 'all' && s !== current);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => setOpen(!open)}>
        <StatusBadge status={current} />
        <ChevronDown size={10} style={{ color: 'var(--color-lumen-muted)', flexShrink: 0 }} />
      </div>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', minWidth: '140px', boxShadow: '0 8px 24px rgba(26,26,26,0.1)', marginTop: '4px' }}>
            {updateable.map((s) => (
              <button key={s} onClick={() => { onChange(orderId, s); setOpen(false); }}
                style={{ width: '100%', padding: '0.5rem 0.875rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-lumen-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(orders.map((o) => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    try {
      await updateOrderStatusDB(orderId, { orderStatus: newStatus });
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const filtered = orders.filter((o) => {
    const status = o.orderStatus || o.status || 'pending';
    const matchStatus = statusFilter === 'all' || status === statusFilter;
    const matchSearch = (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName || o.customer || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customerEmail || o.email || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = filtered.reduce((sum, o) => {
    const status = o.orderStatus || o.status || '';
    return status !== 'cancelled' ? sum + (o.totalAmount || o.amount || 0) : sum;
  }, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-lumen-border)' }}>
        <h1 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.5rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>Orders</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>
          {loading ? 'Loading…' : `${filtered.length} orders · $${totalRevenue.toLocaleString()} revenue`}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '24rem' }}>
          <Search size={14} strokeWidth={1.5} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-lumen-muted)' }} />
          <input type="search" placeholder="Search order ID, customer…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', color: 'var(--color-lumen-black)', padding: '0.5625rem 1rem 0.5625rem 2.25rem', fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', outline: 'none', borderRadius: '4px' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-lumen-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-lumen-border)'} />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '0.375rem 0.875rem', background: statusFilter === s ? 'var(--color-lumen-black)' : 'var(--color-lumen-white)', border: `1px solid ${statusFilter === s ? 'var(--color-lumen-black)' : 'var(--color-lumen-border)'}`, color: statusFilter === s ? '#fff' : 'var(--color-lumen-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-family-sans)', letterSpacing: '0.08em', textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s', borderRadius: '4px' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 size={24} style={{ color: 'var(--color-lumen-gold)', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>Loading orders from database…</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-lumen-border)', background: 'var(--color-lumen-bg)' }}>
                {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Payment'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>
                    {orders.length === 0 ? 'No orders yet. Orders will appear here after customers complete checkout.' : 'No orders match your search.'}
                  </td>
                </tr>
              ) : filtered.map((order, i) => {
                const status = order.orderStatus || order.status || 'pending';
                const name = order.customerName || order.customer || 'Unknown';
                const email = order.customerEmail || order.email || '';
                const amount = order.totalAmount || order.amount || 0;
                const itemCount = order.items?.length || order.itemCount || '—';
                const date = order.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '—';

                return (
                  <tr key={order.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-lumen-border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-lumen-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-lumen-gold)', fontFamily: 'monospace' }}>{order.id?.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', marginBottom: '0.125rem' }}>{name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-lumen-muted)' }}>{email}</p>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-lumen-muted)', textAlign: 'center' }}>{itemCount}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9375rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>${Number(amount).toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem' }} onClick={(e) => e.stopPropagation()}>
                      <StatusMenu orderId={order.id} current={status} onChange={handleStatusChange} />
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', color: 'var(--color-lumen-muted)', whiteSpace: 'nowrap' }}>{date}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <StatusBadge status={order.paymentStatus || 'pending'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {!loading && orders.length > 0 && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--color-lumen-muted)', textAlign: 'right' }}>
          Click the status badge on any row to update it
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
