'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconTrash } from './icons';

export default function DeleteButton({ url, confirmText }: { url: string; confirmText: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmText)) return;
    setDeleting(true);
    try {
      await fetch(url, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button type="button" className="admin-btn-danger" onClick={handleDelete} disabled={deleting}>
      <IconTrash size={13} />
      {deleting ? 'Deleting…' : 'Delete'}
    </button>
  );
}
