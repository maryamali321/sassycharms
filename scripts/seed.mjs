// One-time helper to give the store real starting inventory in MongoDB.
// Run with: npm run seed
// Safe to re-run — it skips products whose slug already exists.
import { MongoClient } from 'mongodb';

const SEED_PRODUCTS = [
  {
    name: 'Rose Gold Charm Ring',
    slug: 'rose-gold-charm-ring',
    category: 'rings',
    price: 1299,
    badge: 'New',
    rating: 5,
    reviews: 128,
    imageUrl: 'https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?w=500&q=80',
    featured: true,
    stockQuantity: 15,
  },
  {
    name: 'Dainty Pearl Necklace',
    slug: 'dainty-pearl-necklace',
    category: 'necklaces',
    price: 1899,
    badge: 'Hot',
    rating: 5,
    reviews: 96,
    imageUrl: 'https://images.unsplash.com/photo-1595345705177-ffe090eb0784?w=500&q=80',
    featured: true,
    stockQuantity: 15,
  },
  {
    name: 'Crystal Drop Earrings',
    slug: 'crystal-drop-earrings',
    category: 'earrings',
    price: 999,
    rating: 4,
    reviews: 54,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
    featured: true,
    stockQuantity: 15,
  },
  {
    name: 'Delicate Gold Bracelet',
    slug: 'delicate-gold-bracelet',
    category: 'bracelets',
    price: 1499,
    oldPrice: 1999,
    badge: 'Sale',
    rating: 5,
    reviews: 142,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
    featured: true,
    stockQuantity: 15,
  },
  {
    name: 'Crystal Solitaire Ring',
    slug: 'crystal-solitaire-ring',
    category: 'rings',
    price: 1599,
    rating: 5,
    reviews: 87,
    imageUrl: 'https://images.unsplash.com/photo-1587593692659-38c32c496642?w=500&q=80',
    stockQuantity: 15,
  },
  {
    name: 'Layered Gold Necklace',
    slug: 'layered-gold-necklace',
    category: 'necklaces',
    price: 2199,
    badge: 'New',
    rating: 5,
    reviews: 63,
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80',
    stockQuantity: 15,
  },
  {
    name: 'Mini Gold Hoop Earrings',
    slug: 'mini-gold-hoop-earrings',
    category: 'earrings',
    price: 799,
    rating: 4,
    reviews: 41,
    imageUrl: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500&q=80',
    stockQuantity: 15,
  },
  {
    name: 'Charm Anklet',
    slug: 'charm-anklet',
    category: 'anklets',
    price: 699,
    rating: 5,
    reviews: 72,
    imageUrl: 'https://images.unsplash.com/photo-1744722091259-ed1cf11ac97f?w=500&q=80',
    stockQuantity: 15,
  },
];

const SEED_COUPON = {
  code: 'SAASY10',
  discountType: 'percent',
  value: 10,
  active: true,
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set — copy it into .env.local first.');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const products = db.collection('products');
  let inserted = 0;
  for (const product of SEED_PRODUCTS) {
    const result = await products.updateOne(
      { slug: product.slug },
      { $setOnInsert: product },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted++;
  }
  console.log(`Products: inserted ${inserted}, skipped ${SEED_PRODUCTS.length - inserted} (already existed).`);

  const coupons = db.collection('coupons');
  const couponResult = await coupons.updateOne(
    { code: SEED_COUPON.code },
    { $setOnInsert: SEED_COUPON },
    { upsert: true }
  );
  console.log(
    couponResult.upsertedCount > 0
      ? `Coupon ${SEED_COUPON.code} created.`
      : `Coupon ${SEED_COUPON.code} already existed, skipped.`
  );

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
