'use client';

import { useRouter } from 'next/navigation';
import { usePersona } from '@/contexts/PersonaContext';
import { motion } from 'framer-motion';
import { PersonaId } from '@/types';
import { Compass, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const personaDetails: Record<PersonaId, { gradient: string; photo: string; challenge: string }> = {
  mariana: {
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#4CAF50]',
    photo: '/personas/mariana.png',
    challenge: 'Quer crescer para Gerente de Agência. Busca clareza sobre o que desenvolver e oportunidades práticas de liderança.',
  },
  roberto: {
    gradient: 'from-[#0D47A1] via-[#1565C0] to-[#42A5F5]',
    photo: '/personas/roberto.png',
    challenge: 'Lidera 5 pessoas na agência. Precisa de ferramentas para desenvolver, acompanhar e reter talentos do time.',
  },
  carla: {
    gradient: 'from-[#4A148C] via-[#6A1B9A] to-[#AB47BC]',
    photo: '/personas/carla.png',
    challenge: 'Responsável pela gestão de 400 colaboradores. Precisa de dados integrados e visão estratégica de gestão de pessoas.',
  },
};

export default function HomePage() {
  const router = useRouter();
  const { setPersona, personas } = usePersona();

  const handleSelectPersona = (id: PersonaId) => {
    setPersona(id);
    router.push('/meu-gps');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Hero */}
      <header className="gradient-hero text-white relative overflow-hidden" style={{ minHeight: '260px' }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Radial glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(94,167,53,0.5) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }} />
        
        <div className="max-w-6xl mx-auto relative z-10 px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">Minha Carreira Sicredi</h1>
                <p className="text-green-200/80 text-sm font-semibold mt-0.5">Sicredi · Interface de Gestão de Carreira Integrada</p>
              </div>
            </div>
            <p className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed font-medium">
              Este é um protótipo de como seria visualizar a interface integrada de gestão de carreira.
              Escolha uma das personas abaixo para navegar pela interface a partir da visão de cada perfil profissional.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Persona Selector */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <motion.p
          className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Selecione uma persona para começar
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {personas.map((persona, i) => {
            const details = personaDetails[persona.id];
            return (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                onClick={() => handleSelectPersona(persona.id)}
                className="card card-interactive text-left p-0 overflow-hidden group"
              >
                {/* Photo + Gradient Header */}
                <div className={`bg-gradient-to-r ${details.gradient} relative overflow-hidden`} style={{ height: '160px' }}>
                  {/* Photo */}
                  <div className="absolute right-0 bottom-0 w-[55%] h-full">
                    <Image
                      src={details.photo}
                      alt={persona.name}
                      fill
                      className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 40%), linear-gradient(to bottom, transparent 0%, black 25%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%), linear-gradient(to bottom, transparent 0%, black 25%)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'destination-in',
                      }}
                    />
                  </div>
                  {/* Text */}
                  <div className="relative z-10 px-5 py-4 flex flex-col justify-end h-full">
                    <p className="text-xl font-extrabold text-white drop-shadow-sm">{persona.name}</p>
                    <p className="text-sm text-white/90 font-medium">{persona.jobTitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 py-4 space-y-3">
                  <p className="text-xs text-neutral-500">{persona.description}</p>
                  <p className="text-sm text-neutral-700 leading-relaxed">{details.challenge}</p>
                  <span className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-verde-digital text-white text-sm font-bold group-hover:bg-verde-600 transition-colors w-full justify-center">
                    Acessar interface <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
