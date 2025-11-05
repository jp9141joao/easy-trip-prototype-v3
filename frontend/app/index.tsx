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
  ImageErrorEventData,
  NativeSyntheticEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ACCENT = "#00AF87";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop";

/* ========== IMAGENS SEGURAS (com fallback) ========== */
type ImgProps = {
  uri: string;
  style?: any;
  imageStyle?: any;
  children?: React.ReactNode;
};

const SafeImageBackground = ({ uri, style, imageStyle, children }: ImgProps) => {
  const [src, setSrc] = useState<{ uri: string }>({ uri });
  const onErr = (_e: NativeSyntheticEvent<ImageErrorEventData>) =>
    setSrc({ uri: FALLBACK_IMG });

  return (
    <ImageBackground
      source={src}
      style={style}
      imageStyle={imageStyle}
      onError={onErr}
    >
      {children}
    </ImageBackground>
  );
};

const SafeImage = ({
  uri,
  style,
}: {
  uri: string;
  style?: any;
}) => {
  const [src, setSrc] = useState<{ uri: string }>({ uri });
  const onErr = (_e: NativeSyntheticEvent<ImageErrorEventData>) =>
    setSrc({ uri: FALLBACK_IMG });

  return <Image source={src} style={style} onError={onErr} />;
};

/* ========== TEMAS ========== */
type Theme = {
  bg: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
  scrim: string;
  scrimStrong: string;
};

const DARK: Theme = {
  bg: "#0A0A0B",
  card: "#121315",
  cardAlt: "#15171A",
  text: "#FFFFFF",
  textMuted: "#A1A1AA",
  border: "#23262B",
  scrim: "rgba(0,0,0,0.28)",
  scrimStrong: "rgba(0,0,0,0.38)",
};

const LIGHT: Theme = {
  bg: "#FFFFFF",
  card: "#F8FAFC",
  cardAlt: "#FFFFFF",
  text: "#0F1720",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  // scrim mais forte no claro para legibilidade sobre fotos
  scrim: "rgba(0,0,0,0.45)",
  scrimStrong: "rgba(0,0,0,0.55)",
};

