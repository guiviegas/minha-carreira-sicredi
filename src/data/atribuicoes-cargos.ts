// ============================================================
// ATRIBUIÇÕES DE CARGOS — Estrutura oficial Sicredi
// ============================================================
// Estrutura conforme Matriz de Atribuições do Sicredi:
//   - Função (título oficial + objetivo da família)
//   - Responsabilidades Essenciais (responsabilidades macro)
//   - Principais Atividades (sub-itens, opcional)
//   - Requisitos (formação, experiência, certificações, idiomas, CBO)
//   - Diferenciais (cursos, experiências adicionais)
//   - Preparo Técnico (habilidades técnicas necessárias)
//   - Preparo Comportamental (Jeito Sicredi de Ser + comportamentais)
//
// Fonte primária: Matriz de Atribuições - atualizada.xlsx
// Quando o cargo não está na planilha, dados são INFERIDOS baseados em
// mercado e padrões internos. Cada cargo indica sua fonte (`planilha` ou
// `inferido`) para transparência.
// ============================================================

export type FonteAtribuicao = 'planilha' | 'inferido';

export interface ResponsabilidadeEssencial {
  titulo: string;
  descricao: string;
  /** Atividades sub-numeradas opcionais (1.1, 1.2…). Inferidas quando ausentes. */
  atividades?: string[];
}

export interface RequisitosCargo {
  formacao: string;
  experiencia: string;
  areasFormacao: string;
  idiomas: string;
  certificacoes: string[];
  cbo: string;
}

export interface AtribuicoesCargo {
  roleId: string;
  fonte: FonteAtribuicao;
  tituloOficial: string;
  objetivoFamilia: string;
  nivelMaturidade: string;
  responsabilidadesEssenciais: ResponsabilidadeEssencial[];
  requisitos: RequisitosCargo;
  diferenciais: string[];
  preparoTecnico: string[];
  preparoComportamental: string[];
}

