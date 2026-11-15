import { describe, expect, it } from "vitest";
import type { InvestmentsState } from "../domain/InvestmentPortfolio";
import { createInvestmentsSlice } from "./createInvestmentsSlice";

const initialState: InvestmentsState = {
  goals: [],
  investments: [],
  contributions: [],
  hydrated: false,
};

describe("createInvestmentsSlice", () => {
  it("keeps the public Redux actions while delegating behavior", () => {
    const slice = createInvestmentsSlice({
      initialState,
      dependencies: {
        now: () => "2026-08-01T12:00:00.000Z",
        createId: () => "goal-id",
      },
    });
    const hydrated = slice.reducer(undefined, slice.actions.stateHydrated());
    const withGoal = slice.reducer(
      hydrated,
      slice.actions.goalAdded({
        name: "Reserva",
        category: "Curto prazo",
        targetAmount: 10000,
        targetDate: "2027-12-31",
      }),
    );

    expect(hydrated.hydrated).toBe(true);
    expect(withGoal.goals[0]).toMatchObject({
      id: "goal-id",
      name: "Reserva",
      createdAt: "2026-08-01T12:00:00.000Z",
      updatedAt: "2026-08-01T12:00:00.000Z",
    });
  });
});
