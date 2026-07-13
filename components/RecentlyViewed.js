'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductBySlug } from '@/lib/firestore';

const STORAGE_KEY = 'lumen_recently_viewed';

// Hook to add a slug to recently viewed
export function useTrackRecentlyViewed(currentSlug) {
  useEffect(() => {
    if (!currentSlug) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let viewed = stored ? JSON.parse(stored) : [];
      
      // Remove if it exists so we can push to front
      viewed = viewed.filter((s) => s !== currentSlug);
      viewed.unshift(currentSlug);
      
      // Keep only last 8
      if (viewed.length > 8) viewed = viewed.slice(0, 8);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    } catch (e) {
      console.warn('Failed to track recently viewed', e);
    }
  }, [currentSlug]);
}

export default function RecentlyViewed({ currentSlug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentlyViewed() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setLoading(false);
          return;
        }

        const slugs = JSON.parse(stored);
        // Exclude current product and get up to 4 others
        const targetSlugs = slugs.filter((s) => s !== currentSlug).slice(0, 4);

        if (targetSlugs.length === 0) {
          setLoading(false);
          return;
        }

        const fetched = await Promise.all(
          targetSlugs.map((slug) => getProductBySlug(slug))
        );
        
        setProducts(fetched.filter(Boolean));
      } catch (err) {
        console.warn('Failed to fetch recently viewed products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyViewed();
  }, [currentSlug]);

  if (loading || products.length === 0) return null;

  return (
    <div className="border-t border-lumen-border py-16 mt-16">
      <h2 className="font-serif text-3xl mb-8">Recently viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} layout="grid" />
        ))}
      </div>
    </div>
  );
}
