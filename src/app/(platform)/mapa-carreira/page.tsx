'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { roles, getRoleById } from '@/data/roles';
import { careerPaths, getPathsFromRole } from '@/data/career-paths';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerMapView } from '@/types';
import {
  Map, GitBranch, Network, ArrowRight, ArrowUpRight, ArrowLeftRight,
  Lock, Unlock, ChevronRight, X, Briefcase, Star, TrendingUp,
  MapPin, Coins, Users, Shield, ChevronDown, ExternalLink, Route, Building, Globe
} from 'lucide-react';

// ============================================================
// CAREER FOCUS — Determines which roles to show per persona
// ============================================================
type CareerTab = 'minha_trilha' | 'laterais' | 'entidades';

const careerTabs: { id: CareerTab; label: string; icon: typeof Route }[] = [
  { id: 'minha_trilha', label: 'Minha Trilha', icon: Route },
  { id: 'laterais', label: 'Movimentações Laterais', icon: ArrowLeftRight },
  { id: 'entidades', label: 'Outras Entidades', icon: Globe },
];

function getCareerFocus(employeeRoleId: string) {
  const role = getRoleById(employeeRoleId);
  if (!role) return { primary: roles.map(r => r.id), lateral: [] as string[], entities: [] as string[], label: 'Geral' };

  const entityRoles = ['role-analista-central', 'role-analista-cas', 'role-fundacao'];
  const pcRoles = ['role-analista-pc', 'role-coordenador-pc'];
  const pfTrack = ['role-assistente-negocios', 'role-gn-pf1', 'role-gn-pf2', 'role-gn-pf3', 'role-gn-pf4', 'role-assessor-investimentos'];
  const pjTrack = ['role-gn-pj1', 'role-gn-pj2', 'role-gn-pj3'];
  const agroTrack = ['role-agro1', 'role-agro2', 'role-agro3'];
  const leadershipTrack = ['role-gerente-agencia', 'role-gerente-regional', 'role-diretor'];

  switch (role.family) {
    case 'negocios_pf':
      return {
        primary: [...pfTrack, ...leadershipTrack],
        lateral: ['role-assistente-negocios', ...pjTrack, ...agroTrack],
        entities: [...entityRoles, ...pcRoles],
        label: 'Negócios PF',
      };
    case 'negocios_pj':
      return {
        primary: ['role-assistente-negocios', ...pjTrack, ...leadershipTrack],
        lateral: [...pfTrack, ...agroTrack],
        entities: [...entityRoles, ...pcRoles],
        label: 'Negócios PJ',
      };
    case 'negocios_agro':
      return {
        primary: ['role-assistente-negocios', ...agroTrack, ...leadershipTrack],
        lateral: [...pfTrack, ...pjTrack],
        entities: [...entityRoles, ...pcRoles],
        label: 'AGRO',
      };
    case 'lideranca':
      return {
        primary: ['role-gn-pf3', 'role-gn-pf4', 'role-gn-pj3', 'role-agro3', ...leadershipTrack],
        lateral: [...pfTrack.slice(0, 4), ...pjTrack, ...agroTrack],
        entities: [...entityRoles, ...pcRoles],
        label: 'Liderança',
      };
    case 'diretoria':
      return {
        primary: [...leadershipTrack],
        lateral: ['role-gn-pf3', 'role-gn-pf4', 'role-gn-pj3', 'role-agro3'],
        entities: [...entityRoles, ...pcRoles],
        label: 'Diretoria',
      };
    case 'atendimento':
    case 'negocios':
      return {
        primary: ['role-assistente-atendimento', 'role-assistente-negocios', 'role-operacoes', 'role-gn-pf1', 'role-gn-pj1', 'role-agro1'],
        lateral: [...pfTrack.slice(1), ...pjTrack, ...agroTrack, ...leadershipTrack],
        entities: [...entityRoles, ...pcRoles, 'role-fundacao'],
        label: 'Descoberta',
      };
    case 'pc':
      return {
        primary: [...pcRoles],
        lateral: [...entityRoles],
        entities: [...leadershipTrack, 'role-assistente-atendimento', 'role-operacoes'],
        label: 'People & Culture',
      };
    case 'operacoes':
      return {
        primary: ['role-assistente-atendimento', 'role-operacoes', 'role-assistente-negocios'],
        lateral: ['role-gn-pf1', 'role-gn-pj1', 'role-agro1', 'role-analista-central'],
        entities: [...entityRoles, ...pcRoles],
        label: 'Operações',
      };
    default:
      return { primary: roles.map(r => r.id), lateral: [], entities: [], label: 'Geral' };
  }
}

