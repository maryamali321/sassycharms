import { NextResponse } from 'next/server';
import { findCoupon, validateCoupon } from '@/lib/coupons';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code : '';
  const subtotal = typeof body?.subtotal === 'number' ? body.subtotal : 0;

  if (!code) {
    return NextResponse.json({ valid: false, message: 'Enter a discount code.' }, { status: 400 });
  }

  const coupon = await findCoupon(code);
  const result = validateCoupon(coupon, subtotal);

  return NextResponse.json(result, { status: result.valid ? 200 : 400 });
}
