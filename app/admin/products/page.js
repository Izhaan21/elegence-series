'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import { getProducts, deleteProduct } from '@/lib/firestore';

const STATUS_STYLES = {
  active:       { bg: 'var(--color-lumen-success-light)', border: 'rgba(45,122,79,0.25)', text: 'var(--color-lumen-success)', label: 'Active' },
  draft:        { bg: 'var(--color-lumen-bg)',            border: 'var(--color-lumen-border)', text: 'var(--color-lumen-muted)', label: 'Draft' },
  out_of_stock: { bg: 'var(--color-lumen-error-light)',   border: 'rgba(204,0,0,0.2)',    text: 'var(--color-lumen-error)', label: 'Out of Stock' },
};

const inputStyle = {
  width: '100%',
  background: 'var(--color-lumen-white)',
  border: '1px solid var(--color-lumen-border)',
  color: 'var(--color-lumen-black)',
  padding: '0.5625rem 0.875rem',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-family-sans)',
  borderRadius: '4px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const filtered = products.filter((p) =>
    (p.name || p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-lumen-border)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.5rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>Products</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>{loading ? 'Loading…' : `${products.length} total products`}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Plus size={14} strokeWidth={2} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '24rem' }}>
        <Search size={14} strokeWidth={1.5} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-lumen-muted)' }} />
        <input type="search" placeholder="Search by name, SKU, category…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: '2.5rem' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-lumen-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-lumen-border)'} />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 size={24} style={{ color: 'var(--color-lumen-gold)', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>Loading products from database…</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-lumen-border)', background: 'var(--color-lumen-bg)' }}>
                {['Product', 'Category', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>
                    {products.length === 0 ? (
                      <div>
                        <p style={{ marginBottom: '0.75rem' }}>No products yet.</p>
                        <Link href="/admin/products/new" style={{ color: 'var(--color-lumen-gold)', textDecoration: 'underline', fontSize: '0.875rem' }}>Add your first product →</Link>
                      </div>
                    ) : 'No products match your search.'}
                  </td>
                </tr>
              ) : filtered.map((product, i) => {
                const st = STATUS_STYLES[product.status] || STATUS_STYLES.draft;
                const name = product.name || product.title || 'Untitled';
                const price = product.price || 0;
                return (
                  <tr key={product.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-lumen-border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-lumen-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {product.images?.[0] && (
                          <img src={product.images[0]} alt={name}
                            style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover', border: '1px solid var(--color-lumen-border)', flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>{name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>{product.category || '—'}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-lumen-gold)', fontFamily: 'monospace' }}>{product.sku || '—'}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>${Number(price).toLocaleString()}</p>
                      {product.comparePrice && <p style={{ fontSize: '0.75rem', color: 'var(--color-lumen-muted)', textDecoration: 'line-through' }}>${Number(product.comparePrice).toLocaleString()}</p>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: Number(product.stock) <= 3 ? 'var(--color-lumen-error)' : 'var(--color-lumen-black)' }}>
                      {product.stock ?? '—'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', background: st.bg, border: `1px solid ${st.border}`, color: st.text, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px' }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/admin/products/${product.id}/edit`} title="Edit"
                          style={{ background: 'var(--color-lumen-bg)', border: '1px solid var(--color-lumen-border)', color: 'var(--color-lumen-muted)', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-lumen-gold)'; e.currentTarget.style.borderColor = 'var(--color-lumen-gold)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-lumen-muted)'; e.currentTarget.style.borderColor = 'var(--color-lumen-border)'; }}>
                          <Edit2 size={13} strokeWidth={1.75} />
                        </Link>
                        <button onClick={() => setDeleteConfirm(product.id)} title="Delete"
                          style={{ background: 'var(--color-lumen-bg)', border: '1px solid var(--color-lumen-border)', color: 'var(--color-lumen-muted)', cursor: 'pointer', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-lumen-error)'; e.currentTarget.style.borderColor = 'var(--color-lumen-error)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-lumen-muted)'; e.currentTarget.style.borderColor = 'var(--color-lumen-border)'; }}>
                          <Trash2 size={13} strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', padding: '2rem', maxWidth: '24rem', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'var(--font-family-sans)' }}>Delete Product?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>This action cannot be undone. The product will be permanently removed from your store.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteConfirm(null)} disabled={deleting} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--color-lumen-error-light)', border: '1px solid rgba(204,0,0,0.3)', color: 'var(--color-lumen-error)', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {deleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
