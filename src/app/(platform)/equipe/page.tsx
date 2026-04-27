'use client';

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
  MessageSquare,
  Target,
  TrendingUp,
  Compass,
  Users,
} from 'lucide-react';
import { Employee } from '@/types';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function EquipePage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const team = getTeamForLeader(employee.id);

  // KPIs derivados de DADOS REAIS (sem inventar engajamento médio)
  const teamKpis = {
    total: team.length,
    comAvaliacaoAtiva: team.filter((t) =>
      avaliacoesMock.some((a) => a.employeeId === t.id && a.cicloId === 'ciclo-2026-1'),
    ).length,
    comPdiAtivo: team.filter((t) => t.developmentPlanIds.length > 0 || ['mariana', 'lucas'].includes(t.id))
      .length,
    comAspiracaoCompartilhada: team.filter(
      (t) => t.aspirations.length > 0 && t.aspirations[0].sharedWithLeader,
    ).length,
    emRiscoTurnover: team.filter((t) => t.turnoverRisk && t.turnoverRisk.probability > 70).length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Minha Equipe</h1>
        <p className="text-sm text-gray-500 mt-1">
          {team.length} pessoas · Praça Central · Visão de gestão de carreira da equipe.
        </p>
      </motion.div>

      {/* KPIs derivados de dados reais (sem 'engajamento médio' / 'performance média' inventados) */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi icon={Users} label="Total da equipe" value={teamKpis.total} cor="#2563EB" />
        <Kpi
          icon={ClipboardList}
          label="Com avaliação concluída"
          value={`${teamKpis.comAvaliacaoAtiva}/${teamKpis.total}`}
          cor="#3FA110"
        />
        <Kpi
          icon={Target}
          label="Com PDI ativo"
          value={`${teamKpis.comPdiAtivo}/${teamKpis.total}`}
          cor="#7C3AED"
        />
        <Kpi
          icon={Compass}
          label="Aspiração compartilhada"
          value={`${teamKpis.comAspiracaoCompartilhada}/${teamKpis.total}`}
          cor="#0E7490"
        />
        <Kpi
          icon={AlertTriangle}
          label="Em risco de saída"
          value={teamKpis.emRiscoTurnover}
          cor={teamKpis.emRiscoTurnover > 0 ? '#DC2626' : '#16A34A'}
        />
      </motion.div>

      {/* Alertas críticos no topo */}
      {team
        .filter((t) => t.turnoverRisk && t.turnoverRisk.probability > 70)
        .map((t) => (
          <motion.div
            key={t.id}
            variants={item}
            className="card p-4 border-l-4 border-l-red-400 bg-red-50/50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">
                  Alerta crítico: {t.name} · risco de saída
                </p>
                <p className="text-sm text-red-700 mt-0.5">
                  Probabilidade de saída <strong>{t.turnoverRisk!.probability}%</strong> em{' '}
                  {t.turnoverRisk!.timeframe}.
                </p>
                <div className="flex gap-2 mt-3">
                  <a
                    href={`/equipe/${t.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    Abrir perfil completo <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

      {/* Tabela rica da equipe */}
      <motion.div variants={item} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left py-3 px-4">Pessoa</th>
                <th className="text-left py-3 px-3">Cargo · Grade · Zona</th>
                <th className="text-right py-3 px-3">Salário</th>
                <th className="text-left py-3 px-3">Tempos</th>
                <th className="text-left py-3 px-3">Última avaliação</th>
                <th className="text-left py-3 px-3">Aspiração</th>
                <th className="text-left py-3 px-3">Última conversa</th>
                <th className="text-left py-3 px-3">Alerta IA</th>
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

      <motion.div variants={item} className="text-xs text-gray-400 text-center pt-2">
        Clique em qualquer linha para abrir a visão 360° do colaborador.
      </motion.div>
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

function TeamRow({ member }: { member: Employee }) {
  const role = getRoleById(member.roleId);
  const aval = avaliacoesMock.find(
    (a) => a.employeeId === member.id && a.cicloId === 'ciclo-2026-1',
  );
  const conceito = aval ? reguaPerformance[aval.notaFinalPerformance - 1] : null;
  const aspRole = member.aspirations[0]
    ? getRoleById(member.aspirations[0].targetRoleId)
    : null;

  // PDI por personaId (apenas mariana e lucas têm pdi mock; outros não)
  const personaId = ['emp-001'].includes(member.id)
    ? 'mariana'
    : ['emp-110'].includes(member.id)
    ? 'lucas'
    : null;
  const pdi = personaId ? getPdiForPersona(personaId) : undefined;

  // Prontidão (vinda da avaliação) e potencial
  const prontidao = aval?.prontidaoId
    ? reguaProntidao.find((r) => r.id === aval.prontidaoId)
    : null;
  const potencial = aval?.potencialId
    ? reguaPotencial.find((r) => r.id === aval.potencialId)
    : null;

  // Alerta IA principal (severity mais alta)
  const alerta = member.proactiveAlerts?.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  })[0];

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <tr className="hover:bg-gray-50 cursor-pointer transition-colors">
      <td className="py-3 px-4">
        <a href={`/equipe/${member.id}`} className="flex items-center gap-2.5 min-w-0">
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
        </a>
      </td>
      <td className="py-3 px-3 text-[12px]">
        {role ? (
          <Link
            href={`/meu-cargo/${role.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-gray-700 hover:text-verde-digital hover:underline"
          >
            {role.shortTitle || role.title}
          </Link>
        ) : (
          <p className="font-semibold text-gray-400">—</p>
        )}
        <p className="text-[10px] text-gray-500">
          N{role?.level}
          {member.currentZone ? ` · Zona ${member.currentZone}` : ''}
        </p>
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
        <div className="space-y-0.5">
          <div>Sicredi: {member.tenure}a</div>
          {member.monthsInGrade !== undefined && <div>Grade: {member.monthsInGrade}m</div>}
          {member.monthsInZone !== undefined && <div>Zona: {member.monthsInZone}m</div>}
        </div>
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
          <div className="text-[11px]">
            <Link
              href={`/meu-cargo/${aspRole.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-gray-700 truncate max-w-[150px] block hover:text-purple-700 hover:underline"
            >
              {aspRole.shortTitle}
            </Link>
            <p className="text-[10px] text-gray-500">
              {member.aspirations[0].sharedWithLeader ? 'Compartilhada' : 'Privada'}
            </p>
          </div>
        ) : (
          <span className="text-[11px] text-gray-300 italic">Sem aspiração</span>
        )}
      </td>
      <td className="py-3 px-3">
        {member.lastCareerConversation ? (
          <div className="text-[11px]">
            <p className="text-gray-700">{member.lastCareerConversation.date}</p>
            <p className="text-[10px] text-gray-500 truncate max-w-[180px]">
              {member.lastCareerConversation.topic}
            </p>
          </div>
        ) : (
          <span className="text-[11px] text-gray-300">—</span>
        )}
      </td>
      <td className="py-3 px-3">
        {alerta ? (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block max-w-[200px] truncate ${
              alerta.severity === 'critical'
                ? 'bg-red-100 text-red-700'
                : alerta.severity === 'warning'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}
            title={alerta.message}
          >
            {alerta.message.split(/[\.\!]/)[0]}
          </span>
        ) : (
          <span className="text-[11px] text-gray-300">—</span>
        )}
      </td>
      <td className="py-3 px-3">
        <div className="flex flex-col gap-0.5 text-[10px]">
          {prontidao && (
            <span
              className="font-bold px-1.5 py-0 rounded inline-block"
              style={{ backgroundColor: prontidao.bgCor, color: prontidao.cor }}
              title="Prontidão"
            >
              Pront: {prontidao.nome.split(' ')[0]}
            </span>
          )}
          {potencial && (
            <span
              className="font-bold px-1.5 py-0 rounded inline-block"
              style={{ backgroundColor: potencial.bgCor, color: potencial.cor }}
              title="Potencial"
            >
              Pot: {potencial.label}
            </span>
          )}
          {conceito && (
            <span
              className="font-bold px-1.5 py-0 rounded inline-block"
              style={{ backgroundColor: conceito.bgCor, color: conceito.cor }}
              title="Desempenho"
            >
              Desp: {conceito.hashtag.replace('#', '')}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-3 text-right">
        <a
          href={`/equipe/${member.id}`}
          className="text-verde-digital hover:underline text-[11px] font-semibold inline-flex items-center gap-0.5"
        >
          Abrir <ArrowRight className="w-3 h-3" />
        </a>
      </td>
    </tr>
  );
}
