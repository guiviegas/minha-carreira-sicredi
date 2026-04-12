'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { personas as allPersonas } from '@/data/personas';
import { Bell, Search, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PersonaId } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const personaPhotos: Record<string, string> = {
  mariana: '/personas/mariana.png',
  roberto: '/personas/roberto.png',
  carla: '/personas/carla.png',
  marcos: '/personas/marcos.png',
  lucas: '/personas/lucas.png',
  daniela: '/personas/daniela.png',
};

export default function Topbar() {
  const { currentPersona, setPersona } = usePersona();
  const [isPersonaPanelOpen, setIsPersonaPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPersonaPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentPersona) return null;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = currentPersona.name.split(' ')[0];

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left — Greeting */}
      <div>
        <p className="text-sm text-neutral-400">{greeting},</p>
        <p className="text-base font-bold text-neutral-900 -mt-0.5">{firstName}</p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="w-9 h-9 rounded-lg border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-colors">
          <Search className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-colors relative">
          <Bell className="w-4 h-4 text-neutral-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Persona Switcher */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setIsPersonaPanelOpen(!isPersonaPanelOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden relative shrink-0">
              <Image
                src={personaPhotos[currentPersona.id] || ''}
                alt={currentPersona.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-neutral-700 hidden sm:block">{firstName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isPersonaPanelOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isPersonaPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-elevated border border-neutral-200 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Trocar Persona</p>
                </div>
                <div className="py-1">
                  {allPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setPersona(persona.id as PersonaId);
                        setIsPersonaPanelOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-50 transition-colors ${
                        currentPersona.id === persona.id ? 'bg-verde-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0">
                        <Image
                          src={personaPhotos[persona.id] || ''}
                          alt={persona.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-800 truncate">{persona.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{persona.jobTitle}</p>
                      </div>
                      {currentPersona.id === persona.id && (
                        <Check className="w-4 h-4 text-verde-digital shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
