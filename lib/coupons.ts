import { getDb, isMongoConfigured } from './mongodb';

export type CouponDoc = {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  active?: boolean;
  minOrderAmount?: number;
  expiresAt?: string;
};

// Lets the code already advertised in the announcement bar/homepage work
// even before MongoDB is connected.
const FALLBACK_COUPON: CouponDoc = {
  code: 'SAASY10',
  discountType: 'percent',
  value: 10,
  active: true,
};

export async function findCoupon(code: string): Promise<CouponDoc | null> {
  const normalized = code.trim();
  if (!normalized) return null;

  if (!isMongoConfigured) {
    return normalized.toUpperCase() === FALLBACK_COUPON.code ? FALLBACK_COUPON : null;
  }

  try {
    const db = await getDb();
    // Coupon codes are always stored upper-cased (enforced in the admin API),
    // so an exact match avoids building a regex out of user input.
    const doc = await db.collection<CouponDoc>('coupons').findOne({ code: normalized.toUpperCase() });
    return doc;
  } catch (error) {
    console.error('[SaasyCharms] Failed to fetch coupon from MongoDB:', error);
    return null;
  }
}

export function validateCoupon(
  coupon: CouponDoc | null,
  subtotal: number
): { valid: boolean; discountAmount: number; message?: string } {
  if (!coupon) return { valid: false, discountAmount: 0, message: 'Invalid discount code.' };
  if (coupon.active === false) {
    return { valid: false, discountAmount: 0, message: 'This code is no longer active.' };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, discountAmount: 0, message: 'This code has expired.' };
  }
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Add Rs. ${(coupon.minOrderAmount - subtotal).toLocaleString()} more to use this code.`,
    };
  }

  const discountAmount =
    coupon.discountType === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return { valid: true, discountAmount };
}
