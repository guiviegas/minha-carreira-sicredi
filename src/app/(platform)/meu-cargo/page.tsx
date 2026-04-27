'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { getTopDestinosDe, getTopOrigensPara } from '@/data/movimentacoes';
import { getPathsFromRole } from '@/data/career-paths';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Users,
  ChevronRight,
  BookOpen,
  Target,
  Star,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Layers,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function MeuCargoPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const role = getRoleById(employee.roleId);
  if (!role) return null;

  // Dados CAS agora vêm direto do Role
  const formacao = role.formacao || 'Ensino Superior';
  const experiencia = role.experiencia || '-';
  const certificacoes = role.certificacoes || '-';
  const areasFormacao = role.areasFormacao || '-';
  const habilidades = role.habilidades || role.requiredSkills.map(s => s.skillName);
  const objetivoFamilia = role.objetivoFamilia || role.description;
  const nivelMaturidade = role.nivelMaturidade || 'Em desenvolvimento';
  const diretoria = role.diretoria || '-';
  const estrutura = role.estrutura || '-';

  // Dados de movimentação reais
  const destinosReais = getTopDestinosDe(role.title, 5);
  const origensReais = getTopOrigensPara(role.title, 5);

  // Career paths
  const careerPathsFromHere = getPathsFromRole(role.id);

  // Aspiração
  const aspiracao = employee.aspirations[0];
  const cargoAspirado = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Meu Cargo</h1>
        <p className="text-sm text-gray-500 mt-1">Entenda suas atribuições, requisitos e o que o sistema espera de você</p>
      </motion.div>

      {/* Current Role Card */}
      <motion.div variants={item} className="card p-6 border-l-4" style={{ borderLeftColor: role.color }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Cargo Atual</p>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{role.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{role.family.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · Nível {role.level}</p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.color}15` }}>
            <Briefcase className="w-6 h-6" style={{ color: role.color }} />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">{role.description}</p>
        <div className="flex gap-4 mt-3">
          <span className="text-xs text-gray-400"><Layers className="w-3 h-3 inline mr-1" />{diretoria}</span>
          <span className="text-xs text-gray-400">📍 {estrutura}</span>
        </div>
      </motion.div>

      {/* Objetivo da Família */}
      <motion.div variants={item} className="card p-5 bg-verde-50/50 border-verde-100">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-verde-digital" />
          <p className="text-xs font-semibold uppercase tracking-wider text-verde-digital">Objetivo da Família</p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{objetivoFamilia}</p>
      </motion.div>

      {/* Requirements Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Formação */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Formação</p>
              <p className="text-sm font-semibold text-gray-800">{formacao}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">{areasFormacao}</p>
        </div>

        {/* Experiência */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Experiência</p>
              <p className="text-sm font-semibold text-gray-800">{experiencia}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Tempo médio na função: {role.avgTenureMonths} meses</p>
        </div>

        {/* Certificações */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Certificações</p>
              <p className="text-sm font-semibold text-gray-800">{certificacoes}</p>
            </div>
          </div>
        </div>

        {/* Nível de Maturidade */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nível de Maturidade</p>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{nivelMaturidade}</p>
        </div>
      </motion.div>

      {/* Habilidades Desejáveis */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-semibold text-gray-800">Habilidades e Conhecimentos Desejáveis</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {habilidades.map((hab) => (
            <span key={hab} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-verde-50 hover:text-verde-digital transition-colors cursor-default">
              {hab}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Dia a Dia */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <p className="text-sm font-semibold text-gray-800">Um Dia na Vida</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{role.dayInLife}</p>
      </motion.div>

      {/* Movimentações Reais — De onde vieram + Para onde vão */}
      {(origensReais.length > 0 || destinosReais.length > 0) && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origens */}
          {origensReais.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-semibold text-gray-800">De onde vêm os profissionais</p>
              </div>
              <div className="space-y-2">
                {origensReais.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-700">{m.cargoAnterior}</span>
                    <span className="text-xs font-semibold text-blue-600">{m.qtdColaboradores.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destinos */}
          {destinosReais.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="w-4 h-4 text-verde-digital" />
                <p className="text-sm font-semibold text-gray-800">Para onde vão os profissionais</p>
              </div>
              <div className="space-y-2">
                {destinosReais.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-700">{m.cargoAtual}</span>
                    <span className="text-xs font-semibold text-verde-digital">{m.qtdColaboradores.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Skills Requirements Chart */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <p className="text-sm font-semibold text-gray-800">Competências Requeridas</p>
        </div>
        <div className="space-y-3">
          {role.requiredSkills.map((skill) => (
            <div key={skill.skillId}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">{skill.skillName}</span>
                <span className="text-xs font-semibold text-gray-500">{skill.minLevel}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: role.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.minLevel}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Aspiração — próximo cargo */}
      {cargoAspirado && (
        <motion.div variants={item} className="card p-5 border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50/50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Próximo Passo: Aspiração</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{cargoAspirado.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{cargoAspirado.family.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · Nível {cargoAspirado.level}</p>
            </div>
            <button className="text-sm font-semibold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all">
              Ver detalhes <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {cargoAspirado.formacao && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Formação: {cargoAspirado.formacao}</span>
              </div>
            )}
            {cargoAspirado.experiencia && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Experiência: {cargoAspirado.experiencia}</span>
              </div>
            )}
            {cargoAspirado.certificacoes && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Award className="w-3.5 h-3.5" />
                <span>Certificações: {cargoAspirado.certificacoes}</span>
              </div>
            )}
          </div>

          {/* Gap Analysis, dinâmico based on career paths */}
          {careerPathsFromHere.length > 0 && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <p className="text-xs font-semibold text-purple-600 mb-2">O que falta para chegar lá:</p>
              <div className="space-y-1.5">
                {(careerPathsFromHere
                  .find(p => p.toRoleId === cargoAspirado.id)?.requirements || 
                  careerPathsFromHere[0]?.requirements || 
                  []
                ).map((req) => (
                  <div key={req} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-gray-600">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
