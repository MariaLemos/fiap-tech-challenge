import { StyleSheet, Text, View } from "react-native";

import { categoryColors, palette, radii, spacing } from "@/theme/tokens";
import type { FinanceTransaction, TransactionCategory } from "@/types/finance";
import { formatCurrency } from "@/utils/finance";

type ChartProps = { transactions: FinanceTransaction[] };

function monthBuckets(transactions: FinanceTransaction[]) {
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthTransactions = transactions.filter((transaction) =>
      transaction.date.startsWith(key),
    );
    return {
      key,
      label: formatter.format(date).replace(".", ""),
      income: monthTransactions.reduce(
        (sum, transaction) => (transaction.type === "income" ? sum + transaction.amount : sum),
        0,
      ),
      expense: monthTransactions.reduce(
        (sum, transaction) => (transaction.type === "expense" ? sum + transaction.amount : sum),
        0,
      ),
    };
  });
}

export function CashFlowChart({ transactions }: ChartProps) {
  const buckets = monthBuckets(transactions);
  const max = Math.max(...buckets.flatMap((bucket) => [bucket.income, bucket.expense]), 1);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardEyebrow}>FLUXO DE CAIXA</Text>
          <Text style={styles.cardTitle}>Últimos 6 meses</Text>
        </View>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: palette.income }]} />
          <Text style={styles.legendText}>Entradas</Text>
          <View style={[styles.dot, { backgroundColor: palette.expense }]} />
          <Text style={styles.legendText}>Saídas</Text>
        </View>
      </View>
      <View style={styles.chart}>
        {buckets.map((bucket) => (
          <View key={bucket.key} style={styles.monthColumn}>
            <View style={styles.bars}>
              <View
                style={[
                  styles.bar,
                  styles.incomeBar,
                  { height: Math.max(4, (bucket.income / max) * 94) },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  styles.expenseBar,
                  { height: Math.max(4, (bucket.expense / max) * 94) },
                ]}
              />
            </View>
            <Text style={styles.monthLabel}>{bucket.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function CategoryChart({ transactions }: ChartProps) {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const totals = expenses.reduce<Partial<Record<TransactionCategory, number>>>(
    (result, transaction) => {
      result[transaction.category] = (result[transaction.category] ?? 0) + transaction.amount;
      return result;
    },
    {},
  );
  const ranked = Object.entries(totals)
    .map(([category, total]) => ({ category: category as TransactionCategory, total: total ?? 0 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);
  const max = ranked[0]?.total || 1;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardEyebrow}>ANÁLISE</Text>
          <Text style={styles.cardTitle}>Gastos por categoria</Text>
        </View>
      </View>
      <View style={styles.categoryList}>
        {ranked.length ? (
          ranked.map((item) => (
            <View key={item.category} style={styles.categoryItem}>
              <View style={styles.categoryTitleRow}>
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryValue}>{formatCurrency(item.total)}</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.max(7, (item.total / max) * 100)}%`,
                      backgroundColor: categoryColors[item.category],
                    },
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Adicione despesas para ver a distribuição.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  cardEyebrow: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 5,
  },
  cardTitle: { color: palette.text, fontSize: 18, fontWeight: "800" },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: 135,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  legendText: { color: palette.textMuted, fontSize: 9, marginRight: 4 },
  chart: {
    height: 126,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  monthColumn: { flex: 1, alignItems: "center", gap: spacing.sm },
  bars: { height: 96, flexDirection: "row", alignItems: "flex-end", gap: 3 },
  bar: { width: 8, borderRadius: 4 },
  incomeBar: { backgroundColor: palette.income },
  expenseBar: { backgroundColor: palette.expense, opacity: 0.88 },
  monthLabel: { color: palette.textMuted, fontSize: 10, textTransform: "capitalize" },
  categoryList: { gap: spacing.lg },
  categoryItem: { gap: spacing.sm },
  categoryTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryName: { color: palette.textMuted, fontSize: 13, fontWeight: "600" },
  categoryValue: { color: palette.text, fontSize: 12, fontWeight: "700" },
  track: {
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.backgroundSoft,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4 },
  empty: { color: palette.textMuted, fontSize: 13, lineHeight: 20 },
});
