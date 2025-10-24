import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, Dimensions, PanResponder, Image } from "react-native";
import type { ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { BRAND, FRAME_W, SWIPE_THRESHOLD } from "@/theme";
import { shadow } from "@/theme/shadow";
import { SafeAvatar, Chip } from "@/components/common/ui";
import SearchBar from "@/components/home/SearchBar";
import OverlapCard from "@/components/home/OverlapCard";
import CommunityCarousel from "@/components/home/Community";
import AboutSection from "@/components/home/Benefits";
import { MiniTile, UpcomingItem } from "@/components/home/tiles";
import { actionIcon } from "@/icons";

import { trips, hotels, restaurants, upcomingTrips, quickActions, moreActions } from "@/constants/data";
import type { BottomTab, PlacesTab, ActionKey } from "@/types";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CAROUSEL_PAD_H = 14;
const CAROUSEL_PAD_B = Platform.OS === "android" ? 32 : 24;

export default function HomeScreen() {
  const [active, setActive] = useState<number>(0);
  const [bottomTab, setBottomTab] = useState<BottomTab>("home");
  const [placesTab, setPlacesTab] = useState<PlacesTab>("hotels");

  const deckHeight = Math.min(300, Math.round(SCREEN_H * 0.44));
  const containerW = Platform.OS === "web" ? Math.min(FRAME_W, SCREEN_W * 0.92) : SCREEN_W;

  // 3 por linha, mantendo layout
  const ACTION_W = useMemo(() => (containerW - 20 * 2 - 12 * 2) / 3, [containerW]);

  // adiciona spacer se sobrar 2 no fim
  const baseActions = useMemo(() => {
    const arr: Array<any> = [...quickActions, ...moreActions];
    if (arr.length % 3 === 2) arr.push({ key: "__spacer__" });
    return arr;
  }, []);

  // swipe do deck
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx } = gestureState;
        if (dx > SWIPE_THRESHOLD) goPrev();
        else if (dx < -SWIPE_THRESHOLD) goNext();
      },
    })
  ).current;

  const goPrev = () => setActive(i => (i - 1 + trips.length) % trips.length);
  const goNext = () => setActive(i => (i + 1) % trips.length);

  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % trips.length), 5000);
    return () => clearInterval(id);
  }, []);

  const onAction = (key: ActionKey) => {
    const labels: Record<ActionKey, string> = {
      social: "Abrir rede social de viagens",
      promos: "Ver promoções diárias",
      logbook: "Abrir diário de bordo",
      ai: "Abrir assistente de IA (ChatGPT)",
      itinerary: "Criar itinerário",
      gastos: "Gestão de gastos",
      agenda: "Abrir agenda",
      fotos: "Abrir câmera / galeria",
      expert: "Falar com especialista via WhatsApp",
      currency: "Ver cotação de moedas",
      advisory: "Abrir assessoria",
    };
    Alert.alert(labels[key] || key);
  };

  const placeData = placesTab === "hotels" ? hotels : restaurants;

  const containerOuterStyle: ViewStyle = Platform.select({
    web: { width: containerW, borderRadius: 35, backgroundColor: "#fff", overflow: "visible", borderWidth: 1, borderColor: "#e5e7eb", ...shadow(20) },
    default: { width: containerW, backgroundColor: "#fff" },
  }) as ViewStyle;

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View style={[containerOuterStyle]}>
        <View style={{ height: Platform.OS === "web" ? 20 : 0 }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 160 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ height: 32, width: 32, borderRadius: 16, backgroundColor: BRAND, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>✦</Text>
              </View>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>EasyTrip</Text>
            </View>
            <SafeAvatar />
          </View>

          {/* Greeting */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827", lineHeight: 24 }}>Olá, João Pedro</Text>
            <Text style={{ color: "#6b7280", fontSize: 13, lineHeight: 20, marginTop: 2 }} numberOfLines={1}>
              Pense no melhor design para sua próxima viagem ✨
            </Text>
          </View>

          {/* Search */}
          <View style={{ marginTop: 16 }}>
            <SearchBar />
          </View>

          {/* Title */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: "800", lineHeight: 32 }}>
              Encontre o <Text style={{ color: BRAND }}>lugar perfeito</Text>
            </Text>
          </View>

          {/* Deck */}
          <View style={{ marginTop: 24, height: deckHeight + 24 }} {...panResponder.panHandlers}>
            <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 16 }}>
              {trips.map((t, i) => (
                <OverlapCard key={t.title} trip={t} index={i} activeIndex={active} onSelect={setActive} />
              ))}
            </View>
            <View style={{ position: "absolute", left: -8, top: deckHeight / 2 - 18, flexDirection: "row" }}>
              <TouchableOpacity onPress={goPrev} style={navCircleStyle}><Ionicons name="chevron-back" size={18} color="#111" /></TouchableOpacity>
              <View style={{ width: 8 }} />
              <TouchableOpacity onPress={goNext} style={navCircleStyle}><Ionicons name="chevron-forward" size={18} color="#111" /></TouchableOpacity>
            </View>
          </View>

          {/* Hotels / Restaurants */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ marginRight: 8 }}>
                <Chip active={placesTab === "hotels"} onPress={() => setPlacesTab("hotels")}>Hotels</Chip>
              </View>
              <Chip active={placesTab === "restaurants"} onPress={() => setPlacesTab("restaurants")}>Restaurants</Chip>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: CAROUSEL_PAD_H, paddingRight: CAROUSEL_PAD_H, paddingBottom: CAROUSEL_PAD_B }}>
              {placeData.map((h: any) => (
                <View key={h.id} style={{ marginRight: 12 }}>
                  <MiniTile title={h.title} img={h.img} price={"price" in h ? h.price : undefined} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Próximos */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontWeight: "700", fontSize: 18 }}>Próximos</Text>
              <TouchableOpacity onPress={() => {}}><Text style={{ color: BRAND, fontSize: 14 }}>Ver agenda</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: CAROUSEL_PAD_H, paddingRight: CAROUSEL_PAD_H, paddingBottom: CAROUSEL_PAD_B }}>
              {upcomingTrips.map(u => (
                <View key={u.id} style={{ marginRight: 12 }}>
                  <UpcomingItem date={u.date} title={u.title} icon={u.icon} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Comunidade */}
          <CommunityCarousel />

          {/* Banner Promoções */}
          <View style={{ borderRadius: 24, backgroundColor: "#fff", padding: 0, borderWidth: 1, borderColor: "#e5e7eb", marginTop: 28, ...shadow(8) }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: BRAND, fontWeight: "700", fontSize: 13 }}>Promoções</Text>
                <Text style={{ color: "#374151" }} numberOfLines={2}>Novas ofertas todos os dias</Text>
                <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: BRAND, marginTop: 10, alignSelf: "flex-start" }}>
                  <Text style={{ color: BRAND, fontWeight: "700" }}>Ver agora</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 90, width: 140, borderRadius: 16, overflow: "hidden" }}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1534854638093-bada1813ca19?q=80&w=800&auto=format&fit=crop" }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
              </View>
            </View>
          </View>

          {/* Atalhos */}
          <View style={{ marginTop: 24, marginBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#111827" }}>Seus atalhos</Text>
            <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Acelere seu planejamento com ferramentas úteis</Text>
          </View>

          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {baseActions.map((a, idx) => {
                if (a.key === "__spacer__") return <View key={`sp-${idx}`} style={{ width: ACTION_W, marginBottom: 12 }} />;
                return (
                  <TouchableOpacity key={`${a.key}-${idx}`} onPress={() => onAction(a.key as ActionKey)} style={{ borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff", padding: 12, marginBottom: 12, width: ACTION_W, ...shadow(6) }}>
                    <View style={{ height: 36, width: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,175,135,0.12)", marginBottom: 8 }}>
                      {actionIcon(a.key as ActionKey, "#111")}
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: "600" }} numberOfLines={2}>{a.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Benefícios */}
          <AboutSection />
        </ScrollView>

        {/* Bottom nav */}
        <View style={{ position: "absolute", left: 12, right: 12, bottom: 16 }}>
          <View style={{ borderRadius: 24, backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: "#e5e7eb", flexDirection: "row", alignItems: "center", justifyContent: "space-between", ...shadow(14) }}>
            {[
              { key: "home", label: "Home", icon: (a: boolean) => <Ionicons name={a ? "home"      : "home-outline"}      size={18} color={a ? "#fff" : "#6b7280"} /> },
              { key: "discover", label: "Discover", icon: (a: boolean) => <Ionicons name={a ? "compass"   : "compass-outline"}   size={18} color={a ? "#fff" : "#6b7280"} /> },
              { key: "trips", label: "Minhas viagens", icon: (a: boolean) => <Ionicons name={a ? "briefcase" : "briefcase-outline"} size={18} color={a ? "#fff" : "#6b7280"} /> },
              { key: "profile", label: "Profile", icon: (a: boolean) => <Ionicons name={a ? "person"    : "person-outline"}    size={18} color={a ? "#fff" : "#6b7280"} /> },
            ].map((item: any) => {
              const isActive = bottomTab === item.key;
              return (
                <TouchableOpacity key={item.key} onPress={() => setBottomTab(item.key)} style={{ alignItems: "center" }}>
                  <View style={[{ height: 36, width: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }, isActive && { backgroundColor: BRAND }]}>
                    {item.icon(isActive)}
                  </View>
                  <Text style={{ marginTop: 4, fontSize: 12, fontWeight: "600", color: isActive ? BRAND : "#6b7280" }}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const navCircleStyle = { height: 36, width: 36, borderRadius: 18, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" } as const;
