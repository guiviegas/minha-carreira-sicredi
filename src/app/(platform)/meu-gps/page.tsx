'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
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

  // Render different dashboard based on persona role
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Início</h1>
        <p className="text-sm text-gray-500 mt-1">
          {role?.title} · {currentPersona.cooperative}
          {currentPersona.branch && ` · ${currentPersona.branch}`}
        </p>
      </motion.div>

      {/* Adaptive Widgets based on persona */}
      {currentPersona.role === 'colaborador' && <ColaboradorDashboard employee={employee} />}
      {currentPersona.role === 'lider' && <LiderDashboard employee={employee} />}
      {currentPersona.role === 'pc_analista' && <PCAnalistaDashboard employee={employee} />}
      {currentPersona.role === 'diretor' && <DiretorDashboard />}
      {currentPersona.role === 'novo_colaborador' && <NovoColaboradorDashboard employee={employee} />}
      {currentPersona.role === 'pc_diretor_cas' && <CASDirectorDashboard />}
    </motion.div>
  );
}

// ===== MARIANA — Colaborador Dashboard =====
function ColaboradorDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee) return null;
  const readiness = employee.readinessScores[0];
  const targetRole = readiness ? getRoleById(readiness.targetRoleId) : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Readiness Thermometer */}
      {readiness && targetRole && (
        <motion.div variants={item} className="card p-5 md:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Compatibilidade</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">→ {targetRole.title}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-verde-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-verde-digital" />
            </div>
          </div>
          <div className="space-y-2.5">
            {Object.entries(readiness.components).map(([key, value]) => {
              const labels: Record<string, string> = {
                skills: 'Competências',
                experience: 'Experiência',
                performance: 'Performance',
                development: 'Desenvolvimento',
                leadership: 'Liderança',
              };
              const getLabel = (v: number) => {
                if (v >= 80) return { text: 'Supera', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' };
                if (v >= 65) return { text: 'Atende', color: 'text-verde-digital', bg: 'bg-verde-50', dot: 'bg-verde-digital' };
                if (v >= 50) return { text: 'Próximo', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' };
                return { text: 'Desenvolver', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-400' };
              };
              const compat = getLabel(value);
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${compat.dot}`} />
                    <span className="text-xs text-gray-600">{labels[key] || key}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${compat.bg} ${compat.color}`}>
                    {compat.text}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Gig Recommendation */}
      <motion.div variants={item} className="card p-5 border-l-4 border-l-purple-400">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Recomendação IA</p>
        </div>
        <p className="text-sm font-semibold text-gray-800">Novo projeto disponível!</p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Liderar o projeto de satisfação Q3 na Agência Centro (4 semanas)
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
            92% match
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700">
            +4% compatibilidade GA
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-verde-digital mt-4 hover:gap-2.5 transition-all">
          Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Micro Learning */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <PlayCircle className="w-4 h-4 text-verde-digital" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Inspiração</p>
        </div>
        <div className="aspect-video rounded-lg relative overflow-hidden mb-3 cursor-pointer group">
          <img src="/videos/ana-luisa-thumbnail.png" alt="Ana Luísa" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
            <p className="text-xs text-white/80 font-medium">3:24</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-800">A jornada de Ana Luísa até Gerente de Agência</p>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" /> 3 min · Histórias Sicredi
        </p>
      </motion.div>

      {/* Weekly Checklist */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-verde-digital" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Semana</p>
          </div>
          <span className="text-xs font-semibold text-verde-digital metric-value">2/5</span>
        </div>
        <div className="space-y-2">
          {[
            { text: 'Module: Coaching Essentials', done: true },
            { text: 'Revisão 1:1 com Roberto', done: true },
            { text: 'Completar assessment de liderança', done: false },
            { text: 'Artigo: Gestão de conflitos', done: false },
            { text: 'Reflexão: Diário de carreira', done: false },
          ].map((task, i) => (
            <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border ${
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

      {/* AI Nudge */}
      <motion.div variants={item} className="card p-5 bg-gradient-to-br from-purple-50 to-white border-purple-100 md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg gradient-ai flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-xs font-semibold text-purple-600">Parceiro de Jornada</p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          &ldquo;Sua 1:1 com Roberto é quinta-feira. Quer preparar pontos sobre sua aspiração de GA? 
          Vi que seus índices de satisfação estão no Top 3!&rdquo;
        </p>
        <div className="flex gap-2 mt-3">
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
            Preparar 1:1
          </button>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            Mais tarde
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="card p-5 md:col-span-2 lg:col-span-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Meus Indicadores</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Satisfação Associados', value: 'Top 3', icon: Star, color: '#F59E0B' },
            { label: 'Meta Trimestral', value: '94%', icon: Target, color: '#3FA110' },
            { label: 'Cross-selling', value: '-12%', icon: TrendingUp, color: '#DC2626' },
            { label: 'XP Total', value: '1.400', icon: Zap, color: '#7C3AED' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 metric-value">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== ROBERTO — Líder Dashboard =====
function LiderDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee) return null;
  const team = getTeamForLeader(employee.id);

  const getStatusColor = (emp: NonNullable<ReturnType<typeof getEmployeeById>>) => {
    if (emp.turnoverRisk && emp.turnoverRisk.probability > 70) return { color: 'red', label: 'Risco Alto', dotClass: 'status-dot-red' };
    if (emp.onboarding && emp.onboarding.percentage < 100) return { color: 'blue', label: 'Onboarding', dotClass: 'status-dot-blue' };
    if (emp.engagementScore < 60) return { color: 'yellow', label: 'Atenção', dotClass: 'status-dot-yellow' };
    return { color: 'green', label: 'No caminho', dotClass: 'status-dot-green' };
  };

  const statusCounts = { green: 0, yellow: 0, red: 0, blue: 0 };
  team.forEach(t => {
    const s = getStatusColor(t);
    statusCounts[s.color as keyof typeof statusCounts]++;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="status-dot status-dot-green status-dot-pulse" />
          <div>
            <p className="text-lg font-bold text-gray-900 metric-value">{statusCounts.green}</p>
            <p className="text-[11px] text-gray-500">No caminho</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="status-dot status-dot-yellow status-dot-pulse" />
          <div>
            <p className="text-lg font-bold text-gray-900 metric-value">{statusCounts.yellow}</p>
            <p className="text-[11px] text-gray-500">Atenção</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="status-dot status-dot-red status-dot-pulse" />
          <div>
            <p className="text-lg font-bold text-gray-900 metric-value">{statusCounts.red}</p>
            <p className="text-[11px] text-gray-500">Risco</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="status-dot status-dot-blue status-dot-pulse" />
          <div>
            <p className="text-lg font-bold text-gray-900 metric-value">{statusCounts.blue}</p>
            <p className="text-[11px] text-gray-500">Onboarding</p>
          </div>
        </div>
      </motion.div>

      {/* AI Alert */}
      {team.some(t => t.turnoverRisk && t.turnoverRisk.probability > 70) && (
        <motion.div variants={item} className="card p-4 border-l-4 border-l-red-400 bg-red-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Alerta de Turnover</p>
              <p className="text-sm text-red-700 mt-0.5">
                Juliana Pereira tem <span className="font-bold">78% de probabilidade</span> de sair nos próximos 90 dias. 
                Recomendação: agendar stay conversation esta semana.
              </p>
              <button className="text-sm font-semibold text-red-600 mt-2 hover:text-red-800 flex items-center gap-1">
                Ver detalhes e ações <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Team Grid */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Minha Equipe</h2>
            <span className="text-sm text-gray-400">({team.length})</span>
          </div>
          <button className="text-sm text-verde-digital font-semibold hover:underline">
            Ver dashboard completo →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.map((member) => {
            const status = getStatusColor(member);
            const memberRole = getRoleById(member.roleId);
            return (
              <div
                key={member.id}
                className={`card card-interactive p-4 border-l-4`}
                style={{ borderLeftColor: status.color === 'green' ? '#22C55E' : status.color === 'yellow' ? '#F59E0B' : status.color === 'red' ? '#EF4444' : '#3B82F6' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg avatar-initials text-[11px]" style={{ backgroundColor: status.color === 'green' ? '#16A34A' : status.color === 'yellow' ? '#D97706' : status.color === 'red' ? '#DC2626' : '#2563EB' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-800 truncate">{member.name}</p>
                    <p className="text-[11px] text-neutral-500">{memberRole?.shortTitle}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className={`status-dot ${status.dotClass}`} />
                      <span className="text-[11px] text-neutral-500">{status.label}</span>
                    </div>
                    {member.aspirations.length > 0 && (
                      <p className="text-[11px] text-purple-500 mt-1">
                        → {getRoleById(member.aspirations[0].targetRoleId)?.shortTitle}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold metric-value" style={{ color: member.engagementScore > 70 ? '#22C55E' : member.engagementScore > 50 ? '#F59E0B' : '#EF4444' }}>
                      {member.engagementScore}
                    </p>
                    <p className="text-[10px] text-gray-400">engaj.</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Agendar 1:1', icon: Users, color: '#2563EB' },
          { label: 'Stay Interview', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Plano Sucessão', icon: TrendingUp, color: '#3FA110' },
          { label: 'Feedback Rápido', icon: Sparkles, color: '#8B5CF6' },
        ].map((action) => (
          <button key={action.label} className="card card-interactive p-4 flex items-center gap-3 hover:border-gray-300">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
              <action.icon className="w-4 h-4" style={{ color: action.color }} />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ===== CARLA — P&C Analista =====
function PCAnalistaDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee) return null;
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Saúde de Carreira', value: '62%', trend: '+3pp', status: 'yellow' },
          { label: 'Turnover Trimestre', value: 'R$ 2,1M', trend: '-12%', status: 'green' },
          { label: 'eNPS', value: '42', trend: '+4', status: 'green' },
          { label: 'Career NPS', value: '28', trend: '+5', status: 'yellow' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 metric-value mt-1">{kpi.value}</p>
            <p className={`text-xs font-semibold mt-1 ${kpi.status === 'green' ? 'text-green-600' : 'text-amber-600'}`}>
              {kpi.trend}
            </p>
          </div>
        ))}
      </motion.div>
      <motion.div variants={item} className="card p-5">
        <p className="text-sm font-semibold text-gray-500 mb-3">Acesse o Dashboard P&C para análise completa →</p>
        <p className="text-sm text-gray-600">14 pessoas prontas para movimentação · 23 planos em atraso · 2 gaps de sucessão</p>
      </motion.div>
    </motion.div>
  );
}

// ===== MARCOS — Diretor =====
function DiretorDashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Retenção Top Performers', value: '88%', target: '90%', status: 'yellow' as const, icon: Users },
          { label: 'Economia vs. Turnover', value: 'R$ 1,2M', target: 'R$ 1,5M', status: 'green' as const, icon: TrendingUp },
          { label: 'Tempo Produtividade', value: '5,2 m', target: '4 m', status: 'green' as const, icon: Clock },
          { label: 'Prontidão Sucessória', value: '75%', target: '85%', status: 'yellow' as const, icon: Target },
        ].map((kpi) => (
          <div key={kpi.label} className="card card-interactive p-5">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-5 h-5 text-gray-400" />
              <div className={`w-3 h-3 rounded-full ${kpi.status === 'green' ? 'bg-green-400' : 'bg-amber-400'}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 metric-value">{kpi.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{kpi.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">Meta: {kpi.target}</p>
          </div>
        ))}
      </motion.div>
      <motion.div variants={item} className="card p-5">
        <p className="text-sm font-semibold text-gray-500">Acesse o Dashboard Executivo para drill-down completo →</p>
      </motion.div>
    </motion.div>
  );
}

// ===== LUCAS — Novo Colaborador =====
function NovoColaboradorDashboard({ employee }: { employee: ReturnType<typeof getEmployeeById> }) {
  if (!employee || !employee.onboarding) return null;
  const onb = employee.onboarding;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Welcome + Progress */}
      <motion.div variants={item} className="card p-6 bg-gradient-to-br from-cyan-50 to-white border-cyan-100">
        <div className="flex items-start gap-4">
          <div className="icon-box" style={{ background: '#0E7490' }}>
            <Compass className="!text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-neutral-900">Bem-vindo ao Sicredi, {employee.name.split(' ')[0]}!</h2>
            <p className="text-sm text-gray-600 mt-1">Semana {onb.currentWeek} de {onb.totalWeeks} do seu onboarding</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${onb.percentage}%` }}
                  transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                />
              </div>
              <span className="text-sm font-bold text-cyan-600 metric-value">{onb.percentage}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Onboarding Modules */}
      <motion.div variants={item} className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-500" />
          Trilha de Integração
        </h3>
        <div className="space-y-2">
          {onb.modules.map((mod) => (
            <div key={mod.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                mod.completed
                  ? 'bg-cyan-500 text-white'
                  : mod.progress > 0
                  ? 'bg-cyan-100 text-cyan-600'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {mod.completed ? <CheckCircle2 className="w-3 h-3" /> : mod.week}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${mod.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{mod.title}</p>
                <p className="text-[11px] text-gray-400">{mod.description}</p>
              </div>
              {mod.progress > 0 && !mod.completed && (
                <span className="text-xs font-semibold text-cyan-600 metric-value">{mod.progress}%</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Welcome nudge */}
      <motion.div variants={item} className="card p-5 bg-gradient-to-br from-purple-50 to-white border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg gradient-ai flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-xs font-semibold text-purple-600">Parceiro de Jornada</p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          &ldquo;Ei {employee.name.split(' ')[0]}! Como estão os seus primeiros 2 meses? 
          Posso te ajudar a entender melhor o cooperativismo ou explorar caminhos de carreira. 
          Nenhuma pergunta é boba!&rdquo;
        </p>
        <button className="text-sm font-semibold text-purple-600 mt-3 flex items-center gap-1 hover:gap-2 transition-all">
          Conversar com IA <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ===== DANIELA — CAS Director =====
function CASDirectorDashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item} className="card p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Visão Sistêmica</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Cooperativas Ativas', value: '104' },
            { label: 'Módulos Adotados (média)', value: '8,2' },
            { label: 'Tier Avançado', value: '23%' },
            { label: 'Adoção GPS', value: '67%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-lg bg-gray-50">
              <p className="text-xl font-bold text-gray-900 metric-value">{stat.value}</p>
              <p className="text-[11px] text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div variants={item} className="card p-5">
        <p className="text-sm font-semibold text-gray-500">Acesse Governança & Parametrização para gestão sistêmica →</p>
      </motion.div>
    </motion.div>
  );
}
