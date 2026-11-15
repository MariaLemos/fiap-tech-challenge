import type { InvestmentsState } from "../domain/InvestmentPortfolio";

export function createMockInvestmentsState(
  now: () => string,
): InvestmentsState {
  return {
    goals: [
      {
        id: "goal-home",
        name: "Casa propria",
        category: "Patrimonio",
        targetAmount: 180000,
        targetDate: "2030-12-31",
        description: "Entrada do primeiro imovel",
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "goal-retirement",
        name: "Aposentadoria",
        category: "Longo prazo",
        targetAmount: 500000,
        targetDate: "2045-12-31",
        description: "Renda complementar",
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "goal-trip",
        name: "Viagem especial",
        category: "Experiencias",
        targetAmount: 30000,
        targetDate: "2027-09-30",
        description: "Ferias em familia",
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    investments: [
      {
        id: "inv-tesouro",
        goalId: "goal-home",
        name: "Tesouro IPCA 2035",
        assetClass: "Renda fixa",
        initialAmount: 42000,
        returnRate: 8.4,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "inv-etf",
        goalId: "goal-retirement",
        name: "ETF BOVA11",
        assetClass: "ETFs",
        initialAmount: 68000,
        returnRate: 12.8,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "inv-cdb",
        goalId: "goal-trip",
        name: "CDB Liquidez",
        assetClass: "Renda fixa",
        initialAmount: 14500,
        returnRate: 6.2,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: "inv-fii",
        goalId: null,
        name: "Fundo imobiliario",
        assetClass: "Fundos imobiliarios",
        initialAmount: 9000,
        returnRate: 9.1,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    contributions: [
      {
        id: "cont-1",
        investmentId: "inv-tesouro",
        amount: 3500,
        date: "2026-06-10",
      },
      {
        id: "cont-2",
        investmentId: "inv-etf",
        amount: 2200,
        date: "2026-07-01",
      },
      {
        id: "cont-3",
        investmentId: "inv-cdb",
        amount: 1000,
        date: "2026-07-05",
      },
    ],
    hydrated: false,
  };
}
