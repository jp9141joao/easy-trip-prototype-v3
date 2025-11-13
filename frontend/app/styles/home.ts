import { Dimensions, StyleSheet } from "react-native";

import { ACCENT } from "../constants/colors";
import {
  COMMUNITY_HEIGHT,
  COMMUNITY_WIDTH,
  FEATURE_HEIGHT,
  FEATURE_WIDTH,
  SCREEN_WIDTH,
  UPCOMING_HEIGHT,
  UPCOMING_WIDTH,
} from "../constants/layout";
import type { Theme } from "../theme";

export type HomeStyles = ReturnType<typeof createHomeStyles>;

const ScreenHeight = Dimensions.get("window").height;

export const createHomeStyles = (theme: Theme) => {
  const isLight = theme.bg === "#FFFFFF";

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },

    text: { color: theme.text },
    textMuted: { color: theme.textMuted },

    h1: { color: theme.text, fontSize: 24, fontWeight: "800", lineHeight: 28 },
    h2: { color: theme.text, fontSize: 20, fontWeight: "800" },
    h3: { color: theme.text, fontSize: 18, fontWeight: "800", lineHeight: 22 },

    shadow: isLight
      ? {
          shadowColor: "#0F172A",
          shadowOpacity: 0.15,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 12 },
          elevation: 10,
        }
      : {},

    headerLightWrap: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: theme.bg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      zIndex: 20,
    },
    headerLightTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    logoCircle: {
      width: 26,
      height: 26,
      borderRadius: 999,
      backgroundColor: ACCENT,
      alignItems: "center",
      justifyContent: "center",
    },
    logoStar: { color: "#0A0A0B", fontSize: 14, lineHeight: 16, fontWeight: "900" },
    brandLight: { color: theme.text, fontSize: 18, fontWeight: "800", letterSpacing: 0.2 },
    bellBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchPill: {
      height: 56,
      borderRadius: 16,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      flexDirection: "row",
      alignItems: "center",
    },

    chipsCarouselScroll: { overflow: "visible" },
    chipsCarousel: { paddingTop: 10, paddingBottom: 2, paddingRight: 8 },
    carouselList: { overflow: "visible" },
    carouselContent: { paddingTop: 6, paddingBottom: 24 },
    featureCarousel: { paddingTop: 10, paddingBottom: 24 },
    chipWrap: { position: "relative", marginRight: 8, overflow: "visible" },
    lightChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdown: {
      position: "absolute",
      top: 44,
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 6,
      zIndex: 30,
      elevation: 8,
    },
    dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },

    hero: {
      height: 220,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.card,
    },
    heroScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrimStrong },

    cta: {
      marginTop: 10,
      alignSelf: "flex-start",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: ACCENT,
    },
    ctaText: {
      fontWeight: "800",
      color: isLight ? "#FFFFFF" : "#0A0A0B",
    },

    sectionHeader: {
      marginTop: 8,
      marginBottom: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    card: {
      backgroundColor: theme.cardAlt,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardImage: { width: "100%", height: 160, justifyContent: "space-between" },
    badge: {
      position: "absolute",
      left: 10,
      bottom: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: "#38F2C1",
      borderRadius: 10,
    },
    cardTitle: { color: theme.text, fontWeight: "800", fontSize: 16 },

    upcCard: {
      width: UPCOMING_WIDTH,
      height: UPCOMING_HEIGHT,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      gap: 12,
    },
    upcIconPill: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "rgba(56,242,193,0.15)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    comCard: {
      width: COMMUNITY_WIDTH,
      height: COMMUNITY_HEIGHT,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
    },
    comScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrim },

    ghostCta: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: ACCENT,
      backgroundColor: "transparent",
    },

    promoCard: {
      width: SCREEN_WIDTH - 32,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
    },

    featureCard: {
      width: FEATURE_WIDTH,
      height: FEATURE_HEIGHT,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    featureScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrim },

    editorScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrimStrong },

    modalOverlay: {
      flex: 1,
      backgroundColor: theme.bg,
      gap: 8,
    },
    modalSheet: {
      flex: 1,
      borderRadius: 0,
      paddingHorizontal: 20,
      backgroundColor: theme.cardAlt,
      paddingTop: 8,
      paddingBottom: 12,
      justifyContent: "flex-end",
      backgroundColor: theme.scrimStrong,
      paddingTop: 60,
    },
    modalSheet: {
      width: "100%",
      backgroundColor: theme.cardAlt,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 32,
      maxHeight: Math.min(ScreenHeight * 0.85, 720),
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    modalClose: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    modalList: {
      paddingBottom: 32,
      paddingHorizontal: 4,
      marginBottom: 20,
    },
    modalList: {
      paddingBottom: 32,
    },
    modalColumn: {
      justifyContent: "space-between",
    },
    modalGridItem: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 6,
      marginBottom: 20,
    },
    modalFullItem: {
      marginBottom: 16,
      alignItems: "center",
    },

    bottomBarWrap: { position: "absolute", left: 0, right: 0, bottom: 0 },
    bottomBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingTop: 8,
      paddingBottom: 12,
      backgroundColor: theme.bg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    bottomItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
    bottomLabel: { fontSize: 11, fontWeight: "600" },
  });
};
