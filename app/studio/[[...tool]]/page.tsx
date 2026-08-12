/**
 * Embedded Sanity Studio — the admin panel where the client manages products.
 * Available at /studio once a real Sanity project is connected via .env.local
 */
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { isSanityConfigured } from '@/lib/sanity';

export const dynamic = 'force-static';

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#fff0f5',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: 24, marginBottom: 12, color: '#3a2030' }}>Studio not connected yet</h1>
          <p style={{ color: '#6b4c5e', lineHeight: 1.7, marginBottom: 8 }}>
            The site is currently showing sample products. To manage real products here, create a
            free Sanity project and add its credentials to <code>.env.local</code>.
          </p>
          <p style={{ color: '#6b4c5e', lineHeight: 1.7 }}>
            See <strong>README.md</strong> for the exact steps.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
