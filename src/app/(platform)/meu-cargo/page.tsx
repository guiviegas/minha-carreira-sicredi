'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getPersonaHub } from '@/data/persona-hub';
import MeuCargoView from '@/components/meu-cargo/MeuCargoView';

export default function MeuCargoPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;
  const hub = getPersonaHub(currentPersona.id);
  if (!hub) return null;

  return (
    <MeuCargoView
      role={hub.cargoAtual}
      isOwn={true}
      cargoAspirado={hub.cargoAlvo}
    />
  );
}
