'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CouponDoc } from '@/lib/coupons';

type CouponWithId = CouponDoc & { _id: string };

export default function CouponForm({ coupon }: { coupon?: CouponWithId }) {
  const router = useRouter();
  const isEdit = Boolean(coupon);

  const [code, setCode] = useState(coupon?.code ?? '');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>(coupon?.discountType ?? 'percent');
  const [value, setValue] = useState(coupon?.value?.toString() ?? '');
  const [active, setActive] = useState(coupon?.active ?? true);
  const [minOrderAmount, setMinOrderAmount] = useState(coupon?.minOrderAmount?.toString() ?? '');
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt?.slice(0, 10) ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      code,
      discountType,
      value: Number(value),
      active,
      minOrderAmount: minOrderAmount === '' ? undefined : Number(minOrderAmount),
      expiresAt: expiresAt || undefined,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/coupons/${coupon!._id}` : '/api/admin/coupons', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Something went wrong.');
        return;
      }
      router.push('/admin/coupons');
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
        <h1>{isEdit ? 'Edit Coupon' : 'Add Coupon'}</h1>
        <div className="admin-form-topbar-actions">
          <Link href="/admin/coupons" className="admin-btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="admin-btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Coupon'}
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 520 }}>
        <div className="admin-form-group" style={{ marginBottom: 16 }}>
          <label>Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
        </div>

        <div className="admin-form-row" style={{ marginBottom: 16 }}>
          <div className="admin-form-group">
            <label>Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}>
              <option value="percent">Percentage off</option>
              <option value="fixed">Fixed amount off (Rs.)</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Value ({discountType === 'percent' ? '%' : 'Rs.'})</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required min="0" />
          </div>
        </div>

        <div className="admin-form-row" style={{ marginBottom: 16 }}>
          <div className="admin-form-group">
            <label>Minimum Order Amount (Rs., optional)</label>
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              min="0"
            />
          </div>
          <div className="admin-form-group">
            <label>Expires On (optional)</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        </div>

        <div className="admin-toggle-row">
          <p className="admin-toggle-row-label">Active</p>
          <label className="admin-switch">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <span className="admin-switch-track" />
          </label>
        </div>
      </div>

      {error ? <p className="admin-error" style={{ marginTop: 16, maxWidth: 520 }}>{error}</p> : null}
    </form>
  );
}
