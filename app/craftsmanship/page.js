import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Craftsmanship | Elegence Series',
  description: 'The meticulous artisan process behind every Elegence Series fixture.',
};

export default function CraftsmanshipPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fcfbf9] min-h-screen text-lumen-black pt-24">
        {/* HERO */}
        <section className="relative w-full h-[60vh] flex flex-col justify-center items-center text-center px-4">
          <div className="absolute inset-0 z-0">
            <img 
              src="/product-obsidian.jpg" 
              alt="Artisan Craftsmanship" 
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fadeIn bg-white/80 backdrop-blur-md p-12 md:p-20 shadow-sm border border-lumen-border">
            <p className="text-xs font-sans tracking-[0.3em] uppercase mb-4 text-lumen-gold">The Process</p>
            <h1 className="font-serif text-4xl md:text-6xl text-lumen-black leading-tight mb-6">
              Meticulous Execution
            </h1>
            <p className="font-sans text-lumen-muted max-w-lg text-sm md:text-base leading-relaxed">
              We reject mass manufacturing. Every piece that leaves our studio is handled by human hands, ensuring a level of detail that machines simply cannot replicate.
            </p>
          </div>
        </section>

        {/* MATERIALS GRID */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-lumen-black mb-4">Raw Materials</h2>
            <div className="w-12 h-[1px] bg-lumen-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Material 1 */}
            <div className="group">
              <div className="w-full h-80 overflow-hidden mb-6 bg-lumen-gray rounded-sm">
                <img src="/cat-pendants.jpg" alt="Solid Brass" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="font-serif text-2xl mb-3">Solid Brass</h3>
              <p className="font-sans text-sm text-lumen-muted leading-relaxed">
                Our fixtures utilize heavy-gauge solid brass, milled and hand-polished to perfection. Over time, the brass develops a unique patina, telling the story of the space it inhabits. We never use cheap plating or hollow components.
              </p>
            </div>

            {/* Material 2 */}
            <div className="group">
              <div className="w-full h-80 overflow-hidden mb-6 bg-lumen-gray rounded-sm">
                <img src="/cat-chandeliers.jpg" alt="Artisan Glass" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="font-serif text-2xl mb-3">Hand-Blown Glass</h3>
              <p className="font-sans text-sm text-lumen-muted leading-relaxed">
                The glass elements of our chandeliers and pendants are mouth-blown by master glassmakers. Small imperfections and microscopic bubbles are not flaws—they are the signature of authentic, non-mechanized craftsmanship.
              </p>
            </div>

            {/* Material 3 */}
            <div className="group">
              <div className="w-full h-80 overflow-hidden mb-6 bg-lumen-gray rounded-sm">
                <img src="/product-deco.jpg" alt="Precision Optics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="font-serif text-2xl mb-3">Precision Optics</h3>
              <p className="font-sans text-sm text-lumen-muted leading-relaxed">
                Beneath the antique finishes lies cutting-edge optical engineering. We utilize high-CRI, flicker-free LED components that perfectly mimic the warmth of incandescent light, ensuring the atmosphere is never compromised.
              </p>
            </div>

          </div>
        </section>

        {/* QUALITY BANNER */}
        <section className="w-full bg-lumen-black text-white py-32 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">Uncompromising Standards</h2>
            <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed mb-12">
              Before a fixture is crated for worldwide delivery, it undergoes a rigorous 48-hour burn-in test. Every joint is inspected, every finish is buffed, and every driver is calibrated. We sign off on perfection, or we do not ship it.
            </p>
            <Link href="/shop" className="inline-block px-10 py-3 border border-white hover:bg-white hover:text-lumen-black transition-colors duration-300 font-sans tracking-[0.2em] uppercase text-xs">
              View Our Work
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
