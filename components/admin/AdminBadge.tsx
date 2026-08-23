export default function AdminBadge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`admin-badge admin-badge-${tone}`}>{children}</span>;
}
