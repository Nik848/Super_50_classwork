/**
 * seed-products.ts — Fetches products from DummyJSON and inserts into Supabase
 *
 * Run: npx ts-node src/scripts/seed-products.ts
 */
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { products } from '../app/products/products.schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail?: string;
  images?: string[];
  rating?: number;
  discountPercentage?: number;
  brand?: string;
  category?: string;
  reviews?: any[];
}

async function seed() {
  console.log('🌱 Fetching rich products from DummyJSON...');

  const response = await fetch('https://dummyjson.com/products?limit=100');
  const data = (await response.json()) as { products: DummyProduct[] };

  const dummyProducts = data.products;

  console.log(`📦 Fetched ${dummyProducts.length} products. Inserting into DB...`);

  // Clear existing products first
  await db.delete(products);
  console.log('🗑️  Cleared existing products.');

  // Insert all products
  const inserted = await db
    .insert(products)
    .values(
      dummyProducts.map((p) => ({
        name: p.title,
        description: p.description,
        price: String(p.price),
        stock: p.stock,
        thumbnail: p.thumbnail,
        images: p.images || [],
        rating: p.rating ? String(p.rating) : null,
        discountPercentage: p.discountPercentage ? String(p.discountPercentage) : null,
        brand: p.brand,
        category: p.category,
        reviews: p.reviews || [],
      }))
    )
    .returning();

  console.log(`✅ Successfully inserted ${inserted.length} products with full rich data!`);

  await pool.end();
  console.log('\n🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  pool.end();
  process.exit(1);
});
