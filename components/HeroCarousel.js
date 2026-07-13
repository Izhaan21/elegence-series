'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const HERO_IMAGES = [
  '/hero-chandelier.jpg',
  '/cat-chandeliers.jpg',
  '/product-obsidian.jpg',
  '/cat-pendants.jpg',
  '/cat-wall-lights.jpg'
];

export default function HeroCarousel({ images = HERO_IMAGES }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Auto-change image every 3 seconds
    return () => clearInterval(timer);
  }, [images]);

  return (
    <section className="relative w-full flex flex-col" style={{ height: 'calc(100vh - 80px)', minHeight: '600px' }}>
      
      {/* Main Hero Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Background Images with Crossfade */}
        {images && images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Elegence Series hero ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {/* Subtle Overlay Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-0" />
        
        {/* Text Box floating on top left */}
        <div className="absolute top-0 left-0 w-full md:w-[60%] lg:w-[50%] z-10 p-12 md:p-20 flex flex-col justify-center h-auto md:h-auto md:min-h-[60%]">
          <h1 className="font-serif text-white text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-[1.1] drop-shadow-md">
            Artistry in Light
          </h1>
          <p className="font-sans text-white/90 text-sm md:text-base leading-relaxed mb-10 max-w-sm drop-shadow-sm">
            Experience lighting that redefines luxury and brings timeless ambiance to your home.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-lumen-black hover:bg-lumen-gold hover:text-white transition-colors duration-300 font-sans text-xs tracking-[0.15em] uppercase w-fit"
          >
            Discover Collection
          </Link>
        </div>
        
        {/* Carousel Indicators placed on the image area */}
        <div className="absolute bottom-10 right-10 z-20 flex items-center gap-4">
          {images && images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-1 transition-all duration-300 ${
                index === currentImage ? 'bg-white w-12' : 'bg-white/50 w-6 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Text Bar */}
      <div className="w-full bg-lumen-black text-lumen-gold py-4 px-6 flex justify-between items-center text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase shrink-0 border-t border-[#333]">
        <span className="hidden md:block">Complimentary Worldwide Shipping</span>
        <span>Artisan Crafted</span>
        <span className="hidden md:block">White-Glove Delivery</span>
        <span className="md:hidden">Free Shipping · Artisan Crafted</span>
      </div>
    </section>
  );
}

