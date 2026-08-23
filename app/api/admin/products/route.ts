import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/slugify';

export async function GET() {
  const db = await getDb();
  const products = await db.collection('products').find({}).sort({ _id: -1 }).toArray();
  return NextResponse.json({
    products: products.map((p) => ({ ...p, _id: p._id.toString() })),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const category = typeof body?.category === 'string' ? body.category : '';
  const price = Number(body?.price);
  const stockQuantity = Number(body?.stockQuantity);
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';

  if (!name || !category || !imageUrl || !Number.isFinite(price) || !Number.isFinite(stockQuantity)) {
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  const slug = slugify(typeof body?.slug === 'string' && body.slug ? body.slug : name);
  if (!slug) {
    return NextResponse.json({ message: 'Could not generate a valid slug from that name.' }, { status: 400 });
  }

  const db = await getDb();
  const existing = await db.collection('products').findOne({ slug });
  if (existing) {
    return NextResponse.json({ message: `A product with slug "${slug}" already exists.` }, { status: 409 });
  }

  const doc = {
    name,
    slug,
    category,
    price,
    oldPrice: Number.isFinite(Number(body?.oldPrice)) && body?.oldPrice !== '' ? Number(body.oldPrice) : undefined,
    badge: typeof body?.badge === 'string' && body.badge ? body.badge : undefined,
    rating: Number.isFinite(Number(body?.rating)) ? Number(body.rating) : 5,
    reviews: Number.isFinite(Number(body?.reviews)) ? Number(body.reviews) : 0,
    imageUrl,
    gallery: Array.isArray(body?.gallery) ? body.gallery.filter((url: unknown) => typeof url === 'string') : [],
    description: typeof body?.description === 'string' ? body.description : undefined,
    featured: Boolean(body?.featured),
    stockQuantity,
  };

  const result = await db.collection('products').insertOne(doc);
  return NextResponse.json({ _id: result.insertedId.toString(), ...doc }, { status: 201 });
}
