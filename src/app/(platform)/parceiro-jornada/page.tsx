'use client';

import { useState, useRef, useEffect } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { getPersonaHub, PersonaHub } from '@/data/persona-hub';
import { getRespostasParaPersona, getRespostaPorPrompt, TheoAction } from '@/data/theo-respostas';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: TheoAction[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
  return [
    { label: 'Próximo Passo', description: 'O que falta para avançar', icon: <TrendingUp className="w-4 h-4" />, prompt: 'O que falta para eu avançar para o próximo cargo?', color: '#3FA110' },
    { label: 'Preparar 1:1', description: 'Roteiro para conversa com líder', icon: <MessageSquare className="w-4 h-4" />, prompt: 'Me ajude a preparar a 1:1 com meu líder', color: '#2563EB' },
    { label: 'Trilhas', description: 'Trilha de desenvolvimento ideal', icon: <BookOpen className="w-4 h-4" />, prompt: 'Quais trilhas de desenvolvimento são mais indicadas para mim?', color: '#7C3AED' },
  ];
}

function getSidebarTopics(personaRole: string): string[] {
  if (personaRole === 'lider')
    return [
      'Plano de sucessão',
      'Feedback para o time',
      'Indicadores de engajamento',
      'Comitê de carreira',
      'Conversas de desenvolvimento',
    ];
  if (personaRole === 'pc_analista')
    return [
      'Turnover voluntário',
      'Cobertura de sucessão',
      'Ciclo de avaliação',
      'Clima organizacional',
      'Programa de talentos',
    ];
  return ['Minha aspiração', 'Gaps de competência', 'Oportunidades internas', 'Certificações', 'Mentoria'];
}