export const atribuicoesCargos: Record<string, AtribuicoesCargo> = {
  'role-agro1': {
    roleId: 'role-agro1',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS AGRO I`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades predominantemente básicas ou intermediárias. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com base em procedimentos estabelecidos, sob orientação quando em necessidade. Opera nos sistemas da Agência e contribui para a eficiência da área. Está em processo de formação técnica e desenvolvimento profissional.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Administrar e desenvolver uma carteira de associados do segmento Agronegócio (AGRO), com predominância de baixa à média complexidade, cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras adequadas às necessidades dos produtores, comercializando produtos e serviços alinhados aos objetivos da Cooperativa e ao planejamento estratégico da segmentação em que atua.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o perfil do produtor rural, sua atividade e grau de risco. Concretizar novos negócios, fortalecer o relacionamento e estabelecer parcerias com entidades do setor. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Visita aos Associados e Prospectos`,
        descricao: `Realizar visitas pontuais aos associados e prospectos do segmento AGRO, com foco na geração de novos negócios e no fortalecimento do relacionamento presencial.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Cumprir com o equilíbrio e a estratégia entre atendimentos digitais e presenciais, otimizando o tempo para relacionamento, prospecção e acompanhamento da carteira.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Contato diário e proativo com o produtor para identificação de negócios existentes e oportunidades. Conhecer técnicas de vendas e aplica-las no atendimento, assim como conhecer as soluções que o Sicredi proporciona para que, no atendimento consultivo, o GN possa entender a necessidade e ofertar aquilo que mais se adequa a realidade do produtor/associado.`,
      },
      {
        titulo: `Resultado`,
        descricao: `Cumprir os indicadores e objetivos da carteira, buscando a superação dos resultados estratégicos com foco no cooperativismo e na entrega de valor ao associado.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos e externos.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e envolvimento judicial. Acompanhar créditos concedidos quanto a pontualidade de pagamento, quanto à degradação de risco eventual de cada operação e buscar os créditos concedidos mitigando a necessidade de trabalho extrajudicial ou judicial.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, promovendo agilidade e autonomia. Prestar orientação sobre o uso adequado dos produtos e tecnologias disponíveis, com foco em soluções digitais e acessíveis ao associado.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas e promovendo o engajamento com os valores do cooperativismo, com uma abordagem mais aprofundada por meio da condução dos Programas do Cooperativismo`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras de pagamentos, recebimentos e transferências.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Demais Responsabilidades`,
        descricao: `Executar outras atividades correlatas ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Em Andamento)`,
      experiencia: `02 anos`,
      areasFormacao: `Gestão Financeira, Agronomia, Zootecnia, Engenharia Agrícola, Administração, Economia e áreas afins`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `Cursos em agronegócio, agronomia ou veterinária`,
      `Experiência em crédito rural ou cadeia produtiva`,
      `Disponibilidade para visitas em campo`
    ],
    preparoTecnico: [
      `Conhecimento sobre produtos e serviços financeiros`,
      `Economia básica`,
      `Lei geral de micro e pequenas empresas`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Agricultura familiar`,
      `Agronegócio (básico)`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-agro2': {
    roleId: 'role-agro2',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS AGRO II`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com demandas variadas e de complexidade predominantemente intermediária. Apesar do título de “Gerente”, não exerce gestão de pessoas. Possui conhecimento do seu segmento e autonomia moderada para tomada de decisões. Identifica soluções para problemas que impactam a eficiência e a eficácia da área. Recebe orientação pontual e contribui para o aprimoramento de processos e resultados da equipe.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Administrar e desenvolver uma carteira de associados do segmento Agronegócio (AGRO), com predominância de média complexidade, cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras mais sofisticadas e adequadas às necessidades dos produtores, comercializando produtos e serviços alinhados aos objetivos da Cooperativa e ao planejamento estratégico da segmentação em que atua.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada pelo produtor, seu grau de risco e momento financeiro. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Visita aos Associados e Prospectos`,
        descricao: `Realizar visitas recorrentes aos associados e prospectos do segmento AGRO, com foco na geração de novos negócios e no fortalecimento do relacionamento presencial.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Gerenciar o tempo entre atendimentos digitais e presenciais, garantindo equilíbrio entre relacionamento, prospecção e acompanhamento da carteira.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Manter contato diário e proativo com os produtores, identificando oportunidades e necessidades. Aplicar técnicas de venda consultiva, compreendendo o contexto do associado para ofertar soluções personalizadas, alinhadas ao seu momento e aos princípios do cooperativismo.`,
      },
      {
        titulo: `Resultado`,
        descricao: `Cumprir os indicadores e objetivos da carteira, buscando a superação dos resultados estratégicos com foco no cooperativismo e na entrega de valor ao associado.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos e externos.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e ações judiciais. Acompanhar créditos concedidos quanto à pontualidade, risco e degradação, atuando de forma preventiva e corretiva.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, visando agilidade e direcionamento para as soluções digitais. Prestar orientação para que os associados utilizem melhor os produtos e tecnologias disponíveis, com foco em soluções avançadas.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas e promovendo o engajamento com os valores do cooperativismo, com uma abordagem mais aprofundada por meio da condução dos Programas do Cooperativismo`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras de pagamentos, recebimentos e transferências.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Concluído)`,
      experiencia: `De 02 a 05 anos`,
      areasFormacao: `Gestão Financeira, Agronomia, Zootecnia, Engenharia Agrícola, Administração, Economia e áreas afins`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `Cursos em agronegócio, agronomia ou veterinária`,
      `Experiência em crédito rural ou cadeia produtiva`,
      `Disponibilidade para visitas em campo`
    ],
    preparoTecnico: [
      `Conhecimento sobre produtos e serviços financeiros`,
      `Cooperativismo de crédito`,
      `Lei geral de micro e pequenas empresas`,
      `Economia básica`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Legislação Empresarial`,
      `Agricultura familiar`,
      `Agricultura Empresarial`,
      `Agronegócio`,
      `Crédito Rural`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-agro3': {
    roleId: 'role-agro3',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS AGRO III`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades amplas e de complexidade predominantemente alta. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com alta autonomia, orientando profissionais menos experientes e influenciando decisões estratégicas da área. Possui profundo conhecimento técnico e de negócio, sendo referência para a equipe. Resolve problemas complexos com impacto relevante na área e na organização.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Administrar e desenvolver uma carteira de associados do segmento Agronegócio (AGRO), com predominância de alta complexidade, cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras sofisticadas e personalizadas, alinhadas aos objetivos da Cooperativa e ao planejamento estratégico da segmentação em que atua. Atuar com autonomia, visão estratégica e foco consultivo, promovendo o relacionamento de longo prazo e o fortalecimento do vínculo com o cooperado.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada pelo produtor, seu grau de risco e momento financeiro. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Visita aos Associados e Prospectos`,
        descricao: `Realizar visitas recorrentes aos associados e prospectos do segmento AGRO, com foco na geração de novos negócios e no fortalecimento do relacionamento presencial, com uma abordagem estratégica e personalizada.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Gerenciar o tempo entre atendimentos digitais e presenciais, garantindo equilíbrio entre relacionamento, prospecção e acompanhamento da carteira, com foco em eficiência e resultados sustentáveis.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Manter contato diário e proativo com os produtores, identificando oportunidades e necessidades. Aplicar técnicas de venda consultiva com domínio das soluções financeiras do Sicredi, garantindo uma abordagem altamente personalizada e estratégica, alinhada aos princípios do cooperativismo.`,
      },
      {
        titulo: `Orientação Consultiva`,
        descricao: `A partir de dados da carteira, estimular os associados sobre soluções financeiras personalizadas e alinhadas ao seu momento. Apoiar nas decisões sobre produtos e serviços, criando estratégias detalhadas para a vida financeira e gerando impacto positivo nas comunidades onde a Cooperativa está inserida.`,
      },
      {
        titulo: `Resultado`,
        descricao: `Cumprir e superar os indicadores e objetivos da carteira, com foco no cooperativismo e na entrega de valor ao associado. Propor ações estratégicas com base em análise de desempenho e oportunidades de crescimento.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos e externos.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e ações judiciais. Acompanhar créditos concedidos quanto à pontualidade, risco e degradação, atuando de forma preventiva e corretiva.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, promovendo agilidade, autonomia e eficiência. Prestar orientação sobre o uso adequado dos produtos e tecnologias disponíveis, com foco em soluções digitais avançadas e personalizadas.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas e promovendo o engajamento com os valores do cooperativismo, com uma abordagem mais aprofundada por meio da condução dos Programas do Cooperativismo.`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras de pagamentos, recebimentos e transferências.`,
      },
      {
        titulo: `Apoio Técnico`,
        descricao: `Contribuir com a formação funcional dos colegas, atuando como referência técnica. Apoiar na utilização dos sistemas, disseminação da cultura cooperativista e execução das atividades necessárias ao suporte da carteira, garantindo a satisfação do associado e o cumprimento do planejamento.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Especialização/MBA (Em Andamento)`,
      experiencia: `Acima de 05 anos`,
      areasFormacao: `Gestão Financeira, Agronomia, Zootecnia, Engenharia Agrícola, Administração, Economia e áreas afins.`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `Cursos em agronegócio, agronomia ou veterinária`,
      `Experiência em crédito rural ou cadeia produtiva`,
      `Disponibilidade para visitas em campo`
    ],
    preparoTecnico: [
      `Conhecimento avançado sobre produtos e serviços financeiros`,
      `Conhecimento de produtos e serviços financeiros`,
      `Conhecimento de mercado e comercialização das culturas predominantes na região`,
      `Crédito Rural`,
      `Agronegócio`,
      `Agricultura Familiar`,
      `Agricultura Empresarial`,
      `Economia`,
      `Lei Geral de Micro e Pequenas Empresas`,
      `Legislação Empresarial`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Sistemático`,
      `Lógica`,
      `Visão analítica`,
      `Capacidade de negociação`,
      `Pacote Office`,
      `Cooperativismo de crédito`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-analista-cas': {
    roleId: 'role-analista-cas',
    fonte: 'inferido',
    tituloOficial: `ANALISTA DO CAS (CENTRO ADMINISTRATIVO SICREDI)`,
    objetivoFamilia: `Atuar no Centro Administrativo Sicredi como especialista sistêmico, contribuindo para construção de soluções para todo o sistema cooperativo.`,
    nivelMaturidade: `Sênior sistêmico: domínio técnico avançado, contribui para soluções aplicadas a todas as cooperativas e centrais.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Soluções sistêmicas`,
        descricao: `Construir soluções, processos e produtos aplicáveis a todo o sistema Sicredi (cooperativas + centrais).`,
      },
      {
        titulo: `Especialização técnica`,
        descricao: `Atuar como referência técnica em sua especialidade dentro do CAS.`,
      },
      {
        titulo: `Inovação e melhoria contínua`,
        descricao: `Propor melhorias contínuas em processos, produtos e práticas sistêmicas.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `Compliance e PLD`,
      `Procedimentos operacionais e contábeis`,
      `Sistemas internos de back-office`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-analista-central': {
    roleId: 'role-analista-central',
    fonte: 'inferido',
    tituloOficial: `ANALISTA DA CENTRAL REGIONAL`,
    objetivoFamilia: `Atuar na Central Regional como referência técnica em uma área específica (crédito, controles, comunicação, P&C, etc.), apoiando as cooperativas filiadas.`,
    nivelMaturidade: `Pleno: domínio técnico avançado em sua especialidade, atende múltiplas cooperativas filiadas.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Especialização técnica`,
        descricao: `Atuar como referência técnica em sua área de especialização, atendendo demandas das cooperativas filiadas.`,
      },
      {
        titulo: `Suporte às cooperativas`,
        descricao: `Apoiar cooperativas filiadas com pareceres, análises e orientações em sua especialidade.`,
      },
      {
        titulo: `Construção sistêmica`,
        descricao: `Contribuir para construção de diretrizes, normativos e práticas sistêmicas de sua área.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `Compliance e PLD`,
      `Procedimentos operacionais e contábeis`,
      `Sistemas internos de back-office`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-analista-pc': {
    roleId: 'role-analista-pc',
    fonte: 'inferido',
    tituloOficial: `ANALISTA DE PESSOAS E CULTURA`,
    objetivoFamilia: `Operacionalizar a estratégia de pessoas na cooperativa, conduzindo ciclos de gestão de carreira, desempenho, desenvolvimento e cultura.`,
    nivelMaturidade: `Pleno: conduz processos de P&C com autonomia, é parceiro estratégico das lideranças locais.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Ciclos de gestão de pessoas`,
        descricao: `Operacionalizar ciclos de avaliação de desempenho, comitê de carreira, plano de sucessão e desenvolvimento contínuo.`,
      },
      {
        titulo: `Parceria com lideranças`,
        descricao: `Atuar como parceiro estratégico de GAs e gerentes de áreas, apoiando decisões sobre pessoas, movimentações e desenvolvimento.`,
      },
      {
        titulo: `People Analytics`,
        descricao: `Acompanhar indicadores de carreira, engajamento, turnover e prontidão. Produzir análises que sustentem decisões da diretoria.`,
      },
      {
        titulo: `Cultura e clima`,
        descricao: `Disseminar a cultura Sicredi, conduzir pesquisas de clima e ações de fortalecimento do Jeito Sicredi de Ser.`,
      },
      {
        titulo: `Comitê de Carreira`,
        descricao: `Facilitar comitês de carreira locais, garantindo rigor metodológico, uso dos critérios sistêmicos e qualidade das decisões.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `People Analytics`,
      `Ciclos de avaliação e desempenho`,
      `Sistemas de gestão de pessoas`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-assessor-investimentos': {
    roleId: 'role-assessor-investimentos',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE INVESTIMENTOS`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades amplas e de complexidade alta. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com alta autonomia, orientando profissionais menos experientes e influenciando decisões estratégicas da área. Possui profundo conhecimento técnico, relacional e de negócio, sendo referência para a equipe. Resolve problemas complexos com impacto relevante na área e na organização.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Administração de Carteira`,
        descricao: `Responder pela administração e desenvolvimento de carteira de associados com perfil investidor, cumprindo a agenda comercial estabelecida, apresentando soluções financeiras adequadas às necessidades, comercializando produtos e serviços aderentes as metas estabelecidas, visando o cumprimento do planejamento estratégico e relacionamento com os investidores.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospecção ativa de novos associados investidores, realizando visitas externas, visando o aumento do quadro social, cumprimento dos objetivos e a segurança financeira da Agência. Participar de eventos externos visando a prospecção de novos associados e incremento da carteira do(s) segmentos sob sua responsabilidade.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `A partir de dados da carteira, realizar estímulos para os associados sobre soluções financeiras avançadas, verificando se fazem sentido para o momento de vida. Apoiar os associados em suas decisões sobre investimentos, criando estratégias detalhadas para a vida financeira e gerando impacto positivo nas comunidades onde a cooperativa está inserida.`,
      },
      {
        titulo: `Atendimento aos Associados`,
        descricao: `Prestar atendimento aos associados investidores e demais públicos de interesse, nas dependências da Cooperativa e/ou em visitas externas, em eventos nos quais o Sicredi esteja participando junto à Comunidade, identificando a necessidade do associado investidor de acordo com seu perfil, disponibilizando os produtos e serviços e apresentando as especificações técnicas necessárias, vantagens e demais características, a fim de efetivar negociações e cumprir com os objetivos estabelecidas.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir com os indicadores e objetivos da carteira, com foco no cooperativismo e na entrega de valor ao associado. Acompanhar os resultados e planejar ações para alcançá-los ou superá-los.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e envolvimento judicial. Acompanhar créditos concedidos quanto a pontualidade de pagamento, quanto à degradação de risco eventual de cada operação e buscar os créditos concedidos mitigando a necessidade de trabalho extrajudicial ou judicial.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, sendo responsável por mantê-los atualizados e de acordo com os normativos internos.`,
      },
      {
        titulo: `Integrador de novos associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Apoio Técnico`,
        descricao: `'Contribuir com a formação funcional dos colegas, apoiando-os tecnicamente na utilização dos sistemas, no aculturamento do Cooperativismo e nas atividades necessárias ao suporte da carteira de forma a garantir a satisfação do associado e o cumprimento do planejamento da carteira.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Responder pela correta aplicação dos normativos e orientações Sistêmicas e Locais.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Especialização/MBA`,
      experiencia: `De 5 a 8 anos`,
      areasFormacao: `Gestão Empresarial
Gestão Financeira
Áreas correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253205`,
    },
    diferenciais: [
      `CPA-20 ou CEA`,
      `Experiência em wealth management ou private`,
      `Cursos de comportamento do cliente / análise de perfil`
    ],
    preparoTecnico: [
      `Fundos e Produtos de Investimentos`,
      `Conhecimento avançado sobre produtos e serviços financeiros`,
      `Atendimento ao Cliente`,
      `Ampla visão de negócio`,
      `Legislação Cooperativista`,
      `Técnica de Vendas`,
      `Boa capacidade de comunicação e persuasão`,
      `Boa capacidade de conduzir projetos`,
      `Habilidade comercial`,
      `Experiência com grandes contas e orientação com investimentos`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-assistente-atendimento': {
    roleId: 'role-assistente-atendimento',
    fonte: 'inferido',
    tituloOficial: `ASSISTENTE DE ATENDIMENTO`,
    objetivoFamilia: `Realizar o atendimento ao associado, esclarecendo dúvidas e prestando suporte às operações cotidianas. Garantir uma experiência positiva no primeiro contato com a Cooperativa.`,
    nivelMaturidade: `Executar atividades rotineiras de atendimento conforme procedimentos operacionais definidos, sob supervisão.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Atendimento ao associado`,
        descricao: `Receber e direcionar associados na agência, prestando informações iniciais sobre produtos e serviços, garantindo experiência positiva no primeiro contato.`,
      },
      {
        titulo: `Suporte operacional`,
        descricao: `Apoiar a equipe nas atividades transacionais cotidianas: abertura de contas, atualização cadastral, emissão de cartões e talonários.`,
      },
      {
        titulo: `Encaminhamento qualificado`,
        descricao: `Identificar a necessidade do associado e encaminhar com clareza para o GN, GA, Caixa ou canal digital adequado.`,
      },
      {
        titulo: `Cooperativismo`,
        descricao: `Disseminar os valores cooperativistas em cada interação, fortalecendo o vínculo do associado com a Cooperativa.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `Sistemas de atendimento e CRM básico`,
      `Procedimentos operacionais da agência`,
      `Conhecimento básico de produtos`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-assistente-negocios': {
    roleId: 'role-assistente-negocios',
    fonte: 'planilha',
    tituloOficial: `ASSISTENTE DE NEGÓCIOS`,
    objetivoFamilia: `Suportar a área de negócios da agência no atendimento e atividades transacionais.`,
    nivelMaturidade: `Cargos responsáveis por executar atividades rotineiras de suporte ao negócio e/ou suporte administrativo, seguindo procedimentos operacionais definidos. Atuam com foco na execução, com autonomia limitada à sua área de atuação e dentro de alçadas previamente estabelecidas. As habilidades e conhecimentos necessários são adquiridos principalmente por meio da prática no dia a dia.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Apoiar a área de negócios na agência`,
        descricao: `Receber documentos, conferir o cumprimento das formalidades legais das operações e auxiliar na preparação das rotinas, contribuindo para um atendimento mais ágil e eficiente nas demandas dos associados.`,
      },
      {
        titulo: `Atendimento`,
        descricao: `Atender associados e comunidade nas dependências da agência. Contribuir com a identificação de oportunidades de negócios, acolher a demanda de atendimento e, quando de baixa complexidade, solucioná-la ou direcionar o associado para o canal que gere a melhor experiência de atendimento. Apoiar na orientação para que os associados utilizem melhor os produtos e tecnologias disponíveis.`,
      },
      {
        titulo: `Prospecção (apoio)`,
        descricao: `Identificar oportunidades de novos negócios, prospecção de novos associados e encaminhar para os Gerentes de Negócios. Realizar o primeiro atendimento do associado. Recepcionar e acolher os associados e comunidade e direcioná-los para o canal que gere a melhor experiência de atendimento, seja ele físico ou digital.`,
      },
      {
        titulo: `Cobrança`,
        descricao: `Apoiar na cobrança das operações de crédito em situações de inadimplência e dentro dos prazos de negociação, conforme orientação da área de negócios, visando o retorno do capital emprestado.`,
      },
      {
        titulo: `Canais de Relacionamento`,
        descricao: `Fomentar a interação dos associados com os canais de autoatendimento, visando a agilidade e o direcionamento dos associados para as soluções digitais. Auxiliar os associados com a sua "inclusão digital". Ser agente da mudança do associado, oferecendo orientações para que utilize da melhor forma os serviços digitais disponíveis.`,
      },
      {
        titulo: `Integração de novos Associados`,
        descricao: `Apoiar, quando necessário, o processo de integração de novos associados, esclarecendo dúvidas básicas e apresentando os canais de relacionamento. Assim como, explicar sobre o Sicredi, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Agente da Comunidade`,
        descricao: `Atuar como apoio eventual em eventos da cooperativa, colaborando com a organização e promoção dos valores do cooperativismo.`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Apoiar na operacionalização de serviços como recebimentos, pagamentos, consultas diversas, abertura, fechamento e controle de numerário no terminal de caixa. Atuar na prevenção de fraudes e lavagem de dinheiro.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Auxiliar os Gerentes de Negócios no cadastro e atualização dos dados dos associados, garantindo conformidade com os normativos internos.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Auxiliar a correta aplicação dos normativos e orientações Sistêmicas e Locais.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Em Andamento)`,
      experiencia: `Desejável 6 meses de atendimento ao público`,
      areasFormacao: `Administração
Economia
Marketing
Áreas afins`,
      idiomas: `0.0`,
      certificacoes: [
        `CPA`
      ],
      cbo: `413205`,
    },
    diferenciais: [],
    preparoTecnico: [
      `Conhecimento básico sobre produtos e serviços financeiros`,
      `Foco no associado`,
      `Comunicação`,
      `Facilidade com a tecnologia`,
      `Organização`,
      `Cooperativismo`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-coordenador-pc': {
    roleId: 'role-coordenador-pc',
    fonte: 'inferido',
    tituloOficial: `COORDENADOR DE PESSOAS E CULTURA`,
    objetivoFamilia: `Liderar a estratégia de pessoas na cooperativa, garantindo aderência ao modelo sistêmico e adaptação ao contexto local.`,
    nivelMaturidade: `Sênior: lidera time de P&C, define estratégia local e influencia decisões da diretoria.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Liderança da estratégia P&C`,
        descricao: `Liderar a estratégia local de pessoas alinhada ao modelo sistêmico Sicredi e às prioridades da cooperativa.`,
      },
      {
        titulo: `Desenvolvimento de lideranças`,
        descricao: `Capacitar e apoiar GAs e gerentes na condução de pessoas, garantindo qualidade do Jeito Sicredi de Ser.`,
      },
      {
        titulo: `Comitês estratégicos`,
        descricao: `Facilitar comitês estratégicos de carreira, sucessão, mapa de talentos e movimentações relevantes da cooperativa.`,
      },
      {
        titulo: `Indicadores e tomada de decisão`,
        descricao: `Estruturar painéis de P&C que sustentem tomada de decisão da diretoria sobre estrutura, desempenho e desenvolvimento.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `People Analytics`,
      `Ciclos de avaliação e desempenho`,
      `Sistemas de gestão de pessoas`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-diretor': {
    roleId: 'role-diretor',
    fonte: 'inferido',
    tituloOficial: `DIRETOR EXECUTIVO`,
    objetivoFamilia: `Liderar a estratégia da Cooperativa, garantindo crescimento sustentável, governança sólida e impacto cooperativista na região de atuação.`,
    nivelMaturidade: `Liderança executiva. Define estratégia, presta contas ao Conselho de Administração e à AGO. Responde por resultado financeiro, governança, riscos e cultura.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Estratégia e governança`,
        descricao: `Definir e executar a estratégia da Cooperativa em alinhamento com o Conselho. Garantir governança cooperativa e prestação de contas à AGO.`,
      },
      {
        titulo: `Resultado financeiro`,
        descricao: `Responder pelo resultado financeiro consolidado da Cooperativa: receita, custo, sobras e capital.`,
      },
      {
        titulo: `Liderança da diretoria`,
        descricao: `Liderar diretores executivos e gerentes regionais, garantindo desdobramento da estratégia e coesão.`,
      },
      {
        titulo: `Relacionamento com a Central`,
        descricao: `Manter relacionamento estratégico com a Central regional e CAS, contribuindo para diretrizes sistêmicas.`,
      },
      {
        titulo: `Cultura e cooperativismo`,
        descricao: `Garantir a vivência do Jeito Sicredi de Ser e dos princípios cooperativistas em toda a Cooperativa.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [
      `MBA em Gestão ou Liderança`,
      `Experiência prévia em liderança formal`,
      `Disponibilidade para mobilidade`
    ],
    preparoTecnico: [],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`,
      `Liderança situacional e desenvolvimento de pessoas`,
      `Tomada de decisão sob pressão`,
      `Visão estratégica e leitura de cenário`
    ],
  },
  'role-fundacao': {
    roleId: 'role-fundacao',
    fonte: 'inferido',
    tituloOficial: `ANALISTA DA FUNDAÇÃO SICREDI`,
    objetivoFamilia: `Atuar na Fundação Sicredi com foco em educação, cultura, sustentabilidade e desenvolvimento comunitário.`,
    nivelMaturidade: `Pleno: domínio técnico em sua área, contribui para programas socioambientais do Sicredi.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Programas socioambientais`,
        descricao: `Contribuir para construção e execução de programas de educação, cultura, sustentabilidade e desenvolvimento comunitário.`,
      },
      {
        titulo: `Articulação com cooperativas`,
        descricao: `Articular com cooperativas filiadas a execução local de programas da Fundação.`,
      },
      {
        titulo: `Mensuração de impacto`,
        descricao: `Mensurar e comunicar o impacto socioambiental dos programas da Fundação.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `Compliance e PLD`,
      `Procedimentos operacionais e contábeis`,
      `Sistemas internos de back-office`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gerente-agencia': {
    roleId: 'role-gerente-agencia',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE AGÊNCIA II`,
    objetivoFamilia: `O Gerente de Agência é responsável por liderar e executar o planejamento estratégico da agência, projetando e implementando ações necessárias para a manutenção e ampliação da base de associados, além de incrementar os resultados de negócios do segmento. Mantendo o crescimento dos resultados da agência de forma sustentável, com um compromisso contínuo em proporcionar uma experiência positiva no atendimento aos associados.

Além disso, o GA é um agente mobilizador do cooperativismo, promovendo seus valores, fortalecendo o vínculo com a comunidade e impulsionando o desenvolvimento local. Também é o principal responsável por cultivar e disseminar a cultura cooperativista na agência, assegurando que os princípios do cooperativismo estejam presentes nas práticas, decisões e no ambiente organizacional. Atua ainda como principal gestor da equipe, sendo responsável pela gestão das pessoas colaboradoras da agência, promovendo o desenvolvimento técnico e comportamental, o engajamento e a construção de um ambiente de trabalho saudável e de alta performance.`,
    nivelMaturidade: `Prove liderança para coordenadores e/ou profissionais. É responsável pelo desempenho e resultados da disciplina sob sua responsabilidade. Desenvolve planos para sua área, incluindo o negócio, produção e/ou prioridades organizacionais. Decisões são guiadas pela disponibilidade de recursos e objetivos funcionais. Resolve problemas que impactam eficiência da própria área.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestão da Agência`,
        descricao: `Desdobrar e implementar o planejamento estratégico da agência, garantindo o cumprimento das metas e objetivos estabelecidos. Projetar e conduzir ações voltadas à manutenção e ampliação da base de associados e ao incremento dos resultados de negócios do segmento. Responsável por traduzir e operacionalizar o planejamento de desenvolvimento da agência, com base nas diretrizes fornecidas pela Cooperativa em conjunto com líder imediato, atuando com autonomia e amplitude de decisões.`,
      },
      {
        titulo: `Agente da Comunidade`,
        descricao: `Promover e organizar eventos comunitários, fortalecendo o relacionamento com a comunidade e parceiros locais. Responder pela gestão dos Programas de Desenvolvimento Local, incentivando o engajamento dos associados e articulando parcerias estratégicas. Atuar no desenvolvimento e acompanhamento de projetos, fomentando o cooperativismo e a presença institucional da Cooperativa na comunidade.`,
      },
      {
        titulo: `Comunicação Estratégica e Reputação`,
        descricao: `Gerenciar a imagem institucional da agência no âmbito local, atuando como porta-voz da Cooperativa e promovendo a marca empregadora e a cultura cooperativista.`,
      },
      {
        titulo: `Experiência dos Associados`,
        descricao: `Monitorar e analisar a satisfação e a qualidade do atendimento nos canais digitais, autoatendimento e rede credenciada. Fomentar o uso dos canais conforme o modelo de relacionamento e propor melhorias contínuas para ampliar resultados e garantir uma experiência de excelência.`,
      },
      {
        titulo: `Integrador de novos associados`,
        descricao: `Garantir a integração de novos associados, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Inteligência de Negócios e Análise de Dados`,
        descricao: `Acompanhar os relatórios operacionais e financeiros, avaliando o desempenho da agência e identificando padrões de comportamento dos associados. Utilizar dados para antecipar demandas, apoiar decisões estratégicas e orientar a equipe na busca por melhores resultados.`,
      },
      {
        titulo: `Orientação Financeira`,
        descricao: `Prestar, quando necessário e/ou em conjunto com os Gerentes de Negócios (GNs), orientação financeira aos associados, oferecendo soluções personalizadas e estratégias financeiras, tanto na agência quanto em visitas externas. . Oferecer informações técnicas sobre produtos e serviços, com o objetivo de qualificar o atendimento, apoiar decisões financeiras dos associados e efetivar negociações. Atuar de forma integrada com os GNs e demais áreas da Cooperativa, assegurando uma abordagem consultiva, estratégica e orientada para resultados, observando a necessidade do associado.`,
      },
      {
        titulo: `Desenvolvimento de Negócios`,
        descricao: `Identificar e explorar oportunidades de negócios, promovendo o crescimento sustentável da base de associados. Administrar e desenvolver carteiras de associados, em conjunto com os Gerentes de Negócios, alinhando ao planejamento estratégico da segmentação. Realizar visitas estratégicas e personalizadas, avaliando o perfil e o grau de risco dos associados e prospectos, conduzindo negociações com abordagem consultiva, foco em fidelização e desenvolvimento do relacionamento com o associado.
	• Gestor de carteira de associados: Quando necessário e/ou em conjunto dos Gerentes de Negócios (GNs), administrar e desenvolver carteira de associados, promovendo a agenda comercial e alinhando as ações do planejamento estratégico da segmentação aos objetivos da agência. 
	• Prospecção e Visitas: Quando necessário, prospectar novos associados, conhecendo o ramo de atividade desempenhada pelo associado e seu grau de endividamento/risco. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados. Registrar oportunidades futuras e manter contato com associados, comprovando interesse verdadeiro e mantendo relacionamento por meio de atendimento e negócios. Realizar visitas recorrentes aos associados e aos prospectos, visando concretizar novos negócios e fortalecer o relacionamento com os associados com uma abordagem estratégica e personalizada.`,
      },
      {
        titulo: `Gestão de Crédito e Cobrança`,
        descricao: `Acompanhar a carteira de crédito da agência, monitorando inadimplência, limites excedidos (over) e operações em risco. Conduzir ou apoiar negociações mais complexas, buscando soluções sustentáveis e alinhadas às diretrizes da Cooperativa. Atuar de forma preventiva e corretiva, em conjunto com os GNs e áreas especializadas, visando a saúde financeira da carteira e a mitigação de riscos.`,
      },
      {
        titulo: `Gestão Operacional e Patrimonial`,
        descricao: `Supervisionar as operações da agência, assegurando conformidade com políticas, segurança das transações e controle financeiro. Acompanhar a dinâmica da agência, garantindo fluidez nos atendimentos e minimização de gargalos. Acionar áreas especialistas da Sede quando necessário. Gerenciar estruturas físicas, mobiliário, veículos e demais bens da Cooperativa, zelando pela funcionalidade e manutenção adequada.`,
      },
      {
        titulo: `Pessoas e Cultura`,
        descricao: `Desenvolver a equipe da agência, promovendo um ambiente de aprendizado contínuo e alta performance. Participar de processos seletivos, garantir integração adequada, realizar avaliações periódicas e fomentar o desenvolvimento técnico e comportamental. Acionar a área de Pessoas e Cultura da Cooperativa sempre que necessário. 
	• Gestão de Pessoas: responsável pela garantia da gestão das pessoas, promover o desenvolvimento dos colaboradores, acompanhamento de PDI, gestão de desempenho, ciclo de reconhecimento, etc.
	• Cultura e Clima Organizacional: Promover o propósito, missão e valores do Sicredi, zelando por um ambiente de trabalho seguro, saudável e alinhado à cultura cooperativista. Integrador de novos associados:  Ser referência na promoção da cultura do Sicredi.
	• Agente de Transformação: Promover, intermediar e facilitar as transformações necessárias junto à Cooperativa, contribuindo para a evolução contínua da agência e da equipe.`,
      },
      {
        titulo: `Requisitos legais e Controles`,
        descricao: `Gerir os riscos inerentes as operações da agência. Responder pela movimentação financeira. Atuar como representante da agência, quando necessário, de acordo com suas responsabilidades legais. Garantir a correta aplicação do código de conduta,  normativos sistêmicos e locais.`,
      },
      {
        titulo: `Ouvidoria`,
        descricao: `Gerenciar as demandas de ouvidoria junto à equipe, assegurando a resolução eficaz das solicitações dos associados. Atuar de forma preventiva para reduzir o volume de reclamações, promovendo melhorias contínuas nos processos e no atendimento.`,
      },
      {
        titulo: `Inovação`,
        descricao: `Fomentar um ambiente favorável à transformação digital na agência, alinhado às diretrizes estratégicas da Cooperativa, promovendo a adoção de novas tecnologias e soluções inovadoras.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Especialização/MBA (em andamento)`,
      experiencia: `4 anos`,
      areasFormacao: `Administração,  Economia, Engenharia Agrônoma, Engenharia florestal, Ciências Atuariais, Contábeis, Gestão do Agronegócio, Gestão Empresarial, Gestão Financeira, Zootecnia, Matemática e áreas afins`,
      idiomas: `Não exigido`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `141710`,
    },
    diferenciais: [
      `MBA em Gestão, Liderança ou Cooperativismo`,
      `Experiência prévia em liderança formal de equipes`,
      `Disponibilidade para mobilidade entre agências`,
      `Inglês ou Espanhol intermediário`
    ],
    preparoTecnico: [
      `Produtos e serviços financeiros`,
      `Sistema Financeiro Nacional`,
      `Matemática financeira`,
      `Lei geral de micro e pequenas empresas`,
      `Legislação empresarial`,
      `Agronegócio`,
      `Lei da agricultura familiar`,
      `Crédito rural`,
      `Negociação`,
      `Gestão de Pessoas`,
      `Inteligência Emocional`,
      `Visão de negócio financeiro`,
      `Relacionamento`,
      `Orientação para servir`,
      `Mentor financeiro`,
      `Cooperativismo de crédito`,
      `Foco no associado`,
      `Raciocínio analítico`,
      `Multiplicador de conhecimento`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`,
      `Liderança situacional e desenvolvimento de pessoas`,
      `Tomada de decisão sob pressão`,
      `Visão estratégica e leitura de cenário`
    ],
  },
  'role-gerente-regional': {
    roleId: 'role-gerente-regional',
    fonte: 'inferido',
    tituloOficial: `GERENTE REGIONAL DE DESENVOLVIMENTO`,
    objetivoFamilia: `Liderar o desenvolvimento dos negócios da Cooperativa em uma região, ampliando a base de associados, fortalecendo o relacionamento com a comunidade e desenvolvendo a equipe de Gerentes de Agência.`,
    nivelMaturidade: `Liderança regional sênior. Atua com visão estratégica, autonomia plena de decisão e responsabilidade ampla por estrutura, resultados e desenvolvimento de pessoas em múltiplas agências.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Identificar oportunidades e espaços de expansão dos negócios`,
        descricao: `Interpretar o mercado de atuação e sua evolução; analisar ações concorrenciais e propor adaptações; avaliar Share, IPP e indicadores de penetração.`,
      },
      {
        titulo: `Desenvolver a equipe e a si próprio técnica e comportamentalmente`,
        descricao: `Propor a equipe individualmente ações de desenvolvimento por meio de feedback técnico e comportamental; promover trocas de experiências e boas práticas; responsabilizar-se pelas atitudes da equipe.`,
      },
      {
        titulo: `Desdobrar e priorizar ações para o planejamento estratégico`,
        descricao: `Elaborar planos para indicadores definidos pela diretoria; interpretar com GAs gaps de desempenho; promover rituais de acompanhamento executor dos gestores.`,
      },
      {
        titulo: `Manter e potencializar relacionamento com associados estratégicos e parceiros`,
        descricao: `Realizar visitas estratégicas; elaborar ações com parceiros de negócios; demonstrar caminhos de penetração em nichos da comunidade.`,
      },
      {
        titulo: `Garantir e zelar pelas estruturas necessárias`,
        descricao: `Acompanhar tamanho e eficiência das estruturas (pessoas e física); verificar aceitação e formato de atuação dos GAs e suas equipes; identificar necessidades dos associados atrelado ao formato de entrega.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [
      `MBA em Gestão ou Liderança`,
      `Experiência prévia em liderança formal`,
      `Disponibilidade para mobilidade`
    ],
    preparoTecnico: [],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`,
      `Liderança situacional e desenvolvimento de pessoas`,
      `Tomada de decisão sob pressão`,
      `Visão estratégica e leitura de cenário`
    ],
  },
  'role-gn-pf1': {
    roleId: 'role-gn-pf1',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS PF I`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades predominantemente básicas ou intermediárias. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com base em procedimentos estabelecidos, sob orientação quando em necessidade. Opera nos sistemas da Agência e contribui para a eficiência da área. Está em processo de formação técnica e desenvolvimento profissional.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Administrar e desenvolver a carteira de associados de Pessoa Física (PF), cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras adequadas às necessidades dos associados, comercializando produtos e serviços alinhados aos objetivos estabelecidas, visando o cumprimento do planejamento estratégico da segmentação em que atua. Gestor de carteiras de negócios com renda e investimentos de baixo à média complexidade.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada, o grau de risco e o momento financeiro do prospecto. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Manter contato diário e proativo com associados e prospectos, identificando oportunidades e necessidades. Aplicar técnicas de venda consultiva, compreendendo o contexto do associado para ofertar soluções personalizadas, alinhadas ao seu momento de vida e aos princípios do cooperativismo.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `Utilizar dados da carteira para estimular os associados sobre soluções financeiras adequadas. Apoiar nas decisões sobre produtos e serviços, criando estratégias para a vida financeira e gerando impacto positivo nas comunidades onde a Cooperativa está inserida.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir os indicadores e objetivos da carteira, com foco no cooperativismo e na entrega de valor ao associado. Acompanhar os resultados e planejar ações para alcançá-los ou superá-los.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e ações judiciais. Acompanhar créditos concedidos quanto à pontualidade, risco e degradação, atuando de forma preventiva e corretiva.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e soluções digitais, promovendo agilidade, autonomia e eficiência no relacionamento.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi e tirando dúvidas, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, eventualmente e conforme demanda, transações financeiras de pagamentos, recebimentos e transferências. Assim como prestar orientação para que os associados utilizem melhor os produtos e tecnologias disponíveis.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Gerenciar o tempo entre atendimentos presenciais, digitais e visitas externas, garantindo equilíbrio entre relacionamento, prospecção e acompanhamento da carteira.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Responder pela correta aplicação dos normativos e orientações Sistêmicas e Locais.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Em Andamento)`,
      experiencia: `02 anos`,
      areasFormacao: `Gestão Financeira e Áreas Correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `CPA-20 ou CEA`,
      `Experiência em wealth management ou private`,
      `Cursos de comportamento do cliente / análise de perfil`
    ],
    preparoTecnico: [
      `Conhecimento básico sobre produtos e serviços financeiros`,
      `Economia básica`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gn-pf2': {
    roleId: 'role-gn-pf2',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS PF II`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com demandas variadas e de complexidade predominantemente intermediária. Apesar do título de “Gerente”, não exerce gestão de pessoas. Possui conhecimento do seu segmento e autonomia moderada para tomada de decisões. Identifica soluções para problemas que impactam a eficiência e a eficácia da área. Recebe orientação pontual e contribui para o aprimoramento de processos e resultados da equipe.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Responder pela administração e desenvolvimento da carteira de associados de Pessoa Física (PF), cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras adequadas às necessidades dos associados, comercializando produtos e serviços alinhados aos objetivos da Cooperativa e ao planejamento estratégico da segmentação. Atuar com foco consultivo, promovendo o relacionamento de longo prazo e o fortalecimento do vínculo com o cooperado. Responsável por carteiras com renda e investimentos de média a alta complexidade.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada, o grau de risco e o momento financeiro do prospecto. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Contato diário e proativo com associados e prospectos, para identificação de negócios  e oportunidades. Utilizar técnicas de vendas e aplica-las no atendimento ao associado, sempre primando pelo atendimento alinhado a necessidade do associado.  Conhecer as soluções que o Sicredi proporciona para os associados para que, no atendimento consultivo, o GN possa entender a necessidade e ofertar aquilo que mais se adequa a realidade do associado/prospecto.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `A partir de dados da carteira, estimular os associados sobre soluções financeiras adequadas ao seu momento de vida. Apoiar nas decisões sobre produtos e serviços, criando estratégias para a vida financeira e gerando impacto positivo nas comunidades onde a Cooperativa está inserida.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir os indicadores e objetivos da carteira, buscando superação dos resultados com foco no cooperativismo e na entrega de valor ao associado.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e ações judiciais. Acompanhar créditos concedidos quanto à pontualidade, risco e degradação, atuando de forma preventiva e corretiva.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de auto atendimento e auto serviço, visando a agilidade e o direcionamento dos associados para as soluções digitais.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Transações financeiras e orientações de base`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras como pagamentos, recebimentos e transferências, na ausência ou em conjunto com o Assistente. Orientar os associados sobre o uso adequado dos produtos e tecnologias disponíveis.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Gerenciar o tempo entre atendimentos presenciais, digitais e visitas externas, garantindo equilíbrio entre relacionamento, prospecção e acompanhamento da carteira.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Concluído)`,
      experiencia: `De 02 a 05 anos`,
      areasFormacao: `Gestão Financeira e Áreas Correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `CPA-20 ou CEA`,
      `Experiência em wealth management ou private`,
      `Cursos de comportamento do cliente / análise de perfil`
    ],
    preparoTecnico: [
      `Conhecimento sobre produtos e serviços financeiros`,
      `Cooperativismo de crédito`,
      `Economia básica`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gn-pf3': {
    roleId: 'role-gn-pf3',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS PF III`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades amplas e de complexidade predominantemente alta. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com alta autonomia, orientando profissionais menos experientes e influenciando decisões estratégicas da área. Possui profundo conhecimento técnico e de negócio, sendo referência para a equipe. Resolve problemas complexos com impacto relevante na área e na organização.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Responder pela administração e desenvolvimento da carteira de associados de Pessoa Física (PF), cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras adequadas às necessidades dos associados, comercializando produtos e serviços alinhados aos objetivos da Cooperativa e ao planejamento estratégico da segmentação. Atuar com foco consultivo, promovendo o relacionamento de longo prazo e o fortalecimento do vínculo com o cooperado. Responsável por carteiras com predominância de alta complexidade, incluindo renda elevada, investimentos sofisticados e demandas financeiras personalizadas.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada, o grau de endividamento e o perfil de risco. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Contato diário e proativo com associados e prospectos, para identificação de negócios existentes e oportunidades. Aplicar técnicas de vendas no atendimento ao associado, sempre primando pelo atendimento alinhado à necessidade do associado. Dominar com profundidade as soluções que o Sicredi proporciona, garantindo uma abordagem altamente personalizada e estratégica.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `A partir de dados da carteira, estimular os associados sobre soluções financeiras adequadas ao seu momento de vida. Apoiar nas decisões sobre produtos e serviços, criando estratégias para a vida financeira e gerando impacto positivo nas comunidades onde a Cooperativa está inserida.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Acompanhar, propor e analisar indicadores estratégicos da carteira, traçando ações para alavancar os resultados esperados e superá-los, sempre com o associado no centro da estratégia e com foco no cooperativismo`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e envolvimento judicial. Acompanhar créditos concedidos quanto a pontualidade de pagamento, quanto à degradação de risco eventual de cada operação e buscar os créditos concedidos mitigando a necessidade de trabalho extrajudicial ou judicial.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, promovendo agilidade e autonomia. Prestar orientação sobre o uso de produtos e tecnologias, incentivando a digitalização com foco na experiência do associado.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Apoio Técnico`,
        descricao: `Contribuir com a formação funcional dos colegas, apoiando-os tecnicamente na utilização dos sistemas, no aculturamento do Cooperativismo e nas atividades necessárias ao suporte da carteira de forma a garantir a satisfação do associado e o cumprimento do planejamento da carteira.`,
      },
      {
        titulo: `Transações financeiras e orientações de base`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras como pagamentos, recebimentos e transferências, na ausência ou em conjunto com o Assistente. Orientar os associados sobre o uso adequado dos produtos e tecnologias disponíveis.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Especialização/MBA (Em Andamento)`,
      experiencia: `Acima de 05 anos`,
      areasFormacao: `Gestão Financeira e Áreas Correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `CPA-20 ou CEA`,
      `Experiência em wealth management ou private`,
      `Cursos de comportamento do cliente / análise de perfil`
    ],
    preparoTecnico: [
      `Conhecimento avançado sobre produtos e serviços financeiros`,
      `Cooperativismo de crédito`,
      `Economia`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gn-pf4': {
    roleId: 'role-gn-pf4',
    fonte: 'inferido',
    tituloOficial: `GERENTE DE NEGÓCIOS PF IV`,
    objetivoFamilia: `Atender carteiras de altíssima complexidade e renda, atuando como referência técnica regional em PF e Investimentos.`,
    nivelMaturidade: `Especialista sênior em PF / Wealth. Atua com autonomia, contribui para formação de pares juniores e influencia diretrizes da segmentação.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestão de carteira premium`,
        descricao: `Responder por carteira de associados de altíssima renda e complexidade patrimonial, com abordagem consultiva e personalizada.`,
      },
      {
        titulo: `Wealth management`,
        descricao: `Estruturar planos financeiros completos: investimentos, previdência, sucessão patrimonial, proteção e crédito estratégico.`,
      },
      {
        titulo: `Referência técnica`,
        descricao: `Atuar como referência técnica regional em produtos PF e investimentos, contribuindo para formação de GNs juniores.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir e superar indicadores estratégicos da carteira premium, com foco em fidelização de longo prazo.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [
      `CPA-20 ou CEA`,
      `Experiência em wealth management ou private`,
      `Cursos de comportamento do cliente / análise de perfil`
    ],
    preparoTecnico: [
      `Análise de perfil financeiro do associado`,
      `Cross-selling de produtos financeiros`,
      `Análise de crédito PF`,
      `Sistemas internos do Sicredi`,
      `Matemática financeira`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gn-pj1': {
    roleId: 'role-gn-pj1',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS PJ I`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades predominantemente básicas ou intermediárias. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com base em procedimentos estabelecidos, sob orientação quando em necessidade. Opera nos sistemas da Agência e contribui para a eficiência da área. Está em processo de formação técnica e desenvolvimento profissional.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Responder pela administração e desenvolvimento da carteira de associados de Pessoa Jurídica (PJ), cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras adequadas às necessidades dos associados, comercializando produtos e serviços alinhados aos objetivos da Cooperativa e ao planejamento estratégico da segmentação em que atua. Gestor de carteiras de negócios com renda e investimentos de baixa à média complexidade.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada, o grau de risco e o momento financeiro do prospecto. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados (foco em PJ). Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Visita aos Associados e Prospectos`,
        descricao: `Realizar visitas recorrentes aos associados e prospectos, com foco em PJ, visando a geração de novos negócios e o fortalecimento do relacionamento presencial.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Realizar a Gestão de tempo entre atendimentos de canais digitais e visitas/atendimentos presenciais.`,
      },
      {
        titulo: `Venda consultiva`,
        descricao: `Manter contato diário e proativo com associados e prospectos, identificando oportunidades e necessidades. Aplicar técnicas de venda consultiva, compreendendo o contexto do associado para ofertar soluções personalizadas, alinhadas ao seu momento e aos princípios do cooperativismo.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `A partir de dados da carteira, estimular os associados sobre soluções financeiras adequadas ao seu momento. Apoiar nas decisões sobre produtos e serviços, criando estratégias para a vida financeira e gerando impacto positivo nas comunidades onde a Cooperativa está inserida.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e envolvimento judicial. Acompanhar créditos concedidos quanto a pontualidade de pagamento, quanto à degradação de risco eventual de cada operação e buscar os créditos concedidos mitigando a necessidade de trabalho extrajudicial ou judicial.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir os indicadores e objetivos da carteira, com foco no cooperativismo e na entrega de valor ao associado. Acompanhar os resultados e planejar ações para alcançá-los ou superá-los.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, promovendo agilidade e autonomia. Prestar orientação sobre o uso adequado dos produtos e tecnologias disponíveis.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas, visando o engajamento do associado com os valores do cooperativismo.`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Apoiar a realização de transações financeiras nos canais disponíveis, realizando, eventualmente e conforme demanda, operações de maior complexidade como pagamentos, recebimentos e transferências.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Em Andamento)`,
      experiencia: `02 anos`,
      areasFormacao: `Gestão Financeira e Áreas Correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `CPA-20`,
      `Experiência em crédito empresarial ou estruturado`,
      `Conhecimento avançado de análise de balanços`
    ],
    preparoTecnico: [
      `Conhecimento básico sobre produtos e serviços financeiros`,
      `Economia básica`,
      `Lei geral de micro e pequenas empresas`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gn-pj2': {
    roleId: 'role-gn-pj2',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS PJ II`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com demandas variadas e de complexidade predominantemente intermediária. Apesar do título de “Gerente”, não exerce gestão de pessoas. Possui conhecimento do seu segmento e autonomia moderada para tomada de decisões. Identifica soluções para problemas que impactam a eficiência e a eficácia da área. Recebe orientação pontual e contribui para o aprimoramento de processos e resultados da equipe.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Administrar e desenvolver uma carteira de associados de Pessoa Jurídica (PJ) de média e alta complexidade, cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras mais sofisticadas e adequadas às necessidades dos associados, comercializando produtos e serviços alinhados aos objetivos da Cooperativa e ao planejamento estratégico da segmentação em que atua.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada pelo associado e seu grau de risco. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados (foco em PJ), com uma abordagem mais estratégica. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Visita aos Associados e Prospectos`,
        descricao: `Realizar visitas recorrentes aos associados e aos prospectos, com foco em PJ, visando a geração de novos negócios e o fortalecimento do relacionamento presencial.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Cumprir com o equilíbrio e estratégia dos atendimentos de canais digitais e visitas/atendimentos presenciais.`,
      },
      {
        titulo: `Venda Consultiva`,
        descricao: `Manter contato proativo com associados e prospectos, identificando oportunidades e necessidades. Aplicar técnicas de venda consultiva, compreendendo o contexto do associado para ofertar soluções personalizadas, alinhadas ao seu momento e aos princípios do cooperativismo.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `A partir de dados da carteira, estimular os associados sobre soluções financeiras adequadas ao seu momento. Apoiar nas decisões sobre produtos e serviços, criando estratégias detalhadas para a vida financeira e gerando impacto positivo nas comunidades onde a Cooperativa está inserida.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir com os indicadores e objetivos da carteira, com foco no cooperativismo e na entrega de valor ao associado. Acompanhar os resultados e planejar ações para alcançá-los ou superá-los.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e envolvimento judicial. Acompanhar créditos concedidos quanto a pontualidade de pagamento, quanto à degradação de risco eventual de cada operação e buscar os créditos concedidos mitigando a necessidade de trabalho extrajudicial ou judicial.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, visando agilidade e direcionamento para as soluções digitais. Prestar orientação para que os associados utilizem melhor os produtos e tecnologias disponíveis, com foco em soluções mais avançadas.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi e tirando dúvidas, visando o engajamento com os valores do cooperativismo, com uma abordagem mais aprofundada por meio da condução dos Programas do Cooperativismo.`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras de pagamentos, recebimentos e transferências.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Ensino Superior (Concluído)`,
      experiencia: `De 02 a 05 anos`,
      areasFormacao: `Gestão Financeira e Áreas Correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `CPA-20`,
      `Experiência em crédito empresarial ou estruturado`,
      `Conhecimento avançado de análise de balanços`
    ],
    preparoTecnico: [
      `Conhecimento sobre produtos e serviços financeiros`,
      `Cooperativismo de crédito`,
      `Lei geral de micro e pequenas empresas`,
      `Economia básica`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`,
      `Legislação Empresarial`,
      `Capacidade de negociação`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-gn-pj3': {
    roleId: 'role-gn-pj3',
    fonte: 'planilha',
    tituloOficial: `GERENTE DE NEGÓCIOS PJ III`,
    objetivoFamilia: `Atuar de forma simples, próxima e proativa no relacionamento com os associados, acolhendo suas necessidades e oferecendo soluções adequadas. Contribuir para o crescimento sustentável da base de associados, promovendo a inclusão financeira e o fortalecimento do vínculo com a cooperativa. Disseminar os valores e princípios do cooperativismo por meio de ações locais com os associados e com a comunidade, gerando impacto positivo e fortalecendo o papel da cooperativa na construção de uma sociedade mais próspera.`,
    nivelMaturidade: `Cargos responsáveis por realizar atendimento consultivo aos associados. Atuação recomendada para atendimento de associados com necessidades amplas e de complexidade predominantemente alta. Apesar do título de “Gerente”, não exerce gestão de pessoas. Atua com alta autonomia, orientando profissionais menos experientes e influenciando decisões estratégicas da área. Possui profundo conhecimento técnico e de negócio, sendo referência para a equipe. Resolve problemas complexos com impacto relevante na área e na organização.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Gestor de carteira de associados`,
        descricao: `Administrar e desenvolver uma carteira de associados de Pessoa Jurídica (PJ), com predominância de alta complexidade, cumprindo a agenda comercial estabelecida. Apresentar soluções financeiras sofisticadas e personalizadas, alinhadas aos objetivos da Cooperativa e ao planejamento estratégico da segmentação em que atua. Atuar com autonomia, visão estratégica e foco consultivo, promovendo o relacionamento de longo prazo e o fortalecimento do vínculo com o cooperado.`,
      },
      {
        titulo: `Prospecção`,
        descricao: `Prospectar novos associados e negócios, conhecendo o ramo de atividade desempenhada, o grau de risco e o momento financeiro do prospecto. Realizar visitas para concretizar novos negócios e fortalecer o relacionamento com os associados (foco em PJ), com uma abordagem estratégica e personalizada. Registrar oportunidades futuras e manter contato ativo, demonstrando interesse genuíno e promovendo soluções adequadas.`,
      },
      {
        titulo: `Visita aos Associados e Prospectos`,
        descricao: `Realizar visitas recorrentes aos associados e prospectos, com foco em PJ, visando a geração de novos negócios e o fortalecimento do relacionamento presencial, com foco em soluções de maior complexidade.`,
      },
      {
        titulo: `Gestão de Tempo`,
        descricao: `Cumprir com o equilíbrio e estratégia dos atendimentos de canais digitais e visitas/atendimentos presenciais.`,
      },
      {
        titulo: `Venda Consultiva`,
        descricao: `Manter contato proativo com associados e prospectos, identificando oportunidades e necessidades. Aplicar técnicas de venda consultiva com domínio das soluções financeiras do Sicredi, garantindo uma abordagem altamente personalizada e estratégica, alinhada aos princípios do cooperativismo.`,
      },
      {
        titulo: `Orientação financeira`,
        descricao: `A partir de dados da carteira, realizar estímulos para os associados sobre soluções financeiras avançadas, verificando se fazem sentido para o momento de vida. Apoiar os associados em suas decisões sobre produtos e serviços financeiros, criando estratégias detalhadas para a vida financeira e gerando impacto positivo nas comunidades onde a cooperativa está inserida.`,
      },
      {
        titulo: `Gestão de inadimplência`,
        descricao: `Controlar os níveis de endividamento da carteira e elaborar medidas para resolver a inadimplência, evitando custos e ações judiciais. Acompanhar créditos concedidos quanto à pontualidade, risco e degradação, atuando de forma preventiva e corretiva, com foco em sustentabilidade da carteira.`,
      },
      {
        titulo: `Resultados`,
        descricao: `Cumprir com os indicadores e resultados da carteira, com foco no cooperativismo e na entrega de valor ao associado. Propor ações estratégicas com base em análise de desempenho e oportunidades de crescimento.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, garantindo que estejam 100% atualizados e em conformidade com os normativos internos.`,
      },
      {
        titulo: `Canais de atendimento`,
        descricao: `Facilitar a interação dos associados com os canais de autoatendimento e autosserviço, visando agilidade e direcionamento para as soluções digitais. Prestar orientação para que os associados utilizem melhor os produtos e tecnologias disponíveis, com foco em soluções avançadas e personalizadas.`,
      },
      {
        titulo: `Manutenção de cadastro`,
        descricao: `Realizar, na ausência ou em conjunto com o Assistente, o cadastro e atualizações dos dados dos associados, sendo responsável por mantê-los atualizados e de acordo com os normativos internos.`,
      },
      {
        titulo: `Integração de Novos Associados`,
        descricao: `Realizar a integração de novos associados, explicando sobre o Sicredi, tirando dúvidas e promovendo o engajamento com os valores do cooperativismo, com uma abordagem mais aprofundada por meio da condução dos Programas do Cooperativismo.`,
      },
      {
        titulo: `Transações financeiras`,
        descricao: `Realizar, eventualmente e conforme demanda, transações financeiras de pagamentos, recebimentos e transferências, que necessite maior complexidade.`,
      },
      {
        titulo: `Apoio Técnico`,
        descricao: `Contribuir com a formação funcional dos colegas, atuando como referência técnica. Apoiar na utilização dos sistemas, disseminação da cultura cooperativista e execução das atividades necessárias ao suporte da carteira, garantindo a satisfação do associado e o cumprimento do planejamento.`,
      },
      {
        titulo: `Padronização`,
        descricao: `Assegurar a correta aplicação dos normativos e orientações sistêmicas e locais, mantendo a conformidade e a qualidade dos processos.`,
      },
      {
        titulo: `Responder pelos demais papeis e responsabilidades correlatos`,
        descricao: `Responder pelos demais papeis e responsabilidades correlatos ao cargo.`,
      },
    ],
    requisitos: {
      formacao: `Especialização/MBA (Em Andamento)`,
      experiencia: `Acima de 05 anos`,
      areasFormacao: `Gestão Financeira e Áreas Correlatas`,
      idiomas: `0.0`,
      certificacoes: [
        `C-PRO R`
      ],
      cbo: `253215`,
    },
    diferenciais: [
      `CPA-20`,
      `Experiência em crédito empresarial ou estruturado`,
      `Conhecimento avançado de análise de balanços`
    ],
    preparoTecnico: [
      `Conhecimento avançado sobre produtos e serviços financeiros`,
      `Lei geral de micro e pequenas empresas`,
      `Legislação Empresarial`,
      `Negociação`,
      `Cooperativismo de crédito`,
      `Economia`,
      `Foco no associado`,
      `Organização`,
      `Comunicação clara e objetiva`,
      `Pacote Office`,
      `Sistemático`,
      `Lógica`,
      `Visão Analítica`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
  'role-operacoes': {
    roleId: 'role-operacoes',
    fonte: 'inferido',
    tituloOficial: `ANALISTA DE OPERAÇÕES`,
    objetivoFamilia: `Garantir a execução correta das operações de back-office da agência, em conformidade com normas internas, regulatórias e de compliance.`,
    nivelMaturidade: `Pleno: executa atividades operacionais com autonomia, identifica desvios e propõe melhorias.`,
    responsabilidadesEssenciais: [
      {
        titulo: `Operações de back-office`,
        descricao: `Executar rotinas operacionais da agência: conciliações, conferência de documentos, processos de crédito e demais atividades administrativas.`,
      },
      {
        titulo: `Compliance e PLD`,
        descricao: `Garantir o cumprimento de normas internas, regulatórias e de prevenção à lavagem de dinheiro em todas as operações.`,
      },
      {
        titulo: `Suporte à frente comercial`,
        descricao: `Apoiar GNs e GA com análises e processamentos que viabilizam o atendimento consultivo aos associados.`,
      },
      {
        titulo: `Melhoria contínua`,
        descricao: `Identificar oportunidades de simplificação de processos e propor melhorias operacionais.`,
      },
    ],
    requisitos: {
      formacao: ``,
      experiencia: ``,
      areasFormacao: ``,
      idiomas: ``,
      certificacoes: [],
      cbo: ``,
    },
    diferenciais: [],
    preparoTecnico: [
      `Compliance e PLD`,
      `Procedimentos operacionais e contábeis`,
      `Sistemas internos de back-office`
    ],
    preparoComportamental: [
      `#GENTE QUE FAZ JUNTO — colaboração e coautoria`,
      `#GENTE QUE ENTENDE DE GENTE — escuta ativa, empatia`,
      `#GENTE QUE FAZ O CERTO — integridade e ética`,
      `#GENTE QUE GERA CONFIANÇA — coerência e cumprimento de combinados`,
      `#GENTE COM QUEM CONTAR — disponibilidade e prontidão`
    ],
  },
};

export function getAtribuicoesByRoleId(roleId: string): AtribuicoesCargo | undefined {
  return atribuicoesCargos[roleId];
}
