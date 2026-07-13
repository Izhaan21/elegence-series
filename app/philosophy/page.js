import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Design Philosophy | Elegence Series',
  description: 'Exploring the interplay of shadow and light, and the minimalist aesthetic that defines our studio.',
};

export default function PhilosophyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-lumen-black min-h-screen text-white pt-24">
        {/* HERO */}
        <section className="relative w-full h-[70vh] flex flex-col justify-center px-6 lg:px-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="/col-minimalist.png" 
              alt="Design Philosophy" 
              className="w-full h-full object-cover opacity-30 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-lumen-black via-lumen-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-3xl animate-fadeIn">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8">
              Light as <br /> Material
            </h1>
            <p className="font-sans text-white/70 max-w-xl text-lg md:text-xl font-light leading-relaxed">
              We approach illumination not as a utility, but as a tangible architectural material that shapes mood, perception, and spatial boundaries.
            </p>
          </div>
        </section>

        {/* PILLARS */}
        <section className="py-24 md:py-32 px-6 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {/* Pillar 1 */}
            <div className="space-y-6">
              <span className="text-lumen-gold font-sans tracking-[0.3em] uppercase text-xs">01. Reduction</span>
              <h3 className="font-serif text-3xl">Subtractive Design</h3>
              <p className="font-sans text-white/60 text-sm leading-relaxed">
                True luxury lies in what is omitted. We strip away the superfluous, reducing fixtures down to their absolute geometric essence. Every line, curve, and shadow serves a distinct structural purpose.
              </p>
            </div>
            
            {/* Pillar 2 */}
            <div className="space-y-6">
              <span className="text-lumen-gold font-sans tracking-[0.3em] uppercase text-xs">02. Atmosphere</span>
              <h3 className="font-serif text-3xl">Curated Shadows</h3>
              <p className="font-sans text-white/60 text-sm leading-relaxed">
                A brilliant light is meaningless without the shadow it casts. We engineer our fixtures to direct, diffuse, and sculpt light, creating environments that feel intimate, dramatic, and intentionally calm.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-6">
              <span className="text-lumen-gold font-sans tracking-[0.3em] uppercase text-xs">03. Permanence</span>
              <h3 className="font-serif text-3xl">Timeless Context</h3>
              <p className="font-sans text-white/60 text-sm leading-relaxed">
                We ignore fleeting design trends. By grounding our aesthetic in classic architectural proportions, we create pieces that feel simultaneously ancient and fiercely contemporary—designed to outlast the spaces they inhabit.
              </p>
            </div>
          </div>
        </section>

        {/* LARGE IMAGE BREAK */}
        <section className="w-full h-[60vh] relative">
          <img src="/cat-architectural-lights.png" alt="Architectural integration" className="w-full h-full object-cover grayscale opacity-80" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white opacity-90 tracking-wider">
              Form Follows Feeling.
            </h2>
          </div>
        </section>
        
        {/* CALL TO ACTION */}
        <section className="py-24 text-center">
          <Link href="/shop" className="inline-block px-12 py-4 border border-lumen-gold text-lumen-gold hover:bg-lumen-gold hover:text-lumen-black transition-colors duration-500 font-sans tracking-[0.2em] uppercase text-sm">
            Explore The Collection
          </Link>
        </section>

      </main>
      <Footer />
    </>
  );
}
