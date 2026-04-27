'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, AlertTriangle, TrendingUp, MessageSquare, ArrowRight, CheckCircle2,
  Sparkles, Target, Clock, Calendar, X, Send, Heart, Shield, BarChart3,
  ChevronDown, ChevronUp, Star, Zap, Phone, Mail
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function EquipePage() {
  const { currentPersona } = usePersona();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showOneOnOne, setShowOneOnOne] = useState(false);
  const [showStayConversation, setShowStayConversation] = useState(false);
  const [stayMember, setStayMember] = useState<string | null>(null);
  const [oneOnOneSaved, setOneOnOneSaved] = useState(false);
  const [staySaved, setStaySaved] = useState(false);
  const [showDevelopmentPlan, setShowDevelopmentPlan] = useState(false);

  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const team = getTeamForLeader(employee.id);

  const getStatus = (emp: NonNullable<ReturnType<typeof getEmployeeById>>) => {
    if (emp.turnoverRisk && emp.turnoverRisk.probability > 70) return { color: '#EF4444', label: 'Risco Alto', bg: 'bg-red-50', border: 'border-red-200', dot: 'red' };
    if (emp.onboarding && emp.onboarding.percentage < 100) return { color: '#3B82F6', label: 'Onboarding', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'blue' };
    if (emp.engagementScore < 60) return { color: '#F59E0B', label: 'Atenção', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'yellow' };
    return { color: '#22C55E', label: 'No caminho', bg: 'bg-green-50', border: 'border-green-200', dot: 'green' };
  };

  const selectedEmp = selectedMember ? getEmployeeById(selectedMember) : null;
  const stayEmp = stayMember ? getEmployeeById(stayMember) : null;

  const teamStats = {
    avgEngagement: Math.round(team.reduce((a, t) => a + t.engagementScore, 0) / team.length),
    avgPerformance: (team.reduce((a, t) => a + t.performanceRating, 0) / team.length).toFixed(1),
    riskCount: team.filter(t => t.turnoverRisk && t.turnoverRisk.probability > 70).length,
    onboardingCount: team.filter(t => t.onboarding && t.onboarding.percentage < 100).length,
  };

  const handleScheduleOneOnOne = () => {
    setOneOnOneSaved(true);
    setTimeout(() => { setShowOneOnOne(false); setOneOnOneSaved(false); }, 1500);
  };

  const handleScheduleStay = () => {
    setStaySaved(true);
    setTimeout(() => { setShowStayConversation(false); setStaySaved(false); }, 1500);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Minha Equipe</h1>
        <p className="text-sm text-gray-500 mt-1">{team.length} pessoas · Agência Ipê</p>
      </motion.div>

      {/* Team Overview Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4 text-center">
          <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 metric-value">{team.length}</p>
          <p className="text-[11px] text-gray-500">Total da equipe</p>
        </div>
        <div className="card p-4 text-center">
          <BarChart3 className="w-5 h-5 text-verde-digital mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 metric-value">{teamStats.avgEngagement}%</p>
          <p className="text-[11px] text-gray-500">Engajamento médio</p>
        </div>
        <div className="card p-4 text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 metric-value">{teamStats.avgPerformance}</p>
          <p className="text-[11px] text-gray-500">Performance média</p>
        </div>
        <div className="card p-4 text-center">
          <AlertTriangle className={`w-5 h-5 mx-auto mb-2 ${teamStats.riskCount > 0 ? 'text-red-500' : 'text-green-500'}`} />
          <p className={`text-2xl font-bold metric-value ${teamStats.riskCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{teamStats.riskCount}</p>
          <p className="text-[11px] text-gray-500">Alertas de risco</p>
        </div>
      </motion.div>

      {/* Alerts */}
      {team.filter(t => t.turnoverRisk && t.turnoverRisk.probability > 70).map(t => (
        <motion.div key={t.id} variants={item} className="card p-4 border-l-4 border-l-red-400 bg-red-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Alerta: {t.name}</p>
              <p className="text-sm text-red-700 mt-0.5">
                Probabilidade de saída: <strong>{t.turnoverRisk!.probability}%</strong> em {t.turnoverRisk!.timeframe}
              </p>
              <div className="mt-2 space-y-1">
                {t.turnoverRisk!.signals.map((s, i) => (
                  <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    {s.description}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setStayMember(t.id);
                    setShowStayConversation(true);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <Heart className="w-3 h-3" /> Agendar Stay Conversation
                </button>
                <button
                  onClick={() => setSelectedMember(t.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Ver perfil completo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Team Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {team.map((member) => {
          const status = getStatus(member);
          const memberRole = getRoleById(member.roleId);
          const isSelected = selectedMember === member.id;
          return (
            <button
              key={member.id}
              onClick={() => setSelectedMember(isSelected ? null : member.id)}
              className={`card card-interactive p-4 text-left border-l-4 transition-all ${isSelected ? 'ring-2 ring-verde-digital shadow-md' : ''}`}
              style={{ borderLeftColor: status.color }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg avatar-initials text-[11px]" style={{ backgroundColor: status.color }}>
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-800 truncate">{member.name}</p>
                  <p className="text-[11px] text-neutral-500">{memberRole?.shortTitle}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={`status-dot status-dot-${status.dot}`} />
                    <span className="text-[11px] text-neutral-500">{status.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold metric-value" style={{ color: status.color }}>{member.engagementScore}</p>
                  <p className="text-[10px] text-gray-400">engaj.</p>
                  <p className="text-xs font-semibold text-gray-600 metric-value mt-1">{member.performanceRating.toFixed(1)}</p>
                  <p className="text-[10px] text-gray-400">perf.</p>
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Selected Member Detail */}
      <AnimatePresence>
        {selectedEmp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-5 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg avatar-initials text-sm" style={{ backgroundColor: getStatus(selectedEmp).color }}>
                {selectedEmp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedEmp.name}</h3>
                    <p className="text-sm text-gray-500">{getRoleById(selectedEmp.roleId)?.title}</p>
                  </div>
                  <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedEmp.bio && <p className="text-sm text-gray-600 mt-2">{selectedEmp.bio}</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-gray-50 text-center">
                    <p className="text-lg font-bold metric-value">{selectedEmp.engagementScore}</p>
                    <p className="text-[11px] text-gray-500">Engajamento</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 text-center">
                    <p className="text-lg font-bold metric-value">{selectedEmp.performanceRating.toFixed(1)}</p>
                    <p className="text-[11px] text-gray-500">Performance</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 text-center">
                    <p className="text-lg font-bold metric-value">{selectedEmp.tenureMonths}m</p>
                    <p className="text-[11px] text-gray-500">Tenure</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 text-center">
                    <p className="text-lg font-bold metric-value">{selectedEmp.skills.length}</p>
                    <p className="text-[11px] text-gray-500">Skills</p>
                  </div>
                </div>

                {/* Skills summary */}
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Top Competências</p>
                  <div className="space-y-1.5">
                    {selectedEmp.skills.sort((a, b) => b.level - a.level).slice(0, 4).map(skill => (
                      <div key={skill.id} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-32 truncate">{skill.name}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-verde-digital" style={{ width: `${skill.level}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 metric-value w-8 text-right">{skill.level}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEmp.aspirations.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-purple-50 text-sm text-purple-700">
                    <Target className="w-3.5 h-3.5 inline mr-1" />
                    Aspiração: {getRoleById(selectedEmp.aspirations[0].targetRoleId)?.title} ({selectedEmp.aspirations[0].timeframe})
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setShowOneOnOne(true)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-verde-digital text-white hover:bg-verde-600 transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" /> Preparar 1:1
                  </button>
                  <button
                    onClick={() => setShowDevelopmentPlan(true)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" /> Plano de Desenvolvimento
                  </button>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Enviar mensagem
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1:1 Preparation Modal */}
      <AnimatePresence>
        {showOneOnOne && selectedEmp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
            onClick={() => setShowOneOnOne(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {oneOnOneSaved ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">1:1 Agendada!</p>
                  <p className="text-sm text-gray-500 mt-1">Convite enviado para {selectedEmp.name}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Preparação de 1:1</h3>
                      <p className="text-xs text-gray-500">Com {selectedEmp.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-xs font-semibold text-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Pontos Fortes</p>
                      <p className="text-sm text-green-800 mt-1">Performance rating: {selectedEmp.performanceRating.toFixed(1)} · {selectedEmp.skills.length} competências mapeadas</p>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Roteiro Sugerido pela IA</p>
                      <ol className="text-sm text-purple-800 mt-2 space-y-1.5 list-decimal list-inside">
                        <li>Reconheça os resultados recentes (engajamento: {selectedEmp.engagementScore})</li>
                        <li>Pergunte sobre motivações e desafios atuais</li>
                        <li>Explore aspirações de carreira (pergunte antes de assumir)</li>
                        <li>Defina 1-2 ações concretas para a próxima semana</li>
                      </ol>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs font-semibold text-amber-700 flex items-center gap-1"><Target className="w-3 h-3" /> Dica de Coaching</p>
                      <p className="text-sm text-amber-800 mt-1">
                        &ldquo;Pergunte &apos;O que você acha que precisa para chegar lá?&apos; antes de oferecer conselhos.&rdquo;
                      </p>
                    </div>

                    {/* Date picker */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Data e horário</label>
                      <input
                        type="datetime-local"
                        defaultValue="2026-04-17T14:00"
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Notas adicionais</label>
                      <textarea
                        placeholder="Adicione tópicos específicos para a conversa..."
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none h-20 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button onClick={handleScheduleOneOnOne} className="flex-1 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Agendar 1:1
                    </button>
                    <button onClick={() => setShowOneOnOne(false)} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Fechar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== STAY CONVERSATION MODAL ===== */}
      <AnimatePresence>
        {showStayConversation && stayEmp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
            onClick={() => setShowStayConversation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {staySaved ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Stay Conversation Agendada!</p>
                  <p className="text-sm text-gray-500 mt-1">Convite para {stayEmp.name} e alerta para P&C registrado.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Stay Conversation</h3>
                      <p className="text-xs text-gray-500">Com {stayEmp.name} · Risco: {stayEmp.turnoverRisk?.probability}%</p>
                    </div>
                    <button onClick={() => setShowStayConversation(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                    <p className="text-xs font-semibold text-red-700 mb-1">Sinais identificados</p>
                    <div className="space-y-1">
                      {stayEmp.turnoverRisk?.signals.map((s, i) => (
                        <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${s.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          {s.description}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                    <p className="text-xs font-semibold text-purple-700 flex items-center gap-1 mb-2">
                      <Sparkles className="w-3 h-3" /> Roteiro de Stay Conversation
                    </p>
                    <ol className="text-sm text-purple-800 space-y-2 list-decimal list-inside">
                      <li><strong>Abertura empática:</strong> &ldquo;Quero entender como você está se sentindo...&rdquo;</li>
                      <li><strong>Escuta ativa:</strong> Pergunte o que mais valoriza no trabalho atual</li>
                      <li><strong>Explorar frustrações:</strong> &ldquo;O que te incomoda ou poderia melhorar?&rdquo;</li>
                      <li><strong>Oferecer apoio:</strong> Mostre ações concretas que você pode tomar</li>
                      <li><strong>Compromisso:</strong> Defina 1-2 ações imediatas e agende follow-up</li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 mb-4">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Esta conversa é confidencial. Apenas o registro do plano de ação será compartilhado com P&C.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Data e horário</label>
                      <input
                        type="datetime-local"
                        defaultValue="2026-04-14T10:00"
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Formato</label>
                      <select className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none">
                        <option>Presencial (recomendado)</option>
                        <option>Videoconferência</option>
                        <option>Almoço informal</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={handleScheduleStay} className="w-full mt-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" /> Agendar Stay Conversation
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DEVELOPMENT PLAN MODAL ===== */}
      <AnimatePresence>
        {showDevelopmentPlan && selectedEmp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
            onClick={() => setShowDevelopmentPlan(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Plano de Desenvolvimento</h3>
                <button onClick={() => setShowDevelopmentPlan(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-gray-500 mb-4">{selectedEmp.name} · {getRoleById(selectedEmp.roleId)?.title}</p>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-verde-50 border border-green-200">
                  <p className="text-xs font-semibold text-verde-impresso mb-2">Pontos fortes a manter</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmp.skills.filter(s => s.level >= 70).slice(0, 3).map(s => (
                      <span key={s.id} className="text-xs px-2 py-0.5 bg-white rounded-full text-green-700">{s.name}: {s.level}%</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 mb-2">Áreas para desenvolver</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmp.skills.filter(s => s.level < 60).slice(0, 3).map(s => (
                      <span key={s.id} className="text-xs px-2 py-0.5 bg-white rounded-full text-amber-700">{s.name}: {s.level}%</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 mb-2"><Sparkles className="w-3 h-3" /> Ações sugeridas</p>
                  <ul className="text-sm text-blue-800 space-y-1.5">
                    <li className="flex items-start gap-2"><Zap className="w-3 h-3 mt-0.5 shrink-0" /> Trilha de desenvolvimento focada em gaps</li>
                    <li className="flex items-start gap-2"><Zap className="w-3 h-3 mt-0.5 shrink-0" /> Mentoria com profissional sênior da área</li>
                    <li className="flex items-start gap-2"><Zap className="w-3 h-3 mt-0.5 shrink-0" /> Projeto temporário / Job Shadow para experiência prática</li>
                    <li className="flex items-start gap-2"><Zap className="w-3 h-3 mt-0.5 shrink-0" /> Feedback quinzenal estruturado</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowDevelopmentPlan(false)}
                className="w-full mt-5 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors"
              >
                Criar Plano no GPS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Succession Map */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-verde-digital" /> Mapa de Sucessão
        </h2>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl avatar-initials text-lg mx-auto mb-2" style={{ backgroundColor: '#1E5FA6' }}>
              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <p className="text-xs font-semibold text-gray-700">{employee.name}</p>
            <p className="text-[10px] text-gray-400">GA (Atual)</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300" />
          <div className="flex-1 grid grid-cols-2 gap-3">
            {team.filter(t => t.readinessScores.some(r => r.targetRoleId === 'role-gerente-agencia')).map(t => {
              const readiness = t.readinessScores.find(r => r.targetRoleId === 'role-gerente-agencia');
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedMember(t.id)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-verde-digital/30 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md avatar-initials text-[10px]" style={{ backgroundColor: '#33820D' }}>
                      {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <p className="text-[11px] text-gray-500">{getRoleById(t.roleId)?.shortTitle}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-verde-digital" style={{ width: `${readiness?.score || 0}%` }} />
                    </div>
                    <span className="text-xs font-bold text-verde-digital metric-value">{readiness?.score || 0}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
