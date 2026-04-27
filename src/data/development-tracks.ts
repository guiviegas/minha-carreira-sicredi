// ============================================================
// DEVELOPMENT TRACKS: Structured career transition tracks
// ============================================================

export interface TrackCourse {
  id: string;
  title: string;
  type: 'video' | 'interactive' | 'mentoring' | 'practice' | 'certification' | 'assessment';
  duration: string;
  provider: string;
  completed: boolean;
}

export interface TrackPhase {
  id: string;
  name: string;
  description: string;
  courses: TrackCourse[];
  progress: number; // 0-100
}

export interface DevelopmentTrack {
  id: string;
  fromRoleId: string;
  toRoleId: string;
  title: string;
  subtitle: string;
  totalDuration: string;
  certification?: string;
  certificationRequired?: boolean;
  phases: TrackPhase[];
  progress: number; // overall 0-100
  type: 'vertical' | 'lateral' | 'leadership';
  familia: 'negocios_pf' | 'negocios_pj' | 'negocios_agro' | 'lideranca' | 'geral';
}

// ============================================================
// TRACK DATA: Business-focused career tracks
// ============================================================

export const developmentTracks: DevelopmentTrack[] = [
  // ── Assist. Neg → GN PF I ──────────────────────────────
  {
    id: 'track-assist-pf1',
    fromRoleId: 'role-assistente-negocios',
    toRoleId: 'role-gn-pf1',
    title: 'Trilha para GN PF I',
    subtitle: 'Fundamentos de negócios e certificação CPA-10',
    totalDuration: '118h',
    certification: 'CPA-10',
    certificationRequired: true,
    type: 'vertical',
    familia: 'negocios_pf',
    progress: 0,
    phases: [
      {
        id: 'p1', name: 'Fundamentos Comerciais', description: 'Prospecção, abordagem e perfil do associado PF',
        progress: 0,
        courses: [
          { id: 'tc-1a', title: 'Prospecção Ativa e Captação', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-1b', title: 'Técnicas de Abordagem Consultiva', type: 'interactive', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-1c', title: 'Perfil do Associado PF: Necessidades e Ciclo de Vida', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p2', name: 'Certificação CPA-10', description: 'Preparatório completo para certificação ANBIMA',
        progress: 0,
        courses: [
          { id: 'tc-2a', title: 'Módulo 1: Sistema Financeiro Nacional', type: 'video', duration: '5h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-2b', title: 'Módulo 2: Ética e Regulamentação', type: 'video', duration: '4h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-2c', title: 'Módulo 3: Produtos de Investimento', type: 'video', duration: '6h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-2d', title: 'Simulados CPA-10', type: 'certification', duration: '5h', provider: 'ANBIMA', completed: false },
        ],
      },
      {
        id: 'p3', name: 'Gestão de Carteira I', description: 'Organização, cross-selling e indicadores de carteira',
        progress: 0,
        courses: [
          { id: 'tc-3a', title: 'Organização de Agenda e Rotina do GN', type: 'interactive', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-3b', title: 'Cross-selling: Ofertas Integradas', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-3c', title: 'Indicadores de Carteira PF', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p4', name: 'Cooperativismo Aplicado', description: 'Valores cooperativos aplicados ao negócio',
        progress: 0,
        courses: [
          { id: 'tc-4a', title: 'Cultura Cooperativista na Prática (#GENTE QUE FAZ JUNTO)', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-4b', title: 'Escuta Ativa para Atendimento (#GENTE QUE ENTENDE DE GENTE)', type: 'interactive', duration: '2h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
    ],
  },

  // ── GN PF I → GN PF II ──────────────────────────────
  {
    id: 'track-pf1-pf2',
    fromRoleId: 'role-gn-pf1',
    toRoleId: 'role-gn-pf2',
    title: 'Trilha para GN PF II',
    subtitle: 'Crédito, CPA-20 e negociação avançada',
    totalDuration: '47h',
    certification: 'CPA-20',
    certificationRequired: true,
    type: 'vertical',
    familia: 'negocios_pf',
    progress: 0,
    phases: [
      {
        id: 'p1', name: 'Análise de Crédito PF', description: 'Avaliação de risco, spread e garantias',
        progress: 0,
        courses: [
          { id: 'tc-5a', title: 'Análise de Risco PF: Score e Capacidade', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-5b', title: 'Spread, Precificação e Garantias', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-5c', title: 'Estudo de Caso: Crédito Consignado e Pessoal', type: 'practice', duration: '2h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p2', name: 'Certificação CPA-20', description: 'Preparatório avançado ANBIMA',
        progress: 0,
        courses: [
          { id: 'tc-6a', title: 'Derivativos e Renda Variável', type: 'video', duration: '8h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-6b', title: 'Gestão de Risco e Compliance', type: 'video', duration: '6h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-6c', title: 'Tributação de Investimentos', type: 'video', duration: '4h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-6d', title: 'Simulados CPA-20', type: 'certification', duration: '7h', provider: 'ANBIMA', completed: false },
        ],
      },
      {
        id: 'p3', name: 'Negociação Avançada', description: 'Técnicas de negociação e proposta de valor',
        progress: 0,
        courses: [
          { id: 'tc-7a', title: 'Método SCII para Negociação', type: 'mentoring', duration: '3h', provider: 'Programa S2S', completed: false },
          { id: 'tc-7b', title: 'Gestão de Objeções e Fechamento', type: 'interactive', duration: '3h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p4', name: 'Investimentos Intermediário', description: 'Fundos, previdência e renda fixa avançada',
        progress: 0,
        courses: [
          { id: 'tc-8a', title: 'Fundos de Investimento: Classes e Estratégias', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-8b', title: 'Previdência: PGBL, VGBL e Planejamento', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-8c', title: 'LCI, LCA, CDB e Debêntures', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
    ],
  },

  // ── GN PF II → GN PF III ──────────────────────────────
  {
    id: 'track-pf2-pf3',
    fromRoleId: 'role-gn-pf2',
    toRoleId: 'role-gn-pf3',
    title: 'Trilha para GN PF III',
    subtitle: 'Carteira alta renda, CEA e liderança informal',
    totalDuration: '48h',
    certification: 'CEA',
    certificationRequired: false,
    type: 'vertical',
    familia: 'negocios_pf',
    progress: 35,
    phases: [
      {
        id: 'p1', name: 'Carteira Alta Renda', description: 'Segmentação premium e wealth planning',
        progress: 60,
        courses: [
          { id: 'tc-9a', title: 'Segmentação Premium: Perfil e Necessidades', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: true },
          { id: 'tc-9b', title: 'Wealth Planning: Planejamento Patrimonial', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: true },
          { id: 'tc-9c', title: 'Assessoria Consultiva para Alta Renda', type: 'mentoring', duration: '2h', provider: 'Programa S2S', completed: false },
        ],
      },
      {
        id: 'p2', name: 'Liderança Informal', description: 'Mentoria de pares e referência técnica',
        progress: 50,
        courses: [
          { id: 'tc-10a', title: 'Mentoria de Pares: Como Ser Referência', type: 'mentoring', duration: '3h', provider: 'Programa S2S', completed: true },
          { id: 'tc-10b', title: 'Formação de Equipe Comercial', type: 'interactive', duration: '3h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p3', name: 'Certificação CEA', description: 'Especialização em investimentos (opcional, diferencial)',
        progress: 0,
        courses: [
          { id: 'tc-11a', title: 'CEA: Planejamento Financeiro', type: 'video', duration: '10h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-11b', title: 'CEA: Alocação de Ativos', type: 'video', duration: '10h', provider: 'Preparatório ANBIMA', completed: false },
          { id: 'tc-11c', title: 'CEA: Simulados e Revisão', type: 'certification', duration: '10h', provider: 'ANBIMA', completed: false },
        ],
      },
      {
        id: 'p4', name: 'Planejamento Estratégico', description: 'Metas da agência e indicadores de resultado',
        progress: 30,
        courses: [
          { id: 'tc-12a', title: 'OKRs e Planejamento Estratégico', type: 'interactive', duration: '2h', provider: 'Sicredi Aprende', completed: true },
          { id: 'tc-12b', title: 'Indicadores de Resultado da Agência', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
    ],
  },

  // ── GN PF III/IV → Gerente de Agência ──────────────────
  {
    id: 'track-pf-ga',
    fromRoleId: 'role-gn-pf3',
    toRoleId: 'role-gerente-agencia',
    title: 'Trilha para Gerente de Agência',
    subtitle: 'Liderança, gestão e governança cooperativa',
    totalDuration: '196h',
    type: 'leadership',
    familia: 'lideranca',
    progress: 15,
    phases: [
      {
        id: 'p1', name: 'Liderança de Pessoas', description: 'Feedback, 1:1 e desenvolvimento de equipe',
        progress: 30,
        courses: [
          { id: 'tc-13a', title: 'Feedback SCII: Situação, Comportamento, Impacto', type: 'mentoring', duration: '4h', provider: 'Programa S2S', completed: true },
          { id: 'tc-13b', title: '1:1 Eficaz: Estrutura e Prática', type: 'interactive', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-13c', title: 'PDI da Equipe: Como Desenvolver Pessoas', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-13d', title: 'Gestão de Conflitos e Diversidade', type: 'mentoring', duration: '2h', provider: 'Programa S2S', completed: false },
        ],
      },
      {
        id: 'p2', name: 'Gestão de Agência', description: 'P&L, indicadores e compliance',
        progress: 0,
        courses: [
          { id: 'tc-14a', title: 'P&L da Agência: Receita, Custo e Margem', type: 'video', duration: '4h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-14b', title: 'Indicadores Operacionais: NPS, TMA, Produtividade', type: 'interactive', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-14c', title: 'Compliance e Prevenção à Lavagem de Dinheiro', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p3', name: 'Governança Cooperativa', description: 'Assembleia, conselho e papel do dirigente',
        progress: 0,
        courses: [
          { id: 'tc-15a', title: 'Governança Cooperativa: Estrutura e Papéis', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-15b', title: 'Estatuto e Regimento: Direitos e Deveres', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-15c', title: 'Relação com Conselho e Dirigentes', type: 'mentoring', duration: '1h', provider: 'Programa S2S', completed: false },
        ],
      },
      {
        id: 'p4', name: 'Assessment de Prontidão', description: 'Simulação de gestão e painel avaliador',
        progress: 0,
        courses: [
          { id: 'tc-16a', title: 'Business Case: Simulação de Gestão', type: 'assessment', duration: '4h', provider: 'Avaliação Interna', completed: false },
          { id: 'tc-16b', title: 'Painel Avaliador: Apresentação e Feedback', type: 'assessment', duration: '4h', provider: 'Avaliação Interna', completed: false },
        ],
      },
      {
        id: 'p5', name: 'Experiência Prática', description: 'Job shadow como GA em outra agência',
        progress: 0,
        courses: [
          { id: 'tc-17a', title: 'Job Shadow: 1 mês como GA sombra', type: 'practice', duration: '160h', provider: 'Experiência Prática', completed: false },
        ],
      },
    ],
  },

  // ── GN PF → GN PJ (Lateral) ───────────────────────────
  {
    id: 'track-pf-pj',
    fromRoleId: 'role-gn-pf2',
    toRoleId: 'role-gn-pj1',
    title: 'Movimentação para Negócios PJ',
    subtitle: 'Mundo PJ, crédito empresarial e prospecção B2B',
    totalDuration: '28h',
    type: 'lateral',
    familia: 'negocios_pj',
    progress: 0,
    phases: [
      {
        id: 'p1', name: 'Mundo PJ', description: 'Tipos societários, DRE e fluxo de caixa',
        progress: 0,
        courses: [
          { id: 'tc-18a', title: 'Tipos Societários e Regime Tributário', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-18b', title: 'DRE e Balanço: Leitura para GN', type: 'video', duration: '4h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-18c', title: 'Fluxo de Caixa e Capital de Giro', type: 'interactive', duration: '3h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p2', name: 'Crédito PJ', description: 'Operações de crédito para empresas',
        progress: 0,
        courses: [
          { id: 'tc-19a', title: 'Capital de Giro e Desconto de Duplicatas', type: 'video', duration: '4h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-19b', title: 'FINAME e Operações Estruturadas', type: 'video', duration: '4h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-19c', title: 'Análise de Crédito PJ: Estudo de Caso', type: 'practice', duration: '4h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p3', name: 'Prospecção B2B', description: 'Segmentação setorial e networking',
        progress: 0,
        courses: [
          { id: 'tc-20a', title: 'Segmentação Setorial: Indústria, Comércio, Serviço', type: 'video', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-20b', title: 'Networking e Cadeia Produtiva', type: 'interactive', duration: '2h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-20c', title: 'Estudo de Caso: Prospecção PJ Regional', type: 'practice', duration: '2h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
    ],
  },

  // ── GN PF → AGRO (Lateral) ─────────────────────────────
  {
    id: 'track-pf-agro',
    fromRoleId: 'role-gn-pf2',
    toRoleId: 'role-agro1',
    title: 'Movimentação para Negócios AGRO',
    subtitle: 'Agronegócio, crédito rural e cadeias produtivas',
    totalDuration: '30h',
    type: 'lateral',
    familia: 'negocios_agro',
    progress: 0,
    phases: [
      {
        id: 'p1', name: 'Fundamentos AGRO', description: 'Cadeia produtiva e ciclo agrícola',
        progress: 0,
        courses: [
          { id: 'tc-21a', title: 'Cadeias Produtivas do Agronegócio Brasileiro', type: 'video', duration: '4h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-21b', title: 'Ciclo Agrícola e Sazonalidade', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-21c', title: 'Perfil do Produtor Rural: Necessidades e Desafios', type: 'interactive', duration: '3h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p2', name: 'Crédito Rural', description: 'Linhas de crédito e operações do agro',
        progress: 0,
        courses: [
          { id: 'tc-22a', title: 'Pronaf, Pronamp e Demais Linhas', type: 'video', duration: '5h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-22b', title: 'Seguro Rural e Proteção de Safra', type: 'video', duration: '3h', provider: 'Sicredi Aprende', completed: false },
          { id: 'tc-22c', title: 'CPR, CDA/WA e Operações de AGRO', type: 'video', duration: '4h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
      {
        id: 'p3', name: 'Vivência de Campo', description: 'Experiência prática com produtores',
        progress: 0,
        courses: [
          { id: 'tc-23a', title: 'Visita Técnica: Propriedade Rural', type: 'practice', duration: '4h', provider: 'Experiência Prática', completed: false },
          { id: 'tc-23b', title: 'Case: Estruturação de Operação AGRO Completa', type: 'practice', duration: '4h', provider: 'Sicredi Aprende', completed: false },
        ],
      },
    ],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Get all tracks relevant for a given role (from or to) */
export function getTracksForRole(roleId: string): DevelopmentTrack[] {
  return developmentTracks.filter(t => t.fromRoleId === roleId || t.toRoleId === roleId);
}

/** Get tracks where the employee is currently in the "from" role */
export function getAvailableTracks(currentRoleId: string): DevelopmentTrack[] {
  return developmentTracks.filter(t => t.fromRoleId === currentRoleId);
}

/** Get a specific track by ID */
export function getTrackById(trackId: string): DevelopmentTrack | undefined {
  return developmentTracks.find(t => t.id === trackId);
}

/** Get tracks by family (PF, PJ, AGRO, Liderança) */
export function getTracksByFamily(familia: string): DevelopmentTrack[] {
  return developmentTracks.filter(t => t.familia === familia);
}
