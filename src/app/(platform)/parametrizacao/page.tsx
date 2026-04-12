'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, ToggleLeft, ToggleRight, Gauge, Shield, Bell, Building2,
  Star, ChevronRight, X, CheckCircle2, Save, Search, Filter,
  AlertTriangle, TrendingUp, Info, Edit3
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const modules = [
  { id: 'meu-gps', name: 'Meu GPS', desc: 'Dashboard adaptativo pessoal', core: true, enabled: true },
  { id: 'mapa-carreira', name: 'Mapa de Carreira', desc: 'Visualização de caminhos profissionais', core: true, enabled: true },
  { id: 'perfil-vivo', name: 'Perfil Vivo', desc: 'Perfil rico do colaborador', core: true, enabled: true },
  { id: 'cargo-vivo', name: 'Cargo Vivo', desc: 'Descrições vivas de cargos', core: true, enabled: true },
  { id: 'expectativas', name: 'Expectativas Claras', desc: 'Clareza de papel e expectativas', core: false, enabled: true },
  { id: 'trilhas', name: 'Trilhas de Desenvolvimento', desc: 'Caminhos de aprendizagem', core: false, enabled: true },
  { id: 's2s', name: 'S2S - Peer Learning', desc: 'Rede de aprendizagem entre pares', core: false, enabled: false },
  { id: 'assessments', name: 'Assessments', desc: 'Avaliações de competências', core: false, enabled: true },
  { id: 'comite', name: 'Comitê de Carreira', desc: 'Gestão de comitês de talento', core: false, enabled: false },
  { id: 'avaliacao', name: 'Avaliação de Desempenho', desc: 'Avaliação contínua ou por ciclo', core: false, enabled: true },
  { id: 'conversas', name: 'Conversas de Carreira', desc: 'Separadas da avaliação', core: false, enabled: true },
  { id: 'metas', name: 'Metas & Impacto', desc: 'Cascateamento de metas', core: false, enabled: false },
  { id: 'marketplace', name: 'Marketplace de Movimentos', desc: 'Vagas, projetos, mentorias', core: false, enabled: true },
  { id: 'mobilidade', name: 'Regras de Mobilidade', desc: 'Governança de movimentação', core: false, enabled: true },
  { id: 'experimentacao', name: 'Experimentação', desc: 'Job shadow, projetos, simulações', core: false, enabled: false },
  { id: 'gamificacao', name: 'Gamificação', desc: 'Pontos, badges, achievements', core: false, enabled: true },
  { id: 'sicredi-in', name: 'SicredIn', desc: 'Rede social interna', core: false, enabled: false },
  { id: 'ia-embarcada', name: 'IA Embarcada', desc: 'Inteligência invisível', core: false, enabled: true },
  { id: 'parceiro-jornada', name: 'Parceiro de Jornada', desc: 'IA on-demand', core: false, enabled: true },
  { id: 'predicoes', name: 'Predições & Alertas', desc: 'Turnover risk, readiness', core: false, enabled: true },
  { id: 'stay-interviews', name: 'Stay Interviews', desc: 'Check-ins automatizados', core: false, enabled: false },
];

const cooperatives = [
  { name: 'Cooperativa Pioneira', state: 'RS', tier: 'avancado' as const, adoption: 87, modules: 18, employees: 342 },
  { name: 'Cooperativa Serrana', state: 'MG', tier: 'desenvolvimento' as const, adoption: 62, modules: 12, employees: 156 },
  { name: 'Cooperativa Central', state: 'PR', tier: 'avancado' as const, adoption: 82, modules: 16, employees: 280 },
  { name: 'Cooperativa Norte', state: 'PA', tier: 'basico' as const, adoption: 38, modules: 6, employees: 89 },
  { name: 'Cooperativa Nordeste', state: 'CE', tier: 'basico' as const, adoption: 42, modules: 7, employees: 112 },
  { name: 'Cooperativa Sul', state: 'SC', tier: 'desenvolvimento' as const, adoption: 71, modules: 14, employees: 198 },
];

const tierColors = { basico: '#EF4444', desenvolvimento: '#F59E0B', avancado: '#22C55E' };
const tierLabels = { basico: 'Básico', desenvolvimento: 'Desenvolvimento', avancado: 'Avançado' };

interface SystemRule {
  id: string;
  label: string;
  value: string;
  editable: boolean;
  description: string;
  options?: string[];
}

