'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ChevronDown, ChevronUp, Truck, ZoomIn, Loader2 } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/firestore';
import RecentlyViewed, { useTrackRecentlyViewed } from '@/components/RecentlyViewed';

// ── Mock product data ─────────────────────────────────────
const MOCK_PRODUCTS = {
  'aurelia-tiered': {
    id: '1',
    name: 'The Aurelia Tiered',
    slug: 'aurelia-tiered',
    category: 'Chandeliers',
    breadcrumb: 'CHANDELIERS',
    price: 14200,
    discountPrice: 12400,
    sku: 'ES-AT-01',
    stockQty: 8,
    images: ['/product-aurelia.jpg', '/cat-chandeliers.jpg', '/cat-pendants.jpg', '/product-deco.jpg'],
    description: `A masterpiece of modern illumination. The Aurelia Tiered reimagines classic opulence through a minimalist lens, featuring precision-cut geometric crystals suspended in an invisible tension frame. Designed to anchor expansive architectural spaces with quiet authority.`,
    specifications: [
      { label: 'Dimensions', value: '80" W × 60" H' },
      { label: 'Weight', value: '48 lbs' },
      { label: 'Material', value: 'K9 Crystal, Aerospace Aluminum' },
      { label: 'Finish', value: 'Brushed Gold' },
      { label: 'Number of Lights', value: '48' },
      { label: 'Bulb Type', value: 'LED (Integrated)' },
      { label: 'Voltage', value: '110-240V' },
      { label: 'SKU', value: 'LMN-AT-01' },
    ],
    shipping: 'Free insured international shipping on all orders. Estimated delivery 4–8 weeks. Fragile pieces are custom crated by our logistics team.',
  },
  'obsidian-linear-array': {
    id: '2',
    name: 'Obsidian Linear Array',
    slug: 'obsidian-linear-array',
    category: 'Chandeliers',
    breadcrumb: 'CHANDELIERS',
    price: 8950,
    discountPrice: null,
    sku: 'LMN-OL-02',
    stockQty: 5,
    images: ['/product-obsidian.jpg', '/cat-wall-lights.jpg', '/product-aurelia.jpg'],
    description: `Clean, architectural, and uncompromising. The Obsidian Linear Array suspends precision-milled matte black rods in a geometric composition that commands any space it inhabits.`,
    specifications: [
      { label: 'Dimensions', value: '72" W × 8" H' },
      { label: 'Weight', value: '22 lbs' },
      { label: 'Material', value: 'Powder-Coated Steel' },
      { label: 'Finish', value: 'Matte Black' },
      { label: 'Number of Lights', value: '6' },
      { label: 'Bulb Type', value: 'E26 (included)' },
      { label: 'Voltage', value: '110-240V' },
      { label: 'SKU', value: 'LMN-OL-02' },
    ],
    shipping: 'Free insured international shipping on all orders. Estimated delivery 3–6 weeks.',
  },
  'deco-cascade': {
    id: '3',
    name: 'Deco Cascade',
    slug: 'deco-cascade',
    category: 'Chandeliers',
    breadcrumb: 'CHANDELIERS',
    price: 15200,
    discountPrice: null,
    sku: 'LMN-DC-03',
    stockQty: 3,
    images: ['/product-deco.jpg', '/cat-chandeliers.jpg', '/product-aurelia.jpg'],
    description: `The Deco Cascade is a triumph of Art Deco revival. Concentric rings of hand-cut crystal rods cascade downward in a mesmerising waterfall effect, catching and refracting light in every direction.`,
    specifications: [
      { label: 'Dimensions', value: '48" W × 72" H' },
      { label: 'Weight', value: '85 lbs' },
      { label: 'Material', value: 'Hand-cut Crystal, Chrome' },
      { label: 'Finish', value: 'Chrome' },
      { label: 'Number of Lights', value: '24' },
      { label: 'Bulb Type', value: 'LED (Integrated)' },
      { label: 'Voltage', value: '110-240V' },
      { label: 'SKU', value: 'LMN-DC-03' },
    ],
    shipping: 'Free insured international shipping on all orders. Estimated delivery 6–10 weeks. Custom crating included.',
  },
};

