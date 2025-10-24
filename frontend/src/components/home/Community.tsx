import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { BRAND } from "@/theme";
import { CardShell, SafeImage } from "@/components/common/ui";

export default function CommunityCarousel() {
  const posts = [
    { id: 1, title: "Melhores mirantes do Rio de Janeiro (2025)", author: "Layabghiyan", minutes: 2, img: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1200&auto=format&fit=crop" },
    { id: 2, title: "Trilhas imperdíveis em Cusco", author: "Mariana P.", minutes: 4, img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop" },
    { id: 3, title: "Cafés instagramáveis em Buenos Aires", author: "Gustavo R.", minutes: 3, img: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1200&auto=format&fit=crop" },
  ];

  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontWeight: "700", color: "#111827", fontSize: 18 }}>Da comunidade</Text>
        <TouchableOpacity onPress={() => {}}><Text style={{ color: BRAND, fontSize: 14 }}>Ver mais</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 14, paddingRight: 14, paddingBottom: 24 }}>
        {posts.map(p => (
          <View key={p.id} style={{ marginRight: 16 }}>
            <CardShell radius={24} elevation={10} style={{ width: 288, minWidth: 260 }}>
              <View>
                <View style={{ height: 160, width: "100%" }}>
                  <SafeImage uri={p.img} alt={p.title} />
                  <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />
                  <View style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
                    <Text style={{ color: "#fff", fontSize: 12, opacity: 0.9 }}>Da comunidade</Text>
                    <Text style={{ color: "#fff", fontWeight: "700", lineHeight: 22, fontSize: 18 }} numberOfLines={2}>{p.title}</Text>
                  </View>
                </View>
                <View style={{ padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "#4b5563" }}>
                    Por <Text style={{ color: "#111827", fontWeight: "600" }}>{p.author}</Text> • {p.minutes} min
                  </Text>
                  <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: BRAND }}>
                    <Text style={{ color: BRAND, fontSize: 12, fontWeight: "700" }}>Ler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CardShell>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
