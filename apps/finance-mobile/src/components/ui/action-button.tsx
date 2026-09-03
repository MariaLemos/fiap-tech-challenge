import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from "react-native";

import { palette, radii, spacing } from "@/theme/tokens";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type ActionButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  icon?: IconName;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  style?: ViewStyle;
};

export function ActionButton({
  title,
  icon,
  loading = false,
  variant = "primary",
  disabled,
  style,
  ...props
}: ActionButtonProps) {
  const contentColor =
    variant === "primary"
      ? palette.primaryInk
      : variant === "danger"
        ? palette.expense
        : palette.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {icon && <MaterialCommunityIcons color={contentColor} name={icon} size={20} />}
          <Text style={[styles.label, { color: contentColor }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  primary: { backgroundColor: palette.primary },
  secondary: {
    backgroundColor: palette.surfaceRaised,
    borderWidth: 1,
    borderColor: palette.border,
  },
  ghost: { backgroundColor: "transparent" },
  danger: {
    backgroundColor: "rgba(255, 122, 134, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 122, 134, 0.35)",
  },
  label: { fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
});
