import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Installation Guide | Elegence Series',
  description: 'General safety and installation guidelines for our architectural lighting.',
};

export default function InstallationPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen text-lumen-black pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          
          <header className="mb-16 border-b border-lumen-border pb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-lumen-black mb-6">Installation Guide</h1>
            <p className="font-sans text-lumen-muted text-sm md:text-base leading-relaxed">
              Proper installation is critical to both the safety of your space and the performance of your fixture. Please review these guidelines before unboxing your order.
            </p>
          </header>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-16">
            <h3 className="font-serif text-xl text-red-900 mb-2">Important Safety Notice</h3>
            <p className="font-sans text-sm text-red-800 leading-relaxed">
              <strong>All hardwired lighting fixtures must be installed by a licensed and qualified electrician.</strong> Improper installation can result in severe injury, fire, or damage to the fixture. Elegence Series is not liable for damages or injuries resulting from improper installation or failure to adhere to local building codes.
            </p>
          </div>

          <article className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-h2:text-2xl">
            <h2>Pre-Installation Checklist</h2>
            <ul>
              <li><strong>Inspect the Delivery:</strong> Carefully unbox your fixture immediately upon delivery. Ensure all components, including mounting hardware, glass shades, and drivers, are present and undamaged.</li>
              <li><strong>Verify Voltage:</strong> Ensure your local electrical supply matches the voltage specifications of the fixture (our standard drivers are 110V-240V compatible, but always verify the label).</li>
              <li><strong>Load Bearing:</strong> Heavy fixtures (such as large brass chandeliers) require structural support beyond a standard electrical junction box. Your electrician must ensure the ceiling joists or structural blocking can support the fixture's weight.</li>
            </ul>

            <h2 className="mt-16">Handling Instructions</h2>
            <p>
              Our artisan finishes are delicate before they are safely mounted out of reach.
            </p>
            <ul>
              <li>Do not remove the protective wrapping from the metal components until the fixture is fully mounted to the ceiling or wall.</li>
              <li>Always wear the provided soft cotton gloves when handling unlacquered brass or matte finishes to prevent permanent oil transfer from your skin.</li>
              <li>Never lift a pendant or chandelier by its electrical cord. Always support the weight from the main structural body or mounting canopy.</li>
            </ul>

            <h2 className="mt-16">Specific Fixture Guides</h2>
            <p>
              Detailed, fixture-specific wiring diagrams and mounting instructions are included inside the crating of every order. If your electrician has misplaced these documents, please contact our support team with your order number to request a digital copy.
            </p>

            <h2 className="mt-16">Dimmer Compatibility</h2>
            <p>
              Our integrated LED modules require specific ELV (Electronic Low Voltage) or TRIAC dimmers for smooth, flicker-free dimming. Connecting the fixture to an incompatible dimmer switch will damage the LED driver and void the warranty. Please consult the specification sheet included with your fixture for a list of approved dimmer models.
            </p>
          </article>

        </div>
      </main>
      <Footer />
    </>
  );
}
