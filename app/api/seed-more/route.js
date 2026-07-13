import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATEGORIES = ['Chandeliers', 'Pendants', 'Wall Lights', 'Floor Lamps', 'Table Lamps', 'Outdoor Lighting'];
const STYLES = ['Modern', 'Traditional', 'Art Deco', 'Minimalist'];
const FINISHES = ['Brushed Gold', 'Brushed Brass', 'Matte Black', 'Chrome', 'Antique Bronze'];
const IMAGES = {
  Chandeliers: ['/cat-chandeliers.jpg', '/hero-chandelier.jpg', '/product-aurelia.jpg', '/product-obsidian.jpg'],
  Pendants: ['/cat-pendants.jpg', '/hero-chandelier.jpg'],
  'Wall Lights': ['/cat-wall-lights.jpg', '/product-obsidian.jpg'],
  'Floor Lamps': ['/hero-chandelier.jpg', '/cat-chandeliers.jpg'],
  'Table Lamps': ['/hero-chandelier.jpg', '/cat-wall-lights.jpg'],
  'Outdoor Lighting': ['/hero-chandelier.jpg', '/cat-pendants.jpg']
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMockProducts(count) {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const category = CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)];
    const style = STYLES[getRandomInt(0, STYLES.length - 1)];
    const finish = FINISHES[getRandomInt(0, FINISHES.length - 1)];
    const price = getRandomInt(100, 15000);
    const hasDiscount = Math.random() > 0.7;
    const discountPrice = hasDiscount ? Math.floor(price * 0.8) : null;
    const isNew = Math.random() > 0.8;
    const stock = Math.random() > 0.1 ? getRandomInt(5, 100) : 0;
    
    // Pick a random image associated with this category
    const catImages = IMAGES[category];
    const image = catImages[getRandomInt(0, catImages.length - 1)];

    products.push({
      name: `${style} ${category.slice(0, -1)} Model ${i}`,
      slug: `mock-${category.toLowerCase().replace(' ', '-')}-model-${i}`,
      category,
      style,
      finish,
      price,
      discountPrice,
      stock,
      status: 'active',
      featured: Math.random() > 0.7,
      isNew,
      images: [image],
      description: `This is a beautifully crafted ${style.toLowerCase()} ${category.toLowerCase().slice(0, -1)} featuring a stunning ${finish.toLowerCase()} finish.`
    });
  }
  return products;
}

export async function GET() {
  try {
    const MOCK_PRODUCTS = generateMockProducts(45); // Generate 45 random products
    
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
