import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import CouponForm from '@/components/admin/CouponForm';
import type { CouponDoc } from '@/lib/coupons';

export const metadata: Metadata = { title: 'Edit Coupon' };

type Params = Promise<{ id: string }>;

export default async function EditCouponPage({ params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const doc = await db.collection('coupons').findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  const coupon: CouponDoc & { _id: string } = { ...(doc as unknown as CouponDoc), _id: doc._id.toString() };

  return <CouponForm coupon={coupon} />;
}