const systemRules: SystemRule[] = [
  { id: 'cadencia', label: 'Cadência de Avaliação', value: 'Trimestral (recomendado)', editable: true, description: 'Frequência do ciclo formal de avaliação de desempenho', options: ['Mensal', 'Trimestral (recomendado)', 'Semestral', 'Anual'] },
  { id: 'tempo-cargo', label: 'Tempo Mínimo no Cargo', value: '12 meses', editable: true, description: 'Período mínimo antes de elegibilidade para movimentação', options: ['6 meses', '12 meses', '18 meses', '24 meses'] },
  { id: 'notificacao', label: 'Notificação de Saída', value: 'GA + P&C, 30 dias antecedência', editable: true, description: 'Quem é notificado e com quanto tempo de antecedência', options: ['Apenas P&C, 15 dias', 'GA + P&C, 30 dias antecedência', 'GA + P&C + Diretor, 45 dias'] },
  { id: 'comite', label: 'Comitê de Carreira', value: 'Trimestral (obrigatório nível Avançado)', editable: true, description: 'Frequência de reuniões do comitê de talentos', options: ['Mensal', 'Trimestral (obrigatório nível Avançado)', 'Semestral'] },
  { id: 'assessment', label: 'Assessment Obrigatório', value: 'Anual para transição de cargo', editable: false, description: 'Regra sistêmica definida pela CAS — não editável pela cooperativa' },
  { id: 'turnover', label: 'Turnover Risk Threshold', value: '70% (alerta automático)', editable: true, description: 'Nível a partir do qual alertas são disparados automaticamente', options: ['50% (sensível)', '60% (moderado)', '70% (alerta automático)', '80% (conservador)'] },
];

