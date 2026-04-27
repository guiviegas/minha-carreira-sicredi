// ==========================================
// COMPETÊNCIAS COMPORTAMENTAIS — "Jeito Sicredi de Ser"
// 7 competências oficiais do framework "Por dentro da estratégia" (Sicredi)
// Fonte: imagem oficial Jeito Sicredi de Ser - circuito Encontrar/Desenvolver/Gerir/Sustentar
// ==========================================

export interface CompetenciaSicredi {
  id: string;
  nome: string;       // hashtag oficial completa: "#GENTE QUE FAZ JUNTO"
  descricao: string;
  indicadores: string[];
  icone: string;
  cor: string;
}

export const competenciasSicredi: CompetenciaSicredi[] = [
  {
    id: 'gente-que-faz-junto',
    nome: '#GENTE QUE FAZ JUNTO',
    descricao:
      'Colabora, conecta pessoas e constrói em equipe. Promove cooperação genuína entre áreas, agências e pares para entregar valor ao associado.',
    indicadores: [
      'Busca alinhamento e coautoria nas decisões importantes',
      'Compartilha conhecimento e oferece ajuda sem ser solicitado',
      'Constrói pontes entre áreas para destravar entregas',
      'Reconhece o trabalho coletivo e celebra resultados de equipe',
      'Vivencia o cooperativismo como modelo de relação',
    ],
    icone: 'handshake',
    cor: '#3FA110',
  },
  {
    id: 'gente-que-entende-de-gente',
    nome: '#GENTE QUE ENTENDE DE GENTE',
    descricao:
      'Escuta, acolhe e desenvolve pessoas. Investe tempo em entender o associado e os colegas para oferecer soluções e oportunidades alinhadas a quem eles são.',
    indicadores: [
      'Pratica escuta ativa em todas as interações',
      'Adapta a comunicação ao perfil do interlocutor',
      'Demonstra empatia e cuidado nos momentos difíceis',
      'Investe em desenvolver pessoas (mentoria, feedback)',
      'Valoriza a diversidade de pensamento e estilo',
    ],
    icone: 'heart',
    cor: '#E97316',
  },
  {
    id: 'gente-que-gera-prosperidade',
    nome: '#GENTE QUE GERA PROSPERIDADE',
    descricao:
      'Gera valor sustentável para associados, comunidade e Sicredi. Pensa estrategicamente, busca resultado e cuida da prosperidade de longo prazo.',
    indicadores: [
      'Identifica oportunidades de geração de valor para o associado',
      'Equilibra resultado de curto prazo com sustentabilidade',
      'Conecta decisões individuais ao impacto sistêmico',
      'Atua como agente de desenvolvimento da comunidade local',
      'Toma decisões orientadas por dados e visão de negócio',
    ],
    icone: 'trending-up',
    cor: '#FACC15',
  },
  {
    id: 'gente-que-evolui',
    nome: '#GENTE QUE EVOLUI',
    descricao:
      'Aprende continuamente, adapta-se rápido e busca novas formas de fazer. Tem abertura ao novo e transforma aprendizado em prática.',
    indicadores: [
      'Busca ativamente novas fontes de conhecimento',
      'Adapta-se com agilidade a mudanças no contexto',
      'Aplica rapidamente o que aprende no dia a dia',
      'Experimenta abordagens novas e aceita o erro como aprendizado',
      'Compartilha aprendizados e estimula evolução do time',
    ],
    icone: 'rocket',
    cor: '#EC4899',
  },
  {
    id: 'gente-que-faz-o-certo',
    nome: '#GENTE QUE FAZ O CERTO',
    descricao:
      'Atua com integridade, ética e alinhamento aos valores cooperativistas. Cumpre normas e práticas que sustentam a confiança no Sicredi.',
    indicadores: [
      'Age de forma ética em situações ambíguas',
      'Cumpre regras, normas e procedimentos de compliance',
      'Sinaliza riscos e desvios de conduta com franqueza',
      'Toma decisões considerando o impacto reputacional',
      'Promove um ambiente seguro e respeitoso',
    ],
    icone: 'shield-check',
    cor: '#06B6D4',
  },
  {
    id: 'gente-que-gera-confianca',
    nome: '#GENTE QUE GERA CONFIANÇA',
    descricao:
      'Constrói relações de confiança duradouras com associados, colegas e parceiros. Cumpre o que promete e fala de forma transparente.',
    indicadores: [
      'Cumpre o que promete dentro do prazo combinado',
      'Comunica más notícias de forma direta e respeitosa',
      'Assume responsabilidade por erros e busca aprender com eles',
      'Mantém consistência entre o que diz e o que faz',
      'Cria espaços seguros para conversas difíceis',
    ],
    icone: 'check-circle',
    cor: '#15803D',
  },
  {
    id: 'gente-com-quem-contar',
    nome: '#GENTE COM QUEM CONTAR',
    descricao:
      'Está disponível, presente e entrega com qualidade. É referência de pessoa em quem o associado e o time podem contar.',
    indicadores: [
      'Está presente nos momentos que importam para o associado e equipe',
      'Entrega com qualidade, sem precisar ser cobrado',
      'Antecipa necessidades e age proativamente',
      'Apoia colegas em momentos de pressão ou sobrecarga',
      'Mantém disponibilidade e prontidão para servir',
    ],
    icone: 'users',
    cor: '#92400E',
  },
];

export const getCompetenciaById = (id: string): CompetenciaSicredi | undefined =>
  competenciasSicredi.find((c) => c.id === id);
