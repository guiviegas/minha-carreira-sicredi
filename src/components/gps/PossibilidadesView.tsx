'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PersonaHub } from '@/data/persona-hub';
import { getRoleById } from '@/data/roles';
import { careerPaths, getPathsFromRole } from '@/data/career-paths';
import { Role, CareerPath } from '@/types';
import {
  ArrowRight,
  ArrowLeftRight,
  ArrowUpRight,
  Coins,
  Shield,
  Target,
  Eye,
  TrendingUp,
} from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const difficultyConfig: Record<string, { label: string; color: string; bg: string }> = {
  facil: { label: 'Acessível', color: '#16A34A', bg: '#F0FDF4' },
  moderado: { label: 'Moderado', color: '#D97706', bg: '#FFFBEB' },
  desafiador: { label: 'Desafiador', color: '#DC2626', bg: '#FEF2F2' },
  expert: { label: 'Expert', color: '#7C3AED', bg: '#F5F3FF' },
};

const typeConfig: Record<string, { label: string; icon: typeof ArrowRight }> = {
  vertical: { label: 'Promoção', icon: ArrowRight },
  horizontal: { label: 'Lateral', icon: ArrowLeftRight },
  diagonal: { label: 'Transição', icon: ArrowUpRight },
};

interface Props {
  hub: PersonaHub;
  onSimular: (roleId: string) => void;
  onAdicionarComparacao: (roleId: string) => void;
}

interface PossibilidadeAgrupada {
  titulo: string;
  descricao: string;
  paths: Array<{ path: CareerPath; targetRole: Role }>;
}

/**
 * GPS — Aba 2: Para onde posso ir
 * Lista navegável de cargos acessíveis a partir do atual,
 * agrupados em 3 estratégias (próximos / laterais / estratégicas).
 */
