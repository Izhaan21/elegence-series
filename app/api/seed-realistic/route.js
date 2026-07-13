import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const REALISTIC_PRODUCTS = [
  // ── CHANDELIERS ───────────────────────────────────────────
  {
    name: 'Crystal Waterfall Chandelier',
    slug: 'crystal-waterfall-chandelier',
    category: 'Chandeliers',
    style: 'Traditional',
    finish: 'Chrome',
    price: 8500,
    discountPrice: null,
    stock: 5,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/product-aurelia.jpg'],
    description: 'An opulent multi-tiered crystal chandelier that refracts light into a dazzling display of rainbows.'
  },
  {
    name: 'Modern Gold Halo Chandelier',
    slug: 'modern-gold-halo-chandelier',
    category: 'Chandeliers',
    style: 'Modern',
    finish: 'Brushed Gold',
    price: 4200,
    discountPrice: 3800,
    stock: 12,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-chandeliers.jpg'],
    description: 'A minimalist glowing ring suspended by delicate wires, providing seamless ambient lighting.'
  },
  {
    name: 'Rustic Tiered Chandelier',
    slug: 'rustic-tiered-chandelier',
    category: 'Chandeliers',
    style: 'Rustic',
    finish: 'Antique Bronze',
    price: 3600,
    discountPrice: null,
    stock: 8,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/hero-chandelier.jpg'],
    description: 'Perfect for grand farmhouses, featuring distressed bronze and exposed candelabra bulbs.'
  },

  // ── PENDANTS ──────────────────────────────────────────────
  {
    name: 'Glass Globe Pendant',
    slug: 'glass-globe-pendant',
    category: 'Pendants',
    style: 'Minimalist',
    finish: 'Brushed Brass',
    price: 850,
    discountPrice: 750,
    stock: 25,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-pendants.jpg'],
    description: 'A delicate frosted glass globe suspended by a subtle brushed brass rod.'
  },
  {
    name: 'Industrial Concrete Pendant',
    slug: 'industrial-concrete-pendant',
    category: 'Pendants',
    style: 'Industrial',
    finish: 'Matte Black',
    price: 650,
    discountPrice: null,
    stock: 18,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/product-obsidian.jpg'],
    description: 'Raw cast concrete shade with matte black hardware, ideal for kitchen islands.'
  },
  {
    name: 'Brass Geometric Pendant',
    slug: 'brass-geometric-pendant',
    category: 'Pendants',
    style: 'Art Deco',
    finish: 'Brushed Brass',
    price: 1100,
    discountPrice: null,
    stock: 10,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-pendants.jpg'],
    description: 'An intricate geometric brass cage that casts beautiful shadow patterns.'
  },

  // ── WALL LIGHTS ───────────────────────────────────────────
  {
    name: 'Mid-Century Sconce',
    slug: 'mid-century-sconce',
    category: 'Wall Lights',
    style: 'Mid-Century Modern',
    finish: 'Matte Black',
    price: 450,
    discountPrice: null,
    stock: 30,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/cat-wall-lights.jpg'],
    description: 'Dual-cone wall sconce providing both up and down illumination.'
  },
  {
    name: 'Minimalist Linear Sconce',
    slug: 'minimalist-linear-sconce',
    category: 'Wall Lights',
    style: 'Minimalist',
    finish: 'Chrome',
    price: 380,
    discountPrice: 320,
    stock: 0,
    status: 'active',
    featured: false,
    isNew: true,
    images: ['/product-deco.jpg'],
    description: 'A sleek chrome bar emitting a continuous wash of warm LED light against the wall.'
  },

  // ── FLOOR LAMPS ───────────────────────────────────────────
  {
    name: 'Wooden Tripod Floor Lamp',
    slug: 'wooden-tripod-floor-lamp',
    category: 'Floor Lamps',
    style: 'Scandinavian',
    finish: 'Natural Wood',
    price: 950,
    discountPrice: null,
    stock: 14,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/cat-floor-lamps.png'],
    description: 'Solid walnut tripod base with an oversized crisp white linen drum shade.'
  },
  {
    name: 'Matte Black Reading Lamp',
    slug: 'matte-black-reading-lamp',
    category: 'Floor Lamps',
    style: 'Modern',
    finish: 'Matte Black',
    price: 550,
    discountPrice: 480,
    stock: 22,
    status: 'active',
    featured: false,
    isNew: true,
    images: ['/cat-floor-lamps.png'],
    description: 'Adjustable, focused reading light perfect for living room corners.'
  },

  // ── TABLE LAMPS ───────────────────────────────────────────
  {
    name: 'Ceramic Base Table Lamp',
    slug: 'ceramic-base-table-lamp',
    category: 'Table Lamps',
    style: 'Traditional',
    finish: 'White Ceramic',
    price: 320,
    discountPrice: null,
    stock: 40,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/cat-table-lamps.png'],
    description: 'Textured white ceramic base bringing organic warmth to bedside tables.'
  },
  {
    name: 'Marble & Brass Desk Lamp',
    slug: 'marble-brass-desk-lamp',
    category: 'Table Lamps',
    style: 'Art Deco',
    finish: 'Brushed Brass',
    price: 680,
    discountPrice: 600,
    stock: 15,
    status: 'active',
    featured: false,
    isNew: true,
    images: ['/cat-table-lamps.png'],
    description: 'Heavy Carrara marble base supporting an angled brass shade.'
  },
  {
    name: 'Glass Cylinder Table Lamp',
    slug: 'glass-cylinder-table-lamp',
    category: 'Table Lamps',
    style: 'Modern',
    finish: 'Clear Glass',
    price: 240,
    discountPrice: null,
    stock: 50,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/cat-table-lamps.png'],
    description: 'A transparent glass base with a textured fabric shade.'
  },
  {
    name: 'Minimalist LED Desk Lamp',
    slug: 'minimalist-led-desk-lamp',
    category: 'Table Lamps',
    style: 'Minimalist',
    finish: 'Matte White',
    price: 180,
    discountPrice: 150,
    stock: 25,
    status: 'active',
    featured: false,
    isNew: true,
    images: ['/cat-table-lamps.png'],
    description: 'Ultra-thin adjustable arm with a sleek light panel.'
  },

  // ── OUTDOOR LIGHTING ──────────────────────────────────────
  {
    name: 'Modern Pathway Bollard',
    slug: 'modern-pathway-bollard',
    category: 'Outdoor Lighting',
    style: 'Modern',
    finish: 'Matte Black',
    price: 280,
    discountPrice: null,
    stock: 60,
    status: 'active',
    featured: true,
    isNew: false,
    images: ['/cat-outdoor-lighting.png'],
    description: 'Weather-resistant IP65 rated pathway light providing subtle ground illumination.'
  },
  {
    name: 'Classic Wall Lantern',
    slug: 'classic-wall-lantern',
    category: 'Outdoor Lighting',
    style: 'Traditional',
    finish: 'Antique Bronze',
    price: 340,
    discountPrice: 290,
    stock: 35,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-outdoor-lighting.png'],
    description: 'Beveled glass panels and a rugged bronze finish for welcoming entrances.'
  },
  {
    name: 'Copper Wall Sconce',
    slug: 'copper-wall-sconce',
    category: 'Outdoor Lighting',
    style: 'Nautical',
    finish: 'Weathered Copper',
    price: 210,
    discountPrice: null,
    stock: 45,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-outdoor-lighting.png'],
    description: 'A marine-inspired outdoor light that beautifully patinas over time.'
  },
  {
    name: 'Submersible Pond Light',
    slug: 'submersible-pond-light',
    category: 'Outdoor Lighting',
    style: 'Modern',
    finish: 'Stainless Steel',
    price: 120,
    discountPrice: 99,
    stock: 100,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-outdoor-lighting.png'],
    description: 'Fully waterproof IP68 spotlights for dramatic water feature lighting.'
  },

  // ── ARCHITECTURAL LIGHTS ──────────────────────────────────
  {
    name: 'Recessed LED Spotlights (Pack of 4)',
    slug: 'recessed-led-spotlights',
    category: 'Architectural Lights',
    style: 'Minimalist',
    finish: 'Matte White',
    price: 450,
    discountPrice: null,
    stock: 100,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-architectural-lights.png'],
    description: 'Ultra-low glare, high CRI recessed downlights for clean architectural ceilings.'
  },
  {
    name: 'Linear Cove Lighting System',
    slug: 'linear-cove-lighting',
    category: 'Architectural Lights',
    style: 'Modern',
    finish: 'Aluminum',
    price: 800,
    discountPrice: 700,
    stock: 50,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-architectural-lights.png'],
    description: 'Seamless continuous LED extrusions for flawless indirect cove illumination.'
  },
  {
    name: 'Magnetic Track Lighting System',
    slug: 'magnetic-track-lighting',
    category: 'Architectural Lights',
    style: 'Minimalist',
    finish: 'Matte Black',
    price: 1200,
    discountPrice: null,
    stock: 20,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-architectural-lights.png'],
    description: 'A versatile track system allowing snap-in modular LED fixtures.'
  },
  {
    name: 'Trimless Wall Washers',
    slug: 'trimless-wall-washers',
    category: 'Architectural Lights',
    style: 'Modern',
    finish: 'Plaster White',
    price: 350,
    discountPrice: null,
    stock: 75,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-architectural-lights.png'],
    description: 'Disappears into the ceiling to provide a smooth, even wash of light on vertical surfaces.'
  },

  // ── WALL SCONCES ──────────────────────────────────────────
  {
    name: 'Luxury Brass Globe Sconce',
    slug: 'luxury-brass-globe-sconce',
    category: 'Wall Sconces',
    style: 'Modern Luxury',
    finish: 'Brushed Brass',
    price: 350,
    discountPrice: null,
    stock: 45,
    status: 'active',
    featured: true,
    isNew: true,
    images: ['/cat-wall-sconces.png'],
    description: 'A premium brass wall sconce with a frosted glass globe, casting a warm ambient glow.'
  },
  {
    name: 'Art Deco Fluted Sconce',
    slug: 'art-deco-fluted-sconce',
    category: 'Wall Sconces',
    style: 'Art Deco',
    finish: 'Aged Brass',
    price: 420,
    discountPrice: 380,
    stock: 20,
    status: 'active',
    featured: false,
    isNew: false,
    images: ['/cat-wall-sconces.png'],
    description: 'Fluted glass with aged brass hardware, perfect for elegant hallways and bathrooms.'
  }
];

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    
    // 1. Delete all existing products
    const snapshot = await getDocs(productsRef);
    const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'products', document.id)));
    await Promise.all(deletePromises);

    // 2. Add the highly realistic products
    for (const p of REALISTIC_PRODUCTS) {
      await addDoc(productsRef, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return NextResponse.json({ 
      success: true, 
      deleted: snapshot.docs.length,
      added: REALISTIC_PRODUCTS.length 
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
