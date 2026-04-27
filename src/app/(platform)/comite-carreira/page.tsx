'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader, employees } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { reguaProntidao, reguaPotencial, reguaPerformance } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  FileText,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const comiteMock = [
  { id: 'emp-001', nome: 'Mariana Oliveira', cargo: 'GN PF II', aspiracao: 'Gerente de Agência', performance: 3, prontidao: 'em-desenvolvimento', potencial: 'crescer', decisao: 'Acompanhar — PDI ativo', status: 'aprovado' as const },
  { id: 'emp-108', nome: 'Thiago Martins', cargo: 'Assist. Negócios', aspiracao: 'GN PF I', performance: 3, prontidao: 'pronto-1-ano', potencial: 'acelerar', decisao: 'Promover no próximo ciclo', status: 'aprovado' as const },
  { id: 'emp-101', nome: 'Juliana Pereira', cargo: 'GN PF I', aspiracao: 'GN PJ', performance: 2, prontidao: 'inicio-jornada', potencial: 'fortalecer', decisao: 'Stay interview urgente', status: 'acao_urgente' as const },
  { id: 'emp-106', nome: 'Pedro Almeida', cargo: 'GN PF I', aspiracao: 'GN PF II', performance: 3, prontidao: 'pronto-1-ano', potencial: 'crescer', decisao: 'Incluir em projeto de liderança', status: 'pendente' as const },
];

export default function ComiteCarreiraPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona || (currentPersona.role !== 'lider' && currentPersona.role !== 'pc_analista')) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comitê de Carreira</h1>
          <p className="text-sm text-gray-500 mt-1">Discussão estruturada sobre desenvolvimento, prontidão e movimentações</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Próximo comitê</p>
          <p className="text-sm font-semibold text-gray-800">15 Mai 2026</p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-[11px] text-gray-500">Em pauta</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">2</p>
          <p className="text-[11px] text-gray-500">Aprovados</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-red-500">1</p>
          <p className="text-[11px] text-gray-500">Ação urgente</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">1</p>
          <p className="text-[11px] text-gray-500">Pendente</p>
        </div>
      </motion.div>

      {/* Pauta */}
      <motion.div variants={item} className="space-y-4">
        {comiteMock.map((caso) => {
          const prontConfig = reguaProntidao.find(r => r.id === caso.prontidao);
          const potConfig = reguaPotencial.find(r => r.id === caso.potencial);
          const statusConfig = {
            aprovado: { label: 'Aprovado', color: '#16A34A', bg: '#F0FDF4' },
            acao_urgente: { label: 'Ação Urgente', color: '#DC2626', bg: '#FEF2F2' },
            pendente: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' },
          }[caso.status];

          return (
            <div key={caso.id} className={`card p-5 border-l-4`} style={{ borderLeftColor: statusConfig.color }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: statusConfig.color }}>
                    {caso.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{caso.nome}</p>
                    <p className="text-xs text-gray-500">{caso.cargo} → {caso.aspiracao}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}>
                  {statusConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                {(() => {
                  const perfConfig = reguaPerformance.find(r => r.nivel === caso.performance);
                  return (
                    <div className="p-2 rounded-lg text-center" style={{ backgroundColor: perfConfig?.bgCor || '#F3F4F6' }}>
                      <p className="text-[10px] uppercase font-semibold" style={{ color: perfConfig?.cor || '#6B7280' }}>Performance</p>
                      <p className="text-xs font-bold" style={{ color: perfConfig?.cor || '#6B7280' }}>{perfConfig?.hashtag || '—'}</p>
                    </div>
                  );
                })()}
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: prontConfig?.bgCor }}>
                  <p className="text-[10px] uppercase font-semibold" style={{ color: prontConfig?.cor }}>Prontidão</p>
                  <p className="text-xs font-bold" style={{ color: prontConfig?.cor }}>{prontConfig?.nome}</p>
                </div>
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: potConfig?.bgCor }}>
                  <p className="text-[10px] uppercase font-semibold" style={{ color: potConfig?.cor }}>Potencial</p>
                  <p className="text-xs font-bold" style={{ color: potConfig?.cor }}>{potConfig?.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs text-gray-600"><strong>Decisão:</strong> {caso.decisao}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
