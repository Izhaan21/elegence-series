import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Journal | Elegence Series',
  description: 'Editorial insights, architectural trends, and the philosophy of lighting.',
};

export default function JournalPage() {
  const articles = [
    {
      id: 1,
      title: 'Curating the Perfect Dining Room Atmosphere',
      category: 'Interior Design',
      date: 'OCTOBER 12',
      image: '/hero-chandelier.jpg',
      excerpt: 'How the suspension height and color temperature of a centerpiece chandelier dictate the intimacy of an entire evening.'
    },
    {
      id: 2,
      title: 'The Evolution of Minimalist Architectural Lighting',
      category: 'Design Philosophy',
      date: 'SEPTEMBER 28',
      image: '/col-modern-luxe.png',
      excerpt: 'Tracing the shift from ornamental focal points to integrated, geometric light sculptures in modern spaces.'
    },
    {
      id: 3,
      title: 'Brass in its Natural State: Embracing Patina',
      category: 'Craftsmanship',
      date: 'AUGUST 04',
      image: '/product-aurelia.jpg',
      excerpt: 'Why we refuse to use synthetic clear coats on our fixtures, allowing raw brass to age beautifully alongside the architecture.'
    },
    {
      id: 4,
      title: 'Landscape Illumination: Erasing the Boundaries',
      category: 'Outdoor Architecture',
      date: 'JULY 19',
      image: '/cat-outdoor-lighting.png',
      excerpt: 'Techniques for using low-glare pathway and facade lighting to pull the interior warmth outward into the night.'
    }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-[#fcfbf9] min-h-screen pt-32 pb-24">
        
        {/* HEADER */}
        <header className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-7xl text-lumen-black mb-6">Journal</h1>
          <p className="font-sans text-lumen-muted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Notes, observations, and deep dives into the world of luxury lighting, architectural integration, and artisanal manufacturing.
          </p>
        </header>

        {/* ARTICLES GRID */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {articles.map((article, index) => (
              <article key={article.id} className="group cursor-pointer">
                {/* Image Wrapper */}
                <div className="w-full aspect-[4/3] overflow-hidden mb-6 rounded-sm bg-lumen-gray relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-lumen-black/0 group-hover:bg-lumen-black/10 transition-colors duration-500" />
                </div>
                
                {/* Meta */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-lumen-gold">
                    {article.category}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-lumen-muted/40" />
                  <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-lumen-muted">
                    {article.date}
                  </span>
                </div>

                {/* Content */}
                <h2 className="font-serif text-2xl md:text-3xl text-lumen-black mb-4 group-hover:text-lumen-gold transition-colors duration-300">
                  {article.title}
                </h2>
                <p className="font-sans text-lumen-muted text-sm leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                
                {/* Read More Link (Decorative for now) */}
                <div className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase text-lumen-black group-hover:text-lumen-gold transition-colors duration-300">
                  Read Article
                  <span className="w-4 h-[1px] bg-currentColor transform origin-left transition-transform duration-300 group-hover:scale-x-150" />
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
