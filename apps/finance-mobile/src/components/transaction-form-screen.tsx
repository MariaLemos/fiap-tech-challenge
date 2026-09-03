import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as DocumentPicker from "expo-document-picker";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/screen-header";
import { ActionButton } from "@/components/ui/action-button";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/context/auth-context";
import { useTransactions } from "@/context/transactions-context";
import { categoryColors, palette, radii, spacing } from "@/theme/tokens";
import {
  TRANSACTION_CATEGORIES,
  type FinanceTransaction,
  type LocalReceipt,
  type TransactionCategory,
  type TransactionDraft,
  type TransactionType,
} from "@/types/finance";
import { parseCurrencyInput, toIsoDate, validateIsoDate } from "@/utils/finance";

type Errors = Partial<Record<"description" | "amount" | "date" | "category", string>>;

type TransactionFormScreenProps = {
  transaction?: FinanceTransaction;
};

export function TransactionFormScreen({ transaction }: TransactionFormScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addTransaction, updateTransaction, deleteTransaction, saving } = useTransactions();
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount).replace(".", ",") : "",
  );
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [category, setCategory] = useState<TransactionCategory>(
    transaction?.category ?? "Alimentação",
  );
  const [date, setDate] = useState(transaction?.date ?? toIsoDate());
  const [notes, setNotes] = useState(transaction?.notes ?? "");
  const [receiptAsset, setReceiptAsset] = useState<LocalReceipt | null>(null);
  const [keepExistingReceipt, setKeepExistingReceipt] = useState(Boolean(transaction?.receipt));
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!transaction) return;
    setDescription(transaction.description);
    setAmount(String(transaction.amount).replace(".", ","));
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.date);
    setNotes(transaction.notes ?? "");
    setKeepExistingReceipt(Boolean(transaction.receipt));
  }, [transaction]);

  if (!user) return <Redirect href="/(auth)/login" />;

  function validate() {
    const nextErrors: Errors = {};
    const numericAmount = parseCurrencyInput(amount);
    if (description.trim().length < 3) nextErrors.description = "Use pelo menos 3 caracteres.";
    if (!Number.isFinite(numericAmount) || numericAmount <= 0)
      nextErrors.amount = "Digite um valor maior que zero.";
    if (!validateIsoDate(date)) nextErrors.date = "Use uma data válida no formato AAAA-MM-DD.";
    if (!category) nextErrors.category = "Selecione uma categoria.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function pickReceipt() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.size && asset.size > 10 * 1024 * 1024) {
      Alert.alert("Arquivo muito grande", "Escolha um recibo de até 10 MB.");
      return;
    }
    setReceiptAsset({
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType,
      size: asset.size,
    });
    setKeepExistingReceipt(false);
  }

  async function handleSave() {
    if (!validate()) return;
    const draft: TransactionDraft = {
      description,
      amount: parseCurrencyInput(amount),
      type,
      category,
      date,
      notes,
      receiptAsset,
      existingReceipt: keepExistingReceipt ? transaction?.receipt : null,
    };

    try {
      if (transaction) await updateTransaction(transaction.id, draft);
      else await addTransaction(draft);
      router.back();
    } catch (saveError) {
      Alert.alert(
        "Não foi possível salvar",
        saveError instanceof Error ? saveError.message : "Tente novamente em instantes.",
      );
    }
  }

  function handleDelete() {
    if (!transaction) return;
    Alert.alert("Excluir transação?", "Esta ação remove a movimentação da sua lista.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTransaction(transaction.id);
            router.replace("/(tabs)/transactions");
          } catch (deleteError) {
            Alert.alert(
              "Não foi possível excluir",
              deleteError instanceof Error ? deleteError.message : "Tente novamente.",
            );
          }
        },
      },
    ]);
  }

  const selectedReceiptName =
    receiptAsset?.name ?? (keepExistingReceipt ? transaction?.receipt?.name : null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            back
            eyebrow={transaction ? "EDIÇÃO" : "NOVA MOVIMENTAÇÃO"}
            title={transaction ? "Editar transação" : "Adicionar transação"}
            subtitle="Preencha os dados e, se quiser, anexe o comprovante."
          />

          <View style={styles.typeSelector}>
            {(
              [
                ["expense", "Saída", "arrow-up-right", palette.expense],
                ["income", "Entrada", "arrow-down-left", palette.income],
              ] as const
            ).map(([value, label, icon, color]) => (
              <Pressable
                key={value}
                onPress={() => setType(value)}
                style={[
                  styles.typeOption,
                  type === value && { backgroundColor: `${color}18`, borderColor: color },
                ]}
              >
                <MaterialCommunityIcons
                  color={type === value ? color : palette.textMuted}
                  name={icon}
                  size={21}
                />
                <Text style={[styles.typeText, type === value && { color }]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.formCard}>
            <FormField
              error={errors.description}
              icon="text-short"
              label="Descrição"
              onChangeText={setDescription}
              placeholder="Ex.: Supermercado"
              value={description}
            />
            <View style={styles.twoColumns}>
              <FormField
                containerStyle={styles.column}
                error={errors.amount}
                icon="currency-brl"
                keyboardType="decimal-pad"
                label="Valor"
                onChangeText={setAmount}
                placeholder="0,00"
                value={amount}
              />
              <FormField
                autoCapitalize="none"
                containerStyle={styles.column}
                error={errors.date}
                icon="calendar-outline"
                label="Data"
                onChangeText={setDate}
                placeholder="AAAA-MM-DD"
                value={date}
              />
            </View>

            <View style={styles.categoryGroup}>
              <Text style={styles.fieldLabel}>Categoria</Text>
              <View style={styles.categoryGrid}>
                {TRANSACTION_CATEGORIES.map((item) => {
                  const selected = category === item;
                  const color = categoryColors[item];
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setCategory(item)}
                      style={[
                        styles.categoryChip,
                        selected && { backgroundColor: `${color}18`, borderColor: color },
                      ]}
                    >
                      <View style={[styles.categoryDot, { backgroundColor: color }]} />
                      <Text style={[styles.categoryText, selected && { color }]}>{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.category && <Text style={styles.validationText}>{errors.category}</Text>}
            </View>

            <FormField
              icon="note-text-outline"
              label="Observações (opcional)"
              multiline
              onChangeText={setNotes}
              placeholder="Inclua detalhes importantes"
              value={notes}
            />
          </View>

          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View style={styles.receiptIcon}>
                <MaterialCommunityIcons color={palette.info} name="paperclip" size={24} />
              </View>
              <View style={styles.receiptCopy}>
                <Text style={styles.receiptTitle}>Recibo ou comprovante</Text>
                <Text style={styles.receiptSubtitle}>Imagem ou PDF de até 10 MB</Text>
              </View>
            </View>
            {selectedReceiptName ? (
              <View style={styles.selectedFile}>
                <MaterialCommunityIcons
                  color={palette.primary}
                  name="file-check-outline"
                  size={21}
                />
                <Text numberOfLines={1} style={styles.selectedFileName}>
                  {selectedReceiptName}
                </Text>
                <Pressable
                  accessibilityLabel="Remover anexo"
                  onPress={() => {
                    setReceiptAsset(null);
                    setKeepExistingReceipt(false);
                  }}
                >
                  <MaterialCommunityIcons
                    color={palette.expense}
                    name="close-circle-outline"
                    size={22}
                  />
                </Pressable>
              </View>
            ) : (
              <ActionButton
                icon="cloud-upload-outline"
                onPress={pickReceipt}
                title="Selecionar arquivo"
                variant="secondary"
              />
            )}
          </View>

          <ActionButton
            icon="check"
            loading={saving}
            onPress={handleSave}
            title={transaction ? "Salvar alterações" : "Adicionar transação"}
          />
          {transaction && (
            <ActionButton
              icon="trash-can-outline"
              disabled={saving}
              onPress={handleDelete}
              title="Excluir transação"
              variant="danger"
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  typeSelector: { flexDirection: "row", gap: spacing.md },
  typeOption: {
    flex: 1,
    minHeight: 54,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  typeText: { color: palette.textMuted, fontSize: 14, fontWeight: "800" },
  formCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  twoColumns: { flexDirection: "row", gap: spacing.md },
  column: { flex: 1 },
  categoryGroup: { gap: spacing.md },
  fieldLabel: { color: palette.textMuted, fontSize: 13, fontWeight: "700" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.backgroundSoft,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryDot: { width: 7, height: 7, borderRadius: 4 },
  categoryText: { color: palette.textMuted, fontSize: 11, fontWeight: "700" },
  validationText: { color: palette.expense, fontSize: 12 },
  receiptCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  receiptHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  receiptIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(124, 145, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  receiptCopy: { flex: 1, gap: 3 },
  receiptTitle: { color: palette.text, fontSize: 14, fontWeight: "800" },
  receiptSubtitle: { color: palette.textMuted, fontSize: 11 },
  selectedFile: {
    minHeight: 50,
    borderRadius: radii.md,
    backgroundColor: palette.backgroundSoft,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  selectedFileName: { flex: 1, color: palette.text, fontSize: 12, fontWeight: "600" },
});
