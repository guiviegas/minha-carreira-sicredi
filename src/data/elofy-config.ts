// ==========================================
// ELOFY CONFIG — Régua de Avaliação de Desempenho
// Espelha a ferramenta Elofy usada pelo Sicredi
// ==========================================

// --- Escala de Conceitos — Régua Sicredi (via Elofy) ---
export interface NivelPerformance {
  nivel: 1 | 2 | 3 | 4;
  hashtag: string;
  nome: string;
  descricao: string;
  cor: string;
  bgCor: string;
  icone: string;
}

export const reguaPerformance: NivelPerformance[] = [
  {
    nivel: 1,
    hashtag: '#precisaevoluir',
    nome: '#precisaevoluir',
    descricao: 'Precisa evoluir aplicando na prática os comportamentos descritos.',
    cor: '#DC2626',
    bgCor: '#FEF2F2',
    icone: 'alert-triangle',
  },
  {
    nivel: 2,
    hashtag: '#quaselá',
    nome: '#quaselá',
    descricao: 'Em desenvolvimento. Pratica em algumas situações.',
    cor: '#D97706',
    bgCor: '#FFFBEB',
    icone: 'trending-up',
  },
  {
    nivel: 3,
    hashtag: '#mandoubem',
    nome: '#mandoubem',
    descricao: 'Pratica o comportamento descrito em todas as situações do dia a dia.',
    cor: '#16A34A',
    bgCor: '#F0FDF4',
    icone: 'check-circle',
  },
  {
    nivel: 4,
    hashtag: '#arrasou',
    nome: '#arrasou',
    descricao: 'Pratica o comportamento e, em alguns casos, vai além, sendo referência para os colegas.',
    cor: '#2563EB',
    bgCor: '#EFF6FF',
    icone: 'star',
  },
];

// --- Régua de Prontidão (para cargo aspirado) ---
export interface NivelProntidao {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  bgCor: string;
  icone: string;
}

export const reguaProntidao: NivelProntidao[] = [
  {
    id: 'pronto-agora',
    nome: 'Pronto agora',
    descricao: 'Atende todos os requisitos do cargo aspirado. Pode assumir imediatamente.',
    cor: '#16A34A',
    bgCor: '#F0FDF4',
    icone: 'check-circle-2',
  },
  {
    id: 'pronto-1-ano',
    nome: 'Pronto em 1 ano',
    descricao: 'Gaps pequenos e bem mapeados. Caminho claro com ações de desenvolvimento definidas.',
    cor: '#2563EB',
    bgCor: '#EFF6FF',
    icone: 'clock',
  },
  {
    id: 'em-desenvolvimento',
    nome: 'Em desenvolvimento',
    descricao: 'Gaps significativos, mas em trilha de desenvolvimento ativa. Precisa de experiências complementares.',
    cor: '#D97706',
    bgCor: '#FFFBEB',
    icone: 'trending-up',
  },
  {
    id: 'inicio-jornada',
    nome: 'Início da jornada',
    descricao: 'Ainda distante do cargo aspirado. Fase exploratória com muito a desenvolver.',
    cor: '#6B7280',
    bgCor: '#F3F4F6',
    icone: 'compass',
  },
];

// --- Régua de Potencial (visão do líder + sistema) ---
export interface NivelPotencial {
  id: string;
  nome: string;
  label: string;
  descricao: string;
  cor: string;
  bgCor: string;
}

export const reguaPotencial: NivelPotencial[] = [
  {
    id: 'acelerar',
    nome: 'Alto',
    label: 'Acelerar',
    descricao: 'Potencial para 2+ níveis acima. Deve ser acelerado com experiências desafiadoras.',
    cor: '#2563EB',
    bgCor: '#EFF6FF',
  },
  {
    id: 'crescer',
    nome: 'Médio',
    label: 'Crescer',
    descricao: 'Potencial para o próximo nível. Em trilha de crescimento com apoio do líder.',
    cor: '#16A34A',
    bgCor: '#F0FDF4',
  },
  {
    id: 'fortalecer',
    nome: 'Consolidar',
    label: 'Fortalecer',
    descricao: 'Consolidando no cargo atual. Foco em dominar plenamente as competências do nível.',
    cor: '#D97706',
    bgCor: '#FFFBEB',
  },
];

// --- Ciclo de Avaliação ---
export interface CicloAvaliacao {
  id: string;
  nome: string;
  periodo: string;
  status: 'ativo' | 'encerrado' | 'planejado';
  ano: number;
  dataInicio: string;
  dataFim: string;
}

