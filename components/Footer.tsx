import Link from 'next/link';
import BrandLogo from './BrandLogo';

const COPYRIGHT = (
  <div className="footer-bottom">
    <p>
      Copyright © 2026 – All rights reserved by <strong>SaasyCharms</strong> 💖
    </p>
  </div>
);

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';

export default function Footer({ simple = false }: { simple?: boolean }) {
  if (simple) {
    return <footer className="footer">{COPYRIGHT}</footer>;
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <BrandLogo href="/" compact />
          </div>
          <p>Delicate jewellery for the girl who loves all things pink, pretty & charming.</p>
          <div className="social-links">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
            <a href="#" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fab fa-whatsapp" />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h5>Quick Links</h5>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/track">Track Order</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h5>Collections</h5>
          <ul>
            <li><Link href="/shop">Rings</Link></li>
            <li><Link href="/shop">Necklaces</Link></li>
            <li><Link href="/shop">Earrings</Link></li>
            <li><Link href="/shop">Bracelets</Link></li>
            <li><Link href="/shop">Anklets</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h5>Contact Us</h5>
          <ul>
            <li><i className="fas fa-envelope" /> hello@saasycharms.pk</li>
            <li>
              <i className="fab fa-whatsapp" />{' '}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                +92 300 0000000
              </a>
            </li>
            <li><i className="fas fa-map-marker-alt" /> Pakistan</li>
          </ul>
        </div>
      </div>
      {COPYRIGHT}
    </footer>
  );
}
