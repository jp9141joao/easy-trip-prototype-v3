import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ACCENT } from "../../constants/colors";
import type { UpcomingItem } from "../../types/content";
import type { HomeStyles } from "../../styles/home";

type UpcomingCardProps = {
  item: UpcomingItem;
  styles: HomeStyles;
};

export const UpcomingCard = ({ item, styles }: UpcomingCardProps) => (
  <Pressable style={[styles.upcCard, styles.shadow]}>
    <View style={styles.upcIconPill}>
      <Ionicons name={item.icon} size={18} color={ACCENT} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.textMuted, { fontWeight: "700" }]}>{item.dateLabel}</Text>
      <Text numberOfLines={1} style={[styles.text, { fontWeight: "800", fontSize: 16 }]}>
        {item.title}
      </Text>
    </View>
  </Pressable>
);
