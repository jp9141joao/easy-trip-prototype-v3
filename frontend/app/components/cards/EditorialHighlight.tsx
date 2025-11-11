import { Pressable, Text, View } from "react-native";

import type { EditorialHighlight as EditorialHighlightContent } from "../../types/content";
import type { HomeStyles } from "../../styles/home";
import { SafeImageBackground } from "../../utils/safeImages";

type EditorialHighlightProps = {
  highlight: EditorialHighlightContent;
  styles: HomeStyles;
};

export const EditorialHighlight = ({ highlight, styles }: EditorialHighlightProps) => (
  <SafeImageBackground
    uri={highlight.image}
    style={{ height: 220, borderRadius: 20, overflow: "hidden" }}
    imageStyle={{ borderRadius: 20 }}
  >
    <View style={styles.editorScrim} />
    <View style={{ position: "absolute", left: 16, bottom: 16, right: 16 }}>
      <Text style={[styles.h3, { color: "#fff" }]}>{highlight.title}</Text>
      <Pressable style={[styles.cta, { marginTop: 8 }]}>
        <Text style={styles.ctaText}>{highlight.cta}</Text>
      </Pressable>
    </View>
  </SafeImageBackground>
);
