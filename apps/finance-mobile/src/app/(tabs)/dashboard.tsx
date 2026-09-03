import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CashFlowChart, CategoryChart } from "@/components/dashboard-charts";
import { ScreenHeader } from "@/components/screen-header";
import { TransactionRow } from "@/components/transaction-row";
import { useAuth } from "@/context/auth-context";
import { useTransactions } from "@/context/transactions-context";
import { palette, radii, spacing } from "@/theme/tokens";
import { formatCurrency, transactionTotals } from "@/utils/finance";

type Period = "30d" | "90d" | "12m";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { dashboardTransactions } = useTransactions();
  const [period, setPeriod] = useState<Period>("90d");
  const [hideBalance, setHideBalance] = useState(false);
  const animations = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;

  const periodTransactions = useMemo(() => {
    const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
    const start = new Date();
    start.setDate(start.getDate() - days);
    return dashboardTransactions.filter(
      (transaction) => new Date(`${transaction.date}T12:00:00`) >= start,
    );
  }, [dashboardTransactions, period]);

  const totals = transactionTotals(periodTransactions);
  const savingsRate = totals.income > 0 ? (totals.balance / totals.income) * 100 : 0;
  const recent = dashboardTransactions.slice(0, 3);

  useEffect(() => {
    animations.forEach((animation) => animation.setValue(0));
    Animated.stagger(
      75,
      animations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [animations, period]);

  const animatedStyle = (index: number) => ({
    opacity: animations[index],
    transform: [
      { translateY: animations[index].interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
    ],
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow={`OLÁ, ${user?.name.split(" ")[0].toLocaleUpperCase("pt-BR")}`}
          title="Seu panorama financeiro"
          subtitle="Acompanhe o que entra, o que sai e o quanto você está avançando."
          action={
            user?.isDemo ? (
              <View style={styles.demoBadge}>
                <Text style={styles.demoBadgeText}>DEMO</Text>
              </View>
            ) : undefined
          }
        />

        <View style={styles.periodRow}>
          {(
            [
              ["30d", "30 dias"],
              ["90d", "90 dias"],
              ["12m", "12 meses"],
            ] as const
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => setPeriod(value)}
              style={[styles.periodChip, period === value && styles.periodChipActive]}
            >
              <Text style={[styles.periodText, period === value && styles.periodTextActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Animated.View style={[styles.balanceCard, animatedStyle(0)]}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>SALDO DO PERÍODO</Text>
              <Text style={styles.balanceValue}>{formatCurrency(totals.balance, hideBalance)}</Text>
            </View>
            <Pressable
              accessibilityLabel="Mostrar ou ocultar saldo"
              onPress={() => setHideBalance((value) => !value)}
              style={styles.eyeButton}
            >
              <MaterialCommunityIcons
                color={palette.primaryInk}
                name={hideBalance ? "eye-off-outline" : "eye-outline"}
                size={22}
              />
            </Pressable>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.flowRow}>
            <View style={styles.flowItem}>
              <MaterialCommunityIcons color={palette.income} name="arrow-down-left" size={20} />
              <View>
                <Text style={styles.flowLabel}>Entradas</Text>
                <Text style={styles.flowValue}>{formatCurrency(totals.income, hideBalance)}</Text>
              </View>
            </View>
            <View style={styles.flowItem}>
              <MaterialCommunityIcons color={palette.expense} name="arrow-up-right" size={20} />
              <View>
                <Text style={styles.flowLabel}>Saídas</Text>
                <Text style={styles.flowValue}>{formatCurrency(totals.expense, hideBalance)}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.insightsRow, animatedStyle(1)]}>
          <View style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: "rgba(92, 225, 185, 0.13)" }]}>
              <MaterialCommunityIcons color={palette.primary} name="piggy-bank-outline" size={22} />
            </View>
            <Text style={styles.insightValue}>{Math.round(savingsRate)}%</Text>
            <Text style={styles.insightLabel}>taxa de economia</Text>
          </View>
          <View style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: "rgba(124, 145, 255, 0.13)" }]}>
              <MaterialCommunityIcons color={palette.info} name="receipt-text-outline" size={22} />
            </View>
            <Text style={styles.insightValue}>{periodTransactions.length}</Text>
            <Text style={styles.insightLabel}>movimentações</Text>
          </View>
        </Animated.View>

        <Animated.View style={animatedStyle(2)}>
          <CashFlowChart transactions={dashboardTransactions} />
        </Animated.View>
        <Animated.View style={animatedStyle(3)}>
          <CategoryChart transactions={periodTransactions} />
        </Animated.View>

        <Animated.View style={[styles.recentSection, animatedStyle(4)]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>ATIVIDADE</Text>
              <Text style={styles.sectionTitle}>Movimentações recentes</Text>
            </View>
            <Text onPress={() => router.push("/(tabs)/transactions")} style={styles.seeAll}>
              Ver todas
            </Text>
          </View>
          <View style={styles.transactionsList}>
            {recent.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                onPress={() =>
                  router.push({ pathname: "/transaction/edit", params: { id: transaction.id } })
                }
                transaction={transaction}
              />
            ))}
            {!recent.length && (
              <Text style={styles.emptyText}>Sua primeira movimentação aparecerá aqui.</Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 110,
    gap: spacing.xl,
  },
  demoBadge: {
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 200, 87, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.35)",
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  demoBadgeText: { color: palette.warning, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  periodRow: { flexDirection: "row", gap: spacing.sm },
  periodChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  periodChipActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  periodText: { color: palette.textMuted, fontSize: 12, fontWeight: "700" },
  periodTextActive: { color: palette.primaryInk },
  balanceCard: {
    backgroundColor: palette.primary,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    gap: spacing.xl,
    overflow: "hidden",
  },
  balanceTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  balanceLabel: {
    color: "rgba(6, 38, 29, 0.65)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: spacing.sm,
  },
  balanceValue: { color: palette.primaryInk, fontSize: 35, fontWeight: "900", letterSpacing: -1.5 },
  eyeButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceDivider: { height: 1, backgroundColor: "rgba(6, 38, 29, 0.15)" },
  flowRow: { flexDirection: "row", gap: spacing.xl },
  flowItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flowLabel: { color: "rgba(6, 38, 29, 0.58)", fontSize: 11, fontWeight: "700" },
  flowValue: { color: palette.primaryInk, fontSize: 14, fontWeight: "900", marginTop: 2 },
  insightsRow: { flexDirection: "row", gap: spacing.md },
  insightCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: 5,
  },
  insightIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  insightValue: { color: palette.text, fontSize: 22, fontWeight: "900" },
  insightLabel: { color: palette.textMuted, fontSize: 11 },
  recentSection: { gap: spacing.lg },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  sectionEyebrow: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: "800" },
  seeAll: { color: palette.primary, fontSize: 12, fontWeight: "800", paddingVertical: spacing.sm },
  transactionsList: { gap: spacing.sm },
  emptyText: { color: palette.textMuted, fontSize: 13, paddingVertical: spacing.xl },
});
