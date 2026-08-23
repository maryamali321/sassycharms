import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.code === 'string' && body.code.trim()) update.code = body.code.trim().toUpperCase();
  if (body.discountType === 'percent' || body.discountType === 'fixed') update.discountType = body.discountType;
  if (body.value !== undefined && Number.isFinite(Number(body.value))) update.value = Number(body.value);
  if (body.active !== undefined) update.active = Boolean(body.active);
  if (body.minOrderAmount !== undefined) {
    update.minOrderAmount =
      body.minOrderAmount === '' || body.minOrderAmount === null ? undefined : Number(body.minOrderAmount);
  }
  if (body.expiresAt !== undefined) update.expiresAt = body.expiresAt || undefined;

  const db = await getDb();
  const result = await db
    .collection('coupons')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: 'after' });

  if (!result) return NextResponse.json({ message: 'Coupon not found.' }, { status: 404 });
  return NextResponse.json({ ...result, _id: result._id.toString() });
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const result = await db.collection('coupons').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return NextResponse.json({ message: 'Coupon not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
