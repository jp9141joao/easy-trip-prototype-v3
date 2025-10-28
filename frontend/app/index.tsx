import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  FlatList,
  Dimensions,
  Platform,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * EasyTrip — Home (index.tsx)
 * - Novas sessões: Próximos, Da comunidade, Promoções
 * - Cards de funcionalidades em pé (altura > largura)
 * - Tema Dark/Light funcional
 */

const ACCENT = "#00AF87";

// ---------- THEMES ----------
type Theme = {
  bg: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
};

const DARK: Theme = {
  bg: "#0A0A0B",
  card: "#121315",
  cardAlt: "#15171A",
  text: "#FFFFFF",
  textMuted: "#A1A1AA",
  border: "#23262B",
};

const LIGHT: Theme = {
  bg: "#FFFFFF",
  card: "#F5F7FA",
  cardAlt: "#FFFFFF",
  text: "#0F1720",
  textMuted: "#6B7280",
  border: "#E5E7EB",
};

// ---------- TYPES ----------
type CardItem = {
  id: string;
  title: string;
  location?: string;
  image: string;
  rating: number; // 0..5
  reviews?: number;
  price?: string;
  badge?: string;
};

type FeatureItem = {
  key: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: string;
};

type UpcomingItem = {
  id: string;
  dateLabel: string; // "02 Dez"
  title: string; // "Trilha Aconcágua"
  icon: keyof typeof Ionicons.glyphMap; // "map", "airplane", etc.
};

type CommunityPost = {
  id: string;
  title: string;
  author: string;
  minutes: number;
  image: string;
};

// ---------- DATA ----------
const hotels: CardItem[] = [
  {
    id: "h1",
    title: "Rancho Encantado",
    location: "Bacalar, Quintana Roo, Mexico",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e3f1a9d3a7?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    reviews: 1762,
    price: "From $142",
    badge: "2025",
  },
  {
    id: "h2",
    title: "Casa Bakal",
    location: "Bacalar, Quintana Roo, Mexico",
    image:
      "https://images.unsplash.com/photo-1501117490113-2915e6f0f0a5?q=80&w=1200&auto=format&fit=crop",
    rating: 4.0,
    reviews: 293,
    price: "From $153",
  },
  {
    id: "h3",
    title: "Azul Lagoon Resort",
    location: "Bacalar, Quintana Roo, Mexico",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviews: 1123,
    price: "From $189",
  },
];

const experiences: CardItem[] = [
  {
    id: "e1",
    title: "Bacalar Boat Tour & Cenotes",
    location: "Bacalar",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviews: 965,
    price: "From $22 / adult",
  },
  {
    id: "e2",
    title: "Sailing Tour — Laguna de 7 Cores",
    location: "Bacalar",
    image:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200&auto=format&fit=crop",
    rating: 5.0,
    reviews: 1391,
    price: "From $38 / adult",
    badge: "2025",
  },
];

const restaurants: CardItem[] = [
  {
    id: "r1",
    title: "Nixtamal",
    location: "Mexican • Steakhouse",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d1cf0c7?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviews: 2354,
    price: "$$$$",
    badge: "2025",
  },
  {
    id: "r2",
    title: "La Playita",
    location: "Mexican • Seafood",
    image:
      "https://images.unsplash.com/photo-1520207588543-cf2f9cba8496?q=80&w=1200&auto=format&fit=crop",
    rating: 4.4,
    reviews: 3260,
    price: "$$ • $$$",
  },
];

