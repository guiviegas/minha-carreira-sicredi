'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { competenciasSicredi } from '@/data/competencias-sicredi';
import { reguaPerformance } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

// Mock evaluations for team members
const avaliacoesMockTime: Record<string, { status: string; nota: number; competencias: Record<string, number> }> = {
  'emp-001': { status: 'concluido', nota: 3, competencias: { 'essencia-cooperativista': 4, 'entender-para-atender': 4, 'vai-la-e-faz': 3, 'aprender-mudar-rapido': 3, 'inovar-para-transformar': 3 } },
  'emp-101': { status: 'pendente', nota: 0, competencias: {} },
  'emp-102': { status: 'autoavaliacao', nota: 0, competencias: {} },
  'emp-103': { status: 'concluido', nota: 4, competencias: { 'essencia-cooperativista': 4, 'entender-para-atender': 4, 'vai-la-e-faz': 4, 'aprender-mudar-rapido': 3, 'inovar-para-transformar': 3 } },
  'emp-104': { status: 'concluido', nota: 3, competencias: { 'essencia-cooperativista': 3, 'entender-para-atender': 3, 'vai-la-e-faz': 3, 'aprender-mudar-rapido': 3, 'inovar-para-transformar': 2 } },
  'emp-106': { status: 'avaliacao_lider', nota: 0, competencias: {} },
};

export default function AvaliacaoTimePage() {
  const { currentPersona } = usePersona();
  if (!currentPersona || currentPersona.role !== 'lider') return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;

  const team = getTeamForLeader(employee.id);
  const pendentes = team.filter(m => {
    const av = avaliacoesMockTime[m.id];
    return !av || av.status !== 'concluido';
  }).length;
  const concluidos = team.length - pendentes;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliação do Time</h1>
          <p className="text-sm text-gray-500 mt-1">Ciclo 1/2026 · Jan-Jun 2026</p>
        </div>
        <a href="https://app.elofy.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-verde-digital rounded-lg hover:bg-verde-digital/90 transition-colors">
          Abrir Elofy <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Progresso do ciclo</p>
          <span className="text-sm font-bold text-verde-digital">{concluidos}/{team.length}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-verde-digital to-green-400" initial={{ width: 0 }} animate={{ width: `${(concluidos / team.length) * 100}%` }} transition={{ duration: 1 }} />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> {concluidos} concluídos</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> {pendentes} pendentes</span>
        </div>
      </motion.div>

      {/* Régua Elofy */}
      <motion.div variants={item} className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Escala de Conceitos</p>
        <div className="grid grid-cols-4 gap-2">
          {reguaPerformance.map((nivel) => (
            <div key={nivel.nivel} className="p-3 rounded-lg text-center" style={{ backgroundColor: nivel.bgCor }}>
              <p className="text-sm font-bold" style={{ color: nivel.cor }}>{nivel.hashtag}</p>
              <p className="text-[9px] font-medium mt-1 leading-tight" style={{ color: nivel.cor }}>{nivel.descricao.split('.')[0]}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team List */}
      <motion.div variants={item} className="space-y-3">
        {team.slice(0, 8).map((member) => {
          const av = avaliacoesMockTime[member.id];
          const memberRole = getRoleById(member.roleId);
          const statusConfig = {
            concluido: { label: 'Concluído', color: '#16A34A', bg: '#F0FDF4' },
            pendente: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' },
            autoavaliacao: { label: 'Autoavaliação', color: '#2563EB', bg: '#EFF6FF' },
            avaliacao_lider: { label: 'Sua vez', color: '#DC2626', bg: '#FEF2F2' },
          }[av?.status || 'pendente'] || { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' };

          const nota = av?.nota || 0;
          const notaConfig = nota > 0 ? reguaPerformance.find(r => r.nivel === nota) : null;

          return (
            <div key={member.id} className="card card-interactive p-4 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gray-500 shrink-0">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{memberRole?.shortTitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  {notaConfig && (
                    <div className="px-2.5 py-1 rounded-lg text-center" style={{ backgroundColor: notaConfig.bgCor }}>
                      <p className="text-xs font-bold" style={{ color: notaConfig.cor }}>{notaConfig.hashtag}</p>
                    </div>
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}>
                    {statusConfig.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-verde-digital transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
