'use client';

import { reguaPerformance, reguaProntidao, reguaPotencial } from '@/data/elofy-config';

/**
 * Componentes centralizados para badges com cores oficiais Sicredi.
 * Use estes para garantir consistência entre todas as páginas.
 */

export function BadgeConceito({
  nivel,
  size = 'md',
  showFaixa = false,
}: {
  nivel: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  showFaixa?: boolean;
}) {
  const config = reguaPerformance[nivel - 1];
  if (!config) return null;
  const sizeClass =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3 py-1'
      : 'text-[11px] px-2 py-0.5';
  return (
    <span
      className={`font-bold rounded-full inline-flex items-center gap-1 ${sizeClass}`}
      style={{ backgroundColor: config.bgCor, color: config.cor }}
      title={config.descricao}
    >
      {config.hashtag}
      {showFaixa && (
        <span className="opacity-70 font-normal">
          ({config.notaMinima.toFixed(2).replace('.', ',')}-{config.notaMaxima.toFixed(2).replace('.', ',')})
        </span>
      )}
    </span>
  );
}

export function BadgeProntidao({
  prontidaoId,
  size = 'md',
}: {
  prontidaoId: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const config = reguaProntidao.find((r) => r.id === prontidaoId);
  if (!config) return null;
  const sizeClass =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3 py-1'
      : 'text-[11px] px-2 py-0.5';
  return (
    <span
      className={`font-semibold rounded-full ${sizeClass}`}
      style={{ backgroundColor: config.bgCor, color: config.cor }}
      title={config.descricao}
    >
      {config.nome}
    </span>
  );
}

export function BadgePotencial({
  potencialId,
  size = 'md',
}: {
  potencialId: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const config = reguaPotencial.find((r) => r.id === potencialId);
  if (!config) return null;
  const sizeClass =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3 py-1'
      : 'text-[11px] px-2 py-0.5';
  return (
    <span
      className={`font-semibold rounded-full ${sizeClass}`}
      style={{ backgroundColor: config.bgCor, color: config.cor }}
      title={config.descricao}
    >
      Pot: {config.label}
    </span>
  );
}

/**
 * Empty state padrão — usado quando não há dados para mostrar.
 */
export function EmptyState({
  icon: Icon,
  titulo,
  descricao,
  cta,
}: {
  icon?: React.ElementType;
  titulo: string;
  descricao?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="card p-8 text-center">
      {Icon && (
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <p className="text-sm font-semibold text-gray-700">{titulo}</p>
      {descricao && <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">{descricao}</p>}
      {cta && (
        <a
          href={cta.href}
          className="inline-block mt-4 text-xs font-bold text-verde-digital hover:underline"
        >
          {cta.label} →
        </a>
      )}
    </div>
  );
}
