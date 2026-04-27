'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { experiencias, getExperienciasPorFamilia } from '@/data/experiencias';
import { motion } from 'framer-motion';
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
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

// Map icon string names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'target': Target,
  'eye': Eye,
  'globe': Globe,
  'lightbulb': Lightbulb,
  'refresh-cw': RefreshCw,
  'wheat': Wheat,
};

export default function ExperienciasPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  const role = employee ? getRoleById(employee.roleId) : null;
  const familia = role?.family || '';

  // Filter and sort by family relevance
  const recomendadas = getExperienciasPorFamilia(familia);
  const matchScores = experiencias.map(exp => {
    const isAlvo = exp.familiaAlvo?.includes(familia);
    return { ...exp, match: isAlvo ? 85 + Math.floor(Math.random() * 10) : 60 + Math.floor(Math.random() * 15) };
  }).sort((a, b) => b.match - a.match);

  const aspiracao = employee?.aspirations[0];
  const cargoAspirado = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Experiências e Vivências</h1>
        <p className="text-sm text-gray-500 mt-1">Projetos especiais, job shadow, intercâmbios e missões que aceleram seu desenvolvimento</p>
      </motion.div>

      {/* AI Banner */}
      <motion.div variants={item} className="card p-5 bg-gradient-to-r from-verde-50 to-white border-verde-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-verde-digital" />
          <p className="text-xs font-semibold text-verde-digital">Para Você</p>
        </div>
        <p className="text-sm text-gray-700">
          Encontramos <strong>{recomendadas.length} experiências</strong> alinhadas
          {cargoAspirado && <> à sua aspiração de <strong>{cargoAspirado.title}</strong></>}.
          {recomendadas[0]?.impactoProntidao && <> A vivência #1 pode aumentar sua prontidão em <strong>+{recomendadas[0].impactoProntidao}pp</strong>.</>}
        </p>
      </motion.div>

      {/* Experiences List */}
      <motion.div variants={item} className="space-y-4">
        {matchScores.map((exp) => {
          const IconComponent = iconMap[exp.icone] || Target;
          return (
            <div key={exp.id} className="card card-interactive p-5 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${exp.cor}15` }}>
                  <IconComponent className="w-5 h-5" style={{ color: exp.cor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{exp.titulo}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${exp.cor}15`, color: exp.cor }}>
                          {exp.tipo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exp.descricao}</p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.duracao}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.local}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> {exp.vagas} vaga{exp.vagas > 1 ? 's' : ''}</span>
                        {exp.impactoProntidao && (
                          <span className="text-xs text-verde-digital flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +{exp.impactoProntidao}pp</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${exp.match >= 85 ? 'bg-green-100 text-green-700' : exp.match >= 70 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {exp.match}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.skills.map((sk) => (
                      <span key={sk} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{sk}</span>
                    ))}
                  </div>

                  {exp.requisitos && exp.requisitos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exp.requisitos.map((req) => (
                        <span key={req} className="text-[10px] text-gray-400 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {req}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end mt-3">
                    <button className="text-xs font-semibold text-verde-digital flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Me candidatar <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
