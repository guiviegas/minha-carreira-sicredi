'use client';

import { use } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { avaliacoesMock, reguaProntidao } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  User,
  Briefcase,
  Target,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Clock,
  TrendingUp,
  Star,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const REGUA_4_PONTOS = [
  { id: 1, hashtag: '#precisaevoluir', label: 'Precisa Evoluir', cor: '#EF4444', bgCor: '#FEE2E2' },
  { id: 2, hashtag: '#quaselá', label: 'Quase Lá', cor: '#F59E0B', bgCor: '#FEF3C7' },
  { id: 3, hashtag: '#mandoubem', label: 'Mandou Bem', cor: '#3FA110', bgCor: '#DCFCE7' },
  { id: 4, hashtag: '#arrasou', label: 'Arrasou', cor: '#16A34A', bgCor: '#BBF7D0' },
];

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
  const avaliacao = avaliacoesMock.find(a => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1');
  const perfConfig = avaliacao ? REGUA_4_PONTOS[avaliacao.notaFinalPerformance - 1] : null;
  const prontConfig = avaliacao?.prontidaoId ? reguaProntidao.find(r => r.id === avaliacao.prontidaoId) : null;
  const aspiration = employee.aspirations[0];
  const aspirationRole = aspiration ? getRoleById(aspiration.targetRoleId) : null;

  const initials = employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      {/* Back link */}
      <Link href="/equipe" className="flex items-center gap-1 text-sm text-verde-digital hover:underline">
        <ArrowLeft className="w-4 h-4" /> Voltar para equipe
      </Link>

      {/* Header */}
      <motion.div variants={item} className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl avatar-initials text-lg" style={{ backgroundColor: '#3FA110' }}>
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{role?.title || employee.roleId}</p>
            <div className="flex items-center gap-2 mt-2">
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
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Tempo Sicredi</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{employee.tenure > 0 ? `${employee.tenure} anos` : `${employee.tenureMonths || 0}m`}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Score Engajamento</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{employee.engagementScore}%</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">PDI Ativo</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{"Sim"}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Risco Turnover</p>
          <p className={`text-xl font-bold mt-1 ${
            employee.turnoverRisk && employee.turnoverRisk.probability > 70 ? 'text-red-600' :
            employee.turnoverRisk && employee.turnoverRisk.probability > 40 ? 'text-amber-600' : 'text-green-600'
          }`}>
            {employee.turnoverRisk ? `${employee.turnoverRisk.probability}%` : 'Baixo'}
          </p>
        </div>
      </motion.div>

      {/* Aspiração */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-purple-500" /> Aspiração de Carreira
        </h2>
        {aspiration ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">{aspirationRole?.title || 'Cargo não definido'}</p>
              <p className="text-xs text-gray-500 mt-1">Horizonte: {aspiration.timeframe}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600">
              {aspiration.confidence >= 80 ? 'Decidida' : aspiration.confidence >= 50 ? 'Considerando' : 'Explorando'}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aspiração não declarada. Considere abordar em próxima conversa.</p>
        )}
      </motion.div>

      {/* Alertas IA */}
      {employee.turnoverRisk && employee.turnoverRisk.probability > 50 && (
        <motion.div variants={item} className="card p-4 border-l-4 border-l-amber-400 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Alerta proativo</p>
              <p className="text-sm text-amber-700 mt-0.5">
                {employee.turnoverRisk.probability > 70
                  ? 'Risco alto de saída detectado. Recomendação: conversa de retenção imediata.'
                  : 'Atenção moderada. Monitorar engajamento e agendar conversa de carreira.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Agendar 1:1', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
          { label: 'Dar Feedback', icon: MessageCircle, color: 'text-verde-digital bg-verde-50' },
          { label: 'Ver PDI', icon: Target, color: 'text-purple-600 bg-purple-50' },
          { label: 'Ver Avaliação', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
          { label: 'Ver Cargo', icon: Briefcase, color: 'text-gray-600 bg-gray-100' },
          { label: 'Conversa de Retenção', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} className={`card p-3 flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color.split(' ')[1]}`}>
                <Icon className={`w-4 h-4 ${action.color.split(' ')[0]}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
