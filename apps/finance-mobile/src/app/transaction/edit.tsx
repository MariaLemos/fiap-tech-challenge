import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { TransactionFormScreen } from "@/components/transaction-form-screen";
import { useTransactions } from "@/context/transactions-context";
import { palette, spacing } from "@/theme/tokens";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findTransaction } = useTransactions();
  const transaction = findTransaction(id);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Transação não encontrada</Text>
        <Text style={styles.text}>Volte para a lista e tente novamente.</Text>
      </View>
    );
  }

  return <TransactionFormScreen transaction={transaction} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: { color: palette.text, fontSize: 19, fontWeight: "800" },
  text: { color: palette.textMuted, fontSize: 13 },
});
