import { Pressable, Text, View } from "react-native";

import { ACCENT } from "../../constants/colors";
import type { PromoContent } from "../../types/content";
import type { HomeStyles } from "../../styles/home";
import { SafeImage } from "../../utils/safeImages";

type PromoCardProps = {
  promo: PromoContent;
  styles: HomeStyles;
};

export const PromoCard = ({ promo, styles }: PromoCardProps) => (
  <Pressable style={[styles.promoCard, styles.shadow]}>
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ color: ACCENT, fontWeight: "800" }}>{promo.title}</Text>
      <Text style={{ color: styles.text.color, fontSize: 18, fontWeight: "800", lineHeight: 22 }}>
        {promo.subtitle}
      </Text>
      <Pressable style={styles.ghostCta}>
        <Text style={{ color: ACCENT, fontWeight: "700" }}>{promo.cta}</Text>
      </Pressable>
    </View>
    <SafeImage uri={promo.image} style={{ width: 130, height: 96, borderRadius: 12, marginRight: 16 }} />
  </Pressable>
);
