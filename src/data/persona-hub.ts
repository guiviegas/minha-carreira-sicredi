// ============================================================
// PERSONA HUB — Single Source of Truth
// ============================================================
// Consolida em UM objeto tudo que cada persona precisa para que
// as páginas exibam dados coerentes. Substitui acessos diretos
// a múltiplas fontes (employees, avaliacoes, pdi, roles, etc).
//
// Use sempre `getPersonaHub(persona.id)` em vez de ler dados
// soltos de outros arquivos.
// ============================================================

import { Persona, Employee, Role, Skill } from '@/types';
import { personas } from './personas';
import { employees, getEmployeeById, getTeamForLeader } from './employees';
import { roles, getRoleById } from './roles';
import { careerPaths, getPathsFromRole } from './career-paths';
import {
  competenciasSicredi,
  CompetenciaSicredi,
} from './competencias-sicredi';
import {
  avaliacoesMock,
  reguaPerformance,
  reguaProntidao,
  reguaPotencial,
  NivelPerformance,
  NivelProntidao,
  NivelPotencial,
  AvaliacaoCompetencia,
} from './elofy-config';
import { pdiData, PersonaPdi } from './pdi';
import { developmentTracks, DevelopmentTrack } from './development-tracks';
import { mentores, MentorProfile } from './mentoring';
import { experiencias, Experiencia } from './experiencias';

// ============================================================
// Types
// ============================================================

export interface CompetenciaSicrediHub {
  competencia: CompetenciaSicredi;
  /** Nota da auto-avaliação (1-4, mapeia régua de hashtags) */
  autoAvaliacao: 1 | 2 | 3 | 4;
  /** Nota do líder (1-4) */
  avaliacaoLider: 1 | 2 | 3 | 4;
  /** Consenso final (1-4) — fonte para todas as visualizações */
  consenso: 1 | 2 | 3 | 4;
  /** Conceito oficial (#mandoubem etc.) derivado do consenso */
  conceito: NivelPerformance;
  /** Consenso do ciclo imediatamente anterior (para delta) */
  consensoAnterior?: 1 | 2 | 3 | 4;
  /** Delta entre ciclo atual e anterior (-3 a +3). Positivo = subiu. */
  delta?: number;
  comentarioLider?: string;
}

export interface HabilidadeTecnicaHub {
  /** Skill da pessoa vinda de employee.skills */
  skill: Skill;
  /** Nível esperado para o cargo atual (vindo de role.requiredSkills) */
  nivelEsperadoCargoAtual: number;
  /** Nível esperado para o cargo-alvo (aspiração) */
  nivelEsperadoCargoAlvo: number;
  /** Diferença entre nível atual e esperado para cargo-alvo */
  gapAlvo: number;
}

export interface GapAlvoHub {
  /** 5 competências Jeito Sicredi com gap para o alvo */
  competenciasSicredi: Array<{
    competencia: CompetenciaSicredi;
    nivelAtual: 1 | 2 | 3 | 4;
    nivelEsperado: 1 | 2 | 3 | 4; // sempre 4 (#arrasou) para cargos de liderança
    gap: number;
    estaAtendido: boolean;
  }>;
  /** Habilidades técnicas com gap para o alvo */
  habilidadesTecnicas: HabilidadeTecnicaHub[];
  /** Prontidão estimada para o cargo-alvo (régua oficial Sicredi) */
  prontidaoEstimada: NivelProntidao;
  /** Tempo estimado descrito (vindo de aspiration.timeframe) */
  tempoEstimado: string;
  /** Score 0-100 só para uso interno em ordenações; UI deve usar prontidaoEstimada */
  scoreCompositoPrivado: number;
}

