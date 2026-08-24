'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useCart } from './CartProvider';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const images = [product.imageUrl, ...(product.gallery ?? [])];
  const [activeImage, setActiveImage] = useState(images[0]);

  function handleAddToBag() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const outOfStock = product.stockQuantity <= 0;

  return (
    <div className="product-detail">
      <div className="product-detail-gallery">
        <div className="product-detail-main-img">
          <Image src={activeImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          {product.badge ? <span className={`badge-${product.badge.toLowerCase()}`}>{product.badge}</span> : null}
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

        <p className={`product-detail-stock${outOfStock ? ' out' : ''}`}>
          {outOfStock ? 'Out of stock' : `In stock (${product.stockQuantity} available)`}
        </p>

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
              className="btn-primary"
              onClick={handleAddToBag}
              style={added ? { background: '#c9a86c' } : undefined}
            >
              {added ? '✓ Added to Bag' : 'Add to Bag'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
