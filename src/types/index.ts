// ==========================================
// GPS DE CARREIRA — Core Type Definitions
// ==========================================

// --- Persona & Auth ---
export type PersonaId = 'mariana' | 'roberto' | 'carla' | 'marcos' | 'lucas' | 'daniela';
export type PersonaRole = 'colaborador' | 'lider' | 'pc_analista' | 'diretor' | 'novo_colaborador' | 'pc_diretor_cas';

export interface Persona {
  id: PersonaId;
  name: string;
  role: PersonaRole;
  jobTitle: string;
  avatar: string;
  color: string;
  description: string;
  cooperative: string;
  branch?: string;
  employeeId: string;
}

// --- Employee ---
export interface Employee {
  id: string;
  name: string;
  avatar: string;
  age: number;
  tenure: number; // years
  tenureMonths: number;
  roleId: string;
  branchId: string;
  cooperativeId: string;
  email: string;
  phone: string;
  hireDate: string;
  status: EmployeeStatus;
  aspirations: CareerAspiration[];
  skills: Skill[];
  achievements: Achievement[];
  engagementScore: number; // 0-100
  performanceRating: number; // 1-5
  readinessScores: ReadinessScore[];
  turnoverRisk?: TurnoverPrediction;
  onboarding?: OnboardingProgress;
  developmentPlanIds: string[];
  bio?: string;
}

export type EmployeeStatus = 'active' | 'onboarding' | 'on_leave' | 'exiting';

export interface CareerAspiration {
  targetRoleId: string;
  timeframe: string; // e.g., "2 anos"
  declared: boolean;
  sharedWithLeader: boolean;
  confidence: number; // 0-100
}

// --- Skills ---
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  assessedDate?: string;
  source: 'self' | 'leader' | 'assessment' | 'peer' | 'system';
}

export type SkillCategory =
  | 'tecnica'
  | 'lideranca'
  | 'relacional'
  | 'estrategica'
  | 'cooperativismo'
  | 'digital'
  | 'financeira';

// --- Roles & Career Paths ---
export interface Role {
  id: string;
  title: string;
  shortTitle: string;
  level: number; // 1-10 hierarchy
  family: RoleFamily;
  description: string;
  dayInLife: string;
  requiredSkills: RequiredSkill[];
  avgTenureMonths: number;
  avgSalaryRange: { min: number; max: number };
  totalPositions: number;
  currentOccupants: number;
  videoUrl?: string;
  color: string;
}

export type RoleFamily =
  | 'atendimento'
  | 'negocios'
  | 'negocios_pf'
  | 'negocios_pj'
  | 'negocios_agro'
  | 'lideranca'
  | 'diretoria'
  | 'operacoes'
  | 'pc'
  | 'central'
  | 'cas'
  | 'fundacao'
  | 'ti'
  | 'administrativo';

export interface RequiredSkill {
  skillId: string;
  skillName: string;
  minLevel: number;
  weight: number; // importance 0-1
}

export interface CareerPath {
  id: string;
  fromRoleId: string;
  toRoleId: string;
  type: 'vertical' | 'horizontal' | 'diagonal';
  requirements: string[];
  avgTimeMonths?: number;
  difficulty: 'facil' | 'moderado' | 'desafiador' | 'expert';
}

// --- Branch & Cooperative ---
export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  cooperativeId: string;
  headcount: number;
  gaId: string | null; // Branch Manager ID, null if vacant
  careerHealthScore: number; // 0-100
  eNPS: number;
  turnoverRate: number;
  memberNPS: number;
}

export interface Cooperative {
  id: string;
  name: string;
  state: string;
  totalEmployees: number;
  totalBranches: number;
  maturityTier: 'basico' | 'desenvolvimento' | 'avancado';
  modules: ModuleConfig[];
  autonomyMode: 'guiado' | 'explorador' | 'protagonista';
}

export interface ModuleConfig {
  moduleId: string;
  enabled: boolean;
  customConfig?: Record<string, unknown>;
}

// --- Assessments ---
export interface Assessment {
  id: string;
  employeeId: string;
  type: 'readiness' | 'skills' | 'leadership' | 'values';
  date: string;
  results: AssessmentResult[];
  overallScore: number;
  visibility: 'private' | 'shared_summary' | 'shared_full';
}

