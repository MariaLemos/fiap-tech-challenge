import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { palette, spacing } from "@/theme/tokens";

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: React.ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, back, action }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        {back ? (
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons color={palette.text} name="arrow-left" size={23} />
          </Pressable>
        ) : (
          <BrandMark compact />
        )}
        {action}
      </View>
      <View style={styles.titleBlock}>
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxl },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { gap: spacing.xs },
  eyebrow: { color: palette.primary, fontSize: 11, fontWeight: "800", letterSpacing: 1.8 },
  title: {
    color: palette.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: { color: palette.textMuted, fontSize: 14, lineHeight: 21 },
});
