import { Pressable, Text, View } from "react-native";

import { ACCENT } from "../../constants/colors";
import { COMMUNITY_HEIGHT } from "../../constants/layout";
import type { CommunityPost } from "../../types/content";
import type { HomeStyles } from "../../styles/home";
import { SafeImageBackground } from "../../utils/safeImages";

type CommunityCardProps = {
  post: CommunityPost;
  styles: HomeStyles;
};

export const CommunityCard = ({ post, styles }: CommunityCardProps) => (
  <Pressable style={[styles.comCard, styles.shadow]}>
    <SafeImageBackground
      uri={post.image}
      style={{ height: COMMUNITY_HEIGHT * 0.62 }}
      imageStyle={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
    >
      <View style={styles.comScrim} />
      <View style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
        <Text style={{ color: "#E5E7EB", fontWeight: "700" }}>Da comunidade</Text>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }} numberOfLines={2}>
          {post.title}
        </Text>
      </View>
    </SafeImageBackground>

    <View
      style={{
        padding: 14,
        paddingTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={[styles.textMuted]}>
        Por <Text style={{ fontWeight: "800", color: styles.text.color }}>{post.author}</Text> • {post.minutes} min
      </Text>
      <Pressable style={styles.ghostCta}>
        <Text style={{ color: ACCENT, fontWeight: "700" }}>Ler</Text>
      </Pressable>
    </View>
  </Pressable>
);
