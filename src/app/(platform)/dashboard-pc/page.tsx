'use client';

import { pcDashboardData } from '@/data/kpis';
import { branches } from '@/data/branches';
import { motion } from 'framer-motion';
import { BarChart3, Users, Heart, TrendingUp, AlertTriangle, DollarSign, ArrowRight, Brain, Target } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const data = pcDashboardData;

export default function DashboardPCPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard P&C</h1>
        <p className="text-sm text-gray-500 mt-1">Centro de Comando · Cooperativa Caminhos · 400 colaboradores</p>
      </motion.div>

      {/* Panel 1: Career Health */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-verde-digital" /> Saúde de Carreira
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-verde-50 text-center">
            <p className="text-2xl font-bold text-verde-digital metric-value">{data.careerHealth.systemAverage}%</p>
            <p className="text-xs text-green-700">Média Sistema</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-center">
            <p className="text-2xl font-bold text-amber-600 metric-value">{data.careerHealth.readyForNextStep}</p>
            <p className="text-xs text-amber-700">Prontos sem Movimento (+6m)</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 text-center">
            <p className="text-2xl font-bold text-red-600 metric-value">{data.careerHealth.overdueDevPlans}</p>
            <p className="text-xs text-red-700">Planos em Atraso</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-center">
            <p className="text-2xl font-bold text-blue-600 metric-value">
              {data.talentSuccession.successionCoverage.covered}/{data.talentSuccession.successionCoverage.total}
            </p>
            <p className="text-xs text-blue-700">Sucesso Coberta (GAs)</p>
          </div>
        </div>
        {/* Branch Ranking */}
        <div className="space-y-2">
          {data.careerHealth.branchRanking.map((b, i) => (
            <div key={b.branch} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
              <span className="text-sm text-gray-700 w-36 truncate">{b.branch}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: b.score >= 70 ? '#22C55E' : b.score >= 55 ? '#F59E0B' : '#EF4444',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${b.score}%` }}
                  transition={{ duration: 0.6, delay: 0.05 * i }}
                />
              </div>
              <span className="text-xs font-bold metric-value w-8 text-right" style={{
                color: b.score >= 70 ? '#22C55E' : b.score >= 55 ? '#F59E0B' : '#EF4444',
              }}>{b.score}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Panel 2: Talent & Succession */}
        <motion.div variants={item} className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" /> Talento & Sucessão
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-600">High Performers / High Potential</span>
              <span className="text-sm font-bold text-gray-900 metric-value">{data.talentSuccession.highPerformersHighPotential}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
              <span className="text-sm text-red-700">Sem plano de desenvolvimento</span>
              <span className="text-sm font-bold text-red-600 metric-value">{data.talentSuccession.noDevPlan}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-600">Pipeline GA (5 disponíveis / 3 necessários)</span>
              <span className="text-sm font-bold text-green-600">OK</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50">
              <span className="text-sm text-amber-700">Pipeline GN (7 disponíveis / 9 necessários)</span>
              <span className="text-sm font-bold text-amber-600">! -2</span>
            </div>
          </div>
        </motion.div>

        {/* Panel 3: Climate & Culture */}
        <motion.div variants={item} className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" /> Clima & Cultura
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-center">
              <p className="text-xl font-bold text-green-700 metric-value">{data.climateAndCulture.eNPS}</p>
              <p className="text-xs text-green-600">eNPS (+{data.climateAndCulture.eNPS - data.climateAndCulture.eNPSPrevious})</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-center">
              <p className="text-xl font-bold text-amber-700 metric-value">{data.climateAndCulture.careerNPS}</p>
              <p className="text-xs text-amber-600">Career NPS (meta: {data.climateAndCulture.careerNPSTarget})</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Top Temas (Stay Interviews)</p>
          <div className="space-y-1.5">
            {data.climateAndCulture.topThemes.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${(t.mentions / data.climateAndCulture.topThemes[0].mentions) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-600 w-40 truncate">{t.theme}</span>
                <span className="text-[11px] font-semibold text-purple-600 metric-value">{t.mentions}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Panel 4: Business Connection */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" /> Conexão com Negócio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-red-50 text-center">
            <p className="text-xl font-bold text-red-600 metric-value">R$ {data.businessConnection.turnoverCostQuarter}M</p>
            <p className="text-xs text-red-700">Custo Turnover (trimestre)</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 text-center">
            <p className="text-xl font-bold text-green-600 metric-value">R$ {data.businessConnection.devROI}:1</p>
            <p className="text-xs text-green-700">ROI Desenvolvimento</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-center">
            <p className="text-xl font-bold text-amber-600 metric-value">R$ {data.businessConnection.scenarioDoNothing}M</p>
            <p className="text-xs text-amber-700">Custo Inação (projeção)</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-center">
            <p className="text-xl font-bold text-blue-600 metric-value">R$ {data.businessConnection.scenarioReduce5pp}M</p>
            <p className="text-xs text-blue-700">Economia se -5pp turnover</p>
          </div>
        </div>

        {/* Correlation Chart (simplified) */}
        <p className="text-xs font-semibold text-gray-500 mb-2">Correlação: Saúde de Carreira × NPS Associado</p>
        <div className="bg-gray-50 rounded-lg p-4 h-48 relative">
          {data.businessConnection.correlationData.map((d, i) => {
            const x = ((d.careerHealth - 40) / 50) * 100;
            const y = 100 - ((d.memberNPS - 45) / 30) * 100;
            return (
              <motion.div
                key={d.branch}
                className="absolute w-8 h-8 rounded-full bg-verde-digital/20 border-2 border-verde-digital flex items-center justify-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
              >
                <span className="text-[8px] font-bold text-verde-impresso">{d.branch.slice(0, 3)}</span>
              </motion.div>
            );
          })}
          <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-gray-400">Saúde de Carreira →</div>
          <div className="absolute left-1 top-0 bottom-0 flex items-center text-[10px] text-gray-400" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>NPS Associado →</div>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          Correlação positiva forte: agências com maior saúde de carreira apresentam 15% mais NPS de associado
        </p>
      </motion.div>

      {/* Turnover Trend */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-verde-digital" /> Tendência de Turnover
        </h2>
        <div className="flex items-end justify-between h-32 px-2">
          {data.turnoverTrend.map((t, i) => (
            <div key={t.month} className="flex flex-col items-center gap-1 flex-1">
              <motion.div
                className="w-8 rounded-t-lg"
                style={{ backgroundColor: t.rate > 17 ? '#EF4444' : t.rate > 16 ? '#F59E0B' : '#22C55E' }}
                initial={{ height: 0 }}
                animate={{ height: `${(t.rate / 20) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.08 * i }}
              />
              <span className="text-[9px] text-gray-400">{t.month}</span>
              <span className="text-[10px] font-bold metric-value">{t.rate}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-green-600 mt-3 font-semibold">Tendência de queda: -3.3pp nos últimos 7 meses</p>
      </motion.div>
    </motion.div>
  );
}
