import { NavItem, NavSection } from '@/types';

// ==========================================
// Seções de Navegação por Persona
// ==========================================

export const navigationSections: NavSection[] = [
  // ===== MINHA CARREIRA (todos) =====
  {
    id: 'carreira',
    label: 'Minha Carreira',
    roles: ['colaborador', 'lider', 'pc_analista'],
    items: [
      {
        id: 'meu-gps',
        label: 'Início',
        icon: 'compass',
        href: '/meu-gps',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'meu-cargo',
        label: 'Meu Cargo',
        icon: 'briefcase',
        href: '/meu-cargo',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'perfil',
        label: 'Meu Perfil',
        icon: 'user',
        href: '/perfil',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'mapa-carreira',
        label: 'Mapa de Carreira',
        icon: 'map',
        href: '/mapa-carreira',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'avaliacao',
        label: 'Avaliação de Desempenho',
        icon: 'clipboard-check',
        href: '/avaliacao',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'pdi',
        label: 'Meu PDI',
        icon: 'target',
        href: '/pdi',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'desenvolvimento',
        label: 'Desenvolvimento',
        icon: 'book-open',
        href: '/desenvolvimento',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'marketplace',
        label: 'Oportunidades',
        icon: 'search',
        href: '/marketplace',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'parceiro-jornada',
        label: 'Theo Carreiras',
        icon: 'sparkles',
        href: '/parceiro-jornada',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
    ],
  },

  // ===== POSSIBILIDADES DE FUTURO (todos, sub-seção) =====
  {
    id: 'possibilidades',
    label: 'Possibilidades de Futuro',
    roles: ['colaborador', 'lider', 'pc_analista'],
    items: [
      {
        id: 'sicreder2sicreder',
        label: 'Sicreder2Sicreder',
        icon: 'heart-handshake',
        href: '/sicreder2sicreder',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
      {
        id: 'experiencias',
        label: 'Experiências e Vivências',
        icon: 'rocket',
        href: '/experiencias',
        roles: ['colaborador', 'lider', 'pc_analista'],
      },
    ],
  },

  // ===== MINHA LIDERANÇA (só GA) =====
  {
    id: 'lideranca',
    label: 'Minha Liderança',
    roles: ['lider'],
    items: [
      {
        id: 'equipe',
        label: 'Minha Equipe',
        icon: 'users',
        href: '/equipe',
        roles: ['lider'],
        badge: 2,
      },
      {
        id: 'avaliacao-time',
        label: 'Avaliação do Time',
        icon: 'clipboard-list',
        href: '/avaliacao-time',
        roles: ['lider'],
      },
      {
        id: 'conversas-1a1',
        label: 'Conversas 1:1',
        icon: 'message-circle',
        href: '/conversas-1a1',
        roles: ['lider'],
      },
      {
        id: 'prontidao-time',
        label: 'Prontidão do Time',
        icon: 'gauge',
        href: '/prontidao-time',
        roles: ['lider'],
      },
      {
        id: 'comite-carreira',
        label: 'Comitê de Carreira',
        icon: 'shield-check',
        href: '/comite-carreira',
        roles: ['lider'],
      },
    ],
  },

  // ===== PESSOAS & CULTURA (só P&C) =====
  {
    id: 'pc',
    label: 'Pessoas e Cultura',
    roles: ['pc_analista'],
    items: [
      {
        id: 'dashboard-pc',
        label: 'Dashboard P&C',
        icon: 'bar-chart-3',
        href: '/dashboard-pc',
        roles: ['pc_analista'],
      },
      {
        id: 'mapa-talentos',
        label: 'Mapa de Talentos',
        icon: 'layout-grid',
        href: '/mapa-talentos',
        roles: ['pc_analista'],
      },
      {
        id: 'comite-carreira-pc',
        label: 'Comitê de Carreira',
        icon: 'shield-check',
        href: '/comite-carreira',
        roles: ['pc_analista'],
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: 'trending-up',
        href: '/analytics',
        roles: ['pc_analista'],
      },
    ],
  },
];

// Flatten helper — retorna todos os NavItems para compatibilidade
export const navigationItems: NavItem[] = navigationSections.flatMap(s => s.items);
