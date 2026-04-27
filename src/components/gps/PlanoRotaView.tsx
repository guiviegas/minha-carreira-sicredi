'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PersonaHub } from '@/data/persona-hub';
import { Role } from '@/types';
import { roles, getRoleById } from '@/data/roles';
import { reguaPerformance } from '@/data/elofy-config';
import { getAtribuicoesByRoleId } from '@/data/atribuicoes-cargos';
import {
  Target,
  ArrowRight,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  Plus,
  X,
  Save,
  Coins,
  Wrench,
  Zap,
  Award,
  Star,
  ExternalLink,
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
 * GPS — Aba 4: Plano de rota (coração do GPS).
 * Para o cargo-alvo: mostra rota visual, gap quantificado, agenda em 3 ondas
 * (30 / 90 / 6-12 meses), e modo comparar 2-3 cargos com diferenças quantificadas.
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

  // Persistência mock dos CTAs (estado local)
  const [adicionadosPDI, setAdicionadosPDI] = useState<Set<string>>(new Set());
  const [mentoriasSolicitadas, setMentoriasSolicitadas] = useState<Set<string>>(new Set());
  const [experienciasInteresse, setExperienciasInteresse] = useState<Set<string>>(new Set());
  const [planoSalvo, setPlanoSalvo] = useState(false);

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
              onChange={(e) => {
                setCargoAlvoId(e.target.value);
                setPlanoSalvo(false);
              }}
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
            <Link
              href={`/meu-cargo/${cargoAlvo.id}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:underline mt-2"
            >
              Ver descrição completa de {cargoAlvo.title}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
          </div>
          <button
            onClick={() => setPlanoSalvo(true)}
            disabled={planoSalvo}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              planoSalvo
                ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                : 'bg-verde-digital text-white hover:bg-verde-600'
            }`}
            title="Definir como aspiração oficial"
          >
            {planoSalvo ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Definida como sua aspiração
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Definir como minha aspiração
              </>
            )}
          </button>
        </div>

        {/* Diagrama de rota inteligente (3 nós quando há intermediário) */}
        <RotaDiagram cargoAtual={hub.cargoAtual} cargoAlvo={cargoAlvo} />
      </motion.div>

      {modoComparacao ? (
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-700">
              Comparando {cargosComparados.length + 1} cargos
            </h3>
            <span className="text-[11px] text-gray-400">
              Inclui o cargo-alvo selecionado acima + os adicionados na aba &ldquo;Para onde posso ir&rdquo;
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
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="card p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Delta salarial
              </p>
              {(() => {
                const salarioAtual = hub.employee.currentSalary || 0;
                const salarioAlvoMedio = (cargoAlvo.avgSalaryRange.min + cargoAlvo.avgSalaryRange.max) / 2;
                const delta = salarioAlvoMedio - salarioAtual;
                const positivo = delta > 0;
                return (
                  <>
                    <p className={`text-2xl font-bold mt-1 ${positivo ? 'text-green-600' : 'text-amber-600'}`}>
                      {positivo ? '+' : ''}R$ {(delta / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Faixa esperada: R$ {(cargoAlvo.avgSalaryRange.min / 1000).toFixed(1)}k a R$ {(cargoAlvo.avgSalaryRange.max / 1000).toFixed(1)}k.
                    </p>
                  </>
                );
              })()}
            </div>
          </motion.div>

          {/* Gap das 7 competências Sicredi */}
          <motion.div variants={item} className="card p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-verde-digital" />
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
                        : '⚠ Precisa evoluir para atender o nível desejado.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Gap nas habilidades técnicas */}
          {(() => {
            const atribAlvo = getAtribuicoesByRoleId(cargoAlvo.id);
            if (!atribAlvo || atribAlvo.preparoTecnico.length === 0) return null;
            const minhasHabs = new Set(hub.employee.skills.map((s) => s.name.toLowerCase()));
            return (
              <motion.div variants={item} className="card p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Preparo Técnico exigido
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Habilidades técnicas que <strong>{cargoAlvo.title}</strong> exige.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {atribAlvo.preparoTecnico.map((s, i) => {
                    const tem = Array.from(minhasHabs).some((m) => s.toLowerCase().includes(m) || m.includes(s.toLowerCase().split(' ')[0]));
                    return (
                      <span
                        key={i}
                        className={`text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          tem ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}
                        title={tem ? 'Atendido' : 'Em desenvolvimento'}
                      >
                        {tem ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                        {s}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}

          {/* Plano sugerido em 3 ONDAS */}
          <motion.div variants={item} className="card p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Plano de ação em 3 ondas
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Sequência sugerida para você fechar o gap. Ações marcadas como ✓ já estão no seu PDI ou foram solicitadas.
            </p>
            <PlanoOndas
              hub={hub}
              cargoAlvo={cargoAlvo}
              adicionadosPDI={adicionadosPDI}
              onAdicionarPDI={(id) => setAdicionadosPDI((prev) => new Set(prev).add(id))}
              mentoriasSolicitadas={mentoriasSolicitadas}
              onSolicitarMentoria={(id) =>
                setMentoriasSolicitadas((prev) => new Set(prev).add(id))
              }
              experienciasInteresse={experienciasInteresse}
              onManifestarInteresse={(id) =>
                setExperienciasInteresse((prev) => new Set(prev).add(id))
              }
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

// ===== Diagrama de rota com nós intermediários reais =====
function RotaDiagram({ cargoAtual, cargoAlvo }: { cargoAtual: Role; cargoAlvo: Role }) {
  const diff = cargoAlvo.level - cargoAtual.level;

  // Detecta cargo intermediário do mesmo segmento (heurística)
  const intermediario =
    diff >= 2
      ? roles.find(
          (r) =>
            r.family === cargoAlvo.family &&
            r.level === cargoAtual.level + 1 &&
            r.id !== cargoAlvo.id,
        )
      : undefined;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 overflow-x-auto">
      <RotaNo role={cargoAtual} label="Você está aqui" cor="#3FA110" />
      {intermediario && (
        <>
          <ArrowRight className="w-5 h-5 text-gray-300 shrink-0" />
          <RotaNo
            role={intermediario}
            label="Etapa intermediária"
            cor={intermediario.color}
          />
        </>
      )}
      <ArrowRight className="w-5 h-5 text-gray-300 shrink-0" />
      <RotaNo role={cargoAlvo} label="Seu alvo" cor={cargoAlvo.color} />
    </div>
  );
}

function RotaNo({ role, label, cor }: { role: Role; label: string; cor: string }) {
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

// ===== Plano em 3 ondas =====
function PlanoOndas({
  hub,
  cargoAlvo,
  adicionadosPDI,
  onAdicionarPDI,
  mentoriasSolicitadas,
  onSolicitarMentoria,
  experienciasInteresse,
  onManifestarInteresse,
}: {
  hub: PersonaHub;
  cargoAlvo: Role;
  adicionadosPDI: Set<string>;
  onAdicionarPDI: (id: string) => void;
  mentoriasSolicitadas: Set<string>;
  onSolicitarMentoria: (id: string) => void;
  experienciasInteresse: Set<string>;
  onManifestarInteresse: (id: string) => void;
}) {
  // Identifica competências mais fracas (gap maior)
  const compsFracas = useMemo(() => {
    const esperado: 1 | 2 | 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;
    return [...hub.competenciasSicredi]
      .filter((c) => c.consenso < esperado)
      .sort((a, b) => a.consenso - b.consenso)
      .slice(0, 3);
  }, [hub.competenciasSicredi, cargoAlvo.level]);

  // Usa as recomendações do hub (com fallbacks inteligentes) em vez de filtros locais
  // que retornavam vazio para muitos cargos
  const trilhasHub = hub.trilhasRecomendadas;
  const mentoresHub = hub.mentoresSugeridos;
  const experienciasHub = hub.experienciasRecomendadas;

  // Distribui as recomendações em 3 ondas (30 / 90 / 6-12 meses)
  const ondas: Array<{
    titulo: string;
    horizonte: string;
    cor: string;
    items: Array<{
      id: string;
      tipo: 'curso' | 'mentoria' | 'experiencia' | 'avaliacao';
      titulo: string;
      descricao: string;
      esforco: string;
      competencia?: string;
    }>;
  }> = [
    {
      titulo: '🚀 Primeiros 30 dias',
      horizonte: 'Quick-wins',
      cor: '#16A34A',
      items: [
        {
          id: 'auto-q3',
          tipo: 'avaliacao' as const,
          titulo: 'Concluir autoavaliação do ciclo atual',
          descricao: 'Garantir que sua avaliação reflita a realidade. Base para tudo no plano.',
          esforco: '~30min',
        },
        ...trilhasHub.slice(0, 1).map((t) => ({
          id: `track-${t.id}`,
          tipo: 'curso' as const,
          titulo: t.title,
          descricao: `${t.totalDuration} · ${t.subtitle}`,
          esforco: t.totalDuration,
          competencia: compsFracas[0]?.competencia.nome,
        })),
      ],
    },
    {
      titulo: '🎯 Próximos 90 dias',
      horizonte: 'Consolidação',
      cor: '#2563EB',
      items: [
        ...mentoresHub.slice(0, 1).map((m) => ({
          id: `mentor-${m.id}`,
          tipo: 'mentoria' as const,
          titulo: `Mentoria com ${m.nome}`,
          descricao: `${m.cargo} · ${m.experienciaAnos} anos · ${m.especialidades.slice(0, 2).join(', ')}`,
          esforco: '1h/mês',
          competencia: compsFracas[1]?.competencia.nome,
        })),
        ...experienciasHub.slice(0, 1).map((e) => ({
          id: `exp-${e.id}`,
          tipo: 'experiencia' as const,
          titulo: e.titulo,
          descricao: `${e.tipo.replace('_', ' ')} · ${e.duracao}`,
          esforco: e.duracao,
          competencia: compsFracas[1]?.competencia.nome,
        })),
      ],
    },
    {
      titulo: '🏔 6 a 12 meses',
      horizonte: 'Transformação',
      cor: '#7C3AED',
      items: [
        ...trilhasHub.slice(1, 3).map((t) => ({
          id: `track-long-${t.id}`,
          tipo: 'curso' as const,
          titulo: t.title,
          descricao: `${t.totalDuration} · ${t.subtitle}`,
          esforco: t.totalDuration,
          competencia: compsFracas[2]?.competencia.nome,
        })),
        ...experienciasHub.slice(1, 2).map((e) => ({
          id: `exp-long-${e.id}`,
          tipo: 'experiencia' as const,
          titulo: e.titulo,
          descricao: `${e.tipo.replace('_', ' ')} · ${e.duracao}`,
          esforco: e.duracao,
          competencia: compsFracas[2]?.competencia.nome,
        })),
      ],
    },
  ];

  const tipoIcon = {
    curso: BookOpen,
    mentoria: Users,
    experiencia: Compass,
    avaliacao: Star,
  };

  return (
    <div className="space-y-4">
      {ondas.map((onda) => (
        <div key={onda.titulo}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-6 rounded-full" style={{ backgroundColor: onda.cor }} />
            <p className="text-sm font-bold text-gray-800">{onda.titulo}</p>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              {onda.horizonte}
            </span>
          </div>
          {onda.items.length === 0 ? (
            <p className="text-xs text-gray-400 italic pl-4">Nenhuma ação sugerida nesta onda.</p>
          ) : (
            <div className="space-y-2 pl-4">
              {onda.items.map((it) => {
                const Icon = tipoIcon[it.tipo];
                let acao;
                let pronto = false;
                if (it.tipo === 'curso' || it.tipo === 'avaliacao') {
                  pronto = adicionadosPDI.has(it.id);
                  acao = (
                    <button
                      onClick={() => onAdicionarPDI(it.id)}
                      disabled={pronto}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        pronto
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-verde-digital text-white hover:bg-verde-600'
                      }`}
                    >
                      {pronto ? '✓ No PDI' : 'Adicionar ao PDI'}
                    </button>
                  );
                } else if (it.tipo === 'mentoria') {
                  pronto = mentoriasSolicitadas.has(it.id);
                  acao = (
                    <button
                      onClick={() => onSolicitarMentoria(it.id)}
                      disabled={pronto}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        pronto
                          ? 'bg-purple-100 text-purple-700 cursor-default'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {pronto ? '✓ Mentoria solicitada' : 'Pedir mentoria'}
                    </button>
                  );
                } else {
                  pronto = experienciasInteresse.has(it.id);
                  acao = (
                    <button
                      onClick={() => onManifestarInteresse(it.id)}
                      disabled={pronto}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        pronto
                          ? 'bg-cyan-100 text-cyan-700 cursor-default'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {pronto ? '✓ Interesse registrado' : 'Manifestar interesse'}
                    </button>
                  );
                }

                return (
                  <div
                    key={it.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${onda.cor}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: onda.cor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{it.titulo}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{it.descricao}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-gray-400 inline-flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" />
                          {it.esforco}
                        </span>
                        {it.competencia && (
                          <span className="text-[10px] text-purple-600">
                            ★ {it.competencia}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">{acao}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== Prontidão estimada para cargo qualquer =====
function ProntidaoEstimada({ hub, cargoAlvo }: { hub: PersonaHub; cargoAlvo: Role }) {
  const reqs = cargoAlvo.requiredSkills;
  const habsAtende = reqs.filter((req) => {
    const skill = hub.employee.skills.find((s) => s.id === req.skillId);
    return skill && skill.level >= req.minLevel;
  }).length;
  const compEsperado: 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;
  const compsAtende = hub.competenciasSicredi.filter((c) => c.consenso >= compEsperado).length;
  const totalReqs = reqs.length || 1;
  const totalComps = hub.competenciasSicredi.length;
  const score = Math.round(0.5 * ((compsAtende / totalComps) * 100) + 0.5 * ((habsAtende / totalReqs) * 100));

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

// ===== Comparador 2-3 cargos com diferenças quantificadas =====
function ComparadorTable({
  hub,
  cargos,
  onRemover,
}: {
  hub: PersonaHub;
  cargos: Role[];
  onRemover?: (roleId: string) => void;
}) {
  const salarioAtual = hub.employee.currentSalary || 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 w-44">
              Atributo
            </th>
            {cargos.map((c) => (
              <th key={c.id} className="text-left py-2 px-3 min-w-[170px]">
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
            <td className="py-2 px-3 text-[11px] text-gray-500 inline-flex items-center gap-1">
              <Coins className="w-3 h-3" /> Delta salarial
            </td>
            {cargos.map((c) => {
              const meio = (c.avgSalaryRange.min + c.avgSalaryRange.max) / 2;
              const delta = meio - salarioAtual;
              return (
                <td key={c.id} className="py-2 px-3">
                  <span
                    className={`text-[12px] font-bold ${
                      delta > 0 ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {delta > 0 ? '+' : ''}R$ {(delta / 1000).toFixed(1)}k
                  </span>
                </td>
              );
            })}
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
          <tr>
            <td className="py-2 px-3 text-[11px] text-gray-500">Esforço estimado</td>
            {cargos.map((c) => {
              const diff = Math.abs(c.level - hub.cargoAtual.level);
              const horas = diff <= 1 ? '~80h' : diff === 2 ? '~150h' : '~250h+';
              return (
                <td key={c.id} className="py-2 px-3 text-[12px] text-gray-700">
                  {horas}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ProntidaoSimbolo({ hub, cargoAlvo }: { hub: PersonaHub; cargoAlvo: Role }) {
  const reqs = cargoAlvo.requiredSkills;
  const habsAtende = reqs.filter((req) => {
    const skill = hub.employee.skills.find((s) => s.id === req.skillId);
    return skill && skill.level >= req.minLevel;
  }).length;
  const compEsperado: 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;
  const compsAtende = hub.competenciasSicredi.filter((c) => c.consenso >= compEsperado).length;
  const totalReqs = reqs.length || 1;
  const totalComps = hub.competenciasSicredi.length;
  const score = Math.round(0.5 * ((compsAtende / totalComps) * 100) + 0.5 * ((habsAtende / totalReqs) * 100));

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
