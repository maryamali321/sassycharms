'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useCart } from './CartProvider';

const ACCORDION_SECTIONS = [
  {
    title: 'Details & Care',
    body: 'Avoid contact with water, perfume, and lotion. Store in the pouch provided when not worn, away from direct sunlight, to keep the finish looking new for longer.',
  },
  {
    title: 'Shipping & Delivery',
    body: 'Free shipping on all orders across Pakistan, with Cash on Delivery available everywhere. Once you check out on WhatsApp, our team confirms your order and delivery timeline directly with you.',
  },
];

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(0);
  const images = [product.imageUrl, ...(product.gallery ?? [])];
  const [activeImage, setActiveImage] = useState(images[0]);

  function handleAddToBag() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const outOfStock = product.stockQuantity <= 0;
  const lowStock = !outOfStock && product.stockQuantity <= 5;

  return (
    <div className="product-detail">
      <div className="product-detail-gallery">
        <div className="product-detail-main-img">
          <Image src={activeImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority />
          {product.badge ? <span className={`badge-${product.badge.toLowerCase()}`}>{product.badge}</span> : null}
          {lowStock ? <span className="product-detail-scarcity-tag">Only {product.stockQuantity} Left</span> : null}
        </div>
        {images.length > 1 ? (
          <div className="product-detail-thumbs">
            {images.map((image) => (
              <button
                key={image}
                type="button"
                className={image === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(image)}
              >
                <Image src={image} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-detail-info">
        <p className="product-category">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="price product-detail-price">
          Rs. {product.price.toLocaleString()}
          {product.oldPrice ? <span className="price-old">Rs. {product.oldPrice.toLocaleString()}</span> : null}
        </p>
        {product.description ? <p className="product-detail-description">{product.description}</p> : null}

        {lowStock ? (
          <div className="product-detail-scarcity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" />
            </svg>
            Only {product.stockQuantity} left — handcrafted in small batches
          </div>
        ) : (
          <p className={`product-detail-stock${outOfStock ? ' out' : ''}`}>
            {outOfStock ? 'Out of stock' : `In stock (${product.stockQuantity} available)`}
          </p>
        )}

        {!outOfStock ? (
          <div className="product-detail-actions">
            <div className="product-detail-qty">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="btn-primary product-detail-add-btn"
              onClick={handleAddToBag}
              style={added ? { background: 'var(--gold)' } : undefined}
            >
              {added ? '✓ Added to Bag' : 'Add to Bag'}
            </button>
          </div>
        ) : null}
        <p className="product-detail-whatsapp-hint">No payment needed now — you&apos;ll confirm your order with us on WhatsApp.</p>

        <div className="product-detail-trust-row">
          <div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2 3 7l9 5 9-5-9-5Z" /><path d="M3 12l9 5 9-5" /></svg>
            <p>Handcrafted<br />quality</p>
          </div>
          <div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8Z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            <p>Free shipping<br />in Pakistan</p>
          </div>
          <div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20" /></svg>
            <p>Cash on<br />Delivery</p>
          </div>
        </div>

        <div className="product-detail-accordion">
          {ACCORDION_SECTIONS.map((section, index) => (
            <div className="accordion-item" key={section.title}>
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => setOpenSection((current) => (current === index ? null : index))}
                aria-expanded={openSection === index}
              >
                <span>{section.title}</span>
                <span className="accordion-icon">{openSection === index ? '−' : '+'}</span>
              </button>
              {openSection === index ? <p className="accordion-body">{section.body}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
