import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'The Studio | Elegence Series',
  description: 'An international collective of designers dedicated to the art of illumination.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-lumen-gray min-h-screen pt-24">
        {/* HERO */}
        <section className="relative w-full h-[60vh] md:h-[80vh] flex flex-col justify-center items-center text-center px-4">
          <div className="absolute inset-0 z-0">
            <img 
              src="/col-modern-luxe.png" 
              alt="The Studio" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-lumen-gray via-transparent to-lumen-gray opacity-90" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fadeIn">
            <p className="text-xs font-sans tracking-[0.3em] uppercase mb-6 text-lumen-muted">The Studio</p>
            <h1 className="font-serif text-5xl md:text-7xl text-lumen-black leading-tight mb-8">
              Masters of Illumination
            </h1>
            <p className="font-sans text-lumen-muted max-w-2xl text-sm md:text-base leading-relaxed">
              We are an anonymous international collective of lighting designers, architects, and artisans bound by a singular obsession: transforming physical spaces into masterpieces through the manipulation of light.
            </p>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="section-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="/col-heritage.png" 
                alt="Studio Process" 
                className="w-full h-auto aspect-[3/4] object-cover rounded-sm shadow-xl"
              />
            </div>
            <div className="flex flex-col justify-center order-1 md:order-2">
              <h2 className="font-serif text-3xl md:text-4xl text-lumen-black mb-8 leading-tight">
                Beyond the Bulb
              </h2>
              <div className="space-y-6 font-sans text-lumen-muted text-sm md:text-base leading-relaxed">
                <p>
                  At Elegence Series, we do not simply manufacture light fixtures. We craft atmospheric anchors. A room is merely a geometric space until light touches it; only then does it become an experience.
                </p>
                <p>
                  Operating independently from the massive corporate conglomerates that dominate the industry, our studio moves with agility and pure creative freedom. We source our materials globally—from the marble quarries of Carrara to the brass foundries of Europe—ensuring every piece meets our exacting standards.
                </p>
                <p>
                  We remain anonymous intentionally. Our identity is our work. When you purchase an Elegence Series piece, you are not buying a brand name; you are acquiring an artifact of unparalleled design.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
