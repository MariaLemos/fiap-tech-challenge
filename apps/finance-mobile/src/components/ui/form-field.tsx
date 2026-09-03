import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { palette, radii, spacing } from "@/theme/tokens";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type FormFieldProps = TextInputProps & {
  label: string;
  icon?: IconName;
  error?: string;
  containerStyle?: ViewStyle;
};

export function FormField({
  label,
  icon,
  error,
  containerStyle,
  multiline,
  ...props
}: FormFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputShell, multiline && styles.multilineShell, error && styles.inputError]}
      >
        {icon && <MaterialCommunityIcons color={palette.textMuted} name={icon} size={20} />}
        <TextInput
          placeholderTextColor={palette.textSubtle}
          selectionColor={palette.primary}
          style={[styles.input, multiline && styles.multilineInput]}
          multiline={multiline}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { color: palette.textMuted, fontSize: 13, fontWeight: "700" },
  inputShell: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.backgroundSoft,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  multilineShell: { minHeight: 104, alignItems: "flex-start", paddingTop: spacing.lg },
  input: { flex: 1, color: palette.text, fontSize: 16, paddingVertical: 0 },
  multilineInput: { minHeight: 72, textAlignVertical: "top" },
  inputError: { borderColor: palette.expense },
  error: { color: palette.expense, fontSize: 12, fontWeight: "600" },
});