const RELATED_PRODUCTS = [
  { id: '4', name: 'Aura Pendant', slug: 'aura-pendant', category: 'Pendants', price: 1450, images: ['/cat-pendants.jpg'], isNew: true },
  { id: '5', name: 'Linea Sconce', slug: 'linea-sconce', category: 'Wall Lights', price: 850, images: ['/cat-wall-lights.jpg'], isNew: false },
  { id: '6', name: 'Deco Cascade', slug: 'deco-cascade', category: 'Chandeliers', price: 15200, images: ['/product-deco.jpg'], isNew: false },
];

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-lumen-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-lumen-black">
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} strokeWidth={1.5} className="text-lumen-muted flex-shrink-0" />
        ) : (
          <ChevronDown size={14} strokeWidth={1.5} className="text-lumen-muted flex-shrink-0" />
        )}
      </button>
      {open && <div className="pb-5 animate-fadeIn">{children}</div>}
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams?.slug;

  // Track recently viewed
  useTrackRecentlyViewed(slug);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const { addItem } = useCart();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      getProductBySlug(slug),
      getProducts({ limitCount: 4 }),
    ]).then(([prod, related]) => {
      setProduct(prod);
      if (prod && prod.variants) {
        const initialVars = {};
        prod.variants.forEach(v => {
          if (v.name && v.values) {
            initialVars[v.name] = v.values.split(',')[0].trim();
          }
        });
        setSelectedVariants(initialVars);
      }
      setRelatedProducts(related.filter((p) => p.slug !== slug).slice(0, 3));
    }).catch((err) => {
      console.error('Error loading product:', err);
    }).finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0],
      slug: product.slug,
      quantity,
      selectedVariants,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={28} style={{ color: 'var(--color-lumen-gold)', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--color-lumen-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)' }}>Loading product…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-family-serif)', fontSize: '2rem', color: 'var(--color-lumen-black)' }}>Product Not Found</p>
          <p style={{ color: 'var(--color-lumen-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', marginBottom: '1rem' }}>This product may have been removed or the link is incorrect.</p>
          <Link href="/shop" className="btn-primary">Browse All Products</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="section-container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] font-sans text-lumen-muted mb-8">
            <Link href="/shop" className="hover:text-lumen-gold transition-colors">SHOP</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-lumen-gold transition-colors">{product.breadcrumb}</Link>
            <span>/</span>
            <span className="text-lumen-black font-medium">{product.name.toUpperCase()}</span>
          </nav>

          {/* Product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* ── LEFT: Gallery ── */}
            <div className="flex gap-3">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      activeImage === i ? 'border-lumen-black' : 'border-transparent hover:border-lumen-gold'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div 
                className="relative flex-1 aspect-[4/5] bg-gray-100 overflow-hidden group cursor-crosshair"
                onMouseEnter={() => setIsMagnifying(true)}
                onMouseLeave={() => setIsMagnifying(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isMagnifying ? 'scale(2)' : 'scale(1)',
                    transition: 'transform 0.2s ease-out'
                  }}
                />
                <div className={`absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 transition-opacity duration-300 ${isMagnifying ? 'opacity-0' : 'opacity-100'}`}>
                  <ZoomIn size={12} strokeWidth={1.5} className="text-lumen-muted" />
                  <span className="text-[10px] font-sans tracking-[0.1em] uppercase text-lumen-muted">
                    Hover to Inspect
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-lumen-muted mb-2">
                  {product.category}
                </p>
                <h1 className="font-serif text-4xl leading-tight mb-4">{product.name}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl">
                    ${(product.discountPrice || product.price).toLocaleString('en-US')}
                  </span>
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="font-sans text-base text-lumen-muted line-through">
                      ${product.price.toLocaleString('en-US')}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-sans text-lumen-muted leading-relaxed">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-2 mb-6">
                  {product.variants.map((v) => {
                    if (!v.name || !v.values) return null;
                    const options = v.values.split(',').map(s => s.trim()).filter(Boolean);
                    if (options.length === 0) return null;
                    return (
                      <div key={v.id}>
                        <p className="text-[10px] font-sans tracking-[0.15em] uppercase text-lumen-muted mb-2">
                          {v.name}: <span className="text-lumen-black font-semibold">{selectedVariants[v.name] || options[0]}</span>
                        </p>
                        {options.length > 1 && (
                          <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                              <button
                                key={opt}
                                onClick={() => setSelectedVariants({ ...selectedVariants, [v.name]: opt })}
                                className={`font-sans text-[11px] tracking-wider transition-all duration-200 uppercase ${
                                  selectedVariants[v.name] === opt
                                    ? 'text-lumen-black font-semibold'
                                    : 'text-lumen-muted hover:text-lumen-black'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-[10px] font-sans tracking-[0.15em] uppercase text-lumen-muted mb-3">
                  Quantity
                </p>
                <div className="flex items-center border border-lumen-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-lumen-gold hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="w-12 text-center text-sm font-sans">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-lumen-gold hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-[11px] font-sans font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
                    addedToCart
                      ? 'bg-lumen-success text-white'
                      : 'bg-lumen-black text-white hover:bg-lumen-gold'
                  }`}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <Link
                  href="/cart"
                  className="flex-1 border border-lumen-black text-lumen-black text-[11px] font-sans font-medium tracking-[0.15em] uppercase py-4 text-center hover:bg-lumen-gold hover:text-white transition-colors duration-200"
                >
                  Secure Checkout
                </Link>
              </div>

              {/* Shipping badge */}
              <div className="flex items-center gap-3 bg-lumen-white border border-lumen-border px-4 py-3">
                <Truck size={16} strokeWidth={1.5} className="text-lumen-muted flex-shrink-0" />
                <span className="text-xs font-sans text-lumen-muted">
                  Free Insured International Shipping
                </span>
              </div>

              {/* Accordions */}
              <div className="border-b border-lumen-border">
                <Accordion title="Description">
                  <p className="text-sm font-sans text-lumen-muted leading-relaxed">
                    {product.description || 'No description available.'}
                  </p>
                </Accordion>

                <Accordion title="Specifications">
                  <dl className="space-y-2">
                    {(product.specifications || []).map((spec) => (
                      <div key={spec.label} className="flex justify-between text-sm font-sans">
                        <dt className="text-lumen-muted">{spec.label}</dt>
                        <dd className="text-lumen-black font-medium">{spec.value}</dd>
                      </div>
                    ))}
                    {product.weight && (
                      <div className="flex justify-between text-sm font-sans">
                        <dt className="text-lumen-muted">Weight</dt>
                        <dd className="text-lumen-black font-medium">{product.weight} kg</dd>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between text-sm font-sans">
                        <dt className="text-lumen-muted">Dimensions</dt>
                        <dd className="text-lumen-black font-medium">{product.dimensions}</dd>
                      </div>
                    )}
                    {(!product.specifications || product.specifications.length === 0) && !product.weight && !product.dimensions && (
                      <div className="text-sm font-sans text-lumen-muted">No specifications available.</div>
                    )}
                  </dl>
                </Accordion>

                <Accordion title="Shipping & Returns">
                  <p className="text-sm font-sans text-lumen-muted leading-relaxed">
                    {product.shipping || 'Free insured international shipping on all orders. Estimated delivery 4–8 weeks.'}
                  </p>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ─────────────────────────── */}
        <section className="section-container py-20">
          <h2 className="font-serif text-3xl text-center mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {RELATED_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <RecentlyViewed currentSlug={slug} />
        </section>
      </main>
      <Footer />
    </>
  );
}
