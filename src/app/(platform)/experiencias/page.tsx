'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getPersonaHub } from '@/data/persona-hub';
import { experiencias, Experiencia } from '@/data/experiencias';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Eye,
  Globe,
  Lightbulb,
  RefreshCw,
  Wheat,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  target: Target,
  eye: Eye,
  globe: Globe,
  lightbulb: Lightbulb,
  'refresh-cw': RefreshCw,
  wheat: Wheat,
};

function ExperienciaCard({ exp, onClick }: { exp: Experiencia; onClick: () => void }) {
  const Icon = iconMap[exp.icone] || Lightbulb;
  return (
    <button onClick={onClick} className="card p-5 hover:shadow-md transition-shadow text-left w-full">
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${exp.cor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: exp.cor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{exp.titulo}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{exp.descricao}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {exp.duracao}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {exp.local}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {exp.vagas} vaga(s)
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {exp.skills.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                {s}
              </span>
            ))}
          </div>
          {exp.impactoProntidao && (
            <p className="text-[10px] font-semibold text-verde-digital mt-2">
              ★ Acelera prontidão para o cargo aspirado
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-verde-digital">
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function ExperienciasPage() {
  const { currentPersona } = usePersona();
  const [selected, setSelected] = useState<Experiencia | null>(null);
  const [interesseRegistrado, setInteresseRegistrado] = useState(false);

  if (!currentPersona) return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  const hub = getPersonaHub(currentPersona.id);

  // Recomendadas vindas do hub (já filtradas por aspiração + gap)
  const recomendadas = hub?.experienciasRecomendadas || experiencias.slice(0, 4);
  const cooperativa = experiencias.filter(
    (e) => e.local.includes('Ipê') || e.local.includes('Caminhos') || e.local.includes('Praça'),
  );
  const sistema = experiencias.filter((e) => e.tipo === 'intercambio' || e.local.includes('Sistema'));
  const sistemaFinal = sistema.length > 0 ? sistema : experiencias.slice(4);

  const handleManifestarInteresse = () => {
    setInteresseRegistrado(true);
    setTimeout(() => {
      setSelected(null);
      setInteresseRegistrado(false);
    }, 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Experiências e Vivências</h1>
        <p className="text-sm text-gray-500 mt-1">
          Oportunidades práticas para expandir sua visão e acelerar seu desenvolvimento
        </p>
      </motion.div>

      {/* Seção 1: Recomendadas */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gradient-ai flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Recomendadas para você</h2>
          {hub?.cargoAlvo && (
            <span className="text-[10px] text-gray-400">
              Baseado na sua aspiração: {hub.cargoAlvo.shortTitle}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recomendadas.map((exp) => (
            <ExperienciaCard key={exp.id} exp={exp} onClick={() => setSelected(exp)} />
          ))}
        </div>
      </motion.div>

      {/* Seção 2: Cooperativa */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-800">Na minha cooperativa</h2>
          <span className="text-[10px] text-gray-400">{currentPersona.cooperative}</span>
        </div>
        {cooperativa.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cooperativa.map((exp) => (
              <ExperienciaCard key={exp.id} exp={exp} onClick={() => setSelected(exp)} />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-500">Nenhuma experiência disponível na sua cooperativa no momento.</p>
          </div>
        )}
      </motion.div>

      {/* Seção 3: Sistema */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-500" />
          <h2 className="text-sm font-semibold text-gray-800">Sistema Sicredi</h2>
          <span className="text-[10px] text-gray-400">Intercâmbios e programas sistêmicos</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sistemaFinal.map((exp) => (
            <ExperienciaCard key={exp.id} exp={exp} onClick={() => setSelected(exp)} />
          ))}
        </div>
      </motion.div>

      {/* Modal: detalhes da experiência */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setSelected(null);
              setInteresseRegistrado(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {interesseRegistrado ? (
                <div className="text-center p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Interesse registrado!</p>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                    Sua liderança foi notificada e o time responsável pela experiência avaliará sua candidatura em até 5 dias úteis.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="h-24 relative"
                    style={{ background: `linear-gradient(135deg, ${selected.cor}DD 0%, ${selected.cor}88 100%)` }}
                  >
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                        {selected.tipo.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 -mt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow"
                        style={{ backgroundColor: selected.cor }}
                      >
                        {(() => {
                          const Icon = iconMap[selected.icone] || Lightbulb;
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mt-4">{selected.titulo}</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{selected.descricao}</p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-800">{selected.duracao}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Duração</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-800">{selected.vagas}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Vaga(s)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-800">{selected.local}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Local</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Você desenvolve</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.skills.map((s) => (
                          <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-verde-50 text-verde-digital">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selected.requisitos && selected.requisitos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Requisitos</p>
                        <ul className="space-y-1">
                          {selected.requisitos.map((r) => (
                            <li key={r} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-verde-digital mt-0.5 shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={handleManifestarInteresse}
                        className="flex-1 py-2.5 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors"
                      >
                        Manifestar interesse
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