// Funcionalidades (cards em pé)
const features: FeatureItem[] = [
  { key: "ai",          title: "Ajuda por IA",           subtitle: "Planeje em segundos",   icon: "flash",              image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop" },
  { key: "diario",      title: "Diário de bordo",        subtitle: "Memórias da viagem",    icon: "book",               image: "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=1400&auto=format&fit=crop" },
  { key: "itinerario",  title: "Itinerário",             subtitle: "Dia a dia organizado",  icon: "map",                image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop" },
  { key: "gastos",      title: "Gastos",                 subtitle: "Controle de despesas",  icon: "cash",               image: "https://images.unsplash.com/photo-1567427013953-1d4d7f0f76a0?q=80&w=1400&auto=format&fit=crop" },
  { key: "agenda",      title: "Agenda",                 subtitle: "Compromissos e alertas",icon: "calendar",           image: "https://images.unsplash.com/photo-1513639725746-c5d3e861f32a?q=80&w=1400&auto=format&fit=crop" },
  { key: "fotos",       title: "Fotos",                  subtitle: "Álbuns compartilhados", icon: "images",             image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop" },
  { key: "porquinho",   title: "Porquinho",              subtitle: "Cofrinho da viagem",    icon: "wallet",             image: "https://images.unsplash.com/photo-1500390368153-b6d9a2a06c59?q=80&w=1400&auto=format&fit=crop" },
  { key: "especialista",title: "Falar com especialista", subtitle: "Atendimento humano",    icon: "chatbubbles",        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop" },
  { key: "moedas",      title: "Cotação de moedas",      subtitle: "Câmbio em tempo real",  icon: "swap-horizontal",    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop" },
  { key: "assessoria",  title: "Assessoria",             subtitle: "Vistos e suporte",      icon: "shield-checkmark",   image: "https://images.unsplash.com/photo-1517898717281-8e4385a4b7c7?q=80&w=1400&auto=format&fit=crop" },
];

// Agenda (Próximos)
const upcoming: UpcomingItem[] = [
  { id: "u1", dateLabel: "24 Nov", title: "Check-in: Rio de Janeiro", icon: "calendar" },
  { id: "u2", dateLabel: "02 Dez", title: "Trilha Aconcágua", icon: "map" },
  { id: "u3", dateLabel: "15 Dez", title: "Voo para Cusco", icon: "airplane" },
];

// Da comunidade
const community: CommunityPost[] = [
  {
    id: "c1",
    title: "Trilhas imperdíveis em Cusco",
    author: "Mariana P.",
    minutes: 4,
    image:
      "https://images.unsplash.com/photo-1526481280698-8fcc13fd6a42?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "c2",
    title: "Cafés instagramáveis em Buenos Aires",
    author: "Gustavo R.",
    minutes: 3,
    image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "c3",
    title: "Melhores mirantes do Rio de Janeiro (2025)",
    author: "Layabghiyan",
    minutes: 2,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
  },
];

// Promoção
const promo = {
  title: "Promoções",
  subtitle: "Novas ofertas todos os dias",
  cta: "Ver agora",
  image:
    "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
};

// ---------- UTILS ----------
const Screen = Dimensions.get("window");
const CARD_W = Math.min(Screen.width * 0.62, 320);

// Feature em pé (altura > largura)
const FEAT_W = Math.min(Screen.width * 0.56, 260);
const FEAT_H = Math.round(FEAT_W * 1.5);

// Próximos (carrossel)
const UPC_W = Math.min(Screen.width * 0.78, 320);
const UPC_H = 90;

// Comunidade (carrossel)
const COM_W = Math.min(Screen.width * 0.84, 360);
const COM_H = 260;

function toDots(n: number): boolean[] {
  const round = Math.round(n);
  return new Array(5).fill(false).map((_, i) => i < round);
}

// ---------- UI ----------
const SectionHeader = ({
  title,
  action,
  styles,
}: {
  title: string;
  action?: { label: string; onPress: () => void };
  styles: any;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.h2}>{title}</Text>
    {action && (
      <Pressable onPress={action.onPress} hitSlop={6}>
        <Text style={[styles.textMuted, { fontWeight: "600", color: ACCENT }]}>
          {action.label}
        </Text>
      </Pressable>
    )}
  </View>
);

const RatingDots = ({ value }: { value: number }) => {
  const dots = useMemo(() => toDots(value), [value]);
  return (
    <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
      {dots.map((f, idx) => (
        <View
          key={idx}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: f ? ACCENT : "#2E3238",
          }}
        />
      ))}
    </View>
  );
};

const HeartButton = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <Pressable onPress={onToggle} style={ss.heartBtnOverlay}>
    <Ionicons name={active ? "heart" : "heart-outline"} size={20} color={active ? "#fff" : "#0F1720"} />
  </Pressable>
);

const SmallCard = ({
  item,
  fav,
  onToggleFav,
  styles,
}: {
  item: CardItem;
  fav: boolean;
  onToggleFav: () => void;
  styles: any;
}) => (
  <View style={[styles.card, { width: CARD_W }]}>
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.cardImage}
      imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
    >
      {item.badge && (
        <View style={styles.badge}>
          <Text style={{ color: "#0A0A0B", fontWeight: "800" }}>{item.badge}</Text>
        </View>
      )}
      <HeartButton active={fav} onToggle={onToggleFav} />
    </ImageBackground>

    <View style={{ padding: 12, gap: 6 }}>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.title}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={[styles.text, { fontWeight: "700" }]}>{item.rating.toFixed(1)}</Text>
        <RatingDots value={item.rating} />
        {item.reviews != null && <Text style={styles.textMuted}>({item.reviews.toLocaleString()})</Text>}
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

// Feature card em pé
const FeatureCard = ({ item, styles }: { item: FeatureItem; styles: any }) => (
  <Pressable style={styles.featureCard}>
    <ImageBackground
      source={{ uri: item.image }}
      style={{ flex: 1 }}
      imageStyle={{ borderRadius: 16 }}
    >
      <View style={styles.featureScrim} />
      <View style={{ position: "absolute", left: 12, right: 12, top: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={styles.featurePill}>
          <Ionicons name={item.icon} size={14} color="#0A0A0B" />
        </View>
        <Text style={{ color: "#E5E7EB", fontSize: 12 }}>Ferramenta EasyTrip</Text>
      </View>
      <View style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>{item.title}</Text>
        {item.subtitle && <Text style={{ color: "#F3F4F6", fontSize: 13, marginTop: 2 }}>{item.subtitle}</Text>}
      </View>
    </ImageBackground>
  </Pressable>
);

// Próximos (agenda)
const UpcomingCard = ({ item, styles }: { item: UpcomingItem; styles: any }) => (
  <Pressable style={styles.upcCard}>
    <View style={styles.upcIconPill}>
      <Ionicons name={item.icon} size={18} color={ACCENT} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.textMuted, { fontWeight: "700" }]}>{item.dateLabel}</Text>
      <Text numberOfLines={1} style={[styles.text, { fontWeight: "800", fontSize: 16 }]}>{item.title}</Text>
    </View>
  </Pressable>
);

// Comunidade (post)
const CommunityCard = ({ post, styles }: { post: CommunityPost; styles: any }) => (
  <Pressable style={styles.comCard}>
    <ImageBackground
      source={{ uri: post.image }}
      style={{ height: COM_H * 0.62 }}
      imageStyle={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
    >
      <View style={styles.comScrim} />
      <View style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
        <Text style={{ color: "#E5E7EB", fontWeight: "700" }}>Da comunidade</Text>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }} numberOfLines={2}>
          {post.title}
        </Text>
      </View>
    </ImageBackground>

    <View style={{ padding: 14, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={[styles.textMuted]}>
        Por <Text style={{ fontWeight: "800", color: styles.text.color }}>{post.author}</Text> • {post.minutes} min
      </Text>
      <Pressable style={styles.ghostCta}>
        <Text style={{ color: ACCENT, fontWeight: "700" }}>Ler</Text>
      </Pressable>
    </View>
  </Pressable>
);

// Promo (card único)
const PromoCard = ({ styles }: { styles: any }) => (
  <Pressable style={styles.promoCard}>
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ color: ACCENT, fontWeight: "800" }}>Promoções</Text>
      <Text style={[styles.text, { fontSize: 18, fontWeight: "800", lineHeight: 22 }]}>
        Novas ofertas todos os dias
      </Text>
      <Pressable style={styles.ghostCta}>
        <Text style={{ color: ACCENT, fontWeight: "700" }}>Ver agora</Text>
      </Pressable>
    </View>
    <Image
      source={{ uri: promo.image }}
      style={{ width: 130, height: 96, borderRadius: 12, marginRight: 16 }}
    />
  </Pressable>
);

