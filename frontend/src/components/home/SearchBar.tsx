import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, Easing, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BRAND } from "@/theme";
import { hexOpacity } from "@/utils";
import { shadow } from "@/theme/shadow";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(-8)).current;

  const [type, setType] = useState<"todos" | "hotels" | "restaurants">("todos");
  const [price, setPrice] = useState<"$" | "$$" | "$$$" | null>(null);
  const [openNow, setOpenNow] = useState(false);

  const toggleDropdown = () => {
    if (open) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(slide, { toValue: -8, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
  };

  const applyFilters = () => {
    Alert.alert("Filtros aplicados", `Tipo: ${type}\nPreço: ${price ?? "qualquer"}\nAberto agora: ${openNow ? "sim" : "não"}`);
    toggleDropdown();
  };

  const clearFilters = () => { setType("todos"); setPrice(null); setOpenNow(false); };

  return (
    <View style={{ position: "relative" }}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#6b7280" style={{ marginRight: 8 }} />
        <TextInput value={value} onChangeText={setValue} placeholder="Buscar destinos, cidades..." placeholderTextColor="#9ca3af" style={styles.searchInput} returnKeyType="search" />
        <TouchableOpacity onPress={toggleDropdown} style={styles.filterPill}>
          <Text style={styles.filterPillText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {open && (
        <Animated.View style={[styles.dropdown, shadow(14), { opacity: fade, transform: [{ translateY: slide }] }]}>
          <Text style={styles.dropdownTitle}>Filtros</Text>

          <View style={styles.dropdownRow}>
            <Text style={styles.dropdownLabel}>Tipo</Text>
            <View style={styles.dropdownChips}>
              {(["todos", "hotels", "restaurants"] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.ddChip, t === type && { backgroundColor: hexOpacity(BRAND, 0.15), borderColor: BRAND }]}>
                  <Text style={[styles.ddChipText, t === type && { color: BRAND, fontWeight: "700" }]}>
                    {t === "todos" ? "Todos" : t === "hotels" ? "Hotéis" : "Restaurantes"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dropdownRow}>
            <Text style={styles.dropdownLabel}>Preço</Text>
            <View style={styles.dropdownChips}>
              {(["$", "$$", "$$$"] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPrice(prev => (prev === p ? null : p))}
                  style={[styles.ddChip, price === p && { backgroundColor: hexOpacity(BRAND, 0.15), borderColor: BRAND }]}>
                  <Text style={[styles.ddChipText, price === p && { color: BRAND, fontWeight: "700" }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={() => setOpenNow(v => !v)} style={[styles.rowBetween, { paddingVertical: 8 }]}>
            <Text style={styles.dropdownLabel}>Aberto agora</Text>
            <View style={{ height: 20, width: 36, borderRadius: 999, borderWidth: 1, borderColor: openNow ? BRAND : "#e5e7eb", backgroundColor: openNow ? hexOpacity(BRAND, 0.2) : "#fff", alignItems: openNow ? "flex-end" : "flex-start", padding: 2 }}>
              <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: openNow ? BRAND : "#9ca3af" }} />
            </View>
          </TouchableOpacity>

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <TouchableOpacity onPress={clearFilters} style={[styles.btnOutline, { borderColor: "#e5e7eb" }]}>
              <Text style={{ color: "#374151", fontWeight: "700" }}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters} style={styles.btnSolid}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 12, height: 48 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  filterPill: { height: 28, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: BRAND, alignItems: "center", justifyContent: "center", backgroundColor: hexOpacity(BRAND, 0.1), marginLeft: 8 },
  filterPillText: { color: BRAND, fontWeight: "700", fontSize: 12 },
  dropdown: { position: "absolute", top: 52, right: 0, width: 260, backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb", padding: 12, zIndex: 50 },
  dropdownTitle: { fontWeight: "800", color: "#111827", marginBottom: 6 },
  dropdownRow: { marginTop: 8 },
  dropdownLabel: { color: "#374151", fontWeight: "600" },
  dropdownChips: { flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" } as any,
  ddChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff" },
  ddChipText: { color: "#374151", fontSize: 12 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  btnOutline: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1 },
  btnSolid: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: BRAND, borderWidth: 1, borderColor: BRAND },
});