export interface TheoNudge {
  id: string;
  contexto: 'home' | 'pdi' | 'avaliacao' | 'gps' | 'equipe';
  titulo: string;
  descricao: string;
  ctaLabel: string;
  ctaHref?: string;
  tipo: 'sugestao' | 'alerta' | 'reconhecimento';
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface NotificacaoHub {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: 'info' | 'pendencia' | 'reconhecimento' | 'alerta';
  href?: string;
  lida: boolean;
}

export interface PersonaHub {
  persona: Persona;
  employee: Employee;
  cargoAtual: Role;
  cargoAlvo?: Role;
  // Régua única (vinda de elofy-config.ts) — usada por /perfil, /avaliacao, /pdi, GPS
  competenciasSicredi: CompetenciaSicrediHub[];
  notaFinalPerformance: NivelPerformance;
  prontidao?: NivelProntidao;
  potencial?: NivelPotencial;
  // Habilidades técnicas do cargo atual
  habilidadesTecnicas: HabilidadeTecnicaHub[];
  // PDI conectado
  pdi?: PersonaPdi;
  // Gap para o cargo-alvo (calculado em runtime)
  gapAlvo?: GapAlvoHub;
  // Recomendações geradas pelo gap
  trilhasRecomendadas: DevelopmentTrack[];
  experienciasRecomendadas: Experiencia[];
  mentoresSugeridos: MentorProfile[];
  // Theo nudges contextuais
  nudges: TheoNudge[];
  // Notificações
  notificacoes: NotificacaoHub[];
  // Equipe (apenas para líder)
  equipe?: Employee[];
}

// ============================================================
// Helpers internos
// ============================================================

function getConceitoFromNota(
  nota: 1 | 2 | 3 | 4,
): NivelPerformance {
  return reguaPerformance[nota - 1];
}

function getProntidaoById(id?: string): NivelProntidao | undefined {
  if (!id) return undefined;
  return reguaProntidao.find((r) => r.id === id);
}

function getPotencialById(id?: string): NivelPotencial | undefined {
  if (!id) return undefined;
  return reguaPotencial.find((r) => r.id === id);
}

function buildCompetenciasSicredi(
  employeeId: string,
): CompetenciaSicrediHub[] {
  const aval = avaliacoesMock.find(
    (a) => a.employeeId === employeeId && a.cicloId === 'ciclo-2026-1',
  );
  // Ciclo anterior (para delta)
  const cicloAnterior = avaliacoesMock
    .filter((a) => a.employeeId === employeeId && a.cicloId !== 'ciclo-2026-1')
    .sort((a, b) => b.cicloId.localeCompare(a.cicloId))[0];

  if (!aval) {
    return competenciasSicredi.map((c) => ({
      competencia: c,
      autoAvaliacao: 2,
      avaliacaoLider: 2,
      consenso: 2,
      conceito: getConceitoFromNota(2),
    }));
  }
  return competenciasSicredi.map((c) => {
    const evalComp = aval.competencias.find((x) => x.competenciaId === c.id);
    const auto = (evalComp?.autoAvaliacao ?? 2) as 1 | 2 | 3 | 4;
    const lider = (evalComp?.avaliacaoLider ?? 2) as 1 | 2 | 3 | 4;
    const consenso = (evalComp?.consenso ?? lider) as 1 | 2 | 3 | 4;

    const evalAnterior = cicloAnterior?.competencias.find((x) => x.competenciaId === c.id);
    const consensoAnterior = evalAnterior?.consenso as (1 | 2 | 3 | 4) | undefined;
    const delta = consensoAnterior !== undefined ? consenso - consensoAnterior : undefined;

    return {
      competencia: c,
      autoAvaliacao: auto,
      avaliacaoLider: lider,
      consenso,
      conceito: getConceitoFromNota(consenso),
      consensoAnterior,
      delta,
      comentarioLider: evalComp?.comentarioLider,
    };
  });
}

function buildHabilidadesTecnicas(
  employee: Employee,
  cargoAtual: Role,
  cargoAlvo?: Role,
): HabilidadeTecnicaHub[] {
  // Considera todas as skills da pessoa, mapeando contra os requiredSkills do cargo atual e alvo
  return employee.skills.map((skill) => {
    const reqAtual = cargoAtual.requiredSkills.find(
      (r) => r.skillId === skill.id,
    );
    const reqAlvo = cargoAlvo?.requiredSkills.find(
      (r) => r.skillId === skill.id,
    );
    const nivelEsperadoCargoAtual = reqAtual?.minLevel ?? 0;
    const nivelEsperadoCargoAlvo = reqAlvo?.minLevel ?? 0;
    const gapAlvo = Math.max(0, nivelEsperadoCargoAlvo - skill.level);
    return {
      skill,
      nivelEsperadoCargoAtual,
      nivelEsperadoCargoAlvo,
      gapAlvo,
    };
  });
}

function buildGapAlvo(
  competenciasSicredi: CompetenciaSicrediHub[],
  habilidadesTecnicas: HabilidadeTecnicaHub[],
  cargoAlvo: Role | undefined,
  timeframe: string | undefined,
): GapAlvoHub | undefined {
  if (!cargoAlvo) return undefined;

  // Para cargos de liderança, o esperado em todas as 5 competências é #mandoubem (3) ou #arrasou (4)
  // Heurística: cargos com level >= 5 (GA, GR, Diretor) esperam #arrasou (4); demais esperam #mandoubem (3)
  const esperadoComp: 3 | 4 = cargoAlvo.level >= 5 ? 4 : 3;

  const compsGap = competenciasSicredi.map((c) => {
    const nivelAtual = c.consenso;
    const nivelEsperado = esperadoComp;
    const gap = Math.max(0, nivelEsperado - nivelAtual);
    return {
      competencia: c.competencia,
      nivelAtual,
      nivelEsperado,
      gap,
      estaAtendido: gap === 0,
    };
  });

  // Filtra só as habilidades que têm requirement no cargo-alvo
  const habsRelevantes = habilidadesTecnicas.filter(
    (h) => h.nivelEsperadoCargoAlvo > 0,
  );

  // Score 0-100 simples para uso interno: % de competências atendidas + média de habilidades atendidas
  const compPctAtendido =
    (compsGap.filter((c) => c.estaAtendido).length / compsGap.length) * 100;
  const habPctAtendido =
    habsRelevantes.length > 0
      ? (habsRelevantes.filter((h) => h.gapAlvo === 0).length /
          habsRelevantes.length) *
        100
      : 100;
  const score = Math.round(0.5 * compPctAtendido + 0.5 * habPctAtendido);

  // Mapeia score para régua oficial de prontidão
  let prontidaoEstimada: NivelProntidao;
  if (score >= 90) prontidaoEstimada = reguaProntidao[0]; // pronto-agora
  else if (score >= 70) prontidaoEstimada = reguaProntidao[1]; // pronto-1-ano
  else if (score >= 40) prontidaoEstimada = reguaProntidao[2]; // em-desenvolvimento
  else prontidaoEstimada = reguaProntidao[3]; // inicio-jornada

  return {
    competenciasSicredi: compsGap,
    habilidadesTecnicas: habsRelevantes,
    prontidaoEstimada,
    tempoEstimado: timeframe ?? 'a definir',
    scoreCompositoPrivado: score,
  };
}

function buildTrilhasRecomendadas(
  cargoAtualId: string,
  cargoAlvoId: string | undefined,
  cargoAtual?: Role,
  cargoAlvo?: Role,
): DevelopmentTrack[] {
  // 1. Match exato: trilhas que partem do cargo atual OU terminam no cargo-alvo
  let recs = developmentTracks.filter(
    (t) => t.fromRoleId === cargoAtualId || (cargoAlvoId && t.toRoleId === cargoAlvoId),
  );
  if (recs.length >= 2) return recs.slice(0, 4);

  // 2. Mesma família (cargo atual ou cargo alvo)
  const familias = new Set<string>();
  if (cargoAtual?.family) familias.add(mapToTrackFamilia(cargoAtual.family));
  if (cargoAlvo?.family) familias.add(mapToTrackFamilia(cargoAlvo.family));
  const byFamily = developmentTracks.filter((t) => familias.has(t.familia));
  recs = [...recs, ...byFamily.filter((t) => !recs.includes(t))];
  if (recs.length >= 2) return recs.slice(0, 4);

  // 3. Trilhas de liderança são quase sempre relevantes (Mariana → GA, Roberto → Regional, etc.)
  const lideranca = developmentTracks.filter((t) => t.familia === 'lideranca');
  recs = [...recs, ...lideranca.filter((t) => !recs.includes(t))];
  if (recs.length >= 2) return recs.slice(0, 4);

  // 4. Fallback final: top 3 trilhas mais populares (todas)
  return [...recs, ...developmentTracks].slice(0, 4);
}

/** Heurística para mapear role.family → development-track familia */
function mapToTrackFamilia(roleFamily: string): 'negocios_pf' | 'negocios_pj' | 'negocios_agro' | 'lideranca' | 'geral' {
  if (roleFamily === 'negocios_pf') return 'negocios_pf';
  if (roleFamily === 'negocios_pj') return 'negocios_pj';
  if (roleFamily === 'negocios_agro') return 'negocios_agro';
  if (roleFamily === 'lideranca' || roleFamily === 'diretoria') return 'lideranca';
  return 'geral';
}

function buildExperienciasRecomendadas(
  cargoAlvo: Role | undefined,
): Experiencia[] {
  if (!cargoAlvo) return experiencias.slice(0, 4);
  // 1. Match por familiaAlvo
  const familyMatch = experiencias.filter((e) => e.familiaAlvo?.includes(cargoAlvo.family));
  if (familyMatch.length >= 3) return familyMatch.slice(0, 4);

  // 2. Para cargos de liderança, prioriza experiências de liderança (job shadow GA, mentoria reversa, etc.)
  if (cargoAlvo.family === 'lideranca' || cargoAlvo.family === 'diretoria') {
    const lider = experiencias.filter(
      (e) =>
        e.familiaAlvo?.includes('lideranca') ||
        e.tipo === 'job_shadow' ||
        e.tipo === 'comite' ||
        e.skills.some((s) => /lider|gest|estrat/i.test(s)),
    );
    if (lider.length > 0) {
      return [...new Set([...familyMatch, ...lider])].slice(0, 4);
    }
  }

  // 3. Fallback: completa com experiências sistêmicas (intercâmbio + projetos amplos)
  const fallback = experiencias.filter((e) => e.tipo === 'intercambio' || e.tipo === 'projeto');
  return [...new Set([...familyMatch, ...fallback])].slice(0, 4);
}

function buildMentoresSugeridos(cargoAlvo: Role | undefined): MentorProfile[] {
  const disponiveis = mentores.filter((m) => m.disponibilidade !== 'indisponivel');
  if (!cargoAlvo) return disponiveis.slice(0, 3);

  // 1. Match por keyword no cargo do mentor (ex.: cargo-alvo "Gerente de Agência" → mentores com "Gerente de Agência")
  const palavrasAlvo = cargoAlvo.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const matches = disponiveis.filter((m) =>
    palavrasAlvo.some((w) => m.cargo.toLowerCase().includes(w)),
  );
  if (matches.length >= 2) return matches.slice(0, 3);

  // 2. Match por especialidade (ex.: aspira liderança → mentor com especialidade em liderança/gestão)
  let keywords: string[] = [];
  if (cargoAlvo.family === 'lideranca' || cargoAlvo.family === 'diretoria') {
    keywords = ['lideran', 'gest', 'desenvolv'];
  } else if (cargoAlvo.family === 'negocios_pf') {
    keywords = ['carteira', 'pf', 'investiment'];
  } else if (cargoAlvo.family === 'negocios_pj') {
    keywords = ['pj', 'crédit', 'empresarial'];
  } else if (cargoAlvo.family === 'negocios_agro') {
    keywords = ['agro', 'rural'];
  } else if (cargoAlvo.family === 'pc') {
    keywords = ['pessoa', 'cultura', 'analytics'];
  }

  const bySpec = disponiveis.filter((m) =>
    m.especialidades.some((esp) => keywords.some((k) => esp.toLowerCase().includes(k))),
  );
  if (bySpec.length > 0) {
    return [...new Set([...matches, ...bySpec])].slice(0, 3);
  }

  // 3. Fallback: 3 mentores com melhor avaliação
  return [...disponiveis].sort((a, b) => b.avaliacaoMedia - a.avaliacaoMedia).slice(0, 3);
}

function buildNudges(
  personaId: string,
  competencias: CompetenciaSicrediHub[],
  cargoAlvo: Role | undefined,
  pdi: PersonaPdi | undefined,
): TheoNudge[] {
  const nudges: TheoNudge[] = [];

  // Nudge 1: competência mais fraca
  const fraca = [...competencias].sort(
    (a, b) => a.consenso - b.consenso,
  )[0];
  if (fraca && fraca.consenso <= 3 && cargoAlvo) {
    nudges.push({
      id: `nudge-fraca-${personaId}`,
      contexto: 'home',
      tipo: 'sugestao',
      prioridade: 'alta',
      titulo: `Foco: ${fraca.competencia.nome}`,
      descricao: `Sua avaliação ficou em ${fraca.conceito.hashtag}. Para ${cargoAlvo.title}, o esperado é #arrasou. Vale priorizar ações nessa competência.`,
      ctaLabel: 'Ver no GPS',
      ctaHref: '/mapa-carreira',
    });
  }

  // Nudge 2: PDI tem ação pendente
  if (pdi) {
    const pendente = pdi.actions.find((a) => a.status === 'pending');
    if (pendente) {
      nudges.push({
        id: `nudge-pdi-${personaId}`,
        contexto: 'home',
        tipo: 'sugestao',
        prioridade: 'media',
        titulo: 'Ação pendente no seu PDI',
        descricao: `${pendente.title}. Que tal começar essa semana?`,
        ctaLabel: 'Abrir PDI',
        ctaHref: '/pdi',
      });
    }
  }

  // Nudge 3: aspiração + mentoria
  if (cargoAlvo) {
    const mentor = buildMentoresSugeridos(cargoAlvo)[0];
    if (mentor) {
      nudges.push({
        id: `nudge-mentor-${personaId}`,
        contexto: 'home',
        tipo: 'sugestao',
        prioridade: 'media',
        titulo: `Mentor disponível: ${mentor.nome}`,
        descricao: `${mentor.cargo}. Já formou pessoas para ${cargoAlvo.title}. Vale uma conversa.`,
        ctaLabel: 'Pedir mentoria',
        ctaHref: '/sicreder2sicreder',
      });
    }
  }

  return nudges;
}

function buildNotificacoes(
  personaId: string,
  pdi: PersonaPdi | undefined,
): NotificacaoHub[] {
  const out: NotificacaoHub[] = [];

  if (personaId === 'mariana') {
    out.push(
      {
        id: 'notif-m-1',
        tipo: 'pendencia',
        titulo: 'Auto-avaliação Q3 em aberto',
        descricao: 'O ciclo Q3/2026 abriu. Você ainda não preencheu sua auto-avaliação.',
        data: 'há 2 dias',
        href: '/avaliacao',
        lida: false,
      },
      {
        id: 'notif-m-2',
        tipo: 'info',
        titulo: 'Papo Reto com Roberto agendado',
        descricao: 'Quinta-feira às 14h. Theo já preparou pontos sugeridos.',
        data: 'há 4 dias',
        href: '/parceiro-jornada',
        lida: false,
      },
      {
        id: 'notif-m-3',
        tipo: 'reconhecimento',
        titulo: 'Seu líder reconheceu você',
        descricao: 'Roberto deu #arrasou em #GENTE QUE ENTENDE DE GENTE na última conversa.',
        data: 'há 1 semana',
        href: '/avaliacao',
        lida: true,
      },
    );
  } else if (personaId === 'roberto') {
    out.push(
      {
        id: 'notif-r-1',
        tipo: 'alerta',
        titulo: 'Risco de turnover na equipe',
        descricao: 'Juliana está com sinais críticos: priorizar Papo Reto esta semana.',
        data: 'hoje',
        href: '/equipe',
        lida: false,
      },
      {
        id: 'notif-r-2',
        tipo: 'pendencia',
        titulo: 'Comitê de Carreira em 7 dias',
        descricao: 'Faltam 3 One Pages para preparar.',
        data: 'há 1 dia',
        href: '/comite-carreira',
        lida: false,
      },
      {
        id: 'notif-r-3',
        tipo: 'pendencia',
        titulo: 'Promoção pendente: Pedro',
        descricao: 'A janela de Mérito de Pedro está aberta. Aprovar ou pedir mais informações.',
        data: 'há 3 dias',
        href: '/gestao-desempenho',
        lida: false,
      },
    );
  } else if (personaId === 'carla') {
    out.push(
      {
        id: 'notif-c-1',
        tipo: 'alerta',
        titulo: 'PDI bloco vencido',
        descricao: '5 PDIs sem revisão há mais de 90 dias.',
        data: 'hoje',
        href: '/dashboard-pc',
        lida: false,
      },
      {
        id: 'notif-c-2',
        tipo: 'alerta',
        titulo: 'Sucessão GA crítica',
        descricao: 'GA Trainee tem apenas 1 sucessor mapeado.',
        data: 'há 2 dias',
        href: '/mapa-talentos',
        lida: false,
      },
      {
        id: 'notif-c-3',
        tipo: 'info',
        titulo: 'Vaga estratégica há 60 dias',
        descricao: 'Vaga de GN PJ III aberta na Praça Central sem candidatos elegíveis.',
        data: 'há 1 semana',
        href: '/marketplace',
        lida: true,
      },
    );
  }

  // Adiciona notificação de PDI próximo (se houver check-in agendado)
  if (pdi) {
    const proxCheckIn = pdi.checkIns.find((c) => c.type === 'scheduled');
    if (proxCheckIn) {
      out.push({
        id: `notif-pdi-${personaId}`,
        tipo: 'info',
        titulo: 'Próximo check-in de PDI',
        descricao: `Com ${proxCheckIn.leaderName} em ${proxCheckIn.date}.`,
        data: 'agendado',
        href: '/pdi',
        lida: true,
      });
    }
  }

  return out;
}

// ============================================================
// Função principal — getPersonaHub
// ============================================================

export function getPersonaHub(personaId: string): PersonaHub | null {
  const persona = personas.find((p) => p.id === personaId);
  if (!persona) return null;
  const employee = getEmployeeById(persona.employeeId);
  if (!employee) return null;
  const cargoAtual = getRoleById(employee.roleId);
  if (!cargoAtual) return null;

  const cargoAlvoId = employee.aspirations[0]?.targetRoleId;
  const cargoAlvo = cargoAlvoId ? getRoleById(cargoAlvoId) : undefined;
  const timeframe = employee.aspirations[0]?.timeframe;

  const competenciasSicrediHub = buildCompetenciasSicredi(employee.id);
  const habilidadesTecnicas = buildHabilidadesTecnicas(
    employee,
    cargoAtual,
    cargoAlvo,
  );

  const aval = avaliacoesMock.find(
    (a) => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1',
  );
  const notaFinalPerformance = aval
    ? getConceitoFromNota(aval.notaFinalPerformance)
    : getConceitoFromNota(2);
  const prontidao = getProntidaoById(aval?.prontidaoId);
  const potencial = getPotencialById(aval?.potencialId);

  const pdi = pdiData[personaId];

  const gapAlvo = buildGapAlvo(
    competenciasSicrediHub,
    habilidadesTecnicas,
    cargoAlvo,
    timeframe,
  );

  const trilhasRecomendadas = buildTrilhasRecomendadas(
    cargoAtual.id,
    cargoAlvo?.id,
    cargoAtual,
    cargoAlvo,
  );
  const experienciasRecomendadas = buildExperienciasRecomendadas(cargoAlvo);
  const mentoresSugeridos = buildMentoresSugeridos(cargoAlvo);
  const nudges = buildNudges(
    personaId,
    competenciasSicrediHub,
    cargoAlvo,
    pdi,
  );
  const notificacoes = buildNotificacoes(personaId, pdi);

  const equipe =
    persona.role === 'lider'
      ? getTeamForLeader(employee.id)
      : undefined;

  return {
    persona,
    employee,
    cargoAtual,
    cargoAlvo,
    competenciasSicredi: competenciasSicrediHub,
    notaFinalPerformance,
    prontidao,
    potencial,
    habilidadesTecnicas,
    pdi,
    gapAlvo,
    trilhasRecomendadas,
    experienciasRecomendadas,
    mentoresSugeridos,
    nudges,
    notificacoes,
    equipe,
  };
}

// ============================================================
// Helpers públicos para uso direto em pages/components
// ============================================================

/** Obtém hub a partir do `persona.id` direto */
export function useHubFromPersona(persona: Persona | null): PersonaHub | null {
  if (!persona) return null;
  return getPersonaHub(persona.id);
}

/** Próximos cargos acessíveis a partir do cargo atual (próximos passos) */
export function getProximosPassos(cargoAtualId: string): Role[] {
  return getPathsFromRole(cargoAtualId)
    .map((p) => getRoleById(p.toRoleId))
    .filter((r): r is Role => !!r);
}

/** Movimentações laterais (mesmo nível, família diferente) */
export function getMovimentacoesLaterais(cargoAtual: Role): Role[] {
  return roles.filter(
    (r) =>
      r.id !== cargoAtual.id &&
      r.level === cargoAtual.level &&
      r.family !== cargoAtual.family &&
      r.family !== 'central' &&
      r.family !== 'cas' &&
      r.family !== 'fundacao',
  );
}

/** Trilhas estratégicas backoffice → negócios */
export function getTrilhasEstrategicas(cargoAtual: Role): Role[] {
  // Apenas cargos de negócio, e só se a pessoa NÃO está em negócio
  const familiaAtual = cargoAtual.family;
  const ehBackoffice =
    familiaAtual === 'operacoes' ||
    familiaAtual === 'administrativo' ||
    familiaAtual === 'atendimento';
  if (!ehBackoffice) return [];
  return roles.filter(
    (r) =>
      r.family === 'negocios' ||
      r.family === 'negocios_pf' ||
      r.family === 'negocios_pj' ||
      r.family === 'negocios_agro',
  );
}
