import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getProducts } from '@/lib/products';
import { findCoupon, validateCoupon } from '@/lib/coupons';
import { getDb, isMongoConfigured } from '@/lib/mongodb';
import type { OrderItem } from '@/lib/types';

type OrderRequestItem = { productId: string; quantity: number };

function generateOrderNumber(): string {
  return `SC-${Date.now().toString(36).toUpperCase()}`;
}

function buildWhatsappMessage(params: {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}): string {
  const lines = [
    `New order ${params.orderNumber}`,
    '',
    ...params.items.map(
      (item) => `- ${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
    ),
    '',
    `Subtotal: Rs. ${params.subtotal.toLocaleString()}`,
  ];

  if (params.discountAmount > 0) {
    lines.push(`Discount (${params.couponCode}): -Rs. ${params.discountAmount.toLocaleString()}`);
  }

  lines.push(
    `Total: Rs. ${params.total.toLocaleString()}`,
    '',
    `Name: ${params.customerName}`,
    `Phone: ${params.phone}`,
    `Address: ${params.address}, ${params.city}`
  );

  if (params.notes) lines.push(`Notes: ${params.notes}`);

  return lines.join('\n');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const requestItems: OrderRequestItem[] = Array.isArray(body?.items) ? body.items : [];
  const customerName = typeof body?.customerName === 'string' ? body.customerName.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const address = typeof body?.address === 'string' ? body.address.trim() : '';
  const city = typeof body?.city === 'string' ? body.city.trim() : '';
  const notes = typeof body?.notes === 'string' ? body.notes.trim() : undefined;
  const couponCode = typeof body?.couponCode === 'string' ? body.couponCode.trim() : '';

  if (requestItems.length === 0 || !customerName || !phone || !address || !city) {
    return NextResponse.json({ message: 'Missing required order details.' }, { status: 400 });
  }

  // Never trust client-sent prices — re-price every item from the current catalogue.
  const catalogue = await getProducts();
  const items: OrderItem[] = [];

  for (const requested of requestItems) {
    const product = catalogue.find((p) => p._id === requested.productId);
    const quantity = Math.max(1, Math.floor(requested.quantity || 0));
    if (!product) {
      return NextResponse.json({ message: `A product in your cart is no longer available.` }, { status: 400 });
    }
    if (quantity > product.stockQuantity) {
      return NextResponse.json(
        { message: `Only ${product.stockQuantity} left of "${product.name}" — please reduce the quantity.` },
        { status: 400 }
      );
    }
    items.push({ name: product.name, price: product.price, quantity, imageUrl: product.imageUrl });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (couponCode) {
    const coupon = await findCoupon(couponCode);
    const result = validateCoupon(coupon, subtotal);
    if (!result.valid) {
      return NextResponse.json({ message: result.message ?? 'Invalid discount code.' }, { status: 400 });
    }
    discountAmount = result.discountAmount;
  }

  const total = subtotal - discountAmount;
  const orderNumber = generateOrderNumber();

  if (isMongoConfigured) {
    try {
      const db = await getDb();
      await db.collection('orders').insertOne({
        orderNumber,
        status: 'pending',
        customerName,
        phone,
        address,
        city,
        items,
        couponCode: couponCode || undefined,
        discountAmount,
        subtotal,
        total,
        notes,
        createdAt: new Date().toISOString(),
      });

      await Promise.all(
        requestItems.map((requested) =>
          db
            .collection('products')
            .updateOne(
              { _id: new ObjectId(requested.productId) },
              { $inc: { stockQuantity: -Math.max(1, Math.floor(requested.quantity || 0)) } }
            )
            .catch((error) => {
              console.error(`[SaasyCharms] Failed to decrement stock for ${requested.productId}:`, error);
            })
        )
      );
    } catch (error) {
      console.error('[SaasyCharms] Failed to save order to MongoDB (WhatsApp handoff still proceeds):', error);
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = buildWhatsappMessage({
    orderNumber,
    items,
    subtotal,
    discountAmount,
    couponCode: couponCode || undefined,
    total,
    customerName,
    phone,
    address,
    city,
    notes,
  });

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;

  return NextResponse.json({ orderNumber, whatsappUrl, total });
}
