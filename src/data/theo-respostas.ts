// ============================================================
// THEO — Respostas pré-scripted por persona
// ============================================================
// Cada resposta:
//   - Usa dados REAIS do hub (competências Sicredi, prontidão, equipe)
//   - Cita pessoas e cargos COERENTES com a base atual
//   - Traz "actions" — botões CTA que linkam para outras telas
//
// Regra de coerência: nunca cita nome de colaborador que não exista
// em employees.ts. Nunca cita métrica que diverge do hub.
// ============================================================

import { PersonaHub } from './persona-hub';

export interface TheoAction {
  label: string;
  href: string;
}

export interface TheoResposta {
  prompt: string;
  /** Texto da resposta (Markdown leve: **negrito**, listas com •, emoji ok) */
  buildContent: (hub: PersonaHub) => string;
  /** Botões CTA renderizados no fim da resposta (linkam para outras páginas) */
  buildActions?: (hub: PersonaHub) => TheoAction[];
}

// ============================================================
// MARIANA — colaboradora
// ============================================================

const respostasMariana: TheoResposta[] = [
  {
    prompt: 'O que falta para eu avançar para o próximo cargo?',
    buildContent: (hub) => {
      const alvo = hub.cargoAlvo?.title || 'seu cargo aspirado';
      const fortes = hub.competenciasSicredi
        .filter((c) => c.consenso === 4)
        .map((c) => c.competencia.nome);
      const fracas = hub.competenciasSicredi
        .filter((c) => c.consenso < 3)
        .map((c) => `**${c.competencia.nome}** (hoje ${c.conceito.hashtag})`);
      const prontidao = hub.gapAlvo?.prontidaoEstimada.nome || '-';
      const tempo = hub.gapAlvo?.tempoEstimado || '-';

      return `Cruzei sua avaliação atual (Ciclo 1/2026) com o que **${alvo}** exige.

📊 **Sua prontidão estimada:** ${prontidao} · horizonte ${tempo}

✅ **Você já atende (mantém o nível):**
${fortes.length > 0 ? fortes.map((f) => `• #arrasou em ${f}`).join('\n') : '• Em construção'}

⚠️ **Onde precisa subir para virar ${hub.cargoAlvo?.shortTitle || 'o próximo cargo'}:**
${fracas.length > 0 ? fracas.map((f) => `• ${f}`).join('\n') : '• Sem gaps críticos identificados'}

📋 **Plano sugerido para 90 dias** (3 ondas):
1. **Mês 1 (quick wins):** completar autoavaliação do ciclo + 1 curso curto de Sicredi Aprende
2. **Mês 2 (consolidação):** mentoria mensal + projeto stretch que exercite competência fraca
3. **Mês 3 (transformação):** liderar mini-projeto na agência para vivência prática

Quer que eu te leve direto pro Plano de Rota completo no GPS?`;
    },
    buildActions: (hub) => [
      { label: 'Abrir Plano de Rota no GPS', href: '/mapa-carreira' },
      { label: 'Ver meu PDI', href: '/pdi' },
    ],
  },

  {
    prompt: 'Me ajude a preparar a 1:1 com meu líder',
    buildContent: (hub) => {
      const lider = hub.pdi?.checkIns.find((c) => c.type === 'completed')?.leaderName || 'seu líder';
      const proxima = hub.pdi?.checkIns.find((c) => c.type === 'scheduled');
      const concAtual = hub.notaFinalPerformance.hashtag;
      const aspRole = hub.cargoAlvo?.title || 'seu cargo aspirado';
      const compFraca = [...hub.competenciasSicredi].sort((a, b) => a.consenso - b.consenso)[0];

      return `Preparei um roteiro para sua próxima conversa com **${lider}**${proxima ? ` (${proxima.date})` : ''}.

📌 **Seus destaques para compartilhar:**
• Conceito atual no ciclo: **${concAtual}**
• Aspiração declarada: **${aspRole}** ${hub.employee.aspirations[0]?.sharedWithLeader ? '(já compartilhada com líder ✓)' : '(ainda não compartilhada)'}
• Tempo no cargo: ${hub.employee.tenureMonths} meses

⚠️ **Ponto a abordar:**
• ${compFraca?.competencia.nome} segue em ${compFraca?.conceito.hashtag}. ${compFraca?.comentarioLider ? `Comentário do líder: "${compFraca.comentarioLider}"` : 'Vale alinhar plano de evolução.'}

💬 **Temas sugeridos:**
1. Validar progresso desde a última conversa
2. Discutir avanços nas ações do PDI
3. Pedir feedback específico sobre evolução para ${hub.cargoAlvo?.shortTitle || 'próximo cargo'}
4. Combinar próximos marcos (mentoria, vivências, certificações)

💡 **Dica:** Pergunte *"O que você recomenda como meu próximo passo?"*. Mostra abertura e maturidade.`;
    },
    buildActions: () => [
      { label: 'Atualizar PDI antes da conversa', href: '/pdi' },
      { label: 'Ver minha avaliação', href: '/avaliacao' },
    ],
  },

  {
    prompt: 'Quais trilhas de desenvolvimento são mais indicadas para mim?',
    buildContent: (hub) => {
      const trilhas = hub.trilhasRecomendadas.slice(0, 3);
      const compFracas = [...hub.competenciasSicredi].sort((a, b) => a.consenso - b.consenso).slice(0, 2);

      return `Baseado no seu perfil de **${hub.cargoAtual.title}** aspirando **${hub.cargoAlvo?.title || 'próximo cargo'}**:

🎯 **Suas competências com maior gap (foco prioritário):**
${compFracas.map((c) => `• ${c.competencia.nome}: hoje ${c.conceito.hashtag}, esperado #arrasou`).join('\n')}

🟢 **Trilhas recomendadas para você:**
${trilhas.length > 0
  ? trilhas.map((t) => `• **${t.title}** (${t.totalDuration})\n  ${t.subtitle}`).join('\n')
  : '• Nenhuma trilha mapeada ainda para sua aspiração'}

💡 **Como priorizar:**
- Comece pelas trilhas que cobrem suas competências mais fracas
- Vá no seu ritmo: cada trilha pode ser fracionada em fases
- Combine trilhas com vivências práticas (job shadow, mentoria) — isso multiplica o impacto

Quer que eu adicione essas trilhas ao seu PDI?`;
    },
    buildActions: () => [
      { label: 'Ver catálogo completo', href: '/desenvolvimento' },
      { label: 'Adicionar ao PDI', href: '/pdi' },
    ],
  },

  // === Tópicos do sidebar ===
  {
    prompt: 'Minha aspiração',
    buildContent: (hub) => {
      const asp = hub.employee.aspirations[0];
      if (!asp || !hub.cargoAlvo) {
        return `Você ainda não declarou uma aspiração de carreira.

💡 **Por que vale a pena declarar:**
- Permite que o sistema personalize trilhas, mentores e experiências para você
- Sinaliza para sua liderança onde você quer chegar
- Guia decisões de movimentação interna

Posso te ajudar a explorar opções no GPS de Carreira.`;
      }
      return `Sua aspiração declarada:

🎯 **${hub.cargoAlvo.title}**
• Horizonte: ${asp.timeframe}
• Status: ${asp.sharedWithLeader ? '✓ Compartilhada com seu líder' : '⚠ Ainda não compartilhada com líder'}
• Confiança: ${asp.confidence}%

📊 **Sua prontidão hoje:** ${hub.gapAlvo?.prontidaoEstimada.nome || '-'}

${!asp.sharedWithLeader
  ? '💡 **Sugestão:** compartilhar a aspiração com seu líder na próxima conversa de carreira facilita as próximas movimentações.'
  : '✅ Sua aspiração já está visível para o líder. Continue construindo evidências no PDI.'}`;
    },
    buildActions: () => [
      { label: 'Ver Plano de Rota completo', href: '/mapa-carreira' },
      { label: 'Editar perfil', href: '/perfil' },
    ],
  },

  {
    prompt: 'Gaps de competência',
    buildContent: (hub) => {
      const gaps = hub.gapAlvo?.competenciasSicredi.filter((g) => g.gap > 0) || [];
      const gapsHabs = hub.gapAlvo?.habilidadesTecnicas.filter((h) => h.gapAlvo > 0) || [];

      return `Análise de gap para **${hub.cargoAlvo?.title || 'cargo aspirado'}**:

🎯 **Competências Jeito Sicredi com gap:**
${gaps.length > 0
  ? gaps.map((g) => `• ${g.competencia.nome}: ${hub.competenciasSicredi.find((c) => c.competencia.id === g.competencia.id)?.conceito.hashtag} → esperado nível ${g.nivelEsperado}`).join('\n')
  : '✓ Você atende todas as 7 competências para esse cargo'}

🛠 **Habilidades técnicas com gap:**
${gapsHabs.length > 0
  ? gapsHabs.slice(0, 5).map((h) => `• ${h.skill.name}: ${h.skill.level} → esperado ${h.nivelEsperadoCargoAlvo}`).join('\n')
  : '✓ Habilidades técnicas alinhadas'}

💡 Cada gap tem ações sugeridas no Plano de Rota do GPS (cursos + mentoria + experiência).`;
    },
    buildActions: () => [
      { label: 'Abrir Plano de Rota', href: '/mapa-carreira' },
      { label: 'Ver minha avaliação', href: '/avaliacao' },
    ],
  },

  {
    prompt: 'Oportunidades internas',
    buildContent: (hub) => {
      return `Oportunidades internas alinhadas ao seu perfil de **${hub.cargoAtual.title}**:

🚀 **Tipos de oportunidade disponíveis:**
• **Vagas formais** — abrem com critérios públicos no Marketplace interno
• **Projetos temporários** — vivências de 4-12 semanas que aceleram desenvolvimento
• **Mentoria estruturada** — pareamento com profissionais sêniores do Sicredi
• **Job shadow** — acompanhar 1 semana o cargo que você aspira
• **Intercâmbio entre cooperativas** — exposição a outros contextos

💡 **Próximo passo concreto:** abra o Marketplace e filtre por "alta compatibilidade" com seu perfil.

🎯 **Lembre-se:** uma boa oportunidade não é apenas a vaga — é a vivência que prepara você para a próxima.`;
    },
    buildActions: () => [
      { label: 'Abrir Oportunidades Internas', href: '/marketplace' },
      { label: 'Ver Experiências disponíveis', href: '/experiencias' },
    ],
  },

  {
    prompt: 'Certificações',
    buildContent: (hub) => {
      const cargoAlvo = hub.cargoAlvo;
      return `Certificações que fazem sentido para sua jornada:

📜 **Para seu cargo atual (${hub.cargoAtual.title}):**
• CPA-10 (obrigatória) ${hub.employee.skills.some((s) => s.name.toLowerCase().includes('cpa')) ? '✓' : ''}

🎯 **Para evoluir para ${cargoAlvo?.title || 'próximo cargo'}:**
• CPA-20 — diferencial forte para qualquer GN sênior
• CEA — específica para Assessoria de Investimentos
• MBA em Gestão / Liderança — diferencial para cargos de liderança formal

💡 **Como priorizar:**
1. Cumprir as obrigatórias do cargo atual primeiro
2. Avançar nas que aparecem como "necessárias" no cargo-alvo
3. As "diferenciais" entram quando você quer destacar candidatura para movimentação

Quer ver o cronograma de preparação sugerido?`;
    },
    buildActions: () => [
      { label: 'Ver cargo-alvo', href: '/mapa-carreira' },
      { label: 'Trilhas de certificação', href: '/desenvolvimento' },
    ],
  },

  {
    prompt: 'Mentoria',
    buildContent: (hub) => {
      const mentor = hub.mentoresSugeridos[0];
      return `Mentoria é uma das alavancas mais fortes para sua jornada.

${mentor
  ? `🎯 **Sugerido para você:** **${mentor.nome}**
• ${mentor.cargo}
• ${mentor.experienciaAnos} anos de experiência
• Especialidades: ${mentor.especialidades.slice(0, 3).join(', ')}`
  : '⚠ Nenhum mentor sugerido ainda — explore o catálogo completo'}

💡 **Como uma mentoria ajuda você:**
- Acelera leitura de cenário (você pega atalhos que ele já trilhou)
- Constrói rede dentro do Sicredi
- Dá perspectiva sobre o cargo-alvo antes de você assumir

🎯 **Sugestão prática:** comece com 1 mentoria mensal de 1h. Em 6 meses você já tem material para 2-3 decisões importantes.`;
    },
    buildActions: () => [
      { label: 'Encontrar mentor', href: '/sicreder2sicreder' },
      { label: 'Pedir mentoria', href: '/sicreder2sicreder' },
    ],
  },
];

// ============================================================
// ROBERTO — líder
// ============================================================

const respostasRoberto: TheoResposta[] = [
  {
    prompt: 'Me ajude a preparar a 1:1 com meu time',
    buildContent: (hub) => {
      const equipe = hub.equipe || [];
      if (equipe.length === 0) return 'Sua equipe ainda não foi mapeada.';

      const linhas = equipe.slice(0, 5).map((m) => {
        const alerta = m.proactiveAlerts?.[0];
        const tema = alerta
          ? alerta.message
          : m.aspirations[0]?.sharedWithLeader
          ? `Avançar plano para ${m.aspirations[0].targetRoleId.replace(/-/g, ' ')}`
          : 'Validar aspirações de carreira';
        return `👤 **${m.name}**\n• Tema sugerido: ${tema}`;
      }).join('\n\n');

      return `Preparei roteiros para suas próximas 1:1s com a equipe da Praça Central.

${linhas}

💡 **Princípios para suas conversas:**
1. Comece pelo que está dando certo (reforço positivo abre a porta)
2. Aborde 1 ponto de atenção por conversa (não sobrecarregar)
3. Termine com 1 acordo concreto (com prazo)

Use o módulo de Conversas 1:1 para registrar os outcomes.`;
    },
    buildActions: () => [
      { label: 'Abrir Conversas 1:1', href: '/conversas-1a1' },
      { label: 'Ver minha equipe', href: '/equipe' },
    ],
  },

  {
    prompt: 'Qual o status de prontidão do meu time?',
    buildContent: (hub) => {
      const equipe = hub.equipe || [];
      const prontosAgora = equipe.filter((m) => m.proactiveAlerts?.some((a) => a.type === 'promocao_elegivel' || a.type === 'merito_elegivel')).length;
      const emRisco = equipe.filter((m) => m.turnoverRisk && m.turnoverRisk.probability > 70);
      const semAsp = equipe.filter((m) => m.aspirations.length === 0 || !m.aspirations[0].sharedWithLeader);

      return `📊 **Mapa de Prontidão da equipe (${equipe.length} pessoas):**

🟢 **Pronto para movimentação (${prontosAgora}):**
${equipe
  .filter((m) => m.proactiveAlerts?.some((a) => a.type === 'promocao_elegivel' || a.type === 'merito_elegivel'))
  .slice(0, 3)
  .map((m) => `• ${m.name}: ${m.proactiveAlerts?.[0]?.message.split('.')[0]}`)
  .join('\n') || '• Ninguém com janela aberta agora'}

🔴 **Atenção urgente (${emRisco.length}):**
${emRisco.slice(0, 3).map((m) => `• ${m.name}: risco ${m.turnoverRisk?.probability}% em ${m.turnoverRisk?.timeframe}`).join('\n') || '• Equipe estável'}

⚠️ **Ações de carreira pendentes:**
• ${semAsp.length} pessoa(s) sem aspiração compartilhada com você

📋 **Próximas ações:**
1. Levar candidatos a movimentação para o Comitê de Carreira
2. Agendar conversa de retenção com quem está em risco
3. Conversa de carreira com quem ainda não compartilhou aspiração`;
    },
    buildActions: () => [
      { label: 'Abrir Comitê de Carreira', href: '/comite-carreira' },
      { label: 'Ver Gestão de Desempenho', href: '/gestao-desempenho' },
    ],
  },

  {
    prompt: 'Como preparar uma conversa de retenção para quem está em risco de turnover?',
    buildContent: (hub) => {
      const equipe = hub.equipe || [];
      const arrisc = equipe.find((m) => m.turnoverRisk && m.turnoverRisk.probability > 70);

      return `Conversa de retenção é um momento crítico. Aqui vai o playbook.

${arrisc
  ? `🎯 **Caso prioritário: ${arrisc.name}**
• Probabilidade de saída: ${arrisc.turnoverRisk!.probability}% em ${arrisc.turnoverRisk!.timeframe}
• Sinais detectados:
${arrisc.turnoverRisk!.signals.slice(0, 3).map((s) => `  - ${s.description}`).join('\n')}`
  : '✓ Sua equipe não tem ninguém em risco crítico no momento. Mantenha conversas de carreira regulares.'}

📋 **Estrutura recomendada (60-90 min):**

**1. Abertura (5 min)** — sem pauta defensiva
"Reservei essa conversa pra te ouvir. Como você está se sentindo aqui?"

**2. Escuta (30 min)** — perguntas abertas, sem julgamento
- O que está te animando hoje?
- O que tem te frustrado?
- Se você pudesse mudar 3 coisas, quais seriam?

**3. Validação (10 min)**
- Reforce o valor da pessoa para o time
- Reconheça com fatos específicos (não genéricos)

**4. Construção (15 min)**
- Que acordo concreto faz sentido?
- Qual o próximo passo? (com prazo)

**5. Fechamento (5 min)**
- Combine próxima conversa em 30 dias

⚠️ **NÃO fazer:**
- Promessas que você não pode cumprir
- Jogar a conversa para "depois"
- Ignorar sinais já compartilhados`;
    },
    buildActions: (hub) => {
      const arrisc = hub.equipe?.find((m) => m.turnoverRisk && m.turnoverRisk.probability > 70);
      return arrisc
        ? [
            { label: `Abrir perfil de ${arrisc.name.split(' ')[0]}`, href: `/equipe/${arrisc.id}` },
            { label: 'Ver minha equipe', href: '/equipe' },
          ]
        : [{ label: 'Ver minha equipe', href: '/equipe' }];
    },
  },

  // === Tópicos do sidebar ===
  {
    prompt: 'Plano de sucessão',
    buildContent: (hub) => {
      const equipe = hub.equipe || [];
      return `Sucessão é um dos artefatos mais valiosos para você como líder.

📊 **Status atual da equipe (${equipe.length} pessoas):**
• ${equipe.filter((m) => m.aspirations[0]?.targetRoleId.includes('agencia')).length} pessoa(s) com aspiração de liderança
• ${equipe.filter((m) => m.aspirations[0]?.sharedWithLeader).length} aspirações compartilhadas com você

🎯 **Quem cobre seu cargo se você crescer:**
- Mapeie 2 candidatos a sucessão (1 pronto agora, 1 em desenvolvimento)
- Crie plano de exposição para cada (delegação progressiva)
- Discuta no próximo Comitê de Carreira

💡 **Princípios:**
1. Não há sucessão sem candidato sendo desenvolvido
2. Quem é candidato deve saber que é candidato (transparência)
3. Sucessão é responsabilidade do líder, não do RH`;
    },
    buildActions: () => [
      { label: 'Abrir Comitê de Carreira', href: '/comite-carreira' },
      { label: 'Ver Mapa de Talentos', href: '/mapa-talentos' },
    ],
  },

  {
    prompt: 'Feedback para o time',
    buildContent: () => {
      return `Feedback estruturado eleva muito a qualidade do desenvolvimento.

📋 **Modelo Papo Reto (Sicredi):**

**1. Situação** — fato observável (não opinião)
"Ontem na reunião com o associado X..."

**2. Comportamento** — o que você viu/ouviu
"...você apresentou as 3 opções de produto antes de entender o momento financeiro dele..."

**3. Impacto** — o que aconteceu por causa disso
"...e ele saiu com sensação de venda em vez de orientação."

**4. Pedido / Sugestão**
"Para próxima vez, gostaria que você começasse com a escuta. Faz sentido?"

✅ **Quando dar:**
- Tão próximo do fato quanto possível (24-48h)
- Em ambiente privado e tranquilo
- Sempre balanceando: 70% reforço positivo, 30% ajuste

❌ **Evitar:**
- Feedback genérico ("você precisa melhorar")
- Acumular vários feedbacks numa só conversa
- Comparar com outros colegas`;
    },
    buildActions: () => [
      { label: 'Conversas 1:1', href: '/conversas-1a1' },
    ],
  },

  {
    prompt: 'Indicadores de engajamento',
    buildContent: (hub) => {
      const equipe = hub.equipe || [];
      const eng = equipe.map((m) => m.engagementScore);
      const media = eng.length > 0 ? Math.round(eng.reduce((a, b) => a + b, 0) / eng.length) : 0;
      const baixo = equipe.filter((m) => m.engagementScore < 60).length;

      return `📊 **Engajamento da sua equipe:**

• Média do time: **${media}** (escala 0-100)
• ${baixo} pessoa(s) abaixo de 60 (atenção)
• ${equipe.filter((m) => m.engagementScore >= 80).length} pessoa(s) altamente engajada(s)

💡 **O que mais influencia engajamento na sua equipe (Sicredi):**
1. Conversas de carreira regulares (1:1 mensal mínimo)
2. Visibilidade de progresso (PDI ativo + check-ins)
3. Reconhecimento específico (não genérico)
4. Equilíbrio entre desafio e suporte

⚠️ **Atenção:** engajamento baixo é antecedente de turnover. Quem está em <60 hoje pode estar pensando em sair em 90 dias.`;
    },
    buildActions: () => [
      { label: 'Ver Gestão de Desempenho', href: '/gestao-desempenho' },
      { label: 'Conversas 1:1', href: '/conversas-1a1' },
    ],
  },

  {
    prompt: 'Comitê de carreira',
    buildContent: (hub) => {
      const equipe = hub.equipe || [];
      return `Comitê de Carreira é o ritual mais importante do seu papel como líder.

📅 **Próximo comitê:** 15 Mai 2026 · 14h
👥 **Casos da sua equipe (${equipe.length}):** todos vão para discussão

📋 **Como vir preparado:**

**1. Para CADA pessoa, antes do comitê:**
- Avaliação concluída (consenso entre auto + líder + pares)
- PDI revisado e atualizado
- Aspiração validada com a pessoa

**2. Categorize cada caso:**
- 🟢 Pronto para movimentação (promoção/mérito)
- 🟡 Em desenvolvimento (mentoria/PDI prioritário)
- 🔴 Ação urgente (retenção/realocação)

**3. Traga decisão sugerida com critérios objetivos**
- Não venha com "acho que merece" — venha com fatos: "tempo no cargo + conceito + critérios atendidos"

💡 **Critérios sistêmicos do Sicredi (lembrete rápido):**
- Promoção: #mandou bem+ + 18m no grade + aspiração compartilhada
- Mérito: #mandou bem+ + 12m na zona
- Mentoria: #quase lá + aspiração declarada
- PDI prioritário: #precisa evoluir ou avaliação não concluída`;
    },
    buildActions: () => [
      { label: 'Abrir Comitê de Carreira', href: '/comite-carreira' },
      { label: 'Preparar pauta na equipe', href: '/equipe' },
    ],
  },

  {
    prompt: 'Conversas de desenvolvimento',
    buildContent: () => {
      return `Conversas de desenvolvimento são DIFERENTES de 1:1 operacional.

📋 **Estrutura recomendada (45-60 min, trimestral):**

**1. Olhar para trás (10 min)**
- O que avançou desde a última conversa?
- Qual aprendizado ficou?

**2. Olhar para o presente (15 min)**
- Como a pessoa está se sentindo no cargo?
- Onde ela está crescendo? Onde está estagnada?

**3. Olhar para frente (20 min)**
- Aspiração: ainda é a mesma? Mudou?
- Qual a próxima vivência que faria diferença?
- Como você (líder) pode apoiar?

**4. Acordos concretos (10 min)**
- 2-3 ações com prazo
- Próxima conversa em 90 dias

💡 **Diferença para 1:1 operacional:**
- 1:1 operacional: meta, cliente, urgências do dia
- Conversa de desenvolvimento: pessoa, carreira, aspiração

Os dois são necessários. Não misture.`;
    },
    buildActions: () => [
      { label: 'Conversas 1:1', href: '/conversas-1a1' },
      { label: 'Ver minha equipe', href: '/equipe' },
    ],
  },
];