/* ========== TIPAGENS ========== */
type CardItem = {
  id: string;
  title: string;
  location?: string;
  image: string;
  rating: number;
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
  dateLabel: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type CommunityPost = {
  id: string;
  title: string;
  author: string;
  minutes: number;
  image: string;
};

/* ========== DADOS (genéricos e com imagens temáticas) ========== */
// Hospedagens
const stays: CardItem[] = [
  {
    id: "s1",
    title: "Hotel Lutetia",
    location: "Paris, França",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764b8a?q=80&w=1400&auto=format&fit=crop",
    rating: 4.7,
    reviews: 2143,
    price: "A partir de US$ 220",
    badge: "2025",
  },
  {
    id: "s2",
    title: "Park Hyatt Tokyo",
    location: "Tóquio, Japão",
    image:
      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 1872,
    price: "A partir de US$ 310",
  },
  {
    id: "s3",
    title: "Copacabana Palace",
    location: "Rio de Janeiro, Brazil",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 3564,
    price: "A partir de US$ 260",
  },
  {
    id: "s4",
    title: "The Plaza",
    location: "Nova York, EUA",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 4231,
    price: "A partir de US$ 340",
  },
  {
    id: "s5",
    title: "Canaves Oia",
    location: "Santorini, Grécia",
    image:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 1978,
    price: "A partir de US$ 295",
  },
];

// Experiências
const experiences: CardItem[] = [
  {
    id: "e1",
    title: "Kayak em Halong Bay",
    location: "Vietnã",
    image:
      "https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 965,
    price: "A partir de US$ 45 / adulto",
  },
  {
    id: "e2",
    title: "Aurora Boreal",
    location: "Tromsø, Noruega",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop",
    rating: 5.0,
    reviews: 1391,
    price: "A partir de US$ 120 / adulto",
    badge: "2025",
  },
  {
    id: "e3",
    title: "Safari no Masai Mara",
    location: "Quênia",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 751,
    price: "A partir de US$ 350 / dia",
  },
];

// Restaurantes
const restaurants: CardItem[] = [
  {
    id: "r1",
    title: "Sushi Saito",
    location: "Tóquio • Sushi",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 2301,
    price: "$$$$",
  },
  {
    id: "r2",
    title: "Le Petit Bistro",
    location: "Paris • Bistrô",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 3188,
    price: "$$ • $$$",
  },
  {
    id: "r3",
    title: "Fogo Carioca",
    location: "Rio • Churrascaria",
    image:
      "https://images.unsplash.com/photo-1544025163-72b0fbf6d9ae?q=80&w=1400&auto=format&fit=crop",
    rating: 4.5,
    reviews: 1983,
    price: "$$ • $$$",
  },
  {
    id: "r4",
    title: "Joe's Pizza",
    location: "Nova York • Pizza",
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1400&auto=format&fit=crop",
    rating: 4.7,
    reviews: 4123,
    price: "$",
  },
  {
    id: "r5",
    title: "Trattoria Roma",
    location: "Roma • Massas",
    image:
      "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 1677,
    price: "$$",
  },
];

// Central de recursos (imagens específicas por funcionalidade)
const features: FeatureItem[] = [
  { key: "ai",          title: "Ajuda por IA",           subtitle: "Planeje em segundos",   icon: "flash",              image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop" },
  { key: "diario",      title: "Diário de bordo",        subtitle: "Memórias da viagem",    icon: "book",               image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?q=80&w=1400&auto=format&fit=crop" },
  { key: "itinerario",  title: "Itinerário",             subtitle: "Dia a dia organizado",  icon: "map",                image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop" },
  { key: "gastos",      title: "Gastos",                 subtitle: "Controle de despesas",  icon: "cash",               image: "https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1400&auto=format&fit=crop" },
  { key: "agenda",      title: "Agenda",                 subtitle: "Compromissos e alertas",icon: "calendar",           image: "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1400&auto=format&fit=crop" },
  { key: "fotos",       title: "Fotos",                  subtitle: "Álbuns compartilhados", icon: "images",             image: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1400&auto=format&fit=crop" },
  { key: "porquinho",   title: "Porquinho",              subtitle: "Cofrinho da viagem",    icon: "wallet",             image: "https://images.unsplash.com/photo-1605902711834-8b11c3a3e2d7?q=80&w=1400&auto=format&fit=crop" },
  { key: "especialista",title: "Falar com especialista", subtitle: "Atendimento humano",    icon: "chatbubbles",        image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1400&auto=format&fit=crop" },
  { key: "moedas",      title: "Cotação de moedas",      subtitle: "Câmbio em tempo real",  icon: "swap-horizontal",    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop" },
  { key: "assessoria",  title: "Assessoria",             subtitle: "Vistos e suporte",      icon: "shield-checkmark",   image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop" },
];

// Próximos
const upcoming: UpcomingItem[] = [
  { id: "u1", dateLabel: "24 Nov", title: "Entrada: Rio de Janeiro", icon: "calendar" },
  { id: "u2", dateLabel: "02 Dez", title: "Trilha Aconcágua", icon: "map" },
  { id: "u3", dateLabel: "15 Dez", title: "Voo para Cusco", icon: "airplane" },
];

// Comunidade
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

/* ========== DIMENSÕES ========== */
const Screen = Dimensions.get("window");
const CARD_W = Math.min(Screen.width * 0.62, 320);
const FEAT_W = Math.min(Screen.width * 0.56, 260);
const FEAT_H = Math.round(FEAT_W * 1.5);
const UPC_W = Math.min(Screen.width * 0.78, 320);
const UPC_H = 90;
const COM_W = Math.min(Screen.width * 0.84, 360);
const COM_H = 260;

/* ========== UTILITÁRIOS ========== */
function toDots(n: number): boolean[] {
  const round = Math.round(n);
  return new Array(5).fill(false).map((_, i) => i < round);
}

/* ========== UI COMPARTILHADA ========== */
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
        <Text style={[styles.textMuted, { fontWeight: "700", color: ACCENT }]}>
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

// coração vermelho quando favoritado
const HeartButton = ({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) => (
  <Pressable
    onPress={onToggle}
    style={[ss.heartBtnOverlay, active && ss.heartBtnActive]}
  >
    <Ionicons
      name={active ? "heart" : "heart-outline"}
      size={20}
      color={active ? "#FF3B30" : "#0F1720"}
    />
  </Pressable>
);

/* ========== CARTÕES ========== */
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
  <View style={[styles.card, styles.shadow, { width: CARD_W }]}>
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

// Cartão de recurso
const FeatureCard = ({ item, styles }: { item: FeatureItem; styles: any }) => (
  <Pressable style={[styles.featureCard, styles.shadow]}>
    <SafeImageBackground uri={item.image} style={{ flex: 1 }} imageStyle={{ borderRadius: 16 }}>
      <View style={styles.featureScrim} />
      <View style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>{item.title}</Text>
        {item.subtitle && <Text style={{ color: "#F3F4F6", fontSize: 13, marginTop: 2 }}>{item.subtitle}</Text>}
      </View>
    </SafeImageBackground>
  </Pressable>
);

// Próximos
const UpcomingCard = ({ item, styles }: { item: UpcomingItem; styles: any }) => (
  <Pressable style={[styles.upcCard, styles.shadow]}>
    <View style={styles.upcIconPill}>
      <Ionicons name={item.icon} size={18} color={ACCENT} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.textMuted, { fontWeight: "700" }]}>{item.dateLabel}</Text>
      <Text numberOfLines={1} style={[styles.text, { fontWeight: "800", fontSize: 16 }]}>
        {item.title}
      </Text>
    </View>
  </Pressable>
);

// Comunidade
const CommunityCard = ({ post, styles }: { post: CommunityPost; styles: any }) => (
  <Pressable style={[styles.comCard, styles.shadow]}>
    <SafeImageBackground
      uri={post.image}
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
    </SafeImageBackground>

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

// Promoção
const PromoCard = ({ styles }: { styles: any }) => (
  <Pressable style={[styles.promoCard, styles.shadow]}>
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ color: ACCENT, fontWeight: "800" }}>Promoções</Text>
      <Text style={{ color: styles.text.color, fontSize: 18, fontWeight: "800", lineHeight: 22 }}>
        Novas ofertas todos os dias
      </Text>
      <Pressable style={styles.ghostCta}>
        <Text style={{ color: ACCENT, fontWeight: "700" }}>Ver agora</Text>
      </Pressable>
    </View>
    <SafeImage uri={promo.image} style={{ width: 130, height: 96, borderRadius: 12, marginRight: 16 }} />
  </Pressable>
);

/* ========== CABEÇALHO E RODAPÉ ========== */
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
    Ordenar: ["Melhor avaliados", "Menor preço", "Mais próximos"],
    Quando: ["Qualquer data", "Esta semana", "Este mês"],
    "Tipo de hospedagem": ["Hotel", "Casa", "Vila"],
    "Adicionar hóspede": ["1 hóspede", "2 hóspedes", "3+ hóspedes"],
  };

  return (
    <View style={{ backgroundColor: theme.bg }}>
      <View style={[styles.headerLightWrap, { paddingTop: topInset + 8 }]}>
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

        {/* Busca */}
        <View style={styles.searchPill}>
          <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Destinos, passeios, hotéis..."
              placeholderTextColor={theme.textMuted}
              returnKeyType="search"
              onSubmitEditing={() => console.log("buscar:", query)}
              style={{ color: theme.text, fontWeight: "700", padding: 0 }}
            />
          </View>
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsCarouselScroll}
          contentContainerStyle={styles.chipsCarousel}
        >
          {Object.keys(opts).map((label) => (
            <View key={label} style={styles.chipWrap}>
              <Pressable
                style={styles.lightChip}
                onPress={() => setOpen(open === label ? null : label)}
              >
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "600" }}>
                  {label}
                </Text>
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

const BottomBar = ({ theme, styles }: { theme: Theme; styles: any }) => {
  const items = [
    { key: "explore", label: "Início", icon: "home-outline", activeIcon: "home" },
    { key: "search", label: "Buscar", icon: "search-outline", activeIcon: "search" },
    { key: "trips", label: "Viagens", icon: "heart-outline", activeIcon: "heart" },
    { key: "review", label: "Avaliar", icon: "create-outline", activeIcon: "create" },
    { key: "account", label: "Conta", icon: "person-outline", activeIcon: "person" },
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

/* ========== PRINCIPAL ========== */
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
          {/* Destaque (imagem trocada nos editores mais abaixo) */}
          <SafeImageBackground
            uri="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop"
            style={styles.hero}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.heroScrim} />
            <View style={{ position: "absolute", left: 16, bottom: 16, right: 16 }}>
              <Text style={{ color: "#fff", opacity: 0.9, marginBottom: 6 }}>Recompensas EasyTrip</Text>
              <Text style={[styles.h1, { color: "#fff" }]}>Receba 5% de volta nas melhores hospedagens</Text>
              <Pressable style={styles.cta}>
                <Text style={styles.ctaText}>Encontrar hotel</Text>
              </Pressable>
            </View>
          </SafeImageBackground>

          {/* Hospedagens (título curto) */}
          <SectionHeader title="Melhores hospedagens" action={{ label: "Ver tudo", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={stays}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <SmallCard
                item={item}
                fav={!!favorites[item.id]}
                onToggleFav={() => toggleFav(item.id)}
                styles={styles}
              />
            )}
          />

          {/* Experiências */}
          <SectionHeader title="Experiências imperdíveis" action={{ label: "Ver tudo", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={experiences}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <SmallCard
                item={item}
                fav={!!favorites[item.id]}
                onToggleFav={() => toggleFav(item.id)}
                styles={styles}
              />
            )}
          />

          {/* Restaurantes */}
          <SectionHeader title="Restaurantes populares" action={{ label: "Ver tudo", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={restaurants}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <SmallCard
                item={item}
                fav={!!favorites[item.id]}
                onToggleFav={() => toggleFav(item.id)}
                styles={styles}
              />
            )}
          />

          {/* Próximos */}
          <SectionHeader title="Próximos" action={{ label: "Ver agenda", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={upcoming}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <UpcomingCard item={item} styles={styles} />}
          />

          {/* Da comunidade */}
          <SectionHeader title="Da comunidade" action={{ label: "Ver mais", onPress: () => {} }} styles={styles} />
          <FlatList
            horizontal
            data={community}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <CommunityCard post={item} styles={styles} />}
          />

          {/* Promoções */}
          <PromoCard styles={styles} />

          {/* Central de recursos */}
          <SectionHeader title="Central de recursos" styles={styles} />
          <FlatList
            horizontal
            data={features}
            keyExtractor={(i) => i.key}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.featureCarousel}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <FeatureCard item={item} styles={styles} />}
          />

          {/* Dos nossos editores — IMAGEM TROCADA */}
          <SectionHeader title="Dos nossos editores" styles={styles} />
          <SafeImageBackground
            uri="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1400&auto=format&fit=crop"
            style={{ height: 220, borderRadius: 20, overflow: "hidden" }}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.editorScrim} />
            <View style={{ position: "absolute", left: 16, bottom: 16 }}>
              <Text style={[styles.h3, { color: "#fff" }]}>Estradas cênicas imperdíveis nesta temporada</Text>
              <Pressable style={[styles.cta, { marginTop: 8 }]}>
                <Text style={styles.ctaText}>Explorar</Text>
              </Pressable>
            </View>
          </SafeImageBackground>
        </View>
      </ScrollView>

      <BottomBar theme={theme} styles={styles} />
    </SafeAreaView>
  );
}

/* ========== STYLES (com sombra no light) ========== */
const createStyles = (theme: Theme) => {
  const isLight = theme.bg === "#FFFFFF";
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },

    text: { color: theme.text },
    textMuted: { color: theme.textMuted },

    h1: { color: theme.text, fontSize: 24, fontWeight: "800", lineHeight: 28 },
    h2: { color: theme.text, fontSize: 20, fontWeight: "800" },
    h3: { color: theme.text, fontSize: 18, fontWeight: "800", lineHeight: 22 },

    // sombra aplicada nos cards apenas no light
    shadow: isLight
      ? {
          shadowColor: "#0F172A",
          shadowOpacity: 0.15,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 12 },
          elevation: 10,
        }
      : {},

    /* Header */
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

    // Chips
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

    /* Conteúdo */
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

    /* Cards comuns */
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

    /* Próximos */
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
      backgroundColor: "rgba(56,242,193,0.15)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    /* Comunidade */
    comCard: {
      width: COM_W,
      height: COM_H,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
    },
    comScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrim },

    /* Botão fantasma */
    ghostCta: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: ACCENT,
      backgroundColor: "transparent",
    },

    /* Promoções */
    promoCard: {
      width: Screen.width - 32,
      borderRadius: 18,
      backgroundColor: theme.cardAlt,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
    },

    /* Central de recursos */
    featureCard: {
      width: FEAT_W,
      height: FEAT_H,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    featureScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrim },

    editorScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.scrimStrong },

    /* Barra inferior */
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

/* sobreposição do coração */
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
  heartBtnActive: {
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
});
