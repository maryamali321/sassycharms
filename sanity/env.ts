/**
 * Reads Sanity project connection details from environment variables.
 * Falls back to safe placeholder values so the app can still build & run
 * (with sample data) before a real Sanity project is connected.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
