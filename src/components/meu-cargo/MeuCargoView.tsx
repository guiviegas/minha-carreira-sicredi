'use client';

import { Role } from '@/types';
import { getRoleById } from '@/data/roles';
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
  BarChart3,
  Layers,
  ArrowLeft,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

interface Props {
  role: Role;
  /** Quando é o cargo da pessoa logada, mostra "Meu Cargo"; caso contrário, "Descrição do cargo" + breadcrumb. */
  isOwn: boolean;
  /** Cargo aspirado (vindo da pessoa logada) — usado para mostrar bloco "Próximo passo". Apenas quando isOwn. */
  cargoAspirado?: Role | null;
  /** Quando não é cargo próprio, mostra link "Voltar para o GPS" */
  backHref?: string;
  backLabel?: string;
}

/**
 * Componente que renderiza a descrição rica de um cargo.
 * Reaproveitado em /meu-cargo (cargo do usuário) e /meu-cargo/[roleId] (qualquer cargo).
 */
export default function MeuCargoView({ role, isOwn, cargoAspirado, backHref, backLabel }: Props) {
  const formacao = role.formacao || 'Ensino Superior';
  const experiencia = role.experiencia || '-';
  const certificacoes = role.certificacoes || '-';
  const areasFormacao = role.areasFormacao || '-';
  const habilidades = role.habilidades || role.requiredSkills.map((s) => s.skillName);
  const objetivoFamilia = role.objetivoFamilia || role.description;
  const nivelMaturidade = role.nivelMaturidade || 'Em desenvolvimento';
  const diretoria = role.diretoria || '-';
  const estrutura = role.estrutura || '-';

  const careerPathsFromHere = getPathsFromRole(role.id);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div variants={item}>
        {backHref && (
          <a
            href={backHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            {backLabel || 'Voltar'}
          </a>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {isOwn ? 'Meu Cargo' : 'Descrição do cargo'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isOwn
            ? 'Suas atribuições, requisitos e o que o sistema espera de você.'
            : `Detalhe completo de ${role.title}.`}
        </p>
      </motion.div>

      {/* Role Card */}
      <motion.div variants={item} className="card p-6 border-l-4" style={{ borderLeftColor: role.color }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {isOwn ? 'Cargo Atual' : 'Cargo'}
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{role.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {role.family.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} · Nível{' '}
              {role.level}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${role.color}15` }}
          >
            <Briefcase className="w-6 h-6" style={{ color: role.color }} />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">{role.description}</p>
        <div className="flex gap-4 mt-3">
          <span className="text-xs text-gray-400">
            <Layers className="w-3 h-3 inline mr-1" />
            {diretoria}
          </span>
          <span className="text-xs text-gray-400">📍 {estrutura}</span>
        </div>
      </motion.div>

      {/* Objetivo da Família */}
      <motion.div variants={item} className="card p-5 bg-verde-50/50 border-verde-100">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-verde-digital" />
          <p className="text-xs font-semibold uppercase tracking-wider text-verde-digital">
            Objetivo da Família
          </p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{objetivoFamilia}</p>
      </motion.div>

      {/* Requirements Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Experiência
              </p>
              <p className="text-sm font-semibold text-gray-800">{experiencia}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Tempo médio na função: {role.avgTenureMonths} meses</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Certificações
              </p>
              <p className="text-sm font-semibold text-gray-800">{certificacoes}</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Nível de Maturidade
            </p>
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
            <span
              key={hab}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
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

      {/* Competências Requeridas */}
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

      {/* Próximo passo (apenas quando é cargo próprio) */}
      {isOwn && cargoAspirado && (
        <motion.div
          variants={item}
          className="card p-5 border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50/50 to-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">
                Próximo passo: aspiração
              </p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{cargoAspirado.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {cargoAspirado.family.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} ·
                Nível {cargoAspirado.level}
              </p>
            </div>
            <a
              href={`/meu-cargo/${cargoAspirado.id}`}
              className="text-sm font-semibold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all"
            >
              Ver descrição completa <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {careerPathsFromHere.length > 0 && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <p className="text-xs font-semibold text-purple-600 mb-2">O que falta para chegar lá:</p>
              <div className="space-y-1.5">
                {(
                  careerPathsFromHere.find((p) => p.toRoleId === cargoAspirado.id)?.requirements ||
                  careerPathsFromHere[0]?.requirements ||
                  []
                ).map((req) => (
                  <div key={req} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-gray-600">{req}</span>
                  </div>
                ))}
              </div>
              <a
                href="/mapa-carreira"
                className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-verde-digital hover:underline"
              >
                Abrir Plano de rota no GPS <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
