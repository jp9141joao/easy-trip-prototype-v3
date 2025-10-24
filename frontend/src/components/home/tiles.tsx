import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BRAND } from "@/theme";
import { hexOpacity } from "@/utils";
import { CardShell, SafeImage } from "@/components/common/ui";
import { upcomingIcon } from "@/icons";

export function MiniTile({ title, img, price }: { title: string; img: string; price?: string }) {
  return (
    <CardShell radius={16} elevation={10} style={{ width: 220 }}>
      <View>
        <View style={{ height: 120, width: "100%" }}><SafeImage uri={img} alt={title} /></View>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ height: 20, width: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: hexOpacity(BRAND, 0.12), marginRight: 8 }}>
              <Ionicons name="star" size={12} color={BRAND} />
            </View>
            <Text style={{ color: "#374151", fontSize: 14 }}>5.0</Text>
          </View>
          <Text style={{ marginTop: 4, color: "#111827", fontWeight: "600" }} numberOfLines={1}>{title}</Text>
          {!!price && <Text style={{ color: "#6b7280", fontSize: 12 }}>From {price}</Text>}
        </View>
      </View>
    </CardShell>
  );
}

export function UpcomingItem({ date, title, icon }: { date: string; title: string; icon: "calendar" | "map" | "airplane" }) {
  return (
    <CardShell radius={16} elevation={10} style={{ width: 260 }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <View style={{ height: 36, width: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: hexOpacity(BRAND, 0.12), marginRight: 12 }}>
          {upcomingIcon(icon, BRAND)}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>{date}</Text>
          <Text style={{ fontSize: 14, color: "#111827", fontWeight: "600" }} numberOfLines={1}>{title}</Text>
        </View>
      </View>
    </CardShell>
  );
}
