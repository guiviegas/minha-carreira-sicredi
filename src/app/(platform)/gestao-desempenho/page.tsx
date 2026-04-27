'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { avaliacoesMock, reguaPerformance, reguaProntidao } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const REGUA_4_PONTOS = [
  { id: 1, hashtag: '#precisaevoluir', label: 'Precisa Evoluir', cor: '#EF4444', bgCor: '#FEE2E2' },
  { id: 2, hashtag: '#quaselá', label: 'Quase Lá', cor: '#F59E0B', bgCor: '#FEF3C7' },
  { id: 3, hashtag: '#mandoubem', label: 'Mandou Bem', cor: '#3FA110', bgCor: '#DCFCE7' },
  { id: 4, hashtag: '#arrasou', label: 'Arrasou', cor: '#16A34A', bgCor: '#BBF7D0' },
];

export default function GestaoDesempenhoPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const team = getTeamForLeader(employee.id);

  // Aggregate performance data
  const teamAvaliacoes = team.map(member => {
    const av = avaliacoesMock.find(a => a.employeeId === member.id && a.cicloId === 'ciclo-2026-1');
    const role = getRoleById(member.roleId);
    return { member, avaliacao: av, role };
  });

  const avaliacoesConcluidas = teamAvaliacoes.filter(t => t.avaliacao).length;
  const totalTeam = team.length;

  // Distribution
  const distribution = [0, 0, 0, 0];
  teamAvaliacoes.forEach(t => {
    if (t.avaliacao) {
      distribution[t.avaliacao.notaFinalPerformance - 1]++;
    }
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Desempenho</h1>
        <p className="text-sm text-gray-500 mt-1">Ciclo 2026.1 · Visão consolidada da equipe</p>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Avaliações concluídas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{avaliacoesConcluidas}/{totalTeam}</p>
          <p className={`text-xs font-semibold mt-1 ${avaliacoesConcluidas === totalTeam ? 'text-green-600' : 'text-amber-600'}`}>
            {avaliacoesConcluidas === totalTeam ? 'Todas concluídas' : `${totalTeam - avaliacoesConcluidas} pendentes`}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">PDIs ativos na equipe</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {team.filter(t => t.developmentPlanIds && t.developmentPlanIds.length > 0).length}/{totalTeam}
          </p>
          <p className="text-xs font-semibold mt-1 text-green-600">
            {Math.round((team.filter(t => t.developmentPlanIds && t.developmentPlanIds.length > 0).length / totalTeam) * 100)}% com plano formal
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Aspirações compartilhadas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {team.filter(t => t.aspirations.length > 0 && t.aspirations[0].sharedWithLeader).length}/{totalTeam}
          </p>
          <p className="text-xs font-semibold mt-1 text-gray-500">com você</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Risco de turnover</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{team.filter(t => t.turnoverRisk && t.turnoverRisk.probability > 60).length}</p>
          <p className={`text-xs font-semibold mt-1 ${team.some(t => t.turnoverRisk && t.turnoverRisk.probability > 70) ? 'text-red-600' : 'text-green-600'}`}>
            {team.some(t => t.turnoverRisk && t.turnoverRisk.probability > 70) ? 'Atenção necessária' : 'Equipe estável'}
          </p>
        </div>
      </motion.div>

      {/* Distribuição da régua */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-verde-digital" /> Distribuição de Conceitos no Ciclo
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {REGUA_4_PONTOS.map((r, i) => (
            <div key={r.id} className="text-center">
              <div className="h-24 flex items-end justify-center mb-2">
                <motion.div
                  className="w-14 rounded-t-lg"
                  style={{ backgroundColor: r.bgCor, border: `2px solid ${r.cor}` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(distribution[i] * 25, 10)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
              <p className="text-xl font-bold" style={{ color: r.cor }}>{distribution[i]}</p>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: r.cor }}>{r.hashtag}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabela por colaborador */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" /> Desempenho Individual
        </h2>
        <div className="space-y-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <div className="col-span-3">Colaborador</div>
            <div className="col-span-2">Cargo</div>
            <div className="col-span-2 text-center">Conceito</div>
            <div className="col-span-2 text-center">Prontidão</div>
            <div className="col-span-3 text-center">Status</div>
          </div>

          {teamAvaliacoes.map(({ member, avaliacao, role }) => {
            const perfConfig = avaliacao ? REGUA_4_PONTOS[avaliacao.notaFinalPerformance - 1] : null;
            const prontConfig = avaliacao?.prontidaoId ? reguaProntidao.find(r => r.id === avaliacao.prontidaoId) : null;

            return (
              <div key={member.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50 transition-colors cursor-pointer rounded-lg">
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg avatar-initials text-[9px]" style={{ backgroundColor: '#3FA110' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">{member.name.split(' ')[0]} {member.name.split(' ').slice(-1)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 truncate">{role?.shortTitle || '-'}</p>
                </div>
                <div className="col-span-2 flex justify-center">
                  {perfConfig ? (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ backgroundColor: perfConfig.bgCor, color: perfConfig.cor }}>
                      {perfConfig.hashtag}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-300">Pendente</span>
                  )}
                </div>
                <div className="col-span-2 flex justify-center">
                  {prontConfig ? (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ backgroundColor: prontConfig.bgCor, color: prontConfig.cor }}>
                      {prontConfig.nome}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-300">-</span>
                  )}
                </div>
                <div className="col-span-3 flex justify-center gap-1.5">
                  {member.aspirations.length > 0 && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">Aspiração</span>
                  )}
                  {member.aspirations.length >= 0 && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">PDI</span>
                  )}
                  {member.turnoverRisk && member.turnoverRisk.probability > 60 && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600">Risco</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Movimentações Pendentes */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" /> Janelas de Movimentação
        </h2>
        <div className="space-y-2">
          {[
            { nome: 'Mariana Costa', tipo: 'Promoção', de: 'GN PF II', para: 'GN PF III', status: 'Elegível' },
            { nome: 'Carlos Santos', tipo: 'Mérito', de: 'Zona 2', para: 'Zona 3', status: 'Em análise' },
          ].map((mov, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">{mov.nome}</p>
                <p className="text-xs text-gray-500">{mov.tipo}: {mov.de} → {mov.para}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                mov.status === 'Elegível' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {mov.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