const views: { id: CareerMapView; label: string; icon: typeof Map }[] = [
  { id: 'metro', label: 'Metrô', icon: Map },
  { id: 'skill_tree', label: 'Árvore de Skills', icon: GitBranch },
  { id: 'network', label: 'Rede', icon: Network },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// === Status helpers ===
const statusColors: Record<string, string> = {
  current: '#3FA110',
  ready: '#22C55E',
  developing: '#F59E0B',
  distant: '#D1D5DB',
};
const statusLabels: Record<string, string> = {
  current: 'Cargo atual',
  ready: 'Próximo passo',
  developing: 'Em desenvolvimento',
  distant: 'Explorar',
};
const difficultyConfig: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  facil: { label: 'Acessível', color: '#22C55E', icon: Shield },
  moderado: { label: 'Moderado', color: '#F59E0B', icon: Shield },
  desafiador: { label: 'Desafiador', color: '#EF4444', icon: Shield },
  expert: { label: 'Expert', color: '#7C3AED', icon: Shield },
};
const typeLabels: Record<string, { label: string; icon: typeof ArrowRight }> = {
  vertical: { label: 'Promoção', icon: ArrowRight },
  horizontal: { label: 'Lateral', icon: ArrowLeftRight },
  diagonal: { label: 'Transição', icon: ArrowUpRight },
};

function getStationStatus(roleId: string, employeeRoleId: string) {
  if (roleId === employeeRoleId) return 'current';
  const paths = getPathsFromRole(employeeRoleId);
  if (paths.some(p => p.toRoleId === roleId)) return 'ready';
  const secondHop = paths.some(p => {
    const next = getPathsFromRole(p.toRoleId);
    return next.some(np => np.toRoleId === roleId);
  });
  if (secondHop) return 'developing';
  return 'distant';
}

