'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TheoCardProps {
  title: string;
  description: string;
  cta?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  variant?: 'default' | 'compact';
}

export default function TheoCard({ title, description, cta, ctaHref, onCtaClick, variant = 'default' }: TheoCardProps) {
  const isCompact = variant === 'compact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-xl border border-green-200/60
        bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40
        ${isCompact ? 'p-3' : 'p-4'}
      `}
    >
      {/* Decorative gradient line on left */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full bg-gradient-to-b from-verde-digital to-emerald-400" />

      <div className="flex gap-3 pl-2">
        {/* Icon */}
        <div className={`
          shrink-0 rounded-lg flex items-center justify-center
          bg-gradient-to-br from-verde-digital/10 to-emerald-100/60
          ${isCompact ? 'w-8 h-8' : 'w-9 h-9'}
        `}>
          <Sparkles className={`text-verde-digital ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-verde-digital/70">Theo sugere</span>
          </div>
          <p className={`font-semibold text-gray-800 leading-snug ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {title}
          </p>
          <p className={`text-gray-500 mt-0.5 leading-relaxed ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
            {description}
          </p>

          {cta && (
            <div className="mt-2">
              {ctaHref ? (
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-verde-digital hover:text-verde-600 transition-colors"
                >
                  {cta} <ArrowRight className="w-3 h-3" />
                </a>
              ) : (
                <button
                  onClick={onCtaClick}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-verde-digital hover:text-verde-600 transition-colors"
                >
                  {cta} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
