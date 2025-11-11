import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeartButtonProps = {
  active: boolean;
  onToggle: () => void;
};

export const HeartButton = ({ active, onToggle }: HeartButtonProps) => (
  <Pressable onPress={onToggle} style={[styles.overlay, active && styles.active]}>
    <Ionicons
      name={active ? "heart" : "heart-outline"}
      size={20}
      color={active ? "#FF3B30" : "#0F1720"}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  active: {
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
});