// ---------- HEADER ----------
const Header = ({
  theme,
  styles,
  onToggleTheme,
  isDark,
}: {
  theme: Theme;
  styles: any;
  onToggleTheme: () => void;
  isDark: boolean;
}) => {
  const topInset = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const opts: Record<string, string[]> = {
    Sort: ["Top rated", "Lower price", "Nearby"],
    When: ["Anytime", "This week", "This month"],
    "Stay type": ["Hotel", "Home", "Villa"],
    "Add Guest": ["1 guest", "2 guests", "3+ guests"],
  };

  return (
    <View style={{ backgroundColor: theme.bg }}>
      <View style={[styles.headerLightWrap, { paddingTop: topInset + 8 }]}>
        {/* topo */}
        <View style={styles.headerLightTop}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoStar}>✦</Text>
            </View>
            <Text style={styles.brandLight}>EasyTrip</Text>
          </View>
        <Pressable style={styles.bellBtn} hitSlop={8} onPress={onToggleTheme}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={18} color={theme.text} />
          </Pressable>
        </View>

        {/* search pill funcional */}
        <View style={styles.searchPill}>
          <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Places to go, things to do, hotels..."
              placeholderTextColor={theme.textMuted}
              returnKeyType="search"
              onSubmitEditing={() => console.log("search:", query)}
              style={{ color: theme.text, fontWeight: "700", padding: 0 }}
            />
          </View>
        </View>

        {/* chips + dropdowns (carrossel horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsCarouselScroll} contentContainerStyle={styles.chipsCarousel}>
          {Object.keys(opts).map((label) => (
            <View key={label} style={styles.chipWrap}>
              <Pressable style={styles.lightChip} onPress={() => setOpen(open === label ? null : label)}>
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "600" }}>{label}</Text>
                <Ionicons name="chevron-down" size={14} color={theme.text} />
              </Pressable>

              {open === label && (
                <View style={styles.dropdown}>
                  {opts[label].map((o) => (
                    <Pressable key={o} style={styles.dropdownItem} onPress={() => setOpen(null)}>
                      <Text style={{ color: theme.text }}>{o}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// ---------- BOTTOM BAR ----------
const BottomBar = ({ theme, styles }: { theme: Theme; styles: any }) => {
  const items = [
    { key: "explore", label: "Home", icon: "home-outline", activeIcon: "home" },
    { key: "search", label: "Search", icon: "search-outline", activeIcon: "search" },
    { key: "trips", label: "Trips", icon: "heart-outline", activeIcon: "heart" },
    { key: "review", label: "Review", icon: "create-outline", activeIcon: "create" },
    { key: "account", label: "Account", icon: "person-outline", activeIcon: "person" },
  ];
  const activeIndex = 0;

  return (
    <View style={styles.bottomBarWrap} pointerEvents="box-none">
      <View style={styles.bottomBar}>
        {items.map((it, i) => {
          const active = i === activeIndex;
          return (
            <Pressable key={it.key} style={styles.bottomItem}>
              <Ionicons
                name={(active ? it.activeIcon : it.icon) as any}
                size={22}
                color={active ? ACCENT : "#9CA3AF"}
              />
              <Text style={[styles.bottomLabel, { color: active ? theme.text : "#9CA3AF" }]}>
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// ---------- MAIN ----------
export default function Home() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? DARK : LIGHT;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const toggleFav = (id: string) => setFavorites((s) => ({ ...s, [id]: !s[id] }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      <Header theme={theme} styles={styles} onToggleTheme={() => setIsDark((v) => !v)} isDark={isDark} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, gap: 20 }}>
          {/* Banner */}
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop" }}
            style={styles.hero}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.heroScrim} />
            <View style={{ position: "absolute", left: 16, bottom: 16, right: 16 }}>
              <Text style={[styles.text, { opacity: 0.8, marginBottom: 6 }]}>EasyTrip Rewards</Text>
              <Text style={styles.h1}>Get 5% back on hotels in Bacalar</Text>
              <Pressable style={styles.cta}><Text style={[styles.text, { fontWeight: "700" }]}>Find a hotel</Text></Pressable>
            </View>
          </ImageBackground>

          {/* Hotels */}
          <SectionHeader title="Get 5% back on top-rated hotels" action={{ label: "View all", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={hotels}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 6 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <SmallCard item={item} fav={!!favorites[item.id]} onToggleFav={() => toggleFav(item.id)} styles={styles} />}
          />

          {/* Experiences */}
          <SectionHeader title="Must-do experiences in Bacalar" action={{ label: "View all", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={experiences}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 6 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <SmallCard item={item} fav={!!favorites[item.id]} onToggleFav={() => toggleFav(item.id)} styles={styles} />}
          />

          {/* Restaurants */}
          <SectionHeader title="Top restaurants in Bacalar" action={{ label: "View all", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={restaurants}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 6 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <SmallCard item={item} fav={!!favorites[item.id]} onToggleFav={() => toggleFav(item.id)} styles={styles} />}
          />

          {/* ===== NOVO: Próximos (agenda) ===== */}
          <SectionHeader title="Próximos" action={{ label: "Ver agenda", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={upcoming}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <UpcomingCard item={item} styles={styles} />}
          />

          {/* ===== NOVO: Da comunidade ===== */}
          <SectionHeader title="Da comunidade" action={{ label: "Ver mais", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={community}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <CommunityCard post={item} styles={styles} />}
          />

          {/* ===== NOVO: Promoções ===== */}
          <PromoCard styles={styles} />

          {/* ===== Ferramentas do EasyTrip (em pé) ===== */}
          <SectionHeader title="Ferramentas do EasyTrip" styles={styles} />
          <FlatList
            horizontal
            data={features}
            keyExtractor={(i) => i.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <FeatureCard item={item} styles={styles} />}
          />

          {/* From Editors */}
          <SectionHeader title="From our editors" styles={styles} />
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop" }}
            style={{ height: 220, borderRadius: 20, overflow: "hidden" }}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.editorScrim} />
            <View style={{ position: "absolute", left: 16, bottom: 16 }}>
              <Text style={styles.h3}>6 must-visit ghost towns in the American West</Text>
              <Pressable style={[styles.cta, { marginTop: 8 }]}><Text style={[styles.text, { fontWeight: "700" }]}>Explore</Text></Pressable>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>

      <BottomBar theme={theme} styles={styles} />
    </SafeAreaView>
  );
}

// ---------- STYLES (dinâmicos por tema) ----------
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },

    text: { color: theme.text },
    textMuted: { color: theme.textMuted },

    h1: { color: theme.text, fontSize: 24, fontWeight: "800", lineHeight: 28 },
    h2: { color: theme.text, fontSize: 20, fontWeight: "800" },
    h3: { color: theme.text, fontSize: 18, fontWeight: "800", lineHeight: 22 },

    // Header
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
    logoStar: { color: "#0A0A0B", fontSize: 14, lineHeight: 16, fontWeight: "900" }, // ✦
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

    // Chips (carrossel)
    chipsCarouselScroll: { overflow: "visible" },
    chipsCarousel: { paddingTop: 10, paddingBottom: 2, paddingRight: 8 },
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

    // Conteúdo
    hero: {
      height: 220,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.card,
    },
    heroScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
    cta: {
      marginTop: 10,
      alignSelf: "flex-start",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: ACCENT,
    },

    sectionHeader: {
      marginTop: 8,
      marginBottom: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    // Cards (hotéis/experiências/restaurantes)
    card: {
      backgroundColor: theme.cardAlt,
      borderRadius: 16,
      overflow: "hidden",
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

    // Próximos
    upcCard: {
      width: UPC_W,
      height: UPC_H,
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
      backgroundColor: Platform.OS === "ios" ? "rgba(56,242,193,0.15)" : "#0F1115",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    // Comunidade
    comCard: {
      width: COM_W,
      height: COM_H,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
    },
    comScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },

    // Ghost CTA (bordas verdes)
    ghostCta: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: ACCENT,
      backgroundColor: "transparent",
    },

    // Promoções
    promoCard: {
      width: Screen.width - 32,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
    },

    // Feature cards (em pé)
    featureCard: {
      width: FEAT_W,
      height: FEAT_H,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    featureScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
    featurePill: {
      alignSelf: "flex-start",
      backgroundColor: "#38F2C1",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },

    editorScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

    // Bottom bar
    bottomBarWrap: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    },
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

// Botão de coração sobre a imagem (fixo, não depende do tema)
const ss = StyleSheet.create({
  heartBtnOverlay: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});