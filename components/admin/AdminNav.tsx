'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconBox, IconDashboard, IconLogout, IconMenu, IconReceipt, IconTag, IconX } from './icons';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: IconDashboard },
  { href: '/admin/products', label: 'Products', icon: IconBox },
  { href: '/admin/coupons', label: 'Coupons', icon: IconTag },
  { href: '/admin/orders', label: 'Orders', icon: IconReceipt },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      <div className="admin-mobile-topbar">
        <div className="admin-nav-brand">
          <span className="admin-nav-brand-mark">S</span>
          SaasyCharms
        </div>
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      <aside className={`admin-sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="admin-nav-brand admin-sidebar-brand">
          <span className="admin-nav-brand-mark">S</span>
          SaasyCharms
        </div>

        <nav className="admin-nav-links">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                <Icon />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button type="button" className="admin-nav-logout" onClick={handleLogout}>
          <IconLogout size={16} />
          Logout
        </button>
      </aside>

      {mobileOpen ? (
        <div className="admin-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      ) : null}
    </>
  );
}
