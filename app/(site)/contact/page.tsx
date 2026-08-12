import '@/styles/pages/contact.css';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <div className="page-header">
        <h1>Get In Touch</h1>
        <p>We&apos;d love to hear from you! 💌</p>
      </div>

      <section className="contact-section">
        <div className="contact-info">
          <h2>Let&apos;s Chat 🌸</h2>
          <p>
            Have a question about an order, a product, or just want to say hello? We&apos;re here
            for you. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-envelope" /></div>
              <div>
                <h5>Email Us</h5>
                <p>hello@saasycharms.pk</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fab fa-whatsapp" /></div>
              <div>
                <h5>WhatsApp</h5>
                <p>+92 300 0000000</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fab fa-instagram" /></div>
              <div>
                <h5>Instagram</h5>
                <p>@saasycharms</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-clock" /></div>
              <div>
                <h5>Working Hours</h5>
                <p>Mon – Sat, 10 AM – 8 PM</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>

      <Footer simple />
    </>
  );
}
