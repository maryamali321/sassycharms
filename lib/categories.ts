// Pure, client-safe constant — kept separate from lib/products.ts so client
// components can import it without pulling the MongoDB driver into the
// browser bundle (lib/products.ts is server-only).
export const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Rings', value: 'rings' },
  { label: 'Necklaces', value: 'necklaces' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Bracelets', value: 'bracelets' },
  { label: 'Anklets', value: 'anklets' },
] as const;
