'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { Order, OrderStatus } from '@/lib/types';

const STATUS_FLOW: { status: OrderStatus; icon: string; label: string }[] = [
  { status: 'pending', icon: 'fa-check', label: 'Order Placed' },
  { status: 'confirmed', icon: 'fa-check', label: 'Order Confirmed' },
  { status: 'packed', icon: 'fa-box', label: 'Packed & Dispatched' },
  { status: 'shipped', icon: 'fa-truck', label: 'Out for Delivery' },
  { status: 'delivered', icon: 'fa-home', label: 'Delivered' },
];

export default function TrackOrderForm() {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: form.get('orderNumber'),
          phone: form.get('phone'),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Order not found.');
        return;
      }

      setOrder(data.order);
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setLoading(false);
    }
  }

  const cancelled = order?.status === 'cancelled';
  const activeIndex = order && !cancelled ? STATUS_FLOW.findIndex((s) => s.status === order.status) : -1;

  return (
    <div className="track-box">
      <div className="track-icon">📦</div>
      <h2>Order Tracking</h2>
      <p>Enter your order number and the phone number you checked out with to see your order status.</p>
      <form className="track-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Number</label>
          <input type="text" name="orderNumber" placeholder="e.g. SC-ABC123" required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="03xx xxxxxxx" required />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Track My Order'}
        </button>
      </form>

      {error ? <p className="track-error">{error}</p> : null}

      {order ? (
        <div className="track-result show" ref={resultRef}>
          <h4>
            Order #{order.orderNumber} — Rs. {order.total.toLocaleString()}
          </h4>
          {cancelled ? (
            <p className="track-cancelled">This order was cancelled.</p>
          ) : (
            <div className="status-steps">
              {STATUS_FLOW.map((step, index) => (
                <div className="status-step" key={step.status}>
                  <div
                    className={`step-dot${
                      index < activeIndex ? ' done' : index === activeIndex ? ' active' : ''
                    }`}
                  >
                    <i className={`fas ${step.icon}`} />
                  </div>
                  <div className="step-info">
                    <p>{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
