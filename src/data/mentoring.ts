// ==========================================
// MENTORING — Módulo de Dados Sicreder2Sicreder
// ==========================================

export interface MentorProfile {
  id: string;
  nome: string;
  cargo: string;
  cooperativa: string;
  agencia: string;
  experienciaAnos: number;
  especialidades: string[];
  disponibilidade: 'disponivel' | 'parcial' | 'indisponivel';
  maxMentorados: number;
  mentoradosAtuais: number;
  bio: string;
  avaliacaoMedia: number; // 1-5
  hashtag?: string;
}

export const mentores: MentorProfile[] = [
  {
    id: 'mentor-001',
    nome: 'Paulo Ferreira',
    cargo: 'Gerente de Agência III',
    cooperativa: 'Cooperativa Centro-Sul RS',
    agencia: 'Agência Centro',
    experienciaAnos: 12,
    especialidades: ['Liderança de Equipes', 'Gestão de Resultados', 'Desenvolvimento de GNs', 'Planejamento Comercial'],
    disponibilidade: 'disponivel',
    maxMentorados: 3,
    mentoradosAtuais: 1,
    bio: 'GA com 12 anos de experiência. Formou 4 GAs e 15+ GNs. Especialista em transformação de agências de baixo desempenho.',
    avaliacaoMedia: 4.8,
    hashtag: '#arrasou',
  },
  {
    id: 'mentor-002',
    nome: 'Maria Luíza Campos',
    cargo: 'Assessor de Negócios AGRO III',
    cooperativa: 'Cooperativa Campos Gerais',
    agencia: 'Sede',
    experienciaAnos: 10,
    especialidades: ['Crédito Rural', 'Cadeia Produtiva', 'CPR/LCA', 'Grandes Produtores'],
    disponibilidade: 'disponivel',
    maxMentorados: 2,
    mentoradosAtuais: 0,
    bio: 'Especialista AGRO com profundo conhecimento em crédito rural e operações estruturadas. Referência técnica regional.',
    avaliacaoMedia: 4.9,
    hashtag: '#arrasou',
  },
  {
    id: 'mentor-003',
    nome: 'Ricardo Oliveira',
    cargo: 'Gerente de Negócios PJ III',
    cooperativa: 'Cooperativa Integração',
    agencia: 'Agência Empresas',
    experienciaAnos: 8,
    especialidades: ['Negócios PJ', 'Crédito Estruturado', 'Câmbio', 'Análise Financeira Avançada'],
    disponibilidade: 'parcial',
    maxMentorados: 2,
    mentoradosAtuais: 1,
    bio: 'Especialista PJ com foco em grandes empresas e operações complexas. CPA-20 e MBA em Finanças Corporativas.',
    avaliacaoMedia: 4.7,
  },
  {
    id: 'mentor-004',
    nome: 'Juliana Becker',
    cargo: 'Coordenador de Gestão de Pessoas',
    cooperativa: 'Cooperativa Vale dos Sinos',
    agencia: 'Sede',
    experienciaAnos: 9,
    especialidades: ['Gestão de Pessoas', 'Desenvolvimento Organizacional', 'People Analytics', 'Cultura Cooperativista'],
    disponibilidade: 'disponivel',
    maxMentorados: 3,
    mentoradosAtuais: 2,
    bio: 'Especialista em P&C com foco em desenvolvimento de lideranças e cultura organizacional. Formou 10+ analistas.',
    avaliacaoMedia: 4.6,
    hashtag: '#mandoubem',
  },
  {
    id: 'mentor-005',
    nome: 'Fernando Santos',
    cargo: 'Assessor de Investimentos',
    cooperativa: 'Cooperativa Pioneira',
    agencia: 'Agência Premium',
    experienciaAnos: 7,
    especialidades: ['Investimentos', 'Wealth Management', 'CPA-20/CEA', 'Previdência'],
    disponibilidade: 'disponivel',
    maxMentorados: 2,
    mentoradosAtuais: 1,
    bio: 'CEA com 7 anos de experiência em desk de investimentos. Especialista em carteiras alta renda e previdência.',
    avaliacaoMedia: 4.8,
  },
];

export const getMentoresPorEspecialidade = (especialidade: string): MentorProfile[] =>
  mentores.filter(m => m.especialidades.some(e => e.toLowerCase().includes(especialidade.toLowerCase())));

export const getMentoresDisponiveis = (): MentorProfile[] =>
  mentores.filter(m => m.disponibilidade !== 'indisponivel' && m.mentoradosAtuais < m.maxMentorados);
