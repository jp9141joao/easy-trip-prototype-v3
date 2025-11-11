import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HomeStyles } from "../../styles/home";
import type { Theme } from "../../theme";

type HeaderProps = {
  theme: Theme;
  styles: HomeStyles;
  onToggleTheme: () => void;
  isDark: boolean;
};

export const Header = ({ theme, styles, onToggleTheme, isDark }: HeaderProps) => {
  const topInset = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filters: Record<string, string[]> = {
    Ordenar: ["Melhor avaliados", "Menor preço", "Mais próximos"],
    Quando: ["Qualquer data", "Esta semana", "Este mês"],
    "Tipo de hospedagem": ["Hotel", "Casa", "Vila"],
    "Adicionar hóspede": ["1 hóspede", "2 hóspedes", "3+ hóspedes"],
  };

  return (
    <View style={{ backgroundColor: theme.bg }}>
      <View style={[styles.headerLightWrap, { paddingTop: topInset + 8 }]}>
        <View style={styles.headerLightTop}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoStar}>✦</Text>
            </View>
            <Text style={styles.brandLight}>EasyTrip</Text>
          </View>
          <Pressable style={styles.bellBtn} hitSlop={8} onPress={onToggleTheme}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={18} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.searchPill}>
          <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Destinos, passeios, hotéis..."
              placeholderTextColor={theme.textMuted}
              returnKeyType="search"
              onSubmitEditing={() => console.log("buscar:", query)}
              style={{ color: theme.text, fontWeight: "700", padding: 0 }}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsCarouselScroll}
          contentContainerStyle={styles.chipsCarousel}
        >
          {Object.keys(filters).map((label) => (
            <View key={label} style={styles.chipWrap}>
              <Pressable
                style={styles.lightChip}
                onPress={() => setOpen(open === label ? null : label)}
              >
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "600" }}>{label}</Text>
                <Ionicons name="chevron-down" size={14} color={theme.text} />
              </Pressable>

              {open === label && (
                <View style={styles.dropdown}>
                  {filters[label].map((option) => (
                    <Pressable key={option} style={styles.dropdownItem} onPress={() => setOpen(null)}>
                      <Text style={{ color: theme.text }}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