export const ciclosAvaliacao: CicloAvaliacao[] = [
  {
    id: 'ciclo-2026-1',
    nome: 'Ciclo 1/2026',
    periodo: 'Jan-Jun 2026',
    status: 'ativo',
    ano: 2026,
    dataInicio: '2026-01-01',
    dataFim: '2026-06-30',
  },
  {
    id: 'ciclo-2025-2',
    nome: 'Ciclo 2/2025',
    periodo: 'Jul-Dez 2025',
    status: 'encerrado',
    ano: 2025,
    dataInicio: '2025-07-01',
    dataFim: '2025-12-31',
  },
  {
    id: 'ciclo-2025-1',
    nome: 'Ciclo 1/2025',
    periodo: 'Jan-Jun 2025',
    status: 'encerrado',
    ano: 2025,
    dataInicio: '2025-01-01',
    dataFim: '2025-06-30',
  },
];

// --- Avaliação de Competência por Colaborador ---
export interface AvaliacaoCompetencia {
  competenciaId: string;
  autoAvaliacao: 1 | 2 | 3 | 4;
  avaliacaoLider: 1 | 2 | 3 | 4;
  consenso?: 1 | 2 | 3 | 4;
  comentarioLider?: string;
}

export interface AvaliacaoCiclo {
  id: string;
  employeeId: string;
  cicloId: string;
  competencias: AvaliacaoCompetencia[];
  notaFinalPerformance: 1 | 2 | 3 | 4;
  prontidaoId?: string;
  potencialId?: string;
  feedbacks: string[];
  pontosFortes: string[];
  pontosDesenvolvimento: string[];
  status: 'pendente' | 'autoavaliacao' | 'avaliacao_lider' | 'consenso' | 'concluido';
}

// --- Dados mock de avaliações ---
// Competências oficiais Jeito Sicredi de Ser (7) — IDs em sync com competencias-sicredi.ts
export const avaliacoesMock: AvaliacaoCiclo[] = [
  // Mariana — Ciclo ativo
  {
    id: 'aval-001',
    employeeId: 'emp-001',
    cicloId: 'ciclo-2026-1',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 4, avaliacaoLider: 3, consenso: 4 },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 3, avaliacaoLider: 2, consenso: 3, comentarioLider: 'Pode explorar mais soluções digitais e novas abordagens no atendimento' },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
    ],
    notaFinalPerformance: 3,
    prontidaoId: 'em-desenvolvimento',
    potencialId: 'crescer',
    feedbacks: [
      'Excelente no relacionamento com associados, Top 3 em satisfação',
      'Precisa desenvolver mais visão estratégica para o próximo cargo',
    ],
    pontosFortes: ['Faz Junto', 'Faz o Certo', 'Gera Confiança'],
    pontosDesenvolvimento: ['Evoluir digitalmente', 'Liderança de pessoas', 'Visão estratégica'],
    status: 'concluido',
  },
  // Mariana — Ciclo anterior
  {
    id: 'aval-002',
    employeeId: 'emp-001',
    cicloId: 'ciclo-2025-2',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 2, avaliacaoLider: 2, consenso: 2 },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 3, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 2, avaliacaoLider: 3, consenso: 3 },
    ],
    notaFinalPerformance: 3,
    prontidaoId: 'em-desenvolvimento',
    potencialId: 'crescer',
    feedbacks: ['Evolução muito boa no semestre', 'Boa referência de atendimento'],
    pontosFortes: ['Faz o Certo', 'Faz Junto'],
    pontosDesenvolvimento: ['Evolui (digital)', 'Disponibilidade'],
    status: 'concluido',
  },
  // Roberto — Ciclo ativo
  {
    id: 'aval-003',
    employeeId: 'emp-002',
    cicloId: 'ciclo-2026-1',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 2, avaliacaoLider: 2, consenso: 2, comentarioLider: 'Resistência a novas ferramentas digitais e abordagens modernas' },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
    ],
    notaFinalPerformance: 3,
    prontidaoId: 'em-desenvolvimento',
    potencialId: 'crescer',
    feedbacks: [
      'Veterano com forte cultura cooperativista',
      'Precisa se atualizar em ferramentas digitais e gestão moderna',
    ],
    pontosFortes: ['Faz Junto', 'Gera Confiança', 'Faz o Certo'],
    pontosDesenvolvimento: ['Evolui (digital)', 'Gestão por dados'],
    status: 'concluido',
  },
];

// --- Links externos ---
export const ELOFY_URL = 'https://app.elofy.com.br';
export const SICREDI_APRENDE_URL = 'https://sicrediaprende.com.br';
export const GUPY_URL = 'https://sicredi.gupy.io';
