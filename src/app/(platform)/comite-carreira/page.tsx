'use client';

import { useState, useMemo } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById, getTeamForLeader } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { getAtribuicoesByRoleId } from '@/data/atribuicoes-cargos';
import { avaliacoesMock, reguaProntidao, reguaPotencial, reguaPerformance } from '@/data/elofy-config';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '@/types';
import {
  ShieldCheck,
  Users,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  Star,
  X,
  ListChecks,
  History,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

type DecisaoTipo = 'promocao' | 'merito' | 'mentoria' | 'desenvolvimento' | 'retencao' | 'sem_acao';

interface CasoComite {
  employee: Employee;
  decisaoSugerida: DecisaoTipo;
  decisaoTexto: string;
  criteriosAtendidos: string[];
  criteriosFaltantes: string[];
  prontidaoScore: number;
  status: 'aprovado' | 'acao_urgente' | 'pendente';
}

const decisaoConfig: Record<DecisaoTipo, { label: string; cor: string; bg: string; icon: typeof Star }> = {
  promocao: { label: 'Promoção sugerida', cor: '#16A34A', bg: '#F0FDF4', icon: TrendingUp },
  merito: { label: 'Mérito (mesma faixa)', cor: '#2563EB', bg: '#EFF6FF', icon: Star },
  mentoria: { label: 'Programa de mentoria', cor: '#7C3AED', bg: '#FAF5FF', icon: Users },
  desenvolvimento: { label: 'PDI prioritário', cor: '#D97706', bg: '#FFFBEB', icon: ListChecks },
  retencao: { label: 'Conversa de retenção', cor: '#DC2626', bg: '#FEF2F2', icon: AlertTriangle },
  sem_acao: { label: 'Acompanhar', cor: '#6B7280', bg: '#F3F4F6', icon: CheckCircle2 },
};

/**
 * Gera caso de comitê real para cada subordinado, baseado em dados reais
 * (avaliação, aspiração, alertas, tempo no grade).
 */
function gerarCaso(employee: Employee, leaderId: string): CasoComite {
  const aval = avaliacoesMock.find(
    (a) => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1',
  );
  const conceito = aval?.notaFinalPerformance || 2;
  const aspiracao = employee.aspirations[0];
  const turnoverHigh = employee.turnoverRisk && employee.turnoverRisk.probability > 70;
  const semAval = !aval;
  const monthsInGrade = employee.monthsInGrade ?? 0;
  const sharedAsp = aspiracao?.sharedWithLeader ?? false;

  // Score 0-100 (heurística)
  const prontidaoScore =
    conceito * 20 +
    (aspiracao ? 10 : 0) +
    (sharedAsp ? 10 : 0) +
    (monthsInGrade >= 18 ? 10 : monthsInGrade >= 12 ? 5 : 0) +
    (employee.engagementScore > 70 ? 10 : 0);

  // Decisão sugerida (regra simples)
  let decisaoSugerida: DecisaoTipo = 'sem_acao';
  let decisaoTexto = '';
  const criteriosAtendidos: string[] = [];
  const criteriosFaltantes: string[] = [];
  let status: CasoComite['status'] = 'pendente';

  if (turnoverHigh) {
    decisaoSugerida = 'retencao';
    decisaoTexto = `Risco crítico de saída (${employee.turnoverRisk!.probability}%). Conversa de retenção urgente esta semana.`;
    status = 'acao_urgente';
  } else if (conceito >= 3 && monthsInGrade >= 18 && sharedAsp) {
    decisaoSugerida = 'promocao';
    decisaoTexto = `Pronto para promoção: ${aspiracao && getRoleById(aspiracao.targetRoleId)?.shortTitle}. Iniciar processo no próximo ciclo.`;
    status = 'aprovado';
    criteriosAtendidos.push(`Conceito ${reguaPerformance[conceito - 1]?.hashtag}`);
    criteriosAtendidos.push(`${monthsInGrade} meses no grade (≥ 18 ok)`);
    criteriosAtendidos.push('Aspiração compartilhada com líder');
  } else if (conceito >= 3 && (employee.monthsInZone ?? 0) >= 12) {
    decisaoSugerida = 'merito';
    decisaoTexto = `Elegível para Mérito (subir de zona dentro do mesmo cargo). ${employee.monthsInZone} meses na zona atual.`;
    status = 'aprovado';
    criteriosAtendidos.push(`Conceito ${reguaPerformance[conceito - 1]?.hashtag}`);
    criteriosAtendidos.push(`${employee.monthsInZone} meses na zona (≥ 12 ok)`);
  } else if (conceito === 2 && aspiracao) {
    decisaoSugerida = 'mentoria';
    decisaoTexto = `Em desenvolvimento (#quase lá) com aspiração declarada. Apoiar com mentoria estruturada.`;
    status = 'pendente';
    criteriosAtendidos.push('Aspiração declarada');
    criteriosFaltantes.push('Conceito ainda em #quase lá (precisa #mandou bem para promoção)');
  } else if (semAval || conceito === 1) {
    decisaoSugerida = 'desenvolvimento';
    decisaoTexto = semAval
      ? 'Avaliação ainda não concluída. Garantir conclusão antes do próximo comitê.'
      : 'Conceito #precisa evoluir. PDI prioritário com 2-3 ações concretas para o próximo ciclo.';
    status = 'pendente';
  } else {
    decisaoSugerida = 'sem_acao';
    decisaoTexto = 'Acompanhar no ciclo. Sem ação específica recomendada agora.';
    status = 'pendente';
    criteriosFaltantes.push('Tempo no grade insuficiente para movimentação');
  }

  if (!sharedAsp && aspiracao) criteriosFaltantes.push('Aspiração não compartilhada com líder');
  if (employee.engagementScore < 60) criteriosFaltantes.push('Engajamento abaixo de 60');

  return {
    employee,
    decisaoSugerida,
    decisaoTexto,
    criteriosAtendidos,
    criteriosFaltantes,
    prontidaoScore: Math.min(100, prontidaoScore),
    status,
  };
}

export default function ComiteCarreiraPage() {
  const { currentPersona } = usePersona();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!currentPersona || (currentPersona.role !== 'lider' && currentPersona.role !== 'pc_analista')) {
    return null;
  }

  const employee = getEmployeeById(currentPersona.employeeId);
  const team = employee ? getTeamForLeader(employee.id) : [];
  const casos = useMemo(() => team.map((t) => gerarCaso(t, employee?.id || '')), [team, employee]);

  const aprovados = casos.filter((c) => c.status === 'aprovado').length;
  const urgentes = casos.filter((c) => c.status === 'acao_urgente').length;
  const pendentes = casos.filter((c) => c.status === 'pendente').length;

  const selected = selectedId ? casos.find((c) => c.employee.id === selectedId) : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-6xl">
      <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-verde-digital" />
            Comitê de Carreira
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Discussão estruturada sobre desenvolvimento, prontidão e movimentação. Casos vindos da sua
            equipe real, com decisão sugerida automaticamente pelos critérios sistêmicos.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Próximo comitê</p>
          <p className="text-sm font-bold text-gray-800">15 Mai 2026 · 14h</p>
          <p className="text-[11px] text-gray-500">Sala virtual com Carla (P&C)</p>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Em pauta" value={casos.length} cor="#2563EB" icon={Users} />
        <Kpi label="Aprovados" value={aprovados} cor="#16A34A" icon={CheckCircle2} />
        <Kpi label="Ação urgente" value={urgentes} cor="#DC2626" icon={AlertTriangle} />
        <Kpi label="Pendentes" value={pendentes} cor="#D97706" icon={ClipboardCheck} />
      </motion.div>

      {/* Critérios sistêmicos (transparência) */}
      <motion.div variants={item} className="card p-5 bg-blue-50/30 border-blue-100">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-blue-600" />
          Critérios sistêmicos aplicados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-gray-600">
          <div className="p-2 rounded bg-white border border-gray-100">
            <strong>Promoção:</strong> conceito #mandou bem ou superior + 18+ meses no grade + aspiração compartilhada.
          </div>
          <div className="p-2 rounded bg-white border border-gray-100">
            <strong>Mérito:</strong> conceito #mandou bem ou superior + 12+ meses na zona atual.
          </div>
          <div className="p-2 rounded bg-white border border-gray-100">
            <strong>Mentoria:</strong> conceito #quase lá com aspiração declarada.
          </div>
          <div className="p-2 rounded bg-white border border-gray-100">
            <strong>PDI prioritário:</strong> conceito #precisa evoluir ou avaliação não concluída.
          </div>
          <div className="p-2 rounded bg-white border border-gray-100">
            <strong>Conversa de retenção:</strong> sinais de risco de saída &gt; 70%.
          </div>
          <div className="p-2 rounded bg-white border border-gray-100">
            <strong>Acompanhar:</strong> demais casos sem disparador formal.
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lista de casos */}
        <motion.div variants={item} className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Pauta da reunião</h3>
          {casos.map((caso) => (
            <CasoCard
              key={caso.employee.id}
              caso={caso}
              isSelected={selectedId === caso.employee.id}
              onSelect={() =>
                setSelectedId((prev) => (prev === caso.employee.id ? null : caso.employee.id))
              }
            />
          ))}
        </motion.div>

        {/* Onepage CRM Talento (painel lateral quando seleciona um caso) */}
        <motion.div variants={item} className="lg:col-span-1">
          {selected ? (
            <OnepageCRMTalento caso={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <div className="card p-5 text-center text-sm text-gray-400 italic h-full flex items-center justify-center">
              Selecione um caso ao lado para ver o Onepage CRM Talento.
            </div>
          )}
        </motion.div>
      </div>

      {/* Histórico de decisões (mock para dar sensação de continuidade) */}
      <motion.div variants={item} className="card p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          Histórico recente de decisões
        </h3>
        <div className="space-y-2">
          {[
            { data: 'Fev 2026', nome: 'Felipe Costa', decisao: 'Promovido a GN PF II', tipo: 'promocao' },
            { data: 'Dez 2025', nome: 'Ana Beatriz Lima', decisao: 'Mérito (Zona 3 → Zona 4)', tipo: 'merito' },
            { data: 'Out 2025', nome: 'Marcelo Gomes', decisao: 'Iniciou PDI prioritário', tipo: 'desenvolvimento' },
          ].map((h, i) => {
            const cfg = decisaoConfig[h.tipo as DecisaoTipo];
            return (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <span className="text-[10px] text-gray-400 w-16 shrink-0">{h.data}</span>
                <span className="text-sm text-gray-700 flex-1">{h.nome}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: cfg.bg, color: cfg.cor }}
                >
                  {h.decisao}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== Card de caso =====
function CasoCard({
  caso,
  isSelected,
  onSelect,
}: {
  caso: CasoComite;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const role = getRoleById(caso.employee.roleId);
  const aspiracao = caso.employee.aspirations[0];
  const aspRole = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;
  const cfg = decisaoConfig[caso.decisaoSugerida];
  const Icon = cfg.icon;
  const aval = avaliacoesMock.find(
    (a) => a.employeeId === caso.employee.id && a.cicloId === 'ciclo-2026-1',
  );
  const conceito = aval ? reguaPerformance[aval.notaFinalPerformance - 1] : null;
  const prontidao = aval?.prontidaoId ? reguaProntidao.find((r) => r.id === aval.prontidaoId) : null;
  const potencial = aval?.potencialId ? reguaPotencial.find((r) => r.id === aval.potencialId) : null;

  const initials = caso.employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left card p-4 transition-all ${
        isSelected ? 'ring-2 ring-verde-digital/40 shadow-md' : 'hover:shadow-sm'
      } border-l-4`}
      style={{ borderLeftColor: cfg.cor }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: role?.color || cfg.cor }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-gray-900">{caso.employee.name}</p>
              <p className="text-[11px] text-gray-500">
                {role?.shortTitle}
                {aspRole && <> → aspira {aspRole.shortTitle}</>}
              </p>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0"
              style={{ backgroundColor: cfg.bg, color: cfg.cor }}
            >
              <Icon className="w-2.5 h-2.5" />
              {cfg.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {conceito && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: conceito.bgCor, color: conceito.cor }}
              >
                {conceito.hashtag}
              </span>
            )}
            {prontidao && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: prontidao.bgCor, color: prontidao.cor }}
              >
                Pront: {prontidao.nome}
              </span>
            )}
            {potencial && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: potencial.bgCor, color: potencial.cor }}
              >
                Pot: {potencial.label}
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-600 mt-2 leading-snug">{caso.decisaoTexto}</p>
        </div>
      </div>
    </button>
  );
}

// ===== Onepage CRM Talento =====
function OnepageCRMTalento({ caso, onClose }: { caso: CasoComite; onClose: () => void }) {
  const role = getRoleById(caso.employee.roleId);
  const atrib = getAtribuicoesByRoleId(caso.employee.roleId);
  const aspiracao = caso.employee.aspirations[0];
  const aspRole = aspiracao ? getRoleById(aspiracao.targetRoleId) : null;
  const aval = avaliacoesMock.find(
    (a) => a.employeeId === caso.employee.id && a.cicloId === 'ciclo-2026-1',
  );

  return (
    <div className="card p-5 sticky top-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-verde-digital">
            Onepage CRM Talento
          </p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{caso.employee.name}</p>
          <p className="text-[11px] text-gray-500">{role?.title}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 shrink-0"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Aspiração</p>
          {aspRole ? (
            <p className="text-gray-700">
              {aspRole.title} · {aspiracao?.timeframe}
              {aspiracao?.sharedWithLeader && <span className="text-green-600 ml-1">✓ compartilhada</span>}
            </p>
          ) : (
            <p className="text-gray-400 italic">Não declarada</p>
          )}
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Tempos</p>
          <p className="text-gray-700">
            Sicredi: {caso.employee.tenure}a · Grade: {caso.employee.monthsInGrade ?? '-'}m · Zona:{' '}
            {caso.employee.monthsInZone ?? '-'}m
          </p>
        </div>

        {caso.employee.currentSalary && (
          <div>
            <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Salário atual</p>
            <p className="text-gray-700">R$ {(caso.employee.currentSalary / 1000).toFixed(1)}k</p>
          </div>
        )}

        {caso.employee.lastCareerConversation && (
          <div>
            <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Última conversa</p>
            <p className="text-gray-700">{caso.employee.lastCareerConversation.date}</p>
            <p className="text-gray-500 italic">"{caso.employee.lastCareerConversation.outcome}"</p>
          </div>
        )}

        {aval && aval.competencias.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Top 3 competências</p>
            <div className="space-y-1">
              {[...aval.competencias]
                .sort((a, b) => (b.consenso || 0) - (a.consenso || 0))
                .slice(0, 3)
                .map((c) => {
                  const conf = reguaPerformance[(c.consenso || 1) - 1];
                  return (
                    <div key={c.competenciaId} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-600 truncate">{c.competenciaId.replace(/-/g, ' ')}</span>
                      <span
                        className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                        style={{ backgroundColor: conf.bgCor, color: conf.cor }}
                      >
                        {conf.hashtag}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {caso.criteriosAtendidos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase text-green-600 mb-1">✓ Critérios atendidos</p>
            <ul className="space-y-0.5">
              {caso.criteriosAtendidos.map((c) => (
                <li key={c} className="text-[11px] text-green-700">
                  • {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {caso.criteriosFaltantes.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase text-amber-600 mb-1">⚠ Faltam</p>
            <ul className="space-y-0.5">
              {caso.criteriosFaltantes.map((c) => (
                <li key={c} className="text-[11px] text-amber-700">
                  • {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Decisão sugerida</p>
          <p className="text-sm font-semibold text-gray-800">
            {decisaoConfig[caso.decisaoSugerida].label}
          </p>
          <p className="text-[11px] text-gray-600 mt-1">{caso.decisaoTexto}</p>
        </div>

        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
          <a
            href={`/equipe/${caso.employee.id}`}
            className="text-center text-[11px] font-bold text-verde-digital hover:bg-verde-50 py-2 rounded-lg border border-verde-digital/30"
          >
            Abrir perfil completo →
          </a>
          {atrib && (
            <a
              href={`/meu-cargo/${caso.employee.roleId}`}
              className="text-center text-[11px] font-semibold text-gray-600 hover:bg-gray-50 py-2 rounded-lg border border-gray-200"
            >
              Ver descrição do cargo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  cor,
  icon: Icon,
}: {
  label: string;
  value: number;
  cor: string;
  icon: typeof Users;
}) {
  return (
    <div className="card p-4">
      <Icon className="w-4 h-4 mb-2" style={{ color: cor }} />
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
