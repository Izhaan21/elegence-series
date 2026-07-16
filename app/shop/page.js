'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal, X, Loader2, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '@/lib/firestore';

const CATEGORIES = ['All', 'Chandeliers', 'Pendants', 'Wall Lights', 'Floor Lamps', 'Table Lamps', 'Outdoor Lighting', 'Architectural Lights', 'Wall Sconces'];
const STYLES = ['Modern', 'Traditional', 'Art Deco', 'Minimalist'];
const FINISHES = ['Brushed Gold', 'Brushed Brass', 'Matte Black', 'Chrome', 'Antique Bronze'];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
];
const MAX_PRICE = 25000;
const ITEMS_PER_PAGE = 12;

function SidebarAccordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-lumen-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span style={{ fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-lumen-black)', fontFamily: 'var(--font-family-sans)', fontWeight: 600 }}>
          {title}
        </span>
        {open ? <ChevronDown size={14} className="text-lumen-muted" /> : <ChevronDown size={14} className="text-lumen-muted -rotate-90 transition-transform" />}
      </button>
      {open && <div className="pt-4 animate-fadeIn">{children}</div>}
    </div>
  );
}

// ── Sidebar extracted as a standalone component ───────────
function ShopSidebar({
  selectedCategory, setSelectedCategory,
  selectedStyles, toggleStyle,
  selectedFinishes, toggleFinish,
  priceRange, setPriceRange,
  inStock, setInStock,
  outOfStock, setOutOfStock
}) {
  return (
    <aside className="space-y-1">
      {/* Category */}
      <SidebarAccordion title="Category" defaultOpen={true}>
        <ul className="space-y-2">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'bg-lumen-black border-lumen-black' : 'border-lumen-border group-hover:border-lumen-muted'}`}>
                  {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="hidden"
                />
                <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: selectedCategory === cat ? 'var(--color-lumen-black)' : 'var(--color-lumen-muted)' }}>
                  {cat === 'All' ? 'All Products' : cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </SidebarAccordion>

      {/* Availability */}
      <SidebarAccordion title="Availability" defaultOpen={true}>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${inStock ? 'bg-lumen-black border-lumen-black' : 'border-lumen-border group-hover:border-lumen-muted'}`}>
                {inStock && <div className="w-1.5 h-1.5 bg-white" />}
              </div>
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="hidden" />
              <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: inStock ? 'var(--color-lumen-black)' : 'var(--color-lumen-muted)' }}>
                In stock
              </span>
            </label>
          </li>
          <li>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${outOfStock ? 'bg-lumen-black border-lumen-black' : 'border-lumen-border group-hover:border-lumen-muted'}`}>
                {outOfStock && <div className="w-1.5 h-1.5 bg-white" />}
              </div>
              <input type="checkbox" checked={outOfStock} onChange={(e) => setOutOfStock(e.target.checked)} className="hidden" />
              <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: outOfStock ? 'var(--color-lumen-black)' : 'var(--color-lumen-muted)' }}>
                Out of stock
              </span>
            </label>
          </li>
        </ul>
      </SidebarAccordion>

      {/* Price Range */}
      <SidebarAccordion title="Price" defaultOpen={true}>
        <div className="flex justify-between mb-4">
          <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)' }}>$0.00</span>
          <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)' }}>
            {priceRange >= MAX_PRICE ? '$25,000+' : `$${priceRange.toLocaleString()}`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={500}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-lumen-black)' }}
        />
      </SidebarAccordion>

      {/* Style */}
      <SidebarAccordion title="Style" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStyle(s)}
              style={{
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-family-sans)',
                letterSpacing: '0.05em',
                padding: '0.375rem 0.75rem',
                border: `1px solid ${selectedStyles.includes(s) ? 'var(--color-lumen-black)' : 'var(--color-lumen-border)'}`,
                background: selectedStyles.includes(s) ? 'var(--color-lumen-black)' : 'transparent',
                color: selectedStyles.includes(s) ? '#fff' : 'var(--color-lumen-black)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {selectedStyles.includes(s) ? '✓ ' : ''}{s}
            </button>
          ))}
        </div>
      </SidebarAccordion>

      {/* Finish */}
      <SidebarAccordion title="Finish" defaultOpen={false}>
        <ul className="space-y-2">
          {FINISHES.map((f) => (
            <li key={f}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedFinishes.includes(f) ? 'bg-lumen-black border-lumen-black' : 'border-lumen-border group-hover:border-lumen-muted'}`}>
                  {selectedFinishes.includes(f) && <div className="w-1.5 h-1.5 bg-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={selectedFinishes.includes(f)}
                  onChange={() => toggleFinish(f)}
                  className="hidden"
                />
                <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: selectedFinishes.includes(f) ? 'var(--color-lumen-black)' : 'var(--color-lumen-muted)' }}>
                  {f}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </SidebarAccordion>
    </aside>
  );
}

