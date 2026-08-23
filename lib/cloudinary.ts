import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

/**
 * Uploads an image buffer to Cloudinary and returns its public URL.
 * Only call this from server-side admin routes — never from the client.
 */
export function uploadImage(buffer: Buffer, folder = 'saasycharms/products'): Promise<string> {
  if (!isCloudinaryConfigured) {
    return Promise.reject(new Error('Cloudinary is not configured.'));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error ?? new Error('Cloudinary upload failed.'));
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}
