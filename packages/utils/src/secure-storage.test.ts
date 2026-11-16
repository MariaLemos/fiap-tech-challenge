import { describe, expect, it } from "vitest";
import {
  EncryptedLocalStorage,
  type EncryptionKeyProvider,
} from "./secure-storage";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

async function createKey(): Promise<CryptoKey> {
  const key = await globalThis.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  if ("privateKey" in key) {
    throw new Error("Expected a symmetric key.");
  }

  return key;
}

function staticKeyProvider(key: CryptoKey): EncryptionKeyProvider {
  return {
    async getOrCreateKey() {
      return key;
    },
  };
}

describe("EncryptedLocalStorage", () => {
  it("round-trips ciphertext without exposing plaintext", async () => {
    const storage = new MemoryStorage();
    const secureStorage = new EncryptedLocalStorage(
      storage,
      staticKeyProvider(await createKey()),
    );

    await secureStorage.write("transactions:user-1", "Mercado: 125.50");

    const raw = storage.getItem("transactions:user-1");
    expect(raw).not.toContain("Mercado");
    expect(JSON.parse(raw ?? "null")).toMatchObject({
      marker: "fiap-secure-storage",
      version: 1,
      algorithm: "AES-GCM",
    });
    await expect(secureStorage.read("transactions:user-1")).resolves.toEqual({
      value: "Mercado: 125.50",
      encrypted: true,
    });
  });

  it("uses a fresh IV for equivalent writes", async () => {
    const storage = new MemoryStorage();
    const secureStorage = new EncryptedLocalStorage(
      storage,
      staticKeyProvider(await createKey()),
    );

    await secureStorage.write("investments:user-1", "same-value");
    const first = JSON.parse(
      storage.getItem("investments:user-1") ?? "null",
    ) as { iv: string; ciphertext: string };

    await secureStorage.write("investments:user-1", "same-value");
    const second = JSON.parse(
      storage.getItem("investments:user-1") ?? "null",
    ) as { iv: string; ciphertext: string };

    expect(second.iv).not.toBe(first.iv);
    expect(second.ciphertext).not.toBe(first.ciphertext);
  });

  it("identifies legacy plaintext without rewriting it", async () => {
    const storage = new MemoryStorage();
    storage.setItem("legacy", JSON.stringify({ amount: 100 }));
    const secureStorage = new EncryptedLocalStorage(
      storage,
      staticKeyProvider(await createKey()),
    );

    await expect(secureStorage.read("legacy")).resolves.toEqual({
      value: JSON.stringify({ amount: 100 }),
      encrypted: false,
    });
  });

  it("rejects ciphertext copied to another authenticated scope", async () => {
    const storage = new MemoryStorage();
    const secureStorage = new EncryptedLocalStorage(
      storage,
      staticKeyProvider(await createKey()),
    );

    await secureStorage.write("transactions:user-1", "protected");
    storage.setItem(
      "transactions:user-2",
      storage.getItem("transactions:user-1") ?? "",
    );

    await expect(secureStorage.read("transactions:user-2")).rejects.toThrow();
  });

  it("rejects ciphertext when the encryption key changes", async () => {
    const storage = new MemoryStorage();
    const firstStorage = new EncryptedLocalStorage(
      storage,
      staticKeyProvider(await createKey()),
    );
    await firstStorage.write("portfolio", "protected");

    const secondStorage = new EncryptedLocalStorage(
      storage,
      staticKeyProvider(await createKey()),
    );

    await expect(secondStorage.read("portfolio")).rejects.toThrow();
  });
});
