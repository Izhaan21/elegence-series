'use client';

import { useState } from 'react';
import { Save, Check } from 'lucide-react';

const INITIAL_SETTINGS = {
  storeName: 'Elegence Series',
  storeEmail: 'hello@elegenceseries.com',
  supportPhone: '+1 (800) 555-0190',
  currency: 'USD',
  taxRate: '0',
  shippingNote: 'Free insured international shipping on all orders.',
  metaTitle: 'Elegence Series — Luxury Chandeliers & Pendants',
  metaDescription: 'Discover meticulously curated architectural lighting designed to transform spaces into masterpieces of modern elegance.',
  stripePublishableKey: '',
  orderPrefix: 'ES',
  maintenanceMode: false,
  showSalePrices: true,
  enableReviews: false,
};

const inputStyle = {
  width: '100%',
  background: 'var(--color-lumen-bg)',
  border: '1px solid var(--color-lumen-border)',
  color: 'var(--color-lumen-black)',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-family-sans)',
  borderRadius: '4px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-lumen-black)',
  marginBottom: '0.375rem',
};

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', marginBottom: '1.5rem' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-lumen-border)' }}>
        <h2 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.25rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      style={{
        width: '2.75rem', height: '1.5rem',
        background: checked ? 'var(--color-lumen-gold)' : 'var(--color-lumen-border)',
        border: `1px solid ${checked ? 'var(--color-lumen-gold)' : 'var(--color-lumen-border-dark)'}`,
        borderRadius: '999px', cursor: 'pointer',
        position: 'relative', transition: 'all 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '2px',
        left: checked ? 'calc(100% - 20px)' : '2px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setSettings((prev) => ({ ...prev, [key]: val }));

  const handleFocus = (e) => e.target.style.borderColor = 'var(--color-lumen-gold)';
  const handleBlur = (e) => e.target.style.borderColor = 'var(--color-lumen-border)';

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-lumen-border)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-sans)', fontSize: '1.5rem', color: 'var(--color-lumen-black)', fontWeight: 600, marginBottom: '0.5rem' }}>Settings</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-lumen-muted)' }}>Manage your store configuration</p>
        </div>
        <button type="submit" disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: saved ? 'var(--color-lumen-success-light)' : 'var(--color-lumen-black)',
            border: saved ? '1px solid rgba(45,122,79,0.3)' : '1px solid var(--color-lumen-black)',
            color: saved ? 'var(--color-lumen-success)' : '#fff',
            padding: '1rem 1.25rem',
            fontSize: '0.9375rem', fontFamily: 'var(--font-family-sans)',
            fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1, transition: 'all 0.2s',
          }}
        >
          {saved ? <Check size={14} strokeWidth={2.5} /> : <Save size={14} strokeWidth={2} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Store Info */}
      <Section title="Store Information">
        <Field label="Store Name">
          <input style={inputStyle} value={settings.storeName} onChange={(e) => update('storeName', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
        <Field label="Support Email">
          <input type="email" style={inputStyle} value={settings.storeEmail} onChange={(e) => update('storeEmail', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
        <Field label="Support Phone">
          <input style={inputStyle} value={settings.supportPhone} onChange={(e) => update('supportPhone', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
        <Field label="Order ID Prefix" hint="Prepended to every order number, e.g. ES-2024-001">
          <input style={{ ...inputStyle, maxWidth: '10rem' }} value={settings.orderPrefix} onChange={(e) => update('orderPrefix', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
      </Section>

      {/* Commerce */}
      <Section title="Commerce">
        <Field label="Currency">
          <select style={{ ...inputStyle, cursor: 'pointer', maxWidth: '10rem' }} value={settings.currency} onChange={(e) => update('currency', e.target.value)}>
            {['USD', 'GBP', 'EUR', 'AED', 'AUD', 'SGD'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Tax Rate (%)" hint="Set to 0 if tax is calculated at checkout by Stripe.">
          <input type="number" min="0" max="100" step="0.1" style={{ ...inputStyle, maxWidth: '10rem' }} value={settings.taxRate} onChange={(e) => update('taxRate', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
        <Field label="Shipping Banner">
          <input style={inputStyle} value={settings.shippingNote} onChange={(e) => update('shippingNote', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
      </Section>

      {/* SEO */}
      <Section title="SEO & Metadata">
        <Field label="Default Page Title">
          <input style={inputStyle} value={settings.metaTitle} onChange={(e) => update('metaTitle', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
        <Field label="Default Meta Description">
          <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} value={settings.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
      </Section>

      {/* Integrations */}
      <Section title="Integrations">
        <Field label="Stripe Publishable Key" hint="Starts with pk_live_ or pk_test_. Never put your secret key here.">
          <input type="password" style={inputStyle} value={settings.stripePublishableKey} onChange={(e) => update('stripePublishableKey', e.target.value)} placeholder="pk_live_…" onFocus={handleFocus} onBlur={handleBlur} />
        </Field>
      </Section>

      {/* Feature Flags */}
      <Section title="Feature Flags">
        {[
          { key: 'showSalePrices', label: 'Show Sale Prices', hint: 'Display discounted price alongside original on product pages' },
          { key: 'enableReviews', label: 'Enable Product Reviews', hint: 'Show customer review section on product pages' },
          { key: 'maintenanceMode', label: 'Maintenance Mode', hint: 'Redirect all storefront visitors to a coming-soon page' },
        ].map(({ key, label, hint }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', maxWidth: '32rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-lumen-border)' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-black)', marginBottom: '0.2rem' }}>{label}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)' }}>{hint}</p>
            </div>
            <Toggle checked={settings[key]} onChange={(val) => update(key, val)} />
          </div>
        ))}
      </Section>
    </form>
  );
}
