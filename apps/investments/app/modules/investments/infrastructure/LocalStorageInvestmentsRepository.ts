import type {
  SecureStorageValue,
  SecureStringStorage,
} from "@repo/utils/secure-storage";
import type { InvestmentsRepository } from "../application/ports/InvestmentsRepository";
import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";
import { parsePersistedInvestmentsState } from "./parsePersistedInvestmentsState";

export const LEGACY_INVESTMENTS_STORAGE_KEY = "investments:v2";
export const INVESTMENTS_STORAGE_KEY_PREFIX = "investments:v3";

export function getInvestmentsStorageKey(userId: string): string {
  return `${INVESTMENTS_STORAGE_KEY_PREFIX}:${encodeURIComponent(userId)}`;
}

type ParsedStorageState = {
  state: PersistedInvestmentsState;
  serialized: string;
  encrypted: boolean;
  requiresRewrite: boolean;
};

type StorageStateResult =
  | { status: "missing" }
  | { status: "unavailable" }
  | { status: "invalid" }
  | ({ status: "valid" } & ParsedStorageState);

export class LocalStorageInvestmentsRepository implements InvestmentsRepository {
  private lastSerialized = "";
  private pendingLegacyRemoval = false;
  private persistenceEnabled = true;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly storage: SecureStringStorage,
    private readonly storageKey: string,
    private readonly legacyStorageKey = LEGACY_INVESTMENTS_STORAGE_KEY,
  ) {}

  async load(): Promise<PersistedInvestmentsState | null> {
    const current = await this.readState(this.storageKey);
    if (current.status === "valid") {
      this.pendingLegacyRemoval = true;
      const securelyStored = await this.rewriteIfNeeded(
        this.storageKey,
        current,
      );
      if (securelyStored) {
        await this.removeMigratedLegacyState();
      }
      return current.state;
    }

    if (current.status === "unavailable") {
      this.persistenceEnabled = false;
      return null;
    }

    const legacy = await this.readState(this.legacyStorageKey);
    if (legacy.status === "unavailable") {
      this.persistenceEnabled = false;
      return null;
    }

    if (legacy.status !== "valid") {
      return null;
    }

    this.pendingLegacyRemoval = true;
    try {
      await this.storage.write(this.storageKey, legacy.serialized);
      this.lastSerialized = legacy.serialized;
      await this.removeMigratedLegacyState();
    } catch {
      // Hydrate valid legacy data and retry encryption on the first store write.
    }

    return legacy.state;
  }

  save(state: PersistedInvestmentsState): Promise<void> {
    if (!this.persistenceEnabled) return Promise.resolve();

    const serialized = JSON.stringify(state);

    const queuedWrite = this.writeQueue.then(async () => {
      if (serialized === this.lastSerialized) {
        await this.removeMigratedLegacyState();
        return;
      }

      try {
        await this.storage.write(this.storageKey, serialized);
        this.lastSerialized = serialized;
        await this.removeMigratedLegacyState();
      } catch {
        // Keep the UI state usable and retry on the next store update.
      }
    });

    this.writeQueue = queuedWrite.catch(() => undefined);
    return queuedWrite;
  }

  private async readState(key: string): Promise<StorageStateResult> {
    let stored: SecureStorageValue | null;
    try {
      stored = await this.storage.read(key);
    } catch {
      return { status: "unavailable" };
    }

    if (!stored) return { status: "missing" };

    let parsed: unknown;
    try {
      parsed = JSON.parse(stored.value) as unknown;
    } catch {
      await this.removeState(key);
      return { status: "invalid" };
    }

    const result = parsePersistedInvestmentsState(parsed);
    if (!result) {
      await this.removeState(key);
      return { status: "invalid" };
    }

    const serialized = JSON.stringify(result.state);
    return {
      status: "valid",
      state: result.state,
      serialized,
      encrypted: stored.encrypted,
      requiresRewrite: result.normalized || !stored.encrypted,
    };
  }

  private async rewriteIfNeeded(
    key: string,
    state: ParsedStorageState,
  ): Promise<boolean> {
    if (!state.requiresRewrite) {
      this.lastSerialized = state.serialized;
      return true;
    }

    try {
      await this.storage.write(key, state.serialized);
      this.lastSerialized = state.serialized;
      return true;
    } catch {
      // The normalized in-memory state is still safe to hydrate.
      return state.encrypted;
    }
  }

  private async removeState(key: string): Promise<void> {
    try {
      await this.storage.remove(key);
    } catch {
      // Storage cleanup must not prevent the app from using its seed state.
    }
  }

  private async removeMigratedLegacyState(): Promise<void> {
    if (!this.pendingLegacyRemoval) return;

    try {
      await this.storage.remove(this.legacyStorageKey);
      this.pendingLegacyRemoval = false;
    } catch {
      // Retry cleanup after the next successful or deduplicated save.
    }
  }
}
