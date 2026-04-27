'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { opportunities } from '@/data/opportunities';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, Users, Star, ArrowRight, Sparkles, Zap,
  Rocket, Handshake, Eye, Globe, X, CheckCircle2, BookmarkPlus, Bookmark,
  ChevronRight, ArrowUpRight, Shield, Calendar, Send, AlertCircle
} from 'lucide-react';
import { Opportunity } from '@/types';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function getAderencia(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Alta aderência', color: 'text-green-700', bg: 'bg-green-100' };
  if (score >= 65) return { label: 'Boa aderência', color: 'text-verde-digital', bg: 'bg-verde-50' };
  if (score >= 50) return { label: 'Aderência parcial', color: 'text-amber-700', bg: 'bg-amber-100' };
  return { label: 'Baixa aderência', color: 'text-gray-500', bg: 'bg-gray-100' };
}

type OpportunityTab = 'todos' | 'vaga' | 'projeto' | 'mentoria' | 'job_shadow' | 'intercambio';

const tabLabels: Record<OpportunityTab, string> = {
  todos: 'Todos',
  vaga: 'Vagas',
  projeto: 'Projetos Temporários',
  mentoria: 'Mentoria',
  job_shadow: 'Job Shadow',
  intercambio: 'Intercâmbio',
};

const typeColors: Record<Opportunity['type'], string> = {
  vaga: '#2563EB',
  projeto: '#8B5CF6',
  mentoria: '#0D9488',
  job_shadow: '#EA580C',
  intercambio: '#06B6D4',
};

const TypeIcon = ({ type }: { type: Opportunity['type'] }) => {
  const icons: Record<Opportunity['type'], React.ReactNode> = {
    vaga: <Briefcase className="w-[18px] h-[18px]" />,
    projeto: <Rocket className="w-[18px] h-[18px]" />,
    mentoria: <Handshake className="w-[18px] h-[18px]" />,
    job_shadow: <Eye className="w-[18px] h-[18px]" />,
    intercambio: <Globe className="w-[18px] h-[18px]" />,
  };
  return <span style={{ color: typeColors[type] }}>{icons[type]}</span>;
};

// Application modal state
type ApplicationStep = 'details' | 'applying' | 'success';

