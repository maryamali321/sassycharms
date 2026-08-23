'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from './CartProvider';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToBag() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="product-card" data-category={product.category}>
      <Link href={`/shop/${product.slug}`} className="product-img">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="product-overlay">
          <button
            className="btn-add-cart"
            onClick={(event) => {
              event.preventDefault();
              handleAddToBag();
            }}
            style={added ? { background: '#c9a86c' } : undefined}
          >
            {added ? '✓ Added!' : 'Add to Bag'}
          </button>
        </div>
        {product.badge ? (
          <span className={`badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
        ) : null}
      </Link>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h4>
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h4>
        <p className="price">
          Rs. {product.price.toLocaleString()}
          {product.oldPrice ? (
            <span className="price-old">Rs. {product.oldPrice.toLocaleString()}</span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
