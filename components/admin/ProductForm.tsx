'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product, ProductBadge } from '@/lib/types';
import { IconBox, IconImage, IconPlus, IconTag } from './icons';

const CATEGORY_OPTIONS = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets'];
const BADGE_OPTIONS = ['', 'New', 'Hot', 'Sale'];

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Upload failed.');
  return data.url as string;
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [category, setCategory] = useState<Product['category']>(product?.category ?? 'rings');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() ?? '');
  const [badge, setBadge] = useState<ProductBadge>(product?.badge ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() ?? '10');
  const [images, setImages] = useState<string[]>(
    product ? [product.imageUrl, ...(product.gallery ?? [])].filter(Boolean) : []
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setImages((current) => [...current, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, i) => i !== index));
  }

  function setAsMain(index: number) {
    setImages((current) => {
      const next = [...current];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      slug: slug || name,
      category,
      price: Number(price),
      oldPrice: oldPrice === '' ? undefined : Number(oldPrice),
      badge: badge || undefined,
      description,
      featured,
      stockQuantity: Number(stockQuantity),
      imageUrl: images[0],
      gallery: images.slice(1),
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product!._id}` : '/api/admin/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Something went wrong.');
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-topbar">
        <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <div className="admin-form-topbar-actions">
          <Link href="/admin/products" className="admin-btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="admin-btn-primary" disabled={submitting || uploading}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>

      {error ? <p className="admin-error" style={{ marginBottom: 16 }}>{error}</p> : null}

      <div className="admin-form-layout">
        <div className="admin-form-main">
          <div className="admin-card">
            <p className="admin-card-title">
              <span className="admin-card-title-icon">
                <IconBox size={14} />
              </span>
              Basic Info
            </p>

            <div className="admin-form-row" style={{ marginBottom: 16 }}>
              <div className="admin-form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label>Slug (optional)</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={name} />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            </div>
          </div>

          <div className="admin-card">
            <p className="admin-card-title">
              <span className="admin-card-title-icon">
                <IconImage size={14} />
              </span>
              Photos
            </p>
            <p className="admin-hint" style={{ marginBottom: 14 }}>
              The first photo is used everywhere as the main image — click the star on any other photo
              to make it first.
            </p>

            <div className="admin-image-manager">
              {images.map((url, index) => (
                <div className="admin-image-tile" key={url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                  {index === 0 ? <span className="admin-image-tile-main-badge">Main</span> : null}
                  <div className="admin-image-tile-actions">
                    {index !== 0 ? (
                      <button
                        type="button"
                        className="admin-image-tile-set-main"
                        title="Set as main image"
                        onClick={() => setAsMain(index)}
                      >
                        ★
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="admin-image-tile-remove"
                      title="Remove"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <label className="admin-image-upload-tile">
                {uploading ? '…' : <IconPlus size={20} />}
                {uploading ? 'Uploading' : 'Add Photo'}
                <input type="file" accept="image/*" multiple onChange={handleImagesChange} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="admin-form-side">
          <div className="admin-card">
            <p className="admin-card-title">Pricing</p>
            <div className="admin-form-group" style={{ marginBottom: 14 }}>
              <label>Price (Rs.)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
            </div>
            <div className="admin-form-group">
              <label>Compare-at Price (Rs., optional)</label>
              <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} min="0" />
              <p className="admin-hint">Shown as a strikethrough to indicate a sale.</p>
            </div>
          </div>

          <div className="admin-card">
            <p className="admin-card-title">Inventory</p>
            <div className="admin-form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div className="admin-card">
            <p className="admin-card-title">
              <span className="admin-card-title-icon">
                <IconTag size={14} />
              </span>
              Organization
            </p>

            <div className="admin-form-group" style={{ marginBottom: 14 }}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Product['category'])}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 14 }}>
              <label>Badge</label>
              <select value={badge} onChange={(e) => setBadge(e.target.value as ProductBadge)}>
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b || 'None'}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-toggle-row">
              <div>
                <p className="admin-toggle-row-label">Featured</p>
                <p className="admin-toggle-row-hint">Show on the homepage</p>
              </div>
              <label className="admin-switch">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <span className="admin-switch-track" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
