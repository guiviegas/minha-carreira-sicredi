'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { PersonaHub } from '@/data/persona-hub';
import { roles, getRoleById } from '@/data/roles';
import { reguaPerformance } from '@/data/elofy-config';
import {
  developmentTracks,
} from '@/data/development-tracks';
import { mentores } from '@/data/mentoring';
import { experiencias } from '@/data/experiencias';
import {
  Target,
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  Plus,
  X,
  Save,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

interface Props {
  hub: PersonaHub;
  cargoAlvoIdInicial?: string;
  comparacaoIds?: string[];
  onLimparComparacao?: (roleId: string) => void;
}

/**
 * GPS — Aba 4: Plano de rota (coração do GPS)
 * "Quero chegar em [cargo-alvo]. Como faço?"
 * Mostra: rota visual, gap por competência (régua oficial), plano em 3 colunas
 * (cursos, mentoria, experiências), e modo comparar 2-3 cargos lado a lado.
 */
export default function PlanoRotaView({
  hub,
  cargoAlvoIdInicial,
  comparacaoIds = [],
  onLimparComparacao,
}: Props) {
  const defaultAlvo = cargoAlvoIdInicial || hub.cargoAlvo?.id || roles[0].id;
  const [cargoAlvoId, setCargoAlvoId] = useState(defaultAlvo);
  const cargoAlvo = getRoleById(cargoAlvoId);

  const cargosComparados = useMemo(() => {
    return comparacaoIds.map((id) => getRoleById(id)).filter((r): r is NonNullable<typeof r> => !!r);
  }, [comparacaoIds]);

  const modoComparacao = cargosComparados.length > 0;

  if (!cargoAlvo) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-5">
      {/* Header com seletor */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Quero chegar em
            </p>
            <select
              value={cargoAlvoId}
              onChange={(e) => setCargoAlvoId(e.target.value)}
              className="text-lg font-bold text-gray-900 bg-transparent border-b border-gray-200 pb-1 focus:outline-none focus:border-verde-digital w-full max-w-md"
            >
              {roles
                .filter((r) => r.id !== hub.cargoAtual.id)
                .sort((a, b) => a.level - b.level)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    N{r.level} · {r.title}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Partindo de <strong>{hub.cargoAtual.title}</strong> (N{hub.cargoAtual.level})
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-verde-digital text-white text-xs font-semibold hover:bg-verde-600 transition-colors shrink-0"
            title="Salvar rota como plano oficial"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar como meu plano
          </button>
        </div>

        {/* Diagrama de rota */}
        <RotaDiagram cargoAtual={hub.cargoAtual} cargoAlvo={cargoAlvo} />
      </motion.div>

      {modoComparacao ? (
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-700">
              Comparando {cargosComparados.length + 1} cargos
            </h3>
            <span className="text-[11px] text-gray-400">
              Inclui o cargo selecionado acima + os adicionados na aba &ldquo;Para onde posso ir&rdquo;
            </span>
          </div>
          <ComparadorTable
            hub={hub}
            cargos={[cargoAlvo, ...cargosComparados]}
            onRemover={onLimparComparacao}
          />
        </motion.div>
      ) : (
        <>
          {/* Tempo + Prontidão */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Sua prontidão
              </p>
              {hub.gapAlvo && cargoAlvo.id === hub.cargoAlvo?.id ? (
                <>
                  <p
                    className="text-2xl font-bold mt-1"
                    style={{ color: hub.gapAlvo.prontidaoEstimada.cor }}
                  >
                    {hub.gapAlvo.prontidaoEstimada.nome}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {hub.gapAlvo.prontidaoEstimada.descricao}
                  </p>
                </>
              ) : (
                <ProntidaoEstimada hub={hub} cargoAlvo={cargoAlvo} />
              )}
            </div>
            <div className="card p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Tempo estimado
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {cargoAlvo.id === hub.cargoAlvo?.id
                  ? hub.gapAlvo?.tempoEstimado || 'a definir'
                  : `${cargoAlvo.avgTenureMonths} meses no nível típico`}
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Estimativa baseada na sua aspiração declarada e no histórico do cargo.
              </p>
            </div>
          </motion.div>

          {/* Gap das 5 competências Sicredi */}
          <motion.div variants={item} className="card p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">
              Gap nas competências Jeito Sicredi
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Comparação do seu conceito atual (vindo da avaliação) com o esperado para
              <strong> {cargoAlvo.title}</strong>.
            </p>
            <div className="space-y-3">
              {hub.competenciasSicredi.map((c) => {
                const esperadoNivel: 1 | 2 | 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;
                const esperado = reguaPerformance[esperadoNivel - 1];
                const atende = c.consenso >= esperadoNivel;
                return (
                  <div
                    key={c.competencia.id}
                    className={`p-3 rounded-lg border ${
                      atende
                        ? 'bg-green-50 border-green-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-gray-800">{c.competencia.nome}</p>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span
                          className="font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: c.conceito.bgCor, color: c.conceito.cor }}
                        >
                          {c.conceito.hashtag}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span
                          className="font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: esperado.bgCor, color: esperado.cor }}
                        >
                          {esperado.hashtag}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      {atende
                        ? '✓ Você já atende o esperado para esse cargo nessa competência.'
                        : 'Precisa evoluir para atender o nível desejado.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Plano sugerido em 3 colunas */}
          <motion.div variants={item} className="card p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Plano sugerido para fechar gaps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanoColuna
                titulo="Cursos e trilhas"
                icon={BookOpen}
                cor="#3FA110"
                items={developmentTracks
                  .filter((t) => t.toRoleId === cargoAlvo.id || t.fromRoleId === hub.cargoAtual.id)
                  .slice(0, 3)
                  .map((t) => ({
                    titulo: t.title,
                    descricao: `${t.totalDuration} · ${t.subtitle}`,
                    cta: 'Adicionar ao PDI',
                    href: '/pdi',
                  }))}
              />
              <PlanoColuna
                titulo="Mentoria"
                icon={Users}
                cor="#7C3AED"
                items={mentores
                  .filter((m) =>
                    m.cargo.toLowerCase().includes(cargoAlvo.title.toLowerCase().split(' ')[0]),
                  )
                  .slice(0, 2)
                  .map((m) => ({
                    titulo: m.nome,
                    descricao: `${m.cargo} · ${m.experienciaAnos} anos`,
                    cta: 'Pedir mentoria',
                    href: '/sicreder2sicreder',
                  }))}
              />
              <PlanoColuna
                titulo="Experiências"
                icon={Compass}
                cor="#0E7490"
                items={experiencias
                  .filter((e) => e.familiaAlvo?.includes(cargoAlvo.family))
                  .slice(0, 3)
                  .map((e) => ({
                    titulo: e.titulo,
                    descricao: `${e.tipo.replace('_', ' ')} · ${e.duracao}`,
                    cta: 'Manifestar interesse',
                    href: '/experiencias',
                  }))}
              />
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function RotaDiagram({
  cargoAtual,
  cargoAlvo,
}: {
  cargoAtual: ReturnType<typeof getRoleById>;
  cargoAlvo: ReturnType<typeof getRoleById>;
}) {
  if (!cargoAtual || !cargoAlvo) return null;
  const diff = cargoAlvo.level - cargoAtual.level;
  const intermediario = diff >= 2;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 overflow-x-auto">
      <RotaNo role={cargoAtual} label="Você está aqui" cor="#3FA110" />
      {intermediario && (
        <>
          <ArrowRight className="w-5 h-5 text-gray-300 shrink-0" />
          <div className="text-[11px] text-gray-400 italic px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-200 shrink-0">
            +1 promoção intermediária
          </div>
        </>
      )}
      <ArrowRight className="w-5 h-5 text-gray-300 shrink-0" />
      <RotaNo role={cargoAlvo} label="Seu alvo" cor={cargoAlvo.color} />
    </div>
  );
}

function RotaNo({
  role,
  label,
  cor,
}: {
  role: NonNullable<ReturnType<typeof getRoleById>>;
  label: string;
  cor: string;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: cor }}
      >
        N{role.level}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cor }}>
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate">{role.title}</p>
      </div>
    </div>
  );
}

function PlanoColuna({
  titulo,
  icon: Icon,
  cor,
  items,
}: {
  titulo: string;
  icon: typeof Target;
  cor: string;
  items: Array<{ titulo: string; descricao: string; cta: string; href: string }>;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${cor}15` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: cor }} />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{titulo}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Nada sugerido para esse cargo ainda.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{it.titulo}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{it.descricao}</p>
              <a
                href={it.href}
                className="flex items-center gap-1 text-[11px] font-semibold mt-2"
                style={{ color: cor }}
              >
                <Plus className="w-3 h-3" />
                {it.cta}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProntidaoEstimada({
  hub,
  cargoAlvo,
}: {
  hub: PersonaHub;
  cargoAlvo: NonNullable<ReturnType<typeof getRoleById>>;
}) {
  // Calcula prontidão para qualquer cargo (não só o aspirado)
  const reqs = cargoAlvo.requiredSkills;
  const habsAtende = reqs.filter((req) => {
    const skill = hub.employee.skills.find((s) => s.id === req.skillId);
    return skill && skill.level >= req.minLevel;
  }).length;
  const compEsperado: 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;
  const compsAtende = hub.competenciasSicredi.filter((c) => c.consenso >= compEsperado).length;
  const totalReqs = reqs.length || 1;
  const totalComps = hub.competenciasSicredi.length;
  const score =
    Math.round(
      0.5 * ((compsAtende / totalComps) * 100) +
        0.5 * ((habsAtende / totalReqs) * 100),
    );

  let nivel: { nome: string; cor: string; descricao: string };
  if (score >= 90) nivel = { nome: 'Pronto agora', cor: '#16A34A', descricao: 'Atende todos os requisitos.' };
  else if (score >= 70)
    nivel = { nome: 'Pronto em 1 ano', cor: '#2563EB', descricao: 'Gaps pequenos e bem mapeados.' };
  else if (score >= 40)
    nivel = { nome: 'Em desenvolvimento', cor: '#D97706', descricao: 'Gaps significativos, mas em trilha.' };
  else nivel = { nome: 'Início da jornada', cor: '#6B7280', descricao: 'Fase exploratória.' };

  return (
    <>
      <p className="text-2xl font-bold mt-1" style={{ color: nivel.cor }}>
        {nivel.nome}
      </p>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{nivel.descricao}</p>
    </>
  );
}

function ComparadorTable({
  hub,
  cargos,
  onRemover,
}: {
  hub: PersonaHub;
  cargos: Array<NonNullable<ReturnType<typeof getRoleById>>>;
  onRemover?: (roleId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 w-40">
              Atributo
            </th>
            {cargos.map((c) => (
              <th key={c.id} className="text-left py-2 px-3 min-w-[160px]">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: c.color }}
                  >
                    N{c.level}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{c.title}</p>
                  </div>
                  {onRemover && (
                    <button
                      onClick={() => onRemover(c.id)}
                      className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-400"
                      title="Remover da comparação"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="py-2 px-3 text-[11px] text-gray-500">Faixa salarial</td>
            {cargos.map((c) => (
              <td key={c.id} className="py-2 px-3 text-[12px] font-semibold text-gray-700">
                R$ {(c.avgSalaryRange.min / 1000).toFixed(1)}k a {(c.avgSalaryRange.max / 1000).toFixed(1)}k
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-2 px-3 text-[11px] text-gray-500">Tempo médio no nível</td>
            {cargos.map((c) => (
              <td key={c.id} className="py-2 px-3 text-[12px] font-semibold text-gray-700">
                {c.avgTenureMonths} meses
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-2 px-3 text-[11px] text-gray-500">Família</td>
            {cargos.map((c) => (
              <td key={c.id} className="py-2 px-3 text-[12px] text-gray-700">
                {c.family.replace('_', ' ')}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-2 px-3 text-[11px] text-gray-500">Sua prontidão</td>
            {cargos.map((c) => (
              <td key={c.id} className="py-2 px-3">
                <ProntidaoSimbolo hub={hub} cargoAlvo={c} />
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-2 px-3 text-[11px] text-gray-500">Habilidades-chave atendidas</td>
            {cargos.map((c) => {
              const total = c.requiredSkills.length;
              const atend = c.requiredSkills.filter((req) => {
                const skill = hub.employee.skills.find((s) => s.id === req.skillId);
                return skill && skill.level >= req.minLevel;
              }).length;
              return (
                <td key={c.id} className="py-2 px-3 text-[12px] text-gray-700">
                  {atend} de {total}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ProntidaoSimbolo({
  hub,
  cargoAlvo,
}: {
  hub: PersonaHub;
  cargoAlvo: NonNullable<ReturnType<typeof getRoleById>>;
}) {
  const reqs = cargoAlvo.requiredSkills;
  const habsAtende = reqs.filter((req) => {
    const skill = hub.employee.skills.find((s) => s.id === req.skillId);
    return skill && skill.level >= req.minLevel;
  }).length;
  const compEsperado: 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;
  const compsAtende = hub.competenciasSicredi.filter((c) => c.consenso >= compEsperado).length;
  const totalReqs = reqs.length || 1;
  const totalComps = hub.competenciasSicredi.length;
  const score =
    Math.round(0.5 * ((compsAtende / totalComps) * 100) + 0.5 * ((habsAtende / totalReqs) * 100));

  let nivel: { nome: string; cor: string; bg: string };
  if (score >= 90) nivel = { nome: 'Pronto agora', cor: '#16A34A', bg: '#F0FDF4' };
  else if (score >= 70) nivel = { nome: 'Pronto em 1 ano', cor: '#2563EB', bg: '#EFF6FF' };
  else if (score >= 40) nivel = { nome: 'Em desenvolvimento', cor: '#D97706', bg: '#FFFBEB' };
  else nivel = { nome: 'Início da jornada', cor: '#6B7280', bg: '#F3F4F6' };

  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: nivel.bg, color: nivel.cor }}
    >
      {nivel.nome}
    </span>
  );
}
