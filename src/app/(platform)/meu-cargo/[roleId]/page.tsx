'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { usePersona } from '@/contexts/PersonaContext';
import { getRoleById } from '@/data/roles';
import { getPersonaHub } from '@/data/persona-hub';
import MeuCargoView from '@/components/meu-cargo/MeuCargoView';

interface Props {
  params: Promise<{ roleId: string }>;
}

export default function CargoDinamicoPage({ params }: Props) {
  const { roleId } = use(params);
  const { currentPersona } = usePersona();

  const role = getRoleById(roleId);
  if (!role) return notFound();

  const hub = currentPersona ? getPersonaHub(currentPersona.id) : null;
  const isOwn = hub?.cargoAtual.id === role.id;

  return (
    <MeuCargoView
      role={role}
      isOwn={isOwn}
      cargoAspirado={isOwn ? hub?.cargoAlvo : undefined}
      backHref={isOwn ? undefined : '/mapa-carreira'}
      backLabel="Voltar para o GPS de Carreira"
    />
  );
}
