import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { firebaseDb, firebaseStorage } from "@/services/firebase";
import type {
  FinanceTransaction,
  LocalReceipt,
  Receipt,
  TransactionDraft,
  TransactionFilters,
} from "@/types/finance";

export type TransactionCursor = QueryDocumentSnapshot<DocumentData> | null;

export type TransactionPage = {
  items: FinanceTransaction[];
  cursor: TransactionCursor;
  hasMore: boolean;
};

function requireFirebase() {
  if (!firebaseDb || !firebaseStorage) {
    throw new Error("Firebase não configurado. Use o modo demonstração ou configure o .env.");
  }
  return { db: firebaseDb, storage: firebaseStorage };
}

function mapTransaction(snapshot: QueryDocumentSnapshot<DocumentData>): FinanceTransaction {
  const data = snapshot.data();
  const date =
    data.date instanceof Timestamp
      ? data.date.toDate().toISOString().slice(0, 10)
      : String(data.date).slice(0, 10);

  return {
    id: snapshot.id,
    description: data.description,
    amount: Number(data.amount),
    type: data.type,
    category: data.category,
    date,
    notes: data.notes ?? "",
    receipt: data.receipt ?? null,
  };
}

function transactionCollection(uid: string) {
  const { db } = requireFirebase();
  return collection(db, "users", uid, "transactions");
}

export async function fetchTransactionPage(
  uid: string,
  filters: TransactionFilters,
  cursor: TransactionCursor = null,
  pageSize = 20,
): Promise<TransactionPage> {
  const constraints: QueryConstraint[] = [];

  if (filters.category !== "all") {
    constraints.push(where("category", "==", filters.category));
  }
  if (filters.type !== "all") {
    constraints.push(where("type", "==", filters.type));
  }
  if (filters.startDate) {
    constraints.push(
      where("date", ">=", Timestamp.fromDate(new Date(`${filters.startDate}T00:00:00`))),
    );
  }
  if (filters.endDate) {
    constraints.push(
      where("date", "<=", Timestamp.fromDate(new Date(`${filters.endDate}T23:59:59`))),
    );
  }

  constraints.push(orderBy("date", "desc"));
  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));

  const snapshot = await getDocs(query(transactionCollection(uid), ...constraints));
  const lastDocument = snapshot.docs.at(-1) ?? null;

  return {
    items: snapshot.docs.map(mapTransaction),
    cursor: lastDocument,
    hasMore: snapshot.docs.length === pageSize,
  };
}

export async function fetchDashboardTransactions(uid: string) {
  const snapshot = await getDocs(
    query(transactionCollection(uid), orderBy("date", "desc"), limit(300)),
  );
  return snapshot.docs.map(mapTransaction);
}

function localUriToBlob(uri: string) {
  return new Promise<Blob & { close?: () => void }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = () => resolve(request.response);
    request.onerror = () => reject(new Error("Não foi possível ler o anexo selecionado."));
    request.responseType = "blob";
    request.open("GET", uri, true);
    request.send(null);
  });
}

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function uploadReceipt(
  uid: string,
  transactionId: string,
  receipt: LocalReceipt,
): Promise<Receipt> {
  const { storage } = requireFirebase();
  const blob = await localUriToBlob(receipt.uri);
  const storageRef = ref(
    storage,
    `receipts/${uid}/${transactionId}/${Date.now()}-${safeFileName(receipt.name)}`,
  );

  try {
    const result = await uploadBytes(storageRef, blob, {
      contentType: receipt.mimeType ?? "application/octet-stream",
    });
    return {
      name: receipt.name,
      mimeType: receipt.mimeType,
      size: receipt.size,
      url: await getDownloadURL(result.ref),
    };
  } finally {
    blob.close?.();
  }
}

function draftToDocument(draft: TransactionDraft, receipt: Receipt | null) {
  return {
    description: draft.description.trim(),
    descriptionLower: draft.description.trim().toLocaleLowerCase("pt-BR"),
    amount: draft.amount,
    type: draft.type,
    category: draft.category,
    date: Timestamp.fromDate(new Date(`${draft.date}T12:00:00`)),
    notes: draft.notes?.trim() ?? "",
    receipt,
    updatedAt: serverTimestamp(),
  };
}

export async function createTransaction(uid: string, draft: TransactionDraft) {
  const transactionRef = doc(transactionCollection(uid));
  const receipt = draft.receiptAsset
    ? await uploadReceipt(uid, transactionRef.id, draft.receiptAsset)
    : (draft.existingReceipt ?? null);

  await setDoc(transactionRef, {
    ...draftToDocument(draft, receipt),
    createdAt: serverTimestamp(),
  });
  return transactionRef.id;
}

export async function editTransaction(uid: string, transactionId: string, draft: TransactionDraft) {
  const { db } = requireFirebase();
  const receipt = draft.receiptAsset
    ? await uploadReceipt(uid, transactionId, draft.receiptAsset)
    : (draft.existingReceipt ?? null);
  await updateDoc(
    doc(db, "users", uid, "transactions", transactionId),
    draftToDocument(draft, receipt),
  );
}

export async function removeTransaction(uid: string, transactionId: string) {
  const { db } = requireFirebase();
  await deleteDoc(doc(db, "users", uid, "transactions", transactionId));
}
