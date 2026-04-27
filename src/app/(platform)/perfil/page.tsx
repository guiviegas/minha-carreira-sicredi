'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { competenciasSicredi } from '@/data/competencias-sicredi';
import { avaliacoesMock, reguaPerformance, reguaProntidao } from '@/data/elofy-config';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BookOpen, Calendar, Edit3, Eye, EyeOff, MapPin, Share2, Star,
  Target, TrendingUp, Zap, X, CheckCircle2, Download, Copy, ChevronDown,
  ChevronUp, ExternalLink, Shield, Clock, Handshake, Lightbulb, Trophy,
  Heart, Compass,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const achievementIcons: Record<string, LucideIcon> = {
  star: Star, target: Target, handshake: Handshake, lightbulb: Lightbulb,
  trophy: Trophy, award: Award, zap: Zap, shield: Shield,
};

function getCompatibilityLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Supera', color: 'text-green-600', bg: 'bg-green-50' };
  if (score >= 65) return { label: 'Atende', color: 'text-verde-digital', bg: 'bg-verde-50' };
  if (score >= 50) return { label: 'Próximo', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { label: 'Em desenvolvimento', color: 'text-orange-600', bg: 'bg-orange-50' };
}

export default function PerfilPage() {
  const { currentPersona } = usePersona();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAspirationModal, setShowAspirationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [editSaved, setEditSaved] = useState(false);
  const [aspirationShared, setAspirationShared] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const role = getRoleById(employee.roleId);

  const categoryAverages = employee.skills.reduce<Record<string, { total: number; count: number }>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = { total: 0, count: 0 };
    acc[s.category].total += s.level;
    acc[s.category].count += 1;
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    relacional: 'Relacional', tecnica: 'Técnica', lideranca: 'Liderança',
    estrategica: 'Estratégica', cooperativismo: 'Cooperativismo',
    financeira: 'Financeira', digital: 'Digital',
  };

  const handleSaveEdit = () => {
    setEditSaved(true);
    setTimeout(() => { setShowEditModal(false); setEditSaved(false); }, 1500);
  };

  const handleShareAspiration = () => {
    setAspirationShared(true);
    setTimeout(() => { setShowAspirationModal(false); setAspirationShared(false); }, 1500);
  };

  const handleCopyLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      {/* Header Card */}
      <motion.div variants={item} className="card overflow-hidden">
        <div className="h-28 relative" style={{
          background: `linear-gradient(135deg, ${currentPersona.color}CC, ${currentPersona.color}88)`,
        }}>
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
          </div>
        </div>
        <div className="px-6 pb-5 relative">
          <div className="flex items-end gap-4 -mt-8">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white relative">
              <Image
                src={`/personas/${currentPersona.id}.png`}
                alt={employee.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="pb-1 flex-1">
              <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-sm text-gray-500">{role?.title} · {currentPersona.cooperative}</p>
            </div>
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Compartilhar
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-white bg-verde-digital hover:bg-verde-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar
              </button>
            </div>
          </div>
          {employee.bio && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{employee.bio}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {employee.tenure > 0 ? `${employee.tenure} anos` : `${employee.tenureMonths} meses`} de Sicredi</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {currentPersona.branch || currentPersona.cooperative}</span>
          </div>
        </div>
      </motion.div>

      {/* Career Passport */}
      <motion.div variants={item} className="card p-5 border-l-4 border-l-verde-digital">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-verde-digital" />
          <h2 className="text-sm font-semibold text-gray-800">Passaporte de Carreira</h2>
        </div>
        {(() => {
          const avaliacao = avaliacoesMock.find(a => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1');
          const aspiracao = employee.aspirations[0];
          const cargoAspirado = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;
          const prontConfig = avaliacao?.prontidaoId ? reguaProntidao.find(r => r.id === avaliacao.prontidaoId) : null;
          const perfNota = avaliacao?.notaFinalPerformance || 0;
          const perfConfig = perfNota > 0 ? reguaPerformance[perfNota - 1] : null;

          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Aspiração */}
              <div className="p-3 rounded-lg bg-purple-50 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-500">Aspiração</p>
                <p className="text-sm font-bold text-purple-700 mt-1">{cargoAspirado?.shortTitle || '-'}</p>
                {aspiracao && <p className="text-[10px] text-purple-400 mt-0.5">{aspiracao.timeframe}</p>}
              </div>
              {/* Performance */}
              {perfConfig && (
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: perfConfig.bgCor }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: perfConfig.cor }}>Performance</p>
                  <p className="text-xs font-bold mt-1" style={{ color: perfConfig.cor }}>{perfConfig.hashtag}</p>
                </div>
              )}
              {/* Prontidão */}
              {prontConfig && (
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: prontConfig.bgCor }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: prontConfig.cor }}>Prontidão</p>
                  <p className="text-xs font-bold mt-1" style={{ color: prontConfig.cor }}>{prontConfig.nome}</p>
                </div>
              )}
              {/* Competências */}
              {avaliacao && (
                <div className="p-3 rounded-lg bg-verde-50 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-verde-digital">Competências</p>
                  <p className="text-xs font-bold text-verde-digital mt-1">Jeito Sicredi de Ser</p>
                  <p className="text-[10px] text-verde-digital mt-0.5">{avaliacao.competencias.length} avaliadas</p>
                </div>
              )}
            </div>
          );
        })()}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Skills — Interactive */}
          <motion.div variants={item} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" /> Competências
              </h2>
              <span className="text-[11px] text-gray-400">Clique para detalhes</span>
            </div>
            <div className="space-y-2">
              {employee.skills
                .sort((a, b) => b.level - a.level)
                .map((skill) => {
                  const isExpanded = expandedSkill === skill.id;
                  const required = role?.requiredSkills.find(rs => rs.skillId === skill.id);
                  return (
                    <div key={skill.id} className="rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 flex items-center gap-1.5">
                            {skill.name}
                            {required && skill.level >= required.minLevel && (
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                            )}
                          </span>
                          <span className="font-semibold text-gray-800 metric-value">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: skill.level >= 80 ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                                : skill.level >= 60 ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                                : 'linear-gradient(90deg, #EF4444, #DC2626)',
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-2 pb-2 pt-1 space-y-2">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Categoria: {categoryLabels[skill.category] || skill.category}</span>
                                {required && (
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" /> Esperado: {required.minLevel}%
                                    {skill.level < required.minLevel && (
                                      <span className="text-red-500 font-semibold"> (gap: {required.minLevel - skill.level})</span>
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button className="text-[11px] px-2.5 py-1 rounded bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" /> Cursos relacionados
                                </button>
                                <button className="text-[11px] px-2.5 py-1 rounded bg-verde-50 text-verde-digital font-medium hover:bg-verde-100 transition-colors flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" /> Plano de desenvolvimento
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

          {/* Category Summary */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Perfil por Categoria</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(categoryAverages).map(([cat, data]) => {
                const avg = Math.round(data.total / data.count);
                return (
                  <div key={cat} className="p-3 rounded-lg bg-gray-50 text-center hover:shadow-sm transition-shadow cursor-pointer">
                    <p className="text-xl font-bold metric-value" style={{
                      color: avg >= 80 ? '#22C55E' : avg >= 60 ? '#F59E0B' : '#EF4444'
                    }}>{avg}%</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{categoryLabels[cat] || cat}</p>
                    <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${avg}%`,
                        backgroundColor: avg >= 80 ? '#22C55E' : avg >= 60 ? '#F59E0B' : '#EF4444'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Career Timeline */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-verde-digital" /> Jornada no Sicredi
            </h2>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
              {[
                { date: '2023-04', title: 'Ingresso como GN PF1', desc: 'Agência Ipê · Cooperativa Caminhos', highlight: false },
                { date: '2024-06', title: 'Promoção para GN PF2', desc: 'Carteira de média/alta renda', highlight: true },
                { date: '2025-11', title: 'Certificação CPA-20', desc: 'Habilitação para investimentos', highlight: true },
                { date: '2026-03', title: 'Top 3 Satisfação da Agência', desc: 'Reconhecimento do trimestre', highlight: false },
              ].map((event, i) => (
                <div key={i} className="relative flex gap-3 group">
                  <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    event.highlight ? 'bg-verde-digital' : 'bg-gray-300'
                  }`} />
                  <div className={`flex-1 p-2 rounded-lg -ml-1 ${event.highlight ? 'bg-verde-50/50' : 'hover:bg-gray-50'} transition-colors`}>
                    <p className="text-xs text-gray-400 metric-value">{event.date}</p>
                    <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-5">
          {/* Aspirations — Interactive */}
          {employee.aspirations.length > 0 && (
            <motion.div variants={item} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-4 h-4 text-verde-digital" /> Aspirações
                </h2>
                <button
                  onClick={() => setShowAspirationModal(true)}
                  className="text-xs text-verde-digital font-medium hover:underline flex items-center gap-0.5"
                >
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              </div>
              {employee.aspirations.map((asp) => {
                const targetRole = getRoleById(asp.targetRoleId);
                return (
                  <div key={asp.targetRoleId} className="p-3 rounded-lg bg-verde-50 border border-green-200">
                    <p className="text-sm font-semibold text-verde-impresso">{targetRole?.title}</p>
                    <p className="text-xs text-green-700 mt-0.5">Horizonte: {asp.timeframe}</p>
                    <div className="mt-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        asp.sharedWithLeader ? 'bg-green-100 text-green-700' :
                        asp.declared ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {asp.sharedWithLeader ? 'Compartilhada com líder' : asp.declared ? 'Decidida' : 'Explorando'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-green-600">
                      {asp.sharedWithLeader ? (
                        <><Eye className="w-3 h-3" /> Visível para seu líder</>
                      ) : (
                        <button
                          onClick={() => setShowAspirationModal(true)}
                          className="flex items-center gap-1 hover:text-verde-digital transition-colors"
                        >
                          <EyeOff className="w-3 h-3" /> Privado, clique para compartilhar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Achievements — with hover */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Conquistas
            </h2>
            <div className="space-y-2">
              {employee.achievements.map((ach) => {
                const AchIcon = achievementIcons[ach.icon] || Award;
                return (
                  <div key={ach.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-amber-50/50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <AchIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{ach.title}</p>
                      <p className="text-[11px] text-gray-400">{ach.description}</p>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  </div>
                );
              })}
              {employee.achievements.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Nenhuma conquista ainda</p>
              )}
            </div>
          </motion.div>

          {/* Readiness Scores */}
          {employee.readinessScores.length > 0 && (
            <motion.div variants={item} className="card p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-verde-digital" /> Compatibilidade
              </h2>
              <div className="space-y-3">
                {employee.readinessScores.map((rs) => {
                  const target = getRoleById(rs.targetRoleId);
                  const compat = getCompatibilityLabel(rs.score);
                  return (
                    <div key={rs.targetRoleId} className="p-3 rounded-lg border border-gray-100 hover:border-verde-digital/30 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">{target?.shortTitle}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${compat.bg} ${compat.color}`}>
                          {compat.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {Object.entries(rs.components).map(([key, val]) => {
                          const compLabels: Record<string, string> = { skills: 'Competências', experience: 'Experiência', performance: 'Performance', development: 'Desenvolvimento', leadership: 'Liderança' };
                          const compCompat = getCompatibilityLabel(val);
                          return (
                            <div key={key} className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${val >= 80 ? 'bg-green-500' : val >= 65 ? 'bg-verde-digital' : val >= 50 ? 'bg-amber-400' : 'bg-orange-400'}`} />
                              <span className="text-[10px] text-gray-400">{compLabels[key] || key}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Quick Info */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> Informações
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Performance</span>
                <span className="font-semibold text-gray-800 metric-value">{employee.performanceRating.toFixed(1)}/5.0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Engajamento</span>
                <span className="font-semibold metric-value" style={{ color: employee.engagementScore > 70 ? '#22C55E' : '#F59E0B' }}>
                  {employee.engagementScore}%
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Admissão</span>
                <span className="text-gray-700">{employee.hireDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-700 text-xs">{employee.email}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {editSaved ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Perfil atualizado!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
                    <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Bio / Descrição</label>
                      <textarea defaultValue={employee.bio || ''} className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none h-20 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Interesses de carreira</label>
                      <div className="flex flex-wrap gap-2">
                        {['Liderança', 'Investimentos', 'Agronegócio', 'PJ/Corporate', 'Gestão de Pessoas', 'Inovação'].map(tag => (
                          <label key={tag} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-verde-50 hover:text-verde-digital cursor-pointer transition-colors flex items-center gap-1">
                            <input type="checkbox" className="sr-only" />
                            {tag}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Certificações</label>
                      <input type="text" defaultValue="CPA-20" className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none" placeholder="CPA-20, CEA, CFP..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Visibilidade do perfil</label>
                      <select className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none">
                        <option>Visível para todos da cooperativa</option>
                        <option>Visível apenas para líder e P&C</option>
                        <option>Privado</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleSaveEdit} className="w-full mt-5 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors">
                    Salvar Alterações
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SHARE ASPIRATION MODAL ===== */}
      <AnimatePresence>
        {showAspirationModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAspirationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {aspirationShared ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Aspiração compartilhada!</p>
                  <p className="text-sm text-gray-500 mt-1">Seu líder poderá ver e apoiar seu objetivo.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Gerenciar Aspirações</h3>
                    <button onClick={() => setShowAspirationModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Compartilhar suas aspirações com seu líder permite que ele te apoie melhor nas conversas de carreira.
                  </p>
                  {employee.aspirations.map((asp) => {
                    const targetRole = getRoleById(asp.targetRoleId);
                    return (
                      <div key={asp.targetRoleId} className="p-4 rounded-lg bg-verde-50 border border-green-200 mb-3">
                        <p className="text-sm font-semibold text-verde-impresso">{targetRole?.title}</p>
                        <p className="text-xs text-green-700 mt-0.5">Horizonte: {asp.timeframe}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input type="checkbox" defaultChecked={asp.sharedWithLeader} className="rounded border-gray-300 text-verde-digital focus:ring-verde-digital" />
                            Compartilhar com líder
                          </label>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={handleShareAspiration} className="w-full py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors">
                    Salvar
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SHARE PROFILE MODAL ===== */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Compartilhar Perfil</h3>
                <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-verde-50 transition-colors text-left"
                >
                  <Copy className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{linkCopied ? 'Link copiado!' : 'Copiar link do perfil'}</p>
                    <p className="text-[11px] text-gray-400">Compartilhe seu perfil profissional</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors text-left">
                  <Download className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Exportar como PDF</p>
                    <p className="text-[11px] text-gray-400">Curriculum vitae completo</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors text-left">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Enviar para recrutador</p>
                    <p className="text-[11px] text-gray-400">Marketplace interno de talentos</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
