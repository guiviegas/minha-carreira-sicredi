// ==========================================
// ELOFY CONFIG — Régua de Avaliação de Desempenho
// Espelha a ferramenta Elofy usada pelo Sicredi
// ==========================================

// --- Escala de Conceitos — Régua oficial Sicredi (via Elofy) ---
// Cores e descrições conforme material oficial: Desempenho_Avaliação.pptx (slide 5)
// Valores numéricos da escala: FASE 5 'realizando as avaliações' do +evolução
//   #precisa evoluir → 0,01 a 0,79
//   #quase lá        → 0,80 a 0,99
//   #mandou bem      → 1,00 a 1,10
//   #arrasou         → 1,11 a 1,20
export interface NivelPerformance {
  nivel: 1 | 2 | 3 | 4;
  hashtag: string;
  nome: string;
  descricao: string;
  cor: string;
  bgCor: string;
  icone: string;
  /** Faixa numérica oficial dentro do quadrante (Elofy) */
  notaMinima: number;
  notaMaxima: number;
}

export const reguaPerformance: NivelPerformance[] = [
  {
    nivel: 1,
    hashtag: '#precisa evoluir',
    nome: '#precisa evoluir',
    descricao: 'Precisa evoluir aplicando na prática os comportamentos descritos.',
    // Laranja oficial (não vermelho)
    cor: '#EA580C',
    bgCor: '#FFEDD5',
    icone: 'alert-triangle',
    notaMinima: 0.01,
    notaMaxima: 0.79,
  },
  {
    nivel: 2,
    hashtag: '#quase lá',
    nome: '#quase lá',
    descricao: 'Está em desenvolvimento. Pratica o comportamento descrito em algumas situações.',
    // Azul/ciano oficial (não amarelo)
    cor: '#0EA5E9',
    bgCor: '#E0F2FE',
    icone: 'trending-up',
    notaMinima: 0.80,
    notaMaxima: 0.99,
  },
  {
    nivel: 3,
    hashtag: '#mandou bem',
    nome: '#mandou bem',
    descricao: 'Pratica o comportamento descrito em todas as situações do dia a dia.',
    cor: '#16A34A',
    bgCor: '#DCFCE7',
    icone: 'check-circle',
    notaMinima: 1.00,
    notaMaxima: 1.10,
  },
  {
    nivel: 4,
    hashtag: '#arrasou',
    nome: '#arrasou',
    descricao:
      'Pratica o comportamento descrito e, em alguns casos, vai além do que é esperado, sendo referência do comportamento para os colegas.',
    // Rosa/magenta oficial (não azul)
    cor: '#E11D48',
    bgCor: '#FFE4E6',
    icone: 'star',
    notaMinima: 1.11,
    notaMaxima: 1.20,
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

  // ===== Equipe Roberto — preenchimento dos colaboradores =====
  // Juliana Pereira (emp-101) — risco de turnover, sinal de #precisa evoluir
  {
    id: 'aval-101',
    employeeId: 'emp-101',
    cicloId: 'ciclo-2026-1',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 2, avaliacaoLider: 2, consenso: 2 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 2, avaliacaoLider: 2, consenso: 2 },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 2, avaliacaoLider: 1, consenso: 2, comentarioLider: 'Carteira tem caído no semestre. Precisamos retomar a régua de captação.' },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 3, avaliacaoLider: 2, consenso: 2 },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 2, avaliacaoLider: 2, consenso: 2 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 2, avaliacaoLider: 2, consenso: 2 },
    ],
    notaFinalPerformance: 2,
    prontidaoId: 'inicio-jornada',
    potencialId: 'fortelecer',
    feedbacks: [
      'Sinais de desengajamento — agendar conversa de retenção esta semana.',
      'Pode estar no segmento errado — explorar transição para PJ.',
    ],
    pontosFortes: ['Faz o Certo'],
    pontosDesenvolvimento: ['Engajamento', 'Captação', 'Visão de carteira'],
    status: 'concluido',
  },

  // André Moreira (emp-111) — GN Agro, sólido
  {
    id: 'aval-111',
    employeeId: 'emp-111',
    cicloId: 'ciclo-2026-1',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4, comentarioLider: 'Excelente leitura do produtor rural — referência da agência.' },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
    ],
    notaFinalPerformance: 3,
    prontidaoId: 'pronto-1ano',
    potencialId: 'crescer',
    feedbacks: [
      'Resultados consistentes em crédito rural — Top 1 da agência em volume.',
      'Pronto para assumir carteiras maiores no próximo ciclo.',
    ],
    pontosFortes: ['Entende de Gente', 'Gera Prosperidade', 'Faz o Certo', 'Gera Confiança'],
    pontosDesenvolvimento: ['Visão sistêmica', 'Liderança informal'],
    status: 'concluido',
  },

  // Pedro Almeida (emp-106) — GN PJ, alto desempenho
  {
    id: 'aval-106',
    employeeId: 'emp-106',
    cicloId: 'ciclo-2026-1',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 3, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4, comentarioLider: 'Estourou meta de PJ no trimestre. Excelente capacidade de prospecção.' },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 4, avaliacaoLider: 3, consenso: 4 },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 3, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
    ],
    notaFinalPerformance: 4,
    prontidaoId: 'pronto-agora',
    potencialId: 'acelerar',
    feedbacks: [
      'Performance #arrasou — pronto para movimentação imediata.',
      'Avaliar promoção para GN PJ Senior ou trilha de liderança.',
    ],
    pontosFortes: ['Faz Junto', 'Entende de Gente', 'Gera Prosperidade', 'Gera Confiança'],
    pontosDesenvolvimento: ['Visão de longo prazo'],
    status: 'concluido',
  },

  // Fernanda Rocha (emp-109) — Backoffice, evoluindo bem
  {
    id: 'aval-109',
    employeeId: 'emp-109',
    cicloId: 'ciclo-2026-1',
    competencias: [
      { competenciaId: 'gente-que-faz-junto', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-entende-de-gente', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-gera-prosperidade', autoAvaliacao: 2, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-que-evolui', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4, comentarioLider: 'Sempre propondo automatizações. Brilha em melhoria de processos.' },
      { competenciaId: 'gente-que-faz-o-certo', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
      { competenciaId: 'gente-que-gera-confianca', autoAvaliacao: 3, avaliacaoLider: 3, consenso: 3 },
      { competenciaId: 'gente-com-quem-contar', autoAvaliacao: 4, avaliacaoLider: 4, consenso: 4 },
    ],
    notaFinalPerformance: 3,
    prontidaoId: 'em-desenvolvimento',
    potencialId: 'crescer',
    feedbacks: [
      'Talento de operações com perfil para transição para negócios.',
      'Recomendar trilha Operações → Assistente de Negócios.',
    ],
    pontosFortes: ['Faz Junto', 'Evolui', 'Faz o Certo', 'Com Quem Contar'],
    pontosDesenvolvimento: ['Conhecimento de produtos', 'Visão comercial'],
    status: 'concluido',
  },

  // Carlos Eduardo (emp-104) — JOVEM/JUNIOR, deixar SEM avaliação intencionalmente
];

// --- Links externos ---
export const ELOFY_URL = 'https://app.elofy.com.br';
export const SICREDI_APRENDE_URL = 'https://sicrediaprende.com.br';
export const GUPY_URL = 'https://sicredi.gupy.io';
