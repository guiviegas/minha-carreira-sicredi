'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, CheckCircle2, AlertCircle, ArrowRight, Sparkles, BarChart3,
  ChevronDown, ChevronUp, MessageSquare, BookOpen, Lightbulb, X,
  Send, Clock, Award, ArrowUpRight, Info
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

type ExpStatus = 'exceeded' | 'on_track' | 'at_risk' | 'behind';

interface Expectation {
  text: string;
  progress: number;
  status: ExpStatus;
  details: string;
  tips: string[];
  relatedCourse?: string;
}

export default function ExpectativasPage() {
  const { currentPersona } = usePersona();
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showClarityDetail, setShowClarityDetail] = useState(false);
  const [aiQuestion, setAIQuestion] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [aiLoading, setAILoading] = useState(false);

  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const role = getRoleById(employee.roleId);
  if (!role) return null;

  const expectations: Expectation[] = [
    {
      text: 'Gestão de carteira de +180 associados com atendimento de excelência',
      progress: 92, status: 'exceeded',
      details: 'Atualmente gerencia 195 associados. NPS individual: 91. Destaque no atendimento personalizado e follow-up proativo.',
      tips: ['Documentar suas melhores práticas para compartilhar', 'Considerar mentoria a colegas neste tema'],
      relatedCourse: 'Excelência no Atendimento Cooperativo',
    },
    {
      text: 'Atingir meta comercial trimestral (cross-selling, novos produtos)',
      progress: 88, status: 'on_track',
      details: 'Meta Q1: R$ 2.4M em carteira / Realizado: R$ 2.1M (88%). Cross-selling em 34% dos atendimentos.',
      tips: ['Focar em seguros e consórcios — maior gap', 'Mapear 10 associados com potencial de cross-selling esta semana'],
      relatedCourse: 'Estratégias de Cross-selling',
    },
    {
      text: 'Manter índice de satisfação do associado ≥ 85%',
      progress: 95, status: 'exceeded',
      details: 'Satisfação atual: 95%. Top 3 da agência. Feedbacks destacam empatia e clareza na comunicação.',
      tips: ['Manter rotina de contato pós-operação', 'Adicionar pesquisa de satisfação em novos canais'],
    },
    {
      text: 'Análise e concessão de crédito dentro dos limites de alçada',
      progress: 78, status: 'on_track',
      details: 'Aprovando dentro do limite. 3 operações foram escaladas ao gerente por exceder alçada — normal para a carteira.',
      tips: ['Revisar limites com o GA para possível ampliação', 'Aprofundar análise de risco para operações maiores'],
      relatedCourse: 'Análise de Crédito Avançada',
    },
    {
      text: 'Prospecção ativa de novos associados (mínimo 5/mês)',
      progress: 60, status: 'at_risk',
      details: 'Média de 3 novos associados/mês nos últimos 3 meses. Gap de 2 associados para atingir o mínimo.',
      tips: ['Bloquear 2h/semana para prospecção', 'Ativar programa de indicações com associados atuais', 'Participar de eventos da comunidade'],
      relatedCourse: 'Prospecção Inteligente',
    },
    {
      text: 'Participação em treinamentos obrigatórios (compliance, LGPD)',
      progress: 45, status: 'behind',
      details: 'Pendente: Módulo LGPD Avançado e Atualização de Compliance Q2. Prazo: 30/04/2026.',
      tips: ['Agendar 1h diária esta semana para completar', 'Priorizar LGPD — prazo regulatório'],
      relatedCourse: 'LGPD e Compliance Bancário',
    },
    {
      text: 'Mentoria a pelo menos 1 colaborador mais novo',
      progress: 80, status: 'on_track',
      details: 'Mentorando Lucas Silva (Assist. Atendimento). Encontros quinzenais. Lucas progrediu em 3 competências.',
      tips: ['Documentar evolução do mentorado no PDI', 'Considerar mentorar um segundo colaborador'],
    },
    {
      text: 'Contribuição em projetos da agência e cooperativa',
      progress: 70, status: 'on_track',
      details: 'Participou do projeto "Semana do Associado". Candidatura pendente para projeto na Agência Centro.',
      tips: ['Finalizar candidatura do projeto', 'Propor uma melhoria de processo na agência'],
    },
  ];

  const clarityScore = Math.round(expectations.reduce((acc, e) => acc + e.progress, 0) / expectations.length);
  const statusColors: Record<ExpStatus, string> = { exceeded: '#22C55E', on_track: '#3FA110', at_risk: '#F59E0B', behind: '#EF4444' };
  const statusLabels: Record<ExpStatus, string> = { exceeded: 'Superando', on_track: 'No caminho', at_risk: 'Atenção', behind: 'Atrasado' };

  const handleAIChat = () => {
    if (!aiQuestion.trim()) return;
    setAILoading(true);
    setTimeout(() => {
      setAIResponse(`Sobre "${aiQuestion}": Considerando seu perfil como ${role.title}, recomendo focar nas expectativas que estão em "Atenção" — especialmente prospecção. Uma abordagem eficaz seria combinar prospecção com seus pontos fortes em relacionamento. Seu NPS de 95% mostra que associados confiam em você, então pedir indicações pode ser mais eficaz que prospecção fria.`);
      setAILoading(false);
    }, 1200);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expectativas Claras</h1>
          <p className="text-sm text-gray-500 mt-1">O que é esperado de você como {role.title}</p>
        </div>
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Conversar sobre isso
        </button>
      </motion.div>

      {/* Clarity Thermometer + Mirror */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Thermometer */}
        <motion.div
          variants={item}
          className="card p-5 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowClarityDetail(!showClarityDetail)}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Termômetro de Clareza</p>
          <div className="w-16 h-48 bg-gray-100 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-full"
              style={{ background: `linear-gradient(to top, #146E37, #3FA110, #5AB748)` }}
              initial={{ height: 0 }}
              animate={{ height: `${clarityScore}%` }}
              transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white mix-blend-difference metric-value">{clarityScore}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            {clarityScore >= 80 ? 'Excelente clareza!' : clarityScore >= 60 ? 'Boa clareza' : 'Precisa atenção'}
          </p>
          {/* Summary chips */}
          <div className="flex flex-wrap gap-1 mt-3 justify-center">
            {(['exceeded', 'on_track', 'at_risk', 'behind'] as ExpStatus[]).map(status => {
              const count = expectations.filter(e => e.status === status).length;
              if (count === 0) return null;
              return (
                <span key={status} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{
                  backgroundColor: `${statusColors[status]}15`,
                  color: statusColors[status]
                }}>
                  {count}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* Mirror — Side by Side */}
        <motion.div variants={item} className="card p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Espelho: Esperado vs. Realizado</p>
          </div>
          <div className="space-y-3">
            {role.requiredSkills.slice(0, 5).map((rs) => {
              const empSkill = employee.skills.find(s => s.id === rs.skillId);
              const current = empSkill?.level || 0;
              const gap = rs.minLevel - current;
              return (
                <div key={rs.skillId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{rs.skillName}</span>
                    <span className="text-xs text-gray-400">
                      {current} / {rs.minLevel} esperado
                      {gap <= 0 && <CheckCircle2 className="w-3 h-3 text-green-400 inline ml-1" />}
                    </span>
                  </div>
                  <div className="flex gap-1 h-2.5 relative">
                    <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min((current / rs.minLevel) * 100, 100)}%`,
                          backgroundColor: gap <= 0 ? '#22C55E' : gap <= 10 ? '#F59E0B' : '#EF4444',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((current / rs.minLevel) * 100, 100)}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    {/* Expected marker */}
                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gray-300" style={{ right: '0' }} />
                  </div>
                  {gap > 0 && (
                    <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
                      <ArrowUpRight className="w-2.5 h-2.5" /> Gap: {gap} pontos
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Clarity Detail Breakdown */}
      <AnimatePresence>
        {showClarityDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-5 bg-gradient-to-br from-green-50/50 to-white">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-verde-digital" />
                <p className="text-sm font-semibold text-gray-800">Detalhamento da Clareza</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-white border border-green-100 text-center">
                  <p className="text-xl font-bold text-green-600 metric-value">{expectations.filter(e => e.status === 'exceeded').length}</p>
                  <p className="text-[11px] text-gray-500">Superando</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-green-100 text-center">
                  <p className="text-xl font-bold text-verde-digital metric-value">{expectations.filter(e => e.status === 'on_track').length}</p>
                  <p className="text-[11px] text-gray-500">No caminho</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-100 text-center">
                  <p className="text-xl font-bold text-amber-500 metric-value">{expectations.filter(e => e.status === 'at_risk').length}</p>
                  <p className="text-[11px] text-gray-500">Atenção</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-red-100 text-center">
                  <p className="text-xl font-bold text-red-500 metric-value">{expectations.filter(e => e.status === 'behind').length}</p>
                  <p className="text-[11px] text-gray-500">Atrasado</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expectations Checklist — Interactive */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-verde-digital" /> Checklist de Expectativas
          </h2>
          <span className="text-xs text-gray-400">{expectations.filter(e => e.progress >= 80).length}/{expectations.length} no caminho</span>
        </div>
        <div className="space-y-2">
          {expectations.map((exp, i) => {
            const isExpanded = expandedExp === i;
            return (
              <div key={i} className="rounded-lg bg-gray-50 overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedExp(isExpanded ? null : i)}
                  className="w-full flex items-start gap-3 p-3 text-left"
                >
                  <div className="mt-0.5 shrink-0">
                    {exp.status === 'exceeded' || exp.status === 'on_track' ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: statusColors[exp.status] }} />
                    ) : (
                      <AlertCircle className="w-5 h-5" style={{ color: statusColors[exp.status] }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{exp.text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: statusColors[exp.status] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${exp.progress}%` }}
                          transition={{ duration: 0.6, delay: 0.05 * i }}
                        />
                      </div>
                      <span className="text-xs font-semibold metric-value" style={{ color: statusColors[exp.status] }}>
                        {exp.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{
                      backgroundColor: `${statusColors[exp.status]}15`,
                      color: statusColors[exp.status],
                    }}>
                      {statusLabels[exp.status]}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
                        {/* Detail text */}
                        <p className="text-sm text-gray-600">{exp.details}</p>
                        {/* Tips */}
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                          <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mb-1.5">
                            <Lightbulb className="w-3 h-3" /> Dicas para melhorar
                          </p>
                          <ul className="space-y-1">
                            {exp.tips.map((tip, ti) => (
                              <li key={ti} className="text-xs text-amber-700 flex items-start gap-1.5">
                                <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Related course */}
                        {exp.relatedCourse && (
                          <button className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors w-full text-left">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span>Curso recomendado: {exp.relatedCourse}</span>
                            <ArrowRight className="w-3 h-3 ml-auto" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ===== AI CHAT MODAL ===== */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Sobre suas expectativas</h3>
                    <p className="text-[11px] text-gray-400">Converse sobre como evoluir</p>
                  </div>
                </div>
                <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  'Como melhorar minha prospecção?',
                  'Estou superando em satisfação. E agora?',
                  'Como priorizar tantas expectativas?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setAIQuestion(q); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Response area */}
              {aiResponse && (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiResponse}</p>
                </div>
              )}

              {aiLoading && (
                <div className="flex justify-center py-4 mb-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAIQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIChat()}
                  placeholder="Pergunte sobre suas expectativas..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none text-sm"
                />
                <button
                  onClick={handleAIChat}
                  disabled={!aiQuestion.trim() || aiLoading}
                  className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
