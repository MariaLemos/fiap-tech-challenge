import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark } from "@/components/brand-mark";
import { ActionButton } from "@/components/ui/action-button";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/context/auth-context";
import { palette, radii, spacing } from "@/theme/tokens";

export default function LoginScreen() {
  const router = useRouter();
  const { user, login, register, enterDemo, firebaseConfigured } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/(tabs)/dashboard");
  }, [router, user]);

  async function handleSubmit() {
    setError("");
    if (mode === "register" && name.trim().length < 2) {
      setError("Digite seu nome.");
      return;
    }
    if (!email.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível continuar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemo() {
    setSubmitting(true);
    await enterDemo();
    setSubmitting(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.decorations}>
            <View style={[styles.orbit, styles.orbitLarge]} />
            <View style={[styles.orbit, styles.orbitSmall]} />
            <View style={styles.glow} />
          </View>

          <View style={styles.hero}>
            <BrandMark />
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>SEU DINHEIRO, COM CLAREZA</Text>
              <Text style={styles.title}>Decisões melhores começam por aqui.</Text>
              <Text style={styles.subtitle}>Organize entradas, gastos e metas em um só lugar.</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.modeRow}>
              {(["login", "register"] as const).map((item) => (
                <Text
                  accessibilityRole="button"
                  key={item}
                  onPress={() => {
                    setMode(item);
                    setError("");
                  }}
                  style={[styles.mode, mode === item && styles.modeActive]}
                >
                  {item === "login" ? "Entrar" : "Criar conta"}
                </Text>
              ))}
            </View>

            <View style={styles.fields}>
              {mode === "register" && (
                <FormField
                  autoCapitalize="words"
                  icon="account-outline"
                  label="Nome"
                  onChangeText={setName}
                  placeholder="Como devemos chamar você?"
                  value={name}
                />
              )}
              <FormField
                autoCapitalize="none"
                autoComplete="email"
                icon="email-outline"
                keyboardType="email-address"
                label="E-mail"
                onChangeText={setEmail}
                placeholder="voce@email.com"
                value={email}
              />
              <FormField
                autoCapitalize="none"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                icon="lock-outline"
                label="Senha"
                onChangeText={setPassword}
                placeholder="Mínimo de 6 caracteres"
                secureTextEntry
                value={password}
              />
              {Boolean(error) && (
                <View style={styles.errorBanner}>
                  <MaterialCommunityIcons
                    color={palette.expense}
                    name="alert-circle-outline"
                    size={18}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>

            <ActionButton
              disabled={!firebaseConfigured}
              loading={submitting}
              onPress={handleSubmit}
              title={mode === "login" ? "Acessar minha conta" : "Criar minha conta"}
            />

            {!firebaseConfigured && (
              <View style={styles.firebaseNote}>
                <MaterialCommunityIcons color={palette.warning} name="firebase" size={18} />
                <Text style={styles.firebaseNoteText}>
                  Firebase ainda não configurado. O acesso real será liberado após preencher o .env.
                </Text>
              </View>
            )}

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OU EXPERIMENTE AGORA</Text>
              <View style={styles.divider} />
            </View>
            <ActionButton
              icon="play-circle-outline"
              onPress={handleDemo}
              title="Entrar no modo demonstração"
              variant="secondary"
            />
          </View>

          <Text style={styles.footer}>Ambiente acadêmico · Tech Challenge Fase 03</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: palette.background },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xxl,
    alignSelf: "center",
    width: "100%",
    maxWidth: 520,
  },
  decorations: { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" },
  orbit: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(92, 225, 185, 0.10)",
    borderRadius: 999,
  },
  orbitLarge: { width: 420, height: 420, top: -210, right: -170 },
  orbitSmall: { width: 220, height: 220, top: -70, right: -45 },
  glow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    top: -35,
    right: 0,
    backgroundColor: "rgba(92, 225, 185, 0.08)",
  },
  hero: { gap: spacing.xxxl },
  heroCopy: { gap: spacing.md },
  eyebrow: { color: palette.primary, fontSize: 11, fontWeight: "800", letterSpacing: 1.8 },
  title: {
    color: palette.text,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "800",
    letterSpacing: -1.4,
    maxWidth: 430,
  },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 23 },
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  modeRow: {
    flexDirection: "row",
    backgroundColor: palette.backgroundSoft,
    borderRadius: radii.md,
    padding: 4,
  },
  mode: {
    flex: 1,
    textAlign: "center",
    color: palette.textMuted,
    paddingVertical: 11,
    borderRadius: 11,
    fontSize: 14,
    fontWeight: "700",
    overflow: "hidden",
  },
  modeActive: { color: palette.text, backgroundColor: palette.surfaceRaised },
  fields: { gap: spacing.lg },
  errorBanner: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    backgroundColor: "rgba(255, 122, 134, 0.09)",
    borderRadius: radii.sm,
    padding: spacing.md,
  },
  errorText: { flex: 1, color: palette.expense, fontSize: 12, lineHeight: 18 },
  firebaseNote: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  firebaseNoteText: { flex: 1, color: palette.textMuted, fontSize: 11, lineHeight: 17 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  divider: { flex: 1, height: 1, backgroundColor: palette.border },
  dividerText: { color: palette.textSubtle, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  footer: { color: palette.textSubtle, fontSize: 11, textAlign: "center" },
});
