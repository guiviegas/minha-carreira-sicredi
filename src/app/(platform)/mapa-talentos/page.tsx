'use client';

import { useMemo, useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { employees } from '@/data/employees';
import { avaliacoesMock, reguaPotencial } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  Filter,
  Download,
  ArrowRight,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/**
 * Calcula 9-box (performance × potencial) puxando das avaliações reais (avaliacoesMock).
 * - Performance: notaFinalPerformance (1-4) mapeada para 1-3 (1-2=baixa, 3=média, 4=alta).
 * - Potencial: potencialId mapeado: fortelecer=1, crescer=2, acelerar=3.
 * Para colaboradores sem avaliação, usa heurística (engagementScore + performanceRating).
 */
function buildNineBoxData() {
  return employees
    .filter((e) => e.id !== 'emp-005' && e.id !== 'emp-006') // exclui personas sem time relevante para mapa
    .map((emp) => {
      const aval = avaliacoesMock.find(
        (a) => a.employeeId === emp.id && a.cicloId === 'ciclo-2026-1',
      );
      let performance: 1 | 2 | 3;
      let potencial: 1 | 2 | 3;

      if (aval) {
        const nota = aval.notaFinalPerformance;
        performance = nota >= 4 ? 3 : nota === 3 ? 2 : 1;
        const pot = aval.potencialId;
        potencial = pot === 'acelerar' ? 3 : pot === 'crescer' ? 2 : 1;
      } else {
        // Heurística para quem não tem avaliação no ciclo
        performance = emp.performanceRating >= 4.0 ? 3 : emp.performanceRating >= 3.5 ? 2 : 1;
        potencial = emp.engagementScore >= 80 ? 3 : emp.engagementScore >= 65 ? 2 : 1;
      }

      return { employeeId: emp.id, performance, potencial };
    });
}

const boxLabels: Record<string, { label: string; cor: string; bg: string }> = {
  '3-3': { label: 'Estrela', cor: '#2563EB', bg: '#EFF6FF' },
  '3-2': { label: 'Alto Potencial', cor: '#16A34A', bg: '#F0FDF4' },
  '3-1': { label: 'Profissional Chave', cor: '#0E7490', bg: '#F0FDFA' },
  '2-3': { label: 'Diamante Bruto', cor: '#7C3AED', bg: '#FAF5FF' },
  '2-2': { label: 'Contribuidor Sólido', cor: '#D97706', bg: '#FFFBEB' },
  '2-1': { label: 'Efetivo', cor: '#6B7280', bg: '#F3F4F6' },
  '1-3': { label: 'Enigma', cor: '#DC2626', bg: '#FEF2F2' },
  '1-2': { label: 'Risco', cor: '#DC2626', bg: '#FEF2F2' },
  '1-1': { label: 'Ação Urgente', cor: '#DC2626', bg: '#FEF2F2' },
};

// Ações sugeridas por quadrante (estratégia P&C oficial)
const acoesPorQuadrante: Record<string, { titulo: string; acao: string }> = {
  '3-3': { titulo: 'Estrela', acao: 'Plano de aceleração + sucessão para liderança sênior em 12-18m.' },
  '3-2': { titulo: 'Alto Potencial', acao: 'Mentoria com líder sênior + projeto desafiador (stretch).' },
  '3-1': { titulo: 'Profissional Chave', acao: 'Reconhecimento e retenção. Pode pivotar lateralmente para escalar.' },
  '2-3': { titulo: 'Diamante Bruto', acao: 'Investir em desenvolvimento intensivo (PDI prioritário).' },
  '2-2': { titulo: 'Contribuidor Sólido', acao: 'Acompanhar no ciclo. Mérito quando elegível.' },
  '2-1': { titulo: 'Efetivo', acao: 'Monitorar engajamento. Conversa de carreira para reativar.' },
  '1-3': { titulo: 'Enigma', acao: 'Avaliar fit com o cargo: pode estar no lugar errado.' },
  '1-2': { titulo: 'Risco', acao: 'PDI imediato com indicadores claros e prazo de 90 dias.' },
  '1-1': { titulo: 'Ação Urgente', acao: 'Plano de melhoria formal ou avaliação de desligamento ético.' },
};

export default function MapaTalentosPage() {
  const { currentPersona } = usePersona();
  const [selected, setSelected] = useState<string | null>(null);
  const nineBoxData = useMemo(() => buildNineBoxData(), []);

  if (!currentPersona || currentPersona.role !== 'pc_analista') return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Talentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Matriz 9-Box: Performance × Potencial · Cooperativa Convergência ·{' '}
            {nineBoxData.length} colaboradores avaliados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Filter className="w-3.5 h-3.5" /> Filtrar
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </motion.div>

      {/* 9-Box Grid (clicável) */}
      <motion.div variants={item} className="card p-5">
        <div className="grid grid-cols-3 gap-2">
          {[3, 2, 1].map((potencial) => (
            [1, 2, 3].map((performance) => {
              const key = `${performance}-${potencial}`;
              const config = boxLabels[key];
              const acao = acoesPorQuadrante[key];
              const occupants = nineBoxData.filter(d => d.performance === performance && d.potencial === potencial);
              const isSelected = selected === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelected(isSelected ? null : key)}
                  className={`p-3 rounded-lg min-h-[110px] relative text-left transition-all ${
                    isSelected ? 'ring-2 ring-offset-1' : 'hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: config.bg,
                    border: `1px solid ${config.cor}30`,
                    boxShadow: isSelected ? `0 0 0 2px ${config.cor}` : undefined,
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.cor }}>
                    {config.label}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {occupants.map((occ) => {
                      const emp = employees.find(e => e.id === occ.employeeId);
                      if (!emp) return null;
                      return (
                        <a
                          key={occ.employeeId}
                          href={`/equipe/${emp.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white hover:scale-110 transition-transform"
                          style={{ backgroundColor: config.cor }}
                          title={`${emp.name} (clique para abrir perfil)`}
                        >
                          {emp.avatar}
                        </a>
                      );
                    })}
                  </div>
                  <span className="absolute bottom-1.5 right-2 text-[11px] font-bold" style={{ color: config.cor }}>
                    {occupants.length}
                  </span>
                </button>
              );
            })
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
          <span>← Baixa Performance</span>
          <span className="font-semibold text-gray-500">Performance →</span>
          <span>Alta Performance →</span>
        </div>
        <div className="text-center text-[10px] text-gray-400 mt-1">↑ Alto Potencial · ↓ Consolidar</div>

        {/* Painel de ação por quadrante */}
        {selected && (
          <div
            className="mt-4 p-4 rounded-lg border"
            style={{
              backgroundColor: boxLabels[selected].bg,
              borderColor: `${boxLabels[selected].cor}40`,
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: boxLabels[selected].cor }}>
              {acoesPorQuadrante[selected].titulo} · ação recomendada
            </p>
            <p className="text-sm text-gray-700">{acoesPorQuadrante[selected].acao}</p>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center border-t-3" style={{ borderTopColor: '#2563EB', borderTopWidth: '3px' }}>
          <p className="text-2xl font-bold text-blue-600">{nineBoxData.filter(d => d.performance === 3 && d.potencial >= 2).length}</p>
          <p className="text-[11px] text-gray-500">Alto potencial</p>
          <p className="text-[10px] text-gray-400">Prontos para acelerar</p>
        </div>
        <div className="card p-4 text-center border-t-3" style={{ borderTopColor: '#D97706', borderTopWidth: '3px' }}>
          <p className="text-2xl font-bold text-amber-600">{nineBoxData.filter(d => d.performance === 2).length}</p>
          <p className="text-[11px] text-gray-500">Em desenvolvimento</p>
          <p className="text-[10px] text-gray-400">Acompanhar de perto</p>
        </div>
        <div className="card p-4 text-center border-t-3" style={{ borderTopColor: '#DC2626', borderTopWidth: '3px' }}>
          <p className="text-2xl font-bold text-red-500">{nineBoxData.filter(d => d.performance === 1).length}</p>
          <p className="text-[11px] text-gray-500">Ação necessária</p>
          <p className="text-[10px] text-gray-400">PDI prioritário</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
