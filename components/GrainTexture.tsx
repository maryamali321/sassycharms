import { useId } from 'react';

/**
 * Fine noise texture for deep jewel-tone panels (hero, dark bands) so they
 * read as rich fabric rather than a flat color fill.
 */
export default function GrainTexture() {
  const id = useId();
  return (
    <svg className="grain-texture" width="100%" height="100%" aria-hidden="true">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope={0.06} />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
