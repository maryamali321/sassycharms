import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const db = await getDb();
  const coupons = await db.collection('coupons').find({}).sort({ _id: -1 }).toArray();
  return NextResponse.json({
    coupons: coupons.map((c) => ({ ...c, _id: c._id.toString() })),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  const discountType = body?.discountType === 'fixed' ? 'fixed' : 'percent';
  const value = Number(body?.value);

  if (!code || !Number.isFinite(value) || value <= 0) {
    return NextResponse.json({ message: 'Enter a code and a positive value.' }, { status: 400 });
  }

  const db = await getDb();
  const existing = await db.collection('coupons').findOne({ code });
  if (existing) {
    return NextResponse.json({ message: `Coupon "${code}" already exists.` }, { status: 409 });
  }

  const doc = {
    code,
    discountType,
    value,
    active: body?.active !== false,
    minOrderAmount: Number.isFinite(Number(body?.minOrderAmount)) && body?.minOrderAmount !== ''
      ? Number(body.minOrderAmount)
      : undefined,
    expiresAt: typeof body?.expiresAt === 'string' && body.expiresAt ? body.expiresAt : undefined,
  };

  const result = await db.collection('coupons').insertOne(doc);
  return NextResponse.json({ _id: result.insertedId.toString(), ...doc }, { status: 201 });
}
