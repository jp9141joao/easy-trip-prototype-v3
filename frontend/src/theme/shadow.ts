import type { ViewStyle } from "react-native";

export const shadow = (elev: number = 12): ViewStyle => ({
  elevation: elev, // Android
  shadowColor: "#000", // iOS/Web
  shadowOpacity: 0.16,
  shadowOffset: { width: 0, height: Math.max(2, Math.round(elev / 2)) },
  shadowRadius: Math.max(4, elev),
});
