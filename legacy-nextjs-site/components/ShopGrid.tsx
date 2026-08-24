'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { CATEGORIES } from '@/lib/categories';
import type { Product } from '@/lib/types';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function ShopGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const product of products) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((product) => product.category === activeCategory);
    }
    if (minPrice) {
      result = result.filter((product) => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }
    if (inStockOnly) {
      result = result.filter((product) => product.stockQuantity > 0);
    }

    const sorted = [...result];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);

    return sorted;
  }, [products, activeCategory, minPrice, maxPrice, inStockOnly, sort]);

  function clearFilters() {
    setActiveCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  }

  const hasActiveFilters = activeCategory !== 'all' || minPrice || maxPrice || inStockOnly;

  const sidebarContent = (
    <>
      <div className="shop-filter-group">
        <h4>Category</h4>
        <ul className="shop-filter-list">
          {[{ label: 'All', value: 'all' }, ...CATEGORIES.filter((c) => c.value !== 'all')].map((category) => (
            <li key={category.value}>
              <button
                type="button"
                className={activeCategory === category.value ? 'active' : ''}
                onClick={() => setActiveCategory(category.value)}
              >
                <span>{category.label}</span>
                <span className="shop-filter-count">{categoryCounts[category.value] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="shop-filter-group">
        <h4>Price Range (Rs.)</h4>
        <div className="shop-price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className="shop-filter-group">
        <label className="shop-filter-checkbox">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          In Stock Only
        </label>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="shop-clear-filters" onClick={clearFilters}>
          Clear All Filters
        </button>
      ) : null}
    </>
  );

  return (
    <div className="shop-layout">
      <button
        type="button"
        className="shop-mobile-filter-toggle"
        onClick={() => setMobileFiltersOpen((open) => !open)}
      >
        <i className="fas fa-sliders-h" /> Filters {hasActiveFilters ? '•' : ''}
      </button>

      <aside className={`shop-sidebar${mobileFiltersOpen ? ' open' : ''}`}>{sidebarContent}</aside>

      <div className="shop-results">
        <div className="shop-results-bar">
          <p className="shop-results-count">{filteredProducts.length} products</p>
          <select
            className="shop-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="products-grid shop-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="shop-no-results">No products match these filters — try adjusting them.</p>
        ) : null}
      </div>
    </div>
  );
}
