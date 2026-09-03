import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/screen-header";
import { ActionButton } from "@/components/ui/action-button";
import { useAuth } from "@/context/auth-context";
import { palette, radii, spacing } from "@/theme/tokens";

const integrations = [
  { icon: "shield-account-outline" as const, label: "Autenticação", detail: "Firebase Auth" },
  { icon: "database-outline" as const, label: "Transações", detail: "Cloud Firestore" },
  { icon: "cloud-upload-outline" as const, label: "Anexos", detail: "Firebase Storage" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, firebaseConfigured, logout } = useAuth();
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="CONTA"
          title="Seu perfil"
          subtitle="Dados da sessão e status das integrações."
        />

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || "NX"}</Text>
          </View>
          <View style={styles.profileCopy}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user?.name}</Text>
              {user?.isDemo && (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoText}>DEMO</Text>
                </View>
              )}
            </View>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.eyebrow}>INFRAESTRUTURA</Text>
              <Text style={styles.sectionTitle}>Integrações do app</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                firebaseConfigured ? styles.onlineBadge : styles.pendingBadge,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: firebaseConfigured ? palette.income : palette.warning },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: firebaseConfigured ? palette.income : palette.warning },
                ]}
              >
                {firebaseConfigured ? "CONFIGURADO" : "PENDENTE"}
              </Text>
            </View>
          </View>
          <View style={styles.integrationCard}>
            {integrations.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.integrationRow,
                  index < integrations.length - 1 && styles.integrationBorder,
                ]}
              >
                <View style={styles.integrationIcon}>
                  <MaterialCommunityIcons color={palette.primary} name={item.icon} size={22} />
                </View>
                <View style={styles.integrationCopy}>
                  <Text style={styles.integrationLabel}>{item.label}</Text>
                  <Text style={styles.integrationDetail}>{item.detail}</Text>
                </View>
                <MaterialCommunityIcons
                  color={firebaseConfigured ? palette.income : palette.textSubtle}
                  name={firebaseConfigured ? "check-circle" : "circle-outline"}
                  size={20}
                />
              </View>
            ))}
          </View>
          {!firebaseConfigured && (
            <Text style={styles.helperText}>
              Preencha as variáveis do arquivo .env para ativar o backend. O modo demonstração
              continua disponível sem credenciais.
            </Text>
          )}
        </View>

        <View style={styles.securityCard}>
          <View style={styles.securityIcon}>
            <MaterialCommunityIcons color={palette.info} name="lock-check-outline" size={25} />
          </View>
          <View style={styles.securityCopy}>
            <Text style={styles.securityTitle}>Dados isolados por usuário</Text>
            <Text style={styles.securityText}>
              As regras incluídas no projeto restringem transações e recibos ao proprietário
              autenticado.
            </Text>
          </View>
        </View>

        <ActionButton icon="logout" onPress={handleLogout} title="Sair da conta" variant="danger" />
        <Text style={styles.version}>Nexo Finanças · versão 1.0.0</Text>
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
  profileCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: palette.primaryInk, fontSize: 20, fontWeight: "900" },
  profileCopy: { flex: 1, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { color: palette.text, fontSize: 20, fontWeight: "800" },
  email: { color: palette.textMuted, fontSize: 13 },
  demoBadge: {
    backgroundColor: "rgba(255, 200, 87, 0.12)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  demoText: { color: palette.warning, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  section: { gap: spacing.lg },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: "800" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  onlineBadge: { backgroundColor: "rgba(92, 225, 185, 0.10)" },
  pendingBadge: { backgroundColor: "rgba(255, 200, 87, 0.10)" },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  integrationCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  integrationBorder: { borderBottomWidth: 1, borderBottomColor: palette.border },
  integrationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(92, 225, 185, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  integrationCopy: { flex: 1, gap: 3 },
  integrationLabel: { color: palette.text, fontSize: 14, fontWeight: "700" },
  integrationDetail: { color: palette.textMuted, fontSize: 11 },
  helperText: { color: palette.textMuted, fontSize: 12, lineHeight: 19 },
  securityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(124, 145, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 145, 255, 0.22)",
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(124, 145, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  securityCopy: { flex: 1, gap: 5 },
  securityTitle: { color: palette.text, fontSize: 14, fontWeight: "800" },
  securityText: { color: palette.textMuted, fontSize: 12, lineHeight: 18 },
  version: { color: palette.textSubtle, fontSize: 10, textAlign: "center" },
});