// ============================================================
// SHARED DETAIL PANEL — used by both Metro and Network views
// ============================================================
function RoleDetailPanel({
  roleId,
  employeeRoleId,
  onClose,
  onNavigate,
}: {
  roleId: string;
  employeeRoleId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const role = getRoleById(roleId);
  if (!role) return null;

  const status = getStationStatus(roleId, employeeRoleId);
  const outPaths = getPathsFromRole(roleId);
  const inPaths = careerPaths.filter(p => p.toRoleId === roleId);
  const isCurrent = roleId === employeeRoleId;

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="w-[380px] shrink-0 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 240px)' }}
    >
      {/* Header bar */}
      <div
        className="relative px-5 pt-5 pb-4"
        style={{ background: `linear-gradient(135deg, ${role.color}12 0%, transparent 100%)` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          aria-label="Fechar painel"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusColors[status] }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: statusColors[status] }}>
            {statusLabels[status]}
          </span>
        </div>

        {/* Role title */}
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: role.color }}
          >
            N{role.level}
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{role.title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{role.description}</p>
          </div>
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin' }}>
        {/* Key Metrics */}
        <div className="px-5 py-4 border-t border-gray-50">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-gray-50/80">
              <div className="flex items-center gap-1.5 mb-1">
                <Coins className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Faixa salarial</span>
              </div>
              <p className="text-sm font-bold text-gray-800 metric-value">
                R$ {(role.avgSalaryRange.min / 1000).toFixed(1)}k–{(role.avgSalaryRange.max / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50/80">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Posições</span>
              </div>
              <p className="text-sm font-bold text-gray-800 metric-value">
                {role.currentOccupants.toLocaleString()}<span className="text-gray-400 font-normal text-xs">/{role.totalPositions.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Day in Life */}
        <div className="px-5 py-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Um dia na vida</span>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed">{role.dayInLife}</p>
        </div>

        {/* Skills radar */}
        <div className="px-5 py-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Competências-chave</span>
          </div>
          <div className="space-y-2.5">
            {role.requiredSkills.map(skill => (
              <div key={skill.skillId}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-600 font-medium">{skill.skillName}</span>
                  <span className="font-bold text-gray-700">{skill.minLevel}%</span>
                </div>
                <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: role.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.minLevel}%` }}
                    transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming paths */}
        {inPaths.length > 0 && !isCurrent && (
          <div className="px-5 py-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Como chegar ({inPaths.length})</span>
            </div>
            <div className="space-y-2">
              {inPaths.map(path => {
                const fromRole = getRoleById(path.fromRoleId);
                if (!fromRole) return null;
                const diff = difficultyConfig[path.difficulty];
                const tp = typeLabels[path.type];
                const isFromCurrent = path.fromRoleId === employeeRoleId;
                return (
                  <button
                    key={path.id}
                    onClick={() => onNavigate(path.fromRoleId)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                      isFromCurrent
                        ? 'bg-verde-50/50 border-verde-digital/20 hover:border-verde-digital/40'
                        : 'bg-gray-50/50 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: fromRole.color }}
                      >
                        {fromRole.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-verde-digital transition-colors">
                          {fromRole.title}
                          {isFromCurrent && <span className="text-verde-digital ml-1 text-[10px]">(Você)</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <tp.icon className="w-2.5 h-2.5" /> {tp.label}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: diff.color }}>{diff.label}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-verde-digital transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Outgoing paths */}
        {outPaths.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Para onde ir ({outPaths.length})</span>
            </div>
            <div className="space-y-2">
              {outPaths.map(path => {
                const targetRole = getRoleById(path.toRoleId);
                if (!targetRole) return null;
                const diff = difficultyConfig[path.difficulty];
                const tp = typeLabels[path.type];
                return (
                  <button
                    key={path.id}
                    onClick={() => onNavigate(path.toRoleId)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50/50 border border-gray-100 hover:border-verde-digital/20 hover:bg-verde-50/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: targetRole.color }}
                      >
                        {targetRole.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-verde-digital transition-colors">{targetRole.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <tp.icon className="w-2.5 h-2.5" /> {tp.label}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: diff.color }}>{diff.label}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-verde-digital transition-colors" />
                    </div>
                    {path.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 pl-9">
                        {path.requirements.slice(0, 2).map(r => (
                          <span key={r} className="text-[9px] px-1.5 py-0.5 bg-white rounded text-gray-500 border border-gray-100">{r}</span>
                        ))}
                        {path.requirements.length > 2 && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-white rounded text-gray-400">+{path.requirements.length - 2}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function MapaCarreiraPage() {
  const { currentPersona } = usePersona();
  const [activeView, setActiveView] = useState<CareerMapView>('metro');

  if (!currentPersona) return null;
  const employee = getEmployeeById(currentPersona.employeeId);
  if (!employee) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1440px] space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Carreira</h1>
          <p className="text-sm text-gray-500 mt-1">Explore possibilidades a partir do seu momento atual</p>
        </div>
      </motion.div>

      {/* View Switcher */}
      <motion.div variants={item} className="flex gap-2">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === v.id
                ? 'bg-verde-digital text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <v.icon className="w-4 h-4" />
            {v.label}
          </button>
        ))}
      </motion.div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {activeView === 'metro' && <MetroView key="metro" employeeRoleId={employee.roleId} />}
        {activeView === 'skill_tree' && <SkillTreeView key="skill_tree" employee={employee} />}
        {activeView === 'network' && <NetworkView key="network" employeeRoleId={employee.roleId} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// METRO VIEW — São Paulo Style + Side Detail Panel + Career Tabs
// ============================================================
function MetroView({ employeeRoleId }: { employeeRoleId: string }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [careerTab, setCareerTab] = useState<CareerTab>('minha_trilha');

  const handleNavigate = useCallback((id: string) => setSelectedRole(id), []);
  const handleClose = useCallback(() => setSelectedRole(null), []);

  const focus = getCareerFocus(employeeRoleId);

  // Determine visible and highlighted roles based on tab
  const visibleRoleSet = new Set(
    careerTab === 'minha_trilha'
      ? [...focus.primary, employeeRoleId]
      : careerTab === 'laterais'
      ? [...focus.primary, ...focus.lateral, employeeRoleId]
      : [...focus.primary, ...focus.entities, employeeRoleId]
  );
  const highlightedRoleSet = new Set(
    careerTab === 'minha_trilha'
      ? [...focus.primary, employeeRoleId]
      : careerTab === 'laterais'
      ? focus.lateral
      : focus.entities
  );

  const allLines = [
    { name: 'Linha 1 — Azul (Liderança)', color: '#0455A1', stations: ['role-gn-pf3', 'role-gn-pf4', 'role-gerente-agencia', 'role-gerente-regional', 'role-diretor'] },
    { name: 'Linha 2 — Verde (Negócios PF)', color: '#3FA110', stations: ['role-assistente-atendimento', 'role-assistente-negocios', 'role-gn-pf1', 'role-gn-pf2', 'role-gn-pf3', 'role-gn-pf4'] },
    { name: 'Linha 3 — Vermelha (Negócios PJ)', color: '#E53935', stations: ['role-assistente-negocios', 'role-gn-pj1', 'role-gn-pj2', 'role-gn-pj3'] },
    { name: 'Linha 4 — Amarela (AGRO)', color: '#D4A017', stations: ['role-assistente-negocios', 'role-agro1', 'role-agro2', 'role-agro3'] },
    { name: 'Linha 5 — Lilás (P&C)', color: '#9B4F96', stations: ['role-analista-pc', 'role-coordenador-pc'] },
    { name: 'Linha 9 — Esmeralda (Investimentos)', color: '#0277BD', stations: ['role-gn-pf2', 'role-assessor-investimentos'] },
    { name: 'Linha 12 — Safira (Sistema)', color: '#37474F', stations: ['role-operacoes', 'role-analista-central', 'role-analista-cas', 'role-fundacao'] },
    { name: 'Linha 15 — Prata (Operações)', color: '#9E9E9E', stations: ['role-assistente-atendimento', 'role-operacoes', 'role-assistente-negocios'] },
  ];

  // Filter lines to only show those that have at least 2 visible stations
  const lines = allLines.filter(line => {
    const visibleStations = line.stations.filter(s => visibleRoleSet.has(s));
    return visibleStations.length >= 2;
  });

  const pos: Record<string, { x: number; y: number }> = {
    'role-assistente-atendimento': { x: 60, y: 200 },
    'role-operacoes':              { x: 60, y: 340 },
    'role-assistente-negocios':    { x: 180, y: 200 },
    // PF track
    'role-gn-pf1':                 { x: 330, y: 200 },
    'role-gn-pf2':                 { x: 460, y: 170 },
    'role-gn-pf3':                 { x: 590, y: 150 },
    'role-gn-pf4':                 { x: 720, y: 170 },
    // PJ track
    'role-gn-pj1':                 { x: 330, y: 330 },
    'role-gn-pj2':                 { x: 460, y: 330 },
    'role-gn-pj3':                 { x: 590, y: 330 },
    // AGRO track
    'role-agro1':                  { x: 330, y: 440 },
    'role-agro2':                  { x: 460, y: 440 },
    'role-agro3':                  { x: 590, y: 440 },
    // Specialization
    'role-assessor-investimentos': { x: 590, y: 80 },
    // P&C
    'role-analista-pc':            { x: 60, y: 80 },
    'role-coordenador-pc':         { x: 180, y: 80 },
    // Leadership
    'role-gerente-agencia':        { x: 750, y: 330 },
    'role-gerente-regional':       { x: 880, y: 200 },
    'role-diretor':                { x: 1010, y: 200 },
    // System entities
    'role-analista-central':       { x: 200, y: 440 },
    'role-analista-cas':           { x: 380, y: 530 },
    'role-fundacao':               { x: 560, y: 530 },
  };

  const stationLineCount: Record<string, number> = {};
  lines.forEach(line => {
    line.stations.forEach(s => {
      stationLineCount[s] = (stationLineCount[s] || 0) + 1;
    });
  });

  const buildLinePath = (stationIds: string[]) => {
    const filteredIds = stationIds.filter(id => visibleRoleSet.has(id));
    const points = filteredIds.map(id => pos[id]).filter(Boolean);
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      if (Math.abs(dy) > 20 && Math.abs(dx) > 20) {
        const midX = prev.x + dx * 0.5;
        path += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }
    return path;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      {/* Career Focus Tabs */}
      <div className="flex items-center gap-2">
        {careerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setCareerTab(tab.id); setSelectedRole(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              careerTab === tab.id
                ? 'bg-verde-50 text-verde-digital border border-verde-digital/20'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.id === 'minha_trilha' && <span className="text-[10px] ml-0.5 opacity-60">({focus.label})</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-start">
        {/* Map */}
        <div className={`card p-6 overflow-x-auto transition-all duration-300 ease-out ${selectedRole ? 'flex-1' : 'w-full'}`}>
          <svg width="1080" height="570" className="mx-auto" style={{ minWidth: '1080px' }}>
            {/* Line paths */}
            {lines.map((line) => (
              <path
                key={line.name}
                d={buildLinePath(line.stations)}
                fill="none"
                stroke={line.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={selectedRole ? 0.2 : 0.35}
                style={{ transition: 'opacity 0.3s' }}
              />
            ))}

            {/* Highlighted line for selected */}
            {selectedRole && lines.map((line) => {
              if (!line.stations.includes(selectedRole)) return null;
              return (
                <path
                  key={`hl-${line.name}`}
                  d={buildLinePath(line.stations)}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.7}
                />
              );
            })}

            {/* Transfer station halos */}
            {Object.entries(pos).map(([roleId, p]) => {
              if ((stationLineCount[roleId] || 0) <= 1) return null;
              return (
                <circle
                  key={`transfer-${roleId}`}
                  cx={p.x} cy={p.y} r={24}
                  fill="none" stroke="#374151" strokeWidth={2}
                  strokeDasharray="4,3" opacity={0.2}
                />
              );
            })}

            {/* Stations */}
            {roles.map((role) => {
              const p = pos[role.id];
              if (!p) return null;
              if (!visibleRoleSet.has(role.id)) return null;

              const status = getStationStatus(role.id, employeeRoleId);
              const isCurrent = role.id === employeeRoleId;
              const isSelected = role.id === selectedRole;
              const isTransfer = (stationLineCount[role.id] || 0) > 1;
              const isHighlighted = highlightedRoleSet.has(role.id);
              const isDimmed = careerTab !== 'minha_trilha' && !isHighlighted && !isCurrent;
              const isDimmedBySelection = selectedRole && !isSelected && status === 'distant';

              return (
                <g
                  key={role.id}
                  onClick={() => setSelectedRole(isSelected ? null : role.id)}
                  className="cursor-pointer"
                  style={{ transition: 'opacity 0.3s' }}
                  opacity={isDimmedBySelection ? 0.35 : isDimmed ? 0.4 : 1}
                >
                  {isCurrent && (
                    <circle cx={p.x} cy={p.y} r={28} fill={`${statusColors[status]}25`} className="animate-pulse-soft" />
                  )}
                  {isSelected && (
                    <circle cx={p.x} cy={p.y} r={28} fill="none" stroke={statusColors[status]} strokeWidth={2.5} strokeDasharray="0" opacity={0.5}>
                      <animate attributeName="r" values="24;30;24" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {isTransfer && (
                    <circle cx={p.x} cy={p.y} r={20} fill="white" stroke={statusColors[status]} strokeWidth={3} />
                  )}
                  <circle
                    cx={p.x} cy={p.y}
                    r={isSelected ? 17 : isTransfer ? 14 : 16}
                    fill={isDimmed ? '#D1D5DB' : statusColors[status]}
                    stroke={isSelected ? '#1F2937' : 'white'}
                    strokeWidth={isSelected ? 3 : 2.5}
                    style={{
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: isSelected ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' : isCurrent ? `drop-shadow(0 0 8px ${statusColors[status]}80)` : 'none',
                    }}
                  />
                  <text x={p.x} y={p.y + (isTransfer ? 36 : 32)} textAnchor="middle" fill={isDimmed ? '#9CA3AF' : '#374151'} fontSize={10} fontWeight={600} fontFamily="var(--font-sans), Nunito, sans-serif">
                    {role.shortTitle}
                  </text>
                  <text x={p.x} y={p.y + (isTransfer ? 48 : 44)} textAnchor="middle" fill={isDimmed ? '#D1D5DB' : statusColors[status]} fontSize={8} fontWeight={700} fontFamily="var(--font-sans), Nunito, sans-serif">
                    {statusLabels[status]}
                  </text>
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize={9} fontWeight={700} fontFamily="var(--font-sans), Nunito, sans-serif">
                    N{role.level}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-gray-500">
            {lines.map((line) => (
              <div key={line.name} className="flex items-center gap-1.5">
                <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: line.color }} />
                <span>{line.name.split('(')[1]?.replace(')', '') || line.name}</span>
              </div>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-400" />
              <span>Transferência</span>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedRole && (
            <RoleDetailPanel
              key={selectedRole}
              roleId={selectedRole}
              employeeRoleId={employeeRoleId}
              onClose={handleClose}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================
// SKILL TREE VIEW
// ============================================================
function SkillTreeView({ employee }: { employee: NonNullable<ReturnType<typeof getEmployeeById>> }) {
  const skillCategories = [
    {
      name: 'Essência Cooperativista',
      color: '#146E37',
      skills: [
        { name: 'Valores Cooperativos', current: 88, required: 80, unlocked: true },
        { name: 'Governança', current: 50, required: 60, unlocked: false },
        { name: 'Impacto Comunitário', current: 72, required: 70, unlocked: true },
      ],
    },
    {
      name: 'Entender para Atender',
      color: '#F59E0B',
      skills: [
        { name: 'Escuta Ativa', current: 92, required: 85, unlocked: true },
        { name: 'Relacionamento com Associados', current: 92, required: 80, unlocked: true },
        { name: 'Gestão de Carteira', current: 80, required: 80, unlocked: true },
      ],
    },
    {
      name: 'Vai lá e Faz',
      color: '#3FA110',
      skills: [
        { name: 'Habilidade Comercial', current: 85, required: 85, unlocked: true },
        { name: 'Cross-selling', current: 72, required: 80, unlocked: false },
        { name: 'Orientação a Resultados', current: 78, required: 75, unlocked: true },
      ],
    },
    {
      name: 'Aprender e Mudar Rápido',
      color: '#2563EB',
      skills: [
        { name: 'Adaptabilidade', current: 68, required: 70, unlocked: false },
        { name: 'Gestão de Mudança', current: 55, required: 65, unlocked: false },
        { name: 'Aprendizado Contínuo', current: 82, required: 75, unlocked: true },
      ],
    },
    {
      name: 'Inovar para Transformar',
      color: '#8B5CF6',
      skills: [
        { name: 'Pensamento Criativo', current: 62, required: 70, unlocked: false },
        { name: 'Melhoria Contínua', current: 58, required: 65, unlocked: false },
        { name: 'Visão Estratégica', current: 45, required: 60, unlocked: false },
      ],
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="card p-6">
        <p className="text-sm text-gray-500 mb-6">
          Competências avaliadas no modelo <span className="font-bold text-verde-digital">270°</span> do Sicredi.
          Desenvolva no seu ritmo, com apoio do PDI e feedback contínuo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat) => (
            <div key={cat.name}>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: cat.color }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </h3>
              <div className="space-y-3">
                {cat.skills.map((skill) => {
                  const progress = Math.min((skill.current / skill.required) * 100, 100);
                  const isComplete = skill.current >= skill.required;
                  return (
                    <div key={skill.name} className={`p-3 rounded-lg border ${isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          {isComplete ? <Unlock className="w-3.5 h-3.5 text-green-500" /> : <Lock className="w-3.5 h-3.5 text-gray-400" />}
                          {skill.name}
                        </span>
                        <span className="text-xs metric-value" style={{ color: isComplete ? '#22C55E' : '#EF4444' }}>
                          {skill.current}/{skill.required}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: isComplete ? '#22C55E' : cat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                      </div>
                      {!isComplete && (
                        <p className="text-[10px] text-gray-400 mt-1">Falta: {skill.required - skill.current} pontos</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// NETWORK VIEW — Interactive Graph + Side Panel
// ============================================================
function NetworkView({ employeeRoleId }: { employeeRoleId: string }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [careerTab, setCareerTab] = useState<CareerTab>('minha_trilha');

  const handleNavigate = useCallback((id: string) => setSelectedRole(id), []);
  const handleClose = useCallback(() => setSelectedRole(null), []);

  const focus = getCareerFocus(employeeRoleId);
  const visibleRoleSet = new Set(
    careerTab === 'minha_trilha'
      ? [...focus.primary, employeeRoleId]
      : careerTab === 'laterais'
      ? [...focus.primary, ...focus.lateral, employeeRoleId]
      : [...focus.primary, ...focus.entities, employeeRoleId]
  );
  const highlightedRoleSet = new Set(
    careerTab === 'minha_trilha'
      ? [...focus.primary, employeeRoleId]
      : careerTab === 'laterais'
      ? focus.lateral
      : focus.entities
  );

  const positions: Record<string, { x: number; y: number }> = {
    'role-assistente-atendimento': { x: 80, y: 260 },
    'role-operacoes': { x: 80, y: 400 },
    'role-assistente-negocios': { x: 210, y: 230 },
    // PF
    'role-gn-pf1': { x: 340, y: 190 },
    'role-gn-pf2': { x: 460, y: 160 },
    'role-gn-pf3': { x: 580, y: 140 },
    'role-gn-pf4': { x: 700, y: 160 },
    // PJ
    'role-gn-pj1': { x: 340, y: 330 },
    'role-gn-pj2': { x: 460, y: 340 },
    'role-gn-pj3': { x: 580, y: 340 },
    // AGRO
    'role-agro1': { x: 340, y: 440 },
    'role-agro2': { x: 460, y: 450 },
    'role-agro3': { x: 580, y: 440 },
    // Specialist
    'role-assessor-investimentos': { x: 580, y: 70 },
    // P&C
    'role-analista-pc': { x: 80, y: 110 },
    'role-coordenador-pc': { x: 210, y: 80 },
    // Leadership
    'role-gerente-agencia': { x: 740, y: 330 },
    'role-gerente-regional': { x: 860, y: 250 },
    'role-diretor': { x: 960, y: 170 },
    // System
    'role-analista-central': { x: 210, y: 490 },
    'role-analista-cas': { x: 400, y: 520 },
    'role-fundacao': { x: 580, y: 520 },
  };

  // Filter career paths based on visible roles
  const visiblePaths = careerPaths.filter(p => visibleRoleSet.has(p.fromRoleId) && visibleRoleSet.has(p.toRoleId));
  const selectedRolePaths = selectedRole ? visiblePaths.filter(p => p.toRoleId === selectedRole || p.fromRoleId === selectedRole) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      {/* Career Focus Tabs */}
      <div className="flex items-center gap-2">
        {careerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setCareerTab(tab.id); setSelectedRole(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              careerTab === tab.id
                ? 'bg-verde-50 text-verde-digital border border-verde-digital/20'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.id === 'minha_trilha' && <span className="text-[10px] ml-0.5 opacity-60">({focus.label})</span>}
          </button>
        ))}
      </div>
      <div className="flex gap-4 items-start">
        {/* SVG Network */}
        <div className={`card p-6 overflow-x-auto transition-all duration-300 ease-out ${selectedRole ? 'flex-1' : 'w-full'}`}>
          <svg width="1040" height="560" className="mx-auto">
            {/* Connections */}
            {visiblePaths.map((path) => {
              const from = positions[path.fromRoleId];
              const to = positions[path.toRoleId];
              if (!from || !to) return null;
              const isDirectFromSelected = selectedRole && (path.fromRoleId === selectedRole || path.toRoleId === selectedRole);
              const isHovered = hoveredRole && (path.fromRoleId === hoveredRole || path.toRoleId === hoveredRole);
              const isFromEmployee = path.fromRoleId === employeeRoleId;
              const highlighted = isDirectFromSelected || isHovered || isFromEmployee;
              return (
                <line
                  key={path.id}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isDirectFromSelected ? '#3FA110' : highlighted ? '#3FA110' : '#D1D5DB'}
                  strokeWidth={isDirectFromSelected ? 4 : highlighted ? 3 : 2}
                  strokeDasharray={path.type === 'horizontal' ? '6,4' : path.type === 'diagonal' ? '3,3' : 'none'}
                  opacity={isDirectFromSelected ? 0.9 : highlighted ? 0.5 : (selectedRole ? 0.15 : 0.3)}
                  style={{ transition: 'all 0.3s' }}
                />
              );
            })}

            {/* Direction indicators on selected paths */}
            {selectedRole && selectedRolePaths.map((path) => {
              const from = positions[path.fromRoleId];
              const to = positions[path.toRoleId];
              if (!from || !to) return null;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              const isOutgoing = path.fromRoleId === selectedRole;
              return (
                <g key={`dir-${path.id}`}>
                  <circle cx={midX} cy={midY} r={7} fill={isOutgoing ? '#3FA110' : '#9CA3AF'} opacity={0.9} />
                  <text x={midX} y={midY + 3} textAnchor="middle" fill="white" fontSize={7} fontWeight={700}>
                    {isOutgoing ? '\u2192' : '\u2190'}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {roles.map((role) => {
              const p = positions[role.id];
              if (!p) return null;
              if (!visibleRoleSet.has(role.id)) return null;

              const status = getStationStatus(role.id, employeeRoleId);
              const isHovered = hoveredRole === role.id;
              const isCurrent = role.id === employeeRoleId;
              const isSelected = role.id === selectedRole;
              const isHighlighted = highlightedRoleSet.has(role.id);
              const isDimmed = careerTab !== 'minha_trilha' && !isHighlighted && !isCurrent;
              const isDimmedByConnection = selectedRole && !isSelected && !selectedRolePaths.some(sp => sp.fromRoleId === role.id || sp.toRoleId === role.id);

              return (
                <g
                  key={role.id}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  onClick={() => setSelectedRole(isSelected ? null : role.id)}
                  className="cursor-pointer"
                  opacity={isDimmedByConnection ? 0.25 : isDimmed ? 0.4 : 1}
                  style={{ transition: 'opacity 0.3s' }}
                >
                  {isCurrent && (
                    <circle cx={p.x} cy={p.y} r={32} fill={`${statusColors[status]}20`} className="animate-pulse-soft" />
                  )}
                  {isSelected && (
                    <circle cx={p.x} cy={p.y} r={30} fill="none" stroke={statusColors[status]} strokeWidth={2} opacity={0.4}>
                      <animate attributeName="r" values="26;32;26" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={p.x} cy={p.y}
                    r={isHovered || isSelected ? 24 : 20}
                    fill={isDimmed ? '#D1D5DB' : statusColors[status]}
                    stroke={isSelected ? '#1F2937' : 'white'}
                    strokeWidth={isSelected ? 3 : 2.5}
                    style={{
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: isHovered || isSelected ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' : 'none',
                    }}
                  />
                  <text x={p.x} y={p.y - 28} textAnchor="middle" fill="#374151" fontSize={10} fontWeight={600} fontFamily="var(--font-sans), Nunito, sans-serif">
                    {role.shortTitle}
                  </text>
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize={9} fontWeight={700} fontFamily="var(--font-sans), Nunito, sans-serif">
                    N{role.level}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedRole && (
            <RoleDetailPanel
              key={selectedRole}
              roleId={selectedRole}
              employeeRoleId={employeeRoleId}
              onClose={handleClose}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
