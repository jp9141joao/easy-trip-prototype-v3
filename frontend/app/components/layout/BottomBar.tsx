import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ACCENT } from "../../constants/colors";
import type { HomeStyles } from "../../styles/home";
import type { Theme } from "../../theme";

type BottomBarProps = {
  theme: Theme;
  styles: HomeStyles;
};

export const BottomBar = ({ theme, styles }: BottomBarProps) => {
  const items = [
    { key: "explore", label: "Início", icon: "home-outline", activeIcon: "home" },
    { key: "search", label: "Buscar", icon: "search-outline", activeIcon: "search" },
    { key: "trips", label: "Viagens", icon: "heart-outline", activeIcon: "heart" },
    { key: "review", label: "Avaliar", icon: "create-outline", activeIcon: "create" },
    { key: "account", label: "Conta", icon: "person-outline", activeIcon: "person" },
  ];
  const activeIndex = 0;

  return (
    <View style={styles.bottomBarWrap} pointerEvents="box-none">
      <View style={styles.bottomBar}>
        {items.map((item, index) => {
          const active = index === activeIndex;
          return (
            <Pressable key={item.key} style={styles.bottomItem}>
              <Ionicons
                name={(active ? item.activeIcon : item.icon) as any}
                size={22}
                color={active ? ACCENT : "#9CA3AF"}
              />
              <Text style={[styles.bottomLabel, { color: active ? theme.text : "#9CA3AF" }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
