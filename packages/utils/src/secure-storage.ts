const ENVELOPE_MARKER = "fiap-secure-storage";
const ENVELOPE_VERSION = 1;
const ENCRYPTION_ALGORITHM = "AES-GCM";
const IV_LENGTH_BYTES = 12;
const DEFAULT_DATABASE_NAME = "fiap-tech-challenge-secure-storage";
const DEFAULT_OBJECT_STORE_NAME = "encryption-keys";

type StorageAdapter = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type WebCryptoAdapter = Pick<Crypto, "getRandomValues" | "subtle">;

type EncryptedEnvelope = {
  marker: typeof ENVELOPE_MARKER;
  version: typeof ENVELOPE_VERSION;
  algorithm: typeof ENCRYPTION_ALGORITHM;
  iv: string;
  ciphertext: string;
};

export type SecureStorageValue = {
  value: string;
  encrypted: boolean;
};

export interface EncryptionKeyProvider {
  getOrCreateKey(): Promise<CryptoKey>;
}

export interface SecureStringStorage {
  read(key: string): Promise<SecureStorageValue | null>;
  write(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export class EncryptedLocalStorage implements SecureStringStorage {
  constructor(
    private readonly storage: StorageAdapter,
    private readonly keyProvider: EncryptionKeyProvider,
    private readonly crypto: WebCryptoAdapter = globalThis.crypto,
  ) {}

  async read(key: string): Promise<SecureStorageValue | null> {
    const raw = this.storage.getItem(key);
    if (raw === null) return null;

    const envelope = parseEnvelope(raw);
    if (!envelope) {
      return { value: raw, encrypted: false };
    }

    const encryptionKey = await this.keyProvider.getOrCreateKey();
    const plaintext = await this.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: decodeBase64(envelope.iv),
        additionalData: encodeText(key),
      },
      encryptionKey,
      decodeBase64(envelope.ciphertext),
    );

    return {
      value: new TextDecoder().decode(plaintext),
      encrypted: true,
    };
  }

  async write(key: string, value: string): Promise<void> {
    const encryptionKey = await this.keyProvider.getOrCreateKey();
    const iv = new Uint8Array(IV_LENGTH_BYTES);
    this.crypto.getRandomValues(iv);
    const ciphertext = await this.crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        additionalData: encodeText(key),
      },
      encryptionKey,
      encodeText(value),
    );
    const envelope: EncryptedEnvelope = {
      marker: ENVELOPE_MARKER,
      version: ENVELOPE_VERSION,
      algorithm: ENCRYPTION_ALGORITHM,
      iv: encodeBase64(iv),
      ciphertext: encodeBase64(new Uint8Array(ciphertext)),
    };

    this.storage.setItem(key, JSON.stringify(envelope));
  }

  async remove(key: string): Promise<void> {
    this.storage.removeItem(key);
  }
}

export type IndexedDbAesKeyProviderOptions = {
  databaseName?: string;
  objectStoreName?: string;
  indexedDB?: IDBFactory;
  crypto?: Crypto;
};

export class IndexedDbAesKeyProvider implements EncryptionKeyProvider {
  private readonly databaseName: string;
  private readonly objectStoreName: string;
  private readonly indexedDbFactory: IDBFactory | undefined;
  private readonly crypto: Crypto | undefined;
  private keyPromise: Promise<CryptoKey> | undefined;

  constructor(
    private readonly keyId: string,
    options: IndexedDbAesKeyProviderOptions = {},
  ) {
    this.databaseName = options.databaseName ?? DEFAULT_DATABASE_NAME;
    this.objectStoreName = options.objectStoreName ?? DEFAULT_OBJECT_STORE_NAME;
    this.indexedDbFactory = options.indexedDB ?? globalThis.indexedDB;
    this.crypto = options.crypto ?? globalThis.crypto;
  }

  getOrCreateKey(): Promise<CryptoKey> {
    if (!this.keyPromise) {
      this.keyPromise = this.loadOrCreateKey().catch((error: unknown) => {
        this.keyPromise = undefined;
        throw error;
      });
    }

    return this.keyPromise;
  }

  private async loadOrCreateKey(): Promise<CryptoKey> {
    if (!this.indexedDbFactory || !this.crypto?.subtle) {
      throw new Error("Secure browser storage is unavailable.");
    }

    const generated = await this.crypto.subtle.generateKey(
      { name: ENCRYPTION_ALGORITHM, length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
    if (isCryptoKeyPair(generated)) {
      throw new Error("Unexpected asymmetric encryption key.");
    }

    const database = await openDatabase(
      this.indexedDbFactory,
      this.databaseName,
      this.objectStoreName,
    );

    try {
      return await storeKeyIfMissing(
        database,
        this.objectStoreName,
        this.keyId,
        generated,
      );
    } finally {
      database.close();
    }
  }
}

export function createEncryptedLocalStorage(
  storage: StorageAdapter,
  keyId: string,
): EncryptedLocalStorage {
  return new EncryptedLocalStorage(storage, new IndexedDbAesKeyProvider(keyId));
}

function parseEnvelope(raw: string): EncryptedEnvelope | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  if (!isRecord(parsed) || parsed["marker"] !== ENVELOPE_MARKER) {
    return null;
  }

  if (
    parsed["version"] !== ENVELOPE_VERSION ||
    parsed["algorithm"] !== ENCRYPTION_ALGORITHM ||
    typeof parsed["iv"] !== "string" ||
    typeof parsed["ciphertext"] !== "string"
  ) {
    throw new Error("Invalid encrypted storage envelope.");
  }

  return parsed as EncryptedEnvelope;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCryptoKeyPair(key: CryptoKey | CryptoKeyPair): key is CryptoKeyPair {
  return "privateKey" in key;
}

function encodeText(value: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(new TextEncoder().encode(value));
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, offset + chunkSize),
    );
  }

  return btoa(binary);
}

function decodeBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function openDatabase(
  indexedDbFactory: IDBFactory,
  databaseName: string,
  objectStoreName: string,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDbFactory.open(databaseName, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(objectStoreName)) {
        database.createObjectStore(objectStoreName);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Unable to open secure key storage."));
    request.onblocked = () =>
      reject(new Error("Secure key storage upgrade is blocked."));
  });
}

function storeKeyIfMissing(
  database: IDBDatabase,
  objectStoreName: string,
  keyId: string,
  generatedKey: CryptoKey,
): Promise<CryptoKey> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.get(keyId);
    let selectedKey: CryptoKey | undefined;

    request.onsuccess = () => {
      const storedKey = request.result as CryptoKey | undefined;
      selectedKey = storedKey ?? generatedKey;

      if (!storedKey) {
        objectStore.put(generatedKey, keyId);
      }
    };

    transaction.oncomplete = () => {
      if (selectedKey) {
        resolve(selectedKey);
      } else {
        reject(new Error("Unable to resolve the secure encryption key."));
      }
    };
    transaction.onerror = () =>
      reject(
        transaction.error ?? new Error("Unable to persist encryption key."),
      );
    transaction.onabort = () =>
      reject(
        transaction.error ?? new Error("Encryption key transaction aborted."),
      );
  });
}