function buildInitialMessage(hub: PersonaHub): string {
  if (hub.persona.role === 'lider') {
    const equipe = hub.equipe || [];
    const emRisco = equipe.filter((m) => m.turnoverRisk && m.turnoverRisk.probability > 70).length;
    const proxComite = '15 Mai 2026';
    return `Olá ${hub.persona.name.split(' ')[0]}! 👋

Sou o **Theo**, seu parceiro de jornada como líder. Olho continuamente para sua equipe (cargo, avaliação, PDI, sinais de risco) e te sugiro o próximo movimento certo. Tudo a partir dos dados reais da plataforma.

📊 **Sua equipe agora:**
• ${equipe.length} pessoas na ${hub.persona.branch || 'Praça Central'}
• ${emRisco > 0 ? `⚠ ${emRisco} pessoa(s) com alerta de retenção: priorizar Papo Reto esta semana` : '✓ Equipe sem alertas críticos'}
• Próximo Comitê de Carreira: ${proxComite}

Como posso te apoiar hoje?`;
  }

  if (hub.persona.role === 'pc_analista') {
    return `Olá ${hub.persona.name.split(' ')[0]}! 👋

Sou o **Theo**, seu copiloto de Pessoas & Cultura. Cruzamos dados de toda a cooperativa para te apoiar com análises, preparação de ciclos e tomada de decisão estratégica.

📊 **Visão da Cooperativa hoje:**
• Ciclo 1/2026 em curso
• Acompanhamento de turnover, sucessão e engajamento ativo
• 3 comitês de carreira agendados nas próximas 6 semanas

Como posso te ajudar?`;
  }

  // colaborador
  const fortes = hub.competenciasSicredi.filter((c) => c.consenso === 4).map((c) => c.competencia.nome);
  const fracas = hub.competenciasSicredi
    .filter((c) => c.consenso < 3)
    .map((c) => `${c.competencia.nome} (${c.conceito.hashtag})`);

  return `Olá ${hub.persona.name.split(' ')[0]}! 👋

Sou o **Theo**, seu parceiro de jornada de carreira no Sicredi. Cruzo seu perfil, sua avaliação e sua aspiração para sugerir os próximos passos certos. Tudo o que digo aqui é baseado nos seus dados reais na plataforma.

📊 **Seu retrato hoje:**
• Cargo: ${hub.cargoAtual.title}
• Aspiração: ${hub.cargoAlvo?.title || 'a definir'} ${hub.employee.aspirations[0]?.timeframe ? `(${hub.employee.aspirations[0].timeframe})` : ''}
• Conceito atual: **${hub.notaFinalPerformance.hashtag}** · Prontidão: **${hub.gapAlvo?.prontidaoEstimada.nome || '-'}**

${fortes.length > 0 ? `💪 **Pontos fortes Jeito Sicredi:** #arrasou em ${fortes.slice(0, 3).join(', ')}.` : ''}

${fracas.length > 0 ? `⚠️ **Onde você precisa subir:** ${fracas.slice(0, 2).join(' e ')}.` : ''}

Como posso te ajudar hoje?`;
}

export default function ParceiroJornadaPage() {
  const { currentPersona } = usePersona();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const employee = currentPersona ? getEmployeeById(currentPersona.employeeId) : null;
  const role = employee ? getRoleById(employee.roleId) : null;
  const hub = currentPersona ? getPersonaHub(currentPersona.id) : null;

  useEffect(() => {
    if (currentPersona && hub) {
      setMessages([
        {
          id: 'init',
          role: 'assistant',
          content: buildInitialMessage(hub),
        },
      ]);
    }
  }, [currentPersona?.id, hub?.persona.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentPersona || !hub) return null;

  const quickActions = getQuickActions(currentPersona.role);
  const sidebarTopics = getSidebarTopics(currentPersona.role);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resposta = getRespostaPorPrompt(currentPersona.id, text);

      let content: string;
      let actions: TheoAction[] | undefined;

      if (resposta) {
        content = resposta.buildContent(hub);
        actions = resposta.buildActions?.(hub);
      } else {
        // Fallback inteligente: sugere os tópicos relacionados
        const sugestoes = getRespostasParaPersona(currentPersona.id)
          .slice(0, 3)
          .map((r) => `• ${r.prompt}`)
          .join('\n');
        content = `Boa pergunta! Não tenho uma resposta pré-construída para "${text}", mas posso te ajudar com qualquer um destes temas:

${sugestoes}

Ou descreva o que quer explorar e te direciono.`;
        actions = [
          { label: 'Ver meu PDI', href: '/pdi' },
          { label: 'Abrir GPS de Carreira', href: '/mapa-carreira' },
        ];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const personaLabel =
    currentPersona.role === 'lider'
      ? 'Copiloto de Liderança'
      : currentPersona.role === 'pc_analista'
      ? 'Copiloto de Pessoas & Cultura'
      : 'Copiloto de Carreira';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto h-[calc(100vh-130px)] flex gap-5"
    >
      {/* Coluna principal: chat */}
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
              <p className="text-xs text-gray-500">
                Seu copiloto de carreira, baseado nos seus dados de avaliação, PDI e aspiração
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="flex gap-2 mb-4">
          {quickActions.map((qa) => (
            <button
              key={qa.label}
              onClick={() => handleSend(qa.prompt)}
              className="card card-interactive p-2.5 text-left group flex-1"
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${qa.color}12` }}
                >
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

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-verde-digital text-white rounded-br-md'
                    : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
                }`}
              >
                <div
                  className={`text-sm whitespace-pre-line leading-relaxed ${
                    msg.role === 'user' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.actions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-verde-50 text-verde-digital hover:bg-verde-100 transition-colors flex items-center gap-1"
                      >
                        {action.label} <ArrowRight className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-verde-digital/40 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-verde-digital/40 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-verde-digital/40 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
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

      {/* Sidebar direito */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 space-y-4">
        {/* Tópicos sugeridos */}
        <div className="card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            Tópicos sugeridos
          </p>
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

        {/* Nudges do hub (contextuais) */}
        <div className="card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            Nudges sugeridos
          </p>
          <div className="space-y-2">
            {hub.nudges.slice(0, 3).map((n) => (
              <a
                key={n.id}
                href={n.ctaHref || '#'}
                className="block text-xs text-gray-700 hover:text-verde-digital transition-colors"
              >
                <p className="font-semibold leading-snug">{n.titulo}</p>
                <p className="text-[10px] text-gray-500 line-clamp-2">{n.descricao}</p>
              </a>
            ))}
            {hub.nudges.length === 0 && (
              <p className="text-xs text-gray-400 italic">Sem nudges ativos no momento.</p>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Theo usa seus dados na interface (avaliação, PDI, aspiração, equipe) para gerar
            sugestões personalizadas. Suas respostas linkam diretamente para os módulos
            relacionados.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
