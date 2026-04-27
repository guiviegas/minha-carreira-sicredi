'use client';

import { useState, useCallback, useMemo } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getPersonaHub } from '@/data/persona-hub';
import { roles, getRoleById } from '@/data/roles';
import { careerPaths, getPathsFromRole } from '@/data/career-paths';
import { motion, AnimatePresence } from 'framer-motion';
import OndeEstouView from '@/components/gps/OndeEstouView';
import PossibilidadesView from '@/components/gps/PossibilidadesView';
import PlanoRotaView from '@/components/gps/PlanoRotaView';
import {
  Map,
  TrendingUp,
  Compass,
  Target,
  ArrowRight,
  ArrowLeftRight,
  Lock,
  ChevronRight,
  X,
  Briefcase,
  Star,
  MapPin,
  Coins,
  Users,
  Shield,
  ExternalLink,
} from 'lucide-react';

type GpsTab = 'onde_estou' | 'possibilidades' | 'mapa_visual' | 'plano_rota';

const tabs: { id: GpsTab; label: string; icon: typeof Map }[] = [
  { id: 'onde_estou', label: 'Onde estou', icon: Compass },
  { id: 'possibilidades', label: 'Para onde posso ir', icon: TrendingUp },
  { id: 'mapa_visual', label: 'Mapa visual', icon: Map },
  { id: 'plano_rota', label: 'Plano de rota', icon: Target },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const statusColors: Record<string, string> = {
  current: '#3FA110',
  target: '#2563EB',
  ready: '#22C55E',
  developing: '#F59E0B',
  distant: '#D1D5DB',
};
const statusLabels: Record<string, string> = {
  current: 'Você está aqui',
  target: 'Sua aspiração',
  ready: 'Próximo passo',
  developing: 'Em desenvolvimento',
  distant: 'Explorar',
};

function getStationStatus(roleId: string, employeeRoleId: string, alvoRoleId?: string) {
  if (roleId === employeeRoleId) return 'current';
  if (alvoRoleId && roleId === alvoRoleId) return 'target';
  const paths = getPathsFromRole(employeeRoleId);
  if (paths.some((p) => p.toRoleId === roleId)) return 'ready';
  const secondHop = paths.some((p) => {
    const next = getPathsFromRole(p.toRoleId);
    return next.some((np) => np.toRoleId === roleId);
  });
  if (secondHop) return 'developing';
  return 'distant';
}

export default function MapaCarreiraPage() {
  const { currentPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<GpsTab>('onde_estou');
  const [cargoAlvoSimular, setCargoAlvoSimular] = useState<string | undefined>();
  const [comparacao, setComparacao] = useState<string[]>([]);

  if (!currentPersona) return null;
  const hub = getPersonaHub(currentPersona.id);
  if (!hub) return null;

  const irPara = (tab: GpsTab) => setActiveTab(tab);

  const handleSimular = (roleId: string) => {
    setCargoAlvoSimular(roleId);
    setActiveTab('plano_rota');
  };

  const handleAdicionarComparacao = (roleId: string) => {
    setComparacao((prev) => {
      if (prev.includes(roleId)) return prev;
      if (prev.length >= 2) return [prev[1], roleId]; // máx 2 + alvo principal = 3 colunas
      return [...prev, roleId];
    });
    setActiveTab('plano_rota');
  };

  const handleLimparComparacao = (roleId: string) => {
    setComparacao((prev) => prev.filter((id) => id !== roleId));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1440px] space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">GPS de Carreira</h1>
        <p className="text-sm text-gray-500 mt-1">
          Seu posicionamento, possibilidades e rota até o cargo aspirado.
        </p>
      </motion.div>

      {/* Tab switcher */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-verde-digital text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'onde_estou' && (
          <OndeEstouView
            key="onde_estou"
            hub={hub}
            onIrParaPossibilidades={() => irPara('possibilidades')}
            onIrParaPlanoRota={() => irPara('plano_rota')}
          />
        )}
        {activeTab === 'possibilidades' && (
          <PossibilidadesView
            key="possibilidades"
            hub={hub}
            onSimular={handleSimular}
            onAdicionarComparacao={handleAdicionarComparacao}
          />
        )}
        {activeTab === 'mapa_visual' && (
          <MetroView
            key="mapa_visual"
            employeeRoleId={hub.employee.roleId}
            cargoAlvoId={hub.cargoAlvo?.id}
            onSimular={handleSimular}
          />
        )}
        {activeTab === 'plano_rota' && (
          <PlanoRotaView
            key="plano_rota"
            hub={hub}
            cargoAlvoIdInicial={cargoAlvoSimular}
            comparacaoIds={comparacao}
            onLimparComparacao={handleLimparComparacao}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// METRO VIEW — São Paulo Style + Side Detail Panel
// (Reaproveitado, com destaque do cargo-alvo)
// ============================================================
function MetroView({
  employeeRoleId,
  cargoAlvoId,
  onSimular,
}: {
  employeeRoleId: string;
  cargoAlvoId?: string;
  onSimular: (roleId: string) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleNavigate = useCallback((id: string) => setSelectedRole(id), []);
  const handleClose = useCallback(() => setSelectedRole(null), []);

  // Linhas do mapa (mesmas 8 do design original; filtra apenas as com 2+ estações)
  const allLines = useMemo(
    () => [
      { name: 'Azul: Liderança', color: '#0455A1', stations: ['role-gn-pf3', 'role-gn-pf4', 'role-gerente-agencia', 'role-gerente-regional', 'role-diretor'] },
      { name: 'Verde: Negócios PF', color: '#3FA110', stations: ['role-assistente-atendimento', 'role-assistente-negocios', 'role-gn-pf1', 'role-gn-pf2', 'role-gn-pf3', 'role-gn-pf4'] },
      { name: 'Vermelha: Negócios PJ', color: '#E53935', stations: ['role-assistente-negocios', 'role-gn-pj1', 'role-gn-pj2', 'role-gn-pj3'] },
      { name: 'Amarela: AGRO', color: '#D4A017', stations: ['role-assistente-negocios', 'role-agro1', 'role-agro2', 'role-agro3'] },
      { name: 'Lilás: P&C', color: '#9B4F96', stations: ['role-analista-pc', 'role-coordenador-pc'] },
      { name: 'Esmeralda: Investimentos', color: '#0277BD', stations: ['role-gn-pf2', 'role-assessor-investimentos'] },
      { name: 'Prata: Operações', color: '#9E9E9E', stations: ['role-assistente-atendimento', 'role-operacoes', 'role-assistente-negocios'] },
    ],
    [],
  );

  const pos: Record<string, { x: number; y: number }> = {
    'role-assistente-atendimento': { x: 60, y: 200 },
    'role-operacoes': { x: 60, y: 340 },
    'role-assistente-negocios': { x: 180, y: 200 },
    'role-gn-pf1': { x: 330, y: 200 },
    'role-gn-pf2': { x: 460, y: 170 },
    'role-gn-pf3': { x: 590, y: 150 },
    'role-gn-pf4': { x: 720, y: 170 },
    'role-gn-pj1': { x: 330, y: 330 },
    'role-gn-pj2': { x: 460, y: 330 },
    'role-gn-pj3': { x: 590, y: 330 },
    'role-agro1': { x: 330, y: 440 },
    'role-agro2': { x: 460, y: 440 },
    'role-agro3': { x: 590, y: 440 },
    'role-assessor-investimentos': { x: 590, y: 80 },
    'role-analista-pc': { x: 60, y: 80 },
    'role-coordenador-pc': { x: 180, y: 80 },
    'role-gerente-agencia': { x: 750, y: 330 },
    'role-gerente-regional': { x: 880, y: 200 },
    'role-diretor': { x: 1010, y: 200 },
  };

  const buildLinePath = (stationIds: string[]) => {
    const points = stationIds.map((id) => pos[id]).filter(Boolean);
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

  const lines = allLines.filter(
    (l) => l.stations.filter((s) => pos[s]).length >= 2,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      <p className="text-sm text-gray-600">
        Visualização tipo metrô das trilhas de carreira. Clique em qualquer estação para ver detalhes.
      </p>

      <div className="flex gap-4 items-start">
        <div
          className={`card p-6 overflow-x-auto transition-all duration-300 ease-out ${
            selectedRole ? 'flex-1' : 'w-full'
          }`}
        >
          <svg width="1080" height="570" className="mx-auto" style={{ minWidth: '1080px' }}>
            {/* Linhas */}
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

            {/* Estações */}
            {roles.map((role) => {
              const p = pos[role.id];
              if (!p) return null;
              const status = getStationStatus(role.id, employeeRoleId, cargoAlvoId);
              const isCurrent = role.id === employeeRoleId;
              const isTarget = role.id === cargoAlvoId;
              const isSelected = role.id === selectedRole;

              return (
                <g
                  key={role.id}
                  onClick={() => setSelectedRole(isSelected ? null : role.id)}
                  className="cursor-pointer"
                >
                  {(isCurrent || isTarget) && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={28}
                      fill={`${statusColors[status]}25`}
                      className="animate-pulse-soft"
                    />
                  )}
                  {isSelected && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={28}
                      fill="none"
                      stroke={statusColors[status]}
                      strokeWidth={2.5}
                      opacity={0.5}
                    >
                      <animate attributeName="r" values="24;30;24" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 17 : 16}
                    fill={statusColors[status]}
                    stroke={isSelected ? '#1F2937' : 'white'}
                    strokeWidth={isSelected ? 3 : 2.5}
                    style={{ transition: 'all 0.25s' }}
                  />
                  <text
                    x={p.x}
                    y={p.y + 32}
                    textAnchor="middle"
                    fill="#374151"
                    fontSize={10}
                    fontWeight={600}
                  >
                    {role.shortTitle}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 44}
                    textAnchor="middle"
                    fill={statusColors[status]}
                    fontSize={8}
                    fontWeight={700}
                  >
                    {statusLabels[status]}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={9}
                    fontWeight={700}
                  >
                    N{role.level}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legenda */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-gray-500">
            {lines.map((line) => (
              <div key={line.name} className="flex items-center gap-1.5">
                <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: line.color }} />
                <span>{line.name.split(':')[1]?.trim() || line.name}</span>
              </div>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.current }} />
              <span>Você está aqui</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.target }} />
              <span>Sua aspiração</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedRole && (
            <RoleDetailPanel
              key={selectedRole}
              roleId={selectedRole}
              employeeRoleId={employeeRoleId}
              onClose={handleClose}
              onNavigate={handleNavigate}
              onSimular={() => onSimular(selectedRole)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================
// ROLE DETAIL PANEL (lateral)
// ============================================================
function RoleDetailPanel({
  roleId,
  employeeRoleId,
  onClose,
  onNavigate,
  onSimular,
}: {
  roleId: string;
  employeeRoleId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onSimular: () => void;
}) {
  const role = getRoleById(roleId);
  if (!role) return null;
  const status = getStationStatus(roleId, employeeRoleId);
  const outPaths = getPathsFromRole(roleId);
  const inPaths = careerPaths.filter((p) => p.toRoleId === roleId);
  const isCurrent = roleId === employeeRoleId;

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    facil: { label: 'Acessível', color: '#16A34A' },
    moderado: { label: 'Moderado', color: '#D97706' },
    desafiador: { label: 'Desafiador', color: '#DC2626' },
    expert: { label: 'Expert', color: '#7C3AED' },
  };
  const typeLabels: Record<string, { label: string; icon: typeof ArrowRight }> = {
    vertical: { label: 'Promoção', icon: ArrowRight },
    horizontal: { label: 'Lateral', icon: ArrowLeftRight },
    diagonal: { label: 'Transição', icon: ArrowRight },
  };

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="w-[380px] shrink-0 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 240px)' }}
    >
      <div
        className="relative px-5 pt-5 pb-4"
        style={{ background: `linear-gradient(135deg, ${role.color}12 0%, transparent 100%)` }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: statusColors[status] }}>
            {statusLabels[status]}
          </span>
        </div>
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

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <div className="px-5 py-4 border-t border-gray-50">
          <div className="grid grid-cols-2 gap-2.5">
            <Metric icon={Coins} label="Faixa salarial">
              R$ {(role.avgSalaryRange.min / 1000).toFixed(1)}k a {(role.avgSalaryRange.max / 1000).toFixed(1)}k
            </Metric>
            <Metric icon={Users} label="Posições">
              {role.currentOccupants.toLocaleString()}/{role.totalPositions.toLocaleString()}
            </Metric>
          </div>
        </div>

        {role.dayInLife && (
          <div className="px-5 py-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5 mb-2">
              <Briefcase className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Um dia na vida</span>
            </div>
            <p className="text-[12px] text-gray-600 leading-relaxed">{role.dayInLife}</p>
          </div>
        )}

        <div className="px-5 py-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Competências-chave</span>
          </div>
          <div className="space-y-2.5">
            {role.requiredSkills.map((skill) => (
              <div key={skill.skillId}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-600 font-medium">{skill.skillName}</span>
                  <span className="font-bold text-gray-700">{skill.minLevel}%</span>
                </div>
                <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${skill.minLevel}%`, backgroundColor: role.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {outPaths.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Para onde ir ({outPaths.length})</span>
            </div>
            <div className="space-y-2">
              {outPaths.map((path) => {
                const targetRole = getRoleById(path.toRoleId);
                if (!targetRole) return null;
                const diff = difficultyConfig[path.difficulty];
                const tp = typeLabels[path.type];
                return (
                  <button
                    key={path.id}
                    onClick={() => onNavigate(path.toRoleId)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50/50 border border-gray-100 hover:border-verde-digital/20 hover:bg-verde-50/30 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: targetRole.color }}
                      >
                        N{targetRole.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{targetRole.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <tp.icon className="w-2.5 h-2.5" /> {tp.label}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: diff.color }}>
                            {diff.label}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer com ações */}
      {!isCurrent && (
        <div className="border-t border-gray-100 p-3 bg-gray-50 flex items-center gap-2">
          <a
            href={`/meu-cargo/${role.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-verde-digital"
          >
            <ExternalLink className="w-3 h-3" />
            Ver descrição completa
          </a>
          <button
            onClick={onSimular}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-verde-digital text-white text-xs font-semibold hover:bg-verde-600"
          >
            <Target className="w-3 h-3" />
            Simular rota
          </button>
        </div>
      )}
    </motion.div>
  );
}

function Metric({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Briefcase;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-gray-50/80">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-gray-400" />
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-sm font-bold text-gray-800">{children}</p>
    </div>
  );
}
