'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { experiencias } from '@/data/experiencias';
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
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'target': Target,
  'eye': Eye,
  'globe': Globe,
  'lightbulb': Lightbulb,
  'refresh-cw': RefreshCw,
  'wheat': Wheat,
};

function ExperienciaCard({ exp }: { exp: typeof experiencias[0] }) {
  const Icon = iconMap[exp.icone] || Lightbulb;
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${exp.cor}15` }}>
          <Icon className="w-5 h-5" style={{ color: exp.cor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{exp.titulo}</p>
          <p className="text-xs text-gray-500 mt-0.5">{exp.descricao}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.duracao}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.local}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {exp.vagas} vagas</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {exp.skills.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{s}</span>
            ))}
          </div>
          {exp.impactoProntidao && (
            <p className="text-[10px] font-semibold text-verde-digital mt-2">+{exp.impactoProntidao}pp na prontidão</p>
          )}
          <button className="mt-3 text-xs font-semibold text-verde-digital hover:underline flex items-center gap-1">
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExperienciasPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const employee = getEmployeeById(currentPersona.employeeId);

  // Split into 3 sections
  const recomendadas = experiencias.slice(0, 4); // Top 4 based on gaps/aspiration
  const cooperativa = experiencias.filter(e => e.local.includes('Ipê') || e.local.includes('Caminhos'));
  const sistema = experiencias.filter(e => e.tipo === 'intercambio' || e.local.includes('Sistema'));
  // Fallback: if sistema is empty, show remaining ones
  const sistemaFinal = sistema.length > 0 ? sistema : experiencias.slice(4);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Experiências e Vivências</h1>
        <p className="text-sm text-gray-500 mt-1">Oportunidades práticas para expandir sua visão e acelerar seu desenvolvimento</p>
      </motion.div>

      {/* Seção 1: Recomendadas para você */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gradient-ai flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Recomendadas para você</h2>
          <span className="text-[10px] text-gray-400">Baseado na sua aspiração e gaps</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recomendadas.map(exp => (
            <ExperienciaCard key={exp.id} exp={exp} />
          ))}
        </div>
      </motion.div>

      {/* Seção 2: Disponíveis na minha cooperativa */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-800">Na minha cooperativa</h2>
          <span className="text-[10px] text-gray-400">Cooperativa Caminhos</span>
        </div>
        {cooperativa.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cooperativa.map(exp => (
              <ExperienciaCard key={exp.id} exp={exp} />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-500">Nenhuma experiência disponível na sua cooperativa no momento.</p>
          </div>
        )}
      </motion.div>

      {/* Seção 3: Sistema Sicredi */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-500" />
          <h2 className="text-sm font-semibold text-gray-800">Sistema Sicredi</h2>
          <span className="text-[10px] text-gray-400">Intercâmbios e programas sistêmicos</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sistemaFinal.map(exp => (
            <ExperienciaCard key={exp.id} exp={exp} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
