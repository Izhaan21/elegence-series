import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import { ArrowRight, Star, Shield, Truck, Phone, Home, Sun, Fan, Lamp, Lightbulb, LayoutGrid } from 'lucide-react';
import { getProducts } from '@/lib/firestore';

const CIRCULAR_CATEGORIES = [
  { label: 'All Products', icon: LayoutGrid, image: '/col-minimalist.png', href: '/shop' },
  { label: 'Chandeliers', icon: Home, image: '/cat-chandeliers.jpg', href: '/shop?category=Chandeliers' },
  { label: 'Wall Sconces', icon: Sun, image: '/cat-wall-sconces.png', href: '/shop?category=Wall Sconces' },
  { label: 'Floor Lamps', icon: Lamp, image: '/cat-floor-lamps.png', href: '/shop?category=Floor Lamps' },
  { label: 'Architectural', icon: Lightbulb, image: '/cat-architectural-lights.png', href: '/shop?category=Architectural Lights' },
  { label: 'Outdoor', icon: Star, image: '/cat-outdoor-lighting.png', href: '/shop?category=Outdoor Lighting' },
];

const CATEGORIES = [
  {
    label: 'Crystal Chandeliers',
    sub: 'Explore',
    href: '/shop?category=Chandeliers',
    image: '/cat-chandeliers.jpg',
    size: 'large',
  },
  {
    label: 'Luxury Pendants',
    sub: 'Shop Now',
    href: '/shop?category=Pendants',
    image: '/cat-pendants.jpg',
    size: 'small',
  },
  {
    label: 'Wall Lights',
    sub: 'Shop Now',
    href: '/shop?category=Wall Lights',
    image: '/cat-wall-lights.jpg',
    size: 'small',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    title: 'Interior Designer, NYC',
    quote:
      "The Aurelia transformed our client's penthouse. Exceptional quality and the shipping was perfectly handled — arrived without a scratch.",
    rating: 5,
  },
  {
    name: 'James L.',
    title: 'Hotel Developer, London',
    quote:
      "We've outfitted three boutique hotels with Elegence Series pieces. The trade program is brilliant and delivery to the UK was seamless.",
    rating: 5,
  },
  {
    name: 'Elena R.',
    title: 'Homeowner, Sydney',
    quote:
      "I was nervous ordering internationally, but the process was flawless. The chandelier exceeded every expectation.",
    rating: 5,
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Free Insured Shipping',
    desc: 'Every order ships fully insured to 40+ countries worldwide.',
  },
  {
    icon: Star,
    title: 'Artisan Craftsmanship',
    desc: 'Each piece is hand-finished by master craftsmen with decades of experience.',
  },
  {
    icon: Truck,
    title: 'White-Glove Delivery',
    desc: 'Fragile pieces are crated and delivered with full care and handling.',
  },
  {
    icon: Phone,
    title: 'Expert Consultation',
    desc: 'Our lighting specialists are available to help you select the perfect piece.',
  },
];

