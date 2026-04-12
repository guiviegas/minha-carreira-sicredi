'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersona } from '@/contexts/PersonaContext';
import { navigationItems } from '@/data/navigation';
import {
  Compass,
  Map,
  User,
  Target,
  BookOpen,
  Users,
  ClipboardCheck,
  Briefcase,
  Sparkles,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  map: Map,
  user: User,
  target: Target,
  'book-open': BookOpen,
  users: Users,
  'clipboard-check': ClipboardCheck,
  briefcase: Briefcase,
  sparkles: Sparkles,
  'bar-chart-3': BarChart3,
  'trending-up': TrendingUp,
  settings: Settings,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { currentPersona } = usePersona();

  if (!currentPersona) return null;

  const visibleItems = navigationItems.filter(item =>
    item.roles.includes(currentPersona.role)
  );

  const initials = currentPersona.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-neutral-100">
        <div className="icon-box-sm" style={{ background: '#33820D' }}>
          <Compass className="!text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-neutral-900 leading-tight">GPS de Carreira</p>
          <p className="text-[11px] text-neutral-400">Sicredi</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {visibleItems.map((item) => {
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
      </nav>

      {/* Bottom — Persona Info */}
      <div className="border-t border-neutral-100 p-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-lg avatar-initials text-xs"
            style={{ backgroundColor: currentPersona.color }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-800 truncate">{currentPersona.name}</p>
            <p className="text-[11px] text-neutral-400 truncate">{currentPersona.jobTitle}</p>
          </div>
          <LogOut className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
