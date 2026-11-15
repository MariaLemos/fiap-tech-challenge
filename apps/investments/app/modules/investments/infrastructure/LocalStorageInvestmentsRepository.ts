import type { InvestmentsRepository } from "../application/ports/InvestmentsRepository";
import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";

export const INVESTMENTS_STORAGE_KEY = "investments:v2";

type InvestmentsStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPersistedInvestmentsState(
  value: unknown,
): value is PersistedInvestmentsState {
  if (!isObject(value)) return false;
  return (
    Array.isArray(value.goals) &&
    Array.isArray(value.investments) &&
    Array.isArray(value.contributions)
  );
}

export class LocalStorageInvestmentsRepository
  implements InvestmentsRepository
{
  private lastSerialized = "";

  constructor(
    private readonly storage: InvestmentsStorage,
    private readonly storageKey = INVESTMENTS_STORAGE_KEY,
  ) {}

  load(): PersistedInvestmentsState | null {
    try {
      const raw = this.storage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;

      if (!isPersistedInvestmentsState(parsed)) {
        this.storage.removeItem(this.storageKey);
        return null;
      }

      return parsed;
    } catch {
      this.storage.removeItem(this.storageKey);
      return null;
    }
  }

  save(state: PersistedInvestmentsState): void {
    const serialized = JSON.stringify(state);
    if (serialized === this.lastSerialized) return;

    this.lastSerialized = serialized;
    this.storage.setItem(this.storageKey, serialized);
  }
}
