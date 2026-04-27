'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getPdiForPersona } from '@/data/pdi';
import { getRoleById } from '@/data/roles';
import { reguaPerformance } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  Target, CheckCircle2, Circle, Clock, ArrowRight,
  BookOpen, Users, Briefcase, Award, Lightbulb,
  Bot, Calendar, TrendingUp, ChevronRight, Sparkles,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const typeConfig: Record<string, { label: string; color: string; bg: string; Icon: typeof BookOpen }> = {
  trilha: { label: 'Trilha', color: 'text-verde-digital', bg: 'bg-verde-50', Icon: BookOpen },
  mentoria: { label: 'Mentoria', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Users },
  projeto: { label: 'Projeto', color: 'text-orange-600', bg: 'bg-orange-50', Icon: Briefcase },
  certificacao: { label: 'Certificação', color: 'text-purple-600', bg: 'bg-purple-50', Icon: Award },
  livre: { label: 'Livre', color: 'text-gray-600', bg: 'bg-gray-100', Icon: Lightbulb },
};

const statusConfig: Record<string, { label: string; color: string; Icon: typeof Circle }> = {
  pending: { label: 'Pendente', color: 'text-gray-400', Icon: Circle },
  in_progress: { label: 'Em andamento', color: 'text-verde-digital', Icon: Clock },
  completed: { label: 'Concluído', color: 'text-green-500', Icon: CheckCircle2 },
};

