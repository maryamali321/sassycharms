import type { ObjectId } from 'mongodb';
import { getDb, isMongoConfigured } from './mongodb';
import { fallbackProducts } from './fallback-products';
import type { Product } from './types';

const COLLECTION = 'products';

type ProductDoc = Omit<Product, '_id'> & { _id: ObjectId };

function toProduct(doc: ProductDoc): Product {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

/**
 * Fetches products from MongoDB when configured, otherwise returns the
 * bundled sample catalogue so the storefront always has content to show.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isMongoConfigured) return fallbackProducts;

  try {
    const db = await getDb();
    const docs = await db
      .collection<ProductDoc>(COLLECTION)
      .find({ stockQuantity: { $gt: 0 } })
      .sort({ _id: -1 })
      .toArray();
    if (docs.length === 0) return fallbackProducts;
    return docs.map(toProduct);
  } catch (error) {
    console.error('[SaasyCharms] Failed to fetch products from MongoDB, showing sample data instead:', error);
    return fallbackProducts;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isMongoConfigured) {
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }

  try {
    const db = await getDb();
    const doc = await db.collection<ProductDoc>(COLLECTION).findOne({ slug });
    if (!doc) return fallbackProducts.find((p) => p.slug === slug) ?? null;
    return toProduct(doc);
  } catch (error) {
    console.error('[SaasyCharms] Failed to fetch product from MongoDB, checking sample data instead:', error);
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }
}

export { CATEGORIES } from './categories';
