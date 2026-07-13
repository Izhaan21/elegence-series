import Link from 'next/link';
import { Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'Chandeliers', href: '/shop?category=Chandeliers' },
        { label: 'Pendant Lights', href: '/shop?category=Pendants' },
        { label: 'Wall Sconces', href: '/shop?category=Wall Sconces' },
        { label: 'New Arrivals', href: '/shop' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'The Studio', href: '/about' },
        { label: 'Design Philosophy', href: '/philosophy' },
        { label: 'Craftsmanship', href: '/craftsmanship' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping & Returns', href: '/shipping' },
        { label: 'Care & Maintenance', href: '/care' },
        { label: 'Installation Guide', href: '/installation' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
  ];

  return (
    <footer className="bg-lumen-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4">
            <p className="font-serif text-2xl font-bold tracking-wider">Elegence Series</p>
            <p className="text-xs font-sans text-white/50 leading-relaxed max-w-[200px]">
              Architectural lighting designed to transform spaces into masterpieces of modern elegance.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" aria-label="Website" className="text-white/50 hover:text-lumen-gold transition-colors">
                <Globe size={16} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Share" className="text-white/50 hover:text-lumen-gold transition-colors">
                <Share2 size={16} strokeWidth={1.5} />
              </a>
              <a href="mailto:hello@elegenceseries.com" aria-label="Email" className="text-white/50 hover:text-lumen-gold transition-colors">
                <Mail size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/40 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-sans text-white/60 hover:text-lumen-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-[11px] font-sans text-white/30">
            © {currentYear} Elegence Series. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[11px] font-sans text-white/30 hover:text-lumen-gold/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[11px] font-sans text-white/30 hover:text-lumen-gold/60 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