// ============================================================
// CARLA — P&C
// ============================================================

const respostasCarla: TheoResposta[] = [
  {
    prompt: 'Quais são os principais indicadores de turnover que devo monitorar?',
    buildContent: () => {
      return `📊 **Dashboard de Turnover · Indicadores Chave para a Cooperativa:**

🎯 **Indicadores principais:**
• **Turnover voluntário** (meta: <10% ao ano)
• **Turnover nos primeiros 12 meses** (meta: <10%) — sinaliza problemas de onboarding ou seleção
• **Tempo médio até desligamento** — útil para identificar pontos críticos da jornada
• **Turnover de altos performers** (meta: <5%) — o mais grave

📌 **Principais preditores no Sicredi (ordem de impacto):**
1. **Avaliação #precisa evoluir por 2 ciclos consecutivos** — 3.2x mais chance de sair
2. **Sem promoção em 3+ anos com aspiração declarada** — 2.8x mais chance
3. **Recusa de capacitações relevantes** — 2.1x mais chance
4. **Engajamento <60 por mais de 6 meses** — 1.8x mais chance
5. **Última conversa de carreira há mais de 6 meses** — 1.5x mais chance

⚡ **Ação prática:**
- Cruze esses 5 indicadores semanalmente
- Sinalize lideranças quando houver 2+ sinais combinados
- Use a Análise para tomar decisões antecipadas (não reativas)`;
    },
    buildActions: () => [
      { label: 'Abrir Analytics', href: '/analytics' },
      { label: 'Dashboard P&C', href: '/dashboard-pc' },
    ],
  },

  {
    prompt: 'Como preparar o ciclo de avaliação da cooperativa?',
    buildContent: () => {
      return `Cronograma estruturado para o ciclo de avaliação.

📅 **8 semanas antes do fechamento:**
• Comunicar abertura do ciclo
• Garantir que todas as competências estão atualizadas no Elofy
• Habilitação rápida das lideranças (1h por agência)

📅 **6 semanas antes:**
• Abertura formal do ciclo
• Cada colaborador faz autoavaliação (prazo 2 semanas)
• Lideranças começam suas avaliações

📅 **4 semanas antes:**
• Avaliações de pares (anônimas, 5 indicações)
• Acompanhar % de adesão por agência

📅 **2 semanas antes:**
• Conversas de consenso (líder + colaborador)
• Rodada de calibração entre líderes da mesma área

📅 **Fechamento:**
• Consolidação dos conceitos
• Comitês de Carreira (1 por agência) com base nos resultados
• Definição de PDIs

📋 **Indicadores para acompanhar:**
- % adesão da autoavaliação
- % adesão das avaliações de líder
- Distribuição dos conceitos (curva normal? concentração?)
- Qualidade dos comentários (especialmente nos pontos de atenção)

💡 **Sinais de alerta:**
- >70% concentrado em #mandou bem → calibração forçada demais
- Lideranças que dão só #arrasou → falta de honestidade
- Lideranças que só apontam pontos negativos → cuidado com clima`;
    },
    buildActions: () => [
      { label: 'Comitê de Carreira', href: '/comite-carreira' },
      { label: 'Mapa de Talentos', href: '/mapa-talentos' },
    ],
  },

  {
    prompt: 'Me ajude a montar uma apresentação de indicadores de P&C para a diretoria',
    buildContent: () => {
      return `Apresentação enxuta para diretoria — máximo 10 slides.

📋 **Estrutura recomendada:**

**Slide 1: Capa** — período + tema
**Slide 2: Visão geral** — saúde geral da carreira (1 número grande + 3 subindicadores)

**Slide 3: O que está dando certo** (3-4 indicadores em verde)
- ex.: % adesão à avaliação, aspirações compartilhadas, PDIs ativos

**Slide 4: O que precisa de atenção** (2-3 indicadores em amarelo/vermelho)
- ex.: turnover de altos performers, gap de sucessão, agência X com NPS baixo

**Slide 5: Análise de causa-raiz** — não traga só problema, traga hipótese
- ex.: "Turnover de PJ I está alto pois 70% sem aspiração compartilhada"

**Slide 6: Conexão com o negócio** — sempre traduza pessoas em resultado
- ex.: "Cada 1pp de queda no turnover = R$ X economizados em recrutamento"

**Slide 7-8: Plano de ação** — 3-5 ações concretas com responsável e prazo

**Slide 9: Pedidos de apoio** — diretoria adora ser convocada para algo concreto
- ex.: "Precisamos da diretoria endossando o programa de mentoria sistêmica"

**Slide 10: Próximos marcos** — quando você volta com update

💡 **Princípios:**
- Métrica sem narrativa não vende
- Toda métrica deve responder "e daí?"
- Comparações temporais (vs trimestre anterior, vs ano anterior) sempre`;
    },
    buildActions: () => [
      { label: 'Abrir Analytics', href: '/analytics' },
      { label: 'Dashboard P&C', href: '/dashboard-pc' },
    ],
  },

  // === Tópicos do sidebar ===
  {
    prompt: 'Turnover voluntário',
    buildContent: () => {
      return `Aprofundamento em turnover voluntário.

📊 **Como interpretar a métrica:**

**Turnover saudável**: 5-10% ao ano (renovação natural)
**Turnover preocupante**: >12% (sinal de problemas culturais/gestão)
**Turnover destrutivo**: turnover de altos performers >5%

🎯 **Segmentações importantes:**
- Por família (PF, PJ, AGRO, Operações, P&C)
- Por tempo de casa (<12m / 12-36m / 3-5a / +5a)
- Por agência (algumas concentram problemas)
- Por avaliação (quem sai? Os bons ou os ruins?)

💡 **Insight perigoso:** se turnover é igual entre altos e baixos performers, você está perdendo gente boa por motivos não ligados a desempenho — e isso é mais preocupante do que turnover total alto.`;
    },
    buildActions: () => [
      { label: 'Ver Analytics completo', href: '/analytics' },
    ],
  },

  {
    prompt: 'Cobertura de sucessão',
    buildContent: () => {
      return `Cobertura de sucessão é um dos KPIs mais críticos para P&C.

📊 **Como medir:**
- Para cada cargo crítico (GA, GR, Diretor): quantos sucessores mapeados?
- Sucessor "pronto agora" + sucessor "em 1 ano" + sucessor "em desenvolvimento"

✅ **Cobertura saudável:**
- 100% dos cargos críticos com pelo menos 1 sucessor "pronto em 1 ano"
- 80%+ dos cargos críticos com pelo menos 2 sucessores

⚠️ **Sinais de alerta:**
- Cargo crítico sem nenhum sucessor identificado
- Sucessor único = risco concentrado (e se essa pessoa sair?)
- Sucessor sem PDI ativo = mapeamento sem ação

💡 **Use o Mapa de Talentos (9-Box) para identificar candidatos a sucessor:**
- Quadrantes "Estrela" e "Alto Potencial" são os primeiros
- Profissionais "Diamante Bruto" valem investimento de desenvolvimento`;
    },
    buildActions: () => [
      { label: 'Mapa de Talentos', href: '/mapa-talentos' },
      { label: 'Comitê de Carreira', href: '/comite-carreira' },
    ],
  },

  {
    prompt: 'Ciclo de avaliação',
    buildContent: () => {
      return `Estado do ciclo de avaliação atual.

📅 **Ciclo 1/2026 (Jan-Jun):**
- Status: Em andamento
- Adesão da autoavaliação: acompanhar diariamente
- Adesão de líderes: pode atrasar, mas precisa cobrança

🎯 **Pontos críticos do ciclo:**
1. Lideranças que não fazem avaliação no prazo
2. Avaliações sem comentários (só nota numérica) — qualidade ruim
3. Concentração em #mandou bem (curva achatada) — calibração necessária
4. Pares anônimos: garantir que quem é avaliado escolheu pares variados

💡 **Próximos passos no ciclo:**
1. Comunicar prazos com 4 semanas de antecedência
2. Habilitação rápida com lideranças que avaliam pela primeira vez
3. Acompanhar adesão por agência (quem está atrasando?)
4. Calibração coletiva entre líderes do mesmo nível
5. Comitês de Carreira com base nos resultados`;
    },
    buildActions: () => [
      { label: 'Comitê de Carreira', href: '/comite-carreira' },
    ],
  },

  {
    prompt: 'Clima organizacional',
    buildContent: () => {
      return `Clima organizacional vai além de pesquisa anual.

📊 **Indicadores contínuos:**
• **eNPS** (Employee Net Promoter Score) — pulse mensal
• **Career NPS** — específico para carreira/desenvolvimento
• **Adesão a 1:1s** — sinal de saúde de relacionamento líder-liderado
• **% conclusão de PDIs** — sinal de comprometimento mútuo
• **Índice de turnover voluntário** — consequência do clima

🎯 **Sinais qualitativos importantes:**
- Conversas em corredor/café (clima informal)
- Volume de pedidos de transferência interna
- Tempo médio para preenchimento de vagas internas
- Retenção pós-promoção (a pessoa fica feliz no novo cargo?)

💡 **Princípio:** clima não se gerencia diretamente. Clima é consequência de:
1. Liderança próxima e técnica
2. Carreira clara (a pessoa vê para onde está indo)
3. Reconhecimento honesto (não apenas elogio)
4. Senso de pertencimento (cooperativismo na prática)`;
    },
    buildActions: () => [
      { label: 'Dashboard P&C', href: '/dashboard-pc' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },

  {
    prompt: 'Programa de talentos',
    buildContent: () => {
      return `Programa de Talentos: estrutura recomendada para a cooperativa.

📋 **Modelo de 3 trilhas:**

**1. Trilha de Aceleração (Estrelas)**
- Identificadas no quadrante 9 do 9-Box
- 12-18 meses de desenvolvimento intensivo
- Mentoria com diretoria + projetos sistêmicos + exposição ao Conselho
- Critério de saída: prontidão para próximo nível confirmada

**2. Trilha de Sucessão (cargos críticos)**
- 2 sucessores por cargo crítico (GA, GR, Diretor)
- 18-36 meses de preparação
- Job rotation + delegação progressiva
- Critério de saída: assumiu cargo ou foi descartado com plano de carreira alternativo

**3. Trilha de Desenvolvimento (potencial latente)**
- Quadrantes "Diamante Bruto" e "Alto Potencial"
- Programa modular: trilhas, mentoria, projetos
- Sem prazo fixo (ritmo de evolução varia)

💡 **Princípios do programa:**
- Transparência: quem está no programa sabe que está
- Mérito: critério objetivo, não político
- Saída honesta: nem todo mundo é alto potencial, e tudo bem
- Multiplicador: cada graduado vira multiplicador para próximas levas`;
    },
    buildActions: () => [
      { label: 'Mapa de Talentos', href: '/mapa-talentos' },
      { label: 'Comitê de Carreira', href: '/comite-carreira' },
    ],
  },
];

// ============================================================
// API
// ============================================================

export function getRespostasParaPersona(personaId: string): TheoResposta[] {
  if (personaId === 'roberto') return respostasRoberto;
  if (personaId === 'carla') return respostasCarla;
  return respostasMariana;
}

export function getRespostaPorPrompt(personaId: string, prompt: string): TheoResposta | undefined {
  return getRespostasParaPersona(personaId).find((r) => r.prompt === prompt);
}
