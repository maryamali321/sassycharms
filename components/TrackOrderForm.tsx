'use client';

import { useRef, useState, type FormEvent } from 'react';

const STATUS_STEPS = [
  { icon: 'fa-check', label: 'Order Placed', time: 'Apr 3, 2026 – 10:00 AM', state: 'done' },
  { icon: 'fa-check', label: 'Order Confirmed', time: 'Apr 3, 2026 – 12:30 PM', state: 'done' },
  { icon: 'fa-box', label: 'Packed & Dispatched', time: 'Apr 4, 2026 – 09:00 AM', state: 'active' },
  { icon: 'fa-truck', label: 'Out for Delivery', time: 'Estimated: Apr 6, 2026', state: '' },
  { icon: 'fa-home', label: 'Delivered', time: 'Pending', state: '' },
];

export default function TrackOrderForm() {
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowResult(true);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  return (
    <div className="track-box">
      <div className="track-icon">📦</div>
      <h2>Order Tracking</h2>
      <p>Enter your order ID and email address to track your SaasyCharms order in real time.</p>
      <form className="track-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order ID</label>
          <input type="text" placeholder="e.g. SC-20260001" required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="your@email.com" required />
        </div>
        <button type="submit" className="btn-primary">Track My Order</button>
      </form>

      <div className={`track-result${showResult ? ' show' : ''}`} ref={resultRef}>
        <h4>Order #SC-20260001 – Rose Gold Charm Ring</h4>
        <div className="status-steps">
          {STATUS_STEPS.map((step) => (
            <div className="status-step" key={step.label}>
              <div className={`step-dot${step.state ? ` ${step.state}` : ''}`}>
                <i className={`fas ${step.icon}`} />
              </div>
              <div className="step-info">
                <p>{step.label}</p>
                <span>{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
