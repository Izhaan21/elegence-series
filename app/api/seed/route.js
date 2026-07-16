import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MOCK_PRODUCTS = [
  // CHANDELIERS
  {
    name: 'The Aurelia Tiered',
    slug: 'aurelia-tiered',
    category: 'Chandeliers',
    style: 'Modern',
    finish: 'Brushed Gold',
    price: 14200,
    discountPrice: 12400,
    stock: 8,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/product-aurelia.jpg', '/cat-chandeliers.jpg'],
    description: 'A masterpiece of modern illumination. The Aurelia Tiered reimagines classic opulence through a minimalist lens.'
  },
  {
    name: 'Obsidian Linear Array',
    slug: 'obsidian-linear',
    category: 'Chandeliers',
    style: 'Minimalist',
    finish: 'Matte Black',
    price: 8950,
    discountPrice: null,
    stock: 5,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/product-obsidian.jpg'],
    description: 'Clean, architectural, and uncompromising.'
  },
  {
    name: 'Crystal Cascade',
    slug: 'crystal-cascade',
    category: 'Chandeliers',
    style: 'Traditional',
    finish: 'Chrome',
    price: 5400,
    discountPrice: 4800,
    stock: 12,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-chandeliers.jpg'],
    description: 'Traditional cascading crystal chandelier.'
  },

  // PENDANTS
  {
    name: 'Luminous Orb Pendant',
    slug: 'luminous-orb',
    category: 'Pendants',
    style: 'Modern',
    finish: 'Brushed Brass',
    price: 1250,
    discountPrice: null,
    stock: 24,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-pendants.jpg'],
    description: 'A single suspended orb providing soft, ambient light.'
  },
  {
    name: 'Industrial Dome',
    slug: 'industrial-dome',
    category: 'Pendants',
    style: 'Traditional',
    finish: 'Antique Bronze',
    price: 850,
    discountPrice: 700,
    stock: 15,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-pendants.jpg'],
    description: 'Classic dome pendant for kitchens and dining areas.'
  },

  // WALL LIGHTS
  {
    name: 'Eclipse Sconce',
    slug: 'eclipse-sconce',
    category: 'Wall Lights',
    style: 'Minimalist',
    finish: 'Matte Black',
    price: 450,
    discountPrice: null,
    stock: 30,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/cat-wall-lights.jpg'],
    description: 'Minimalist wall sconce casting a delicate eclipse shadow.'
  },
  {
    name: 'Deco Brass Sconce',
    slug: 'deco-brass',
    category: 'Wall Lights',
    style: 'Art Deco',
    finish: 'Brushed Brass',
    price: 600,
    discountPrice: 550,
    stock: 0, // OUT OF STOCK test
    status: 'active',
    featured: false,
    isNew: true,
    images: ['/cat-wall-lights.jpg'],
    description: 'Geometric art deco inspired wall lighting.'
  },

  // FLOOR LAMPS
  {
    name: 'Arching Floor Lamp',
    slug: 'arching-floor',
    category: 'Floor Lamps',
    style: 'Modern',
    finish: 'Chrome',
    price: 1100,
    discountPrice: null,
    stock: 10,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/hero-chandelier.jpg'], // using placeholder
    description: 'Large sweeping arch floor lamp for living rooms.'
  },

  // TABLE LAMPS
  {
    name: 'Marble Base Table Lamp',
    slug: 'marble-base-table',
    category: 'Table Lamps',
    style: 'Modern',
    finish: 'Brushed Gold',
    price: 350,
    discountPrice: 300,
    stock: 45,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/hero-chandelier.jpg'],
    description: 'Heavy marble base with a delicate linen shade.'
  },

  // OUTDOOR LIGHTING
  {
    name: 'Pathfinder Outdoor Post',
    slug: 'pathfinder-post',
    category: 'Outdoor Lighting',
    style: 'Minimalist',
    finish: 'Matte Black',
    price: 250,
    discountPrice: null,
    stock: 60,
    status: 'active',
    featured: false,
    isNew: true,
    images: ['/hero-chandelier.jpg'],
    description: 'Weather-resistant outdoor pathway lighting.'
  }
];

export async function GET() {
  try {
    for (const p of MOCK_PRODUCTS) {
      await addDoc(collection(db, 'products'), {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    return NextResponse.json({ success: true, count: MOCK_PRODUCTS.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
