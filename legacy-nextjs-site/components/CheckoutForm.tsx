'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

type OrderResult = { orderNumber: string; whatsappUrl: string | null };

export default function CheckoutForm() {
  const { items, subtotal, total, appliedCoupon, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  useEffect(() => {
    if (result?.whatsappUrl) {
      window.location.href = result.whatsappUrl;
    }
  }, [result]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          couponCode: appliedCoupon?.code,
          customerName: form.get('customerName'),
          phone: form.get('phone'),
          address: form.get('address'),
          city: form.get('city'),
          notes: form.get('notes'),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Something went wrong placing your order. Please try again.');
        return;
      }

      clearCart();
      setResult(data);
    } catch {
      setError('Something went wrong placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="checkout-confirmation">
        <div className="checkout-confirmation-icon">✅</div>
        <h2>Order placed!</h2>
        <p>
          Your order number is <strong>{result.orderNumber}</strong>. Save it to track your order later.
        </p>
        {result.whatsappUrl ? (
          <>
            <p>Opening WhatsApp so our team can confirm your order…</p>
            <a href={result.whatsappUrl} className="btn-primary">
              <i className="fab fa-whatsapp" /> Open WhatsApp
            </a>
          </>
        ) : (
          <p>Please reach out to us on WhatsApp with your order number to confirm.</p>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-confirmation">
        <p>Your bag is empty.</p>
        <Link href="/shop" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="customerName" required placeholder="Your name" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" required placeholder="03xx xxxxxxx" />
        </div>
        <div className="form-group">
          <label>Delivery Address</label>
          <textarea name="address" required rows={3} placeholder="House #, street, area" />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" name="city" required placeholder="e.g. Lahore" />
        </div>
        <div className="form-group">
          <label>Order Notes (optional)</label>
          <textarea name="notes" rows={2} placeholder="Anything we should know?" />
        </div>

        {error ? <p className="checkout-error">{error}</p> : null}

        <button type="submit" className="btn-primary checkout-submit" disabled={submitting}>
          {submitting ? 'Placing Order…' : (
            <>
              <i className="fab fa-whatsapp" /> Confirm & Checkout on WhatsApp
            </>
          )}
        </button>
        <p className="cart-note">No payment needed now — you&apos;ll confirm your order with us on WhatsApp.</p>
      </form>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div className="checkout-summary-row" key={item.productId}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="checkout-summary-row">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        {appliedCoupon ? (
          <div className="checkout-summary-row cart-summary-discount">
            <span>Discount ({appliedCoupon.code})</span>
            <span>−Rs. {appliedCoupon.discountAmount.toLocaleString()}</span>
          </div>
        ) : null}
        <div className="checkout-summary-row cart-summary-total">
          <span>Total</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
