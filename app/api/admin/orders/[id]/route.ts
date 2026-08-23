import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

type Params = Promise<{ id: string }>;

const VALID_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export async function GET(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
  if (!order) return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
  return NextResponse.json({ ...order, _id: order._id.toString() });
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = typeof body?.status === 'string' ? body.status : '';

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection('orders')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { status } }, { returnDocument: 'after' });

  if (!result) return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
  return NextResponse.json({ ...result, _id: result._id.toString() });
}
