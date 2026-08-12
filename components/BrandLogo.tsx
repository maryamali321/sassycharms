import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  /** Light text for dark backgrounds (footer). */
  light?: boolean;
  /** Slightly smaller mark for compact areas. */
  compact?: boolean;
};

/**
 * Kavior-style stacked brand mark:
 * logo icon on top → SAASY (serif) → CHARMS (spaced subtitle).
 */
export default function BrandLogo({ href = '/', light = false, compact = false }: BrandLogoProps) {
  const size = compact ? 48 : 64;

  const mark = (
    <span className={`brand-logo${light ? ' brand-logo-light' : ''}${compact ? ' brand-logo-compact' : ''}`}>
      <span className="brand-logo-mark">
        <Image
          src="/logo-badge.png"
          alt="SaasyCharms"
          width={size}
          height={size}
          priority={!compact}
        />
      </span>
      <span className="brand-logo-wordmark">
        <span className="brand-logo-name">Saasy</span>
        <span className="brand-logo-sub">Charms</span>
      </span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="brand-logo-link" aria-label="SaasyCharms home">
      {mark}
    </Link>
  );
}
