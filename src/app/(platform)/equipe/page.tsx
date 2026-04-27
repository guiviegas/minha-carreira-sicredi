'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { getPdiForPersona } from '@/data/pdi';
import { avaliacoesMock, reguaPerformance, reguaProntidao, reguaPotencial } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Coins,
  Compass,
  LayoutGrid,
  List,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Employee } from '@/types';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function EquipePage() {
  const { currentPersona } = usePersona();
  const [view, setView] = useState<'cards' | 'tabela'>('cards');
  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const team = getTeamForLeader(employee.id);

  const teamKpis = {
    total: team.length,
    comAvaliacaoAtiva: team.filter((t) =>
      avaliacoesMock.some((a) => a.employeeId === t.id && a.cicloId === 'ciclo-2026-1'),
    ).length,
    comPdiAtivo: team.filter((t) => t.developmentPlanIds.length > 0 || ['mariana', 'lucas'].includes(t.id)).length,
    comAspiracaoCompartilhada: team.filter(
      (t) => t.aspirations.length > 0 && t.aspirations[0].sharedWithLeader,
    ).length,
    emRiscoTurnover: team.filter((t) => t.turnoverRisk && t.turnoverRisk.probability > 70).length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl space-y-6">
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minha Equipe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {team.length} pessoas · Praça Central · Visão de gestão de carreira da equipe.
          </p>
        </div>
        <div className="inline-flex bg-gray-100 rounded-lg p-1 shrink-0">
          <button
            onClick={() => setView('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              view === 'cards' ? 'bg-white text-verde-digital shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Cards
          </button>
          <button
            onClick={() => setView('tabela')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              view === 'tabela' ? 'bg-white text-verde-digital shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Tabela
          </button>
        </div>
      </motion.div>

      {/* KPIs derivados de dados reais */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi icon={Users} label="Total da equipe" value={teamKpis.total} cor="#2563EB" />
        <Kpi icon={ClipboardList} label="Com avaliação concluída" value={`${teamKpis.comAvaliacaoAtiva}/${teamKpis.total}`} cor="#3FA110" />
        <Kpi icon={Target} label="Com PDI ativo" value={`${teamKpis.comPdiAtivo}/${teamKpis.total}`} cor="#7C3AED" />
        <Kpi icon={Compass} label="Aspiração compartilhada" value={`${teamKpis.comAspiracaoCompartilhada}/${teamKpis.total}`} cor="#0E7490" />
        <Kpi
          icon={AlertTriangle}
          label="Em risco de saída"
          value={teamKpis.emRiscoTurnover}
          cor={teamKpis.emRiscoTurnover > 0 ? '#DC2626' : '#16A34A'}
        />
      </motion.div>

      {/* Alertas críticos */}
      {team
        .filter((t) => t.turnoverRisk && t.turnoverRisk.probability > 70)
        .map((t) => (
          <motion.div key={t.id} variants={item} className="card p-4 border-l-4 border-l-red-400 bg-red-50/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">Alerta crítico: {t.name} · risco de saída</p>
                <p className="text-sm text-red-700 mt-0.5">
                  Probabilidade de saída <strong>{t.turnoverRisk!.probability}%</strong> em {t.turnoverRisk!.timeframe}.
                </p>
                <Link
                  href={`/equipe/${t.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-2 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Abrir perfil completo <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

      {view === 'cards' ? (
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left py-3 px-4">Pessoa</th>
                  <th className="text-left py-3 px-3">Cargo</th>
                  <th className="text-right py-3 px-3">Salário</th>
                  <th className="text-left py-3 px-3">Tempos</th>
                  <th className="text-left py-3 px-3">Avaliação</th>
                  <th className="text-left py-3 px-3">Aspiração</th>
                  <th className="text-left py-3 px-3">P / P / D</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {team.map((member) => (
                  <TeamRow key={member.id} member={member} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  cor,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  cor: string;
}) {
  return (
    <div className="card p-4">
      <Icon className="w-4 h-4 mb-2" style={{ color: cor }} />
      <p className="text-xl font-bold text-gray-900 metric-value">{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function TeamCard({ member }: { member: Employee }) {
  const role = getRoleById(member.roleId);
  const aval = avaliacoesMock.find((a) => a.employeeId === member.id && a.cicloId === 'ciclo-2026-1');
  const conceito = aval ? reguaPerformance[aval.notaFinalPerformance - 1] : null;
  const aspRole = member.aspirations[0] ? getRoleById(member.aspirations[0].targetRoleId) : null;

  const personaId = member.id === 'emp-001' ? 'mariana' : member.id === 'emp-110' ? 'lucas' : null;
  const pdi = personaId ? getPdiForPersona(personaId) : undefined;

  const prontidao = aval?.prontidaoId ? reguaProntidao.find((r) => r.id === aval.prontidaoId) : null;
  const potencial = aval?.potencialId ? reguaPotencial.find((r) => r.id === aval.potencialId) : null;

  const alerta = member.proactiveAlerts?.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  })[0];

  const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const turnoverHigh = member.turnoverRisk && member.turnoverRisk.probability > 70;

  return (
    <Link href={`/equipe/${member.id}`} className="card card-interactive p-0 group block overflow-hidden">
      {/* Header com gradient + foto */}
      <div
        className="px-4 pt-4 pb-3 relative"
        style={{
          background: `linear-gradient(135deg, ${role?.color || '#3FA110'}18 0%, ${role?.color || '#3FA110'}05 100%)`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
            style={{ backgroundColor: role?.color || '#6B7280' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{member.name}</p>
            <p className="text-[11px] text-gray-600 truncate">{role?.shortTitle || role?.title || '—'}</p>
            <p className="text-[10px] text-gray-400">
              N{role?.level ?? '—'}
              {member.currentZone ? ` · Zona ${member.currentZone}` : ''}
            </p>
          </div>
          {turnoverHigh && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700 shrink-0">
              Risco
            </span>
          )}
        </div>
      </div>

      {/* Selos */}
      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
        {conceito && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: conceito.bgCor, color: conceito.cor }}
            title="Performance"
          >
            {conceito.hashtag}
          </span>
        )}
        {prontidao && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: prontidao.bgCor, color: prontidao.cor }}
            title="Prontidão"
          >
            {prontidao.nome}
          </span>
        )}
        {potencial && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: potencial.bgCor, color: potencial.cor }}
            title="Potencial"
          >
            {potencial.label}
          </span>
        )}
      </div>

      {/* KPIs financeiros + tempos */}
      <div className="px-4 py-2.5 grid grid-cols-3 gap-2 border-t border-gray-100">
        <KpiMini label="Salário" value={member.currentSalary ? `R$ ${(member.currentSalary / 1000).toFixed(1)}k` : '—'} icon={Coins} />
        <KpiMini label="Sicredi" value={`${member.tenure}a`} icon={Briefcase} />
        <KpiMini
          label="No grade"
          value={member.monthsInGrade !== undefined ? `${member.monthsInGrade}m` : '—'}
          icon={TrendingUp}
        />
      </div>

      {/* Aspiração + PDI + última conversa */}
      <div className="px-4 py-3 space-y-2 border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-start gap-2">
          <Compass className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aspiração</p>
            {aspRole ? (
              <p className="text-xs text-gray-700 truncate">
                {aspRole.shortTitle}
                <span className="text-[10px] text-gray-400 ml-1">
                  · {member.aspirations[0].sharedWithLeader ? 'compartilhada' : 'privada'}
                </span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">Não declarada</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Target className="w-3.5 h-3.5 text-verde-digital shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PDI</p>
            {pdi ? (
              <p className="text-xs text-gray-700 truncate">
                {pdi.actions.filter((a) => a.status === 'completed').length}/{pdi.actions.length} ações concluídas
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">Sem PDI ativo</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Última conversa</p>
            {member.lastCareerConversation ? (
              <p className="text-xs text-gray-700 truncate">
                {member.lastCareerConversation.date} · {member.lastCareerConversation.topic}
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">Sem registro</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerta + CTA */}
      {alerta && (
        <div
          className={`px-4 py-2 border-t text-[11px] font-medium flex items-start gap-1.5 ${
            alerta.severity === 'critical'
              ? 'bg-red-50 text-red-700 border-red-100'
              : alerta.severity === 'warning'
              ? 'bg-amber-50 text-amber-700 border-amber-100'
              : 'bg-blue-50 text-blue-700 border-blue-100'
          }`}
        >
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{alerta.message}</span>
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
        <span className="text-gray-400">Visão 360°</span>
        <span className="font-semibold text-verde-digital flex items-center gap-1 group-hover:gap-1.5 transition-all">
          Abrir perfil <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

function KpiMini({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Coins }) {
  return (
    <div className="text-center">
      <Icon className="w-3 h-3 text-gray-400 mx-auto" />
      <p className="text-[11px] font-bold text-gray-700 mt-0.5">{value}</p>
      <p className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function TeamRow({ member }: { member: Employee }) {
  const role = getRoleById(member.roleId);
  const aval = avaliacoesMock.find((a) => a.employeeId === member.id && a.cicloId === 'ciclo-2026-1');
  const conceito = aval ? reguaPerformance[aval.notaFinalPerformance - 1] : null;
  const aspRole = member.aspirations[0] ? getRoleById(member.aspirations[0].targetRoleId) : null;

  const prontidao = aval?.prontidaoId ? reguaProntidao.find((r) => r.id === aval.prontidaoId) : null;
  const potencial = aval?.potencialId ? reguaPotencial.find((r) => r.id === aval.potencialId) : null;

  const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <Link href={`/equipe/${member.id}`} className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ backgroundColor: role?.color || '#6B7280' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{member.email}</p>
          </div>
        </Link>
      </td>
      <td className="py-3 px-3 text-[12px]">
        {role ? (
          <Link
            href={`/meu-cargo/${role.id}`}
            className="font-semibold text-gray-700 hover:text-verde-digital hover:underline"
          >
            {role.shortTitle || role.title}
          </Link>
        ) : (
          <p className="font-semibold text-gray-400">—</p>
        )}
        <p className="text-[10px] text-gray-500">N{role?.level}</p>
      </td>
      <td className="py-3 px-3 text-right">
        {member.currentSalary ? (
          <span className="text-[12px] font-semibold text-gray-700 metric-value">
            R$ {(member.currentSalary / 1000).toFixed(1)}k
          </span>
        ) : (
          <span className="text-[11px] text-gray-300">—</span>
        )}
      </td>
      <td className="py-3 px-3 text-[10px] text-gray-500">
        <div>Sicredi: {member.tenure}a</div>
        {member.monthsInGrade !== undefined && <div>Grade: {member.monthsInGrade}m</div>}
      </td>
      <td className="py-3 px-3">
        {conceito ? (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: conceito.bgCor, color: conceito.cor }}
          >
            {conceito.hashtag}
          </span>
        ) : (
          <span className="text-[11px] text-gray-300">Sem ciclo</span>
        )}
      </td>
      <td className="py-3 px-3">
        {aspRole ? (
          <Link
            href={`/meu-cargo/${aspRole.id}`}
            className="text-[11px] text-gray-700 truncate max-w-[150px] block hover:text-purple-700 hover:underline"
          >
            {aspRole.shortTitle}
          </Link>
        ) : (
          <span className="text-[11px] text-gray-300 italic">—</span>
        )}
      </td>
      <td className="py-3 px-3">
        <div className="flex flex-col gap-0.5 text-[10px]">
          {prontidao && (
            <span
              className="font-bold px-1.5 py-0 rounded inline-block"
              style={{ backgroundColor: prontidao.bgCor, color: prontidao.cor }}
            >
              Pront: {prontidao.nome.split(' ')[0]}
            </span>
          )}
          {potencial && (
            <span
              className="font-bold px-1.5 py-0 rounded inline-block"
              style={{ backgroundColor: potencial.bgCor, color: potencial.cor }}
            >
              Pot: {potencial.label}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-3 text-right">
        <Link
          href={`/equipe/${member.id}`}
          className="text-verde-digital hover:underline text-[11px] font-semibold inline-flex items-center gap-0.5"
        >
          Abrir <ArrowRight className="w-3 h-3" />
        </Link>
      </td>
    </tr>
  );
}
