'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Download,
  Filter,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const kpis = [
  { label: 'Saúde de Carreira', valor: '62%', meta: '75%', tendencia: '+3pp', status: 'yellow' as const, icon: Target },
  { label: 'Turnover Voluntário', valor: '8,2%', meta: '<6%', tendencia: '-1,2pp', status: 'yellow' as const, icon: Users },
  { label: 'Custo Turnover Tri.', valor: 'R$ 2,1M', meta: '<R$ 1,5M', tendencia: '-12%', status: 'green' as const, icon: TrendingDown },
  { label: 'eNPS', valor: '42', meta: '55', tendencia: '+4', status: 'green' as const, icon: TrendingUp },
  { label: 'Career NPS', valor: '28', meta: '40', tendencia: '+5', status: 'yellow' as const, icon: BarChart3 },
  { label: 'Tempo p/ Prontidão', valor: '14,2m', meta: '<12m', tendencia: '-0,8m', status: 'green' as const, icon: Clock },
  { label: 'PDIs Ativos', valor: '156', meta: '200', tendencia: '+23', status: 'yellow' as const, icon: Target },
  { label: 'Sucessão Coberta', valor: '72%', meta: '85%', tendencia: '+5pp', status: 'yellow' as const, icon: Users },
];

const insights = [
  { tipo: 'alerta', texto: '14 colaboradores prontos para movimentação. 5 em risco de saída', cor: '#DC2626' },
  { tipo: 'tendencia', texto: 'Família PF: tempo médio de prontidão caiu de 16 para 14 meses no último semestre', cor: '#16A34A' },
  { tipo: 'alerta', texto: '23 PDIs com ações atrasadas. Concentrados nas agências Mirante e Araucária', cor: '#D97706' },
  { tipo: 'oportunidade', texto: '8 GNs PF II com perfil para programa de aceleração para GA', cor: '#2563EB' },
];

export default function AnalyticsPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona || currentPersona.role !== 'pc_analista') return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">People Analytics avançado · Cooperativa Caminhos</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Filter className="w-3.5 h-3.5" /> Período
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </motion.div>

      {/* KPIs Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-4 h-4 text-gray-400" />
              <div className={`w-2.5 h-2.5 rounded-full ${kpi.status === 'green' ? 'bg-green-400' : 'bg-amber-400'}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{kpi.valor}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{kpi.label}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-gray-400">Meta: {kpi.meta}</span>
              <span className={`text-[10px] font-semibold ${kpi.status === 'green' ? 'text-green-600' : 'text-amber-600'}`}>
                {kpi.tendencia}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={item} className="card p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">Insights Inteligentes</p>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: insight.cor }} />
              <p className="text-sm text-gray-700">{insight.texto}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts placeholder */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">Turnover por Família</p>
          <div className="space-y-2">
            {[
              { familia: 'Negócios PF', valor: 12, cor: '#3FA110' },
              { familia: 'Negócios PJ', valor: 8, cor: '#00897B' },
              { familia: 'AGRO', valor: 5, cor: '#7CB342' },
              { familia: 'Atendimento', valor: 18, cor: '#D97706' },
              { familia: 'Operações', valor: 3, cor: '#78909C' },
            ].map((f) => (
              <div key={f.familia} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24">{f.familia}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.valor * 5}%`, backgroundColor: f.cor }} />
                </div>
                <span className="text-xs font-bold text-gray-700 w-8 text-right">{f.valor}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">Prontidão por Nível</p>
          <div className="space-y-2">
            {[
              { nivel: 'Pronto agora', valor: 14, cor: '#16A34A' },
              { nivel: 'Pronto 1 ano', valor: 28, cor: '#2563EB' },
              { nivel: 'Em desenvolvimento', valor: 45, cor: '#D97706' },
              { nivel: 'Início jornada', valor: 67, cor: '#6B7280' },
            ].map((n) => (
              <div key={n.nivel} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-28">{n.nivel}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${n.valor}%`, backgroundColor: n.cor }} />
                </div>
                <span className="text-xs font-bold text-gray-700 w-8 text-right">{n.valor}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
