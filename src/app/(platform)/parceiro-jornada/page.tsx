'use client';

import { useState, useRef, useEffect } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { motion } from 'framer-motion';
import { Sparkles, Send, ArrowRight, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; type: 'action' }[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// Pre-scripted conversations per persona
const initialMessages: Record<string, Message[]> = {
  mariana: [
    {
      id: '1',
      role: 'assistant',
      content: 'Olá Mariana! Sou o Theo, seu parceiro de jornada aqui no Sicredi. Vi que você está a caminho de GN PF III — e está indo super bem! Sua prontidão está em 68%. Como posso te ajudar hoje?',
      actions: [
        { label: 'Preparar minha 1:1 com Roberto', type: 'action' },
        { label: 'O que falta para ser GA?', type: 'action' },
        { label: 'Falar sobre o projeto no Centro', type: 'action' },
      ],
    },
  ],
  roberto: [
    {
      id: '1',
      role: 'assistant',
      content: 'Olá Roberto! Aqui é o Theo. Vi que a Juliana Pereira está com risco de turnover de 78%. Quer que eu te ajude a preparar uma stay conversation? Também posso te apoiar com a 1:1 da Mariana na quinta.',
      actions: [
        { label: 'Preparar stay interview com Juliana', type: 'action' },
        { label: 'Preparar 1:1 com Mariana', type: 'action' },
        { label: 'Ver mapa de sucessão', type: 'action' },
      ],
    },
  ],
  lucas: [
    {
      id: '1',
      role: 'assistant',
      content: 'Fala Lucas! Sou o Theo, to aqui pra te acompanhar nessa jornada no Sicredi! Como estão seus primeiros 2 meses? Posso te ajudar a entender melhor o cooperativismo ou explorar caminhos de carreira. Bora?',
      actions: [
        { label: 'O que é cooperativismo?', type: 'action' },
        { label: 'Quando posso ser GN?', type: 'action' },
        { label: 'Estou confuso com tanta info', type: 'action' },
      ],
    },
  ],
  carla: [
    {
      id: '1',
      role: 'assistant',
      content: 'Oi Carla! Aqui é o Theo. Pronta para a reunião com o Marcos? Preparei um resumo dos dados de turnover × NPS que mostram uma correlação forte. Posso ajudar a montar a apresentação estratégica.',
      actions: [
        { label: 'Montar apresentação para Marcos', type: 'action' },
        { label: 'Analisar comitê de carreira', type: 'action' },
        { label: 'Simulação de cenários', type: 'action' },
      ],
    },
  ],
};

const responses: Record<string, string> = {
  'Preparar minha 1:1 com Roberto': `Ótima ideia! Aqui estão os pontos que preparei para sua 1:1 com Roberto na quinta:

▸ **Seus destaques:**
• Satisfação do associado: Top 3 da agência (parabéns! )
• Meta trimestral: 94% — quase lá!

▸ **Ponto de atenção:**
• Cross-selling caiu 12% este mês — vale investigar o que está acontecendo

▸ **Temas sugeridos:**
1. Compartilhar seu interesse no projeto da Agência Centro
2. Discutir o módulo de Liderança Fundamentals (30% completo)
3. Pedir feedback sobre sua evolução para GA

▸ **Dica de coaching:** Quando falar sobre GA, tente perguntar "O que você recomenda que eu faça como próximo passo?" ao invés de apenas dizer que quer a posição.`,

  'O que falta para ser GA?': `Você está em 68% de prontidão para GA! ▸ Aqui está o que falta:

▸ **Pontos fortes (já atende):**
• Relacionamento com Associados: 92% (precisa 80%)
• Habilidade Comercial: 85% (precisa 85%)
• Cooperativismo: 88% (precisa 80%)

▸ **Áreas de desenvolvimento:**
• Liderança de Pessoas: 62% → precisa 80% (+18 pontos)
• Análise Financeira: 58% → precisa 70% (+12 pontos)
• Planejamento Estratégico: 55% → precisa 70% (+15 pontos)
• Gestão de Performance: 45% → precisa 75% (+30 pontos)

▸ **Plano sugerido (90 dias):**
1. **Mês 1:** Completar "Liderança Fundamentals" + iniciar mentoria
2. **Mês 2:** "Análise Financeira para GNs" + Job Shadow de 2 dias
3. **Mês 3:** Projeto de liderança + "Planejamento Estratégico"`,

  'Falar sobre o projeto no Centro': `O projeto na Agência Centro é uma ótima oportunidade!

**"Liderar projeto de satisfação Q3"**
• Duração: 4 semanas
• Match score: 92% — altíssimo para seu perfil
• Impacto estimado: +4% na sua prontidão para GA

**Por que é ideal para você:**
• Exercita liderança de projeto (seu gap mais importante)
• Visibilidade com a diretoria (apresentação de resultados)
• Networking com equipe de outra agência
• Paulo Andrade (GA Centro) é um excelente mentor

Quer que eu te ajude a preparar sua candidatura?`,

  'O que é cooperativismo?': `Boa pergunta, Lucas! Cooperativismo é diferente de tudo que você viu no banco:

**No banco:** A empresa tem dono (acionistas). O objetivo é lucro para eles.
**Na cooperativa:** Os ASSOCIADOS são os donos. O objetivo é benefício mútuo.

**Na prática no Sicredi:**
• Cada associado tem 1 voto, independente de quanto tem na conta
• O "lucro" se chama SOBRAS e é dividido entre os associados
• As decisões são em assembleia — democracia de verdade
• Você não é "funcionário de um banco" — você ajuda donos a crescerem

**Por que isso importa para SUA carreira:**
Aqui, relacionamento de longo prazo vale mais que meta de curto prazo. Isso muda tudo: como você atende, como cresce, como lidera.

Quer saber mais sobre como isso afeta seu dia a dia no balcão?`,
};

export default function ParceiroJornadaPage() {
  const { currentPersona } = usePersona();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPersona) {
      setMessages(initialMessages[currentPersona.id] || initialMessages.mariana);
    }
  }, [currentPersona]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentPersona) return null;

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = responses[text] || `Entendi sua pergunta sobre "${text}". Deixa eu analisar seus dados e te dar uma resposta personalizada...\n\nBaseado no seu perfil como ${currentPersona.jobTitle}, posso te ajudar a explorar isso. Quer que eu busque sugestões na sua trilha ou no seu PDI?`;
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto h-[calc(100vh-130px)] flex flex-col">
      {/* Header */}
      <motion.div variants={item} className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-verde-digital flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Theo</h1>
            <p className="text-xs text-gray-500">Seu parceiro de carreira no Sicredi · Homenagem ao Padre Theodor Amstad</p>
          </div>
        </div>
      </motion.div>

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
                {msg.content}
              </div>
              {msg.actions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.label)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1"
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
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
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
            placeholder="Pergunte sobre sua carreira..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none text-sm"
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
    </motion.div>
  );
}
