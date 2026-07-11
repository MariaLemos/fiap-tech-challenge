"use client";

import type { Contribution, Investment, InvestmentGoal } from "@repo/contracts";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

type State = { goals: InvestmentGoal[]; investments: Investment[]; contributions: Contribution[] };
type GoalInput = Pick<InvestmentGoal, "name" | "category" | "targetAmount" | "targetDate" | "description">;
type InvestmentInput = Pick<Investment, "goalId" | "name" | "assetClass" | "initialAmount" | "returnRate">;
type Action =
  | { type: "hydrate"; state: State }
  | { type: "saveGoal"; id?: string; input: GoalInput }
  | { type: "deleteGoal"; id: string }
  | { type: "saveInvestment"; id?: string; input: InvestmentInput }
  | { type: "deleteInvestment"; id: string }
  | { type: "addContribution"; investmentId: string; amount: number; date: string };

const STORAGE_KEY = "investments:v2";
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();

const initialState: State = {
  goals: [
    { id: "goal-home", name: "Casa propria", category: "Patrimonio", targetAmount: 180000, targetDate: "2030-12-31", description: "Entrada do primeiro imovel", createdAt: now(), updatedAt: now() },
    { id: "goal-retirement", name: "Aposentadoria", category: "Longo prazo", targetAmount: 500000, targetDate: "2045-12-31", description: "Renda complementar", createdAt: now(), updatedAt: now() },
    { id: "goal-trip", name: "Viagem especial", category: "Experiencias", targetAmount: 30000, targetDate: "2027-09-30", description: "Ferias em familia", createdAt: now(), updatedAt: now() },
  ],
  investments: [
    { id: "inv-tesouro", goalId: "goal-home", name: "Tesouro IPCA 2035", assetClass: "Renda fixa", initialAmount: 42000, returnRate: 8.4, createdAt: now(), updatedAt: now() },
    { id: "inv-etf", goalId: "goal-retirement", name: "ETF BOVA11", assetClass: "ETFs", initialAmount: 68000, returnRate: 12.8, createdAt: now(), updatedAt: now() },
    { id: "inv-cdb", goalId: "goal-trip", name: "CDB Liquidez", assetClass: "Renda fixa", initialAmount: 14500, returnRate: 6.2, createdAt: now(), updatedAt: now() },
    { id: "inv-fii", goalId: null, name: "Fundo imobiliario", assetClass: "Fundos imobiliarios", initialAmount: 9000, returnRate: 9.1, createdAt: now(), updatedAt: now() },
  ],
  contributions: [
    { id: "cont-1", investmentId: "inv-tesouro", amount: 3500, date: "2026-06-10" },
    { id: "cont-2", investmentId: "inv-etf", amount: 2200, date: "2026-07-01" },
    { id: "cont-3", investmentId: "inv-cdb", amount: 1000, date: "2026-07-05" },
  ],
};

function reducer(state: State, action: Action): State {
  if (action.type === "hydrate") return action.state;
  if (action.type === "saveGoal") {
    if (action.id) return { ...state, goals: state.goals.map((goal) => goal.id === action.id ? { ...goal, ...action.input, updatedAt: now() } : goal) };
    const timestamp = now();
    return { ...state, goals: [...state.goals, { id: id(), ...action.input, createdAt: timestamp, updatedAt: timestamp }] };
  }
  if (action.type === "deleteGoal") return {
    ...state,
    goals: state.goals.filter((goal) => goal.id !== action.id),
    investments: state.investments.map((investment) => investment.goalId === action.id ? { ...investment, goalId: null, updatedAt: now() } : investment),
  };
  if (action.type === "saveInvestment") {
    if (action.id) return { ...state, investments: state.investments.map((investment) => investment.id === action.id ? { ...investment, ...action.input, updatedAt: now() } : investment) };
    const timestamp = now();
    return { ...state, investments: [...state.investments, { id: id(), ...action.input, createdAt: timestamp, updatedAt: timestamp }] };
  }
  if (action.type === "deleteInvestment") return { ...state, investments: state.investments.filter((investment) => investment.id !== action.id), contributions: state.contributions.filter((item) => item.investmentId !== action.id) };
  return { ...state, contributions: [...state.contributions, { id: id(), investmentId: action.investmentId, amount: action.amount, date: action.date }] };
}

type ContextValue = State & {
  isReady: boolean;
  saveGoal: (input: GoalInput, id?: string) => void;
  deleteGoal: (id: string) => void;
  saveInvestment: (input: InvestmentInput, id?: string) => void;
  deleteInvestment: (id: string) => void;
  addContribution: (investmentId: string, amount: number, date: string) => void;
  getInvestmentValue: (investment: Investment) => number;
  getGoalValue: (goalId: string) => number;
};

const Context = createContext<ContextValue | null>(null);

export function InvestmentsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) dispatch({ type: "hydrate", state: JSON.parse(stored) as State }); } catch { localStorage.removeItem(STORAGE_KEY); }
    setIsReady(true);
  }, []);
  useEffect(() => { if (isReady) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [isReady, state]);
  const contributionTotals = useMemo(() => state.contributions.reduce<Record<string, number>>((result, item) => ({ ...result, [item.investmentId]: (result[item.investmentId] ?? 0) + item.amount }), {}), [state.contributions]);
  const getInvestmentValue = (investment: Investment) => (investment.initialAmount + (contributionTotals[investment.id] ?? 0)) * (1 + investment.returnRate / 100);
  const getGoalValue = (goalId: string) => state.investments.filter((item) => item.goalId === goalId).reduce((total, item) => total + getInvestmentValue(item), 0);
  return <Context.Provider value={{ ...state, isReady, getInvestmentValue, getGoalValue, saveGoal: (input, goalId) => dispatch({ type: "saveGoal", input, id: goalId }), deleteGoal: (goalId) => dispatch({ type: "deleteGoal", id: goalId }), saveInvestment: (input, investmentId) => dispatch({ type: "saveInvestment", input, id: investmentId }), deleteInvestment: (investmentId) => dispatch({ type: "deleteInvestment", id: investmentId }), addContribution: (investmentId, amount, date) => dispatch({ type: "addContribution", investmentId, amount, date }) }}>{children}</Context.Provider>;
}

export function useInvestments() {
  const value = useContext(Context);
  if (!value) throw new Error("useInvestments must be used within InvestmentsProvider");
  return value;
}