export const metadata = {
  title: 'Elegence Series — Luxury Chandeliers & Pendants',
  description:
    'Discover meticulously curated architectural lighting designed to transform spaces into masterpieces of modern elegance. Free insured international shipping.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let mixedProducts = [];
  let chandelierProducts = [];
  let pendantProducts = [];
  
  // Dynamic images
  let heroImages = [];
  let categoryImages = {};
  let featuredCollectionProduct = null;
  let shuffledProducts = [];

  try {
    const allProducts = await getProducts({ limitCount: 100 });
    
    // Randomize array helper
    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());
    shuffledProducts = shuffle(allProducts);

    // 1. Hero Images (Pick 5 random product images)
    heroImages = shuffledProducts
      .map(p => p.images?.[0])
      .filter(Boolean)
      .slice(0, 5);

    // 2. Category Images
    const categoriesToFind = ['Chandeliers', 'Wall Lights', 'Floor Lamps', 'Architectural Lights', 'Outdoor Lighting'];
    categoriesToFind.forEach(cat => {
      const match = shuffledProducts.find(p => p.category === cat && p.images?.[0]);
      if (match) {
        categoryImages[cat] = match.images[0];
      }
    });

    // 3. Featured Collection Image (Modern Luxe = Modern style)
    const modernProduct = shuffledProducts.find(p => p.style === 'Modern Luxe' || p.style === 'Modern');
    if (modernProduct && modernProduct.images?.[0]) {
      featuredCollectionProduct = modernProduct;
    }

    // Existing fetches...
    mixedProducts = await getProducts({ featured: true, limitCount: 8 });
    if (mixedProducts.length === 0) {
      mixedProducts = await getProducts({ limitCount: 8 });
    }

    chandelierProducts = await getProducts({ category: 'Chandeliers', limitCount: 4 });
    pendantProducts = await getProducts({ category: 'Pendants', limitCount: 4 });

  } catch (err) {
    console.error('Failed to load products for homepage:', err);
  }

  // Inject dynamic images into CIRCULAR_CATEGORIES
  const dynamicCircularCategories = CIRCULAR_CATEGORIES.map(cat => {
    // If it's "All Products", use a random image from the entire shop
    if (cat.label === 'All Products') {
      return { ...cat, image: heroImages[Math.floor(Math.random() * heroImages.length)] || cat.image };
    }
    
    // Match by href category param, or label
    let dbCategory = null;
    if (cat.label === 'Architectural') dbCategory = 'Architectural Lights';
    else if (cat.label === 'Outdoor') dbCategory = 'Outdoor Lighting';
    else if (cat.label === 'Wall Sconces') dbCategory = 'Wall Lights';
    else dbCategory = cat.label;

    let finalImage = cat.image;

    // Get all unique images for this category from the database
    const categoryProducts = shuffledProducts.filter(p => p.category === dbCategory && p.images?.[0]);
    const dbImages = [...new Set(categoryProducts.map(p => p.images[0]))];

    if (dbImages.length > 1) {
      // If DB has actual variety, pick a random one!
      finalImage = dbImages[Math.floor(Math.random() * dbImages.length)];
    } else {
      // If DB lacks variety (e.g. only 1 image seeded for Floor Lamps), force a shuffle using local assets
      const fakes = {
        'Wall Lights': ['/cat-wall-sconces.png', '/cat-wall-lights.jpg', '/product-deco.jpg'],
        'Floor Lamps': ['/cat-floor-lamps.png'],
        'Architectural Lights': ['/cat-architectural-lights.png'],
        'Outdoor Lighting': ['/cat-outdoor-lighting.png'],
        'Chandeliers': ['/cat-chandeliers.jpg', '/product-aurelia.jpg', '/hero-chandelier.jpg']
      };
      
      const options = fakes[dbCategory];
      if (options && options.length > 0) {
        finalImage = options[Math.floor(Math.random() * options.length)];
      } else if (dbImages.length === 1) {
        finalImage = dbImages[0];
      }
    }

    return {
      ...cat,
      image: finalImage
    };
  });

  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <HeroCarousel images={heroImages.length > 0 ? heroImages : undefined} />

        {/* ── SHOP BY CATEGORY (INTERACTIVE ACCORDION) ────────────────────────────── */}
        <section className="section-container py-24 max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl">Shop by Category</h2>
            <p className="font-sans text-sm text-lumen-muted tracking-wider uppercase mt-4">Discover Our Collections</p>
          </div>

          <div className="flex flex-col md:flex-row w-full h-[75vh] min-h-[600px] gap-2">
            {dynamicCircularCategories.map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <Link 
                  key={cat.label} 
                  href={cat.href} 
                  className="relative flex-1 group transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4] overflow-hidden bg-lumen-black cursor-pointer rounded-xl"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.label} 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-black/40 md:group-hover:bg-gradient-to-t opacity-100 transition-all duration-700" />
                  
                  <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end items-center">
                     <div className="relative h-12 flex items-center justify-center w-full">
                       
                       {/* Desktop Collapsed view text */}
                       <span className="absolute font-sans text-white/70 text-xs tracking-[0.3em] uppercase whitespace-nowrap -rotate-90 origin-center transition-opacity duration-300 group-hover:opacity-0 hidden md:block" style={{ bottom: '120px' }}>
                         {cat.label}
                       </span>
                       
                       {/* Expanded view content (Always visible on mobile) */}
                       <div className="absolute flex flex-col items-center opacity-100 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-75 w-full">
                         <IconComp className="text-lumen-gold w-6 h-6 mb-3 drop-shadow-md" strokeWidth={1.5} />
                         <h3 className="font-serif text-white text-2xl lg:text-3xl text-center whitespace-nowrap drop-shadow-md">
                           {cat.label}
                         </h3>
                       </div>
                       
                     </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── FEATURED COLLECTIONS BANNER ────────────────────────────── */}
        <section className="px-6 lg:px-8 py-10 max-w-7xl mx-auto">
          <div className="relative w-full h-auto md:h-[500px] overflow-hidden rounded-2xl group flex flex-col md:flex-row bg-[#111111] shadow-2xl">
            
            {/* Text Content Half */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-16 z-20 order-2 md:order-1">
              <p className="text-xs font-sans tracking-[0.3em] uppercase mb-4 text-lumen-gold">Digital Showroom</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 text-white leading-tight">Curated Collections</h2>
              <div className="w-12 h-[2px] bg-lumen-gold mb-6" />
              <p className="font-sans text-sm md:text-base text-white/70 font-light mb-10 leading-relaxed max-w-md">
                Explore lighting fixtures grouped by aesthetic and mood. From Modern Luxe to Heritage Rustic, find the perfect pieces that speak to your design language.
              </p>
              <Link href="/collections" className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-lumen-gold text-lumen-gold hover:bg-lumen-gold hover:text-white transition-colors duration-300 font-sans text-xs tracking-[0.15em] uppercase w-fit">
                Explore Collections <ArrowRight size={14} />
              </Link>
            </div>

            {/* Image Half */}
            <Link 
              href={featuredCollectionProduct ? `/shop/${featuredCollectionProduct.slug}` : '/collections'}
              className="w-full h-[350px] md:h-full md:w-1/2 relative overflow-hidden order-1 md:order-2 block cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-1000 group-hover:bg-transparent" />
              <img 
                src={featuredCollectionProduct?.images?.[0] || "/col-modern-luxe.png"} 
                alt={featuredCollectionProduct?.name || "The Modern Luxe Collection"} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Gradient Fade connecting text and image */}
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#111111] via-[#111111]/50 to-transparent w-32 z-20 hidden md:block pointer-events-none" />
            </Link>

          </div>
        </section>

        {/* ── TRENDING COLLECTION (MIXED PRODUCTS) ────────────────────────────── */}
        <section className="section-container pb-20 border-b border-lumen-border">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-lumen-muted mb-2">
                Discover
              </p>
              <h2 className="font-serif text-3xl">Trending Collection</h2>
            </div>
            <Link href="/shop" className="btn-ghost">
              Shop All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mixedProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--color-lumen-muted)' }}>
                <p style={{ fontFamily: 'var(--font-family-serif)', fontSize: '1.5rem' }}>No products yet</p>
              </div>
            ) : mixedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── SPOTLIGHT: CHANDELIERS ────────────────────────────── */}
        {chandelierProducts.length > 0 && (
          <section className="section-container py-20 border-b border-lumen-border">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-lumen-muted mb-2">
                  Category Spotlight
                </p>
                <h2 className="font-serif text-3xl">Crystal Chandeliers</h2>
              </div>
              <Link href="/shop?category=Chandeliers" className="btn-ghost">
                Shop Chandeliers <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {chandelierProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* ── SPOTLIGHT: PENDANTS ────────────────────────────── */}
        {pendantProducts.length > 0 && (
          <section className="section-container py-20 border-b border-lumen-border">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-lumen-muted mb-2">
                  Category Spotlight
                </p>
                <h2 className="font-serif text-3xl">Luxury Pendants</h2>
              </div>
              <Link href="/shop?category=Pendants" className="btn-ghost">
                Shop Pendants <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pendantProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* ── WHY LUMEN ────────────────────────────────────── */}
        <section className="bg-lumen-white py-20">
          <div className="section-container">
            <div className="text-center mb-12">
              <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-lumen-muted mb-3">
                The Elegence Series Promise
              </p>
              <h2 className="font-serif text-3xl">Why Choose Elegence Series</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {WHY_US.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 border border-lumen-border rounded-full mb-2">
                    <Icon size={20} strokeWidth={1.5} className="text-lumen-gold" />
                  </div>
                  <h3 className="font-serif text-lg">{title}</h3>
                  <p className="text-xs font-sans text-lumen-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GOOGLE REVIEWS ─────────────────────────────────── */}
        <GoogleReviewsCarousel />

        {/* ── CTA BANNER ───────────────────────────────────── */}
        <section className="bg-lumen-black py-20 text-center">
          <div className="section-container">
            <h2 className="font-serif text-white text-4xl font-light mb-4">
              Ready to Illuminate Your Space?
            </h2>
            <p className="text-white/60 font-sans text-sm mb-10 max-w-md mx-auto">
              Browse our complete collection and find the perfect piece for your architectural vision.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-lumen-black text-[11px] font-sans font-medium tracking-[0.2em] uppercase px-10 py-4 hover:bg-lumen-gold hover:text-white transition-colors duration-200"
            >
              Shop Collection <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
