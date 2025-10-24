import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VISIBLE_RANGE } from "@/theme";
import { CardShell, SafeImage, LikePill, FlagPill, BlockableView } from "@/components/common/ui";
import type { Trip } from "@/types";

export default function OverlapCard({ trip, index, activeIndex, onSelect }:
  { trip: Trip; index: number; activeIndex: number; onSelect: (i: number) => void; }) {

  const offset = index - activeIndex;
  if (Math.abs(offset) > VISIBLE_RANGE) return null;

  const depth = Math.abs(offset);
  const scale = Math.max(0.88, 1 - depth * 0.07);
  const translateX = offset * 26;
  const translateY = depth * 18 + (offset !== 0 ? 8 : 0);
  const rotate = offset === 0 ? "0deg" : `${offset > 0 ? 7 : -7}deg`;
  const z = 100 - depth;

  const baseStyle: ViewStyle = { position: "absolute", left: 0, right: 0, transform: [{ translateX }, { translateY }, { scale }, { rotate }], zIndex: z, width: "100%" };

  const dimAlpha = depth === 0 ? 0.22 : 0.38;
  const sideTint = offset === 0 ? "transparent" : offset < 0 ? "rgba(80,140,255,0.18)" : "rgba(255,120,120,0.18)";

  return (
    <BlockableView blocked={depth > 1} style={baseStyle}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect(index)}>
        <CardShell radius={26} elevation={16}>
          <View style={{ position: "relative", height: 288, width: "100%", backgroundColor: "#000" }}>
            <SafeImage uri={trip.img} alt={trip.title} />
            <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${dimAlpha})` }} />
            {depth > 0 && <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: sideTint }} />}

            <View style={{ position: "absolute", top: 16, left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ opacity: 0.9 }}><FlagPill /></View>
              <View style={{ opacity: 0.9 }}><LikePill /></View>
            </View>

            <View style={{ position: "absolute", left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 18, backgroundColor: "rgba(17,17,17,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }} numberOfLines={1}>{trip.title}</Text>
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }} numberOfLines={1}>{trip.subtitle} • {trip.city}</Text>
              </View>
              <TouchableOpacity onPress={() => {}} style={{ height: 44, width: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.16)", borderWidth: 1, borderColor: "rgba(255,255,255,0.28)" }}>
                <Ionicons name="time-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </CardShell>
      </TouchableOpacity>
    </BlockableView>
  );
}
