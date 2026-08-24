import '@/styles/pages/checkout.css';
import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <div className="page-header">
        <h1>Checkout</h1>
        <p>Almost there — just a few details 💌</p>
      </div>

      <section className="section checkout-page">
        <CheckoutForm />
      </section>

      <Footer simple />
    </>
  );
}
