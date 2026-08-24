import { CartProvider } from '@/components/CartProvider';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import ScrollRevealInit from '@/components/ScrollRevealInit';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Navbar />
      {children}
      <ScrollRevealInit />
    </CartProvider>
  );
}
