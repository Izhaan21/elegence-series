import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Care & Maintenance | Elegence Series',
  description: 'How to maintain the finish and beauty of your luxury lighting fixtures over time.',
};

export default function CarePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fcfbf9] min-h-screen text-lumen-black pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          
          <header className="mb-16 border-b border-lumen-border pb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-lumen-black mb-6">Care & Maintenance</h1>
            <p className="font-sans text-lumen-muted text-sm md:text-base leading-relaxed">
              Our fixtures are crafted from premium materials designed to age gracefully. Proper care will ensure your piece remains a stunning architectural focal point for decades.
            </p>
          </header>

          <article className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-h2:text-2xl">
            <h2>General Handling</h2>
            <p>
              Always turn off the power supply before cleaning or handling any lighting fixture. We strongly recommend wearing soft cotton gloves when adjusting or cleaning fixtures to prevent the transfer of natural oils from your skin onto the metal surfaces, which can accelerate unintended tarnishing.
            </p>

            <h2 className="mt-16">Solid Brass Finishes</h2>
            <p>
              We leave our brass finishes unlacquered so they can develop a rich, natural patina as they interact with the environment over time. This is a deliberate design choice that adds depth and character to the fixture.
            </p>
            <ul>
              <li><strong>Routine Cleaning:</strong> Lightly dust the surface using a soft, dry microfiber cloth or a delicate feather duster.</li>
              <li><strong>What to Avoid:</strong> Never use chemical cleaners, abrasive sponges, brass polish, or window cleaning solutions. These will strip the intentional finish and irreversibly damage the surface.</li>
            </ul>

            <h2 className="mt-16">Matte & Powder-Coated Finishes</h2>
            <p>
              Our matte black and powder-coated finishes are highly durable but require gentle care to maintain their velvety texture.
            </p>
            <ul>
              <li><strong>Routine Cleaning:</strong> Use a soft, dry microfiber cloth for regular dusting.</li>
              <li><strong>Deep Cleaning:</strong> If necessary, use a slightly damp cloth with mild, diluted soap. Immediately dry the surface with a clean cloth. Never leave moisture sitting on the finish.</li>
            </ul>

            <h2 className="mt-16">Hand-Blown Glass</h2>
            <p>
              The glass components of our fixtures are delicate and require careful handling.
            </p>
            <ul>
              <li><strong>Routine Cleaning:</strong> Remove the glass shades carefully (if applicable) and wash them in warm water with a mild dish soap. Dry completely with a lint-free cloth before reattaching.</li>
              <li><strong>In-Place Cleaning:</strong> If the glass cannot be removed, lightly spray a microfiber cloth (not the glass directly) with a gentle glass cleaner and wipe softly.</li>
            </ul>

            <h2 className="mt-16">LED Components</h2>
            <p>
              Our integrated LED optical systems are engineered for longevity and require zero maintenance. Do not attempt to open, clean, or modify the internal LED housing, as this will void your warranty and may damage the precision optics.
            </p>
          </article>

        </div>
      </main>
      <Footer />
    </>
  );
}
