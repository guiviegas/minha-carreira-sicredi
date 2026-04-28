'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Persona, PersonaId } from '@/types';
import { personas } from '@/data/personas';

const STORAGE_KEY = 'sicredi-persona-id';

interface PersonaContextValue {
  currentPersona: Persona | null;
  setPersona: (id: PersonaId) => void;
  clearPersona: () => void;
  personas: Persona[];
  isPersonaSelected: boolean;
  /** True quando a hidratação do localStorage terminou.
   * Evita redirect prematuro para a home enquanto o estado ainda não foi restaurado. */
  isHydrated: boolean;
}

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hidrata do localStorage no client-side (após mount)
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const persona = personas.find((p) => p.id === stored);
        if (persona) setCurrentPersona(persona);
      }
    } catch {
      // localStorage pode falhar em modo privado / SSR — ignora silenciosamente
    }
    setIsHydrated(true);
  }, []);

  const setPersona = useCallback((id: PersonaId) => {
    const persona = personas.find((p) => p.id === id);
    if (persona) {
      setCurrentPersona(persona);
      try {
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // ignora
      }
    }
  }, []);

  const clearPersona = useCallback(() => {
    setCurrentPersona(null);
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignora
    }
  }, []);

  return (
    <PersonaContext.Provider
      value={{
        currentPersona,
        setPersona,
        clearPersona,
        personas,
        isPersonaSelected: currentPersona !== null,
        isHydrated,
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
