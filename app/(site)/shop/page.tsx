import '@/styles/pages/shop.css';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import ShopGrid from '@/components/ShopGrid';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Shop' };

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <div className="page-header">
        <h1>Our Collection</h1>
        <p>Handcrafted with love, made for you 💖</p>
      </div>

      <section className="section shop-page">
        <ShopGrid products={products} />
      </section>

      <Footer />
    </>
  );
}