export default function PdiPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const pdi = getPdiForPersona(currentPersona.id);
  if (!pdi) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-gray-900">Meu PDI</h1>
          <p className="text-sm text-gray-500 mt-1">Plano de Desenvolvimento Individual</p>
        </motion.div>
        <motion.div variants={item} className="card p-8 text-center">
          <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nenhum PDI configurado para esta persona.</p>
          <p className="text-xs text-gray-400 mt-1">Converse com seu líder para definir seus objetivos de desenvolvimento.</p>
        </motion.div>
      </motion.div>
    );
  }

  const targetRole = getRoleById(pdi.goal.targetRoleId);
  const activeActions = pdi.actions.filter(a => a.status !== 'completed');
  const completedActions = pdi.actions.filter(a => a.status === 'completed');
  const nextCheckIn = pdi.checkIns.find(c => c.type === 'scheduled');
  const lastCheckIn = [...pdi.checkIns].reverse().find(c => c.type === 'completed');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Meu PDI</h1>
        <p className="text-sm text-gray-500 mt-1">Plano de Desenvolvimento Individual: seu caminho, suas escolhas</p>
      </motion.div>

      {/* Goal Card */}
      <motion.div variants={item} className="card p-5 border-l-4 border-verde-digital">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Meta de Carreira</p>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-verde-digital" />
              {pdi.goal.targetRoleTitle}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Nível {targetRole?.level} · Prazo: {pdi.goal.deadline}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-3xl font-extrabold text-verde-digital metric-value">{pdi.goal.progress}%</p>
              <p className="text-xs text-gray-400">Progresso</p>
            </div>
            <a
              href="/mapa-carreira"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-verde-digital text-white text-xs font-semibold hover:bg-verde-600 transition-colors shrink-0"
              title="Ver Plano de Rota completo no GPS"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ver no GPS
            </a>
          </div>
        </div>
        <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-verde-digital to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${pdi.goal.progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Actions + Completed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Actions */}
          <motion.div variants={item} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-verde-digital" />
                Ações em Andamento
              </h3>
              <span className="text-xs text-gray-400 metric-value">{activeActions.length} ações</span>
            </div>
            <div className="space-y-2.5">
              {activeActions.map((action) => {
                const cfg = typeConfig[action.type];
                const sts = statusConfig[action.status];
                return (
                  <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer">
                    <sts.Icon className={`w-4 h-4 mt-0.5 shrink-0 ${sts.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-verde-digital transition-colors">{action.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{action.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} font-medium`}>
                          {cfg.label}
                        </span>
                        {action.dueDate && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" /> {action.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-verde-digital transition-colors mt-0.5" />
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Competências Jeito Sicredi: chips com hashtag oficial (atual → alvo) */}
          <motion.div variants={item} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Competências Jeito Sicredi
              </h3>
              <a
                href="/avaliacao"
                className="text-[11px] text-verde-digital font-semibold hover:underline flex items-center gap-1"
              >
                Ver na Avaliação <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Conceito atual (consenso da avaliação) e o esperado para sua aspiração.
            </p>
            <div className="space-y-2">
              {pdi.competencies.map((comp) => {
                // Mapeia 1-4 → régua oficial (mesma fonte da Avaliação)
                const atualConfig = reguaPerformance[comp.current - 1] || reguaPerformance[0];
                const alvoConfig = reguaPerformance[comp.target - 1] || reguaPerformance[3];
                const atende = comp.current >= comp.target;
                return (
                  <div
                    key={comp.name}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border ${
                      atende ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100'
                    }`}
                  >
                    <span className="text-xs font-medium text-gray-700 truncate">{comp.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                      <span
                        className="font-bold px-1.5 py-0.5 rounded-md"
                        style={{ backgroundColor: atualConfig.bgCor, color: atualConfig.cor }}
                      >
                        {atualConfig.hashtag}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span
                        className="font-bold px-1.5 py-0.5 rounded-md"
                        style={{ backgroundColor: alvoConfig.bgCor, color: alvoConfig.cor }}
                      >
                        {alvoConfig.hashtag}
                      </span>
                      {atende && <CheckCircle2 className="w-3 h-3 text-green-500 ml-1" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Completed Actions */}
          {completedActions.length > 0 && (
            <motion.div variants={item} className="card p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Concluídos
              </h3>
              <div className="space-y-2">
                {completedActions.map((action) => {
                  const cfg = typeConfig[action.type];
                  return (
                    <div key={action.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-green-50/50">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 line-through">{action.title}</p>
                        <span className={`text-[10px] ${cfg.color}`}>{cfg.label} · {action.completedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right column: Theo Suggestions + Check-ins */}
        <div className="space-y-4">
          {/* Theo Suggestions */}
          <motion.div variants={item} className="card p-5 border border-verde-digital/10 bg-verde-50/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-verde-digital flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Sugestões do Theo</p>
                <p className="text-[10px] text-gray-400">Baseado nos seus gaps e aspirações</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {pdi.theoSuggestions.map((sug) => {
                const priorityColor = sug.priority === 'high' ? 'border-l-orange-400' : sug.priority === 'medium' ? 'border-l-blue-300' : 'border-l-gray-300';
                return (
                  <div key={sug.id} className={`p-3 rounded-lg bg-white border border-gray-100 border-l-[3px] ${priorityColor} cursor-pointer hover:shadow-sm transition-shadow`}>
                    <p className="text-xs font-semibold text-gray-800">{sug.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{sug.description}</p>
                    <button className="text-[10px] text-verde-digital font-semibold mt-1.5 flex items-center gap-0.5 hover:underline">
                      Ver mais <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Check-ins */}
          <motion.div variants={item} className="card p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Acompanhamento com Líder
            </h3>
            {nextCheckIn && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 mb-3">
                <p className="text-xs font-semibold text-blue-700">Próxima reunião</p>
                <p className="text-sm font-bold text-blue-900 mt-0.5">
                  {new Date(nextCheckIn.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
                <p className="text-[11px] text-blue-600 mt-0.5">com {nextCheckIn.leaderName}</p>
              </div>
            )}
            {lastCheckIn && (
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <p className="text-[11px] font-semibold text-gray-600">
                    Última reunião · {new Date(lastCheckIn.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <p className="text-xs text-gray-500 italic">&ldquo;{lastCheckIn.notes}&rdquo;</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
