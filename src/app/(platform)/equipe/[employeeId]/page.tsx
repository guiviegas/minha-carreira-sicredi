'use client';

import { use } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import {
  avaliacoesMock,
  reguaPerformance,
  reguaProntidao,
  reguaPotencial,
} from '@/data/elofy-config';
import { getPdiForPersona } from '@/data/pdi';
import { competenciasSicredi } from '@/data/competencias-sicredi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  Target,
  Calendar,
  MessageCircle,
  ArrowLeft,
  TrendingUp,
  Star,
  AlertTriangle,
  Sparkles,
  Coins,
  Clock,
  Award,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function EmployeeDetailPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = use(params);
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const employee = getEmployeeById(employeeId);
  if (!employee) {
    return (
      <div className="max-w-4xl space-y-4">
        <Link href="/equipe" className="flex items-center gap-1 text-sm text-verde-digital hover:underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para equipe
        </Link>
        <div className="card p-8 text-center">
          <p className="text-gray-500">Colaborador não encontrado.</p>
        </div>
      </div>
    );
  }

  const role = getRoleById(employee.roleId);

  // Avaliação atual e histórico (até 3 ciclos)
  const todosCiclos = avaliacoesMock
    .filter((a) => a.employeeId === employee.id)
    .sort((a, b) => b.cicloId.localeCompare(a.cicloId))
    .slice(0, 3);
  const avaliacao = todosCiclos[0];
  const perfConfig = avaliacao ? reguaPerformance[avaliacao.notaFinalPerformance - 1] : null;
  const prontConfig = avaliacao?.prontidaoId
    ? reguaProntidao.find((r) => r.id === avaliacao.prontidaoId)
    : null;
  const potConfig = avaliacao?.potencialId
    ? reguaPotencial.find((r) => r.id === avaliacao.potencialId)
    : null;

  const aspiration = employee.aspirations[0];
  const aspirationRole = aspiration ? getRoleById(aspiration.targetRoleId) : null;

  // PDI ativo (apenas mariana e lucas têm pdi mock)
  const personaIdGuess = ['emp-001'].includes(employee.id)
    ? 'mariana'
    : ['emp-110'].includes(employee.id)
    ? 'lucas'
    : null;
  const pdi = personaIdGuess ? getPdiForPersona(personaIdGuess) : undefined;

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      <Link
        href="/equipe"
        className="flex items-center gap-1 text-sm text-verde-digital hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para equipe
      </Link>

      {/* Header */}
      <motion.div variants={item} className="card p-6">
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl avatar-initials text-lg"
            style={{ backgroundColor: role?.color || '#3FA110' }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{role?.title || employee.roleId}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              N{role?.level}
              {employee.currentZone ? ` · Zona ${employee.currentZone}` : ''} · {employee.email}
            </p>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {perfConfig && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: perfConfig.bgCor, color: perfConfig.cor }}
                >
                  Desempenho: {perfConfig.hashtag}
                </span>
              )}
              {prontConfig && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: prontConfig.bgCor, color: prontConfig.cor }}
                >
                  Prontidão: {prontConfig.nome}
                </span>
              )}
              {potConfig && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: potConfig.bgCor, color: potConfig.cor }}
                >
                  Potencial: {potConfig.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs financeiros e tempos */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi
          icon={Coins}
          label="Salário atual"
          value={
            employee.currentSalary
              ? `R$ ${(employee.currentSalary / 1000).toFixed(1)}k`
              : '—'
          }
        />
        <Kpi
          icon={Briefcase}
          label="Tempo no Sicredi"
          value={
            employee.tenure > 0
              ? `${employee.tenure} ${employee.tenure === 1 ? 'ano' : 'anos'}`
              : `${employee.tenureMonths} m`
          }
        />
        <Kpi
          icon={Clock}
          label="Tempo no grade"
          value={
            employee.monthsInGrade !== undefined
              ? `${employee.monthsInGrade} meses`
              : '—'
          }
        />
        <Kpi
          icon={Award}
          label={employee.currentZone ? `Tempo na Zona ${employee.currentZone}` : 'Tempo na zona'}
          value={
            employee.monthsInZone !== undefined
              ? `${employee.monthsInZone} meses`
              : '—'
          }
        />
      </motion.div>

      {/* Aspiração */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-purple-500" /> Aspiração de carreira
        </h2>
        {aspiration && aspirationRole ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-gray-900">{aspirationRole.title}</p>
              <p className="text-xs text-gray-500 mt-1">Horizonte: {aspiration.timeframe}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                aspiration.sharedWithLeader
                  ? 'bg-green-50 text-green-700'
                  : aspiration.declared
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {aspiration.sharedWithLeader
                ? 'Compartilhada com líder'
                : aspiration.declared
                ? 'Decidida'
                : 'Explorando'}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Aspiração não declarada. Considere abordar em próxima conversa.
          </p>
        )}
      </motion.div>

      {/* Histórico de conceitos */}
      {todosCiclos.length > 0 && (
        <motion.div variants={item} className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Histórico de conceitos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {todosCiclos.map((c) => {
              const conceito = reguaPerformance[c.notaFinalPerformance - 1];
              return (
                <div
                  key={c.cicloId}
                  className="p-3 rounded-lg border border-gray-100 bg-gray-50"
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    {c.cicloId.replace('ciclo-', '').replace('-', '/')}
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1"
                    style={{ backgroundColor: conceito.bgCor, color: conceito.cor }}
                  >
                    {conceito.hashtag}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Competências Jeito Sicredi do ciclo atual */}
      {avaliacao && (
        <motion.div variants={item} className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-verde-digital" /> Competências (Jeito Sicredi)
          </h2>
          <div className="space-y-2">
            {competenciasSicredi.map((comp) => {
              const evalComp = avaliacao.competencias.find((c) => c.competenciaId === comp.id);
              if (!evalComp) return null;
              const consenso = evalComp.consenso || evalComp.avaliacaoLider;
              const conceito = reguaPerformance[consenso - 1];
              return (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: comp.cor }}
                    />
                    <span className="text-xs text-gray-700">{comp.nome}</span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: conceito.bgCor, color: conceito.cor }}
                  >
                    {conceito.hashtag}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* PDI ativo */}
      {pdi && (
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" /> PDI ativo
            </h2>
            <a
              href="/pdi"
              className="text-[11px] text-verde-digital font-semibold hover:underline flex items-center gap-1"
            >
              Abrir PDI <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-sm font-semibold text-gray-700">{pdi.goal.targetRoleTitle}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Prazo: {pdi.goal.deadline} · Progresso: {pdi.goal.progress}%
          </p>
          <div className="mt-3 space-y-1">
            {pdi.actions.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-xs">
                {a.status === 'completed' ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <Clock className="w-3 h-3 text-gray-400" />
                )}
                <span className="text-gray-700">{a.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Última conversa de carreira */}
      {employee.lastCareerConversation && (
        <motion.div variants={item} className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-500" /> Última conversa de carreira
          </h2>
          <div className="space-y-1.5">
            <p className="text-[11px] text-gray-400">{employee.lastCareerConversation.date}</p>
            <p className="text-sm font-semibold text-gray-800">
              {employee.lastCareerConversation.topic}
            </p>
            <p className="text-xs text-gray-600 italic">
              &ldquo;{employee.lastCareerConversation.outcome}&rdquo;
            </p>
          </div>
        </motion.div>
      )}

      {/* Alertas IA detalhados */}
      {employee.proactiveAlerts && employee.proactiveAlerts.length > 0 && (
        <motion.div variants={item} className="space-y-2">
          {employee.proactiveAlerts.map((alerta, i) => (
            <div
              key={i}
              className={`card p-4 border-l-4 ${
                alerta.severity === 'critical'
                  ? 'border-l-red-500 bg-red-50/40'
                  : alerta.severity === 'warning'
                  ? 'border-l-amber-400 bg-amber-50/40'
                  : 'border-l-blue-400 bg-blue-50/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {alerta.severity === 'critical' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      alerta.severity === 'critical'
                        ? 'text-red-700'
                        : alerta.severity === 'warning'
                        ? 'text-amber-700'
                        : 'text-blue-700'
                    }`}
                  >
                    Alerta IA · {alerta.type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{alerta.message}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Agendar conversa',
            icon: Calendar,
            cor: 'text-blue-600 bg-blue-50',
            href: '#',
          },
          {
            label: 'Dar Feedback',
            icon: MessageCircle,
            cor: 'text-verde-digital bg-verde-50',
            href: '#',
          },
          {
            label: 'Ver descrição do cargo',
            icon: Briefcase,
            cor: 'text-gray-600 bg-gray-100',
            href: `/meu-cargo/${employee.roleId}`,
          },
          {
            label: 'Ver no GPS',
            icon: Target,
            cor: 'text-purple-600 bg-purple-50',
            href: '/mapa-carreira',
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className="card p-3 flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.cor.split(' ')[1]}`}>
                <Icon className={`w-4 h-4 ${action.cor.split(' ')[0]}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 mb-1.5 text-gray-400">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-900 metric-value">{value}</p>
    </div>
  );
}
