import '@/styles/pages/track.css';
import type { Metadata } from 'next';
import TrackOrderForm from '@/components/TrackOrderForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Look up your SaasyCharms order status using your order number and phone number.',
};

export default function TrackPage() {
  return (
    <>
      <div className="page-header">
        <h1>Track Your Order</h1>
        <p>Enter your order details to see the status 📦</p>
      </div>

      <section className="track-section">
        <TrackOrderForm />
      </section>

      <Footer simple />
    </>
  );
}
