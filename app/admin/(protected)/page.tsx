import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb, isMongoConfigured } from '@/lib/mongodb';
import { IconBox, IconClock, IconCoins } from '@/components/admin/icons';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  let productCount = 0;
  let pendingOrderCount = 0;
  let couponCount = 0;

  if (isMongoConfigured) {
    const db = await getDb();
    [productCount, pendingOrderCount, couponCount] = await Promise.all([
      db.collection('products').countDocuments(),
      db.collection('orders').countDocuments({ status: 'pending' }),
      db.collection('coupons').countDocuments(),
    ]);
  }

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>

      {!isMongoConfigured ? (
        <p className="admin-warning">MONGODB_URI isn&apos;t set — the storefront is running on sample data.</p>
      ) : null}

      <div className="admin-stats-grid">
        <Link href="/admin/products" className="admin-stat-card">
          <span className="admin-stat-icon admin-stat-icon-blue">
            <IconBox />
          </span>
          <span>
            <span className="admin-stat-value" style={{ display: 'block' }}>
              {productCount}
            </span>
            <span className="admin-stat-label">Products</span>
          </span>
        </Link>
        <Link href="/admin/orders" className="admin-stat-card">
          <span className="admin-stat-icon admin-stat-icon-amber">
            <IconClock />
          </span>
          <span>
            <span className="admin-stat-value" style={{ display: 'block' }}>
              {pendingOrderCount}
            </span>
            <span className="admin-stat-label">Pending Orders</span>
          </span>
        </Link>
        <Link href="/admin/coupons" className="admin-stat-card">
          <span className="admin-stat-icon admin-stat-icon-purple">
            <IconCoins />
          </span>
          <span>
            <span className="admin-stat-value" style={{ display: 'block' }}>
              {couponCount}
            </span>
            <span className="admin-stat-label">Discount Codes</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
