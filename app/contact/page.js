import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us | Elegence Series',
  description: 'Get in touch with our client service team.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fcfbf9] min-h-screen text-lumen-black pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <header className="text-center mb-16">
            <p className="text-xs font-sans tracking-[0.3em] uppercase mb-4 text-lumen-gold">Client Support</p>
            <h1 className="font-serif text-4xl md:text-6xl text-lumen-black leading-tight mb-6">Contact Us</h1>
            <p className="font-sans text-lumen-muted max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Our dedicated client service team is available to assist you with product inquiries, customization requests, and order support.
            </p>
          </header>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-lumen-border">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-sans text-xs tracking-wider uppercase mb-2">Name</label>
                  <input type="text" id="name" className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-sans text-xs tracking-wider uppercase mb-2">Email</label>
                  <input type="email" id="email" className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors" placeholder="your@email.com" />
                </div>
              </div>
              
              <div>
                <label htmlFor="inquiry" className="block font-sans text-xs tracking-wider uppercase mb-2">Subject</label>
                <select id="inquiry" className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors">
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Trade & Partnerships</option>
                  <option>Custom Projects</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-sans text-xs tracking-wider uppercase mb-2">Message</label>
                <textarea id="message" rows="5" className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <div className="pt-4">
                <button type="button" className="w-full bg-lumen-black text-white py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-lumen-gold transition-colors duration-300">
                  Send Message
                </button>
              </div>
              
              <p className="text-center font-sans text-xs text-lumen-muted mt-6">
                We aim to respond to all inquiries within 24 hours. For immediate assistance, you may also email us at <a href="mailto:hello@elegenceseries.com" className="text-lumen-black border-b border-lumen-black">hello@elegenceseries.com</a>.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
