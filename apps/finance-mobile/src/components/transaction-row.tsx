import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { categoryColors, palette, radii, spacing } from "@/theme/tokens";
import type { FinanceTransaction, TransactionCategory } from "@/types/finance";
import { formatCurrency, formatDate } from "@/utils/finance";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const categoryIcons: Record<TransactionCategory, IconName> = {
  Alimentação: "silverware-fork-knife",
  Educação: "school-outline",
  Investimentos: "chart-line",
  Lazer: "movie-open-outline",
  Moradia: "home-outline",
  Outros: "dots-horizontal-circle-outline",
  Salário: "briefcase-outline",
  Saúde: "heart-pulse",
  Transporte: "car-outline",
};

type TransactionRowProps = {
  transaction: FinanceTransaction;
  onPress?: () => void;
};

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const color = categoryColors[transaction.category];
  const sign = transaction.type === "income" ? "+" : "-";
  return (
    <Pressable
      accessibilityLabel={`Editar ${transaction.description}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconShell, { backgroundColor: `${color}1F` }]}>
        <MaterialCommunityIcons
          color={color}
          name={categoryIcons[transaction.category]}
          size={22}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleLine}>
          <Text numberOfLines={1} style={styles.title}>
            {transaction.description}
          </Text>
          <Text
            style={[styles.amount, transaction.type === "income" ? styles.income : styles.expense]}
          >
            {sign}
            {formatCurrency(transaction.amount)}
          </Text>
        </View>
        <View style={styles.metaLine}>
          <Text style={styles.meta}>
            {transaction.category} · {formatDate(transaction.date)}
          </Text>
          {transaction.receipt && (
            <MaterialCommunityIcons color={palette.textSubtle} name="paperclip" size={15} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 74,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.995 }] },
  iconShell: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: 7 },
  titleLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { flex: 1, color: palette.text, fontSize: 15, fontWeight: "700" },
  amount: { fontSize: 14, fontWeight: "800" },
  income: { color: palette.income },
  expense: { color: palette.text },
  metaLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { color: palette.textMuted, fontSize: 12 },
});
