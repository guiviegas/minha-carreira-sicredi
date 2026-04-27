'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { competenciasSicredi } from '@/data/competencias-sicredi';
import { reguaPerformance, avaliacoesMock, ELOFY_URL } from '@/data/elofy-config';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, Target, TrendingUp, MessageSquare, Calendar,
  CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp, Sparkles,
  ArrowRight, Edit3, Send, Plus, ThumbsUp, Clock, ExternalLink, Heart
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

type GoalStatus = 'exceeded' | 'on_track' | 'at_risk' | 'behind';

interface Goal {
  title: string;
  weight: number;
  progress: number;
  status: GoalStatus;
  actions: string[];
  notes: string;
}

export default function AvaliacaoPage() {
  const { currentPersona } = usePersona();
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGoalEditModal, setShowGoalEditModal] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [selfReflection, setSelfReflection] = useState('');
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);

  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const role = getRoleById(employee.roleId);

  const goals: Goal[] = [
    {
      title: 'Atingir 100% da meta comercial trimestral',
      weight: 30, progress: 94, status: 'on_track',
      actions: ['Revisar pipeline de oportunidades pendentes', 'Fechar 3 operações de crédito em aberto', 'Cross-selling em 5 atendimentos/dia'],
      notes: 'Meta ajustada em Jan/2026 para incluir consórcios no cálculo.',
    },
    {
      title: 'Manter satisfação do associado ≥ 85%',
      weight: 25, progress: 95, status: 'exceeded',
      actions: ['Manter rotina de follow-up pós-reunião', 'Enviar pesquisa de satisfação trimestral'],
      notes: 'Top 3 da agência neste indicador. Feedback positivo do GA.',
    },
    {
      title: 'Prospectar 5 novos associados/mês',
      weight: 20, progress: 60, status: 'at_risk',
      actions: ['Bloquear 2h semanais para prospecção', 'Ativar rede de indicações dos atuais associados', 'Participar de 1 evento comunitário/mês'],
      notes: 'Média atual: 3/mês. Gap de 2 associados.',
    },
    {
      title: 'Completar trilha de desenvolvimento Q2',
      weight: 15, progress: 45, status: 'behind',
      actions: ['Finalizar módulo "Liderança Fundamentals" (60%)', 'Iniciar "Análise Financeira para GNs"', 'Agendar mentoria com Paulo (GA Centro)'],
      notes: 'Atrasada por acúmulo de demandas. Conversar com gestor para reorganizar agenda.',
    },
    {
      title: 'Mentoria de 1 colaborador',
      weight: 10, progress: 80, status: 'on_track',
      actions: ['Manter encontros quinzenais com Lucas', 'Documentar evolução no PDI do mentorado'],
      notes: 'Mentorando Lucas (Assist. Atendimento). Evolução positiva.',
    },
  ];

  const overallScore = Math.round(goals.reduce((acc, g) => acc + (g.progress * g.weight / 100), 0));
  const statusColors: Record<GoalStatus, string> = { exceeded: '#22C55E', on_track: '#3FA110', at_risk: '#F59E0B', behind: '#EF4444' };
  const statusLabels: Record<GoalStatus, string> = { exceeded: 'Superando', on_track: 'No caminho', at_risk: 'Atenção', behind: 'Atrasado' };

  const performanceHistory = [
    { period: '2024 S1', score: 3.5, label: 'Consistente' },
    { period: '2024 S2', score: 3.8, label: 'Crescendo' },
    { period: '2025 S1', score: 4.0, label: 'Forte' },
    { period: '2025 S2', score: 4.1, label: 'Destaque' },
    { period: '2026 S1', score: 4.2, label: 'Referência' },
  ];

  const feedbacks = [
    { from: 'Roberto Mendes', date: 'Mar 2026', text: 'Mariana mostrou excelente evolução na gestão da carteira premium. Precisa investir mais em prospecção ativa.', type: 'líder', sentiment: 'positivo' },
    { from: 'Ana Paula Lima', date: 'Fev 2026', text: 'Ótima colega, sempre disposta a ajudar novos GNs. Tem potencial para liderança.', type: 'peer', sentiment: 'positivo' },
    { from: 'Auto-avaliação', date: 'Jan 2026', text: 'Sinto que estou pronta para mais responsabilidades. Quero desenvolver habilidades de liderança.', type: 'self', sentiment: 'neutro' },
  ];

  const handleSendFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSent(false);
      setFeedbackText('');
    }, 2000);
  };

  const handleSaveReflection = () => {
    setReflectionSaved(true);
    setTimeout(() => {
      setShowReflectionModal(false);
      setReflectionSaved(false);
      setSelfReflection('');
    }, 1500);
  };

  // Get evaluation data for current employee
  const avaliacaoAtual = avaliacoesMock.find(a => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliação de Desempenho</h1>
          <p className="text-sm text-gray-500 mt-1">Ciclo 2026 · Modo Contínuo · {role?.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReflectionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Auto-reflexão
          </button>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-verde-digital rounded-lg hover:bg-verde-600 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Pedir Feedback
          </button>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div variants={item} className="card p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#3FA110" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overallScore / 100) }}
                transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 metric-value">{overallScore}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900">Score Geral</p>
            <p className="text-sm text-gray-500 mt-0.5">Ponderação baseada em metas e expectativas do cargo</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Atualizado: Abr 2026</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Próxima conversa: 17/04</span>
            </div>
            {/* Summary chips */}
            <div className="flex gap-2 mt-3">
              {([['exceeded', 'Superando'], ['on_track', 'No caminho'], ['at_risk', 'Atenção'], ['behind', 'Atrasado']] as [GoalStatus, string][]).map(([status, label]) => {
                const count = goals.filter(g => g.status === status).length;
                if (count === 0) return null;
                return (
                  <span key={status} className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{
                    backgroundColor: `${statusColors[status]}15`,
                    color: statusColors[status],
                  }}>
                    {count} {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Competências Sicredi — Avaliação 360° */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="w-4 h-4 text-verde-digital" /> Competências — Jeito Sicredi de Ser
          </h2>
          <a href={ELOFY_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-verde-digital hover:underline">
            Abrir no Elofy <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 360° Model Weights */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Modelo 360° — Pesos da Avaliação</p>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 rounded-md py-1.5 text-center bg-blue-50">
              <p className="text-[10px] font-bold text-blue-700">Líder 50%</p>
            </div>
            <div className="flex-1 rounded-md py-1.5 text-center bg-purple-50">
              <p className="text-[10px] font-bold text-purple-700">Auto 25%</p>
            </div>
            <div className="flex-1 rounded-md py-1.5 text-center bg-amber-50">
              <p className="text-[10px] font-bold text-amber-700">Pares 25%</p>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5">*Pesos para pessoas colaboradoras. Lideranças: Líder 40%, Auto 20%, Time 20%, Pares 20%.</p>
        </div>

        {/* Régua de referência */}
        <div className="grid grid-cols-4 gap-1.5 mb-5">
          {reguaPerformance.map(nivel => (
            <div key={nivel.nivel} className="py-1.5 px-2 rounded text-center" style={{ backgroundColor: nivel.bgCor }}>
              <p className="text-xs font-bold" style={{ color: nivel.cor }}>{nivel.hashtag}</p>
              <p className="text-[9px] font-medium mt-0.5" style={{ color: nivel.cor }}>{nivel.descricao.split('.')[0]}</p>
            </div>
          ))}
        </div>
        {/* Competencies list */}
        <div className="space-y-3">
          {competenciasSicredi.map((comp) => {
            const avalComp = avaliacaoAtual?.competencias.find(c => c.competenciaId === comp.id);
            const autoNota = avalComp?.autoAvaliacao || 0;
            const liderNota = avalComp?.avaliacaoLider || 0;
            const consensoNota = avalComp?.consenso || 0;
            // Simulated pares note based on consensus for demo
            const paresNota = consensoNota > 0 ? Math.min(4, Math.max(1, consensoNota + (Math.random() > 0.5 ? 0 : -1))) : 0;
            return (
              <div key={comp.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.cor }} />
                    <p className="text-sm font-medium text-gray-800">{comp.nome}</p>
                  </div>
                  {consensoNota > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                      backgroundColor: reguaPerformance[consensoNota - 1]?.bgCor,
                      color: reguaPerformance[consensoNota - 1]?.cor,
                    }}>
                      {reguaPerformance[consensoNota - 1]?.hashtag}
                    </span>
                  )}
                </div>
                {avalComp && (
                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span>Auto <span className="text-[10px] text-gray-400">(25%)</span>: <strong className="text-gray-700">{reguaPerformance[autoNota - 1]?.hashtag || autoNota}</strong></span>
                    <span>Líder <span className="text-[10px] text-gray-400">(50%)</span>: <strong className="text-gray-700">{reguaPerformance[liderNota - 1]?.hashtag || liderNota}</strong></span>
                    <span>Pares <span className="text-[10px] text-gray-400">(25%)</span>: <strong className="text-gray-700">{reguaPerformance[Math.floor(paresNota) - 1]?.hashtag || '—'}</strong></span>
                    {avalComp.comentarioLider && (
                      <span className="text-purple-500 italic">&ldquo;{avalComp.comentarioLider}&rdquo;</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Goals */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-verde-digital" /> Metas & Objetivos
        </h2>
        <div className="space-y-3">
          {goals.map((goal, i) => {
            const isExpanded = expandedGoal === i;
            return (
              <div key={i} className="rounded-lg bg-gray-50 border border-gray-100 overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedGoal(isExpanded ? null : i)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      {goal.status === 'exceeded' || goal.status === 'on_track' ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: statusColors[goal.status] }} />
                      ) : (
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: statusColors[goal.status] }} />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{goal.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Peso: {goal.weight}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                        backgroundColor: `${statusColors[goal.status]}15`,
                        color: statusColors[goal.status],
                      }}>
                        {statusLabels[goal.status]}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: statusColors[goal.status] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i }}
                      />
                    </div>
                    <span className="text-sm font-bold metric-value" style={{ color: statusColors[goal.status] }}>
                      {goal.progress}%
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-100">
                        {/* Actions list */}
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Ações pendentes</p>
                          <div className="space-y-1.5">
                            {goal.actions.map((action, ai) => (
                              <div key={ai} className="flex items-start gap-2 text-sm text-gray-600">
                                <div className="w-4 h-4 rounded border border-gray-300 mt-0.5 shrink-0 flex items-center justify-center hover:border-verde-digital cursor-pointer transition-colors" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Notes */}
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-[11px] font-semibold text-blue-600 mb-1">Observações</p>
                          <p className="text-xs text-blue-700">{goal.notes}</p>
                        </div>
                        {/* Quick actions */}
                        <div className="flex gap-2">
                          <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-verde-50 text-verde-digital hover:bg-verde-100 transition-colors flex items-center gap-1">
                            <Edit3 className="w-3 h-3" /> Atualizar progresso
                          </button>
                          <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Pedir ajuda ao líder
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Performance trend */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" /> Histórico de Performance
        </h2>
        <div className="flex items-end justify-between h-40 px-2">
          {performanceHistory.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
              <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">{p.label}</span>
              <motion.div
                className="w-12 rounded-t-lg cursor-pointer transition-all group-hover:opacity-90"
                style={{ background: `linear-gradient(to top, #146E37, #3FA110)` }}
                initial={{ height: 0 }}
                animate={{ height: `${(p.score / 5) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              />
              <span className="text-[10px] text-gray-400">{p.period}</span>
              <span className="text-xs font-bold text-gray-700 metric-value">{p.score}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feedback history */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500" /> Feedbacks Recentes
          </h2>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Solicitar
          </button>
        </div>
        <div className="space-y-3">
          {feedbacks.map((fb, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800">{fb.from}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500 uppercase">{fb.type}</span>
                  {fb.sentiment === 'positivo' && <ThumbsUp className="w-3 h-3 text-green-400" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{fb.text}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {fb.date}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ===== FEEDBACK REQUEST MODAL ===== */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {feedbackSent ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Solicitação Enviada!</p>
                  <p className="text-sm text-gray-500 mt-1">O feedback será recebido de forma anônima.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Solicitar Feedback</h3>
                    <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Escolha sobre qual tema você gostaria de receber feedback dos seus colegas e líder.
                  </p>
                  <div className="space-y-2 mb-4">
                    {['Habilidade Comercial', 'Relacionamento com Associados', 'Trabalho em Equipe', 'Prospecção', 'Liderança'].map(topic => (
                      <label key={topic} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 hover:bg-verde-50 cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-verde-digital focus:ring-verde-digital" />
                        <span className="text-sm text-gray-700">{topic}</span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Adicione uma mensagem (opcional)..."
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none h-20 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                  />
                  <button
                    onClick={handleSendFeedback}
                    className="w-full mt-4 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Enviar Solicitação
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SELF-REFLECTION MODAL ===== */}
      <AnimatePresence>
        {showReflectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowReflectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {reflectionSaved ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Reflexão Salva!</p>
                  <p className="text-sm text-gray-500 mt-1">Ela ficará disponível para sua próxima conversa de carreira.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" /> Auto-reflexão
                    </h3>
                    <button onClick={() => setShowReflectionModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">O que estou fazendo bem?</label>
                      <textarea
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none h-20 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                        placeholder="Seus pontos fortes deste período..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Onde quero crescer?</label>
                      <textarea
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none h-20 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                        placeholder="Áreas que desejo desenvolver..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">De que apoio preciso?</label>
                      <textarea
                        value={selfReflection}
                        onChange={(e) => setSelfReflection(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none h-20 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                        placeholder="Recursos, mentoria, treinamentos..."
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                      <p className="text-xs text-purple-600">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Estas reflexões são privadas e só serão compartilhadas quando você decidir, como nas conversas de carreira com seu líder.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveReflection}
                    className="w-full mt-4 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors"
                  >
                    Salvar Reflexão
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
