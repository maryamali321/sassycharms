import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const db = await getDb();
  const orders = await db.collection('orders').find({}).sort({ _id: -1 }).toArray();
  return NextResponse.json({
    orders: orders.map((o) => ({ ...o, _id: o._id.toString() })),
  });
}
