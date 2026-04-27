'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { reguaProntidao } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Gauge,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  ChevronRight,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const prontidaoMock: Record<string, { nivel: string; score: number; tendencia: 'up' | 'stable' | 'down' }> = {
  'emp-001': { nivel: 'em-desenvolvimento', score: 68, tendencia: 'up' },
  'emp-101': { nivel: 'inicio-jornada', score: 48, tendencia: 'down' },
  'emp-102': { nivel: 'em-desenvolvimento', score: 55, tendencia: 'stable' },
  'emp-103': { nivel: 'pronto-agora', score: 92, tendencia: 'stable' },
  'emp-104': { nivel: 'inicio-jornada', score: 52, tendencia: 'up' },
  'emp-106': { nivel: 'pronto-1-ano', score: 65, tendencia: 'up' },
  'emp-108': { nivel: 'pronto-1-ano', score: 72, tendencia: 'up' },
};

export default function ProntidaoTimePage() {
  const { currentPersona } = usePersona();
  if (!currentPersona || currentPersona.role !== 'lider') return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;

  const team = getTeamForLeader(employee.id);

  // Count by readiness level
  const contagem = reguaProntidao.map(nivel => ({
    ...nivel,
    count: Object.values(prontidaoMock).filter(p => p.nivel === nivel.id).length,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Prontidão do Time</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da prontidão de cada membro para o próximo cargo</p>
      </motion.div>

      {/* Readiness Distribution */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {contagem.map((nivel) => (
          <div key={nivel.id} className="card p-4 text-center" style={{ borderTop: `3px solid ${nivel.cor}` }}>
            <p className="text-2xl font-bold" style={{ color: nivel.cor }}>{nivel.count}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{nivel.nome}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{nivel.descricao.split('.')[0]}</p>
          </div>
        ))}
      </motion.div>

      {/* Team Members */}
      <motion.div variants={item} className="space-y-3">
        {team.slice(0, 8).map((member) => {
          const pront = prontidaoMock[member.id];
          if (!pront) return null;
          const memberRole = getRoleById(member.roleId);
          const aspiracao = member.aspirations[0];
          const cargoAspirado = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;
          const nivelConfig = reguaProntidao.find(n => n.id === pront.nivel);

          return (
            <div key={member.id} className="card card-interactive p-4 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: nivelConfig?.cor || '#6B7280' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {pront.tendencia === 'up' && <TrendingUp className="w-3 h-3 text-green-500 absolute -bottom-0.5 -right-0.5 bg-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{memberRole?.shortTitle}</p>
                  {cargoAspirado && (
                    <Link
                      href={`/meu-cargo/${cargoAspirado.id}`}
                      className="text-[11px] text-purple-500 mt-0.5 hover:underline inline-block"
                    >
                      → {cargoAspirado.shortTitle}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Score bar */}
                  <div className="w-24">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold" style={{ color: nivelConfig?.cor }}>{pront.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pront.score}%`, backgroundColor: nivelConfig?.cor }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: nivelConfig?.bgCor, color: nivelConfig?.cor }}>
                    {nivelConfig?.nome}
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
