'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const categoriesRow1 = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Chandeliers', href: '/shop?category=Chandeliers' },
    { label: 'Pendants', href: '/shop?category=Pendants' },
    { label: 'Wall Lights', href: '/shop?category=Wall Lights' },
    { label: 'Floor Lamps', href: '/shop?category=Floor Lamps' },
    { label: 'Table Lamps', href: '/shop?category=Table Lamps' },
    { label: 'Outdoor Lighting', href: '/shop?category=Outdoor Lighting' },
  ];

  const categoriesRow2 = [
    { label: 'Collections', href: '/collections' },
    { label: 'Architectural Lights', href: '/shop?category=Architectural Lights' },
    { label: 'Wall Sconces', href: '/shop?category=Wall Sconces' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        {/* Main Navbar with Glassmorphism */}
        <div className="bg-lumen-bg/95 backdrop-blur-md border-b border-lumen-border relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 min-h-[90px]">
              
              {/* Logo — Left */}
              <Link
                href="/"
                className="font-serif text-2xl font-bold tracking-[0.05em] text-lumen-black whitespace-nowrap flex-shrink-0"
              >
                Elegence Series
              </Link>

              {/* Desktop Nav Links — Center (Two Rows) */}
              <nav className="hidden xl:flex flex-col items-center justify-center gap-3 flex-1 px-8">
                {/* Top Row */}
                <div className="flex items-center gap-7">
                  {categoriesRow1.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-lumen-black hover:text-lumen-gold transition-colors duration-150"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
                {/* Bottom Row */}
                <div className="flex items-center gap-7">
                  {categoriesRow2.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-lumen-black hover:text-lumen-gold transition-colors duration-150"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Icons — Right */}
              <div className="flex items-center gap-6 ml-auto flex-shrink-0">
                <button
                  aria-label="Search"
                  className="text-lumen-black hover:text-lumen-gold transition-colors duration-150"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>

                <Link
                  href="/admin/login"
                  aria-label="Account"
                  className="text-lumen-black hover:text-lumen-gold transition-colors duration-150 hidden md:block"
                >
                  <User size={20} strokeWidth={1.5} />
                </Link>

                <button
                  aria-label="Cart"
                  onClick={() => setCartOpen(true)}
                  className="relative text-lumen-black hover:text-lumen-gold transition-colors duration-150"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </button>

                {/* Mobile menu toggle */}
                <button
                  className="xl:hidden text-lumen-black ml-2"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Menu"
                >
                  {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="xl:hidden bg-lumen-white border-t border-lumen-border animate-fadeIn absolute top-full left-0 right-0 shadow-lg max-h-[70vh] overflow-y-auto">
              <nav className="flex flex-col px-6 py-6 gap-6">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-lumen-muted">Main</span>
                  {categoriesRow1.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs font-sans font-medium tracking-[0.1em] uppercase text-lumen-black hover:text-lumen-gold transition-colors pl-2"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
                
                <div className="flex flex-col gap-4 pt-4 border-t border-lumen-border">
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-lumen-muted">More</span>
                  {categoriesRow2.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs font-sans font-medium tracking-[0.1em] uppercase text-lumen-black hover:text-lumen-gold transition-colors pl-2"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for fixed header (Navbar height has increased) */}
      <div className="h-[90px]" />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
