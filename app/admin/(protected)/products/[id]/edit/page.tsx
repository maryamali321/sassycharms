import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/lib/types';

export const metadata: Metadata = { title: 'Edit Product' };

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const doc = await db.collection('products').findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  const product: Product = { ...(doc as unknown as Product), _id: doc._id.toString() };

  return <ProductForm product={product} />;
}
