import type { InvestmentDependencies } from "../application/investmentUseCases";

export const systemInvestmentDependencies: InvestmentDependencies = {
  now: () => new Date().toISOString(),
  createId: () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
};
