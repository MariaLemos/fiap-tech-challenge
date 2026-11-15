import type { InvestmentsRepository } from "../application/ports/InvestmentsRepository";
import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";
import { parsePersistedInvestmentsState } from "./parsePersistedInvestmentsState";

export const INVESTMENTS_STORAGE_KEY = "investments:v2";

type InvestmentsStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export class LocalStorageInvestmentsRepository implements InvestmentsRepository {
  private lastSerialized = "";

  constructor(
    private readonly storage: InvestmentsStorage,
    private readonly storageKey = INVESTMENTS_STORAGE_KEY,
  ) {}

  load(): PersistedInvestmentsState | null {
    let raw: string | null;

    try {
      raw = this.storage.getItem(this.storageKey);
    } catch {
      return null;
    }

    if (!raw) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      this.removeInvalidState();
      return null;
    }

    const result = parsePersistedInvestmentsState(parsed);
    if (!result) {
      this.removeInvalidState();
      return null;
    }

    const serialized = JSON.stringify(result.state);
    if (result.normalized) {
      try {
        this.storage.setItem(this.storageKey, serialized);
        this.lastSerialized = serialized;
      } catch {
        // The normalized in-memory state is still safe to hydrate.
      }
    } else {
      this.lastSerialized = serialized;
    }

    return result.state;
  }

  save(state: PersistedInvestmentsState): void {
    const serialized = JSON.stringify(state);
    if (serialized === this.lastSerialized) return;

    try {
      this.storage.setItem(this.storageKey, serialized);
      this.lastSerialized = serialized;
    } catch {
      // Keep the UI state usable and retry on the next store update.
    }
  }

  private removeInvalidState(): void {
    try {
      this.storage.removeItem(this.storageKey);
    } catch {
      // Storage cleanup must not prevent the app from using its seed state.
    }
  }
}
