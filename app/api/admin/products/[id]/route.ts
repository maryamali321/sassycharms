import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/slugify';

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  if (!product) return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
  return NextResponse.json({ ...product, _id: product._id.toString() });
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.name === 'string' && body.name.trim()) update.name = body.name.trim();
  if (typeof body.category === 'string' && body.category) update.category = body.category;
  if (body.price !== undefined && Number.isFinite(Number(body.price))) update.price = Number(body.price);
  if (body.stockQuantity !== undefined && Number.isFinite(Number(body.stockQuantity))) {
    update.stockQuantity = Number(body.stockQuantity);
  }
  if (body.oldPrice !== undefined) {
    update.oldPrice = body.oldPrice === '' || body.oldPrice === null ? undefined : Number(body.oldPrice);
  }
  if (body.badge !== undefined) update.badge = body.badge || undefined;
  if (body.rating !== undefined && Number.isFinite(Number(body.rating))) update.rating = Number(body.rating);
  if (body.reviews !== undefined && Number.isFinite(Number(body.reviews))) update.reviews = Number(body.reviews);
  if (typeof body.imageUrl === 'string' && body.imageUrl) update.imageUrl = body.imageUrl;
  if (Array.isArray(body.gallery)) {
    update.gallery = body.gallery.filter((url: unknown) => typeof url === 'string');
  }
  if (body.description !== undefined) update.description = body.description || undefined;
  if (body.featured !== undefined) update.featured = Boolean(body.featured);

  if (typeof body.slug === 'string' && body.slug.trim()) {
    const slug = slugify(body.slug);
    if (!slug) return NextResponse.json({ message: 'Invalid slug.' }, { status: 400 });

    const db = await getDb();
    const existing = await db.collection('products').findOne({ slug, _id: { $ne: new ObjectId(id) } });
    if (existing) {
      return NextResponse.json({ message: `A product with slug "${slug}" already exists.` }, { status: 409 });
    }
    update.slug = slug;
  }

  const db = await getDb();
  const result = await db
    .collection('products')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: 'after' });

  if (!result) return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
  return NextResponse.json({ ...result, _id: result._id.toString() });
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const db = await getDb();
  const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
