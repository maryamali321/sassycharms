import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import type { Order, OrderStatus } from '@/lib/types';

export const metadata: Metadata = { title: 'Order Details' };

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const doc = await db.collection('orders').findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  const order: Order & { _id: string } = { ...(doc as unknown as Order), _id: doc._id.toString() };

  return (
    <div className="admin-page">
      <h1>Order {order.orderNumber}</h1>

      <div className="admin-order-detail">
        <div className="admin-order-status-row">
          <span>Status:</span>
          <OrderStatusSelect orderId={order._id} status={order.status as OrderStatus} />
        </div>

        <h3>Customer</h3>
        <p>{order.customerName}</p>
        <p>{order.phone}</p>
        <p>
          {order.address}, {order.city}
        </p>

        <h3>Items</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.price.toLocaleString()}</td>
                  <td>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-order-totals">
          <p>Subtotal: Rs. {order.subtotal.toLocaleString()}</p>
          {order.discountAmount ? (
            <p>
              Discount ({order.couponCode}): -Rs. {order.discountAmount.toLocaleString()}
            </p>
          ) : null}
          <p>
            <strong>Total: Rs. {order.total.toLocaleString()}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
