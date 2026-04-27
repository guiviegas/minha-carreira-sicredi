// ==========================================
// MOVIMENTAÇÕES DE CARGOS — Dados Reais
// Fonte: Movimentação de Cargos de-para.xlsx
// ==========================================

export interface Movimentacao {
  cargoAnterior: string;
  cargoAtual: string;
  qtdColaboradores: number;
}

// Top 50 movimentações mais frequentes no sistema Sicredi
export const movimentacoesReais: Movimentacao[] = [
  { cargoAnterior: 'Assistente de Atendimento', cargoAtual: 'Assistente de Negócios', qtdColaboradores: 2061 },
  { cargoAnterior: 'Assistente de Negócios', cargoAtual: 'Gerente de Negócios PF I', qtdColaboradores: 1938 },
  { cargoAnterior: 'Gerente de Negócios PF I', cargoAtual: 'Gerente de Negócios PJ I', qtdColaboradores: 1055 },
  { cargoAnterior: 'Assistente de Negócios', cargoAtual: 'Gerente de Negócios PJ I', qtdColaboradores: 1019 },
  { cargoAnterior: 'Assistente de Atendimento', cargoAtual: 'Gerente de Negócios PF I', qtdColaboradores: 682 },
  { cargoAnterior: 'Assistente de Negócios', cargoAtual: 'Gerente de Negócios Agro I', qtdColaboradores: 661 },
  { cargoAnterior: 'Gerente de Negócios PJ I', cargoAtual: 'Gerente de Negócios PJ II', qtdColaboradores: 654 },
  { cargoAnterior: 'Gerente de Negócios PF I', cargoAtual: 'Gerente de Negócios PF II', qtdColaboradores: 645 },
  { cargoAnterior: 'Caixa', cargoAtual: 'Assistente de Negócios', qtdColaboradores: 587 },
  { cargoAnterior: 'Gerente de Agência I', cargoAtual: 'Gerente de Agência II', qtdColaboradores: 521 },
  { cargoAnterior: 'Caixa', cargoAtual: 'Tesoureiro', qtdColaboradores: 427 },
  { cargoAnterior: 'Gerente de Negócios PF I', cargoAtual: 'Gerente de Negócios Agro I', qtdColaboradores: 406 },
  { cargoAnterior: 'Gerente de Negócios Agro I', cargoAtual: 'Gerente de Negócios Agro II', qtdColaboradores: 329 },
  { cargoAnterior: 'Gerente de Negócios PJ I', cargoAtual: 'Gerente de Agência I', qtdColaboradores: 319 },
  { cargoAnterior: 'Gerente de Agência II', cargoAtual: 'Gerente de Agência III', qtdColaboradores: 305 },
  { cargoAnterior: 'Assistente Administrativo de Agência', cargoAtual: 'Assistente de Negócios', qtdColaboradores: 283 },
  { cargoAnterior: 'Caixa', cargoAtual: 'Assistente de Atendimento', qtdColaboradores: 274 },
  { cargoAnterior: 'Caixa', cargoAtual: 'Assistente Administrativo de Agência', qtdColaboradores: 272 },
  { cargoAnterior: 'Gerente de Negócios PJ II', cargoAtual: 'Gerente de Negócios PJ III', qtdColaboradores: 190 },
  { cargoAnterior: 'Gerente de Negócios PF II', cargoAtual: 'Gerente de Negócios PF III', qtdColaboradores: 188 },
  { cargoAnterior: 'Assistente de Atendimento', cargoAtual: 'Gerente de Negócios Agro I', qtdColaboradores: 187 },
  { cargoAnterior: 'Assistente de Atendimento', cargoAtual: 'Gerente de Negócios PJ I', qtdColaboradores: 166 },
  { cargoAnterior: 'Promotor de Negócios', cargoAtual: 'Assistente de Negócios', qtdColaboradores: 153 },
  { cargoAnterior: 'Gerente de Negócios Agro I', cargoAtual: 'Gerente de Agência I', qtdColaboradores: 140 },
  { cargoAnterior: 'Assistente de Atendimento', cargoAtual: 'Caixa', qtdColaboradores: 132 },
  { cargoAnterior: 'Assistente Administrativo de Agência', cargoAtual: 'Coordenador Administrativo Financeiro', qtdColaboradores: 120 },
  { cargoAnterior: 'Gerente de Negócios PJ I', cargoAtual: 'Gerente de Negócios PF I', qtdColaboradores: 119 },
  { cargoAnterior: 'Promotor de Negócios', cargoAtual: 'Gerente de Negócios PF I', qtdColaboradores: 109 },
  { cargoAnterior: 'Gerente de Negócios PJ II', cargoAtual: 'Gerente de Agência I', qtdColaboradores: 106 },
  { cargoAnterior: 'Gerente de Negócios PF II', cargoAtual: 'Gerente de Negócios PJ I', qtdColaboradores: 104 },
  { cargoAnterior: 'Gerente de Agência I', cargoAtual: 'Gerente de Agência III', qtdColaboradores: 103 },
  { cargoAnterior: 'Gerente de Negócios PJ I', cargoAtual: 'Gerente de Negócios Agro I', qtdColaboradores: 101 },
  { cargoAnterior: 'Tesoureiro', cargoAtual: 'Assistente de Negócios', qtdColaboradores: 99 },
  { cargoAnterior: 'Gerente de Negócios Agro II', cargoAtual: 'Gerente de Negócios Agro III', qtdColaboradores: 88 },
  { cargoAnterior: 'Gerente de Agência III', cargoAtual: 'Gerente de Agência IV', qtdColaboradores: 82 },
  { cargoAnterior: 'Gerente de Negócios PF I', cargoAtual: 'Gerente de Agência I', qtdColaboradores: 77 },
  { cargoAnterior: 'Gerente de Negócios PF I', cargoAtual: 'Gerente de Negócios PF III', qtdColaboradores: 73 },
  { cargoAnterior: 'Gerente de Negócios PJ I', cargoAtual: 'Gerente de Negócios PF II', qtdColaboradores: 73 },
  { cargoAnterior: 'Coordenador Administrativo Financeiro', cargoAtual: 'Gerente Administrativo Financeiro I', qtdColaboradores: 64 },
  { cargoAnterior: 'Assistente Administrativo de Agência', cargoAtual: 'Gerente de Negócios PF I', qtdColaboradores: 62 },
];

