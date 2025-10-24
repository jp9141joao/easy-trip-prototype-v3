import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ActionKey } from "@/types";

export function actionIcon(key: ActionKey, color: string) {
  switch (key) {
    case "social":    return <Ionicons name="chatbubbles-outline" size={18} color={color} />;
    case "promos":    return <Ionicons name="pricetags-outline"   size={18} color={color} />;
    case "logbook":   return <Ionicons name="book-outline"        size={18} color={color} />;
    case "ai":        return <Ionicons name="sparkles-outline"    size={18} color={color} />;
    case "itinerary": return <Ionicons name="map-outline"         size={18} color={color} />;
    case "gastos":    return <Ionicons name="wallet-outline"      size={18} color={color} />;
    case "agenda":    return <Ionicons name="calendar-outline"    size={18} color={color} />;
    case "fotos":     return <Ionicons name="camera-outline"      size={18} color={color} />;
    case "expert":    return <Ionicons name="logo-whatsapp"       size={18} color={color} />;
    case "currency":  return <Ionicons name="cash-outline"        size={18} color={color} />;
    case "advisory":  return <Ionicons name="headset-outline"     size={18} color={color} />;
    default:          return <Ionicons name="ellipse-outline"     size={18} color={color} />;
  }
}

export function benefitIcon(name: string, color: string) {
  return <MaterialCommunityIcons name={name as any} size={18} color={color} />;
}

export function upcomingIcon(kind: "calendar" | "map" | "airplane", color: string) {
  if (kind === "map")      return <Ionicons name="map-outline"      size={18} color={color} />;
  if (kind === "airplane") return <Ionicons name="airplane-outline" size={18} color={color} />;
  return                       <Ionicons name="calendar-outline"     size={18} color={color} />;
}
