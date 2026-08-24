import '@/styles/pages/cart.css';
import type { Metadata } from 'next';
import CartView from '@/components/CartView';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Your Bag', robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <div className="page-header">
        <h1>Your Bag</h1>
        <p>Review your items before checking out 🛍️</p>
      </div>

      <section className="section cart-page">
        <CartView />
      </section>

      <Footer simple />
    </>
  );
}