// ── Main Page ─────────────────────────────────────────────
function ShopContent() {
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedFinishes, setSelectedFinishes] = useState([]);
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  
  // Layout & Sorting
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const categoryQuery = searchParams?.get('category');
  const searchQuery = searchParams?.get('search') || '';

  // React to URL category changes
  useEffect(() => {
    if (categoryQuery && CATEGORIES.includes(categoryQuery)) {
      setSelectedCategory(categoryQuery);
    } else if (!categoryQuery) {
      setSelectedCategory('All');
    }
  }, [categoryQuery]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    getProducts({ status: 'active' })
      .then((data) => setAllProducts(data))
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setProductsLoading(false));
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStyles, selectedFinishes, priceRange, inStock, outOfStock, sortBy]);

  const toggleStyle = (s) =>
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleFinish = (f) =>
    setSelectedFinishes((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const filtered = useMemo(() => {
    let products = allProducts.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedStyles.length && !selectedStyles.includes(p.style)) return false;
      if (selectedFinishes.length && !selectedFinishes.includes(p.finish)) return false;
      if ((p.discountPrice || p.price) > priceRange) return false;

      // Search filter — match against name and category
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const categoryMatch = (p.category || '').toLowerCase().includes(q);
        if (!nameMatch && !categoryMatch) return false;
      }
      
      const isSoldOut = Number(p.stock) <= 0;
      if (inStock && outOfStock) {
        // Both checked, show all (no filter needed)
      } else if (inStock) {
        if (isSoldOut) return false;
      } else if (outOfStock) {
        if (!isSoldOut) return false;
      }

      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        products = [...products].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        products = [...products].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        products = [...products.filter((p) => p.isNew), ...products.filter((p) => !p.isNew)];
        break;
      default:
        break;
    }
    return products;
  }, [allProducts, selectedCategory, selectedStyles, selectedFinishes, priceRange, sortBy, inStock, outOfStock, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const sidebarProps = {
    selectedCategory, setSelectedCategory,
    selectedStyles, toggleStyle,
    selectedFinishes, toggleFinish,
    priceRange, setPriceRange,
    inStock, setInStock,
    outOfStock, setOutOfStock
  };

  return (
    <>
      <Navbar />
      <main className="section-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
          <span>›</span>
          <span style={{ color: 'var(--color-lumen-black)', fontWeight: 500 }}>
            {selectedCategory === 'All' ? 'ALL PRODUCTS' : selectedCategory.toUpperCase()}
          </span>
        </nav>

        {/* Active Search Banner */}
        {searchQuery && (
          <div style={{ background: 'var(--color-lumen-white)', border: '1px solid var(--color-lumen-border)', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'var(--font-family-sans)', fontSize: '0.875rem', color: 'var(--color-lumen-black)' }}>
              Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} for <strong>"{searchQuery}"</strong>
            </p>
            <Link href="/shop" style={{ fontFamily: 'var(--font-family-sans)', fontSize: '0.875rem', color: 'var(--color-lumen-muted)', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
              Clear search
            </Link>
          </div>
        )}

        {/* Page heading */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '3rem', marginBottom: '0.75rem', lineHeight: 1.1 }}>
              {searchQuery ? `Results for "${searchQuery}"` : `Exquisite ${selectedCategory === 'All' ? 'Lighting' : selectedCategory}`}
            </h1>
            <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', maxWidth: '28rem', lineHeight: 1.7 }}>
              Discover our curated collection of masterfully crafted pieces. Each fixture is designed
              to command attention and transform your architectural spaces with unparalleled luminescence
              and timeless elegance.
            </p>
          </div>
        </div>

        {/* Toolbar (Mobile Filters + Sort + Layout) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-lumen-border">
          
          <div className="flex items-center gap-4">
            {/* Mobile filter button */}
            <div className="block md:hidden">
              <button
                onClick={() => setMobileFilterOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontFamily: 'var(--font-family-sans)', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid var(--color-lumen-border)', padding: '0.625rem 1rem', background: 'transparent', cursor: 'pointer' }}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
            <span className="text-sm font-sans text-lumen-muted hidden md:inline-block">
              {filtered.length} products
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Sort dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-family-sans)',
                    color: 'var(--color-lumen-black)',
                    paddingRight: '1.5rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-lumen-black)' }} />
              </div>
            </div>

            {/* Layout Toggle */}
            <div className="hidden md:flex items-center gap-2 text-lumen-muted">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1 transition-colors ${viewMode === 'grid' ? 'text-lumen-black' : 'hover:text-lumen-black'}`}
                aria-label="Grid View"
              >
                <LayoutGrid size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1 transition-colors ${viewMode === 'list' ? 'text-lumen-black' : 'hover:text-lumen-black'}`}
                aria-label="List View"
              >
                <ListIcon size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filter overlay */}
        {mobileFilterOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }} className="md:hidden">
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} onClick={() => setMobileFilterOpen(false)} />
            <div style={{ position: 'relative', marginLeft: 'auto', width: '20rem', maxWidth: '100%', background: '#fff', height: '100%', overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 className="font-serif" style={{ fontSize: '1.25rem' }}>Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <ShopSidebar {...sidebarProps} />
              <button onClick={() => setMobileFilterOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Main layout */}
        <div style={{ display: 'flex', gap: '3rem' }}>
          {/* Sidebar — Desktop only */}
          <div style={{ width: '13rem', flexShrink: 0 }} className="hidden md:block">
            <ShopSidebar {...sidebarProps} />
          </div>

          {/* Product area */}
          <div style={{ flex: 1 }}>
            
            {/* Active Filter Pills */}
            {(selectedCategory !== 'All' || selectedStyles.length > 0 || selectedFinishes.length > 0 || priceRange < MAX_PRICE || inStock || outOfStock) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedCategory !== 'All' && (
                  <button onClick={() => setSelectedCategory('All')} className="flex items-center gap-1.5 text-xs font-sans bg-lumen-bg border border-lumen-border px-3 py-1 hover:bg-lumen-border transition-colors">
                    {selectedCategory} <X size={12} />
                  </button>
                )}
                {inStock && (
                  <button onClick={() => setInStock(false)} className="flex items-center gap-1.5 text-xs font-sans bg-lumen-bg border border-lumen-border px-3 py-1 hover:bg-lumen-border transition-colors">
                    In Stock <X size={12} />
                  </button>
                )}
                {outOfStock && (
                  <button onClick={() => setOutOfStock(false)} className="flex items-center gap-1.5 text-xs font-sans bg-lumen-bg border border-lumen-border px-3 py-1 hover:bg-lumen-border transition-colors">
                    Out of Stock <X size={12} />
                  </button>
                )}
                {selectedStyles.map(s => (
                  <button key={s} onClick={() => toggleStyle(s)} className="flex items-center gap-1.5 text-xs font-sans bg-lumen-bg border border-lumen-border px-3 py-1 hover:bg-lumen-border transition-colors">
                    {s} <X size={12} />
                  </button>
                ))}
                {selectedFinishes.map(f => (
                  <button key={f} onClick={() => toggleFinish(f)} className="flex items-center gap-1.5 text-xs font-sans bg-lumen-bg border border-lumen-border px-3 py-1 hover:bg-lumen-border transition-colors">
                    {f} <X size={12} />
                  </button>
                ))}
                {priceRange < MAX_PRICE && (
                  <button onClick={() => setPriceRange(MAX_PRICE)} className="flex items-center gap-1.5 text-xs font-sans bg-lumen-bg border border-lumen-border px-3 py-1 hover:bg-lumen-border transition-colors">
                    Under ${priceRange.toLocaleString()} <X size={12} />
                  </button>
                )}
                
                <button onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStyles([]);
                  setSelectedFinishes([]);
                  setPriceRange(MAX_PRICE);
                  setInStock(false);
                  setOutOfStock(false);
                }} className="text-xs font-sans text-lumen-muted hover:text-lumen-black underline ml-2">
                  Clear all
                </button>
              </div>
            )}

            {productsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem', paddingBottom: '5rem', gap: '1rem' }}>
                <Loader2 size={28} style={{ color: 'var(--color-lumen-gold)', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-lumen-muted)', fontFamily: 'var(--font-family-sans)' }}>Loading collection…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
                <p className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-lumen-muted)' }}>No products found</p>
                <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-sans)', color: 'var(--color-lumen-muted)', marginTop: '0.5rem' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div 
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                    : "flex flex-col"
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} layout={viewMode} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-lumen-border">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-lumen-black text-white disabled:opacity-30 disabled:bg-lumen-muted hover:bg-lumen-gold transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="flex items-center gap-4 text-sm font-sans">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={currentPage === i + 1 ? 'font-bold text-lumen-black' : 'text-lumen-muted hover:text-lumen-black'}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-lumen-black text-white disabled:opacity-30 disabled:bg-lumen-muted hover:bg-lumen-gold transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense 
      fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Loader2 size={32} style={{ color: 'var(--color-lumen-gold)', animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
