import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Contribution, Investment, InvestmentGoal } from "@repo/contracts";

export type InvestmentsState = {
  goals: InvestmentGoal[];
  investments: Investment[];
  contributions: Contribution[];
  hydrated: boolean;
};

export type GoalInput = Pick<
  InvestmentGoal,
  "name" | "category" | "targetAmount" | "targetDate" | "description"
>;

export type InvestmentInput = Pick<
  Investment,
  "goalId" | "name" | "assetClass" | "initialAmount" | "returnRate"
>;

export type HydratedPayload = Pick<
  InvestmentsState,
  "goals" | "investments" | "contributions"
>;

const now = () => new Date().toISOString();
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialState: InvestmentsState = {
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
    { id: "cont-1", investmentId: "inv-tesouro", amount: 3500, date: "2026-06-10" },
    { id: "cont-2", investmentId: "inv-etf", amount: 2200, date: "2026-07-01" },
    { id: "cont-3", investmentId: "inv-cdb", amount: 1000, date: "2026-07-05" },
  ],
  hydrated: false,
};

export const investmentsSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {
    stateHydrated: {
      prepare(payload?: HydratedPayload) {
        return { payload };
      },
      reducer(state, action: PayloadAction<HydratedPayload | undefined>) {
        if (action.payload) {
          state.goals = action.payload.goals;
          state.investments = action.payload.investments;
          state.contributions = action.payload.contributions;
        }
        state.hydrated = true;
      },
    },
    goalAdded(state, action: PayloadAction<GoalInput>) {
      const timestamp = now();
      state.goals.push({
        id: createId(),
        ...action.payload,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    },
    goalUpdated(state, action: PayloadAction<{ id: string; input: GoalInput }>) {
      const goal = state.goals.find((item) => item.id === action.payload.id);
      if (!goal) return;
      Object.assign(goal, action.payload.input, { updatedAt: now() });
    },
    goalRemoved(state, action: PayloadAction<string>) {
      const goalId = action.payload;
      state.goals = state.goals.filter((goal) => goal.id !== goalId);
      const timestamp = now();
      state.investments = state.investments.map((investment) =>
        investment.goalId === goalId
          ? { ...investment, goalId: null, updatedAt: timestamp }
          : investment,
      );
    },
    investmentAdded(state, action: PayloadAction<InvestmentInput>) {
      const timestamp = now();
      state.investments.push({
        id: createId(),
        ...action.payload,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    },
    investmentUpdated(
      state,
      action: PayloadAction<{ id: string; input: InvestmentInput }>,
    ) {
      const investment = state.investments.find(
        (item) => item.id === action.payload.id,
      );
      if (!investment) return;
      Object.assign(investment, action.payload.input, { updatedAt: now() });
    },
    investmentRemoved(state, action: PayloadAction<string>) {
      const investmentId = action.payload;
      state.investments = state.investments.filter(
        (investment) => investment.id !== investmentId,
      );
      state.contributions = state.contributions.filter(
        (contribution) => contribution.investmentId !== investmentId,
      );
    },
    contributionAdded(
      state,
      action: PayloadAction<{ investmentId: string; amount: number; date: string }>,
    ) {
      state.contributions.push({
        id: createId(),
        investmentId: action.payload.investmentId,
        amount: action.payload.amount,
        date: action.payload.date,
      });
    },
  },
});

export const {
  stateHydrated,
  goalAdded,
  goalUpdated,
  goalRemoved,
  investmentAdded,
  investmentUpdated,
  investmentRemoved,
  contributionAdded,
} = investmentsSlice.actions;

export default investmentsSlice.reducer;
