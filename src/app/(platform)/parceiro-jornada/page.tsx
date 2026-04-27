'use client';

import { useState, useRef, useEffect } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, ArrowRight, Bot, Briefcase, TrendingUp, Target,
  Users, BookOpen, Map, MessageSquare, BarChart3, Lightbulb, Star,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; icon?: string; type: 'action' }[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// Quick action cards shown above chat per persona
interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  color: string;
}

function getQuickActions(personaRole: string): QuickAction[] {
  if (personaRole === 'lider') {
    return [
      { label: 'Preparar 1:1', description: 'Roteiro para conversa com colaborador', icon: <MessageSquare className="w-4 h-4" />, prompt: 'Me ajude a preparar a 1:1 com meu time', color: '#2563EB' },
      { label: 'Prontidão do Time', description: 'Quem está pronto para avançar', icon: <TrendingUp className="w-4 h-4" />, prompt: 'Qual o status de prontidão do meu time?', color: '#3FA110' },
      { label: 'Conversa de Retenção', description: 'Estratégia para reter talentos', icon: <Users className="w-4 h-4" />, prompt: 'Como preparar uma conversa de retenção para quem está em risco de turnover?', color: '#D97706' },
    ];
  }
  if (personaRole === 'pc_analista') {
    return [
      { label: 'Análise de Turnover', description: 'Identificar padrões e riscos', icon: <BarChart3 className="w-4 h-4" />, prompt: 'Quais são os principais indicadores de turnover que devo monitorar?', color: '#EF4444' },
      { label: 'Ciclo de Avaliação', description: 'Preparar o ciclo de avaliação', icon: <Target className="w-4 h-4" />, prompt: 'Como preparar o ciclo de avaliação da cooperativa?', color: '#3FA110' },
      { label: 'Indicadores para Diretoria', description: 'Montar apresentação P&C', icon: <Lightbulb className="w-4 h-4" />, prompt: 'Me ajude a montar uma apresentação de indicadores de P&C para a diretoria', color: '#0E7490' },
    ];
  }
  // Colaborador
  return [
    { label: 'Próximo Passo', description: 'O que falta para avançar', icon: <TrendingUp className="w-4 h-4" />, prompt: 'O que falta para eu avançar para o próximo cargo?', color: '#3FA110' },
    { label: 'Preparar 1:1', description: 'Roteiro para conversa com líder', icon: <MessageSquare className="w-4 h-4" />, prompt: 'Me ajude a preparar a 1:1 com meu líder', color: '#2563EB' },
    { label: 'Trilhas', description: 'Trilha de desenvolvimento ideal', icon: <BookOpen className="w-4 h-4" />, prompt: 'Quais trilhas de desenvolvimento são mais indicadas para mim?', color: '#7C3AED' },
  ];
}

// Sidebar topics per persona
function getSidebarTopics(personaRole: string): string[] {
  if (personaRole === 'lider') return ['Plano de sucessão', 'Feedback para o time', 'Indicadores de engajamento', 'Comitê de carreira', 'Conversas de desenvolvimento'];
  if (personaRole === 'pc_analista') return ['Turnover voluntário', 'Cobertura de sucessão', 'Ciclo de avaliação', 'Clima organizacional', 'Programa de talentos'];
  return ['Minha aspiração', 'Gaps de competência', 'Oportunidades internas', 'Certificações', 'Mentoria'];
}

