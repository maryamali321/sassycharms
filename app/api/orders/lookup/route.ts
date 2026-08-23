import { NextResponse } from 'next/server';
import { getDb, isMongoConfigured } from '@/lib/mongodb';
import type { Order } from '@/lib/types';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';

  if (!orderNumber || !phone) {
    return NextResponse.json({ message: 'Enter your order number and phone number.' }, { status: 400 });
  }

  if (!isMongoConfigured) {
    return NextResponse.json(
      { message: 'Order tracking isn’t connected yet — please reach out to us on WhatsApp with your order number.' },
      { status: 503 }
    );
  }

  const db = await getDb();
  // Order numbers are always generated upper-cased, so an exact match on the
  // upper-cased input avoids needing a regex built from user input.
  const order = await db.collection<Order>('orders').findOne({ orderNumber: orderNumber.toUpperCase() });

  // Compare the last 10 digits so it doesn't matter whether a country code was included.
  const inputDigits = digitsOnly(phone).slice(-10);
  const storedDigits = order ? digitsOnly(order.phone).slice(-10) : '';

  if (!order || !inputDigits || inputDigits !== storedDigits) {
    return NextResponse.json(
      { message: 'No order found with that order number and phone number.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
