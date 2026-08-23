import Link from 'next/link';
import type { Metadata } from 'next';
import type { ObjectId } from 'mongodb';
import { getDb, isMongoConfigured } from '@/lib/mongodb';
import DeleteButton from '@/components/admin/DeleteButton';
import AdminBadge from '@/components/admin/AdminBadge';
import { IconPencil, IconPlus } from '@/components/admin/icons';
import type { Product } from '@/lib/types';

export const metadata: Metadata = { title: 'Products' };

type ProductDoc = Omit<Product, '_id'> & { _id: ObjectId };

export default async function AdminProductsPage() {
  const products = isMongoConfigured
    ? (await (await getDb()).collection<ProductDoc>('products').find({}).sort({ _id: -1 }).toArray()).map((p) => ({
        ...p,
        _id: p._id.toString(),
      }))
    : [];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="admin-btn-primary">
          <IconPlus size={15} /> Add Product
        </Link>
      </div>

      {!isMongoConfigured ? <p className="admin-warning">MONGODB_URI isn&apos;t set — no products to manage.</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.imageUrl} alt="" className="admin-table-thumb" />
                </td>
                <td>{product.name}</td>
                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                <td>Rs. {Number(product.price).toLocaleString()}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  {product.featured ? (
                    <AdminBadge tone="yes">Yes</AdminBadge>
                  ) : (
                    <AdminBadge tone="no">No</AdminBadge>
                  )}
                </td>
                <td className="admin-table-actions">
                  <Link href={`/admin/products/${product._id}/edit`}>
                    <IconPencil size={13} /> Edit
                  </Link>
                  <DeleteButton
                    url={`/api/admin/products/${product._id}`}
                    confirmText={`Delete "${product.name}"?`}
                  />
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-empty">
                  No products yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