// Pre-scripted conversations per persona
const initialMessages: Record<string, Message[]> = {
  mariana: [
    {
      id: '1',
      role: 'assistant',
      content: 'Olá Mariana! 👋\n\nSou o **Theo**, seu parceiro de jornada de carreira no Sicredi. Eu cruzo seu perfil, sua avaliação e sua aspiração para sugerir os próximos passos certos. Tudo o que digo aqui é baseado nos seus dados reais na plataforma.\n\n📊 **Seu retrato hoje:**\n• Cargo: Gerente de Negócios PF II\n• Aspiração: Gerente de Agência (24 meses)\n• Conceito atual: #mandoubem · Prontidão: Em desenvolvimento\n\n💪 **Pontos fortes Jeito Sicredi:** #arrasou em #GENTE QUE FAZ JUNTO, #GENTE QUE FAZ O CERTO e #GENTE QUE GERA CONFIANÇA.\n\n⚠️ **Onde você precisa subir para virar GA:** #GENTE QUE EVOLUI (hoje #quaselá, esperado #arrasou) e habilidades técnicas de Liderança de Pessoas (62 → 80) e Planejamento Estratégico (55 → 70).\n\nComo posso te ajudar hoje?',
    },
  ],
  roberto: [
    {
      id: '1',
      role: 'assistant',
      content: 'Olá Roberto! 👋\n\nSou o **Theo**, seu parceiro de jornada como líder. Eu olho continuamente para sua equipe (cargo, avaliação, PDI, sinais de risco) e te sugiro o próximo movimento certo. Tudo a partir dos dados reais da plataforma.\n\n📊 **Sua equipe agora:**\n• 5 pessoas na Praça Central\n• Mariana: prontidão Em desenvolvimento para GA\n• 1 colaborador com alerta de retenção: priorizar conversa Papo Reto esta semana\n• Próximo Comitê de Carreira: 7 dias\n\nComo posso te apoiar?',
    },
  ],
  carla: [
    {
      id: '1',
      role: 'assistant',
      content: 'Olá Carla! 👋\n\nSou o **Theo**, seu copiloto de Pessoas & Cultura. Estou aqui para te apoiar com análises, preparação de ciclos e tomada de decisão estratégica.\n\n📊 **Indicadores da Cooperativa:**\n• Turnover voluntário: 8.2% (meta: <10%)\n• Satisfação eNPS: 72\n• Cobertura de comitê: 85%\n• Vagas abertas: 12\n\nO que precisa da minha ajuda?',
    },
  ],
};

