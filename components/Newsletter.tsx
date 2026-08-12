'use client';

import { useState, type FormEvent } from 'react';

export default function Newsletter({ heading = 'Join the Saasy Club 💌' }: { heading?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <h3>{heading}</h3>
        <p>Subscribe for exclusive deals, new arrivals & pink vibes only.</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address..."
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" style={subscribed ? { background: '#c9a86c' } : undefined}>
            {subscribed ? '✓ Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
