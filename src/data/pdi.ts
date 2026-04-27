// ============================================================
// PDI — Plano de Desenvolvimento Individual
// ============================================================

export interface PdiAction {
  id: string;
  title: string;
  description: string;
  type: 'trilha' | 'mentoria' | 'projeto' | 'certificacao' | 'livre';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  linkedTrackId?: string;
  linkedCourseId?: string;
  completedDate?: string;
}

export interface PdiGoal {
  id: string;
  targetRoleId: string;
  targetRoleTitle: string;
  deadline: string; // e.g., "Dez/2027"
  progress: number; // 0-100
}

export interface PdiCheckIn {
  id: string;
  date: string;
  leaderName: string;
  notes: string;
  type: 'scheduled' | 'completed';
}

export interface TheoSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'trilha' | 'projeto' | 'mentoria' | 'certificacao';
  priority: 'high' | 'medium' | 'low';
  linkedTrackId?: string;
}

export interface PersonaPdi {
  id: string;
  employeeId: string;
  goal: PdiGoal;
  actions: PdiAction[];
  checkIns: PdiCheckIn[];
  theoSuggestions: TheoSuggestion[];
  competencies: { name: string; current: number; target: number }[];
}

// ============================================================
// PDI DATA PER PERSONA
// ============================================================

export const pdiData: Record<string, PersonaPdi> = {
  // ── MARIANA — GN PF II → Gerente de Agência ──────────────
  // Aspiração unificada: Mariana mira Gerente de Agência (alinhado com employees.ts:23)
  mariana: {
    id: 'pdi-mariana',
    employeeId: 'emp-001',
    goal: {
      id: 'goal-1',
      targetRoleId: 'role-gerente-agencia',
      targetRoleTitle: 'Gerente de Agência',
      deadline: 'Abr/2028',
      progress: 35,
    },
    // Competências oficiais Jeito Sicredi de Ser (consenso vindo da avaliação Q1/2026)
    // Mesma fonte: competencias-sicredi.ts + elofy-config.ts:209-215
    competencies: [
      { name: 'Essência Cooperativista', current: 4, target: 4 },
      { name: 'Entender para Atender', current: 4, target: 4 },
      { name: 'Vai lá e Faz', current: 3, target: 4 },
      { name: 'Aprender e Mudar Rápido', current: 3, target: 4 },
      { name: 'Inovar para Transformar', current: 3, target: 4 },
    ],
    actions: [
      {
        id: 'act-1', title: 'Trilha para Gerente de Agência: Fundamentos de Liderança', description: 'Programa estruturado de liderança cooperativa, gestão de equipes e visão estratégica',
        type: 'trilha', status: 'in_progress', linkedTrackId: 'track-pf2-pf3',
      },
      {
        id: 'act-2', title: 'Mentoria com Paulo Ferreira (GA)', description: 'Reuniões mensais sobre liderança, gestão de agência e desenvolvimento de equipe',
        type: 'mentoria', status: 'in_progress', dueDate: 'Mai/2026',
      },
      {
        id: 'act-3', title: 'Observação em Comitê de Carreira', description: 'Acompanhar Roberto em comitê como observadora: vivência de tomada de decisão sobre pessoas',
        type: 'projeto', status: 'in_progress', dueDate: 'Jun/2026',
      },
      {
        id: 'act-4', title: 'Job Shadow: Gerente de Agência', description: 'Acompanhar dia a dia de uma GA experiente por uma semana',
        type: 'projeto', status: 'pending', dueDate: 'Ago/2026',
      },
      {
        id: 'act-5', title: 'Liderança de mini-projeto na agência', description: 'Liderar campanha trimestral de relacionamento como vivência prática de liderança',
        type: 'projeto', status: 'completed', completedDate: 'Mar/2026',
      },
      {
        id: 'act-6', title: 'Leitura: O Líder Cooperativo', description: 'Livro sobre liderança no contexto cooperativista',
        type: 'livre', status: 'completed', completedDate: 'Fev/2026',
      },
    ],
    checkIns: [
      { id: 'ci-1', date: '2026-03-15', leaderName: 'Roberto Mendes', notes: 'Progresso sólido na trilha. Alinhar CEA para segundo semestre.', type: 'completed' },
      { id: 'ci-2', date: '2026-04-19', leaderName: 'Roberto Mendes', notes: '', type: 'scheduled' },
    ],
    theoSuggestions: [
      {
        id: 'sug-1', title: 'Próximo passo: aprofundar Inovar para Transformar', description: 'Sua avaliação ficou em #mandoubem nessa competência, mas para virar GA o esperado é #arrasou. Tem um curso de Pensamento Estratégico em Inovação no Sicredi Aprende.',
        type: 'trilha', priority: 'high', linkedTrackId: 'track-pf2-pf3',
      },
      {
        id: 'sug-2', title: 'Job Shadow com GA disponível', description: 'A Cooperativa Caminhos abriu vaga para job shadow com GA por uma semana. Acelera muito a leitura prática de liderança.',
        type: 'projeto', priority: 'high',
      },
      {
        id: 'sug-3', title: 'Pedir mentoria com Paulo (GA)', description: 'O Paulo Ferreira (GA III) está disponível para 1 mentoria nova. Já formou 4 GAs. Vale conversar.',
        type: 'mentoria', priority: 'medium',
      },
    ],
  },

  // ── LUCAS — Assistente de Atendimento → GN PF I ────────
  lucas: {
    id: 'pdi-lucas',
    employeeId: 'emp-110',
    goal: {
      id: 'goal-2',
      targetRoleId: 'role-gn-pf1',
      targetRoleTitle: 'Gerente de Negócios PF I',
      deadline: 'Mar/2028',
      progress: 12,
    },
    competencies: [
      { name: 'Prospecção e Abordagem', current: 2, target: 7 },
      { name: 'CPA-10', current: 0, target: 10 },
      { name: 'Gestão de Carteira', current: 1, target: 6 },
      { name: 'Cooperativismo', current: 3, target: 7 },
      { name: 'Produtos Financeiros', current: 2, target: 8 },
    ],
    actions: [
      {
        id: 'act-1', title: 'Onboarding Sicredi', description: 'Completar trilha de onboarding — cultura, valores e processos',
        type: 'trilha', status: 'in_progress',
      },
      {
        id: 'act-2', title: 'Essência Cooperativista', description: 'Módulo sobre valores cooperativos no dia a dia',
        type: 'trilha', status: 'in_progress', linkedTrackId: 'track-assist-pf1',
      },
      {
        id: 'act-3', title: 'Iniciar preparatório CPA-10', description: 'Começar módulos de Sistema Financeiro Nacional',
        type: 'certificacao', status: 'pending', dueDate: 'Jul/2026',
      },
      {
        id: 'act-4', title: 'Job Shadow com GN PF I', description: 'Acompanhar Pedro (GN PF I) por 2 semanas',
        type: 'projeto', status: 'pending', dueDate: 'Ago/2026',
      },
    ],
    checkIns: [
      { id: 'ci-1', date: '2026-04-05', leaderName: 'Ana Beatriz', notes: 'Lucas adaptando bem. Focar em cooperativismo e preparar CPA-10 para 2o semestre.', type: 'completed' },
      { id: 'ci-2', date: '2026-05-10', leaderName: 'Ana Beatriz', notes: '', type: 'scheduled' },
    ],
    theoSuggestions: [
      {
        id: 'sug-1', title: 'Conheça o cooperativismo', description: 'Vi que você veio de banco — o módulo "Essência Cooperativista" vai te ajudar a entender a diferença. É curtinho: 2h!',
        type: 'trilha', priority: 'high', linkedTrackId: 'track-assist-pf1',
      },
      {
        id: 'sug-2', title: 'CPA-10 em 3 meses', description: 'Montei um cronograma para você tirar a CPA-10 até outubro. Quer ver o plano de estudos?',
        type: 'certificacao', priority: 'high',
      },
    ],
  },

  // ── ROBERTO — GA (líder) ───────────────────────────────
  roberto: {
    id: 'pdi-roberto',
    employeeId: 'emp-002',
    goal: {
      id: 'goal-3',
      targetRoleId: 'role-gerente-regional',
      targetRoleTitle: 'Gerente Regional',
      deadline: 'Dez/2028',
      progress: 25,
    },
    competencies: [
      { name: 'Gestão de Múltiplas Agências', current: 3, target: 9 },
      { name: 'Desenvolvimento de Líderes', current: 6, target: 9 },
      { name: 'Visão Estratégica Regional', current: 4, target: 8 },
      { name: 'Governança Avançada', current: 5, target: 8 },
    ],
    actions: [
      {
        id: 'act-1', title: 'Programa de Formação de Líderes', description: 'Participar como facilitador no programa de desenvolvimento de GAs',
        type: 'mentoria', status: 'in_progress', dueDate: 'Jun/2026',
      },
      {
        id: 'act-2', title: 'MBA em Gestão Cooperativa', description: 'Módulos de gestão estratégica e governança — parceria Sicredi/UNISINOS',
        type: 'livre', status: 'in_progress', dueDate: 'Dez/2026',
      },
      {
        id: 'act-3', title: 'Intercâmbio com GR Sul', description: 'Acompanhar GR por 1 semana — vivência de gestão regional',
        type: 'projeto', status: 'pending', dueDate: 'Ago/2026',
      },
    ],
    checkIns: [
      { id: 'ci-1', date: '2026-03-20', leaderName: 'Marcos Ferreira', notes: 'Roberto pronto para experiência de GR sombra. Agendar para agosto.', type: 'completed' },
      { id: 'ci-2', date: '2026-05-15', leaderName: 'Marcos Ferreira', notes: '', type: 'scheduled' },
    ],
    theoSuggestions: [
      {
        id: 'sug-1', title: 'Vagas de Intercâmbio abertas', description: 'Tem uma vaga de intercâmbio com o GR da Regional Sul em agosto. É a oportunidade que você comentou!',
        type: 'projeto', priority: 'high',
      },
    ],
  },
};

/** Get PDI for a persona by their persona ID */
export function getPdiForPersona(personaId: string): PersonaPdi | undefined {
  return pdiData[personaId];
}
