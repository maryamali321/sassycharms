import { sanityClient } from './sanity';
import { urlFor } from './image';
import { fallbackProducts } from './fallback-products';
import type { Product } from './types';

const PRODUCTS_QUERY = `*[_type == "product" && inStock != false] | order(coalesce(order, 999) asc, _createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  category,
  price,
  oldPrice,
  badge,
  rating,
  reviews,
  description,
  featured,
  inStock,
  image
}`;

type SanityProductDoc = Omit<Product, 'imageUrl'> & { image: unknown };

/**
 * Fetches products from Sanity when configured, otherwise returns the
 * bundled sample catalogue so the storefront always has content to show.
 */
export async function getProducts(): Promise<Product[]> {
  if (!sanityClient) return fallbackProducts;

  try {
    const docs = await sanityClient.fetch<SanityProductDoc[]>(PRODUCTS_QUERY);
    if (!docs || docs.length === 0) return fallbackProducts;

    return docs.map((doc) => {
      const builder = doc.image ? urlFor(doc.image as never) : null;
      return {
        ...doc,
        imageUrl: builder ? builder.width(600).height(600).fit('crop').url() : '',
      };
    });
  } catch (error) {
    console.error('[SaasyCharms] Failed to fetch products from Sanity, showing sample data instead:', error);
    return fallbackProducts;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Rings', value: 'rings' },
  { label: 'Necklaces', value: 'necklaces' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Bracelets', value: 'bracelets' },
  { label: 'Anklets', value: 'anklets' },
] as const;
