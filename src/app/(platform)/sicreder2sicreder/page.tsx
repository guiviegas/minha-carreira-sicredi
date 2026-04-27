'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { mentores, getMentoresDisponiveis } from '@/data/mentoring';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Search,
  Users,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Sparkles,
  Filter,
  Award,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Sicreder2SicrederPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const employee = getEmployeeById(currentPersona.employeeId);
  const aspiracao = employee?.aspirations[0];
  const cargoAspirado = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;
  const disponiveis = getMentoresDisponiveis();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Sicreder2Sicreder</h1>
        <p className="text-sm text-gray-500 mt-1">Conecte-se com mentores e pares que já percorreram o caminho que você quer trilhar</p>
      </motion.div>

      {/* AI Recommendation */}
      <motion.div variants={item} className="card p-5 bg-gradient-to-r from-purple-50 to-white border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <p className="text-xs font-semibold text-purple-600">Recomendação Inteligente</p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {cargoAspirado ? (
            <>Com base na sua aspiração de se tornar <strong>{cargoAspirado.title}</strong>, encontrei <strong>{disponiveis.length} mentores</strong> que podem te ajudar a desenvolver as competências que faltam.</>
          ) : (
            <>Encontrei <strong>{disponiveis.length} mentores</strong> disponíveis para te ajudar no seu desenvolvimento.</>
          )}
        </p>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mentor por cargo, competência ou cooperativa..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital/20 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
      </motion.div>

      {/* Mentores Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentores.map((mentor) => {
          const disponivel = mentor.disponibilidade !== 'indisponivel' && mentor.mentoradosAtuais < mentor.maxMentorados;
          const initials = mentor.nome.split(' ').map(n => n[0]).slice(0, 2).join('');
          const colors = ['#16A34A', '#2563EB', '#7C3AED', '#0E7490', '#D97706'];
          const cor = colors[mentor.id.charCodeAt(mentor.id.length - 1) % colors.length];

          return (
            <div key={mentor.id} className="card card-interactive p-5 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: cor }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">{mentor.nome}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-600">{mentor.avaliacaoMedia}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{mentor.cargo}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {mentor.agencia} · {mentor.cooperativa}
                  </p>
                  {mentor.hashtag && (
                    <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 mt-1">
                      {mentor.hashtag}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mentor.especialidades.slice(0, 4).map((area) => (
                      <span key={area} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {area}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${disponivel ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${disponivel ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {mentor.experienciaAnos} anos exp.
                      </span>
                    </div>
                    <button className="text-xs font-semibold text-verde-digital flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Solicitar mentoria <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{mentores.length * 47}</p>
          <p className="text-[11px] text-gray-500">Mentores ativos no sistema</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{disponiveis.length * 22}</p>
          <p className="text-[11px] text-gray-500">Mentorias realizadas</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-verde-digital">4.7</p>
          <p className="text-[11px] text-gray-500">Avaliação média</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
