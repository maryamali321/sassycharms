import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = { title: 'Login' };

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
