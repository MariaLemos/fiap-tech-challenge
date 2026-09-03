import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, View } from "react-native";

import { palette, radii } from "@/theme/tokens";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <MaterialCommunityIcons
          color={palette.primaryInk}
          name="chart-timeline-variant-shimmer"
          size={compact ? 20 : 27}
        />
      </View>
      {!compact && (
        <View>
          <Text style={styles.name}>nexo</Text>
          <Text style={styles.caption}>FINANÇAS</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  mark: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.primary,
    transform: [{ rotate: "-4deg" }],
  },
  markCompact: { width: 38, height: 38, borderRadius: 12 },
  name: {
    color: palette.text,
    fontSize: 27,
    lineHeight: 29,
    fontWeight: "800",
    letterSpacing: -1,
  },
  caption: {
    color: palette.primary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2.8,
  },
});