// Funções de análise
export const getMovimentacoesDe = (cargo: string): Movimentacao[] =>
  movimentacoesReais
    .filter(m => m.cargoAnterior === cargo)
    .sort((a, b) => b.qtdColaboradores - a.qtdColaboradores);

export const getMovimentacoesPara = (cargo: string): Movimentacao[] =>
  movimentacoesReais
    .filter(m => m.cargoAtual === cargo)
    .sort((a, b) => b.qtdColaboradores - a.qtdColaboradores);

export const getTopDestinosDe = (cargo: string, top = 5): Movimentacao[] =>
  getMovimentacoesDe(cargo).slice(0, top);

export const getTopOrigensPara = (cargo: string, top = 5): Movimentacao[] =>
  getMovimentacoesPara(cargo).slice(0, top);

// Insights de carreira derivados
export interface InsightCarreira {
  tipo: 'ascensao' | 'lateral' | 'especializacao';
  descricao: string;
  cargoDestino: string;
  probabilidade: number; // 0-100
  qtdMovimentacoes: number;
}

export const getInsightsCarreira = (cargoAtual: string): InsightCarreira[] => {
  const destinos = getMovimentacoesDe(cargoAtual);
  const totalMovimentacoes = destinos.reduce((sum, m) => sum + m.qtdColaboradores, 0);
  
  return destinos.slice(0, 8).map(m => {
    const prob = totalMovimentacoes > 0 ? Math.round((m.qtdColaboradores / totalMovimentacoes) * 100) : 0;
    
    // Determinar tipo
    let tipo: InsightCarreira['tipo'] = 'lateral';
    const anterior = m.cargoAnterior.toLowerCase();
    const atual = m.cargoAtual.toLowerCase();
    
    if (atual.includes('gerente') && !anterior.includes('gerente')) {
      tipo = 'ascensao';
    } else if (
      (anterior.includes(' i') && atual.includes(' ii')) ||
      (anterior.includes(' ii') && atual.includes(' iii')) ||
      (anterior.includes(' iii') && atual.includes(' iv'))
    ) {
      tipo = 'ascensao';
    } else if (
      (anterior.includes('pf') && atual.includes('pj')) ||
      (anterior.includes('pj') && atual.includes('agro')) ||
      (anterior.includes('pf') && atual.includes('agro'))
    ) {
      tipo = 'lateral';
    } else if (atual.includes('assessor') || atual.includes('especialista')) {
      tipo = 'especializacao';
    }

    return {
      tipo,
      descricao: `${m.cargoAnterior} → ${m.cargoAtual}`,
      cargoDestino: m.cargoAtual,
      probabilidade: prob,
      qtdMovimentacoes: m.qtdColaboradores,
    };
  });
};
