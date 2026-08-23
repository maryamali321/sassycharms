import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  /** Slightly smaller for footer. */
  compact?: boolean;
};

/**
 * Uses the real SaasyCharms logo artwork (girl + brand name)
 * as one complete mark — same idea as Kavior's stacked logo block.
 */
export default function BrandLogo({ href = '/', compact = false }: BrandLogoProps) {
  const height = compact ? 84 : 104;
  // Original art is ~819×1024 (portrait)
  const width = Math.round(height * (819 / 1024));

  const mark = (
    <span className={`brand-logo${compact ? ' brand-logo-compact' : ''}`}>
      <Image
        src="/logo-full.png"
        alt="SaasyCharms"
        width={width}
        height={height}
        priority={!compact}
        className="brand-logo-img"
      />
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="brand-logo-link" aria-label="SaasyCharms home">
      {mark}
    </Link>
  );
}
