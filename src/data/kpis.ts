import { ExecutiveKPI } from '@/types';

export const executiveKPIs: ExecutiveKPI[] = [
  {
    id: 'kpi-retention',
    label: 'Retenção de Top Performers',
    value: 88,
    unit: '%',
    target: 90,
    trend: 'up',
    trendValue: 3.2,
    status: 'yellow',
    drillDownAvailable: true,
  },
  {
    id: 'kpi-savings',
    label: 'Economia vs. Turnover',
    value: 1.2,
    unit: 'R$ M',
    target: 1.5,
    trend: 'up',
    trendValue: 0.4,
    status: 'green',
    drillDownAvailable: true,
  },
  {
    id: 'kpi-ttp',
    label: 'Tempo de Produtividade',
    value: 5.2,
    unit: 'meses',
    target: 4,
    trend: 'down',
    trendValue: -1.8,
    status: 'green',
    drillDownAvailable: true,
  },
  {
    id: 'kpi-succession',
    label: 'Prontidão Sucessória',
    value: 75,
    unit: '%',
    target: 85,
    trend: 'up',
    trendValue: 5,
    status: 'yellow',
    drillDownAvailable: true,
  },
];

// P&C Dashboard data
export const pcDashboardData = {
  careerHealth: {
    systemAverage: 62,
    branchRanking: [
      { branch: 'Agência Ipê', score: 82 },
      { branch: 'Agência Canela', score: 77 },
      { branch: 'Agência Jardim', score: 75 },
      { branch: 'Agência Araucária', score: 73 },
      { branch: 'Agência Ipê', score: 71 },
      { branch: 'Agência Cedro', score: 69 },
      { branch: 'Agência Roseira', score: 52 },
      { branch: 'Agência Mirante', score: 48 },
    ],
    readyForNextStep: 14,
    overdueDevPlans: 23,
  },
  talentSuccession: {
    highPerformersHighPotential: 45,
    noDevPlan: 12,
    successionCoverage: { covered: 6, total: 8 },
    gnPipelineProjected: { needed: 9, available: 7 },
    gaPipelineProjected: { needed: 3, available: 5 },
  },
  climateAndCulture: {
    eNPS: 42,
    eNPSPrevious: 38,
    careerNPS: 28,
    careerNPSTarget: 40,
    topThemes: [
      { theme: 'Clareza nos critérios de promoção', mentions: 67 },
      { theme: 'Quero mais feedback', mentions: 52 },
      { theme: 'Preocupação com remuneração', mentions: 48 },
      { theme: 'Oportunidades de mobilidade', mentions: 35 },
      { theme: 'Reconhecimento do trabalho', mentions: 29 },
    ],
  },
  businessConnection: {
    turnoverCostQuarter: 2.1, // R$ M
    correlationData: [
      { branch: 'Centro', careerHealth: 82, memberNPS: 68 },
      { branch: 'Vale', careerHealth: 77, memberNPS: 66 },
      { branch: 'Leste', careerHealth: 75, memberNPS: 65 },
      { branch: 'Serra', careerHealth: 73, memberNPS: 63 },
      { branch: 'Sul', careerHealth: 71, memberNPS: 62 },
      { branch: 'Oeste', careerHealth: 69, memberNPS: 59 },
      { branch: 'Campanha', careerHealth: 52, memberNPS: 55 },
      { branch: 'Norte', careerHealth: 48, memberNPS: 51 },
    ],
    devROI: 4.2, // R$ return per R$ invested
    scenarioDoNothing: 2.8, // R$ M projected cost
    scenarioReduce5pp: 0.89, // R$ M projected savings
  },
  turnoverTrend: [
    { month: 'Out/25', rate: 18.5 },
    { month: 'Nov/25', rate: 17.8 },
    { month: 'Dez/25', rate: 18.2 },
    { month: 'Jan/26', rate: 17.5 },
    { month: 'Fev/26', rate: 16.8 },
    { month: 'Mar/26', rate: 15.9 },
    { month: 'Abr/26', rate: 15.2 },
  ],
};
