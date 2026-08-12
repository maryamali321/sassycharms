'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { CATEGORIES } from '@/lib/products';
import type { Product } from '@/lib/types';

export default function ShopGrid({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    return products.filter((product) => product.category === activeFilter);
  }, [products, activeFilter]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-tabs">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              className={`filter-btn${activeFilter === category.value ? ' active' : ''}`}
              onClick={() => setActiveFilter(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid shop-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-mid)' }}>
          No products in this category yet — check back soon!
        </p>
      ) : null}
    </>
  );
}
