'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartView() {
  const { items, subtotal, total, appliedCoupon, updateQuantity, removeItem, applyCoupon, clearCoupon } =
    useCart();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleApplyCoupon() {
    if (!code.trim()) return;
    setChecking(true);
    setMessage(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        applyCoupon({ code: code.trim().toUpperCase(), discountAmount: data.discountAmount });
        setMessage(`"${code.trim().toUpperCase()}" applied!`);
      } else {
        clearCoupon();
        setMessage(data.message ?? 'Invalid discount code.');
      }
    } catch {
      setMessage('Something went wrong — please try again.');
    } finally {
      setChecking(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛍️</div>
        <h2>Your bag is empty</h2>
        <p>Add a little sparkle to your cart!</p>
        <Link href="/shop" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item.productId}>
            <div className="cart-item-img">
              <Image src={item.imageUrl} alt={item.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
            </div>
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p className="cart-item-price">Rs. {item.price.toLocaleString()}</p>
            </div>
            <div className="cart-item-qty">
              <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                +
              </button>
            </div>
            <p className="cart-item-total">Rs. {(item.price * item.quantity).toLocaleString()}</p>
            <button
              type="button"
              className="cart-item-remove"
              aria-label={`Remove ${item.name}`}
              onClick={() => removeItem(item.productId)}
            >
              <i className="fas fa-trash" />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        {appliedCoupon ? (
          <div className="cart-summary-row cart-summary-discount">
            <span>Discount ({appliedCoupon.code})</span>
            <span>−Rs. {appliedCoupon.discountAmount.toLocaleString()}</span>
          </div>
        ) : null}
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>

        <div className="cart-coupon">
          <input
            type="text"
            placeholder="Discount code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <button type="button" onClick={handleApplyCoupon} disabled={checking}>
            {checking ? '...' : 'Apply'}
          </button>
        </div>
        {message ? <p className="cart-coupon-message">{message}</p> : null}

        <Link href="/checkout" className="btn-primary cart-checkout-btn">
          <i className="fab fa-whatsapp" /> Checkout on WhatsApp
        </Link>
        <p className="cart-note">No payment needed now — you&apos;ll confirm your order with us on WhatsApp.</p>
      </div>
    </div>
  );
}