const responses: Record<string, string> = {
  'O que falta para eu avançar para o próximo cargo?': `Cruzei sua avaliação atual com o que **Gerente de Agência** exige.

✅ **Você já atende (mantém o nível):**
• #arrasou em #GENTE QUE FAZ JUNTO, #GENTE QUE ENTENDE DE GENTE, #GENTE QUE FAZ O CERTO e #GENTE QUE GERA CONFIANÇA (consenso da avaliação Q1/2026)
• Relacionamento com Associados: 92 (esperado 80)
• Cooperativismo técnico: 88 (esperado 80)

⚠️ **Onde precisa subir para virar GA:**
• **#GENTE QUE EVOLUI:** hoje #quaselá, precisa chegar a #arrasou (Roberto comentou: "pode explorar mais soluções digitais e novas abordagens")
• **#GENTE COM QUEM CONTAR:** hoje #mandoubem, esperado #arrasou para o nível de liderança
• **Liderança de Pessoas:** 62 → precisa 80 (+18 pontos)
• **Planejamento Estratégico:** 55 → precisa 70 (+15 pontos)

📋 **Plano sugerido para 90 dias:**
1. **Mês 1:** Job Shadow com GA da Cooperativa Caminhos (1 semana) + módulo "Liderança Fundamentals"
2. **Mês 2:** Mentoria mensal com Paulo Ferreira (GA III), foco em planejamento e gestão de pessoas
3. **Mês 3:** Liderar mini-projeto de inovação na Praça Central (vivência prática para subir #GENTE QUE EVOLUI)

Quer que eu adicione tudo isso ao seu PDI?`,

  'Me ajude a preparar a 1:1 com meu líder': `Preparei um roteiro para sua **1:1 com Roberto** na quinta:

📌 **Seus destaques para compartilhar:**
• Satisfação do associado: Top 3 da agência 🎉
• Meta trimestral: 94%. quase batendo!
• Mentoria do Lucas (Assist. Atendimento). evolução positiva

⚠️ **Ponto de atenção:**
• Cross-selling caiu 12% este mês. vale investigar

💬 **Temas sugeridos para levantar:**
1. Seu interesse no projeto da Agência Ipê (92% match)
2. Progresso no módulo de Liderança Fundamentals (30% completo)
3. Pedir feedback sobre sua evolução para GA

💡 **Dica:** Ao falar sobre GA, pergunte *"O que você recomenda como meu próximo passo?"*. mostra maturidade e abertura.`,

  'Quais trilhas de desenvolvimento são mais indicadas para mim?': `Baseado no seu perfil de **GN PF II** aspirando **Gerente de Agência**, recomendo:

🟢 **Trilha prioritária: Liderança de Pessoas**
• Feedback SCII. já concluído ✅
• 1:1 Eficaz (3h). próximo passo
• PDI da Equipe (3h)
• Gestão de Conflitos (2h)
*Progresso: 30% · Impacto na prontidão: +12pp*

🔵 **Trilha complementar: Gestão de Agência**
• P&L da Agência (4h)
• Indicadores Operacionais (3h)
• Compliance e PLD (3h)
*Progresso: 0% · Impacto na prontidão: +8pp*

🟣 **Certificação: CEA (opcional)**
• Diferencial competitivo para GA
• 30h de preparação
*Impacto na prontidão: +5pp*

Total estimado: **~48h de desenvolvimento · +25pp de prontidão**`,

  'Quais são minhas opções de movimentação lateral?': `Analisei as movimentações mais comuns a partir de **GN PF II**:

📊 **Dados reais do sistema (últimos 3 anos):**

→ **GN PF III** (ascensão vertical): 188 profissionais fizeram essa transição
→ **GN PJ I** (lateral): 104 profissionais. rota muito comum
→ **Assessor de Investimentos** (especialização): requer CEA

🔄 **Movimentações laterais possíveis:**
1. **Negócios PJ**. Trilha de 28h, foco em crédito empresarial
2. **Negócios AGRO**. Trilha de 30h, foco em crédito rural
3. **Assessor de Investimentos**. Requer CEA, perfil analítico

💡 Considerando sua aspiração de GA, a rota **GN PF III → GA** é a mais direta. Mas uma passagem por PJ pode enriquecer sua visão generalista.`,

  // Leader responses
  'Me ajude a preparar a 1:1 com meu time': `Preparei roteiros para suas **próximas 1:1s**:

👩 **Mariana Oliveira (GN PF II)**. quinta-feira
• Destaque: Top 3 satisfação, 94% meta comercial
• Ponto de atenção: Cross-selling -12%
• Sugestão: Falar sobre projeto Centro (92% match para GA)
• Perguntar: "Como está se sentindo com a meta de prospecção?"

👨 **Lucas Ferreira (Assist. Atendimento)**
• Destaque: Onboarding fluido, boa adaptação
• Ponto de atenção: Apenas 2 meses. pode estar overwhelmed
• Sugestão: Falar sobre cooperativismo na prática
• Perguntar: "O que te surpreendeu positivamente até aqui?"

⚠️ **Juliana Pereira (GN PJ I)**. PRIORIDADE
• Risco de turnover: 78%. **stay conversation urgente**
• Sinais: Recusou última capacitação, NPS interno caiu
• Sugestão: Conversa empática sobre satisfação e futuro`,

  'Qual o status de prontidão do meu time?': `📊 **Mapa de Prontidão do Time:**

🟢 **Pronto para avançar (>80%):**
• Ana Beatriz (GN PF III). 85% → Pronta para GA
• Carlos Mendes (GN PJ II). 82% → Pronto para PJ III

🟡 **Em desenvolvimento (50-80%):**
• Mariana Oliveira (GN PF II). 68% → Aspirando GA
• Pedro Santos (GN PF I). 55% → Aspirando PF II

🔴 **Atenção (<50% ou em risco):**
• Juliana Pereira (GN PJ I). 45% + risco turnover 78%
• Lucas Ferreira (Assist.). 30% (recém-chegado, normal)

📋 **Ações recomendadas:**
1. Indicar Ana Beatriz para comitê de carreira como candidata a GA
2. Stay conversation com Juliana esta semana
3. Mentor para Lucas (Mariana poderia ser a mentora)`,

  // P&C responses
  'Quais são os principais indicadores de turnover que devo monitorar?': `📊 **Dashboard de Turnover. Indicadores Chave:**

**Turnover Voluntário:** 8.2% (meta <10%) ✅
**Turnover nos primeiros 12 meses:** 15% ⚠️ (acima da meta de 10%)
**Tempo médio para desligamento:** 18 meses

📌 **Principais preditores de turnover no Sicredi:**
1. **Avaliação #precisaevoluir por 2 ciclos consecutivos**. 3.2x mais chance de sair
2. **Sem promoção em 3+ anos**. 2.8x mais chance
3. **Recusa de capacitações**. 2.1x mais chance
4. **NPS interno <60**. 1.8x mais chance

⚡ **Alertas ativos na cooperativa:**
• 3 GNs de alta performance com >24 meses sem movimentação
• 5 colaboradores com <12 meses e sinais de desengajamento
• 1 GA com pedido de transferência pendente

Quer que eu aprofunde em algum desses alertas?`,

  'Como usar o mapa de talentos 9-box para decisões de carreira?': `📊 **Guia Prático do 9-Box para P&C:**

O 9-box cruza **Desempenho** (eixo X) com **Potencial** (eixo Y):

🟢 **Quadrante 9 (Alto/Alto):** Estrelas. priorizar para promoção e projetos estratégicos
🔵 **Quadrante 6 (Alto/Médio):** Performers. investir em desenvolvimento de potencial
🟡 **Quadrante 3 (Alto/Baixo):** Especialistas. manter e reconhecer na função atual

⚠️ **Cuidados importantes:**
• Revisar a cada 6 meses (não é estático)
• Usar como insumo para comitê de carreira, não como decisão final
• Cruzar com dados de engajamento e risco de turnover

📋 **Na prática para o comitê:**
1. Identificar 9s e 8s → candidatos prioritários para pipeline de liderança
2. Identificar 1s e 2s → plano de recuperação ou realocação
3. Mapear 4s, 5s, 6s → maior grupo, foco em desenvolvimento

Quer que eu gere o relatório 9-box da cooperativa?`,
};