export interface AssessmentResult {
  dimension: string;
  score: number;
  maxScore: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

// --- Readiness ---
export interface ReadinessScore {
  targetRoleId: string;
  score: number; // 0-100
  lastUpdated: string;
  components: {
    skills: number;
    experience: number;
    performance: number;
    development: number;
    leadership: number;
  };
}

// --- Predictions ---
export interface TurnoverPrediction {
  probability: number; // 0-100
  timeframe: string; // e.g., "90 dias"
  confidence: number; // 0-100
  signals: TurnoverSignal[];
  recommendedActions: string[];
}

export interface TurnoverSignal {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

// --- Opportunities / Marketplace ---
export interface Opportunity {
  id: string;
  type: 'vaga' | 'projeto' | 'mentoria' | 'job_shadow' | 'intercambio';
  title: string;
  description: string;
  branchId?: string;
  cooperativeId: string;
  roleId?: string;
  duration?: string;
  skills: string[];
  requirements: string[];
  matchScore?: number;
  applicants: number;
  maxApplicants?: number;
  startDate: string;
  endDate?: string;
  status: 'open' | 'in_progress' | 'closed';
  postedBy: string;
  createdAt: string;
}

// --- Evaluations ---
export interface Evaluation {
  id: string;
  employeeId: string;
  evaluatorId: string;
  type: 'continuous' | 'cycle' | 'hybrid' | 'milestone';
  period: string;
  status: 'pending' | 'in_progress' | 'completed';
  selfRating?: number;
  leaderRating?: number;
  goals: EvaluationGoal[];
  feedback: string[];
  overallScore?: number;
  date: string;
}

export interface EvaluationGoal {
  id: string;
  title: string;
  description: string;
  target: string;
  current: string;
  progress: number; // 0-100
  weight: number;
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
}

// --- Development ---
export interface DevelopmentTrack {
  id: string;
  title: string;
  description: string;
  mode: 'netflix' | 'spotify' | 'hybrid' | 'mission';
  targetRoleId?: string;
  skills: string[];
  courses: Course[];
  totalHours: number;
  estimatedWeeks: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'mentoring' | 'practice';
  duration: string; // e.g. "3 min", "2h"
  provider: string;
  skills: string[];
  completed: boolean;
  progress: number;
  rating?: number;
  thumbnail?: string;
}

// --- 1:1 & Career Conversations ---
export interface OneOnOne {
  id: string;
  leaderId: string;
  employeeId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'performance' | 'career' | 'check_in';
  agendaItems: AgendaItem[];
  notes: string;
  actionItems: ActionItem[];
  aiSuggestions: string[];
}

export interface AgendaItem {
  id: string;
  text: string;
  source: 'employee' | 'leader' | 'ai';
  discussed: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

// --- Achievements ---
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'skill' | 'milestone' | 'social' | 'leadership' | 'innovation';
  xp: number;
}

// --- Onboarding ---
export interface OnboardingProgress {
  totalModules: number;
  completedModules: number;
  currentWeek: number;
  totalWeeks: number;
  percentage: number;
  modules: OnboardingModule[];
}

export interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  week: number;
}

// --- KPIs ---
export interface ExecutiveKPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'green' | 'yellow' | 'red';
  drillDownAvailable: boolean;
}

// --- Widgets ---
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  priority: number;
  data: Record<string, unknown>;
  personaRoles: PersonaRole[];
}

export type WidgetType =
  | 'readiness_thermometer'
  | 'projeto_recommendation'
  | 'micro_learning'
  | 'weekly_checklist'
  | 'ai_nudge'
  | 'team_overview'
  | 'turnover_alert'
  | 'kpi_summary'
  | 'onboarding_progress'
  | 'career_health'
  | 'succession_map';

// --- Navigation ---
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles: PersonaRole[];
  badge?: number;
  children?: NavItem[];
}

// --- AI Chat ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
}

export interface ChatAction {
  label: string;
  href?: string;
  onClick?: string;
  type: 'link' | 'action';
}

// --- Career Map View Types ---
export type CareerMapView = 'metro' | 'skill_tree' | 'network' | 'timeline' | 'territory' | 'leap';

export interface MetroStation {
  id: string;
  roleId: string;
  x: number;
  y: number;
  line: string;
  lineColor: string;
  status: 'current' | 'ready' | 'developing' | 'distant';
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
}

export interface SkillNode {
  id: string;
  skillName: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  xpRequired: number;
  xpCurrent: number;
  children: string[];
  category: SkillCategory;
}

// --- Stay Interview ---
export interface StayInterview {
  id: string;
  employeeId: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  themes: string[];
  keyInsights: string[];
  aiGenerated: boolean;
}
