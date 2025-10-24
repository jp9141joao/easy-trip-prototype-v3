import React from "react";
import { View, Text } from "react-native";
import { BRAND } from "@/theme";
import { benefits } from "@/constants/data";
import { CardShell } from "@/components/common/ui";
import { benefitIcon } from "@/icons";
import { hexOpacity } from "@/utils";

function BenefitCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <CardShell radius={24} elevation={6}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <View style={{ height: 36, width: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: hexOpacity(BRAND, 0.1), marginRight: 12 }}>
          {benefitIcon(icon, "#111")}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", color: "#111827" }} numberOfLines={1}>{title}</Text>
          <Text style={{ color: "#4b5563", fontSize: 13, marginTop: 4 }} numberOfLines={2}>{text}</Text>
        </View>
      </View>
    </CardShell>
  );
}

export default function AboutSection() {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827", lineHeight: 30 }}>
        Prepare-se para uma <Text style={{ color: BRAND }}>aventura inesquecível</Text>
      </Text>
      <Text style={{ color: "#4b5563", fontSize: 13, marginTop: 8 }}>
        Com a EasyTrip você planeja itinerários, controla gastos, registra memórias e encontra promoções — tudo em um só lugar. Explore novos destinos, aproveite boa comida e viva experiências únicas.
      </Text>
      <View style={{ marginTop: 16 }}>
        {benefits.map(b => (
          <View key={b.key} style={{ marginBottom: 12 }}>
            <BenefitCard icon={b.icon} title={b.title} text={b.text} />
          </View>
        ))}
      </View>
    </View>
  );
}
