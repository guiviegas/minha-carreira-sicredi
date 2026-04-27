'use client';

import { usePersona } from '@/contexts/PersonaContext';
import { employees } from '@/data/employees';
import { getRoleById } from '@/data/roles';
import { reguaPotencial } from '@/data/elofy-config';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Filter,
  Download,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

// 9-box data
const nineBoxData: Array<{ employeeId: string; performance: 1 | 2 | 3; potencial: 1 | 2 | 3 }> = [
  { employeeId: 'emp-001', performance: 3, potencial: 2 },
  { employeeId: 'emp-002', performance: 2, potencial: 2 },
  { employeeId: 'emp-101', performance: 2, potencial: 1 },
  { employeeId: 'emp-102', performance: 2, potencial: 2 },
  { employeeId: 'emp-103', performance: 3, potencial: 3 },
  { employeeId: 'emp-104', performance: 2, potencial: 1 },
  { employeeId: 'emp-106', performance: 2, potencial: 2 },
  { employeeId: 'emp-108', performance: 3, potencial: 2 },
  { employeeId: 'emp-109', performance: 3, potencial: 1 },
];

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

export default function MapaTalentosPage() {
  const { currentPersona } = usePersona();
  if (!currentPersona || currentPersona.role !== 'pc_analista') return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Talentos</h1>
          <p className="text-sm text-gray-500 mt-1">Matriz 9-Box — Performance vs Potencial · Cooperativa Pioneira</p>
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

      {/* 9-Box Grid */}
      <motion.div variants={item} className="card p-5">
        <div className="grid grid-cols-3 gap-2">
          {[3, 2, 1].map((potencial) => (
            [1, 2, 3].map((performance) => {
              const key = `${performance}-${potencial}`;
              const config = boxLabels[key];
              const occupants = nineBoxData.filter(d => d.performance === performance && d.potencial === potencial);

              return (
                <div key={key} className="p-3 rounded-lg min-h-[100px] relative" style={{ backgroundColor: config.bg, border: `1px solid ${config.cor}20` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.cor }}>{config.label}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {occupants.map((occ) => {
                      const emp = employees.find(e => e.id === occ.employeeId);
                      if (!emp) return null;
                      return (
                        <div key={occ.employeeId} className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: config.cor }} title={emp.name}>
                          {emp.avatar}
                        </div>
                      );
                    })}
                  </div>
                  <span className="absolute bottom-1.5 right-2 text-[10px] font-bold" style={{ color: config.cor }}>{occupants.length}</span>
                </div>
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
