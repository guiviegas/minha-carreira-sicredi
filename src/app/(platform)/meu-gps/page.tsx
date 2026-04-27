'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { getPersonaHub, PersonaHub } from '@/data/persona-hub';
import { employees as allEmployees } from '@/data/employees';
import { avaliacoesMock as allAvaliacoes } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import TheoCard from '@/components/theo/TheoCard';
import {
  CheckCircle2,
  Users,
  AlertTriangle,
  Target,
  ArrowRight,
  Compass,
  Calendar,
  MessageCircle,
} from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MeuGPSPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona) return null;

  const hub = getPersonaHub(currentPersona.id);
  if (!hub) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Início</h1>
        <p className="text-sm text-gray-500 mt-1">
          {hub.cargoAtual.title} · {hub.persona.cooperative}
          {hub.persona.branch && ` · ${hub.persona.branch}`}
        </p>
      </motion.div>

      {hub.persona.role === 'colaborador' && <ColaboradorDashboard hub={hub} />}
      {hub.persona.role === 'lider' && <LiderDashboard hub={hub} />}
      {hub.persona.role === 'pc_analista' && <PCAnalistaDashboard hub={hub} />}
    </motion.div>
  );
}

// ===== MARIANA — Hub de Desenvolvimento Pessoal =====
function ColaboradorDashboard({ hub }: { hub: PersonaHub }) {
  const aspiration = hub.employee.aspirations[0];
  const pdi = hub.pdi;
  const acoesPdi = pdi?.actions.slice(0, 3) ?? [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Row 1: Aspiração + PDI + Próxima Conversa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Minha Aspiração */}
        <motion.div variants={item} className="card p-5 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-verde-50 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-verde-digital" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minha Aspiração</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{hub.cargoAlvo?.title || 'Não definida'}</p>
          <p className="text-xs text-gray-500 mt-1">Horizonte: {aspiration?.timeframe || 'a definir'}</p>

          {hub.gapAlvo && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase">Prontidão</p>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg inline-block"
                style={{
                  color: hub.gapAlvo.prontidaoEstimada.cor,
                  backgroundColor: hub.gapAlvo.prontidaoEstimada.bgCor,
                }}
              >
                {hub.gapAlvo.prontidaoEstimada.nome}
              </span>
              <p className="text-[10px] text-gray-500 mt-1">
                {hub.gapAlvo.prontidaoEstimada.descricao}
              </p>
            </div>
          )}

          <a
            href="/mapa-carreira"
            className="flex items-center gap-1.5 text-sm font-semibold text-verde-digital mt-4 hover:gap-2.5 transition-all"
          >
            Ver no GPS de Carreira <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Meu PDI */}
        <motion.div variants={item} className="card p-5 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Meu PDI</p>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Foco: {pdi?.goal.targetRoleTitle ?? hub.cargoAlvo?.title ?? '-'}
          </p>
          <div className="space-y-2.5">
            {acoesPdi.map((ac) => (
              <div key={ac.id} className="flex items-center justify-between">
                <p className="text-sm text-gray-700 truncate mr-2">{ac.title}</p>
                <span
                  className={`text-[10px] font-semibold whitespace-nowrap ${
                    ac.status === 'completed'
                      ? 'text-green-600'
                      : ac.status === 'in_progress'
                      ? 'text-verde-digital'
                      : 'text-amber-600'
                  }`}
                >
                  {ac.status === 'completed'
                    ? 'Concluída'
                    : ac.status === 'in_progress'
                    ? 'Em andamento'
                    : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
          <a
            href="/pdi"
            className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 mt-4 hover:gap-2.5 transition-all"
          >
            Ver PDI completo <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Próxima Conversa */}
        <motion.div variants={item} className="card p-5 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Próxima conversa</p>
          </div>
          {(() => {
            const proxCheckIn = pdi?.checkIns.find((c) => c.type === 'scheduled');
            return (
              <>
                <p className="text-sm font-semibold text-gray-800">
                  Conversa de carreira com {proxCheckIn?.leaderName || 'seu líder'}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {proxCheckIn?.date || 'A agendar'}
                </p>
                <div className="mt-3 p-2.5 rounded-lg bg-gray-50">
                  <p className="text-[11px] text-gray-500 font-medium">Sugestão de pauta do Theo:</p>
                  <p className="text-xs text-gray-700 mt-1">
                    {hub.cargoAlvo
                      ? `Compartilhar progresso na trilha de ${hub.cargoAlvo.title} e validar próximas vivências.`
                      : 'Compartilhar progresso da trilha e validar próximos passos.'}
                  </p>
                </div>
              </>
            );
          })()}
          <a
            href="/parceiro-jornada"
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 mt-3 hover:gap-2.5 transition-all"
          >
            Preparar conversa <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>

      {/* Row 2: Theo Nudges + Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Theo Nudges (2 cols) — vindos do hub */}
        <motion.div variants={item} className="md:col-span-2 space-y-3">
          {hub.nudges.length === 0 && (
            <div className="card p-4 text-sm text-gray-500">Sem sugestões no momento.</div>
          )}
          {hub.nudges.map((n) => (
            <TheoCard
              key={n.id}
              title={n.titulo}
              description={n.descricao}
              cta={n.ctaLabel}
              ctaHref={n.ctaHref}
            />
          ))}
        </motion.div>

        {/* Sua jornada agora — competências fortes + atenção */}
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-verde-digital" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sua jornada agora</p>
          </div>

          {/* Competência mais forte */}
          {(() => {
            const fortes = hub.competenciasSicredi.filter((c) => c.consenso === 4);
            const fracas = [...hub.competenciasSicredi].sort((a, b) => a.consenso - b.consenso);
            const maisForte = fortes[0];
            const maisFraca = fracas[0];
            return (
              <div className="space-y-3">
                {maisForte && (
                  <div className="p-2.5 rounded-lg bg-green-50 border border-green-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-700 mb-0.5">
                      ★ Maior força hoje
                    </p>
                    <p className="text-xs font-semibold text-gray-800">{maisForte.competencia.nome}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Conceito: <strong>{maisForte.conceito.hashtag}</strong>
                    </p>
                  </div>
                )}
                {maisFraca && maisFraca.consenso < 3 && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-0.5">
                      ⚡ Foco prioritário
                    </p>
                    <p className="text-xs font-semibold text-gray-800">{maisFraca.competencia.nome}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Hoje em <strong>{maisFraca.conceito.hashtag}</strong>. O Plano de Rota tem ações sugeridas.
                    </p>
                  </div>
                )}
                {hub.cargoAlvo && hub.gapAlvo && (
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-0.5">
                      🎯 Para chegar em {hub.cargoAlvo.shortTitle}
                    </p>
                    <p className="text-xs text-gray-700">
                      Prontidão: <strong>{hub.gapAlvo.prontidaoEstimada.nome}</strong>
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          <a
            href="/avaliacao"
            className="block mt-3 text-[11px] font-semibold text-verde-digital text-center hover:underline"
          >
            Ver minha avaliação completa →
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ===== ROBERTO — Líder Dashboard (Carreira + Equipe) =====
function LiderDashboard({ hub }: { hub: PersonaHub }) {
  const team = hub.equipe ?? [];
  const aspiration = hub.employee.aspirations[0];

  const getStatusColor = (emp: typeof team[number]) => {
    if (emp.turnoverRisk && emp.turnoverRisk.probability > 70)
      return { color: 'red', label: 'Risco', dotClass: 'status-dot-red' };
    if (emp.onboarding && emp.onboarding.percentage < 100)
      return { color: 'blue', label: 'Onboarding', dotClass: 'status-dot-blue' };
    if (emp.engagementScore < 60)
      return { color: 'yellow', label: 'Atenção', dotClass: 'status-dot-yellow' };
    return { color: 'green', label: 'No caminho', dotClass: 'status-dot-green' };
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Row 1: Carreira Pessoal + Equipe Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Carreira Pessoal */}
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minha Carreira</p>
          </div>
          <p className="text-sm text-gray-500">Aspiração</p>
          <p className="text-lg font-bold text-gray-900">{hub.cargoAlvo?.title || 'A definir'}</p>
          <p className="text-xs text-gray-500 mt-1">Horizonte: {aspiration?.timeframe || 'a definir'}</p>

          {hub.gapAlvo && (
            <div className="mt-3">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg inline-block"
                style={{
                  color: hub.gapAlvo.prontidaoEstimada.cor,
                  backgroundColor: hub.gapAlvo.prontidaoEstimada.bgCor,
                }}
              >
                {hub.gapAlvo.prontidaoEstimada.nome}
              </span>
            </div>
          )}

          <div className="mt-3 space-y-2">
            {hub.nudges.slice(0, 2).map((n) => (
              <TheoCard
                key={n.id}
                variant="compact"
                title={n.titulo}
                description={n.descricao}
              />
            ))}
          </div>
        </motion.div>

        {/* Equipe Status */}
        <motion.div variants={item} className="card p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minha Equipe</p>
              <span className="text-xs text-gray-400">({team.length})</span>
            </div>
            <a href="/equipe" className="text-xs text-verde-digital font-semibold hover:underline">
              Ver equipe completa →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {team.slice(0, 6).map((member) => {
              const status = getStatusColor(member);
              return (
                <a
                  key={member.id}
                  href={`/equipe/${member.id}`}
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg avatar-initials text-[10px]"
                      style={{
                        backgroundColor:
                          status.color === 'green'
                            ? '#16A34A'
                            : status.color === 'yellow'
                            ? '#D97706'
                            : status.color === 'red'
                            ? '#DC2626'
                            : '#2563EB',
                      }}
                    >
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {member.name.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {member.roleId.replace('role-', '').toUpperCase()}
                      </p>
                    </div>
                    <div className={`status-dot ${status.dotClass}`} />
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Alerta de Turnover */}
      {team.some((t) => t.turnoverRisk && t.turnoverRisk.probability > 70) && (
        <motion.div variants={item} className="card p-4 border-l-4 border-l-red-400 bg-red-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Alerta de risco de saída</p>
              <p className="text-sm text-red-700 mt-0.5">
                {(() => {
                  const arrisc = team.find(
                    (t) => t.turnoverRisk && t.turnoverRisk.probability > 70,
                  );
                  return arrisc
                    ? `${arrisc.name} apresenta sinais de risco. Recomendação: agendar conversa de retenção esta semana.`
                    : '';
                })()}
              </p>
              <a
                href="/equipe"
                className="text-sm font-semibold text-red-600 mt-2 hover:text-red-800 flex items-center gap-1"
              >
                Ver detalhes e ações <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Theo Nudges Líder — restantes do hub */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {hub.nudges.slice(2).map((n) => (
          <TheoCard
            key={n.id}
            title={n.titulo}
            description={n.descricao}
            cta={n.ctaLabel}
            ctaHref={n.ctaHref}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ===== CARLA — P&C Dashboard com KPIs derivados de dados reais =====
function PCAnalistaDashboard({ hub }: { hub: PersonaHub }) {
  // KPIs calculados de employees real (em vez de hardcoded)
  const total = allEmployees.length;
  const comAval = allEmployees.filter((e) =>
    allAvaliacoes.some((a) => a.employeeId === e.id && a.cicloId === 'ciclo-2026-1'),
  ).length;
  const comPdi = allEmployees.filter((e) => e.developmentPlanIds && e.developmentPlanIds.length > 0).length;
  const aspCompartilhada = allEmployees.filter(
    (e) => e.aspirations.length > 0 && e.aspirations[0].sharedWithLeader,
  ).length;
  const prontosAgora = allAvaliacoes.filter((a) => a.prontidaoId === 'pronto-agora').length;
  const emRisco = allEmployees.filter((e) => e.turnoverRisk && e.turnoverRisk.probability > 70).length;

  const kpis = [
    { label: 'Avaliações concluídas', valor: `${comAval}/${total}`, sub: `${Math.round((comAval / total) * 100)}% do ciclo`, status: 'green' },
    { label: 'Com PDI ativo', valor: `${comPdi}/${total}`, sub: `${Math.round((comPdi / total) * 100)}% adesão`, status: 'green' },
    { label: 'Aspiração compartilhada', valor: `${aspCompartilhada}/${total}`, sub: 'com líder direto', status: aspCompartilhada / total >= 0.5 ? 'green' : 'yellow' },
    { label: 'Em risco de saída', valor: `${emRisco}`, sub: emRisco > 0 ? 'requer atenção' : 'estável', status: emRisco > 0 ? 'red' : 'green' },
  ];

  // Próximos comitês (mock contextual coerente com agências fictícias)
  const proximosComites = [
    { agencia: 'Praça Central', data: '15 Mai 2026', preparacao: 75, casos: 6 },
    { agencia: 'Mirante', data: '22 Mai 2026', preparacao: 50, casos: 4 },
    { agencia: 'Jardim Botânico', data: '5 Jun 2026', preparacao: 20, casos: 5 },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Hero P&C */}
      <motion.div variants={item} className="card p-5 bg-gradient-to-r from-purple-50 to-white border-l-4 border-l-purple-400">
        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
          {hub.persona.cooperative || 'Cooperativa Convergência'}
        </p>
        <h2 className="text-lg font-bold text-gray-900 mt-1">Ciclo 1/2026 em curso</h2>
        <p className="text-sm text-gray-600 mt-1">
          {total} colaboradores · {comAval} avaliações concluídas · {emRisco}{' '}
          {emRisco === 1 ? 'pessoa requer atenção' : 'pessoas requerem atenção'}
        </p>
      </motion.div>

      {/* KPIs reais */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.valor}</p>
            <p
              className={`text-xs font-semibold mt-1 ${
                kpi.status === 'green'
                  ? 'text-green-600'
                  : kpi.status === 'red'
                  ? 'text-red-600'
                  : 'text-amber-600'
              }`}
            >
              {kpi.sub}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Próximos comitês */}
      <motion.div variants={item} className="card p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-600" />
          Próximos comitês de carreira
        </h3>
        <div className="space-y-2">
          {proximosComites.map((c) => (
            <div key={c.agencia} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{c.agencia}</p>
                <p className="text-[11px] text-gray-500">
                  {c.data} · {c.casos} casos em pauta
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-bold ${
                    c.preparacao >= 75 ? 'text-green-600' : c.preparacao >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}
                >
                  {c.preparacao}% preparado
                </p>
                <a
                  href="/comite-carreira"
                  className="text-[10px] text-verde-digital font-semibold hover:underline"
                >
                  Ver pauta →
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Theo Nudges P&C — vindos do hub */}
      <motion.div variants={item} className="space-y-3">
        {hub.nudges.map((n) => (
          <TheoCard
            key={n.id}
            title={n.titulo}
            description={n.descricao}
            cta={n.ctaLabel}
            ctaHref={n.ctaHref}
          />
        ))}
      </motion.div>

      {/* Ações Rápidas */}
      <motion.div variants={item} className="card p-5">
        <p className="text-sm font-semibold text-gray-500 mb-3">
          Acesse o Mapa de Talentos para visão consolidada →
        </p>
        <p className="text-sm text-gray-600">
          {prontosAgora > 0 && `${prontosAgora} pessoa(s) pronta(s) para movimentação · `}
          {comPdi}/{total} com PDI ativo · {aspCompartilhada}/{total} com aspiração compartilhada
        </p>
      </motion.div>
    </motion.div>
  );
}
