# Plano de Evolução Completo — Minha Carreira Sicredi (V3)

> **Pasta:** `/Users/guiviegas/Documents/modelocarreirasicredi-antigravity-v3` · branch `main`
> **Data:** 2026-04-27
> **Material oficial considerado:** imagens do "Por dentro da estratégia" (7 competências #GENTE QUE), régua oficial Avaliação 360° (cores e valores numéricos), Funcionalidades ferramenta gestão de carreira, "Mundo ideal" do Gerente de Negócios, Entregáveis (3 etapas + Movimentação), Matriz de Atribuições xlsx (estrutura Função/Responsabilidades/Atividades/Requisitos/Diferenciais/Preparo Técnico/Preparo Comportamental).

---

## 1. Visão geral

### 1.1 Estado atual
A plataforma evoluiu rapidamente nos últimos commits (persona-hub, GPS multi-modo, Coerência Mariana, Coerência Roberto) e tem **estrutura visual e de dados sólida**. Mas a auditoria comparativa com o material oficial Sicredi e com a navegação de cada persona revela três classes de problema:

1. **Dados ainda não 100% integrados** — embora `persona-hub.ts` exista, várias páginas legadas ainda leem direto de `employees.ts`, `avaliacoesMock`, `pdiData` etc. e duplicam lógica.
2. **Estruturas oficiais Sicredi não totalmente refletidas** — Matriz de Atribuições (recém-recebida) tem 7 campos estruturados que ainda não aparecem nas páginas de cargo. As 7 competências #GENTE QUE estão no `competencias-sicredi.ts` mas o GPS/perfil ainda mostra "competências" genéricas em alguns lugares.
3. **Profundidade do GPS** — o GPS tem 4 abas mas as **recomendações** (cursos, mentores, experiências, ações de PDI) não vêm sempre do gap real, repetem-se entre módulos sem rastreabilidade.

### 1.2 Princípios que guiam o plano
- **Single source of truth absoluta**: nenhum dado mock duplicado entre páginas. Tudo passa pelo hub.
- **Estrutura oficial Sicredi**: usar exatamente o vocabulário e a estrutura dos materiais entregues (Matriz, Régua, 3 etapas, 7 competências).
- **Coerência cross-page**: o mesmo dado mostrado em 2 páginas tem o mesmo valor, formato e cor.
- **Profundidade > extensão**: vale mais 1 página rica e funcional que 3 páginas rasas.
- **Cada tela gera valor claro para a persona** (não tela demonstrativa).

---

## 2. Erros já corrigidos (referência rápida)

| Item | Status |
|---|---|
| Régua oficial: cores corretas (#precisa evoluir LARANJA, #quase lá AZUL/CIANO, #mandou bem VERDE, #arrasou ROSA/MAGENTA) | ✅ Corrigido em `elofy-config.ts` |
| Régua oficial: valores numéricos (0,01-0,79 / 0,80-0,99 / 1,00-1,10 / 1,11-1,20) | ✅ Adicionados em `elofy-config.ts` |
| 7 competências oficiais #GENTE QUE… (não as 5 inventadas) | ✅ Substituídas globalmente |
| Mariana: aspiração unificada para Gerente de Agência | ✅ PDI, Theo, GPS alinhados |
| Hub central de dados (`persona-hub.ts`) | ✅ Existe e consumido em meu-gps, perfil parcial |
| Atribuições estruturadas (Matriz) | ✅ Gerado `atribuicoes-cargos.ts` (12 da planilha + 10 inferidos) — UI ainda não consome |

---

## 3. Auditoria página por página

### 3.1 PERSONA MARIANA (colaboradora — GN PF II)

#### 3.1.1 `/meu-gps` (Início)

**O que tem hoje:** 3 cards de aspiração, PDI e próxima conversa. Cards Theo (nudges contextuais do hub). Checklist semanal mock.

**Problemas reais:**
- O bloco "Próxima conversa" usa `pdi.checkIns` mas **não distingue conversa de carreira de 1:1 normal** — material oficial pede separação entre rituais.
- Checklist semanal mock hard-coded (não vem do hub).
- Sem destaque visual para o **FOCO 2026** ("Relacionamento como alavanca de resultado") que o material oficial Mariana enfatiza.

**O que precisa ter:**
- Banner do FOCO 2026 contextual (Mariana = "Relacionamento como alavanca").
- Checklist dinâmico vindo de `hub.notificacoes` + ações pendentes do PDI + ciclo de avaliação aberto.
- Separação explícita entre "Próxima conversa de carreira" e "Próximo 1:1".
- Destaque do conceito atual `#mandou bem` e da prontidão (régua oficial) no header.

**Prioridade:** P1 (alto valor — é a porta de entrada)

---

#### 3.1.2 `/meu-cargo`

**O que tem hoje:** componente `MeuCargoView` mostra cargo + descrição livre + seção "Próximo cargo natural" se for cargo da persona. Lê de `roles.ts`.

**Problemas críticos:**
- **NÃO usa a estrutura oficial da Matriz de Atribuições** (Função / Responsabilidades Essenciais / Principais Atividades / Requisitos / Diferenciais / Preparo Técnico / Preparo Comportamental). Hoje só mostra `role.description` + `role.dayInLife` + `role.requiredSkills` em barras de %.
- **Sem indicador de fonte do dado** (planilha vs inferido). Cliente quer transparência sobre o que está oficial e o que é mock/inferido.
- **Não conecta com a avaliação atual da persona** — não mostra "como você está performando contra essas responsabilidades".

**O que precisa ter:**
- Layout fiel à imagem da Matriz: 4 quadrantes (Responsabilidades essenciais ▸ Atividades · Requisitos · Diferenciais · Preparo Técnico/Comportamental).
- Badge `Fonte oficial: Matriz de Atribuições` ou `Inferido baseado em mercado`.
- Chip do conceito atual da pessoa para cada Responsabilidade (puxar via mapeamento responsabilidade → competência Jeito Sicredi).
- Botão "Ver avaliação completa" → `/avaliacao`.
- Botão "Ver próximo cargo na minha rota" → GPS Plano de Rota (já existe).
- Para cargo dinâmico `/meu-cargo/[roleId]`: mesma estrutura, sem chips de avaliação (só mostra requisitos do cargo).

**Prioridade:** P0 (cliente pediu explicitamente esta refatoração)

---

#### 3.1.3 `/perfil`

**O que tem hoje:** header + Passaporte de Carreira + 5+ competências Jeito Sicredi do hub + habilidades técnicas + categorias antigas + aspirações + conquistas + readiness + Quick Info. **Já refatorado em fase 3** mas a página tem 600+ linhas com várias seções legadas.

**Problemas:**
- Bloco "Conquistas" (Achievements) ainda mostra ícones tipo gamificação — o cliente removeu XP, mas o achievements card permanece com vibe de "badges".
- "Categorias" (Relacional, Técnica, Liderança, etc.) duplica a categorização de habilidades — hoje sem propósito claro.
- "Compatibilidade" (readinessScores) usa `getCompatibilityLabel(score)` baseado em % → conflita com a régua oficial Sicredi de Prontidão (Pronto agora / Pronto 1 ano / Em desenvolvimento / Início da jornada). Inconsistência.
- "Performance: 4.2/5.0" no Quick Info original ainda existia — verificar se foi removido.

**O que precisa ter:**
- Substituir "Compatibilidade" por blocos usando `reguaProntidao` oficial (4 níveis simbólicos).
- Reduzir/converter "Conquistas" em "Marcos de carreira" sem gamificação visual.
- Remover bloco "Categorias" (sem propósito claro).
- Adicionar "Histórico de cargos" (timeline) usando `hub.employee.tenure` + dados inferidos.
- Adicionar acesso direto à descrição do cargo atual (`/meu-cargo`) e do alvo (`/meu-cargo/[alvoId]`).

**Prioridade:** P1

---

#### 3.1.4 `/mapa-carreira` (GPS de Carreira)

**O que tem hoje:** 4 abas (Onde Estou / Para Onde Posso Ir / Mapa Visual / Plano de Rota) + componentes em `src/components/gps/`. Refeito em Fase 2.

**Problemas (este é o foco principal do cliente — DEEP DIVE na seção 4):**
- **Aba Onde Estou:** mostra 5 competências Sicredi, mas as habilidades técnicas vêm de `employee.skills` (genéricas) e não de `cargoAtual.requiredSkills` da Matriz. Deve mostrar lado a lado: o que o cargo exige × o que a pessoa tem.
- **Aba Para Onde Posso Ir:** lista cargos com selo de dificuldade vindo de `careerPaths.difficulty`, mas o critério de "compatibilidade" simplificada não considera fatores qualitativos (ex.: idade da pessoa, formação, certificações).
- **Aba Mapa Visual (Metrô):** as estações destacam cargo atual e alvo, mas o painel lateral ao clicar não tem botão "Comparar com meu atual" nem "Adicionar ao plano".
- **Aba Plano de Rota:** mostra plano em 3 colunas (Cursos, Mentoria, Experiências) com filtros heurísticos. Mas:
  - Sugestões NÃO vêm sempre do gap real (ex.: cursos podem listar todos da família, sem priorizar competência mais fraca).
  - Botões CTAs ("Adicionar ao PDI", "Pedir mentoria") **não persistem** mudança em estado/PDI.
  - Comparador 2-3 cargos não mostra diferenças explícitas (ex.: "ganho salarial estimado", "tempo até prontidão", "esforço relativo").
  - Falta "Decisão" final: depois de comparar, não há botão "Definir como minha aspiração".

**O que precisa ter (resumo — detalhado na seção 4):**
- Recomendações 100% derivadas do gap (priorização explícita por competência mais fraca).
- Plano gera "agenda concreta" com prazos sugeridos.
- Comparador com diferenças quantificadas.
- Persistência (mock) das ações tomadas.

**Prioridade:** P0 (foco explícito do cliente)

---

#### 3.1.5 `/avaliacao`

**O que tem hoje:** Conceito Final + Régua oficial + Objetivos de Negócio + Competências Jeito Sicredi (tabela com auto/líder/consenso) + Feedbacks recebidos.

**Problemas críticos:**
- **`REGUA_4_PONTOS` hard-coded inline com FAIXAS ERRADAS** (linha 21-25): "0,80 a 0,89", "0,90 a 0,99" — deveria ser "0,01-0,79", "0,80-0,99", "1,00-1,10", "1,11-1,20". Já corrigi em `elofy-config.ts` mas a página AINDA não consome de lá.
- **Cores também ERRADAS** na constante local (`#EF4444` para precisa evoluir, `#F59E0B` para quase lá) — divergem das corrigidas em `elofy-config.ts`.
- "Feedbacks Recebidos" é mock estático e não conecta com nenhum sistema real.
- Falta link explícito para PDI ("Use essa avaliação para ajustar seu PDI").

**O que precisa ter:**
- Remover `REGUA_4_PONTOS` local e consumir `reguaPerformance` de `elofy-config.ts`.
- Mostrar a faixa numérica oficial (0,01-0,79 etc.) ao lado de cada hashtag.
- Integrar com PDI via CTA persistente.
- Histórico de avaliações (3 ciclos) já calculado no hub.

**Prioridade:** P0 (erro de dado oficial!)

---

#### 3.1.6 `/pdi` (Meu PDI)

**O que tem hoje:** Goal + Ações em andamento/concluídas + Sugestões Theo + Check-ins. Goal Mariana já alinhado para Gerente de Agência.

**Problemas:**
- "Competências (Jeito Sicredi)" mostra barras `current/target` em escala 0-10, **divergindo da régua oficial 4 níveis** (#hashtag).
- Sugestões Theo mocks na própria entrada do PDI — deveriam vir do hub.
- Sem ligação clara entre cada Ação e a competência específica que ela desenvolve.

**O que precisa ter:**
- Substituir barras 0-10 por chips de hashtag (atual → alvo) para coerência total.
- Cada Ação mostra competência(s) que desenvolve com chip colorido.
- Sugestões Theo do hub (`hub.nudges.filter(n => n.contexto === 'pdi')`).
- Botão "Importar do GPS Plano de Rota" (cliente pediu).

**Prioridade:** P1

---

#### 3.1.7 `/desenvolvimento`

**O que tem hoje:** 9 cursos catálogo + filtros por categoria + modos `netflix`/`hybrid`. Cursos com skills mapeadas para 7 competências.

**Problemas:**
- "Categoria" duplica vocabulário (cooperativismo, soft, financeira) que NÃO vem da Matriz oficial. Cliente prefere classificar por competência Jeito Sicredi diretamente.
- Sem badge "Recomendado para você" (vinculado ao gap real).
- Sem indicador "Já incluído no seu PDI".

**O que precisa ter:**
- Substituir filtro por categoria por filtro por **competência Jeito Sicredi**.
- Badge "★ Recomendado pelo seu gap" no curso que cobre competência mais fraca.
- Badge "✓ No seu PDI" se o curso está em `pdi.actions`.
- Indicador de progresso real (vindo do hub se existir).

**Prioridade:** P1

---

#### 3.1.8 `/marketplace` (Oportunidades Internas)

**O que tem hoje:** Lista filtrada por tipo (vaga / projeto / mentoria / job_shadow / intercâmbio) com badge "Aderência" simbólico (Alta/Boa/Parcial/Baixa). Link enxuto Gupy. Header já renomeado.

**Problemas:**
- Aderência calculada com `(opp.matchScore || 0)` — `matchScore` é mock e não vem do gap real.
- Não destaca "elegibilidade" formal (pessoa atende requisitos? tempo no cargo? certificações?).
- "Recomendados" mostra top 2 com matchScore ≥ 80 — mesma lógica fraca.

**O que precisa ter:**
- Calcular aderência real comparando `cargoAtual.requiredSkills` vs `cargo.requiredSkills` da vaga.
- Bloco "Critérios de movimentação" explícito (cliente pediu) — usa `careerPaths.requirements`.
- Filtro por "Apenas onde sou elegível" (atende critérios mínimos).

**Prioridade:** P1

---

#### 3.1.9 `/sicreder2sicreder` (Mentoria)

**O que tem hoje:** 3 tabs (Encontrar / Minhas / Ser Mentor) com cards de mentor. 5 mentores mock.

**Problemas:**
- Mentores não vêm do `hub.mentoresSugeridos` (que filtra por aspiração).
- Tab "Minhas mentorias" e "Ser mentor" são placeholders sem dados reais.
- Sem critério de match (aspiração da pessoa vs especialidade do mentor).

**O que precisa ter:**
- Aba "Encontrar Mentor" inicia com `hub.mentoresSugeridos` em destaque + lista completa abaixo.
- Cada mentor mostra "Match para sua aspiração: ★★★★☆" baseado em sobreposição de especialidade × competências do alvo.
- Aba "Minhas mentorias" com 1-2 mocks coerentes para Mariana (ex.: Paulo Ferreira, em curso).
- Aba "Ser mentor": formulário simulado de cadastro com pré-preenchimento das suas próprias competências #arrasou.

**Prioridade:** P2

---

#### 3.1.10 `/experiencias`

**O que tem hoje:** Lista de experiências (8) com 3 seções (recomendadas / cooperativa / sistema). Cards com tipo, duração, vagas, skills.

**Problemas:**
- "Recomendadas" são `experiencias.slice(0, 4)` — não filtra por gap real.
- Skills das experiências usam vocabulário antigo (Liderança, Gestão de Equipe) — não as 7 #GENTE QUE.
- Sem CTA para "Manifestar interesse" funcional.

**O que precisa ter:**
- Recomendadas filtradas por `familiaAlvo` que casa com cargo-alvo da pessoa + cobertura de competências fracas.
- Skills mapeadas para 7 competências oficiais.
- Badge "Aprendizado em [#GENTE QUE EVOLUI]" para deixar claro o vínculo.

**Prioridade:** P2

---

#### 3.1.11 `/parceiro-jornada` (Theo)

**O que tem hoje:** Chat com mensagens iniciais por persona, 3-4 quick actions e 4-5 respostas pré-scripted. Mensagens da Mariana já citam 7 competências oficiais e gap habilidades técnicas.

**Problemas:**
- Chat ainda é estático (respostas pré-scripted, sem encadeamento).
- Quick actions não persistem aprendizado entre sessões.
- Falta "histórico de nudges" (quais a Mariana já viu, quais aceitou, quais dispensou).
- Sidebar direito mostra "Tópicos Sugeridos" mas tópicos são mocks sem ligação com `hub.nudges`.

**O que precisa ter:**
- Sidebar com `hub.nudges` reais (vindos do hub, contextuais por persona).
- Histórico simulado de últimas 5 sugestões (com status: aceito / dispensado / pendente).
- Botão "Aplicar essa sugestão" em cada resposta longa do Theo (que muta visualmente o estado).

**Prioridade:** P2 (já está razoável, refinos)

---

### 3.2 PERSONA ROBERTO (líder — GA II)

(Baseado em auditoria do agente especializado, integrada com observações próprias.)

#### 3.2.1 `/equipe` (Minha Equipe)

**O que tem hoje:** Tabela rica com 10+ colunas (cargo, grade, zona, salário, tempos, conceito, aspiração, última conversa, alertas IA, P/P/D). KPIs derivados de dados reais. Refeita em Fase 4.

**Problemas:**
- Tabela densa demais para mobile/scan visual.
- Coluna "Última conversa" mostra data + tópico, mas sem ação ou outcome (qualidade da conversa).
- KPI "Com PDI ativo" usa hardcoded (`['mariana', 'lucas']`) — não calcula para todos.
- Sem badge "Em pauta no Comitê" para quem está sendo discutido.
- Sem conexão com janelas de movimentação elegíveis.

**O que precisa ter:**
- Densidade reduzida: colapsar colunas opcionais em "Mais detalhes" (expand row).
- Coluna "Última conversa" inclui status (concluída/agendada/atrasada) e próxima ação.
- KPI "PDI ativo" calculado para 100% da equipe (lógica do hub).
- Badge "★ Em pauta no Comitê (15/05)" para colaboradores com decisão pendente.
- Coluna "Janela elegível" (ex.: "Mérito Z3→Z4 em 4 meses").

**Prioridade:** P0 (dashboard principal de Roberto)

---

#### 3.2.2 `/equipe/[employeeId]` (drill-down)

**O que tem hoje:** Header + 4 KPIs financeiros + Aspiração + Histórico conceitos + Competências Sicredi + PDI + Última conversa + Alertas IA + Quick actions.

**Problemas:**
- Quick actions ("Agendar conversa", "Dar feedback") não têm `href` real (#).
- PDI mostrado só para `mariana`/`lucas` — outros colaboradores sem PDI não aparecem mesmo que devessem ter.
- Alertas IA mostram warning mas sem botão "Tomar essa ação agora" (CTA inexistente).
- Sem seção "Status no Comitê de Carreira".

**O que precisa ter:**
- Quick actions funcionais (modais ou navegação real).
- PDI inferido para 100% da equipe (mock generativo se preciso).
- Alertas com CTA acionável (ex.: "Iniciar conversa de retenção" → modal pré-preenchido).
- Seção "No Comitê de Carreira" (status da decisão + próximos passos).
- Roadmap dos próximos 90 dias (milestones específicos).

**Prioridade:** P0

---

#### 3.2.3 `/gestao-desempenho`

**O que tem hoje:** 4 KPIs (avaliações, PDIs, aspirações, risco) + distribuição de conceitos (gráfico) + tabela individual + janelas de movimentação (mock).

**Problemas:**
- KPI "PDIs Ativos" conta aspirações, não PDIs reais — gap semântico.
- Janelas de Movimentação totalmente mock (Mariana Costa / Carlos Santos hardcoded).
- Sem link visível para Comitê de Carreira ("isto é a pauta do comitê").
- Sem matriz Performance × Prontidão (ferramenta clássica de decisão).

**O que precisa ter:**
- KPI "PDI ativo" baseado em `developmentPlanIds.length > 0`.
- Janelas dinâmicas: ler `monthsInGrade`/`monthsInZone` e calcular elegibilidade real.
- Link explícito "Discussão estruturada no Comitê em [data]".
- Matriz visual 2x2: Desempenho (Y) vs Prontidão (X) — identificar quadrantes.
- Datas críticas (ciclo, janela, comitê) sempre visíveis no header.

**Prioridade:** P0

---

#### 3.2.4 `/comite-carreira`

**O que tem hoje:** 4 casos hardcoded com performance/prontidão/potencial em cards + decisão textual + status (aprovado/urgente/pendente).

**Problemas críticos:**
- **Totalmente mock** (4 nomes hardcoded sem vínculo a equipe real do Roberto).
- **Sem processo estruturado** (template, critérios aplicados, justificativa).
- **Sem Mapa de Talentos** (sucessão, pipeline, "quem cobre o quê").
- **Sem Onepage CRM Talento** (perfil consolidado por caso).
- Próxima data fixa "15/05" sem integração calendário real.

**O que precisa ter:**
- Casos vindos da equipe real (`getTeamForLeader`) com lógica para identificar "em pauta".
- Ficha estruturada por caso (nome, cargo, aspiração, histórico avaliações, competências força/fraqueza, score prontidão, decisão sugerida, ação, datas).
- Mapa de Talentos: matriz visual de sucessão (posições críticas + quem pode cobrir em 0/6/12 meses).
- Onepage CRM Talento por pessoa (1 página consolidada).
- Critérios explícitos: "Score prontidão > 85% + #mandou bem + aspiração compartilhada + 18+ meses em grade".
- Aba "Decisões 2025-2026" com histórico.

**Prioridade:** P0 (fundamental — modelo Sicredi exige rigor de processo)

---

#### 3.2.5 `/conversas-1a1`

**O que tem hoje:** Lista de conversas com status (agendada/concluída/atrasada) + preparação inteligente.

**Problemas:**
- Datas/conversas hardcoded.
- Preparação IA superficial (tópicos genéricos, não vinculados ao colaborador real).
- Sem follow-up de pendências.
- Status "atrasada" só para Juliana — manual, não calculado.

**O que precisa ter:**
- Template de pauta por tipo (Carreira / Check-in / Performance) com checklist.
- Follow-up board: ações acordadas + status.
- Nota pós-conversa (campo de outcome).
- Conexão com PDI: se conversa é "carreira", mostrar PDI ativo.
- Alertas automáticos: "Última 1:1 com X há 45 dias — agende".

**Prioridade:** P1

---

#### 3.2.6 `/avaliacao-time`

**O que tem hoje:** Barra de progresso + régua Elofy + lista de membros (status + nota).

**Problemas:**
- Apenas mostra "quem fez" vs "quem não fez", sem análise.
- Sem distribuição visual de conceitos.
- Sem análise por competência (qual das 7 está mais fraca no time?).
- Link Elofy externo tira do fluxo.

**O que precisa ter:**
- Histograma de conceitos.
- Status por fase (auto → líder → consenso).
- Análise por competência: "Qual das 7 está mais baixa no time?" → insight automático.
- Insight: "Sua equipe está concentrada em #quase lá em [competência] — oportunidade de targetar desenvolvimento".
- Conexão com PDI: se conceito é #precisa evoluir, sugerir criar PDI.

**Prioridade:** P1

---

#### 3.2.7 `/prontidao-time`

**O que tem hoje:** 4 cards de contagem por nível + lista com score % e tendência.

**Problemas:**
- Sem definição clara de "prontidão" (dimensões? métricas?).
- Score (%) vem do mock — não é calculado.
- Sem gap analysis (prontidão hoje vs prontidão exigida para aspiração).
- Sem ação sugerida.

**O que precisa ter:**
- Definição de prontidão (dimensões com exemplos).
- Score calculado (não mock): média ponderada de fatores verificáveis.
- Gap vs aspiração: "Pedro aspira PF II mas score prontidão é 65% — faltam 6+ meses".
- Trajetória: gráfico evolução últimos 2 ciclos.
- Plano de desenvolvimento: se score < 70%, mostrar ações e milestones.
- Matriz 2x2: Prontidão × Desempenho — identificar "pronto agora + #mandou bem" = ready.

**Prioridade:** P1

---

### 3.3 PERSONA CARLA (P&C — Analista)

#### 3.3.1 `/meu-gps` (PCAnalistaDashboard)

**O que tem hoje:** 4 KPIs + 3 cards Theo + ações rápidas.

**Problemas:**
- KPIs estáticos hardcoded.
- "Hero P&C" originalmente planejado (Cooperativa Convergência + Q3) ainda não implementado completamente.
- Sem visão de comitês próximos por agência.

**O que precisa ter:**
- KPIs derivados de `employees` real (ex.: % com avaliação concluída do total da coop).
- Hero contextual com nome da cooperativa + ciclo.
- Cards "Próximos comitês" (Praça Central / Mirante / Jardim Botânico) com status preparação.
- Cronograma 2026 (3 etapas: Execução / Desenvolvimento / Avaliação + Movimentação).

**Prioridade:** P1

---

#### 3.3.2 `/dashboard-pc`

**O que tem hoje:** "Saúde de Carreira" (4 KPIs + ranking de agências), "Talento & Sucessão", "Clima & Cultura", "Conexão com Negócio" (R$ turnover, ROI), "Tendência Turnover".

**Problemas:**
- Métricas inventadas tipo "R$ 2,1M custo turnover" e "ROI Desenvolvimento 4:1" — sem base.
- "Top Temas Stay Interviews" mock.
- Correlação Saúde × NPS é ilustrativa apenas.

**O que precisa ter:**
- Métricas marcadas como "estimativa" quando inferidas.
- Top temas vindos de fonte mais transparente (ex.: agregação de feedbacks reais).
- Cada KPI deve ter "vínculo" claro: como foi calculado, qual a fonte.

**Prioridade:** P2 (já tem riqueza visual)

---

#### 3.3.3 `/mapa-talentos`

**O que tem hoje:** Matriz 9-Box com 9 quadrantes (Estrela, Alto Potencial, Profissional Chave, Diamante Bruto, etc.) + 9 colaboradores plotados + summary 3 cards.

**Problemas:**
- 9-box plotado com `nineBoxData` mock (não puxa de avaliações reais).
- Posicionamento estático (1-3 escala, não usa régua oficial).
- Sem ação por quadrante (ex.: clicar em "Estrela" não mostra plano de aceleração).

**O que precisa ter:**
- Posicionamento puxado de `avaliacoesMock.notaFinalPerformance` + `potencialId`.
- Régua mapeada para 1-3 (baixa/média/alta).
- Click em quadrante mostra recomendação de ação (ex.: "Estrelas" → plano sucessão; "Risco" → plano de desligamento ético).
- Filtro por agência / família.
- Conexão com Comitê: marca quem está em pauta.

**Prioridade:** P1

---

#### 3.3.4 `/comite-carreira` (visão Carla)

Mesmo arquivo que Roberto, mas Carla precisa de **visão sistêmica** (todos os comitês da coop), não só o dela.

**O que precisa ter (visão Carla):**
- Lista de comitês das 3 agências (Praça Central, Mirante, Jardim Botânico) com data, % preparação, casos em pauta.
- Indicador de qualidade do processo por agência.
- Histórico consolidado de decisões da coop.

**Prioridade:** P1

---

#### 3.3.5 `/analytics`

**O que tem hoje:** 8 KPIs + insights + 2 charts (turnover por família, prontidão por nível).

**Problemas:**
- Métricas hardcoded.
- Insights mock (textos prontos).
- Sem capacidade de drill-down.

**O que precisa ter:**
- Métricas derivadas de agregações reais sobre `employees`.
- Insights com chip "Fonte: cálculo automático sobre [N] colaboradores".
- Drill-down: clicar em "Família PF turnover 12%" lista os casos.

**Prioridade:** P2

---

## 4. GPS de Carreira — Deep Dive

> Foco explícito do cliente: "revisão completa para todas as recomendações que aparecerem ali estarem bastante coerentes e com a melhor informação possível".

### 4.1 Aba "Onde Estou"

**Estado atual:** Card hero + selos oficiais + 5 competências Sicredi + habilidades técnicas + aspiração.

**Recomendações de evolução:**

1. **Dado: Competências Sicredi**
   - Hoje mostra `hub.competenciasSicredi[*].conceito` (hashtag).
   - Adicionar: indicador de **delta vs ciclo anterior** (ex.: "↑ subiu de #quase lá → #mandou bem em Faz Junto").
   - Vincular cada competência ao **artefato de desenvolvimento** que mais a impacta (curso, mentor, experiência).

2. **Dado: Habilidades técnicas**
   - Hoje mostra `employee.skills` filtradas por `requiredSkills` do cargo atual.
   - Adicionar: **integração com Matriz** — usar `atribuicoesCargos[roleId].preparoTecnico` (já temos!) como referência oficial.
   - Comparar lista oficial × níveis avaliados.

3. **Dado: Aspiração**
   - Hoje mostra cargo-alvo + horizonte + "Compartilhada com líder".
   - Adicionar: **última atualização** ("Aspiração revisada em [data], na conversa com [líder]").
   - CTA "Atualizar minha aspiração" → modal de revisão.

4. **Dado: Marcos da semana** (NOVO)
   - Próximas 2-3 ações concretas vindas do hub: "Autoavaliação até [data]", "Job shadow agendado", "Mentoria com Paulo na próxima quinta".

### 4.2 Aba "Para Onde Posso Ir"

**Estado atual:** 3 grupos (Próximos passos / Laterais / Estratégicas/Backoffice) com cards de cargo.

**Recomendações de evolução:**

1. **Critério de "compatibilidade" enriquecido**
   - Hoje: cálculo de cobertura de `requiredSkills`.
   - Acrescentar: certificações exigidas (CPA-20, CEA, etc.), formação mínima (MBA, especialização), tempo de carreira.
   - Marcar bloqueios objetivos: "Falta CPA-20 — bloqueia GN PF III".

2. **Tempo médio histórico real**
   - Vir de `movimentacoes.ts` (já existe parcialmente) — mostrar mediana e dispersão.
   - Ex.: "Tempo médio de promoção: 18 meses (entre 12 e 36)".

3. **Salário esperado**
   - Hoje mostra faixa do role.
   - Adicionar: **delta vs salário atual da pessoa**: "+R$ 1.500 (estimativa)".

4. **Botões com persistência mock**
   - "Comparar" deveria adicionar visualmente um chip "Adicionado à comparação" (já tem fluxo, mas pode ser mais explícito).
   - "Simular rota" navega para Aba 4 e ABRE com cargo já selecionado.

### 4.3 Aba "Mapa Visual" (Metrô)

**Estado atual:** SVG metrô com cargo atual destacado (verde) e cargo-alvo (azul). Click abre painel lateral.

**Recomendações de evolução:**

1. **Painel lateral mais rico**
   - Hoje: detalhes do cargo + métricas + paths in/out.
   - Adicionar: aba "Comparação rápida" (compara com cargo atual da pessoa em 4 dimensões).
   - Botão "Ver atribuições completas" → `/meu-cargo/[id]` (já existe).
   - Botão "Adicionar à comparação no Plano de Rota" (cross-aba).

2. **Filtros por trilha estratégica**
   - Hoje: 7 linhas mostradas.
   - Adicionar toggle: "Mostrar só trilhas que atendem minha aspiração".

### 4.4 Aba "Plano de Rota" (coração do GPS)

**Estado atual:** Seletor de cargo-alvo + diagrama rota + tempo/prontidão + gap competências + plano em 3 colunas (cursos/mentoria/experiências) + modo comparar.

**Esta é a aba que mais precisa de evolução** — concentra a "geração de valor" prometida.

**Recomendações de evolução:**

1. **Diagrama de rota mais inteligente**
   - Hoje: 1 ou 2 nós (com indicação "+1 promoção intermediária" se diff ≥ 2).
   - Acrescentar: detectar **rota intermediária real** (ex.: GN PF II → GN PF III → GA, mostrando os 3 nós).
   - Calcular tempo total estimado somando os tempos de cada salto.

2. **Análise de gap por competência (Jeito Sicredi)**
   - Hoje: 5 (deveria ser 7) competências com chip atual → esperado para o cargo.
   - **CORREÇÃO CRÍTICA**: a heurística "esperado #arrasou para cargo nível ≥ 5; #mandou bem para outros" é simplista demais. Cada cargo deveria ter sua matriz de competência esperada.
   - Adicionar: para cada competência com gap, listar 1 ação imediata ("Comece pelo curso X de 2h").

3. **Gap por habilidade técnica (Matriz)**
   - Hoje não mostra explicitamente.
   - Adicionar: lista de habilidades exigidas pelo cargo-alvo (de `atribuicoesCargos[alvo].preparoTecnico`) com chip "Atendido / Em desenvolvimento / Não atendido".
   - Mesma régua simbólica das competências.

4. **Plano sugerido — agenda concreta**
   - Hoje: 3 colunas com 3 itens cada, sem prazo.
   - Refatorar para **agenda em 3 ondas**:
     - **30 dias** (primeiros passos quick-win)
     - **90 dias** (consolidação)
     - **6-12 meses** (transformação)
   - Cada item tem: o que fazer, prazo sugerido, esforço estimado (h), competência que desenvolve.

5. **Persistência mock (CTAs)**
   - "Adicionar ao PDI" → mock que muta visualmente o card para "✓ No PDI".
   - "Pedir mentoria" → modal pré-preenchido + confirmação ("Mentoria solicitada para [mentor]").
   - "Manifestar interesse" (experiência) → idem.

6. **Comparador 2-3 cargos com diferenças quantificadas**
   - Hoje: tabela com 5 dimensões.
   - Acrescentar:
     - Linha "Ganho salarial estimado" (delta vs cargo atual).
     - Linha "Tempo até prontidão estimado".
     - Linha "Esforço total" (h sugeridas no plano).
     - Linha "Probabilidade de movimentação" (alta/média/baixa baseada em históricos).

7. **Decisão final: salvar como aspiração**
   - Botão "Definir como minha aspiração oficial" → muda `employee.aspirations[0]` (mock).
   - Confirmação visual: "Aspiração compartilhada com [líder] em [data]".

8. **Coerência de fonte**
   - Toda recomendação carrega tag de fonte: `★ Vinculado à sua avaliação` / `Sugestão IA baseada em mercado` / `Plano oficial Sicredi Aprende`.

---

## 5. Roadmap por fases

### Fase A — Correções críticas (P0) · 1-2 dias

**Objetivo:** Corrigir erros de dado oficial e completar a integração da Matriz de Atribuições.

**Entregáveis:**
1. ✅ Régua oficial corrigida em `elofy-config.ts` (concluído)
2. ✅ `atribuicoes-cargos.ts` gerado da planilha (concluído)
3. **Fazer `/avaliacao` consumir `reguaPerformance`** (não mais hard-coded)
4. **Refatorar `MeuCargoView` para usar a estrutura oficial Matriz** (Função / Responsabilidades Essenciais / Atividades / Requisitos / Diferenciais / Preparo Técnico/Comportamental)
5. Atualizar `RoleDetailPanel` no GPS para mostrar a mesma estrutura (versão compacta)
6. Verificar coerência cores entre todas as páginas

### Fase B — GPS deep refinement (P0) · 2-3 dias

**Objetivo:** Tornar o GPS de Carreira o produto-âncora da plataforma.

**Entregáveis:**
1. Aba "Onde Estou": integração com `atribuicoesCargos`, delta vs ciclo, marcos da semana.
2. Aba "Para Onde Posso Ir": critério enriquecido, tempo histórico real, delta salarial.
3. Aba "Mapa Visual": painel lateral rico com comparação rápida e CTAs cross-aba.
4. Aba "Plano de Rota": rota inteligente, agenda em 3 ondas, persistência mock dos CTAs, comparador quantificado, decisão final.
5. Coerência total de fonte das recomendações.

### Fase C — Coerência Mariana profunda (P1) · 1-2 dias

**Objetivo:** Eliminar últimas inconsistências nas páginas Mariana.

**Entregáveis:**
1. `/avaliacao` 100% via hub.
2. `/pdi` com chips hashtag (não barras 0-10) + competências vinculadas a ações.
3. `/desenvolvimento` com filtro por #competência + badges "Recomendado pelo seu gap" e "✓ No PDI".
4. `/marketplace` com aderência calculada do gap real + bloco "Critérios de movimentação".
5. `/perfil` com "Compatibilidade" usando `reguaProntidao` oficial; remover "Categorias"; converter "Conquistas" em "Marcos de carreira".
6. `/meu-gps` com banner FOCO 2026 + checklist dinâmico do hub.

### Fase D — Coerência Roberto + Comitê real (P0) · 2-3 dias

**Objetivo:** Tornar a visão de líder uma ferramenta de decisão, não 7 telas isoladas.

**Entregáveis:**
1. `/equipe`: tabela com expand row, badge "Em pauta no Comitê", PDI calculado para 100%.
2. `/equipe/[id]`: quick actions funcionais, alertas IA com CTA, seção "No Comitê".
3. `/gestao-desempenho`: matriz Performance × Prontidão, janelas dinâmicas, KPIs corretos.
4. `/comite-carreira`: REESCRITA — casos reais da equipe, ficha estruturada, Mapa de Talentos, Onepage CRM, critérios explícitos, histórico.
5. `/conversas-1a1`: template de pauta + follow-up + alertas automáticos.
6. `/avaliacao-time`: distribuição visual + análise por competência + insight automático.
7. `/prontidao-time`: definição clara, score calculado, gap vs aspiração, matriz 2x2.

### Fase E — Páginas Carla (P1) · 1-2 dias

**Objetivo:** Dar à Carla visão sistêmica e ação operacional clara.

**Entregáveis:**
1. `/meu-gps` PC: KPIs reais + Hero P&C + Próximos comitês + Cronograma 2026.
2. `/mapa-talentos`: 9-box puxado de dados reais, ações por quadrante, filtros, conexão Comitê.
3. `/comite-carreira` (visão Carla): visão sistêmica das 3 agências.
4. `/analytics` (refino): drill-down + transparência de fonte.

### Fase F — Polish + Mentoria + Experiências + Theo (P2) · 1-2 dias

**Objetivo:** Refinar módulos secundários para coerência total.

**Entregáveis:**
1. `/sicreder2sicreder`: mentores filtrados pelo hub, abas "Minhas" e "Ser mentor" funcionais.
2. `/experiencias`: recomendadas reais + skills nas 7 oficiais.
3. `/parceiro-jornada`: sidebar com `hub.nudges`, histórico de sugestões.
4. `/dashboard-pc` (Carla): vincular fonte de cada KPI.

### Fase G — Design System + acessibilidade (P3) · 1 dia

**Objetivo:** Higienização visual final.

**Entregáveis:**
1. Catálogo de componentes (badges, hashtags, KPIs) com tokens centralizados.
2. Verificar contraste das novas cores oficiais (especialmente #precisa evoluir LARANJA).
3. Empty states bem feitos (quando não há dados ainda).
4. Loading states padronizados.

---

## 6. Verificação por fase

| Fase | Como verificar |
|---|---|
| A | Régua em `/avaliacao` mostra "0,01-0,79" etc.; `MeuCargoView` mostra 7 quadrantes da Matriz para cargo da Mariana e do Roberto |
| B | Plano de Rota mostra agenda em 3 ondas; comparador 2-3 cargos com delta salarial; CTAs persistem visualmente |
| C | Em todas as páginas Mariana, mesma competência aparece com mesmo hashtag; `/perfil` sem barras de "Compatibilidade" %; PDI sem barras 0-10 |
| D | `/comite-carreira` mostra 6 pessoas reais da equipe Roberto; ficha estruturada visível; matriz 9-box em `/mapa-talentos` puxa de dados reais |
| E | KPIs Carla mostram contagem real sobre `employees`; clicar em quadrante 9-box leva a ação |
| F | Mentores em `/sicreder2sicreder` reordenados por aspiração; experiências recomendadas filtradas |
| G | Lighthouse acessibilidade > 90; nenhum contraste fail |

---

## 7. Compromissos com o material oficial Sicredi

Todo elemento deste plano respeita:

| Material oficial | Como é refletido |
|---|---|
| 7 competências #GENTE QUE | Únicas competências usadas em avaliação, perfil, GPS, PDI, equipe, comitê |
| Régua oficial 4 níveis (cores e faixas numéricas) | Régua única em `elofy-config.ts`; todas as páginas consomem dela |
| 3 etapas + Movimentação | Reflete-se na navegação (Execução=Meu Cargo+GPS / Desenvolvimento=PDI+Trilhas+Mentoria+Experiências / Avaliação / Mobilidade=Marketplace) |
| Matriz de Atribuições (Função/Resp/Atividades/Requisitos/Diferenciais/Preparo) | Estrutura oficial em `atribuicoesCargos`, renderizada em `MeuCargoView` e GPS painel |
| Mundo ideal Mariana (6 momentos) | Cada momento tem sua página/seção: 1=Meu Cargo+GPS, 2=Self+Avaliação, 3=Avaliação, 4=PDI+Theo, 5=Mentoria+Experiências+Comitê, 6=Critérios+Reconhecimento |
| FOCO 2026 ("Relacionamento como alavanca") | Banner contextual na home Mariana |
| Funcionalidades por persona (slide oficial) | Mariana: mapa, skill gap, self assessment, IA recomendação, Elofy, vagas. Roberto: painel time, status PDIs, histórico, decisão. Carla: mapa de talentos, Onepage CRM, comitê, guia |

---

## 8. Próximos passos imediatos

Após aprovação deste plano, executar **Fase A** (correções críticas) imediatamente:

1. Atualizar `MeuCargoView` para usar `atribuicoesCargos` (já gerado).
2. Atualizar `RoleDetailPanel` do GPS com versão compacta.
3. Refatorar `/avaliacao` para consumir `reguaPerformance` central.
4. Build + commit + apresentar resultados visuais.

Em seguida, **Fase B** (GPS deep refinement) — onde está a maior densidade de valor para o cliente.
