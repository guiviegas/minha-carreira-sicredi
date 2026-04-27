// ==========================================
// COMPETÊNCIAS COMPORTAMENTAIS — "Jeito Sicredi de Ser"
// 5 competências oficiais do brandbook Sicredi
// ==========================================

export interface CompetenciaSicredi {
  id: string;
  nome: string;
  descricao: string;
  indicadores: string[];
  icone: string;
  cor: string;
}

export const competenciasSicredi: CompetenciaSicredi[] = [
  {
    id: 'essencia-cooperativista',
    nome: 'Essência Cooperativista',
    descricao:
      'Vive e promove o cooperativismo no dia a dia, fortalecendo os valores de ajuda mútua, responsabilidade, democracia e equidade. Representa o Sicredi como agente de desenvolvimento local.',
    indicadores: [
      'Promove os valores cooperativistas nas interações com associados e comunidade',
      'Participa ativamente de eventos e programas do cooperativismo',
      'Estimula a participação dos associados na vida cooperativa',
      'Toma decisões considerando o impacto coletivo',
      'Reconhece e valoriza a diversidade nas relações',
    ],
    icone: 'heart-handshake',
    cor: '#3FA110',
  },
  {
    id: 'entender-para-atender',
    nome: 'Entender para Atender',
    descricao:
      'Escuta ativamente para compreender as necessidades reais do associado, oferecendo soluções que fazem sentido para o seu momento de vida. Prioriza o relacionamento genuíno.',
    indicadores: [
      'Pratica escuta ativa e empática com associados e colegas',
      'Investiga necessidades antes de oferecer soluções',
      'Personaliza o atendimento conforme o perfil e momento do associado',
      'Demonstra interesse genuíno pelo bem-estar do associado',
      'Busca feedback para melhorar continuamente a experiência',
    ],
    icone: 'ear',
    cor: '#1E5FA6',
  },
  {
    id: 'vai-la-e-faz',
    nome: 'Vai lá e Faz',
    descricao:
      'Age com proatividade e responsabilidade, buscando resultados com autonomia e senso de dono. Não espera ser mandado: identifica oportunidades e atua.',
    indicadores: [
      'Toma iniciativa diante de desafios e oportunidades',
      'Assume responsabilidade pelos resultados e entregas',
      'Demonstra senso de urgência e pragmatismo',
      'Propõe soluções antes de esperar direcionamento',
      'Entrega com qualidade dentro dos prazos',
    ],
    icone: 'rocket',
    cor: '#C2410C',
  },
  {
    id: 'aprender-mudar-rapido',
    nome: 'Aprender e Mudar Rápido',
    descricao:
      'Tem curiosidade intelectual, busca aprendizado contínuo e se adapta rapidamente a mudanças. Aprende com erros e compartilha conhecimento.',
    indicadores: [
      'Busca ativamente novas fontes de conhecimento',
      'Adapta-se com agilidade a mudanças no contexto',
      'Aplica rapidamente o que aprende no dia a dia',
      'Compartilha aprendizados com a equipe',
      'Demonstra abertura ao feedback e melhoria contínua',
    ],
    icone: 'brain',
    cor: '#7C3AED',
  },
  {
    id: 'inovar-para-transformar',
    nome: 'Inovar para Transformar',
    descricao:
      'Questiona o status quo, propõe melhorias e busca soluções criativas para desafios do negócio. Abraça a transformação digital e novos modelos de trabalho.',
    indicadores: [
      'Propõe melhorias nos processos e formas de trabalho',
      'Experimenta novas abordagens e tecnologias',
      'Desafia práticas estabelecidas de forma construtiva',
      'Conecta ideias de diferentes áreas para gerar valor',
      'Incentiva a inovação e a experimentação na equipe',
    ],
    icone: 'lightbulb',
    cor: '#0E7490',
  },
];

export const getCompetenciaById = (id: string): CompetenciaSicredi | undefined =>
  competenciasSicredi.find(c => c.id === id);
