import Link from 'next/link';
import type { Metadata } from 'next';
import type { ObjectId } from 'mongodb';
import { getDb, isMongoConfigured } from '@/lib/mongodb';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata: Metadata = { title: 'Orders' };

type OrderDoc = Omit<Order, '_id'> & { _id: ObjectId };

export default async function AdminOrdersPage() {
  const orders = isMongoConfigured
    ? (await (await getDb()).collection<OrderDoc>('orders').find({}).sort({ _id: -1 }).toArray()).map((o) => ({
        ...o,
        _id: o._id.toString(),
      }))
    : [];

  return (
    <div className="admin-page">
      <h1>Orders</h1>

      {!isMongoConfigured ? <p className="admin-warning">MONGODB_URI isn&apos;t set — no orders to show.</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>Rs. {Number(order.total).toLocaleString()}</td>
                <td>
                  <OrderStatusSelect orderId={order._id} status={order.status as OrderStatus} />
                </td>
                <td className="admin-table-actions">
                  <Link href={`/admin/orders/${order._id}`}>View Details</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-empty">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
