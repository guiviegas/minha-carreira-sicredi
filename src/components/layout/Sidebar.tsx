'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePersona } from '@/contexts/PersonaContext';
import { navigationSections } from '@/data/navigation';
import {
  Compass,
  Map,
  User,
  Target,
  BookOpen,
  Users,
  ClipboardCheck,
  ClipboardList,
  Briefcase,
  Sparkles,
  BarChart3,
  TrendingUp,
  LogOut,
  HeartHandshake,
  Rocket,
  MessageCircle,
  Gauge,
  ShieldCheck,
  LayoutGrid,
  Search,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  map: Map,
  user: User,
  target: Target,
  'book-open': BookOpen,
  users: Users,
  'clipboard-check': ClipboardCheck,
  'clipboard-list': ClipboardList,
  briefcase: Briefcase,
  sparkles: Sparkles,
  'bar-chart-3': BarChart3,
  'trending-up': TrendingUp,
  'heart-handshake': HeartHandshake,
  rocket: Rocket,
  'message-circle': MessageCircle,
  gauge: Gauge,
  'shield-check': ShieldCheck,
  'layout-grid': LayoutGrid,
  search: Search,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { currentPersona, clearPersona } = usePersona();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const router = useRouter();
  const [showTrocarPersona, setShowTrocarPersona] = useState(false);

  if (!currentPersona) return null;

  // Filter sections visible to this persona
  const visibleSections = navigationSections
    .filter(section => section.roles.includes(currentPersona.role))
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.roles.includes(currentPersona.role)),
    }))
    .filter(section => section.items.length > 0);

  const initials = currentPersona.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-neutral-100">
        <div className="icon-box-sm" style={{ background: '#33820D' }}>
          <Compass className="!text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-neutral-900 leading-tight">Interface de Carreira</p>
          <p className="text-[11px] text-neutral-400">Sicredi</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {visibleSections.map((section, sectionIndex) => {
          const isCollapsed = collapsedSections.has(section.id);
          const showSectionHeader = visibleSections.length > 1;

          return (
            <div key={section.id} className={sectionIndex > 0 ? 'mt-2 pt-2 border-t border-neutral-100' : ''}>
              {/* Section header (collapsible) */}
              {showSectionHeader && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 mb-0.5 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-500 transition-colors">
                    {section.label}
                  </p>
                  <ChevronDown
                    className={`w-3 h-3 text-neutral-300 group-hover:text-neutral-400 transition-all duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>
              )}

              {/* Items (animated collapse) */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = iconMap[item.icon] || Compass;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`
                              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold
                              transition-all duration-200 relative group
                              ${isActive
                                ? 'bg-verde-50 text-verde-digital'
                                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                              }
                            `}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-verde-digital"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              />
                            )}
                            <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-verde-digital' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-50 text-red-600 text-[11px] font-bold px-1.5">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom: Persona Info — botão de trocar persona com confirmação */}
      <div className="border-t border-neutral-100 p-4">
        <button
          onClick={() => setShowTrocarPersona(true)}
          className="w-full flex items-center gap-3 group hover:bg-neutral-50 -m-1 p-1 rounded-lg transition-colors"
          title="Trocar persona"
        >
          <div
            className="w-9 h-9 rounded-lg avatar-initials text-xs"
            style={{ backgroundColor: currentPersona.color }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-semibold text-neutral-800 truncate">{currentPersona.name}</p>
            <p className="text-[11px] text-neutral-400 truncate">{currentPersona.jobTitle}</p>
          </div>
          <LogOut className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
        </button>
      </div>

      {/* Modal de confirmação para trocar persona */}
      <AnimatePresence>
        {showTrocarPersona && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTrocarPersona(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-verde-50 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-verde-digital" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Trocar de persona?</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Você sairá da visão de <strong>{currentPersona.name}</strong> e voltará para a tela de seleção
                    de personas.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowTrocarPersona(false);
                    clearPersona();
                    router.push('/');
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-verde-digital text-white text-sm font-semibold hover:bg-verde-600 transition-colors"
                >
                  Sim, trocar persona
                </button>
                <button
                  onClick={() => setShowTrocarPersona(false)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
