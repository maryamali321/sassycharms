import Link from 'next/link';
import type { Metadata } from 'next';
import type { ObjectId } from 'mongodb';
import { getDb, isMongoConfigured } from '@/lib/mongodb';
import DeleteButton from '@/components/admin/DeleteButton';
import AdminBadge from '@/components/admin/AdminBadge';
import { IconPencil, IconPlus } from '@/components/admin/icons';
import type { CouponDoc } from '@/lib/coupons';

export const metadata: Metadata = { title: 'Coupons' };

type CouponWithObjectId = CouponDoc & { _id: ObjectId };

export default async function AdminCouponsPage() {
  const coupons = isMongoConfigured
    ? (await (await getDb()).collection<CouponWithObjectId>('coupons').find({}).sort({ _id: -1 }).toArray()).map(
        (c) => ({ ...c, _id: c._id.toString() })
      )
    : [];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Discount Codes</h1>
        <Link href="/admin/coupons/new" className="admin-btn-primary">
          <IconPlus size={15} /> Add Coupon
        </Link>
      </div>

      {!isMongoConfigured ? <p className="admin-warning">MONGODB_URI isn&apos;t set — no coupons to manage.</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Order</th>
              <th>Expires</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>
                  <strong>{coupon.code}</strong>
                </td>
                <td>{coupon.discountType === 'percent' ? `${coupon.value}%` : `Rs. ${coupon.value}`}</td>
                <td>{coupon.minOrderAmount ? `Rs. ${coupon.minOrderAmount}` : '—'}</td>
                <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '—'}</td>
                <td>
                  {coupon.active === false ? (
                    <AdminBadge tone="no">No</AdminBadge>
                  ) : (
                    <AdminBadge tone="yes">Yes</AdminBadge>
                  )}
                </td>
                <td className="admin-table-actions">
                  <Link href={`/admin/coupons/${coupon._id}/edit`}>
                    <IconPencil size={13} /> Edit
                  </Link>
                  <DeleteButton
                    url={`/api/admin/coupons/${coupon._id}`}
                    confirmText={`Delete coupon "${coupon.code}"?`}
                  />
                </td>
              </tr>
            ))}
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-empty">
                  No coupons yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
