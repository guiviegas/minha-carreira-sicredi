import { CareerPath } from '@/types';

export const careerPaths: CareerPath[] = [
  // ===== VERTICAL — Trilha PF (I → IV) =====
  { id: 'cp-01', fromRoleId: 'role-assistente-atendimento', toRoleId: 'role-assistente-negocios', type: 'vertical', requirements: ['Onboarding completo', 'Avaliação de competências favorável'], difficulty: 'facil' },
  { id: 'cp-02', fromRoleId: 'role-assistente-negocios', toRoleId: 'role-gn-pf1', type: 'vertical', requirements: ['Certificação CPA-10', 'Avaliação 270° favorável', 'Demonstrar Entender para Atender'], difficulty: 'moderado' },
  { id: 'cp-03', fromRoleId: 'role-gn-pf1', toRoleId: 'role-gn-pf2', type: 'vertical', requirements: ['Resultados consistentes', 'CPA-20 desejável', 'Trilha de desenvolvimento concluída'], difficulty: 'moderado' },
  { id: 'cp-04', fromRoleId: 'role-gn-pf2', toRoleId: 'role-gn-pf3', type: 'vertical', requirements: ['CPA-20 obrigatória', 'Track record de carteira qualificada', 'Mentoria ativa'], difficulty: 'desafiador' },
  { id: 'cp-05', fromRoleId: 'role-gn-pf3', toRoleId: 'role-gn-pf4', type: 'vertical', requirements: ['CEA obrigatória', 'Carteira alta renda consolidada', 'Referência técnica regional'], difficulty: 'expert' },

  // ===== VERTICAL — Trilha PJ (I → III) =====
  { id: 'cp-06', fromRoleId: 'role-assistente-negocios', toRoleId: 'role-gn-pj1', type: 'vertical', requirements: ['Capacitação PJ concluída', 'Análise financeira básica'], difficulty: 'moderado' },
  { id: 'cp-07', fromRoleId: 'role-gn-pj1', toRoleId: 'role-gn-pj2', type: 'vertical', requirements: ['Resultados consistentes', 'Capacitação de crédito PJ avançada'], difficulty: 'moderado' },
  { id: 'cp-08', fromRoleId: 'role-gn-pj2', toRoleId: 'role-gn-pj3', type: 'vertical', requirements: ['Track record corporate', 'Operações estruturadas', 'Mentoria ativa'], difficulty: 'desafiador' },

  // ===== VERTICAL — Trilha AGRO (I → III) =====
  { id: 'cp-09', fromRoleId: 'role-assistente-negocios', toRoleId: 'role-agro1', type: 'vertical', requirements: ['Conhecimento agronegócio', 'Capacitação crédito rural'], difficulty: 'moderado' },
  { id: 'cp-10', fromRoleId: 'role-agro1', toRoleId: 'role-agro2', type: 'vertical', requirements: ['Resultados consistentes', 'CPR e operações de barter'], difficulty: 'moderado' },
  { id: 'cp-11', fromRoleId: 'role-agro2', toRoleId: 'role-agro3', type: 'vertical', requirements: ['Grandes operações rurais', 'LCA/CRA', 'Referência técnica'], difficulty: 'desafiador' },

  // ===== ESPECIALISTA — Assessor de Investimentos =====
  { id: 'cp-12', fromRoleId: 'role-gn-pf2', toRoleId: 'role-assessor-investimentos', type: 'diagonal', requirements: ['CEA obrigatória', 'Perfil analítico', 'Interesse declarado'], difficulty: 'desafiador' },
  { id: 'cp-13', fromRoleId: 'role-gn-pf3', toRoleId: 'role-assessor-investimentos', type: 'horizontal', requirements: ['CEA obrigatória', 'Experiência com investimentos'], difficulty: 'moderado' },

  // ===== VERTICAL — Trilha Liderança =====
  { id: 'cp-14', fromRoleId: 'role-gn-pf3', toRoleId: 'role-gerente-agencia', type: 'vertical', requirements: ['Programa de Liderança completo', 'Assessment de prontidão', 'Job shadow em GA'], difficulty: 'desafiador' },
  { id: 'cp-15', fromRoleId: 'role-gn-pf4', toRoleId: 'role-gerente-agencia', type: 'vertical', requirements: ['Programa de Liderança completo', 'Evidência de liderança informal'], difficulty: 'moderado' },
  { id: 'cp-16', fromRoleId: 'role-gn-pj3', toRoleId: 'role-gerente-agencia', type: 'diagonal', requirements: ['Programa de Liderança completo', 'Visão generalista demonstrada'], difficulty: 'desafiador' },
  { id: 'cp-17', fromRoleId: 'role-agro3', toRoleId: 'role-gerente-agencia', type: 'diagonal', requirements: ['Programa de Liderança', 'Visão generalista', 'Assessment de prontidão'], difficulty: 'desafiador' },
  { id: 'cp-18', fromRoleId: 'role-gerente-agencia', toRoleId: 'role-gerente-regional', type: 'vertical', requirements: ['Track record consistente', 'Desenvolvimento de sucessor(es)', 'MBA ou equivalente'], difficulty: 'expert' },
  { id: 'cp-19', fromRoleId: 'role-gerente-regional', toRoleId: 'role-diretor', type: 'vertical', requirements: ['Histórico de expansão', 'Governança cooperativa avançada', 'Aprovação do Conselho'], difficulty: 'expert' },

  // ===== HORIZONTAL — Movimentação entre carteiras =====
  { id: 'cp-20', fromRoleId: 'role-gn-pf1', toRoleId: 'role-gn-pj1', type: 'horizontal', requirements: ['Capacitação PJ concluída', 'Interesse e disponibilidade'], difficulty: 'moderado' },
  { id: 'cp-21', fromRoleId: 'role-gn-pf2', toRoleId: 'role-gn-pj2', type: 'horizontal', requirements: ['Capacitação PJ concluída', 'Análise financeira PJ'], difficulty: 'moderado' },
  { id: 'cp-22', fromRoleId: 'role-gn-pf1', toRoleId: 'role-agro1', type: 'horizontal', requirements: ['Conhecimento agronegócio', 'Capacitação de crédito rural'], difficulty: 'moderado' },
  { id: 'cp-23', fromRoleId: 'role-gn-pj1', toRoleId: 'role-agro1', type: 'horizontal', requirements: ['Experiência com produtores rurais', 'Capacitação AGRO'], difficulty: 'moderado' },
  { id: 'cp-24', fromRoleId: 'role-gn-pj1', toRoleId: 'role-gn-pf1', type: 'horizontal', requirements: ['Interesse em carteira PF', 'CPA-10'], difficulty: 'facil' },

  // ===== DIAGONAL — Operações ↔ Negócios =====
  { id: 'cp-25', fromRoleId: 'role-assistente-atendimento', toRoleId: 'role-operacoes', type: 'horizontal', requirements: ['Interesse em back-office', 'Trilha operacional concluída'], difficulty: 'facil' },
  { id: 'cp-26', fromRoleId: 'role-operacoes', toRoleId: 'role-assistente-negocios', type: 'diagonal', requirements: ['Trilha de negócios concluída', 'Perfil comercial demonstrado'], difficulty: 'moderado' },

  // ===== P&C Track =====
  { id: 'cp-27', fromRoleId: 'role-analista-pc', toRoleId: 'role-coordenador-pc', type: 'vertical', requirements: ['Especialização em gestão de pessoas', 'Projetos de impacto entregues'], difficulty: 'desafiador' },

  // ===== CROSS-ENTITY — Movimentações entre entidades =====
  { id: 'cp-28', fromRoleId: 'role-gn-pf2', toRoleId: 'role-analista-central', type: 'diagonal', requirements: ['Especialização técnica', 'Interesse declarado', 'Aprovação do gestor'], difficulty: 'moderado' },
  { id: 'cp-29', fromRoleId: 'role-gn-pf3', toRoleId: 'role-analista-cas', type: 'diagonal', requirements: ['Perfil analítico', 'Disponibilidade para Porto Alegre', 'Processo seletivo CAS'], difficulty: 'desafiador' },
  { id: 'cp-30', fromRoleId: 'role-gn-pj2', toRoleId: 'role-analista-cas', type: 'diagonal', requirements: ['Expertise em produtos PJ', 'Processo seletivo CAS'], difficulty: 'desafiador' },
  { id: 'cp-31', fromRoleId: 'role-analista-pc', toRoleId: 'role-analista-cas', type: 'horizontal', requirements: ['Expertise em P&C', 'Processo seletivo CAS'], difficulty: 'moderado' },
  { id: 'cp-32', fromRoleId: 'role-operacoes', toRoleId: 'role-analista-central', type: 'diagonal', requirements: ['Expertise em compliance/risco', 'Processo seletivo Central'], difficulty: 'moderado' },
  { id: 'cp-33', fromRoleId: 'role-assistente-negocios', toRoleId: 'role-fundacao', type: 'diagonal', requirements: ['Interesse em impacto social', 'Perfil educacional', 'Processo seletivo Fundação'], difficulty: 'moderado' },
  { id: 'cp-34', fromRoleId: 'role-analista-central', toRoleId: 'role-analista-cas', type: 'horizontal', requirements: ['Track record na Central', 'Processo seletivo CAS'], difficulty: 'facil' },
];

export const getPathsFromRole = (roleId: string): CareerPath[] =>
  careerPaths.filter(p => p.fromRoleId === roleId);

export const getPathsToRole = (roleId: string): CareerPath[] =>
  careerPaths.filter(p => p.toRoleId === roleId);
