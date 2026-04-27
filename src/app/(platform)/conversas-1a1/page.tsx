'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MessageCircle,
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  User,
  X,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const conversas: Array<{ memberId: string; data: string; status: 'agendada' | 'concluida' | 'atrasada'; tipo: string; temas: string[] }> = [
  { memberId: 'emp-001', data: '2026-05-01', status: 'agendada', tipo: 'Carreira', temas: ['Aspiração GA', 'Projeto Q3', 'PDI'] },
  { memberId: 'emp-101', data: '2026-04-15', status: 'atrasada', tipo: 'Check-in', temas: ['Engajamento', 'Stay interview', 'Transição PJ'] },
  { memberId: 'emp-102', data: '2026-04-28', status: 'agendada', tipo: 'Performance', temas: ['Metas Q1', 'Desenvolvimento'] },
  { memberId: 'emp-103', data: '2026-04-20', status: 'concluida', tipo: 'Carreira', temas: ['Mentoria GNs', 'Especialização'] },
  { memberId: 'emp-104', data: '2026-04-22', status: 'concluida', tipo: 'Check-in', temas: ['Progressão GN PF I', 'CPA-10'] },
  { memberId: 'emp-106', data: '2026-04-30', status: 'agendada', tipo: 'Performance', temas: ['Gestão de carteira', 'Promoção'] },
];

export default function Conversas1a1Page() {
  const { currentPersona } = usePersona();
  const [showAgendar, setShowAgendar] = useState(false);
  const [showPauta, setShowPauta] = useState(false);
  const [agendado, setAgendado] = useState(false);
  if (!currentPersona || currentPersona.role !== 'lider') return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;

  const team = getTeamForLeader(employee.id);
  const atrasadas = conversas.filter(c => c.status === 'atrasada').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversas 1:1</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe e prepare suas reuniões individuais com a equipe</p>
        </div>
        <button
          onClick={() => setShowAgendar(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-verde-digital rounded-lg hover:bg-verde-digital/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agendar 1:1
        </button>
      </motion.div>

      {/* Alert */}
      {atrasadas > 0 && (
        <motion.div variants={item} className="card p-4 border-l-4 border-l-amber-400 bg-amber-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm text-amber-800">
              <strong>{atrasadas} conversa{atrasadas > 1 ? 's' : ''}</strong> atrasada{atrasadas > 1 ? 's' : ''}. A Juliana não tem 1:1 há 6 semanas: risco alto de turnover.
            </p>
          </div>
        </motion.div>
      )}

      {/* AI Prep */}
      <motion.div variants={item} className="card p-5 bg-gradient-to-r from-purple-50 to-white border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <p className="text-xs font-semibold text-purple-600">Preparação Inteligente</p>
        </div>
        <p className="text-sm text-gray-700">
          Sua próxima 1:1 é com <strong>Mariana Oliveira</strong> (quinta-feira). Tópicos sugeridos: progresso no projeto Q3, aspiração GA, assessment de liderança.
        </p>
        <button
          onClick={() => setShowPauta(true)}
          className="text-xs font-semibold text-purple-600 mt-2 flex items-center gap-1 hover:gap-2 transition-all"
        >
          Preparar pauta <ArrowRight className="w-3 h-3" />
        </button>
      </motion.div>

      {/* Conversations List */}
      <motion.div variants={item} className="space-y-3">
        {conversas.map((conv) => {
          const member = team.find(m => m.id === conv.memberId) || getEmployeeById(conv.memberId);
          if (!member) return null;
          const memberRole = getRoleById(member.roleId);
          const statusConfig = {
            agendada: { label: 'Agendada', color: '#2563EB', bg: '#EFF6FF', icon: Calendar },
            concluida: { label: 'Concluída', color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle2 },
            atrasada: { label: 'Atrasada', color: '#DC2626', bg: '#FEF2F2', icon: AlertTriangle },
          }[conv.status];

          return (
            <Link
              key={`${conv.memberId}-${conv.data}`}
              href={`/equipe/${member.id}`}
              className="card card-interactive p-4 group block"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: conv.status === 'atrasada' ? '#DC2626' : conv.status === 'concluida' ? '#16A34A' : '#2563EB' }}>
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{conv.tipo}</span>
                  </div>
                  <p className="text-xs text-gray-500">{memberRole?.shortTitle} · {new Date(conv.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {conv.temas.map(t => (
                      <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-50 text-gray-500">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}>
                    {statusConfig.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-verde-digital transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Modal Agendar 1:1 */}
      <AnimatePresence>
        {showAgendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAgendar(false); setAgendado(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {agendado ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                  </div>
                  <p className="text-base font-bold text-gray-900">1:1 agendada!</p>
                  <p className="text-xs text-gray-500 mt-1">Convite enviado por e-mail e adicionado ao calendário.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Agendar 1:1</h3>
                    <button onClick={() => setShowAgendar(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Com quem</label>
                      <select className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-verde-digital">
                        {team.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Data e horário</label>
                      <input type="datetime-local" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-verde-digital" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Tipo</label>
                      <select className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-verde-digital">
                        <option>Carreira</option>
                        <option>Performance</option>
                        <option>Check-in</option>
                        <option>Stay interview</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setAgendado(true)}
                    className="w-full mt-5 py-2.5 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors"
                  >
                    Confirmar agendamento
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Preparar Pauta */}
      <AnimatePresence>
        {showPauta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPauta(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" /> Pauta sugerida
                </h3>
                <button onClick={() => setShowPauta(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Próxima 1:1 com Mariana Oliveira (quinta-feira)</p>
              <div className="space-y-2.5">
                {[
                  { topic: 'Progresso no projeto Q3', desc: 'Reconhecer entrega de meta + identificar gargalos para o segundo bimestre.' },
                  { topic: 'Aspiração para Gerente de Agência', desc: 'Validar evolução nas competências de liderança e revisar plano de exposição.' },
                  { topic: 'Assessment de prontidão', desc: 'Decidir janela para realização (próximos 60 dias) e quais evidências colher.' },
                  { topic: 'PDI: ações em andamento', desc: 'Status do Programa de Liderança e da mentoria com a Ana Beatriz (GA).' },
                ].map((p) => (
                  <div key={p.topic} className="p-3 rounded-lg border border-purple-100 bg-purple-50/30">
                    <p className="text-xs font-semibold text-gray-800">{p.topic}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowPauta(false)}
                className="w-full mt-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
              >
                Adicionar à reunião
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
