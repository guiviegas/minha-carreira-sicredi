// ==========================================
// EXPERIÊNCIAS E VIVÊNCIAS — Módulo de Dados
// Projetos especiais, job shadow, intercâmbios
// ==========================================

export type ExperienciaTipo = 'projeto' | 'job_shadow' | 'intercambio' | 'comite' | 'mentoria_reversa';

export interface Experiencia {
  id: string;
  titulo: string;
  tipo: ExperienciaTipo;
  duracao: string;
  local: string;
  skills: string[];
  vagas: number;
  icone: string;
  cor: string;
  descricao: string;
  familiaAlvo?: string[];  // PF, PJ, AGRO, Liderança
  requisitos?: string[];
  impactoProntidao?: number; // +pp estimado
}

export const experiencias: Experiencia[] = [
  {
    id: 'exp-001',
    titulo: 'Projeto de Satisfação do Associado Q3',
    tipo: 'projeto',
    duracao: '4 semanas',
    local: 'Agência Centro',
    skills: ['Liderança', 'Gestão de Equipe', 'Indicadores de Satisfação'],
    vagas: 1,
    icone: 'target',
    cor: '#3FA110',
    descricao: 'Lidere um projeto de melhoria da satisfação do associado na agência com maior gap de NPS. Ideal para quem aspira liderança.',
    familiaAlvo: ['negocios_pf', 'negocios_pj', 'lideranca'],
    requisitos: ['Avaliação #mandoubem ou superior', 'Interesse em liderança'],
    impactoProntidao: 4,
  },
  {
    id: 'exp-002',
    titulo: 'Job Shadow — Gerente de Agência',
    tipo: 'job_shadow',
    duracao: '1 semana',
    local: 'Agência Norte',
    skills: ['Liderança', 'Visão Estratégica', 'Gestão de Pessoas'],
    vagas: 2,
    icone: 'eye',
    cor: '#2563EB',
    descricao: 'Acompanhe o dia a dia de um GA experiente por uma semana. Entenda as decisões, os desafios e a rotina de liderança na prática.',
    familiaAlvo: ['negocios_pf', 'negocios_pj', 'negocios_agro'],
    requisitos: ['GN II ou superior', 'Interesse declarado em liderança'],
    impactoProntidao: 3,
  },
  {
    id: 'exp-003',
    titulo: 'Intercâmbio — Central Regional',
    tipo: 'intercambio',
    duracao: '2 semanas',
    local: 'Central PR/SP/RJ',
    skills: ['Processos', 'Compliance', 'Visão Sistêmica', 'Governança'],
    vagas: 3,
    icone: 'globe',
    cor: '#7C3AED',
    descricao: 'Vivencie a rotina da Central Regional. Entenda como decisões sistêmicas impactam as cooperativas e agências na ponta.',
    familiaAlvo: ['operacoes', 'lideranca', 'pc'],
    requisitos: ['3+ anos no sistema', 'Aprovação do gestor'],
    impactoProntidao: 5,
  },
  {
    id: 'exp-004',
    titulo: 'Comitê de Inovação 2026',
    tipo: 'comite',
    duracao: '6 meses',
    local: 'Remoto + Presencial',
    skills: ['Inovação', 'Transformação Digital', 'Design Thinking', 'Prototipação'],
    vagas: 5,
    icone: 'lightbulb',
    cor: '#0E7490',
    descricao: 'Participe do Comitê de Inovação sistêmico. Proponha e desenvolva soluções para desafios do modelo de negócio cooperativo.',
    familiaAlvo: ['negocios_pf', 'negocios_pj', 'negocios_agro', 'operacoes', 'pc', 'cas'],
    requisitos: ['Avaliação #mandoubem ou superior', 'Perfil inovador'],
    impactoProntidao: 2,
  },
  {
    id: 'exp-005',
    titulo: 'Mentoria Reversa — Transformação Digital',
    tipo: 'mentoria_reversa',
    duracao: '3 meses',
    local: 'Remoto',
    skills: ['Ferramentas Digitais', 'Comunicação', 'Ensino', 'Empatia'],
    vagas: 4,
    icone: 'refresh-cw',
    cor: '#D97706',
    descricao: 'Mentore um líder sênior em ferramentas digitais e novas tecnologias. Uma oportunidade de visibilidade e desenvolvimento de competências de comunicação.',
    familiaAlvo: ['negocios_pf', 'negocios_pj', 'atendimento'],
    requisitos: ['Perfil digital avançado', 'Boa comunicação'],
    impactoProntidao: 2,
  },
  {
    id: 'exp-006',
    titulo: 'Projeto Agro Tech — Digitalização Rural',
    tipo: 'projeto',
    duracao: '8 semanas',
    local: 'Cooperativas Rurais RS/PR',
    skills: ['Agronegócio', 'Tecnologia', 'Relacionamento Rural', 'Gestão de Projetos'],
    vagas: 2,
    icone: 'wheat',
    cor: '#558B2F',
    descricao: 'Lidere a implantação de ferramentas digitais para atendimento a produtores rurais. Entenda os desafios do campo e proponha soluções tech.',
    familiaAlvo: ['negocios_agro'],
    requisitos: ['AGRO I ou superior', 'Interesse em tecnologia'],
    impactoProntidao: 4,
  },
];

export const getExperienciasPorFamilia = (familia: string): Experiencia[] =>
  experiencias.filter(e => !e.familiaAlvo || e.familiaAlvo.includes(familia));

export const getExperienciasByTipo = (tipo: ExperienciaTipo): Experiencia[] =>
  experiencias.filter(e => e.tipo === tipo);
