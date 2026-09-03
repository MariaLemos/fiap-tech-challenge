import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { useAuth } from "@/context/auth-context";
import { DEMO_TRANSACTIONS } from "@/data/demo-transactions";
import {
  createTransaction,
  editTransaction,
  fetchDashboardTransactions,
  fetchTransactionPage,
  removeTransaction,
  type TransactionCursor,
} from "@/services/transactions";
import {
  EMPTY_FILTERS,
  type FinanceTransaction,
  type TransactionDraft,
  type TransactionFilters,
} from "@/types/finance";
import { matchesFilters } from "@/utils/finance";

const DEMO_PAGE_SIZE = 8;

type TransactionsContextValue = {
  transactions: FinanceTransaction[];
  dashboardTransactions: FinanceTransaction[];
  filters: TransactionFilters;
  loading: boolean;
  refreshing: boolean;
  saving: boolean;
  hasMore: boolean;
  error: string | null;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  addTransaction: (draft: TransactionDraft) => Promise<void>;
  updateTransaction: (id: string, draft: TransactionDraft) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  findTransaction: (id: string) => FinanceTransaction | undefined;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [sourceTransactions, setSourceTransactions] = useState<FinanceTransaction[]>([]);
  const [dashboardTransactions, setDashboardTransactions] = useState<FinanceTransaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [visibleDemoCount, setVisibleDemoCount] = useState(DEMO_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [remoteHasMore, setRemoteHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<TransactionCursor>(null);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadRemote = useCallback(
    async (reset: boolean) => {
      if (!user || user.isDemo) return;
      setError(null);
      if (reset) setLoading(true);

      try {
        const page = await fetchTransactionPage(
          user.uid,
          filtersRef.current,
          reset ? null : cursorRef.current,
        );
        cursorRef.current = page.cursor;
        setRemoteHasMore(page.hasMore);
        setSourceTransactions((current) => (reset ? page.items : [...current, ...page.items]));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar as transações.",
        );
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const loadDashboard = useCallback(async () => {
    if (!user || user.isDemo) return;
    try {
      setDashboardTransactions(await fetchDashboardTransactions(user.uid));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Não foi possível atualizar o dashboard.",
      );
    }
  }, [user]);

  const userKey = user ? `${user.uid}:${user.isDemo ? "demo" : "firebase"}` : "signed-out";

  useEffect(() => {
    if (!user) {
      setSourceTransactions([]);
      setDashboardTransactions([]);
      return;
    }

    if (user.isDemo) {
      setSourceTransactions(DEMO_TRANSACTIONS);
      setDashboardTransactions(DEMO_TRANSACTIONS);
      setVisibleDemoCount(DEMO_PAGE_SIZE);
      setLoading(false);
      return;
    }

    void loadDashboard();
  }, [loadDashboard, user, userKey]);

  useEffect(() => {
    if (!user || user.isDemo) return;
    cursorRef.current = null;
    void loadRemote(true);
  }, [
    filters.category,
    filters.endDate,
    filters.startDate,
    filters.type,
    loadRemote,
    user,
    userKey,
  ]);

  useEffect(() => {
    if (user?.isDemo) setVisibleDemoCount(DEMO_PAGE_SIZE);
  }, [filters, user?.isDemo]);

  const filteredTransactions = useMemo(
    () => sourceTransactions.filter((transaction) => matchesFilters(transaction, filters)),
    [filters, sourceTransactions],
  );

  const transactions = user?.isDemo
    ? filteredTransactions.slice(0, visibleDemoCount)
    : filteredTransactions;
  const hasMore = user?.isDemo ? visibleDemoCount < filteredTransactions.length : remoteHasMore;

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    if (user?.isDemo) {
      setVisibleDemoCount((count) => count + DEMO_PAGE_SIZE);
      return;
    }
    await loadRemote(false);
  }, [hasMore, loadRemote, loading, user?.isDemo]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    setError(null);
    try {
      if (user.isDemo) {
        setVisibleDemoCount(DEMO_PAGE_SIZE);
      } else {
        cursorRef.current = null;
        await Promise.all([loadRemote(true), loadDashboard()]);
      }
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboard, loadRemote, user]);

  const reloadAfterMutation = useCallback(async () => {
    if (!user || user.isDemo) return;
    cursorRef.current = null;
    await Promise.all([loadRemote(true), loadDashboard()]);
  }, [loadDashboard, loadRemote, user]);

  const addTransaction = useCallback(
    async (draft: TransactionDraft) => {
      if (!user) return;
      setSaving(true);
      try {
        if (user.isDemo) {
          const transaction: FinanceTransaction = {
            id: `demo-${Date.now()}`,
            description: draft.description.trim(),
            amount: draft.amount,
            type: draft.type,
            category: draft.category,
            date: draft.date,
            notes: draft.notes,
            receipt: draft.receiptAsset
              ? { ...draft.receiptAsset, url: draft.receiptAsset.uri }
              : draft.existingReceipt,
          };
          setSourceTransactions((current) => [transaction, ...current]);
          setDashboardTransactions((current) => [transaction, ...current]);
        } else {
          await createTransaction(user.uid, draft);
          await reloadAfterMutation();
        }
      } finally {
        setSaving(false);
      }
    },
    [reloadAfterMutation, user],
  );

  const updateTransaction = useCallback(
    async (id: string, draft: TransactionDraft) => {
      if (!user) return;
      setSaving(true);
      try {
        if (user.isDemo) {
          const update = (current: FinanceTransaction[]) =>
            current.map((transaction) =>
              transaction.id === id
                ? {
                    ...transaction,
                    ...draft,
                    receipt: draft.receiptAsset
                      ? { ...draft.receiptAsset, url: draft.receiptAsset.uri }
                      : draft.existingReceipt,
                  }
                : transaction,
            );
          setSourceTransactions(update);
          setDashboardTransactions(update);
        } else {
          await editTransaction(user.uid, id, draft);
          await reloadAfterMutation();
        }
      } finally {
        setSaving(false);
      }
    },
    [reloadAfterMutation, user],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) return;
      setSaving(true);
      try {
        if (user.isDemo) {
          const remove = (current: FinanceTransaction[]) =>
            current.filter((transaction) => transaction.id !== id);
          setSourceTransactions(remove);
          setDashboardTransactions(remove);
        } else {
          await removeTransaction(user.uid, id);
          await reloadAfterMutation();
        }
      } finally {
        setSaving(false);
      }
    },
    [reloadAfterMutation, user],
  );

  const findTransaction = useCallback(
    (id: string) =>
      dashboardTransactions.find((transaction) => transaction.id === id) ??
      sourceTransactions.find((transaction) => transaction.id === id),
    [dashboardTransactions, sourceTransactions],
  );

  const value = useMemo(
    () => ({
      transactions,
      dashboardTransactions,
      filters,
      loading,
      refreshing,
      saving,
      hasMore,
      error,
      setFilters,
      clearFilters: () => setFilters(EMPTY_FILTERS),
      loadMore,
      refresh,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      findTransaction,
    }),
    [
      addTransaction,
      dashboardTransactions,
      deleteTransaction,
      error,
      filters,
      findTransaction,
      hasMore,
      loadMore,
      loading,
      refresh,
      refreshing,
      saving,
      transactions,
      updateTransaction,
    ],
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions deve ser usado dentro de TransactionsProvider.");
  }
  return context;
}
