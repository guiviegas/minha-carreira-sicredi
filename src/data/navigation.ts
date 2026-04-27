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
        roles: ['colaborador', 'lider'],
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
        label: 'GPS de Carreira',
        icon: 'map',
        href: '/mapa-carreira',
        roles: ['colaborador', 'lider'],
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
        roles: ['colaborador', 'lider'],
      },
      {
        id: 'marketplace',
        label: 'Oportunidades Internas',
        icon: 'search',
        href: '/marketplace',
        roles: ['colaborador', 'lider'],
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

  // ===== POSSIBILIDADES DE FUTURO (só colaborador) =====
  {
    id: 'possibilidades',
    label: 'Possibilidades de Futuro',
    roles: ['colaborador'],
    items: [
      {
        id: 'sicreder2sicreder',
        label: 'Sicreder2Sicreder',
        icon: 'heart-handshake',
        href: '/sicreder2sicreder',
        roles: ['colaborador'],
      },
      {
        id: 'experiencias',
        label: 'Experiências e Vivências',
        icon: 'rocket',
        href: '/experiencias',
        roles: ['colaborador'],
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
        badge: 1,
      },
      {
        id: 'avaliacao-time',
        label: 'Gestão de Desempenho',
        icon: 'clipboard-list',
        href: '/avaliacao-time',
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
        label: 'Painel de Pessoas',
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
    ],
  },
];

// Flatten helper
export const navigationItems: NavItem[] = navigationSections.flatMap(s => s.items);
