import { NextResponse } from 'next/server';
import { isCloudinaryConfigured, uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  if (!isCloudinaryConfigured) {
    return NextResponse.json({ message: 'Cloudinary is not configured.' }, { status: 500 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ message: 'Only image files are allowed.' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('[SaasyCharms] Image upload failed:', error);
    return NextResponse.json({ message: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
