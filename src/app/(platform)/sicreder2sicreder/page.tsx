'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { mentores, getMentoresDisponiveis } from '@/data/mentoring';
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
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

type Tab = 'encontrar' | 'minhas' | 'ser-mentor';

export default function MentoriaPage() {
  const { currentPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<Tab>('encontrar');
  const [searchQuery, setSearchQuery] = useState('');
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
                  <div key={`sug-${mentor.id}`} className="p-3 rounded-lg bg-white border border-purple-100">
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
                        <button className="mt-2 text-[11px] font-semibold text-purple-700 hover:underline">
                          Pedir mentoria →
                        </button>
                      </div>
                    </div>
                  </div>
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
              <motion.div key={mentor.id} variants={item} className="card p-5 hover:shadow-md transition-shadow">
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
                      {mentor.especialidades.map(area => (
                        <span key={area} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-verde-50 text-verde-digital">
                          {area}
                        </span>
                      ))}
                    </div>
                    <button className="mt-3 text-xs font-semibold text-verde-digital hover:underline flex items-center gap-1">
                      Pedir mentoria <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
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
              <button className="w-full py-2.5 bg-verde-digital text-white rounded-lg text-sm font-semibold hover:bg-verde-600 transition-colors">
                Cadastrar como mentor
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
