import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/screen-header";
import { TransactionRow } from "@/components/transaction-row";
import { FormField } from "@/components/ui/form-field";
import { useTransactions } from "@/context/transactions-context";
import { palette, radii, spacing } from "@/theme/tokens";
import { TRANSACTION_CATEGORIES, type TransactionFilters } from "@/types/finance";

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function TransactionsScreen() {
  const router = useRouter();
  const {
    transactions,
    filters,
    setFilters,
    clearFilters,
    loading,
    refreshing,
    refresh,
    loadMore,
    hasMore,
    error,
  } = useTransactions();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = <Key extends keyof TransactionFilters>(
    key: Key,
    value: TransactionFilters[Key],
  ) => setFilters({ ...filters, [key]: value });

  const activeFilterCount = [
    filters.category !== "all",
    filters.type !== "all",
    Boolean(filters.startDate),
    Boolean(filters.endDate),
  ].filter(Boolean).length;

  const header = (
    <View style={styles.headerContent}>
      <ScreenHeader
        eyebrow="MOVIMENTAÇÕES"
        title="Transações"
        subtitle="Pesquise, filtre e toque em um item para editar."
      />

      <FormField
        icon="magnify"
        label="Buscar"
        onChangeText={(value) => updateFilter("search", value)}
        placeholder="Descrição ou categoria"
        returnKeyType="search"
        value={filters.search}
      />

      <View style={styles.filterHeading}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowAdvanced((value) => !value)}
          style={styles.filterToggle}
        >
          <MaterialCommunityIcons color={palette.primary} name="tune-variant" size={19} />
          <Text style={styles.filterToggleText}>Filtros avançados</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          )}
          <MaterialCommunityIcons
            color={palette.textMuted}
            name={showAdvanced ? "chevron-up" : "chevron-down"}
            size={20}
          />
        </Pressable>
        {activeFilterCount > 0 && (
          <Text onPress={clearFilters} style={styles.clearText}>
            Limpar
          </Text>
        )}
      </View>

      {showAdvanced && (
        <View style={styles.advancedCard}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>TIPO</Text>
            <View style={styles.chipWrap}>
              <FilterChip
                label="Todos"
                active={filters.type === "all"}
                onPress={() => updateFilter("type", "all")}
              />
              <FilterChip
                label="Entradas"
                active={filters.type === "income"}
                onPress={() => updateFilter("type", "income")}
              />
              <FilterChip
                label="Saídas"
                active={filters.type === "expense"}
                onPress={() => updateFilter("type", "expense")}
              />
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>CATEGORIA</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalChips}
            >
              <FilterChip
                label="Todas"
                active={filters.category === "all"}
                onPress={() => updateFilter("category", "all")}
              />
              {TRANSACTION_CATEGORIES.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  active={filters.category === category}
                  onPress={() => updateFilter("category", category)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.dateRow}>
            <FormField
              autoCapitalize="none"
              containerStyle={styles.dateField}
              icon="calendar-start"
              label="Data inicial"
              onChangeText={(value) => updateFilter("startDate", value)}
              placeholder="AAAA-MM-DD"
              value={filters.startDate}
            />
            <FormField
              autoCapitalize="none"
              containerStyle={styles.dateField}
              icon="calendar-end"
              label="Data final"
              onChangeText={(value) => updateFilter("endDate", value)}
              placeholder="AAAA-MM-DD"
              value={filters.endDate}
            />
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <MaterialCommunityIcons color={palette.expense} name="cloud-alert-outline" size={20} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.resultRow}>
        <Text style={styles.resultTitle}>RESULTADOS</Text>
        <Text style={styles.resultCount}>{transactions.length} exibidas</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={transactions}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={palette.primary} size="large" />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons
                  color={palette.primary}
                  name="text-box-search-outline"
                  size={30}
                />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
              <Text style={styles.emptyText}>
                Ajuste os filtros ou adicione uma nova movimentação.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator color={palette.primary} style={styles.footerLoader} />
          ) : (
            <View style={styles.footerSpace} />
          )
        }
        ListHeaderComponent={header}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        onRefresh={refresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <TransactionRow
            onPress={() => router.push({ pathname: "/transaction/edit", params: { id: item.id } })}
            transaction={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        accessibilityLabel="Adicionar transação"
        accessibilityRole="button"
        onPress={() => router.push("/transaction/new")}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <MaterialCommunityIcons color={palette.primaryInk} name="plus" size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  listContent: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  headerContent: { gap: spacing.xl, marginBottom: spacing.lg },
  filterHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  filterToggle: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  filterToggleText: { color: palette.text, fontSize: 14, fontWeight: "800" },
  filterCount: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterCountText: { color: palette.primaryInk, fontSize: 10, fontWeight: "900" },
  clearText: { color: palette.expense, fontSize: 12, fontWeight: "700", padding: spacing.sm },
  advancedCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  filterGroup: { gap: spacing.md },
  filterLabel: { color: palette.textSubtle, fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  horizontalChips: { gap: spacing.sm },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.backgroundSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
  },
  chipActive: { borderColor: palette.primary, backgroundColor: "rgba(92, 225, 185, 0.12)" },
  chipText: { color: palette.textMuted, fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: palette.primary },
  dateRow: { flexDirection: "row", gap: spacing.md },
  dateField: { flex: 1 },
  errorBanner: {
    backgroundColor: "rgba(255, 122, 134, 0.09)",
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  errorText: { flex: 1, color: palette.expense, fontSize: 12, lineHeight: 18 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  resultTitle: { color: palette.textSubtle, fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  resultCount: { color: palette.textMuted, fontSize: 11 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 70,
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: "rgba(92, 225, 185, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: "800", textAlign: "center" },
  emptyText: { color: palette.textMuted, fontSize: 13, lineHeight: 20, textAlign: "center" },
  footerLoader: { paddingVertical: spacing.xxl },
  footerSpace: { height: 112 },
  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: 92,
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 7px 12px rgba(0, 0, 0, 0.35)",
    elevation: 8,
  },
  fabPressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
});
