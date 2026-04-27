'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { mentores, getMentoresDisponiveis, MentorProfile } from '@/data/mentoring';
import { getPersonaHub } from '@/data/persona-hub';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  Search,
  Users,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  User,
  X,
  MessageSquare,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

type Tab = 'encontrar' | 'minhas' | 'ser-mentor';

export default function MentoriaPage() {
  const { currentPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<Tab>('encontrar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [requestModal, setRequestModal] = useState<MentorProfile | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [serMentorSubmitted, setSerMentorSubmitted] = useState(false);
  if (!currentPersona) return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  const aspiracao = employee?.aspirations[0];
  const cargoAspirado = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;
  const hub = getPersonaHub(currentPersona.id);
  const sugeridos = hub?.mentoresSugeridos || [];
  const sugeridosIds = new Set(sugeridos.map((m) => m.id));
  const disponiveis = getMentoresDisponiveis().filter((m) => !sugeridosIds.has(m.id));
  const filteredMentores = disponiveis.filter(m =>
    !searchQuery || m.nome.toLowerCase().includes(searchQuery.toLowerCase()) || m.especialidades.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'encontrar' as Tab, label: 'Encontrar Mentor', icon: Search },
    { id: 'minhas' as Tab, label: 'Minhas Mentorias', icon: HeartHandshake },
    { id: 'ser-mentor' as Tab, label: 'Ser Mentor', icon: Award },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Mentoria</h1>
        <p className="text-sm text-gray-500 mt-1">Conecte-se com mentores e pares que já percorreram o caminho que você quer trilhar</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-1 p-1 rounded-xl bg-gray-100">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-verde-digital shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Tab: Encontrar Mentor */}
      {activeTab === 'encontrar' && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Sugeridos para você (vindos do hub) */}
          {sugeridos.length > 0 && cargoAspirado && (
            <motion.div variants={item} className="card p-5 bg-gradient-to-r from-purple-50/50 to-white border-l-4 border-l-purple-400">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Sugeridos para sua aspiração: {cargoAspirado.title}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sugeridos.map((mentor) => (
                  <button
                    key={`sug-${mentor.id}`}
                    onClick={() => setSelectedMentor(mentor)}
                    className="text-left p-3 rounded-lg bg-white border border-purple-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg avatar-initials text-[11px] shrink-0" style={{ backgroundColor: '#7C3AED' }}>
                        {mentor.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{mentor.nome}</p>
                        <p className="text-[11px] text-gray-500 truncate">{mentor.cargo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400">{mentor.experienciaAnos}a exp</span>
                          <span className="text-[10px] text-purple-600 font-semibold">★ Match alto</span>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700">
                          Ver detalhes <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search */}
          <motion.div variants={item} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, área ou habilidade..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital/20 outline-none text-sm"
            />
          </motion.div>

          {/* Outros mentores disponíveis */}
          <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">Outros mentores disponíveis</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentores.map((mentor) => (
              <motion.button
                key={mentor.id}
                variants={item}
                onClick={() => setSelectedMentor(mentor)}
                className="card p-5 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl avatar-initials text-sm" style={{ backgroundColor: '#3FA110' }}>
                    {mentor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{mentor.nome}</p>
                    <p className="text-xs text-gray-500">{mentor.cargo}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {mentor.cooperativa}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mentor.especialidades.slice(0, 3).map((area) => (
                        <span key={area} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-verde-50 text-verde-digital">
                          {area}
                        </span>
                      ))}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-verde-digital">
                      Ver detalhes <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab: Minhas Mentorias */}
      {activeTab === 'minhas' && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Em curso */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-verde-digital" /> Mentorias em Curso
            </h2>
            <div className="p-4 rounded-lg bg-verde-50/50 border border-verde-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Paulo Ferreira</p>
                  <p className="text-xs text-gray-500">Gerente de Agência, Cooperativa Caminhos</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Iniciada: Jan 2026 · Próximo encontro: 15/05
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-verde-50 text-verde-digital">Ativa</span>
              </div>
            </div>
          </motion.div>

          {/* Solicitações */}
          <motion.div variants={item} className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Solicitações Pendentes
            </h2>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Camila Ribeiro</p>
                  <p className="text-xs text-gray-500">GA Trainee, Agência Mirante</p>
                  <p className="text-xs text-gray-400 mt-1">Solicitada em 20/04/2026</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600">Aguardando</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tab: Ser Mentor */}
      {activeTab === 'ser-mentor' && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={item} className="card p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-verde-50 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-verde-digital" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Compartilhe sua experiência</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Cadastre-se como mentor para ajudar outros colaboradores do Sicredi a crescerem profissionalmente.
            </p>

            <div className="mt-6 max-w-md mx-auto space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block text-left mb-1">Áreas que posso mentorar</label>
                <input
                  type="text"
                  placeholder="Ex: Gestão de carteira, Liderança, Crédito PJ..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block text-left mb-1">Disponibilidade</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none">
                  <option>1 encontro por mês</option>
                  <option>2 encontros por mês</option>
                  <option>Sob demanda</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSerMentorSubmitted(true);
                  setTimeout(() => setSerMentorSubmitted(false), 2500);
                }}
                disabled={serMentorSubmitted}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  serMentorSubmitted
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-verde-digital text-white hover:bg-verde-600'
                }`}
              >
                {serMentorSubmitted ? '✓ Cadastro registrado!' : 'Cadastrar como mentor'}
              </button>
              {serMentorSubmitted && (
                <p className="text-[11px] text-green-600 text-center">
                  Você aparecerá no catálogo em até 24h.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal: detalhes do mentor */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMentor(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-20 bg-gradient-to-r from-verde-digital to-verde-600 relative">
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 pb-6 -mt-10">
                <div className="flex items-end gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl avatar-initials text-base shrink-0 border-4 border-white shadow"
                    style={{ backgroundColor: '#3FA110' }}
                  >
                    {selectedMentor.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="pb-1 flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">{selectedMentor.nome}</h3>
                    <p className="text-xs text-gray-500">{selectedMentor.cargo}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700">
                    ★ {selectedMentor.avaliacaoMedia.toFixed(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-4 leading-relaxed">{selectedMentor.bio}</p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800">{selectedMentor.experienciaAnos}a</p>
                    <p className="text-[10px] text-gray-400 uppercase">Experiência</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800">{selectedMentor.mentoradosAtuais}/{selectedMentor.maxMentorados}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Mentorados</p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-xs font-bold ${
                        selectedMentor.disponibilidade === 'disponivel'
                          ? 'text-green-600'
                          : selectedMentor.disponibilidade === 'parcial'
                          ? 'text-amber-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {selectedMentor.disponibilidade === 'disponivel' ? 'Disponível' : selectedMentor.disponibilidade === 'parcial' ? 'Parcial' : 'Indisponível'}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase">Status</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Especialidades</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMentor.especialidades.map((esp) => (
                      <span key={esp} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-verde-50 text-verde-digital">
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      setRequestModal(selectedMentor);
                      setSelectedMentor(null);
                    }}
                    disabled={selectedMentor.disponibilidade === 'indisponivel'}
                    className="flex-1 py-2.5 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    Pedir mentoria
                  </button>
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: pedir mentoria */}
      <AnimatePresence>
        {requestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setRequestModal(null);
              setRequestSent(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {requestSent ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Solicitação enviada!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {requestModal.nome.split(' ')[0]} foi notificado(a). Você verá a resposta em &ldquo;Minhas Mentorias&rdquo;.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-verde-digital">Pedir mentoria</p>
                      <h3 className="text-lg font-bold text-gray-900 mt-0.5">{requestModal.nome}</h3>
                      <p className="text-xs text-gray-500">{requestModal.cargo}</p>
                    </div>
                    <button
                      onClick={() => setRequestModal(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">
                        Sobre o que você quer falar?
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="Estou aspirando o cargo dele(a) e gostaria de entender melhor o caminho..."
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Frequência sugerida</label>
                      <select className="w-full p-2.5 rounded-lg border border-gray-200 text-sm">
                        <option>1 encontro por mês</option>
                        <option>1 encontro a cada 2 semanas</option>
                        <option>Sob demanda</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setRequestSent(true)}
                      className="w-full mt-2 py-2.5 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors"
                    >
                      Enviar solicitação
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
