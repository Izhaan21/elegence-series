import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Curated Collections - Elegence Series',
  description: 'Explore our curated lighting collections grouped by aesthetic and mood.',
};

const COLLECTIONS = [
  {
    id: 'modern-luxe',
    title: 'The Modern Luxe Collection',
    description: 'Characterized by sleek lines, high contrast, and opulent finishes. This collection brings a dramatic, contemporary elegance to any luxury space.',
    image: '/col-modern-luxe.png',
    href: '/shop?style=Modern',
    alignment: 'left',
  },
  {
    id: 'minimalist-series',
    title: 'The Minimalist Series',
    description: 'Clean, airy, and unobtrusive. The Minimalist Series focuses on pure geometric forms and subtle, flawless illumination for uncluttered environments.',
    image: '/col-minimalist.png',
    href: '/shop?style=Minimalist',
    alignment: 'right',
  },
  {
    id: 'heritage-collection',
    title: 'The Heritage Collection',
    description: 'Rustic warmth meets grand proportions. Featuring rich textures, aged bronzes, and traditional silhouettes that command attention in any grand dining or living area.',
    image: '/col-heritage.png',
    href: '/shop?style=Traditional', // Or Rustic depending on the DB tags, but traditional works.
    alignment: 'left',
  }
];

export default async function CollectionsPage() {
  let allProducts = [];
  try {
    allProducts = await getProducts({ limitCount: 100 });
  } catch (err) {
    console.error('Failed to load products for collections page:', err);
  }

  const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());
  const shuffledProducts = shuffle(allProducts);

  const dynamicCollections = COLLECTIONS.map(col => {
    let styleToFind = [];
    if (col.id === 'modern-luxe') styleToFind = ['Modern', 'Modern Luxe'];
    else if (col.id === 'minimalist-series') styleToFind = ['Minimalist'];
    else if (col.id === 'heritage-collection') styleToFind = ['Traditional', 'Rustic', 'Vintage'];
    
    let dynImage = null;
    if (styleToFind.length > 0) {
       const match = shuffledProducts.find(p => styleToFind.includes(p.style) && p.images?.[0]);
       if (match) {
         dynImage = match.images[0];
       }
    }
    return { ...col, productImage: dynImage };
  });

  return (
    <>
      <Navbar />

      <main className="pt-[90px] min-h-screen bg-lumen-bg">
        {/* Header */}
        <section className="text-center py-24 px-6">
          <p className="text-xs font-sans tracking-[0.3em] uppercase text-lumen-muted mb-4">Digital Showroom</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-lumen-black mb-6">Curated Collections</h1>
          <p className="font-sans text-lumen-muted max-w-2xl mx-auto leading-relaxed">
            Discover lighting fixtures grouped by design language and architectural intent. Find the perfect pieces that resonate with your space.
          </p>
        </section>

        {/* Collections Feed */}
        <section className="flex flex-col gap-16 pb-32 max-w-[1400px] mx-auto px-6">
          {dynamicCollections.map((collection, index) => {
            const isRight = collection.alignment === 'right';
            return (
              <div key={collection.id} className="relative w-full h-auto md:h-[70vh] flex flex-col md:flex-row group overflow-hidden bg-[#111111] rounded-2xl shadow-2xl">
                
                {/* Text Half */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center p-12 lg:p-24 z-10 ${isRight ? 'md:order-2' : 'md:order-1'}`}>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">{collection.title}</h2>
                  <div className="w-16 h-[2px] bg-lumen-gold mb-8" />
                  <p className="font-sans text-white/70 mb-12 leading-relaxed text-sm md:text-base max-w-md">
                    {collection.description}
                  </p>
                  <Link href={collection.href} className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-lumen-gold text-lumen-gold hover:bg-lumen-gold hover:text-white transition-colors duration-300 font-sans text-xs tracking-[0.15em] uppercase w-fit">
                    Explore Collection <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Image Half */}
                <div className={`w-full h-[400px] md:h-full md:w-1/2 relative overflow-hidden ${isRight ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-1000 group-hover:bg-transparent" />
                  <img 
                    src={collection.productImage || collection.image} 
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  {/* Gradient Fade connecting text and image */}
                  <div className={`absolute inset-y-0 ${isRight ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-[#111111] via-[#111111]/50 to-transparent w-32 z-20 hidden md:block`} />
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}
