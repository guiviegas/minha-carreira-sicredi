'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getPersonaHub } from '@/data/persona-hub';
import { getRoleById } from '@/data/roles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Eye,
  EyeOff,
  Share2,
  Star,
  Target,
  TrendingUp,
  X,
  CheckCircle2,
  ExternalLink,
  Heart,
  Briefcase,
  MapPin,
  Calendar,
  Mail,
  Compass,
  Award,
} from 'lucide-react';
import Image from 'next/image';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function PerfilPage() {
  const { currentPersona } = usePersona();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAspirationModal, setShowAspirationModal] = useState(false);
  const [aspirationShared, setAspirationShared] = useState(false);

  if (!currentPersona) return null;
  const hub = getPersonaHub(currentPersona.id);
  if (!hub) return null;

  const { employee, cargoAtual, cargoAlvo, competenciasSicredi, notaFinalPerformance, prontidao } = hub;
  const aspiracao = employee.aspirations[0];

  const handleShareAspiration = () => {
    setAspirationShared(true);
    setTimeout(() => {
      setShowAspirationModal(false);
      setAspirationShared(false);
    }, 1500);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-5">
      {/* Header card — redesenhado: foco em identidade + aspiração */}
      <motion.div variants={item} className="card overflow-hidden">
        <div
          className="h-24 relative"
          style={{
            background: `linear-gradient(135deg, ${currentPersona.color}DD 0%, ${currentPersona.color}88 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        </div>
        <div className="px-6 pb-5 relative">
          <div className="flex items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white relative shrink-0">
              <Image
                src={`/personas/${currentPersona.id}.png`}
                alt={employee.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-sm text-gray-500">{cargoAtual.title}</p>
            </div>
            <div className="flex gap-2 pb-1 shrink-0">
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
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {currentPersona.cooperative}
              {currentPersona.branch && ` · ${currentPersona.branch}`}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {employee.tenure} ano(s) de Sicredi
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Desde {employee.hireDate}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> {employee.email}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Status oficial: 3 selos da régua Sicredi */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Conceito atual</p>
            <Heart className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <span
            className="inline-block text-base font-extrabold px-3 py-1 rounded-lg"
            style={{ backgroundColor: notaFinalPerformance.bgCor, color: notaFinalPerformance.cor }}
          >
            {notaFinalPerformance.hashtag}
          </span>
          <p className="text-[11px] text-gray-500 mt-2 leading-tight">{notaFinalPerformance.descricao.split('.')[0]}.</p>
        </div>

        {prontidao && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Prontidão para o alvo</p>
              <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
            </div>
            <span
              className="inline-block text-base font-extrabold px-3 py-1 rounded-lg"
              style={{ backgroundColor: prontidao.bgCor, color: prontidao.cor }}
            >
              {prontidao.nome}
            </span>
            <p className="text-[11px] text-gray-500 mt-2 leading-tight">{prontidao.descricao}</p>
          </div>
        )}

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aspiração declarada</p>
            <Compass className="w-3.5 h-3.5 text-gray-300" />
          </div>
          {cargoAlvo && aspiracao ? (
            <>
              <p className="text-sm font-bold text-gray-900">{cargoAlvo.title}</p>
              <p className="text-[11px] text-gray-500 mt-1">Horizonte: {aspiracao.timeframe}</p>
              <span
                className={`inline-block mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  aspiracao.sharedWithLeader
                    ? 'bg-green-50 text-green-700'
                    : aspiracao.declared
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {aspiracao.sharedWithLeader
                  ? '✓ Compartilhada com líder'
                  : aspiracao.declared
                  ? 'Decidida'
                  : 'Explorando'}
              </span>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 italic">Não declarada</p>
              <button
                onClick={() => setShowAspirationModal(true)}
                className="text-[11px] font-semibold text-verde-digital mt-2 hover:underline"
              >
                Declarar aspiração →
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Competências Jeito Sicredi (vindas do hub) */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="w-4 h-4 text-verde-digital" /> Competências Jeito Sicredi de Ser
          </h2>
          <a
            href="/avaliacao"
            className="text-[11px] text-verde-digital font-semibold hover:underline flex items-center gap-1"
          >
            Ver Avaliação <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {competenciasSicredi.map((c) => (
            <div
              key={c.competencia.id}
              className="p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: c.competencia.cor }}
                  />
                  <p className="text-xs font-semibold text-gray-800 truncate">{c.competencia.nome}</p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: c.conceito.bgCor, color: c.conceito.cor }}
                >
                  {c.conceito.hashtag}
                </span>
              </div>
              {c.comentarioLider && (
                <p className="text-[11px] text-purple-600 italic mt-1">
                  &ldquo;{c.comentarioLider}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Aspiração com narrativa */}
          {cargoAlvo && aspiracao && (
            <motion.div variants={item} className="card p-5 border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50/40 to-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-1">Para onde quero ir</p>
                  <h2 className="text-base font-bold text-gray-900">{cargoAlvo.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Nível {cargoAlvo.level} · Horizonte {aspiracao.timeframe}</p>
                </div>
                <button
                  onClick={() => setShowAspirationModal(true)}
                  className="text-[11px] font-semibold text-purple-600 hover:underline flex items-center gap-0.5"
                >
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-3">
                {aspiracao.sharedWithLeader ? (
                  <>
                    <Eye className="w-3 h-3 text-green-500" />
                    <span className="text-green-700">Visível para sua liderança</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-700">Privada — clique em editar para compartilhar</span>
                  </>
                )}
              </div>

              {hub.gapAlvo && (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-100">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Prontidão</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: hub.gapAlvo.prontidaoEstimada.cor }}>
                      {hub.gapAlvo.prontidaoEstimada.nome}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tempo estimado</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{hub.gapAlvo.tempoEstimado}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Trilhas</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{hub.trilhasRecomendadas.length} sugeridas</p>
                  </div>
                </div>
              )}

              <a
                href="/mapa-carreira"
                className="block mt-4 text-center text-xs font-bold text-purple-600 hover:bg-purple-50 py-2 rounded-lg border border-purple-200"
              >
                Abrir Plano de Rota completo no GPS →
              </a>
            </motion.div>
          )}

          {/* Marcos de carreira (linha do tempo) */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-verde-digital" /> Marcos da minha jornada no Sicredi
            </h2>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
              {[
                {
                  date: employee.hireDate.slice(0, 7),
                  title: 'Início no Sicredi',
                  desc: `Como ${cargoAtual.title} · ${currentPersona.cooperative}`,
                  highlight: false,
                },
                {
                  date: '2024-06',
                  title: 'Conclusão de trilha de desenvolvimento',
                  desc: 'Trilha Especialista da família, com foco em atendimento consultivo',
                  highlight: true,
                },
                {
                  date: '2025-11',
                  title: 'Reconhecimento de desempenho',
                  desc: `Conceito ${notaFinalPerformance.hashtag} sustentado em 2 ciclos consecutivos`,
                  highlight: true,
                },
                {
                  date: '2026-03',
                  title: 'Aspiração compartilhada com líder',
                  desc: cargoAlvo
                    ? `Plano formal de evolução para ${cargoAlvo.shortTitle}`
                    : 'Conversa de carreira concluída',
                  highlight: aspiracao?.sharedWithLeader || false,
                },
              ].map((event, i) => (
                <div key={i} className="relative flex gap-3 group">
                  <div
                    className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      event.highlight ? 'bg-verde-digital' : 'bg-gray-300'
                    }`}
                  />
                  <div
                    className={`flex-1 p-2 rounded-lg -ml-1 ${
                      event.highlight ? 'bg-verde-50/50' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <p className="text-xs text-gray-400">{event.date}</p>
                    <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-5">
          {/* Próximos passos sugeridos */}
          <motion.div variants={item} className="card p-5 bg-gradient-to-br from-verde-50/50 to-white">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-verde-digital" /> Próximos passos
            </h2>
            <div className="space-y-2">
              <a href="/pdi" className="block p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100">
                <p className="text-xs font-semibold text-gray-800">Atualizar meu PDI</p>
                <p className="text-[10px] text-gray-500">Garantir que reflete sua aspiração atual</p>
              </a>
              <a href="/mapa-carreira" className="block p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100">
                <p className="text-xs font-semibold text-gray-800">Explorar GPS de Carreira</p>
                <p className="text-[10px] text-gray-500">Ver caminhos possíveis a partir do seu cargo</p>
              </a>
              <a href="/avaliacao" className="block p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100">
                <p className="text-xs font-semibold text-gray-800">Concluir avaliação do ciclo</p>
                <p className="text-[10px] text-gray-500">Auto-avaliação + indicação de pares</p>
              </a>
            </div>
          </motion.div>

          {/* Reconhecimentos (sem gamificação) */}
          {employee.achievements && employee.achievements.length > 0 && (
            <motion.div variants={item} className="card p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Reconhecimentos
              </h2>
              <div className="space-y-2">
                {employee.achievements.slice(0, 4).map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{ach.title}</p>
                      <p className="text-[10px] text-gray-500">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Compartilhar perfil */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-500" /> Compartilhe seu perfil
            </h2>
            <p className="text-[11px] text-gray-500 mb-3">
              Tornar o perfil visível ajuda lideranças a identificar oportunidades certas para você.
            </p>
            <button className="w-full text-[11px] font-bold text-blue-600 hover:bg-blue-50 py-2 rounded-lg border border-blue-200">
              Configurar visibilidade
            </button>
          </motion.div>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
                  <textarea
                    defaultValue={employee.bio || ''}
                    rows={3}
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Interesses de carreira</label>
                  <div className="flex flex-wrap gap-2">
                    {['Liderança', 'Investimentos', 'Agronegócio', 'PJ/Corporate', 'Gestão de Pessoas', 'Inovação'].map(
                      (tag) => (
                        <label
                          key={tag}
                          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-verde-50 hover:text-verde-digital cursor-pointer transition-colors"
                        >
                          {tag}
                        </label>
                      ),
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-full px-4 py-2 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors"
                >
                  Salvar alterações
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar Aspiração */}
      <AnimatePresence>
        {showAspirationModal && cargoAlvo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAspirationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {aspirationShared ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Aspiração compartilhada!</p>
                  <p className="text-sm text-gray-500 mt-1">Sua liderança foi notificada.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-900">Editar aspiração</h3>
                    <button
                      onClick={() => setShowAspirationModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Sua aspiração atual: <strong>{cargoAlvo.title}</strong>
                  </p>
                  <button
                    onClick={handleShareAspiration}
                    className="w-full px-4 py-2.5 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors"
                  >
                    Compartilhar com minha liderança
                  </button>
                  <button
                    onClick={() => setShowAspirationModal(false)}
                    className="w-full mt-2 px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
                  >
                    Cancelar
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
