'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentPersona, isPersonaSelected } = usePersona();
  const router = useRouter();

  useEffect(() => {
    if (!isPersonaSelected) {
      router.push('/');
    }
  }, [isPersonaSelected, router]);

  if (!currentPersona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-verde-digital text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
