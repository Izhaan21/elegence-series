import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping & Returns | Elegence Series',
  description: 'Worldwide insured shipping and our 30-day return policy.',
};

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen text-lumen-black pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          
          <header className="mb-16 border-b border-lumen-border pb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-lumen-black mb-6">Shipping & Returns</h1>
            <p className="font-sans text-lumen-muted text-sm md:text-base leading-relaxed">
              We proudly offer comprehensive worldwide shipping and a seamless return process for all of our architectural lighting fixtures.
            </p>
          </header>

          <article className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-h2:text-2xl prose-a:text-lumen-gold prose-a:no-underline hover:prose-a:underline">
            <h2>Worldwide Insured Shipping</h2>
            <p>
              Due to the delicate nature of our artisan lighting, we partner exclusively with premium logistics providers. Every single package dispatched from our studio is fully insured against damage or loss during transit.
            </p>
            <ul>
              <li><strong>Standard International (5-10 Business Days):</strong> Complimentary on all orders over $1,500.</li>
              <li><strong>Express Courier (2-4 Business Days):</strong> Available at checkout for time-sensitive projects.</li>
            </ul>
            <p>
              Once your order has been carefully crated and dispatched, you will receive an email containing a secure tracking link. Please note that custom and made-to-order fixtures require a lead time of 4-6 weeks before shipping.
            </p>

            <h2 className="mt-16">International Duties & Taxes</h2>
            <p>
              For orders placed outside of our manufacturing region, your local customs authority may apply import duties and taxes. These charges are out of our control and are the responsibility of the client.
            </p>

            <h2 className="mt-16">30-Day Return Policy</h2>
            <p>
              We stand behind the craftsmanship of every piece we produce. If you are not entirely satisfied with your purchase, you may initiate a return within 30 days of delivery.
            </p>
            <p>To qualify for a full refund, the fixture must be:</p>
            <ul>
              <li>Uninstalled and unused.</li>
              <li>In its original, pristine condition.</li>
              <li>Repacked in the original custom crating with all protective materials intact.</li>
            </ul>
            <p>
              <em>Note: Custom orders and modified fixtures are strictly final sale.</em>
            </p>

            <h2 className="mt-16">Initiating a Return</h2>
            <p>
              Please contact our client service team via our <Link href="/contact">Contact Page</Link> with your order number. We will provide you with a Return Merchandise Authorization (RMA) number and detailed instructions on how to safely return the fixture to our studio. 
            </p>
            <p>
              The client is responsible for return shipping costs, and we strongly advise using an insured courier, as we cannot be held liable for damages incurred during the return transit.
            </p>
          </article>

        </div>
      </main>
      <Footer />
    </>
  );
}
