'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GoogleReviewsCarousel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.status === 'OK' && data.result.reviews) {
          setReviews(data.result.reviews);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReviews();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    let minDistance = Infinity;
    let centerIdx = 0;
    
    Array.from(container.querySelectorAll('.review-card')).forEach((child) => {
      const childRect = child.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      const containerAbsoluteCenter = containerRect.left + containerRect.width / 2;
      
      const distance = Math.abs(containerAbsoluteCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        centerIdx = parseInt(child.getAttribute('data-index') || '0', 10);
      }
    });
    
    setActiveIndex(centerIdx);
  };

  // Initial calculation on mount/reviews load
  useEffect(() => {
    if (!loading && reviews.length > 0 && scrollContainerRef.current) {
      // Center the middle review to maintain visual symmetry on load
      const middleIndex = Math.floor(reviews.length / 2);
      setActiveIndex(middleIndex);
      
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const cards = container.querySelectorAll('.review-card');
        if (cards[middleIndex]) {
          const card = cards[middleIndex];
          // Calculate exact scroll position to center this card
          const scrollPos = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
          container.scrollTo({ left: scrollPos, behavior: 'auto' });
        }
      }, 100);
    }
  }, [loading, reviews]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.classList.remove('snap-x');
    scrollContainerRef.current.classList.remove('snap-mandatory');
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollContainerRef.current.classList.add('snap-x');
    scrollContainerRef.current.classList.add('snap-mandatory');
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.classList.add('snap-x');
    scrollContainerRef.current.classList.add('snap-mandatory');
    // Trigger a snap calculation
    handleScroll();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumen-gold"></div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="bg-lumen-bg border-y border-lumen-border py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {/* Google G Logo SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-lumen-muted">
              Google Reviews
            </p>
          </div>
          <h2 className="font-serif text-3xl">What Our Customers Say</h2>
        </div>
        
        {/* Navigation Buttons for Desktop */}
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll('left')} className="p-3 border border-lumen-border rounded-full hover:bg-white transition-colors" aria-label="Scroll left">
            <ChevronLeft size={20} className="text-lumen-black" />
          </button>
          <button onClick={() => scroll('right')} className="p-3 border border-lumen-border rounded-full hover:bg-white transition-colors" aria-label="Scroll right">
            <ChevronRight size={20} className="text-lumen-black" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative max-w-[100vw] py-10 -my-10">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory hide-scrollbar items-center ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Start Spacer to allow scrolling first item to center */}
          <div className="w-[calc(50vw-150px-12px)] md:w-[calc(50vw-190px-12px)] shrink-0"></div>
          {reviews.map((review, i) => {
            const isActive = activeIndex === i;
            return (
              <div 
                key={i} 
                data-index={i}
                className={`review-card min-w-[300px] md:min-w-[380px] max-w-[380px] snap-center bg-white border border-lumen-border p-8 shrink-0 transition-all duration-500 ease-out ${
                  isActive 
                    ? 'scale-110 shadow-2xl z-10 opacity-100 border-[#dfc17f]' 
                    : 'scale-90 shadow-sm z-0 opacity-100'
                }`}
              >
              <div className="flex items-center gap-4 mb-5">
                <img 
                  src={review.profile_photo_url} 
                  alt={review.author_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-sans font-medium text-lumen-black text-sm">{review.author_name}</p>
                  <p className="text-xs text-lumen-muted mt-1">{review.relative_time_description}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star 
                    key={idx} 
                    size={14} 
                    className={idx < review.rating ? "text-lumen-gold fill-lumen-gold" : "text-lumen-border fill-lumen-border"} 
                  />
                ))}
              </div>
              
              <p className="font-serif text-lumen-black leading-relaxed line-clamp-6">
                "{review.text}"
              </p>
            </div>
            );
          })}
          {/* End Spacer to allow scrolling last item to center */}
          <div className="w-[calc(50vw-150px-12px)] md:w-[calc(50vw-190px-12px)] shrink-0"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
