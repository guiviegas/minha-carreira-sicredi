'use client';

import { Role } from '@/types';
import { getPathsFromRole } from '@/data/career-paths';
import { getAtribuicoesByRoleId } from '@/data/atribuicoes-cargos';
import { competenciasSicredi } from '@/data/competencias-sicredi';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
  Target,
  Star,
  ArrowUpRight,
  Layers,
  ArrowLeft,
  ListChecks,
  Wrench,
  Heart,
  Languages,
  Info,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

interface Props {
  role: Role;
  isOwn: boolean;
  cargoAspirado?: Role | null;
  backHref?: string;
  backLabel?: string;
}

/**
 * Renderiza o cargo conforme a estrutura oficial da Matriz de Atribuições do Sicredi:
 *   Função → Responsabilidades Essenciais (+ Atividades) → Requisitos → Diferenciais → Preparo Técnico → Preparo Comportamental.
 *
 * Usado em /meu-cargo (cargo da pessoa logada) e /meu-cargo/[roleId] (qualquer cargo).
 */
export default function MeuCargoView({ role, isOwn, cargoAspirado, backHref, backLabel }: Props) {
  const atrib = getAtribuicoesByRoleId(role.id);
  const careerPathsFromHere = getPathsFromRole(role.id);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Back link e title */}
      <motion.div variants={item}>
        {backHref && (
          <a href={backHref} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="w-3 h-3" /> {backLabel || 'Voltar'}
          </a>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {isOwn ? 'Meu Cargo' : 'Descrição do cargo'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isOwn
            ? 'Suas atribuições, requisitos e o preparo esperado, conforme a Matriz oficial do Sicredi.'
            : `Estrutura oficial completa de ${role.title}.`}
        </p>
      </motion.div>

      {/* Função (header com fonte) */}
      <motion.div variants={item} className="card p-6 border-l-4" style={{ borderLeftColor: role.color }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Função</p>
            <h2 className="text-xl font-bold text-gray-900">
              {atrib?.tituloOficial || role.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {role.family.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} · Nível {role.level}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {atrib ? 'Diretoria de Negócios' : (role.diretoria || '-')}
              </span>
              <span className="text-xs text-gray-400">📍 {role.estrutura || 'Agência'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${role.color}15` }}>
            <Briefcase className="w-6 h-6" style={{ color: role.color }} />
          </div>
        </div>
      </motion.div>

      {/* Objetivo da Família + Nível de Maturidade */}
      {atrib && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 bg-verde-50/50 border-verde-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-verde-digital" />
              <p className="text-xs font-semibold uppercase tracking-wider text-verde-digital">Objetivo da Família</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{atrib.objetivoFamilia}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nível de Maturidade</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{atrib.nivelMaturidade}</p>
          </div>
        </motion.div>
      )}

      {/* Responsabilidades Essenciais */}
      {atrib && atrib.responsabilidadesEssenciais.length > 0 && (
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-verde-digital" />
              Responsabilidades essenciais
              <span className="text-[10px] font-semibold text-gray-400 normal-case tracking-normal">
                ({atrib.responsabilidadesEssenciais.length})
              </span>
            </h3>
          </div>
          <div className="space-y-3">
            {atrib.responsabilidadesEssenciais.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: role.color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{r.titulo}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{r.descricao}</p>
                  {r.atividades && r.atividades.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {r.atividades.map((a, j) => (
                        <p key={j} className="text-[11px] text-gray-500 pl-3 border-l-2 border-gray-200">
                          {i + 1}.{j + 1} · {a}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Requisitos */}
      {atrib && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequisitosCard atrib={atrib} />
          <DiferenciaisCard atrib={atrib} />
        </motion.div>
      )}

      {/* Preparo: Técnico + Comportamental */}
      {atrib && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PreparoCard
            titulo="Preparo Técnico"
            icon={Wrench}
            color="#0EA5E9"
            items={atrib.preparoTecnico}
          />
          <PreparoCard
            titulo="Preparo Comportamental"
            icon={Heart}
            color="#E11D48"
            items={atrib.preparoComportamental}
          />
        </motion.div>
      )}

      {/* Fallback se não há atribuições */}
      {!atrib && (
        <motion.div variants={item} className="card p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Estrutura oficial em construção</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                As atribuições deste cargo (Responsabilidades, Requisitos, Diferenciais e Preparo) ainda
                não foram migradas para a Matriz oficial. Por enquanto, você vê apenas a descrição básica.
              </p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{role.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Próximo cargo natural (apenas se for cargo da pessoa) */}
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
                Abrir Plano de Rota no GPS <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function RequisitosCard({ atrib }: { atrib: NonNullable<ReturnType<typeof getAtribuicoesByRoleId>> }) {
  const r = atrib.requisitos;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="w-4 h-4 text-blue-600" />
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Requisitos</p>
      </div>
      <dl className="space-y-2.5 text-xs">
        {r.formacao && (
          <div>
            <dt className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Formação</dt>
            <dd className="text-gray-700 mt-0.5">{r.formacao}</dd>
          </div>
        )}
        {r.experiencia && (
          <div>
            <dt className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Experiência</dt>
            <dd className="text-gray-700 mt-0.5">{r.experiencia}</dd>
          </div>
        )}
        {r.areasFormacao && (
          <div>
            <dt className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Áreas preferenciais</dt>
            <dd className="text-gray-700 mt-0.5">{r.areasFormacao}</dd>
          </div>
        )}
        {r.idiomas && (
          <div className="flex items-start gap-2">
            <Languages className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Idiomas</dt>
              <dd className="text-gray-700 mt-0.5">{r.idiomas}</dd>
            </div>
          </div>
        )}
        {r.certificacoes && r.certificacoes.length > 0 && (
          <div>
            <dt className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Certificações</dt>
            <dd className="flex flex-wrap gap-1 mt-1">
              {r.certificacoes.map((c) => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {c}
                </span>
              ))}
            </dd>
          </div>
        )}
        {r.cbo && (
          <div>
            <dt className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">CBO</dt>
            <dd className="text-gray-700 mt-0.5">{r.cbo}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function DiferenciaisCard({ atrib }: { atrib: NonNullable<ReturnType<typeof getAtribuicoesByRoleId>> }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-purple-600" />
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Diferenciais</p>
      </div>
      {atrib.diferenciais.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Nenhum diferencial específico cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {atrib.diferenciais.map((d, i) => (
            <li key={i} className="flex items-start gap-2">
              <Star className="w-3 h-3 text-purple-400 mt-1 shrink-0" />
              <span className="text-xs text-gray-700 leading-relaxed">{d}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PreparoCard({
  titulo,
  icon: Icon,
  color,
  items,
}: {
  titulo: string;
  icon: typeof Wrench;
  color: string;
  items: string[];
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{titulo}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Em construção.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((s, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${color}10`, color: color }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