export default function ParceiroJornadaPage() {
  const { currentPersona } = usePersona();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const employee = currentPersona ? getEmployeeById(currentPersona.employeeId) : null;
  const role = employee ? getRoleById(employee.roleId) : null;

  useEffect(() => {
    if (currentPersona) {
      setMessages(initialMessages[currentPersona.id] || initialMessages.mariana);
      setShowQuickActions(true);
    }
  }, [currentPersona]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentPersona) return null;

  const quickActions = getQuickActions(currentPersona.role);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = responses[text] || `Entendi sua pergunta sobre "${text}". Baseado no seu perfil como **${role?.title || currentPersona.jobTitle}**, aqui vai minha análise:\n\nEsta é uma área importante para o seu desenvolvimento. Posso te ajudar a:\n• Mapear gaps específicos\n• Sugerir trilhas de desenvolvimento\n• Identificar mentores relevantes\n• Preparar um plano de ação\n\nQual desses caminhos faz mais sentido para você?`;
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const personaLabel = currentPersona.role === 'lider'
    ? 'Copiloto de Liderança'
    : currentPersona.role === 'pc_analista'
      ? 'Copiloto de Pessoas & Cultura'
      : 'Copiloto de Carreira';

  const sidebarTopics = getSidebarTopics(currentPersona.role);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto h-[calc(100vh-130px)] flex gap-5">
      {/* Left Column: Chat */}
      <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <motion.div variants={item} className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-verde-digital to-[#2d7f0d] flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Theo</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-verde-50 text-verde-digital">
                {personaLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500">Seu copiloto de carreira, baseado nos seus dados de avaliação, PDI e aspiração</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions (always visible) */}
      <div className="flex gap-2 mb-4">
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            onClick={() => handleSend(qa.prompt)}
            className="card card-interactive p-2.5 text-left group flex-1"
          >
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${qa.color}12` }}>
                <span style={{ color: qa.color }}>{qa.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{qa.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{qa.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-verde-digital text-white rounded-br-md'
                : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
            }`}>
              <div className={`text-sm whitespace-pre-line leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </div>
              {msg.actions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.label)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-verde-50 text-verde-digital hover:bg-verde-100 transition-colors flex items-center gap-1"
                    >
                      {action.label} <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-verde-digital/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-verde-digital/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-verde-digital/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-400">Theo está analisando...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Pergunte sobre sua carreira, desenvolvimento ou equipe..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital/20 outline-none text-sm"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-verde-digital text-white flex items-center justify-center hover:bg-verde-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          IA demonstrativa · Respostas pré-configuradas para o protótipo
        </p>
      </div>
      </div>

      {/* Sidebar Right */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 space-y-4">
        {/* Tópicos sugeridos */}
        <div className="card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Tópicos sugeridos</p>
          <div className="flex flex-wrap gap-1.5">
            {sidebarTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleSend(topic)}
                className="text-[10px] font-semibold px-2 py-1 rounded-md bg-verde-50 text-verde-digital hover:bg-verde-100 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Nudges recentes */}
        <div className="card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Nudges recentes</p>
          <div className="space-y-2">
            {[
              { text: 'Atualizar autoavaliação', status: 'pendente' },
              { text: 'Trilha de Liderança', status: 'aceito' },
              { text: 'Mentoria com GA', status: 'pendente' },
            ].map((nudge, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-xs text-gray-600 truncate">{nudge.text}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${nudge.status === 'aceito' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  {nudge.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Theo usa seus dados na interface (avaliação, PDI, aspiração) para gerar sugestões personalizadas.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