export default function ParametrizacaoPage() {
  const [autonomyMode, setAutonomyMode] = useState<'guiado' | 'explorador' | 'protagonista'>('explorador');
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map(m => [m.id, m.enabled]))
  );
  const [editingRule, setEditingRule] = useState<SystemRule | null>(null);
  const [ruleValues, setRuleValues] = useState<Record<string, string>>(
    Object.fromEntries(systemRules.map(r => [r.id, r.value]))
  );
  const [ruleSaved, setRuleSaved] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState<typeof cooperatives[0] | null>(null);
  const [moduleSearch, setModuleSearch] = useState('');
  const [showModuleFilter, setShowModuleFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const toggleModule = (id: string, core: boolean) => {
    if (core) return;
    setModuleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveRule = () => {
    if (editingRule) {
      setRuleSaved(true);
      setTimeout(() => { setEditingRule(null); setRuleSaved(false); }, 1200);
    }
  };

  const filteredModules = modules.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.desc.toLowerCase().includes(moduleSearch.toLowerCase());
    const matchesFilter = showModuleFilter === 'all' ||
      (showModuleFilter === 'active' && moduleStates[m.id]) ||
      (showModuleFilter === 'inactive' && !moduleStates[m.id]);
    return matchesSearch && matchesFilter;
  });

  const activeCount = modules.filter(m => moduleStates[m.id]).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">Governança & Parametrização</h1>
        <p className="text-sm text-gray-500 mt-1">Configuração sistêmica — CAS</p>
      </motion.div>

      {/* Autonomy Mode */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-verde-digital" /> Modo de Autonomia
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {([
            { id: 'guiado' as const, name: 'Guiado', subtitle: 'Waze', desc: 'Cooperativa segue configurações do CAS', color: '#3B82F6' },
            { id: 'explorador' as const, name: 'Explorador', subtitle: 'Google Maps', desc: 'Customiza dentro de limites', color: '#F59E0B' },
            { id: 'protagonista' as const, name: 'Protagonista', subtitle: 'Spotify', desc: 'Autonomia total de configuração', color: '#22C55E' },
          ]).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setAutonomyMode(mode.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                autonomyMode === mode.id
                  ? 'border-verde-digital bg-verde-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${mode.color}15` }}>
                <Gauge className="w-4 h-4" style={{ color: mode.color }} />
              </div>
              <p className="text-sm font-semibold text-gray-800">{mode.name}</p>
              <p className="text-[11px] text-gray-400">{mode.subtitle}</p>
              <p className="text-xs text-gray-500 mt-1">{mode.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Module Toggles — with search */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" /> Módulos ({activeCount}/{modules.length} ativos)
          </h2>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button key={f} onClick={() => setShowModuleFilter(f)} className={`text-[11px] px-2 py-1 rounded ${
                showModuleFilter === f ? 'bg-verde-digital text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              } transition-colors`}>
                {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Inativos'}
              </button>
            ))}
          </div>
        </div>
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            placeholder="Buscar módulo..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
          />
        </div>
        <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
          {filteredModules.map((mod) => {
            const isOn = moduleStates[mod.id];
            return (
              <div key={mod.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isOn ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50/50 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleModule(mod.id, mod.core)} disabled={mod.core} className="transition-transform active:scale-95">
                    {isOn ? <ToggleRight className="w-6 h-6 text-verde-digital" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${isOn ? 'text-gray-800' : 'text-gray-400'}`}>
                      {mod.name}
                      {mod.core && <span className="text-[10px] ml-1.5 px-1 py-0.5 bg-green-100 text-green-700 rounded uppercase font-bold">Core</span>}
                    </p>
                    <p className="text-[11px] text-gray-400">{mod.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredModules.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Nenhum módulo encontrado</p>
          )}
        </div>
      </motion.div>

      {/* Cooperative Maturity — clickable */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" /> Maturidade das Cooperativas
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {(['basico', 'desenvolvimento', 'avancado'] as const).map((tier) => {
            const count = cooperatives.filter(c => c.tier === tier).length;
            const totalEmployees = cooperatives.filter(c => c.tier === tier).reduce((a, c) => a + c.employees, 0);
            return (
              <div key={tier} className="p-3 rounded-lg text-center" style={{ backgroundColor: `${tierColors[tier]}10` }}>
                <p className="text-xl font-bold metric-value" style={{ color: tierColors[tier] }}>{count}</p>
                <p className="text-xs" style={{ color: tierColors[tier] }}>{tierLabels[tier]}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{totalEmployees} colabs.</p>
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          {cooperatives.map((coop) => (
            <button
              key={coop.name}
              onClick={() => setSelectedCoop(selectedCoop?.name === coop.name ? null : coop)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                selectedCoop?.name === coop.name ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="w-28 text-sm font-medium text-gray-700 truncate">{coop.name}</div>
              <span className="text-xs text-gray-400">{coop.state}</span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${coop.adoption}%`, backgroundColor: tierColors[coop.tier] }} />
              </div>
              <span className="text-xs font-bold metric-value" style={{ color: tierColors[coop.tier] }}>{coop.adoption}%</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{
                backgroundColor: `${tierColors[coop.tier]}15`, color: tierColors[coop.tier],
              }}>{tierLabels[coop.tier]}</span>
            </button>
          ))}
        </div>

        {/* Coop detail */}
        <AnimatePresence>
          {selectedCoop && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-blue-800">{selectedCoop.name}</h3>
                  <button onClick={() => setSelectedCoop(null)} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded bg-white text-center">
                    <p className="text-lg font-bold text-blue-700 metric-value">{selectedCoop.modules}</p>
                    <p className="text-[10px] text-gray-500">Módulos ativos</p>
                  </div>
                  <div className="p-2 rounded bg-white text-center">
                    <p className="text-lg font-bold text-blue-700 metric-value">{selectedCoop.employees}</p>
                    <p className="text-[10px] text-gray-500">Colaboradores</p>
                  </div>
                  <div className="p-2 rounded bg-white text-center">
                    <p className="text-lg font-bold metric-value" style={{ color: tierColors[selectedCoop.tier] }}>{selectedCoop.adoption}%</p>
                    <p className="text-[10px] text-gray-500">Adoção</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-medium px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Ver dashboard
                  </button>
                  <button className="text-xs font-medium px-3 py-1.5 rounded bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                    <Settings className="w-3 h-3" /> Configurar módulos
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* System Rules — Clickable */}
      <motion.div variants={item} className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-500" /> Regras Sistêmicas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systemRules.map((rule) => (
            <button
              key={rule.id}
              onClick={() => rule.editable && setEditingRule(rule)}
              className={`p-3 rounded-lg border text-left transition-all ${
                rule.editable
                  ? 'border-gray-200 hover:border-verde-digital/30 hover:shadow-sm cursor-pointer'
                  : 'border-gray-100 cursor-default opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{rule.label}</p>
                  <p className="text-xs text-verde-digital mt-0.5 font-semibold">{ruleValues[rule.id]}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{rule.description}</p>
                </div>
                {rule.editable ? (
                  <Edit3 className="w-4 h-4 text-gray-300 shrink-0" />
                ) : (
                  <Shield className="w-4 h-4 text-gray-300 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ===== EDIT RULE MODAL ===== */}
      <AnimatePresence>
        {editingRule && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingRule(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {ruleSaved ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-bold text-gray-900">Regra atualizada!</p>
                  <p className="text-sm text-gray-500 mt-1">A configuração será aplicada em todas as cooperativas do modo selecionado.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{editingRule.label}</h3>
                    <button onClick={() => setEditingRule(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{editingRule.description}</p>

                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 mb-4">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Alterações afetam cooperativas no modo <strong>{autonomyMode === 'guiado' ? 'Guiado' : autonomyMode === 'explorador' ? 'Explorador' : 'Protagonista'}</strong>
                    </p>
                  </div>

                  {editingRule.options ? (
                    <div className="space-y-2 mb-4">
                      {editingRule.options.map(opt => (
                        <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          ruleValues[editingRule.id] === opt
                            ? 'bg-verde-50 border border-verde-digital/30'
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}>
                          <input
                            type="radio"
                            name="rule-option"
                            checked={ruleValues[editingRule.id] === opt}
                            onChange={() => setRuleValues(prev => ({ ...prev, [editingRule.id]: opt }))}
                            className="text-verde-digital focus:ring-verde-digital"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      defaultValue={ruleValues[editingRule.id]}
                      className="w-full p-3 rounded-lg border border-gray-200 text-sm mb-4 focus:border-verde-digital focus:ring-1 focus:ring-verde-digital outline-none"
                    />
                  )}

                  <div className="flex gap-2">
                    <button onClick={handleSaveRule} className="flex-1 py-2.5 bg-verde-digital text-white text-sm font-semibold rounded-lg hover:bg-verde-600 transition-colors flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Salvar
                    </button>
                    <button onClick={() => setEditingRule(null)} className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
