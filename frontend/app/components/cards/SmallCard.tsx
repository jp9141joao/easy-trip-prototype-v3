import { View, Text } from "react-native";

import { CARD_WIDTH } from "../../constants/layout";
import type { CardItem } from "../../types/content";
import type { HomeStyles } from "../../styles/home";
import { SafeImageBackground } from "../../utils/safeImages";
import { HeartButton } from "../buttons/HeartButton";
import { RatingDots } from "../common/RatingDots";

type SmallCardProps = {
  item: CardItem;
  fav: boolean;
  onToggleFav: () => void;
  styles: HomeStyles;
};

export const SmallCard = ({ item, fav, onToggleFav, styles }: SmallCardProps) => (
  <View style={[styles.card, styles.shadow, { width: CARD_WIDTH }]}>
    <SafeImageBackground
      uri={item.image}
      style={styles.cardImage}
      imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
    >
      {item.badge && (
        <View style={styles.badge}>
          <Text style={{ color: "#0A1C16", fontWeight: "800" }}>{item.badge}</Text>
        </View>
      )}
      <HeartButton active={fav} onToggle={onToggleFav} />
    </SafeImageBackground>

    <View style={{ padding: 12, gap: 6 }}>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.title}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={[styles.text, { fontWeight: "700" }]}>{item.rating.toFixed(1)}</Text>
        <RatingDots value={item.rating} />
        {item.reviews != null && (
          <Text style={styles.textMuted}>({item.reviews.toLocaleString()})</Text>
        )}
      </View>

      {item.location && (
        <Text numberOfLines={1} style={styles.textMuted}>
          {item.location}
        </Text>
      )}

      {item.price && <Text style={[styles.text, { marginTop: 2 }]}>{item.price}</Text>}
    </View>
  </View>
);
