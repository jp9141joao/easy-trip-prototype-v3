import { Pressable, Text, View } from "react-native";

import { ACCENT } from "../../constants/colors";
import type { HomeStyles } from "../../styles/home";

type SectionHeaderProps = {
  title: string;
  action?: { label: string; onPress: () => void };
  styles: HomeStyles;
};

export const SectionHeader = ({ title, action, styles }: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.h2}>{title}</Text>
    {action && (
      <Pressable onPress={action.onPress} hitSlop={6}>
        <Text style={[styles.textMuted, { fontWeight: "700", color: ACCENT }]}>
          {action.label}
        </Text>
      </Pressable>
    )}
  </View>
);
