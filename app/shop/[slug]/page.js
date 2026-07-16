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
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-lumen-gold transition-colors">{(product.category || '').toUpperCase()}</Link>
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
        {relatedProducts.length > 0 && (
          <section className="section-container py-20">
            <h2 className="font-serif text-3xl text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
        <section className="section-container">
          <RecentlyViewed currentSlug={slug} />
        </section>
      </main>
      <Footer />
    </>
  );
}
