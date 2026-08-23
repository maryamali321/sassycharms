import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

export const isMongoConfigured = Boolean(uri);

// Cached on `global` so Next.js's dev-mode hot-reloading doesn't open a new
// connection pool on every file save.
type GlobalWithMongo = typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
const globalWithMongo = globalThis as GlobalWithMongo;

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error('MongoDB is not configured (missing MONGODB_URI).');
  }
  const client = await clientPromise;
  return client.db();
}
