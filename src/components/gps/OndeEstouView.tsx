'use client';

import { motion } from 'framer-motion';
import { PersonaHub } from '@/data/persona-hub';
import { getAtribuicoesByRoleId } from '@/data/atribuicoes-cargos';
import {
  Briefcase,
  Coins,
  MapPin,
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Wrench,
  CheckCircle2,
  Calendar,
  Clock,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

interface Props {
  hub: PersonaHub;
  onIrParaPossibilidades: () => void;
  onIrParaPlanoRota: () => void;
}

/**
 * GPS — Aba 1: Onde estou
 * Visão 360° do posicionamento atual da pessoa.
 * Cargo, GGS/grade, faixa salarial, tempos, 5 competências, habilidades, aspiração.
 */
export default function OndeEstouView({
  hub,
  onIrParaPossibilidades,
  onIrParaPlanoRota,
}: Props) {
  const { cargoAtual, employee, persona, competenciasSicredi, notaFinalPerformance, prontidao, potencial, cargoAlvo } = hub;

  return (
    <motion.div variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-5">
      {/* Hero — Cargo atual rico */}
      <motion.div variants={item} className="card overflow-hidden">
        <div
          className="h-2"
          style={{ background: cargoAtual.color }}
        />
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
              style={{ background: cargoAtual.color }}
            >
              N{cargoAtual.level}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Cargo atual</p>
              <h2 className="text-xl font-bold text-gray-900">{cargoAtual.title}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {cargoAtual.family.replace('_', ' ')} · {cargoAtual.diretoria || 'Diretoria de Negócios'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {notaFinalPerformance && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ color: notaFinalPerformance.cor, backgroundColor: notaFinalPerformance.bgCor }}
                  title="Última avaliação de desempenho"
                >
                  {notaFinalPerformance.hashtag}
                </span>
              )}
              {prontidao && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ color: prontidao.cor, backgroundColor: prontidao.bgCor }}
                  title="Prontidão para o cargo aspirado (avaliação atual)"
                >
                  {prontidao.nome}
                </span>
              )}
              {potencial && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ color: potencial.cor, backgroundColor: potencial.bgCor }}
                  title="Potencial (visão do líder + sistema)"
                >
                  Potencial {potencial.nome}
                </span>
              )}
            </div>
          </div>

          {/* Métricas de contexto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
            <Metric
              icon={Coins}
              label="Faixa salarial"
              value={`R$ ${(cargoAtual.avgSalaryRange.min / 1000).toFixed(1)}k a ${(cargoAtual.avgSalaryRange.max / 1000).toFixed(1)}k`}
            />
            <Metric icon={MapPin} label="Onde atuo" value={persona.branch || persona.cooperative} />
            <Metric icon={Briefcase} label="Tempo no cargo" value={`${employee.tenureMonths} meses`} />
            <Metric icon={Users} label="Tempo no Sicredi" value={`${employee.tenure} ${employee.tenure === 1 ? 'ano' : 'anos'}`} />
          </div>

          {/* Dia na vida */}
          {cargoAtual.dayInLife && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Um dia na vida</p>
              <p className="text-xs text-gray-700 leading-relaxed">{cargoAtual.dayInLife}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 7 competências Jeito Sicredi com conceito atual + delta vs ciclo anterior */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Competências Jeito Sicredi de Ser
          </h3>
          <span className="text-[10px] text-gray-400">Vindas da avaliação Ciclo 1/2026 (com delta vs ciclo anterior)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {competenciasSicredi.map((c) => (
            <div key={c.competencia.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.competencia.cor }} />
                  <p className="text-sm font-semibold text-gray-800 truncate">{c.competencia.nome}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {c.delta !== undefined && c.delta !== 0 && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                        c.delta > 0 ? 'text-green-600' : 'text-amber-600'
                      }`}
                      title={`Delta vs ciclo anterior: ${c.delta > 0 ? '+' : ''}${c.delta}`}
                    >
                      {c.delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {c.delta > 0 ? '+' : ''}{c.delta}
                    </span>
                  )}
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: c.conceito.bgCor, color: c.conceito.cor }}
                  >
                    {c.conceito.hashtag}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-2">{c.competencia.descricao}</p>
              {c.comentarioLider && (
                <p className="text-[11px] text-purple-600 italic mt-1.5">
                  &ldquo;{c.comentarioLider}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Preparo Técnico (vindo da Matriz oficial) — substitui habilidades técnicas genéricas */}
      {(() => {
        const atrib = getAtribuicoesByRoleId(cargoAtual.id);
        if (!atrib || atrib.preparoTecnico.length === 0) return null;
        return (
          <motion.div variants={item} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                Preparo Técnico esperado
              </h3>
              <span className="text-[10px] text-gray-400">
                Conhecimentos esperados pelo cargo
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Conhecimentos e ferramentas que o cargo {cargoAtual.shortTitle} exige no dia a dia.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {atrib.preparoTecnico.map((s, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Marcos da semana (vindos do hub.notificacoes) */}
      {hub.notificacoes.length > 0 && (
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Próximos marcos
            </h3>
            <span className="text-[10px] text-gray-400">Vindos das suas notificações</span>
          </div>
          <ul className="space-y-2">
            {hub.notificacoes.slice(0, 4).map((n) => (
              <li key={n.id} className="flex items-start gap-2.5">
                <Clock
                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    n.tipo === 'alerta'
                      ? 'text-red-500'
                      : n.tipo === 'pendencia'
                      ? 'text-amber-500'
                      : 'text-gray-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">{n.titulo}</p>
                  <p className="text-[11px] text-gray-500">{n.descricao}</p>
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{n.data}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Aspiração + CTAs */}
      {cargoAlvo && (
        <motion.div
          variants={item}
          className="card p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(63,161,16,0.05) 0%, rgba(255,255,255,1) 100%)',
            borderLeft: `4px solid ${cargoAlvo.color}`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Para onde quero ir</p>
              <h3 className="text-lg font-bold text-gray-900">{cargoAlvo.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Horizonte declarado: {employee.aspirations[0]?.timeframe || 'a definir'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {hub.gapAlvo && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: hub.gapAlvo.prontidaoEstimada.bgCor, color: hub.gapAlvo.prontidaoEstimada.cor }}
                  >
                    {hub.gapAlvo.prontidaoEstimada.nome}
                  </span>
                )}
                {employee.aspirations[0]?.sharedWithLeader && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    Compartilhada com líder
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={onIrParaPlanoRota}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-verde-digital text-white text-xs font-semibold hover:bg-verde-600 transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                Ver minha rota
              </button>
              <button
                onClick={onIrParaPossibilidades}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Outras possibilidades
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}
