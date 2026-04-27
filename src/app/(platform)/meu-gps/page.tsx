'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { avaliacoesMock, reguaPerformance, reguaProntidao } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
  AlertTriangle,
  Zap,
  Target,
  ArrowRight,
  Clock,
  Star,
  PlayCircle,
  Compass,
  Calendar,
  MessageCircle,
  BarChart3,
  FileText,
  Shield,
} from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MeuGPSPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;

  const role = getRoleById(employee.roleId);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Início</h1>
            <p className="text-sm text-gray-500 mt-1">
              {role?.title} · {currentPersona.cooperative}
              {currentPersona.branch && ` · ${currentPersona.branch}`}
            </p>
          </div>
          {(() => {
            const avaliacao = avaliacoesMock.find(a => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1');
            if (!avaliacao) return null;
            const perfConfig = reguaPerformance[avaliacao.notaFinalPerformance - 1];
            const prontConfig = avaliacao.prontidaoId ? reguaProntidao.find(r => r.id === avaliacao.prontidaoId) : null;
            return (
              <div className="flex items-center gap-2">
                {perfConfig && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: perfConfig.bgCor, color: perfConfig.cor }}>
                    {perfConfig.hashtag}
                  </span>
                )}
                {prontConfig && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: prontConfig.bgCor, color: prontConfig.cor }}>
                    {prontConfig.nome}
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      </motion.div>

      {currentPersona.role === 'colaborador' && <ColaboradorDashboard employee={employee} />}
      {currentPersona.role === 'lider' && <LiderDashboard employee={employee} />}
      {currentPersona.role === 'pc_analista' && <PCAnalistaDashboard employee={employee} />}
    </motion.div>
  );
}

