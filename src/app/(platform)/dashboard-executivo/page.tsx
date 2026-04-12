'use client';

import { executiveKPIs } from '@/data/kpis';
import { branches } from '@/data/branches';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Clock, Target, ArrowRight, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardExecutivoPage() {
  const kpiIcons = [Users, TrendingUp, Clock, Target];
  const vacantBranches = branches.filter(b => !b.gaId);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Executivo</h1>
        <p className="text-sm text-gray-500 mt-1">Cooperativa Pioneira · Abril 2026</p>
      </motion.div>

      {/* 4 Hero KPIs */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {executiveKPIs.map((kpi, i) => {
          const Icon = kpiIcons[i];
          return (
            <div key={kpi.id} className="card card-interactive p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-gray-400" />
                <div className={`w-3 h-3 rounded-full ${
                  kpi.status === 'green' ? 'bg-green-400' : kpi.status === 'yellow' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
              </div>
              <p className="text-3xl font-bold text-gray-900 metric-value">
                {kpi.unit === 'R$ M' ? `R$ ${kpi.value}M` : kpi.unit === '%' ? `${kpi.value}%` : `${kpi.value} ${kpi.unit}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              <div className="flex items-center gap-1 mt-2">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                ) : null}
                <span className="text-xs font-semibold text-green-600">
                  {kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}{kpi.unit === '%' ? 'pp' : kpi.unit === 'meses' ? ' m' : ''}
                </span>
                <span className="text-[10px] text-gray-400 ml-1">vs. período anterior</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Meta: {kpi.unit === 'R$ M' ? `R$ ${kpi.target}M` : `${kpi.target}${kpi.unit}`}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Succession Gaps Alert */}
      {vacantBranches.length > 0 && (
        <motion.div variants={item} className="card p-5 border-l-4 border-l-amber-400 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Gaps de Sucessão: {vacantBranches.length} posições GA vagas</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {vacantBranches.map(b => (
                  <span key={b.id} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                    {b.name} ({b.city})
                  </span>
                ))}
              </div>
              <button className="text-sm font-semibold text-amber-600 mt-3 flex items-center gap-1 hover:gap-2 transition-all">
                Ver candidatos e ações <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Branch Performance */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" /> Performance por Agência
        </h2>
        <div className="space-y-3">
          {branches
            .sort((a, b) => b.careerHealthScore - a.careerHealthScore)
            .map((branch) => (
              <div key={branch.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">{branch.name}</div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-gray-400">Saúde Carreira</span>
                      <span className="font-semibold metric-value" style={{
                        color: branch.careerHealthScore >= 70 ? '#22C55E' : branch.careerHealthScore >= 55 ? '#F59E0B' : '#EF4444'
                      }}>{branch.careerHealthScore}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${branch.careerHealthScore}%`,
                        backgroundColor: branch.careerHealthScore >= 70 ? '#22C55E' : branch.careerHealthScore >= 55 ? '#F59E0B' : '#EF4444',
                      }} />
                    </div>
                  </div>
                  <div className="text-center w-12">
                    <p className="text-xs font-bold metric-value">{branch.eNPS}</p>
                    <p className="text-[9px] text-gray-400">eNPS</p>
                  </div>
                  <div className="text-center w-14">
                    <p className="text-xs font-bold metric-value" style={{ color: branch.turnoverRate > 18 ? '#EF4444' : branch.turnoverRate > 15 ? '#F59E0B' : '#22C55E' }}>
                      {branch.turnoverRate}%
                    </p>
                    <p className="text-[9px] text-gray-400">Turnover</p>
                  </div>
                  <div className="text-center w-12">
                    <p className="text-xs font-bold metric-value">{branch.memberNPS}</p>
                    <p className="text-[9px] text-gray-400">NPS</p>
                  </div>
                  <div className="w-6">
                    {branch.gaId ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Expansion readiness */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Prontidão para Expansão (3 novas agências)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-semibold text-green-800">GA Pipeline</p>
            <p className="text-2xl font-bold text-green-700 metric-value mt-1">5 candidatos</p>
            <p className="text-xs text-green-600">Necessário: 3 · <span className="font-semibold">Excedente OK</span></p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm font-semibold text-amber-800">GN Pipeline</p>
            <p className="text-2xl font-bold text-amber-700 metric-value mt-1">7 candidatos</p>
            <p className="text-xs text-amber-600">Necessário: 9 · <span className="font-semibold">Déficit de 2</span></p>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs font-semibold text-blue-700">Recomendação IA</p>
          <p className="text-sm text-blue-800 mt-1">
            Acelerar 4 assistentes de alto potencial na trilha GN. Tempo estimado: 4-6 meses.
            Custo: <span className="font-bold">R$ 45K</span> (vs. R$ 180K para contratação externa).
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
