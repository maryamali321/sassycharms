'use client';

import { useState, type FormEvent } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <div className="contact-form-box">
      <h3>Send Us a Message ✦</h3>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" placeholder="Aiza" required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" placeholder="Khan" required />
          </div>
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="your@email.com" required />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <select defaultValue="Order Inquiry">
            <option>Order Inquiry</option>
            <option>Product Question</option>
            <option>Return / Exchange</option>
            <option>Wholesale</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea rows={5} placeholder="Write your message here..." required />
        </div>
        <button type="submit" className="btn-primary">Send Message 💌</button>
      </form>
      <div className={`success-msg${submitted ? ' show' : ''}`}>
        ✓ Thank you! Your message has been sent. We&apos;ll get back to you within 24 hours 💖
      </div>
    </div>
  );
}