export default function PossibilidadesView({ hub, onSimular, onAdicionarComparacao }: Props) {
  const { cargoAtual } = hub;

  const grupos = useMemo<PossibilidadeAgrupada[]>(() => {
    const pathsDiretos = getPathsFromRole(cargoAtual.id)
      .map((p) => ({ path: p, targetRole: getRoleById(p.toRoleId) }))
      .filter((x): x is { path: CareerPath; targetRole: Role } => !!x.targetRole);

    const proximosNaturais = pathsDiretos.filter((x) => x.path.type === 'vertical');
    const laterais = pathsDiretos.filter((x) => x.path.type === 'horizontal');
    const estrategicas = pathsDiretos.filter((x) => x.path.type === 'diagonal');

    // Trilhas backoffice → negócios extra (se aplicável)
    const isBackoffice =
      cargoAtual.family === 'operacoes' ||
      cargoAtual.family === 'administrativo' ||
      cargoAtual.family === 'atendimento';
    let trilhasBackOffice: typeof pathsDiretos = [];
    if (isBackoffice) {
      trilhasBackOffice = careerPaths
        .filter((p) => {
          const target = getRoleById(p.toRoleId);
          return (
            p.fromRoleId === cargoAtual.id &&
            target &&
            (target.family === 'negocios' ||
              target.family === 'negocios_pf' ||
              target.family === 'negocios_pj' ||
              target.family === 'negocios_agro')
          );
        })
        .map((p) => ({ path: p, targetRole: getRoleById(p.toRoleId)! }));
    }

    return [
      {
        titulo: 'Próximos passos naturais',
        descricao: 'Promoções diretas no seu segmento atual.',
        paths: proximosNaturais,
      },
      {
        titulo: 'Movimentações laterais',
        descricao: 'Explorar outros segmentos no mesmo nível ou similar.',
        paths: laterais,
      },
      {
        titulo: isBackoffice ? 'Transição para negócios' : 'Trilhas estratégicas',
        descricao: isBackoffice
          ? 'Caminhos para áreas comerciais (estratégicas para a cooperativa).'
          : 'Movimentações diagonais e transições de família.',
        paths: isBackoffice ? trilhasBackOffice : estrategicas,
      },
    ].filter((g) => g.paths.length > 0);
  }, [cargoAtual.id, cargoAtual.family]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-6">
      <motion.div variants={item}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Cargos acessíveis a partir do seu atual, agrupados pela estratégia de movimentação.
          Clique em qualquer um para ver a descrição completa, simular a rota ou adicionar à comparação.
        </p>
      </motion.div>

      {grupos.map((g) => (
        <motion.div key={g.titulo} variants={item} className="space-y-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">{g.titulo}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{g.descricao}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {g.paths.map(({ path, targetRole }) => (
              <CargoCard
                key={path.id}
                role={targetRole}
                path={path}
                hub={hub}
                onSimular={() => onSimular(targetRole.id)}
                onComparar={() => onAdicionarComparacao(targetRole.id)}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {grupos.length === 0 && (
        <motion.div variants={item} className="card p-5 text-sm text-gray-500">
          Nenhuma movimentação direta mapeada para o seu cargo atual.
        </motion.div>
      )}
    </motion.div>
  );
}

function CargoCard({
  role,
  path,
  hub,
  onSimular,
  onComparar,
}: {
  role: Role;
  path: CareerPath;
  hub: PersonaHub;
  onSimular: () => void;
  onComparar: () => void;
}) {
  const diff = difficultyConfig[path.difficulty];
  const tp = typeConfig[path.type];

  // Calcula prontidão estimada simples para esse cargo específico
  const prontidao = useMemo(() => {
    const reqs = role.requiredSkills;
    if (reqs.length === 0) return null;
    const atendidas = reqs.filter((req) => {
      const skill = hub.employee.skills.find((s) => s.id === req.skillId);
      return skill && skill.level >= req.minLevel;
    }).length;
    const pct = (atendidas / reqs.length) * 100;
    if (pct >= 90) return { label: 'Pronto agora', cor: '#16A34A', bg: '#F0FDF4' };
    if (pct >= 70) return { label: 'Pronto em 1 ano', cor: '#2563EB', bg: '#EFF6FF' };
    if (pct >= 40) return { label: 'Em desenvolvimento', cor: '#D97706', bg: '#FFFBEB' };
    return { label: 'Início da jornada', cor: '#6B7280', bg: '#F3F4F6' };
  }, [role.requiredSkills, hub.employee.skills]);

  const ehAlvo = role.id === hub.cargoAlvo?.id;

  return (
    <div
      className={`card p-4 transition-all ${
        ehAlvo ? 'ring-2 ring-verde-digital/40' : 'hover:shadow-md'
      }`}
    >
      {ehAlvo && (
        <div className="text-[10px] font-bold uppercase tracking-wider text-verde-digital mb-2">
          ★ Sua aspiração declarada
        </div>
      )}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: role.color }}
        >
          N{role.level}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{role.title}</p>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">{role.description}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
          style={{ backgroundColor: diff.bg, color: diff.color }}
        >
          <Shield className="w-2.5 h-2.5" />
          {diff.label}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 inline-flex items-center gap-1">
          <tp.icon className="w-2.5 h-2.5" />
          {tp.label}
        </span>
        {prontidao && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: prontidao.bg, color: prontidao.cor }}
          >
            {prontidao.label}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1 text-gray-500">
          <Coins className="w-3 h-3" />
          R$ {(role.avgSalaryRange.min / 1000).toFixed(1)}k a {(role.avgSalaryRange.max / 1000).toFixed(1)}k
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <TrendingUp className="w-3 h-3" />
          {role.avgTenureMonths} meses no nível
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
        <a
          href={`/meu-cargo/${role.id}`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Eye className="w-3 h-3" />
          Detalhes
        </a>
        <button
          onClick={onSimular}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-verde-digital text-[11px] font-semibold text-white hover:bg-verde-600 transition-colors"
        >
          <Target className="w-3 h-3" />
          Simular rota
        </button>
        <button
          onClick={onComparar}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors ml-auto"
        >
          <ArrowLeftRight className="w-3 h-3" />
          Comparar
        </button>
      </div>
    </div>
  );
}
