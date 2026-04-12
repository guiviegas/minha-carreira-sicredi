'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Persona, PersonaId } from '@/types';
import { personas } from '@/data/personas';

interface PersonaContextValue {
  currentPersona: Persona | null;
  setPersona: (id: PersonaId) => void;
  personas: Persona[];
  isPersonaSelected: boolean;
}

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);

  const setPersona = useCallback((id: PersonaId) => {
    const persona = personas.find(p => p.id === id);
    if (persona) setCurrentPersona(persona);
  }, []);

  return (
    <PersonaContext.Provider
      value={{
        currentPersona,
        setPersona,
        personas,
        isPersonaSelected: currentPersona !== null,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) throw new Error('usePersona must be used within PersonaProvider');
  return context;
}