// ===== MARIANA — Hub de Desenvolvimento Pessoal =====
function ColaboradorDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee) return null;
  const readiness = employee.readinessScores[0];
  const targetRole = readiness ? getRoleById(readiness.targetRoleId) : null;
  const aspiration = employee.aspirations[0];
  const aspirationRole = aspiration ? getRoleById(aspiration.targetRoleId) : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Row 1: Aspiração + PDI + Próxima Conversa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Minha Aspiração */}
        <motion.div variants={item} className="card p-5 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-verde-50 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-verde-digital" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minha Aspiração</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{aspirationRole?.title || 'Não definida'}</p>
          <p className="text-xs text-gray-500 mt-1">Horizonte: {aspiration?.timeframe || 'a definir'}</p>

          {readiness && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase">Prontidão</p>
              {(() => {
                const prontLabel = readiness.score >= 80 ? 'Pronto' : readiness.score >= 65 ? 'Quase pronto' : readiness.score >= 50 ? 'Em desenvolvimento' : 'Início da jornada';
                const prontColor = readiness.score >= 80 ? 'text-green-600 bg-green-50' : readiness.score >= 65 ? 'text-verde-digital bg-verde-50' : readiness.score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-orange-600 bg-orange-50';
                return (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${prontColor}`}>
                    {prontLabel}
                  </span>
                );
              })()}
            </div>
          )}

          <button className="flex items-center gap-1.5 text-sm font-semibold text-verde-digital mt-4 hover:gap-2.5 transition-all">
            Ver no GPS de Carreira <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Meu PDI */}
        <motion.div variants={item} className="card p-5 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Meu PDI</p>
          </div>
          <div className="space-y-2.5">
            {[
              { text: 'Trilha de Liderança Essencial', status: 'Em andamento', color: 'text-verde-digital' },
              { text: 'Mentoria com GA experiente', status: 'Pendente', color: 'text-amber-600' },
              { text: 'Certificação CPA-20', status: 'Planejado', color: 'text-gray-400' },
            ].map((init, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm text-gray-700 truncate mr-2">{init.text}</p>
                <span className={`text-[10px] font-semibold ${init.color} whitespace-nowrap`}>{init.status}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 mt-4 hover:gap-2.5 transition-all">
            Ver PDI completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Próxima Conversa */}
        <motion.div variants={item} className="card p-5 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Próxima conversa</p>
          </div>
          <p className="text-sm font-semibold text-gray-800">1:1 com Roberto Mendes</p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Quinta-feira, 14h
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-gray-50">
            <p className="text-[11px] text-gray-500 font-medium">Sugestão de pauta do Theo:</p>
            <p className="text-xs text-gray-700 mt-1">Conversar sobre aspiração de carreira e progresso na trilha de Liderança</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 mt-3 hover:gap-2.5 transition-all">
            Preparar conversa <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Row 2: Theo Nudges + Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Theo Nudges (2 cols) */}
        <motion.div variants={item} className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md gradient-ai flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Theo recomenda</p>
          </div>
          {[
            {
              text: 'Você ainda não preencheu a autoavaliação do ciclo atual. O prazo encerra em 5 dias.',
              action: 'Preencher agora',
              color: 'border-l-amber-400 bg-amber-50/30',
            },
            {
              text: 'Há uma vivência prática de acompanhamento de Gerente de Agência disponível na Cooperativa Caminhos.',
              action: 'Ver experiência',
              color: 'border-l-verde-digital bg-verde-50/30',
            },
            {
              text: 'Seu módulo de Liderança Essencial está parado há 2 semanas. Retomar pode acelerar sua prontidão.',
              action: 'Retomar trilha',
              color: 'border-l-purple-400 bg-purple-50/30',
            },
          ].map((nudge, i) => (
            <div key={i} className={`card p-4 border-l-4 ${nudge.color}`}>
              <p className="text-sm text-gray-700">{nudge.text}</p>
              <button className="text-xs font-semibold text-verde-digital mt-2 hover:underline">
                {nudge.action} →
              </button>
            </div>
          ))}
        </motion.div>

        {/* Checklist semanal */}
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-verde-digital" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Esta semana</p>
            </div>
            <span className="text-xs font-semibold text-verde-digital">2/4</span>
          </div>
          <div className="space-y-2">
            {[
              { text: 'Revisão 1:1 com Roberto', done: true },
              { text: 'Módulo Liderança Essencial', done: true },
              { text: 'Atualizar autoavaliação', done: false },
              { text: 'Reflexão: diário de carreira', done: false },
            ].map((task, i) => (
              <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  task.done
                    ? 'bg-verde-digital border-verde-digital text-white'
                    : 'border-gray-300 group-hover:border-verde-digital'
                }`}>
                  {task.done && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ===== ROBERTO — Líder Dashboard (Carreira + Equipe) =====
function LiderDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee) return null;
  const team = getTeamForLeader(employee.id);
  const aspiration = employee.aspirations[0];
  const aspirationRole = aspiration ? getRoleById(aspiration.targetRoleId) : null;

  const getStatusColor = (emp: NonNullable<ReturnType<typeof getEmployeeById>>) => {
    if (emp.turnoverRisk && emp.turnoverRisk.probability > 70) return { color: 'red', label: 'Risco', dotClass: 'status-dot-red' };
    if (emp.onboarding && emp.onboarding.percentage < 100) return { color: 'blue', label: 'Onboarding', dotClass: 'status-dot-blue' };
    if (emp.engagementScore < 60) return { color: 'yellow', label: 'Atenção', dotClass: 'status-dot-yellow' };
    return { color: 'green', label: 'No caminho', dotClass: 'status-dot-green' };
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Row 1: Carreira Pessoal + Equipe Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Carreira Pessoal */}
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minha Carreira</p>
          </div>
          <p className="text-sm text-gray-500">Aspiração</p>
          <p className="text-lg font-bold text-gray-900">{aspirationRole?.title || 'Gerente Regional'}</p>
          <p className="text-xs text-gray-500 mt-1">Horizonte: {aspiration?.timeframe || '3-5 anos'}</p>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <p className="text-xs text-gray-600">Atualizar seu PDI do trimestre</p>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-verde-digital" />
              <p className="text-xs text-gray-600">Programa Líderes com vagas abertas</p>
            </div>
          </div>
        </motion.div>

        {/* Equipe Status */}
        <motion.div variants={item} className="card p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minha Equipe</p>
              <span className="text-xs text-gray-400">({team.length})</span>
            </div>
            <button className="text-xs text-verde-digital font-semibold hover:underline">Ver equipe completa →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {team.slice(0, 5).map((member) => {
              const status = getStatusColor(member);
              const memberRole = getRoleById(member.roleId);
              return (
                <div key={member.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg avatar-initials text-[10px]" style={{
                      backgroundColor: status.color === 'green' ? '#16A34A' : status.color === 'yellow' ? '#D97706' : status.color === 'red' ? '#DC2626' : '#2563EB'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{member.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-500">{memberRole?.shortTitle}</p>
                    </div>
                    <div className={`status-dot ${status.dotClass}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Alerta de Turnover */}
      {team.some(t => t.turnoverRisk && t.turnoverRisk.probability > 70) && (
        <motion.div variants={item} className="card p-4 border-l-4 border-l-red-400 bg-red-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Alerta de risco de saída</p>
              <p className="text-sm text-red-700 mt-0.5">
                Juliana Pereira apresenta sinais de risco. Recomendação: agendar conversa de retenção esta semana.
              </p>
              <button className="text-sm font-semibold text-red-600 mt-2 hover:text-red-800 flex items-center gap-1">
                Ver detalhes e ações <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Theo Nudges Líder */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { text: 'Juliana Pereira não teve conversa de carreira nos últimos 3 meses', action: 'Agendar conversa', color: 'border-l-amber-400' },
          { text: 'André Moreira concluiu a trilha de Crédito Rural Avançado', action: 'Dar reconhecimento', color: 'border-l-verde-digital' },
        ].map((nudge, i) => (
          <div key={i} className={`card p-4 border-l-4 ${nudge.color}`}>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{nudge.text}</p>
                <button className="text-xs font-semibold text-verde-digital mt-2 hover:underline">{nudge.action} →</button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ===== CARLA — P&C Dashboard =====
function PCAnalistaDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee) return null;
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'PDIs Ativos', value: '78%', trend: '+5pp', status: 'green' },
          { label: 'Avaliações Concluídas', value: '82%', trend: 'Ciclo Q3', status: 'green' },
          { label: 'Sucessores GA Mapeados', value: '3/5', trend: '60%', status: 'yellow' },
          { label: 'Turnover Trimestral', value: '4,2%', trend: '-1,1pp', status: 'green' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            <p className={`text-xs font-semibold mt-1 ${kpi.status === 'green' ? 'text-green-600' : 'text-amber-600'}`}>
              {kpi.trend}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Theo Nudges P&C */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md gradient-ai flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-500">Theo recomenda</p>
        </div>
        {[
          { text: '5 PDIs sem revisão há mais de 90 dias. Considere notificar os líderes responsáveis.', action: 'Gerar lista' },
          { text: '12 colaboradores completarão 3 anos no grade este trimestre. Avaliar janela de movimentação.', action: 'Ver colaboradores' },
          { text: 'Comitê de Carreira da Agência Ipê em 7 dias. 2 fichas de preparação pendentes.', action: 'Preparar comitê' },
        ].map((nudge, i) => (
          <div key={i} className="card p-4 border-l-4 border-l-purple-300 bg-purple-50/20">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{nudge.text}</p>
                <button className="text-xs font-semibold text-purple-600 mt-2 hover:underline">{nudge.action} →</button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Ações Rápidas */}
      <motion.div variants={item} className="card p-5">
        <p className="text-sm font-semibold text-gray-500 mb-3">Acesse o Painel de Pessoas para análise completa →</p>
        <p className="text-sm text-gray-600">14 pessoas prontas para movimentação · 23 planos em atraso · 2 lacunas de sucessão</p>
      </motion.div>
    </motion.div>
  );
}
