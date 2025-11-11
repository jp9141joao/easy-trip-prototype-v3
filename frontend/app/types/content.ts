import type { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

export type CardItem = {
  id: string;
  title: string;
  location?: string;
  image: string;
  rating: number;
  reviews?: number;
  price?: string;
  badge?: string;
};

export type FeatureItem = {
  key: string;
  title: string;
  subtitle?: string;
  icon: IoniconName;
  image: string;
};

export type UpcomingItem = {
  id: string;
  dateLabel: string;
  title: string;
  icon: IoniconName;
};

export type CommunityPost = {
  id: string;
  title: string;
  author: string;
  minutes: number;
  image: string;
};

export type PromoContent = {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
};

export type EditorialHighlight = {
  title: string;
  image: string;
  cta: string;
};
