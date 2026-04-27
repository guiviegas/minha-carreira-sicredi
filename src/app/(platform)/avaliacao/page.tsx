'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { competenciasSicredi } from '@/data/competencias-sicredi';
import { reguaPerformance, avaliacoesMock, ELOFY_URL } from '@/data/elofy-config';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, MessageSquare, Calendar,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Heart, ExternalLink,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// Régua oficial Sicredi de 4 pontos
const REGUA_4_PONTOS = [
  { id: 1, hashtag: '#precisaevoluir', label: 'Precisa Evoluir', faixa: '0,80 a 0,89', cor: '#EF4444', bgCor: '#FEE2E2', desc: 'Resultado abaixo do esperado. Necessita de plano de ação imediato.' },
  { id: 2, hashtag: '#quaselá', label: 'Quase Lá', faixa: '0,90 a 0,99', cor: '#F59E0B', bgCor: '#FEF3C7', desc: 'Resultado próximo, mas ainda não atingiu plenamente as expectativas.' },
  { id: 3, hashtag: '#mandoubem', label: 'Mandou Bem', faixa: '1,00 a 1,10', cor: '#3FA110', bgCor: '#DCFCE7', desc: 'Atingiu as expectativas de forma consistente.' },
  { id: 4, hashtag: '#arrasou', label: 'Arrasou', faixa: '1,11 a 1,20', cor: '#16A34A', bgCor: '#BBF7D0', desc: 'Superou as expectativas de forma expressiva.' },
];

interface MetaNegocio {
  titulo: string;
  conceito: number;
  observacao: string;
}

