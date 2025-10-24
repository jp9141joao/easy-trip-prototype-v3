import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, Animated, Easing } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BRAND } from "@/theme";
import { hexOpacity } from "@/utils";
import { shadow } from "@/theme/shadow";

export function BlockableView({ blocked, style, children }: { blocked: boolean; style?: StyleProp<ViewStyle>; children: React.ReactNode; }) {
  if (Platform.OS === "web") {
    const webPE: any = { pointerEvents: blocked ? "none" : "auto" };
    return <View style={[style, webPE]}>{children}</View>;
  }
  return <View pointerEvents={blocked ? "none" : "auto"} style={style}>{children}</View>;
}

export function SafeAvatar({ uri = "https://i.pravatar.cc/120?img=12", size = 44 }: { uri?: string; size?: number; }) {
  const [ok, setOk] = useState(true);
  const radius = size / 2;
  return (
    <View style={{ height: size, width: size, borderRadius: radius, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" }}>
      {ok ? (
        <Image source={{ uri }} onError={() => setOk(false)} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
      ) : (
        <Ionicons name="person-circle-outline" size={Math.round(radius * 1.2)} color="#9ca3af" />
      )}
    </View>
  );
}

export function CardShell({ children, radius = 24, elevation = 10, style, border = true }:
  { children: React.ReactNode; radius?: number; elevation?: number; style?: StyleProp<ViewStyle>; border?: boolean; }) {
  const outer: ViewStyle = {
    borderRadius: radius,
    backgroundColor: "#fff",
    ...shadow(elevation),
    ...(Platform.OS === "android"
      ? { borderTopLeftRadius: radius, borderTopRightRadius: radius, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }
      : null),
  };
  return (
    <View style={[outer, style]}>
      <View style={{ borderRadius: radius, backgroundColor: "#fff" }}>
        <View style={{ borderRadius: radius, overflow: "hidden", borderWidth: border ? 1 : 0, borderColor: "#e5e7eb" }}>
          {children}
        </View>
      </View>
    </View>
  );
}

export function SafeImage({ uri, alt }: { uri: string; alt?: string }) {
  const [ok, setOk] = useState<boolean>(true);
  return ok ? (
    <Image source={{ uri }} onError={() => setOk(false)} resizeMode="cover" style={{ width: "100%", height: "100%" }} accessibilityLabel={alt || "image"} />
  ) : (
    <View style={{ flex: 1, backgroundColor: hexOpacity(BRAND, 0.25), alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: BRAND, fontWeight: "700" }}>{alt || "EasyTrip"}</Text>
    </View>
  );
}

export function Chip({ active, children, onPress }: { active: boolean; children: React.ReactNode; onPress?: () => void; }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, { borderColor: active ? BRAND : "#e5e7eb", backgroundColor: active ? BRAND : "transparent" }]}>
      <Text style={{ color: active ? "#fff" : "#4b5563", fontSize: 14 }}>{children}</Text>
    </TouchableOpacity>
  );
}

export function IconPill({ children }: { children: React.ReactNode }) {
  return <View style={[styles.iconPill, shadow(8)]}>{typeof children === "string" ? <Text style={{ fontSize: 16 }}>{children}</Text> : children}</View>;
}

export function LikePill() {
  const [liked, setLiked] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setLiked(v => !v);
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.iconPill, shadow(8), { transform: [{ scale }] }]}>
        {liked ? <Ionicons name="heart" size={16} color="#ef4444" /> : <Ionicons name="heart-outline" size={16} color="#111" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

export function FlagPill() {
  const [flagged, setFlagged] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setFlagged(v => !v);
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.iconPill, shadow(8), { transform: [{ scale }] }]}>
        {flagged ? <Ionicons name="bookmark" size={16} color={BRAND} /> : <Ionicons name="bookmark-outline" size={16} color="#111" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  iconPill: {
    height: 36, width: 36, alignItems: "center", justifyContent: "center",
    borderRadius: 16, backgroundColor: "rgba(255,255,255,0.85)", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)"
  },
});
