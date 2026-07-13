'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Upload, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { addProduct } from '@/lib/firestore';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error('Cloudinary upload failed');
  return data.secure_url;
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Shared styles ─────────────────────────────────────────────
const input = {
  width: '100%',
  background: 'var(--color-lumen-bg)',
  border: '1px solid var(--color-lumen-border)',
  color: 'var(--color-lumen-black)',
  padding: '1rem 1rem',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-family-sans)',
  outline: 'none',
  transition: 'border-color 0.2s',
};
const label = {
  display: 'block',
  fontSize: '0.875rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--color-lumen-muted)',
  marginBottom: '0.375rem',
};
const card = {
  background: 'var(--color-lumen-white)',
  border: '1px solid var(--color-lumen-border)',
  marginBottom: '1.25rem',
};
const cardHeader = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid var(--color-lumen-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const cardBody = { padding: '1.5rem' };

function SectionCard({ title, hint, children, collapsible = false }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={card}>
      <div style={cardHeader}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.125rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h3>
          {hint && <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', marginTop: '0.125rem' }}>{hint}</p>}
        </div>
        {collapsible && (
          <button type="button" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-lumen-muted)' }}>
            {open ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {open && <div style={cardBody}>{children}</div>}
    </div>
  );
}

function FieldRow({ label: lbl, hint, children, required }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={label}>
        {lbl}
        {required && <span style={{ color: 'var(--color-lumen-gold)', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', marginTop: '0.375rem', lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

// ── Image Upload ───────────────────────────────────────────────
function ImageUploader({ images, setImages }) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const newImages = Array.from(files).map((file) => ({
      id: String(Date.now() + Math.random()),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: '2px dashed var(--color-lumen-border)',
          background: 'var(--color-lumen-bg)',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          marginBottom: '1rem',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-lumen-gold)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-lumen-border)'}
      >
        <Upload size={24} strokeWidth={1.25} style={{ color: 'var(--color-lumen-gold)', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', marginBottom: '0.25rem' }}>
          Drop photos here or <span style={{ color: 'var(--color-lumen-gold)', textDecoration: 'underline' }}>browse</span>
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>
          Upload up to 10 photos · JPG, PNG, WEBP · Max 10 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(5rem, 1fr))', gap: '1rem' }}>
          {images.map((img, i) => (
            <div key={img.id} style={{ position: 'relative', aspectRatio: '1', border: '1px solid var(--color-lumen-border)', overflow: 'hidden' }}>
              {i === 0 && (
                <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--color-lumen-gold)', color: '#fff', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 5px', zIndex: 1 }}>
                  Cover
                </span>
              )}
              <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'rgba(26,26,26,0.6)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={10} strokeWidth={2.5} style={{ color: '#fff' }} />
              </button>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', marginTop: '0.5rem' }}>
        {images.length}/10 photos · First photo is the cover image shown on the shop
      </p>
    </div>
  );
}

// ── Variant Builder ────────────────────────────────────────────
function VariantBuilder({ variants, setVariants }) {
  const addVariant = () => {
    setVariants([...variants, { id: String(Date.now()), name: '', values: '' }]);
  };

  const updateVariant = (id, field, val) => {
    setVariants(variants.map((v) => v.id === id ? { ...v, [field]: val } : v));
  };

  const removeVariant = (id) => setVariants(variants.filter((v) => v.id !== id));

  return (
    <div>
      <p style={{ fontSize: '0.9375rem', color: 'var(--color-lumen-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Add options like Finish, Size, or Material. Customers can select from these when ordering.
      </p>

      {variants.map((variant) => (
        <div key={variant.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <label style={{ ...label, marginBottom: '0.25rem' }}>Option Name</label>
            <select
              style={{ ...input }}
              value={variant.name}
              onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-lumen-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-lumen-border)'}
            >
              <option value="">Select…</option>
              {['Finish', 'Size', 'Material', 'Color', 'Bulb Type', 'Chain Length'].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ ...label, marginBottom: '0.25rem' }}>Values (comma separated)</label>
            <input
              style={input}
              value={variant.values}
              placeholder="e.g. Brass, Chrome, Matte Black"
              onChange={(e) => updateVariant(variant.id, 'values', e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-lumen-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-lumen-border)'}
            />
          </div>
          <button type="button" onClick={() => removeVariant(variant.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-lumen-muted)', paddingTop: '1.5rem' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lumen-error)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lumen-muted)'}>
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      ))}

      {variants.length < 3 && (
        <button type="button" onClick={addVariant}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: '1px dashed var(--color-lumen-border)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.9375rem', color: 'var(--color-lumen-muted)', width: '100%', justifyContent: 'center', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-lumen-gold)'; e.currentTarget.style.color = 'var(--color-lumen-gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-lumen-border)'; e.currentTarget.style.color = 'var(--color-lumen-muted)'; }}
        >
          <Plus size={14} strokeWidth={2} /> Add Another Option
        </button>
      )}
    </div>
  );
}

// ── Tag Input ─────────────────────────────────────────────────
function TagInput({ tags, setTags }) {
  const [input2, setInput2] = useState('');

  const addTag = (val) => {
    const trimmed = val.trim().replace(/,+$/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 13) {
      setTags([...tags, trimmed]);
      setInput2('');
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input2); }
    if (e.key === 'Backspace' && !input2 && tags.length) setTags(tags.slice(0, -1));
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', padding: '0.5rem', border: '1px solid var(--color-lumen-border)', background: 'var(--color-lumen-bg)', minHeight: '2.75rem', alignItems: 'center', cursor: 'text' }}
        onClick={() => document.getElementById('tag-input')?.focus()}>
        {tags.map((t) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', fontSize: '0.9375rem', color: 'var(--color-lumen-black)' }}>
            {t}
            <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-lumen-muted)', padding: 0, lineHeight: 1 }}>
              <X size={10} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => addTag(input2)}
          placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)' : ''}
          style={{ flex: 1, minWidth: '8rem', background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-black)' }}
        />
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', marginTop: '0.375rem' }}>
        {tags.length}/13 tags · Tags help customers find your listing in search
      </p>
    </div>
  );
}

// ── Main Add/Edit Product Page ────────────────────────────────
export default function AddProductPage() {
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    costPerItem: '',
    sku: '',
    stock: '',
    trackInventory: true,
    continueWhenOutOfStock: false,
    category: 'Chandeliers',
    style: 'Modern',
    finish: 'Matte Black',
    collection: '',
    status: 'active',
    weight: '',
    dimensions: '',
    shipping: '',
    metaTitle: '',
    metaDescription: '',
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const focus = (e) => { e.target.style.borderColor = 'var(--color-lumen-gold)'; };
  const blur  = (e) => { e.target.style.borderColor = 'var(--color-lumen-border)'; };

  const [uploadProgress, setUploadProgress] = useState('');

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Upload images to Cloudinary
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.file) {
          setUploadProgress(`Uploading image ${i + 1} of ${images.length}…`);
          const url = await uploadToCloudinary(img.file);
          imageUrls.push(url);
        } else if (img.url) {
          imageUrls.push(img.url); // already a URL (e.g. from editing)
        }
      }

      // 2. Build product object
      setUploadProgress('Saving to database…');
      const slug = slugify(form.title);
      const product = {
        ...form,
        slug,
        name: form.title,
        status: publishStatus || form.status,
        images: imageUrls,
        tags,
        variants,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        costPerItem: form.costPerItem ? Number(form.costPerItem) : null,
        stock: Number(form.stock || 0),
      };

      // 3. Save to Firestore
      await addProduct(product);
      router.push('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const margin = form.price && form.costPerItem
    ? (((Number(form.price) - Number(form.costPerItem)) / Number(form.price)) * 100).toFixed(1)
    : null;

  return (
    <form onSubmit={(e) => handleSubmit(e, null)}>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-lumen-border)', flexWrap: 'wrap' }}>
        <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-lumen-muted)', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lumen-gold)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lumen-muted)'}>
          <ArrowLeft size={15} strokeWidth={1.75} /> Products
        </Link>
        <span style={{ color: 'var(--color-lumen-border-dark)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.5rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.5rem' }}>Add Product</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={saving}
            className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            Save Draft
          </button>
          <button type="submit" disabled={saving || !form.title || !form.price}
            className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', opacity: (!form.title || !form.price) ? 0.5 : 1 }}>
            {saving ? 'Publishing…' : 'Publish Listing →'}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="product-form-grid">

        {/* ── Left Column ── */}
        <div>
          {/* 1. Photos */}
          <SectionCard title="Photos" hint="First photo becomes the cover shown to customers in the shop">
            <ImageUploader images={images} setImages={setImages} />
          </SectionCard>

          {/* 2. Title & Description */}
          <SectionCard title="Title & Description">
            <FieldRow label="Product Title" required>
              <input required style={input} value={form.title} placeholder="e.g. The Aurelia Tiered Chandelier"
                onChange={(e) => set('title', e.target.value)} onFocus={focus} onBlur={blur} />
            </FieldRow>
            <FieldRow label="Description" hint="Describe your piece — materials, dimensions, mood, and installation notes. Good descriptions improve search visibility.">
              <textarea rows={7} style={{ ...input, resize: 'vertical', lineHeight: 1.7 }}
                value={form.description} placeholder="A masterpiece of modern illumination…"
                onChange={(e) => set('description', e.target.value)} onFocus={focus} onBlur={blur} />
            </FieldRow>
          </SectionCard>

          {/* 3. Pricing */}
          <SectionCard title="Pricing">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <FieldRow label="Price (USD)" required>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>$</span>
                  <input required type="number" min="0" step="0.01" style={{ ...input, paddingLeft: '1.5rem' }}
                    value={form.price} placeholder="14,200.00"
                    onChange={(e) => set('price', e.target.value)} onFocus={focus} onBlur={blur} />
                </div>
              </FieldRow>
              <FieldRow label="Compare-at Price" hint="Original price (shows strikethrough)">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>$</span>
                  <input type="number" min="0" step="0.01" style={{ ...input, paddingLeft: '1.5rem' }}
                    value={form.comparePrice} placeholder="16,000.00"
                    onChange={(e) => set('comparePrice', e.target.value)} onFocus={focus} onBlur={blur} />
                </div>
              </FieldRow>
              <FieldRow label="Cost Per Item" hint="Not shown to customers">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-lumen-muted)', fontSize: '0.875rem' }}>$</span>
                  <input type="number" min="0" step="0.01" style={{ ...input, paddingLeft: '1.5rem' }}
                    value={form.costPerItem} placeholder="7,000.00"
                    onChange={(e) => set('costPerItem', e.target.value)} onFocus={focus} onBlur={blur} />
                </div>
              </FieldRow>
            </div>
            {margin !== null && (
              <div style={{ display: 'flex', gap: '2rem', padding: '1rem 1rem', background: 'var(--color-lumen-bg)', border: '1px solid var(--color-lumen-border)', marginTop: '0.25rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', marginBottom: '0.2rem' }}>Margin</p>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>{margin}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', marginBottom: '0.2rem' }}>Profit</p>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-lumen-success)', fontWeight: 500 }}>
                    ${(Number(form.price) - Number(form.costPerItem)).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </SectionCard>

          {/* 4. Inventory */}
          <SectionCard title="Inventory">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <FieldRow label="SKU (Stock Keeping Unit)">
                <input style={input} value={form.sku} placeholder="ES-AT-01"
                  onChange={(e) => set('sku', e.target.value)} onFocus={focus} onBlur={blur} />
              </FieldRow>
              <FieldRow label="Quantity in Stock" required>
                <input required type="number" min="0" style={input} value={form.stock} placeholder="10"
                  onChange={(e) => set('stock', e.target.value)} onFocus={focus} onBlur={blur} />
              </FieldRow>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'trackInventory', label: 'Track inventory for this product' },
                { key: 'continueWhenOutOfStock', label: 'Continue selling when out of stock' },
              ].map(({ key, label: lbl }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-lumen-black)' }}>
                  <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)}
                    style={{ width: '1rem', height: '1rem', accentColor: 'var(--color-lumen-gold)', cursor: 'pointer' }} />
                  {lbl}
                </label>
              ))}
            </div>
          </SectionCard>

          {/* 5. Variants */}
          <SectionCard title="Options & Variants" hint="e.g. Finish: Brass, Chrome · Size: Small, Large">
            <VariantBuilder variants={variants} setVariants={setVariants} />
          </SectionCard>

          {/* 6. Shipping */}
          <SectionCard title="Shipping & Dimensions" collapsible>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <FieldRow label="Weight (kg)">
                <input type="number" min="0" step="0.1" style={input} value={form.weight} placeholder="8.5"
                  onChange={(e) => set('weight', e.target.value)} onFocus={focus} onBlur={blur} />
              </FieldRow>
              <FieldRow label="Dimensions (L × W × H cm)">
                <input style={input} value={form.dimensions} placeholder="80 × 80 × 60"
                  onChange={(e) => set('dimensions', e.target.value)} onFocus={focus} onBlur={blur} />
              </FieldRow>
            </div>
            <FieldRow label="Delivery Time / Shipping Info" hint="Overrides the default 4-8 weeks message">
              <input style={input} value={form.shipping} placeholder="Free insured international shipping. Estimated delivery 4–8 weeks."
                onChange={(e) => set('shipping', e.target.value)} onFocus={focus} onBlur={blur} />
            </FieldRow>
          </SectionCard>

          {/* 7. Tags */}
          <SectionCard title="Tags" hint="Help customers find your product through search">
            <TagInput tags={tags} setTags={setTags} />
          </SectionCard>

          {/* 8. SEO */}
          <SectionCard title="Search Engine Optimization" collapsible>
            <FieldRow label="SEO Title" hint="Defaults to product title if left blank">
              <input style={input} value={form.metaTitle} placeholder={form.title || 'Product title'}
                onChange={(e) => set('metaTitle', e.target.value)} onFocus={focus} onBlur={blur} />
            </FieldRow>
            <FieldRow label="SEO Description">
              <textarea rows={3} style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
                value={form.metaDescription} placeholder="A brief description for search engines…"
                onChange={(e) => set('metaDescription', e.target.value)} onFocus={focus} onBlur={blur} />
            </FieldRow>
            {/* Google preview */}
            {(form.metaTitle || form.title) && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-lumen-bg)', border: '1px solid var(--color-lumen-border)' }}>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', marginBottom: '0.5rem' }}>Search Preview</p>
                <p style={{ fontSize: '0.875rem', color: '#1a0dab', marginBottom: '0.125rem' }}>{form.metaTitle || form.title} | Elegence Series</p>
                <p style={{ fontSize: '0.875rem', color: '#006621', marginBottom: '0.25rem' }}>elegenceseries.com/shop/{(form.title || '').toLowerCase().replace(/\s+/g, '-')}</p>
                <p style={{ fontSize: '0.9375rem', color: '#545454', lineHeight: 1.5 }}>{form.metaDescription || form.description?.slice(0, 155) || 'No description provided.'}</p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── Right Sidebar ── */}
        <div>
          {/* Status */}
          <div style={card}>
            <div style={cardHeader}>
              <h3 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.125rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>Listing Status</h3>
            </div>
            <div style={cardBody}>
              {[
                { value: 'active', label: 'Active', desc: 'Visible to customers in the shop' },
                { value: 'draft', label: 'Draft', desc: 'Hidden from customers, save for later' },
              ].map(({ value, label: lbl, desc }) => (
                <label key={value} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', marginBottom: '1rem' }}>
                  <input type="radio" name="status" value={value} checked={form.status === value} onChange={() => set('status', value)}
                    style={{ marginTop: '2px', accentColor: 'var(--color-lumen-gold)', width: '1rem', height: '1rem' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>{lbl}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Organization */}
          <div style={card}>
            <div style={cardHeader}>
              <h3 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.125rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>Organization</h3>
            </div>
            <div style={cardBody}>
              <FieldRow label="Category">
                <select style={{ ...input, cursor: 'pointer' }} value={form.category} onChange={(e) => set('category', e.target.value)}
                  onFocus={focus} onBlur={blur}>
                  {['Chandeliers', 'Pendants', 'Wall Lights', 'Floor Lamps', 'Table Lamps', 'Outdoor Lighting', 'Architectural Lights', 'Wall Sconces'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Style">
                <select style={{ ...input, cursor: 'pointer' }} value={form.style} onChange={(e) => set('style', e.target.value)}
                  onFocus={focus} onBlur={blur}>
                  {['Modern', 'Traditional', 'Art Deco', 'Minimalist'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Finish">
                <select style={{ ...input, cursor: 'pointer' }} value={form.finish} onChange={(e) => set('finish', e.target.value)}
                  onFocus={focus} onBlur={blur}>
                  {['Brushed Gold', 'Brushed Brass', 'Matte Black', 'Chrome', 'Antique Bronze'].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="Collection" hint="Group products into curated collections">
                <select style={{ ...input, cursor: 'pointer' }} value={form.collection} onChange={(e) => set('collection', e.target.value)}
                  onFocus={focus} onBlur={blur}>
                  <option value="">No collection</option>
                  {['New Arrivals', 'Featured', 'Best Sellers', 'Sale'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </FieldRow>
            </div>
          </div>

          {/* Summary */}
          <div style={{ ...card, background: 'var(--color-lumen-bg)' }}>
            <div style={cardBody}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-lumen-muted)', marginBottom: '1rem' }}>Listing Summary</p>
              {[
                { label: 'Photos', value: `${images.length} / 10` },
                { label: 'Tags', value: `${tags.length} / 13` },
                { label: 'Options', value: variants.length || 'None' },
                { label: 'Status', value: form.status === 'active' ? 'Will be visible' : 'Saved as draft' },
              ].map(({ label: lbl, value }) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--color-lumen-muted)' }}>{lbl}</span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--color-lumen-black)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Publish */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button type="submit" disabled={saving || !form.title || !form.price}
              className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: (!form.title || !form.price) ? 0.5 : 1 }}>
              {saving ? 'Publishing…' : 'Publish Listing →'}
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={saving}
              className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Save as Draft
            </button>
            <Link href="/admin/products" style={{ display: 'block', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-lumen-muted)', textDecoration: 'none', paddingTop: '0.25rem', transition: 'color 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lumen-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lumen-muted)'}>
              Discard changes
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .product-form-grid { grid-template-columns: 1fr 21rem !important; }
        }
      `}</style>
    </form>
  );
}