export default function MarketplacePage() {
  const { currentPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<OpportunityTab>('todos');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [savedOpps, setSavedOpps] = useState<Set<string>>(new Set());
  const [applicationStep, setApplicationStep] = useState<ApplicationStep>('details');
  const [appliedOpps, setAppliedOpps] = useState<Set<string>>(new Set());

  if (!currentPersona) return null;

  const filtered = activeTab === 'todos' ? opportunities : opportunities.filter(o => o.type === activeTab);
  const recommended = opportunities.filter(o => (o.matchScore || 0) >= 80).slice(0, 2);

  const toggleSave = (id: string) => {
    setSavedOpps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openDetail = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setApplicationStep('details');
  };

  const handleApply = () => {
    setApplicationStep('applying');
    setTimeout(() => {
      setApplicationStep('success');
      if (selectedOpp) setAppliedOpps(prev => new Set(prev).add(selectedOpp.id));
    }, 1500);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Oportunidades Internas</h1>
        <p className="text-sm text-gray-500 mt-1">Vagas, projetos, mentorias e experiências para sua carreira</p>
      </motion.div>

      {/* Gupy Link */}
      <motion.div variants={item}>
        <a
          href="https://sicredi.gupy.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-verde-digital hover:underline"
        >
          Ver vagas externas no Gupy <ArrowUpRight className="w-3 h-3" />
        </a>
      </motion.div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Recomendados para você</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.map((opp) => (
              <button
                key={opp.id}
                onClick={() => openDetail(opp)}
                className="card card-interactive p-4 border-l-4 text-left"
                style={{ borderLeftColor: typeColors[opp.type] }}
              >
                <div className="flex items-start justify-between">
                  <div className="icon-box-sm" style={{ backgroundColor: `${typeColors[opp.type]}15` }}>
                    <TypeIcon type={opp.type} />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${getAderencia(opp.matchScore || 0).bg} ${getAderencia(opp.matchScore || 0).color}`}>
                    <Zap className="w-3 h-3" /> {getAderencia(opp.matchScore || 0).label}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mt-2">{opp.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{opp.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                  {opp.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {opp.duration}</span>}
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {opp.applicants} candidatos</span>
                </div>
                <span className="text-sm font-semibold text-verde-digital mt-3 flex items-center gap-1">
                  Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(tabLabels) as OpportunityTab[]).map((tab) => {
          const count = tab === 'todos' ? opportunities.length : opportunities.filter(o => o.type === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-verde-digital text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tabLabels[tab]}
              <span className={`text-xs ${activeTab === tab ? 'text-green-200' : 'text-gray-400'}`}>({count})</span>
            </button>
          );
        })}
      </motion.div>

      {/* Saved count */}
      {savedOpps.size > 0 && (
        <motion.div variants={item} className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
          <span className="font-medium">{savedOpps.size} oportunidade(s) salva(s)</span>
        </motion.div>
      )}

      {/* Listings */}
      <motion.div variants={item} className="space-y-3">
        {filtered.map((opp) => {
          const isApplied = appliedOpps.has(opp.id);
          const isSaved = savedOpps.has(opp.id);
          return (
            <div
              key={opp.id}
              className={`card p-4 cursor-pointer transition-all hover:shadow-md group ${isApplied ? 'border-l-4 border-l-green-400' : ''}`}
              onClick={() => openDetail(opp)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${typeColors[opp.type]}15` }}
                >
                  <TypeIcon type={opp.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
                      color: typeColors[opp.type],
                      backgroundColor: `${typeColors[opp.type]}15`,
                    }}>
                      {tabLabels[opp.type as OpportunityTab]}
                    </span>
                    {(opp.matchScore || 0) >= 50 && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getAderencia(opp.matchScore || 0).bg} ${getAderencia(opp.matchScore || 0).color}`}>
                        {getAderencia(opp.matchScore || 0).label}
                      </span>
                    )}
                    {isApplied && (
                      <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Candidatura enviada
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-verde-digital transition-colors">{opp.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{opp.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 flex-wrap">
                    {opp.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {opp.duration}</span>}
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {opp.applicants}{opp.maxApplicants ? `/${opp.maxApplicants}` : ''}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.cooperativeId === 'coop-pioneira' ? 'Pioneira' : 'Serrana'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSave(opp.id); }}
                    className={`p-1.5 rounded-lg transition-all ${isSaved ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-300 hover:text-amber-400'}`}
                    title={isSaved ? "Remover dos salvos" : "Salvar"}
                  >
                    {isSaved ? <Bookmark className="w-4 h-4 fill-amber-500" /> : <BookmarkPlus className="w-4 h-4" />}
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-verde-digital transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ====== DETAIL MODAL ====== */}
      <AnimatePresence>
        {selectedOpp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOpp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {applicationStep === 'success' ? (
                /* ── Success State ── */
                <div className="p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    Candidatura Enviada!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-500 mt-2 max-w-sm"
                  >
                    Sua candidatura para <span className="font-semibold text-gray-700">{selectedOpp.title}</span> foi registrada.
                    Você receberá uma notificação quando houver atualização.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 space-y-3 w-full max-w-xs"
                  >
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <p className="text-[11px] font-semibold text-blue-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> Próximos passos</p>
                      <p className="text-xs text-blue-700 mt-1">Análise de perfil: 3-5 dias úteis</p>
                    </div>
                    <button
                      onClick={() => setSelectedOpp(null)}
                      className="w-full py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors"
                    >
                      Voltar ao Marketplace
                    </button>
                  </motion.div>
                </div>
              ) : applicationStep === 'applying' ? (
                /* ── Loading State ── */
                <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 rounded-full border-4 border-verde-digital/20 border-t-verde-digital animate-spin mb-6" />
                  <p className="text-sm text-gray-500">Enviando candidatura...</p>
                </div>
              ) : (
                /* ── Detail State ── */
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${typeColors[selectedOpp.type]}08 0%, transparent 100%)` }}>
                    <button
                      onClick={() => setSelectedOpp(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${typeColors[selectedOpp.type]}15` }}>
                        <TypeIcon type={selectedOpp.type} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{
                            color: typeColors[selectedOpp.type],
                            backgroundColor: `${typeColors[selectedOpp.type]}15`,
                          }}>
                            {tabLabels[selectedOpp.type as OpportunityTab]}
                          </span>
                          {(selectedOpp.matchScore || 0) >= 50 && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getAderencia(selectedOpp.matchScore || 0).bg} ${getAderencia(selectedOpp.matchScore || 0).color}`}>
                              <Zap className="w-2.5 h-2.5" /> {getAderencia(selectedOpp.matchScore || 0).label}
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{selectedOpp.title}</h2>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Description */}
                    <div>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedOpp.description}</p>
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      {selectedOpp.duration && (
                        <div className="p-3 rounded-lg bg-gray-50 text-center">
                          <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm font-bold text-gray-800">{selectedOpp.duration}</p>
                          <p className="text-[10px] text-gray-400">Duração</p>
                        </div>
                      )}
                      <div className="p-3 rounded-lg bg-gray-50 text-center">
                        <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-800">{selectedOpp.applicants}{selectedOpp.maxApplicants ? `/${selectedOpp.maxApplicants}` : ''}</p>
                        <p className="text-[10px] text-gray-400">Candidatos</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50 text-center">
                        <MapPin className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-800">{selectedOpp.cooperativeId === 'coop-pioneira' ? 'Pioneira' : 'Serrana'}</p>
                        <p className="text-[10px] text-gray-400">Cooperativa</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                        <Star className="w-3 h-3" /> Competências desenvolvidas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedOpp.skills.map(s => (
                          <span key={s} className="text-xs px-2.5 py-1 bg-verde-50 text-verde-digital rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                        <Shield className="w-3 h-3" /> Requisitos
                      </p>
                      <div className="space-y-1.5">
                        {selectedOpp.requirements.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact estimate */}
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <p className="text-xs font-semibold text-purple-600">Impacto estimado no seu GPS</p>
                      </div>
                      <p className="text-sm text-purple-700">
                        Esta oportunidade pode aumentar sua prontidão em <span className="font-bold">+4-8%</span> para o próximo cargo,
                        desenvolvendo competências-chave como {selectedOpp.skills.slice(0, 2).join(' e ')}.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 border-t border-gray-100 flex items-center gap-3">
                    {appliedOpps.has(selectedOpp.id) ? (
                      <div className="flex-1 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-lg text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Candidatura enviada
                      </div>
                    ) : (
                      <button
                        onClick={handleApply}
                        className="flex-1 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Candidatar-se
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(selectedOpp.id); }}
                      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        savedOpps.has(selectedOpp.id)
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {savedOpps.has(selectedOpp.id) ? <Bookmark className="w-4 h-4 fill-amber-500" /> : <BookmarkPlus className="w-4 h-4" />}
                      {savedOpps.has(selectedOpp.id) ? 'Salvo' : 'Salvar'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