export default function AvaliacaoPage() {
  const { currentPersona } = usePersona();
  const [expandedMeta, setExpandedMeta] = useState<number | null>(null);

  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;
  const role = getRoleById(employee.roleId);
  const avaliacaoAtual = avaliacoesMock.find(a => a.employeeId === employee.id && a.cicloId === 'ciclo-2026-1');

  // 3 objetivos de negócio acordados
  const metasNegocio: MetaNegocio[] = [
    { titulo: 'Atingimento da meta comercial da carteira', conceito: 3, observacao: 'Atingiu 94% da meta trimestral. Resultado consistente ao longo do ciclo.' },
    { titulo: 'Satisfação do associado na carteira', conceito: 4, observacao: 'Nota 92 de satisfação, top 3 da agência. Retornos positivos dos associados.' },
    { titulo: 'Prospecção de novos associados', conceito: 2, observacao: 'Média de 3 por mês contra meta de 5. Precisa intensificar abordagem ativa.' },
  ];

  const mediaMetas = Math.round(metasNegocio.reduce((s, m) => s + m.conceito, 0) / metasNegocio.length);
  const conceitoFinal = avaliacaoAtual ? avaliacaoAtual.notaFinalPerformance : mediaMetas;
  const conceitoConfig = REGUA_4_PONTOS[conceitoFinal - 1] || REGUA_4_PONTOS[2];

  // Feedbacks recebidos
  const feedbacks = [
    { from: 'Roberto Mendes', date: 'Mar 2026', text: 'Mariana mostrou excelente evolução na gestão da carteira. Precisa investir mais em prospecção ativa.', type: 'líder' },
    { from: 'Ana Paula Lima', date: 'Fev 2026', text: 'Ótima colega, sempre disposta a ajudar novos colaboradores. Tem potencial para liderança.', type: 'par' },
    { from: 'Autoavaliação', date: 'Jan 2026', text: 'Sinto que estou pronta para mais responsabilidades. Quero desenvolver habilidades de liderança.', type: 'auto' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliação de Desempenho</h1>
          <p className="text-sm text-gray-500 mt-1">Ciclo 2026.1 · {role?.title}</p>
        </div>
        <a href={ELOFY_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          Abrir no Elofy <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>

      {/* Conceito Final */}
      <motion.div variants={item} className="card p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: conceitoConfig.bgCor }}>
            <span className="text-xl font-extrabold" style={{ color: conceitoConfig.cor }}>{conceitoConfig.hashtag}</span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900">Conceito Final do Ciclo</p>
            <p className="text-sm text-gray-500 mt-0.5">{conceitoConfig.desc}</p>
            <div className="flex gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Atualizado: Abr 2026</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {feedbacks.length} feedbacks recebidos</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Régua Oficial */}
      <motion.div variants={item} className="card p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Régua de Avaliação Sicredi</p>
        <div className="grid grid-cols-4 gap-2">
          {REGUA_4_PONTOS.map((r) => (
            <div key={r.id} className={`p-3 rounded-lg border-2 transition-all ${conceitoFinal === r.id ? 'shadow-sm' : ''}`} style={{ backgroundColor: r.bgCor, borderColor: conceitoFinal === r.id ? r.cor : 'transparent' }}>
              <p className="text-sm font-bold" style={{ color: r.cor }}>{r.hashtag}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{r.faixa}</p>
              <p className="text-[10px] text-gray-600 mt-1 leading-tight">{r.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Objetivos de Negócio Acordados */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-verde-digital" /> Objetivos de Negócio Acordados
        </h2>
        <div className="space-y-3">
          {metasNegocio.map((meta, i) => {
            const metaConfig = REGUA_4_PONTOS[meta.conceito - 1];
            const isExpanded = expandedMeta === i;
            return (
              <div key={i} className="rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                <button onClick={() => setExpandedMeta(isExpanded ? null : i)} className="w-full p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {meta.conceito >= 3 ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: metaConfig.cor }} />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" style={{ color: metaConfig.cor }} />
                      )}
                      <p className="text-sm font-medium text-gray-800">{meta.titulo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: metaConfig.bgCor, color: metaConfig.cor }}>
                        {metaConfig.hashtag}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-gray-600">{meta.observacao}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Competências: Jeito Sicredi de Ser — REDESIGNED */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-verde-digital" /> Competências: Jeito Sicredi de Ser
        </h2>
        {avaliacaoAtual ? (
          <div className="space-y-0">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <div className="col-span-5">Competência</div>
              <div className="col-span-2 text-center">Autoavaliação</div>
              <div className="col-span-2 text-center">Líder</div>
              <div className="col-span-3 text-center">Consenso</div>
            </div>

            {/* Linhas */}
            {avaliacaoAtual.competencias.map((comp, i) => {
              const compInfo = competenciasSicredi.find(c => c.id === comp.competenciaId);
              const autoConfig = REGUA_4_PONTOS[comp.autoAvaliacao - 1];
              const liderConfig = REGUA_4_PONTOS[comp.avaliacaoLider - 1];
              const consensoConfig = comp.consenso ? REGUA_4_PONTOS[comp.consenso - 1] : null;

              return (
                <div key={i} className={`grid grid-cols-12 gap-2 px-4 py-3 items-center rounded-lg ${i % 2 === 0 ? 'bg-gray-50/70' : ''}`}>
                  {/* Nome */}
                  <div className="col-span-5">
                    <p className="text-sm font-semibold text-gray-800">{compInfo?.nome || comp.competenciaId}</p>
                  </div>

                  {/* Autoavaliação */}
                  <div className="col-span-2 flex justify-center">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap"
                      style={{ backgroundColor: autoConfig?.bgCor, color: autoConfig?.cor }}
                    >
                      {autoConfig?.hashtag}
                    </span>
                  </div>

                  {/* Líder */}
                  <div className="col-span-2 flex justify-center">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap"
                      style={{ backgroundColor: liderConfig?.bgCor, color: liderConfig?.cor }}
                    >
                      {liderConfig?.hashtag}
                    </span>
                  </div>

                  {/* Consenso */}
                  <div className="col-span-3 flex justify-center">
                    {consensoConfig ? (
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap"
                        style={{ backgroundColor: consensoConfig.bgCor, color: consensoConfig.cor }}
                      >
                        {consensoConfig.hashtag}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-300">Pendente</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Avaliação de competências não disponível para este ciclo.</p>
        )}
      </motion.div>

      {/* Feedbacks Recebidos */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-verde-digital" /> Feedbacks Recebidos
        </h2>
        <div className="space-y-3">
          {feedbacks.map((fb, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800">{fb.from}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{fb.type}</span>
                  <span className="text-[10px] text-gray-400">{fb.date}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{fb.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
