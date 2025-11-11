import { Pressable, Text, View } from "react-native";

import type { FeatureItem } from "../../types/content";
import type { HomeStyles } from "../../styles/home";
import { SafeImageBackground } from "../../utils/safeImages";

type FeatureCardProps = {
  item: FeatureItem;
  styles: HomeStyles;
};

export const FeatureCard = ({ item, styles }: FeatureCardProps) => (
  <Pressable style={[styles.featureCard, styles.shadow]}>
    <SafeImageBackground uri={item.image} style={{ flex: 1 }} imageStyle={{ borderRadius: 16 }}>
      <View style={styles.featureScrim} />
      <View style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>{item.title}</Text>
        {item.subtitle && (
          <Text style={{ color: "#F3F4F6", fontSize: 13, marginTop: 2 }}>{item.subtitle}</Text>
        )}
      </View>
    </SafeImageBackground>
  </Pressable>
);
