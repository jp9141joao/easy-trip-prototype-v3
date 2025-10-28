import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  PanResponder,
  Animated,
  Easing,
} from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ---------------- Theme / Layout ----------------
const BRAND = '#00AF87' as const;
const FRAME_W = 390;
const VISIBLE_RANGE = 1;
const SWIPE_THRESHOLD = 40; // deslize mínimo p/ trocar card

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// espaçamentos dos carrosséis (MAIOR p/ dar sombra)
const CAROUSEL_PAD_H = 14;
const CAROUSEL_PAD_B = Platform.OS === 'android' ? 32 : 24;

// ---------------- Types ----------------
interface Trip {
  title: string;
  subtitle: string;
  price: string;
  city: string;
  img: string;
}

type ActionKey =
  | 'social'
  | 'promos'
  | 'logbook'
  | 'ai'
  | 'itinerary'
  | 'gastos'
  | 'agenda'
  | 'fotos'
  | 'expert'
  | 'currency'
  | 'advisory'; // ✅ novo: Assessoria

interface Action {
  key: ActionKey;
  label: string;
}

interface Benefit {
  key: string;
  title: string;
  text: string;
  icon: string;
}

type PlacesTab = 'hotels' | 'restaurants';
type BottomTab = 'home' | 'discover' | 'trips' | 'profile';

// ---------------- Utils ----------------
function hexOpacity(hex: string, alpha: number = 0.15): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const shadow = (elev: number = 12): ViewStyle => ({
  elevation: elev, // Android
  shadowColor: '#000', // iOS/Web
  shadowOpacity: 0.16,
  shadowOffset: { width: 0, height: Math.max(2, Math.round(elev / 2)) },
  shadowRadius: Math.max(4, elev),
});

function BlockableView({
  blocked,
  style,
  children,
}: {
  blocked: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  if (Platform.OS === 'web') {
    const webPE: any = { pointerEvents: blocked ? 'none' : 'auto' };
    return <View style={[style, webPE]}>{children}</View>;
  }
  return (
    <View pointerEvents={blocked ? 'none' : 'auto'} style={style}>
      {children}
    </View>
  );
}

// ---- Safe avatar ----
const DEFAULT_AVATAR = 'https://i.pravatar.cc/120?img=12';
function SafeAvatar({ uri = DEFAULT_AVATAR, size = 44 }: { uri?: string; size?: number }) {
  const [ok, setOk] = useState(true);
  const radius = size / 2;
  return (
    <View
      style={{
        height: size,
        width: size,
        borderRadius: radius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {ok ? (
        <Image source={{ uri }} onError={() => setOk(false)} resizeMode="cover" style={{ height: '100%', width: '100%' }} />
      ) : (
        <Ionicons name="person-circle-outline" size={Math.round(radius * 1.2)} color="#9ca3af" />
      )}
    </View>
  );
}

// ---- Card shell (garante sombra arredondada no Android) ----
function CardShell({
  children,
  radius = 24,
  elevation = 10,
  style,
  border = true,
}: {
  children: React.ReactNode;
  radius?: number;
  elevation?: number;
  style?: StyleProp<ViewStyle>;
  border?: boolean;
}) {
  const outer: ViewStyle = {
    borderRadius: radius,
    backgroundColor: '#fff',
    ...shadow(elevation),
    ...(Platform.OS === 'android'
      ? {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
        }
      : null),
  };
  return (
    <View style={[outer, style]}>
      <View style={{ borderRadius: radius, backgroundColor: '#fff' }}>
        <View style={{ borderRadius: radius, overflow: 'hidden', borderWidth: border ? 1 : 0, borderColor: '#e5e7eb' }}>
          {children}
        </View>
      </View>
    </View>
  );
}

// ---------------- Data ----------------
const trips: Trip[] = [
  { title: 'Mount Aconcagua – Circuito completo', subtitle: 'South America', price: '$1,250', city: 'Mendoza, AR', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Rio de Janeiro — Pão de Açúcar + Cristo Redentor', subtitle: 'Brazil', price: '$980', city: 'Rio, BR', img: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Cusco & Machu Picchu', subtitle: 'Peru', price: '$1,420', city: 'Cusco, PE', img: 'https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Torres del Paine', subtitle: 'Chile', price: '$1,150', city: 'Puerto Natales, CL', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Salar de Uyuni (Expedição 3 dias)', subtitle: 'Bolivia', price: '$890', city: 'Uyuni, BO', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Deserto do Atacama', subtitle: 'Chile', price: '$960', city: 'San Pedro de Atacama, CL', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Cartagena das Índias', subtitle: 'Colombia', price: '$820', city: 'Cartagena, CO', img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Fernando de Noronha', subtitle: 'Brazil', price: '$1,480', city: 'Pernambuco, BR', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop' },
];

const hotels = [
  { id: 'h1', title: 'Deep River', img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop', price: '$110 / night' },
  { id: 'h2', title: 'Arabella', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop', price: '$120 / night' },
  { id: 'h3', title: 'Cyan Resort', img: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop', price: '$140 / night' },
];

// ✅ imagens estáveis
const restaurants = [
  { id: 'r1', title: 'Pasta Nostra', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop', price: '$$' },
  { id: 'r2', title: 'Sushi & Co', img: 'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1200&auto=format&fit=crop', price: '$$$' },
  { id: 'r3', title: 'Choripán House', img: 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop', price: '$' },
  { id: 'r4', title: 'Prime Steak', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop', price: '$$$' },
  { id: 'r5', title: 'La Pizzeria', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop', price: '$$' },
];

const upcomingTrips = [
  { id: 'u1', date: '24 Nov', title: 'Check-in: Rio de Janeiro', icon: 'calendar' as const },
  { id: 'u2', date: '02 Dez', title: 'Trilha Aconcágua', icon: 'map' as const },
  { id: 'u3', date: '15 Dez', title: 'Voo para Cusco', icon: 'airplane' as const },
];

const quickActions: Action[] = [
  { key: 'social', label: 'Rede Social' },
  { key: 'promos', label: 'Promoções' },
  { key: 'logbook', label: 'Diário de bordo' },
];

// 👉 ordem mantida; “Cotação” e “Assessoria” são os dois últimos
const moreActions: Action[] = [
  { key: 'ai', label: 'Ajuda por IA' },
  { key: 'itinerary', label: 'Itinerário' },
  { key: 'gastos', label: 'Gastos' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'fotos', label: 'Fotos' },
  { key: 'expert', label: 'Falar com especialista' },
  { key: 'currency', label: 'Cotação de moedas' },
  { key: 'advisory', label: 'Assessoria' }, // ✅ do lado da “Cotação”
];

const benefits: Benefit[] = [
  { key: 'culture', title: 'Exposição Cultural', text: 'Descubra tradições, culinárias e estilos de vida diferentes ao redor do mundo.', icon: 'image-multiple-outline' },
  { key: 'growth', title: 'Crescimento Pessoal', text: 'Planeje melhor, conheça pessoas novas e desenvolva autonomia viajando.', icon: 'star-outline' },
  { key: 'memories', title: 'Memórias', text: 'Registre fotos e diário de bordo, e guarde momentos para sempre.', icon: 'camera-outline' },
  { key: 'stress', title: 'Redução do Estresse', text: 'Organize sua viagem com agenda e gastos claros para curtir sem preocupação.', icon: 'calendar-month-outline' },
];

// ---------------- Small UI bits ----------------
function Chip({ active, children, onPress }: { active: boolean; children: React.ReactNode; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, { borderColor: active ? BRAND : '#e5e7eb', backgroundColor: active ? BRAND : 'transparent' }]}>
      <Text style={{ color: active ? '#fff' : '#4b5563', fontSize: 14 }}>{children}</Text>
    </TouchableOpacity>
  );
}

function IconPill({ children }: { children: React.ReactNode }) {
  return <View style={[styles.iconPill, shadow(8)]}>{typeof children === 'string' ? <Text style={{ fontSize: 16 }}>{children}</Text> : children}</View>;
}

function SafeImage({ uri, alt }: { uri: string; alt?: string }) {
  const [ok, setOk] = useState<boolean>(true);
  return ok ? (
    <Image source={{ uri }} onError={() => setOk(false)} resizeMode="cover" style={{ width: '100%', height: '100%' }} accessibilityLabel={alt || 'image'} />
  ) : (
    <View style={{ flex: 1, backgroundColor: hexOpacity(BRAND, 0.25), alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: BRAND, fontWeight: '700' }}>{alt || 'EasyTrip'}</Text>
    </View>
  );
}

// ❤️ Like (coração) com animação
function LikePill() {
  const [liked, setLiked] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setLiked((v) => !v);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.iconPill, shadow(8), { transform: [{ scale }] }]}>
        {liked ? <Ionicons name="heart" size={16} color="#ef4444" /> : <Ionicons name="heart-outline" size={16} color="#111" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

// 🏳️ Bandeira/Bookmark com animação (preenche ao tocar)
function FlagPill() {
  const [flagged, setFlagged] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setFlagged((v) => !v);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.iconPill, shadow(8), { transform: [{ scale }] }]}>
        {flagged ? <Ionicons name="bookmark" size={16} color={BRAND} /> : <Ionicons name="bookmark-outline" size={16} color="#111" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ---------------- Icon helpers ----------------
function actionIcon(key: ActionKey, color: string) {
  switch (key) {
    case 'social':
      return <Ionicons name="chatbubbles-outline" size={18} color={color} />;
    case 'promos':
      return <Ionicons name="pricetags-outline" size={18} color={color} />;
    case 'logbook':
      return <Ionicons name="book-outline" size={18} color={color} />;
    case 'ai':
      return <Ionicons name="sparkles-outline" size={18} color={color} />;
    case 'itinerary':
      return <Ionicons name="map-outline" size={18} color={color} />;
    case 'gastos':
      return <Ionicons name="wallet-outline" size={18} color={color} />;
    case 'agenda':
      return <Ionicons name="calendar-outline" size={18} color={color} />;
    case 'fotos':
      return <Ionicons name="camera-outline" size={18} color={color} />;
    case 'expert':
      return <Ionicons name="logo-whatsapp" size={18} color={color} />;
    case 'currency':
      return <Ionicons name="cash-outline" size={18} color={color} />;
    case 'advisory':
      return <Ionicons name="headset-outline" size={18} color={color} />; // ✅ Assessoria
    default:
      return <Ionicons name="ellipse-outline" size={18} color={color} />;
  }
}

function benefitIcon(name: string, color: string) {
  return <MaterialCommunityIcons name={name as any} size={18} color={color} />;
}

function upcomingIcon(kind: 'calendar' | 'map' | 'airplane', color: string) {
  if (kind === 'map') return <Ionicons name="map-outline" size={18} color={color} />;
  if (kind === 'airplane') return <Ionicons name="airplane-outline" size={18} color={color} />;
  return <Ionicons name="calendar-outline" size={18} color={color} />;
}

// ---------------- SearchBar (com dropdown animado) ----------------
function SearchBar() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(-8)).current;

  const [type, setType] = useState<'todos' | 'hotels' | 'restaurants'>('todos');
  const [price, setPrice] = useState<'$' | '$$' | '$$$' | null>(null);
  const [openNow, setOpenNow] = useState(false);

  const toggleDropdown = () => {
    if (open) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(slide, { toValue: -8, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
  };

  const applyFilters = () => {
    Alert.alert('Filtros aplicados', `Tipo: ${type}\nPreço: ${price ?? 'qualquer'}\nAberto agora: ${openNow ? 'sim' : 'não'}`);
    toggleDropdown();
  };

  const clearFilters = () => {
    setType('todos');
    setPrice(null);
    setOpenNow(false);
  };

  return (
    <View style={{ position: 'relative' }}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#6b7280" style={{ marginRight: 8 }} />
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Buscar destinos, cidades..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={toggleDropdown} style={styles.filterPill}>
          <Text style={styles.filterPillText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {open && (
        <Animated.View
          style={[
            styles.dropdown,
            shadow(14),
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <Text style={styles.dropdownTitle}>Filtros</Text>

          <View style={styles.dropdownRow}>
            <Text style={styles.dropdownLabel}>Tipo</Text>
            <View style={styles.dropdownChips}>
              {(['todos', 'hotels', 'restaurants'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.ddChip,
                    t === type && { backgroundColor: hexOpacity(BRAND, 0.15), borderColor: BRAND },
                  ]}
                >
                  <Text style={[styles.ddChipText, t === type && { color: BRAND, fontWeight: '700' }]}>
                    {t === 'todos' ? 'Todos' : t === 'hotels' ? 'Hotéis' : 'Restaurantes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dropdownRow}>
            <Text style={styles.dropdownLabel}>Preço</Text>
            <View style={styles.dropdownChips}>
              {(['$', '$$', '$$$'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPrice((prev) => (prev === p ? null : p))}
                  style={[
                    styles.ddChip,
                    price === p && { backgroundColor: hexOpacity(BRAND, 0.15), borderColor: BRAND },
                  ]}
                >
                  <Text style={[styles.ddChipText, price === p && { color: BRAND, fontWeight: '700' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setOpenNow((v) => !v)}
            style={[styles.rowBetween, { paddingVertical: 8 }]}
          >
            <Text style={styles.dropdownLabel}>Aberto agora</Text>
            <View
              style={{
                height: 20,
                width: 36,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: openNow ? BRAND : '#e5e7eb',
                backgroundColor: openNow ? hexOpacity(BRAND, 0.2) : '#fff',
                alignItems: openNow ? 'flex-end' : 'flex-start',
                padding: 2,
              }}
            >
              <View
                style={{
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  backgroundColor: openNow ? BRAND : '#9ca3af',
                }}
              />
            </View>
          </TouchableOpacity>

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <TouchableOpacity onPress={clearFilters} style={[styles.btnOutline, { borderColor: '#e5e7eb' }]}>
              <Text style={{ color: '#374151', fontWeight: '700' }}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters} style={styles.btnSolid}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ---------------- Cards ----------------
// Overlap/Stack cards no estilo do mock (inclinação + glass panel)
function OverlapCard({
  trip,
  index,
  activeIndex,
  onSelect,
}: {
  trip: Trip;
  index: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const offset = index - activeIndex;
  if (Math.abs(offset) > VISIBLE_RANGE) return null;

  const depth = Math.abs(offset);
  const scale = Math.max(0.88, 1 - depth * 0.07);
  const translateX = offset * 26;
  const translateY = depth * 18 + (offset !== 0 ? 8 : 0);
  const rotate = offset === 0 ? '0deg' : `${offset > 0 ? 7 : -7}deg`;
  const z = 100 - depth;

  const baseStyle: ViewStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    transform: [{ translateX }, { translateY }, { scale }, { rotate }],
    zIndex: z,
    width: '100%',
  };

  const dimAlpha = depth === 0 ? 0.22 : 0.38;
  const sideTint = offset === 0 ? 'transparent' : offset < 0 ? 'rgba(80,140,255,0.18)' : 'rgba(255,120,120,0.18)';

  return (
    <BlockableView blocked={depth > 1} style={baseStyle}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect(index)}>
        <CardShell radius={26} elevation={16}>
          <View style={{ position: 'relative', height: 288, width: '100%', backgroundColor: '#000' }}>
            <SafeImage uri={trip.img} alt={trip.title} />
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${dimAlpha})` }} />
            {depth > 0 && <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: sideTint }} />}

            {/* top pills */}
            <View style={{ position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ opacity: 0.9 }}>
                {/* 🏳️ Flag animada */}
                <FlagPill />
              </View>
              <View style={{ opacity: 0.9 }}>
                {/* ❤️ Like animado */}
                <LikePill />
              </View>
            </View>

            {/* glass panel no rodapé */}
            <View style={styles.glassBox}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }} numberOfLines={1}>
                  {trip.title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }} numberOfLines={1}>
                  {trip.subtitle} • {trip.city}
                </Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert(`Abrir detalhes de ${trip.title}`)} style={styles.glassBtn}>
                <Ionicons name="time-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </CardShell>
      </TouchableOpacity>
    </BlockableView>
  );
}

const MiniTile = React.memo(function MiniTile({ title, img, price }: { title: string; img: string; price?: string }) {
  return (
    <CardShell radius={16} elevation={10} style={{ width: 220 }}>
      <View>
        <View style={{ height: 120, width: '100%' }}>
          <SafeImage uri={img} alt={title} />
        </View>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: hexOpacity(BRAND, 0.12),
                marginRight: 8,
              }}
            >
              <Ionicons name="star" size={12} color={BRAND} />
            </View>
            <Text style={{ color: '#374151', fontSize: 14 }}>5.0</Text>
          </View>
          <Text style={{ marginTop: 4, color: '#111827', fontWeight: '600' }} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {!!price && <Text style={{ color: '#6b7280', fontSize: 12 }}>From {price}</Text>}
        </View>
      </View>
    </CardShell>
  );
});

function UpcomingItem({ date, title, icon }: { date: string; title: string; icon: 'calendar' | 'map' | 'airplane' }) {
  return (
    <CardShell radius={16} elevation={10} style={{ width: 260 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: hexOpacity(BRAND, 0.12),
            marginRight: 12,
          }}
        >
          {upcomingIcon(icon, BRAND)}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>{date}</Text>
          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '600' }} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </View>
    </CardShell>
  );
}

function CommunityCarousel() {
  const posts: { id: number; title: string; author: string; minutes: number; img: string }[] = [
    { id: 1, title: 'Melhores mirantes do Rio de Janeiro (2025)', author: 'Layabghiyan', minutes: 2, img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1200&auto=format&fit=crop' },
    { id: 2, title: 'Trilhas imperdíveis em Cusco', author: 'Mariana P.', minutes: 4, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop' },
    { id: 3, title: 'Cafés instagramáveis em Buenos Aires', author: 'Gustavo R.', minutes: 3, img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1200&auto=format&fit=crop' },
  ];

  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontWeight: '700', color: '#111827', fontSize: 18 }}>Da comunidade</Text>
        <TouchableOpacity onPress={() => Alert.alert('Ver mais posts')}>
          <Text style={{ color: BRAND, fontSize: 14 }}>Ver mais</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: CAROUSEL_PAD_H, paddingRight: CAROUSEL_PAD_H, paddingBottom: CAROUSEL_PAD_B }}
      >
        {posts.map((p) => (
          <View key={p.id} style={{ marginRight: 16 }}>
            <CardShell radius={24} elevation={10} style={{ width: 288, minWidth: 260 }}>
              <View>
                <View style={{ height: 160, width: '100%' }}>
                  <SafeImage uri={p.img} alt={p.title} />
                  <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                  <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.9 }}>Da comunidade</Text>
                    <Text style={{ color: '#fff', fontWeight: '700', lineHeight: 22, fontSize: 18 }} numberOfLines={2} ellipsizeMode="tail">
                      {p.title}
                    </Text>
                  </View>
                </View>
                <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>
                    Por <Text style={{ color: '#111827', fontWeight: '600' }}>{p.author}</Text> • {p.minutes} min
                  </Text>
                  <TouchableOpacity onPress={() => Alert.alert(`Abrir: ${p.title}`)} style={[styles.btnOutlineSm, { borderColor: BRAND }]}>
                    <Text style={{ color: BRAND, fontSize: 12, fontWeight: '700' }}>Ler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CardShell>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function BenefitCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <CardShell radius={24} elevation={6}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <View style={{ height: 36, width: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: hexOpacity(BRAND, 0.1), marginRight: 12 }}>
          {benefitIcon(icon, '#111')}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: '#111827' }} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={{ color: '#4b5563', fontSize: 13, marginTop: 4 }} numberOfLines={2} ellipsizeMode="tail">
            {text}
          </Text>
        </View>
      </View>
    </CardShell>
  );
}

function AboutSection() {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', lineHeight: 30 }}>
        Prepare-se para uma <Text style={{ color: BRAND }}>aventura inesquecível</Text>
      </Text>
      <Text style={{ color: '#4b5563', fontSize: 13, marginTop: 8 }}>
        Com a EasyTrip você planeja itinerários, controla gastos, registra memórias e encontra promoções — tudo em um só lugar. Explore novos destinos, aproveite boa comida e viva experiências únicas.
      </Text>
      <View style={{ marginTop: 16 }}>
        {benefits.map((b) => (
          <View key={b.key} style={{ marginBottom: 12 }}>
            <BenefitCard icon={b.icon} title={b.title} text={b.text} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------- Page ----------------
export default function Index() {
  const [active, setActive] = useState<number>(0);
  const [bottomTab, setBottomTab] = useState<BottomTab>('home');
  const [placesTab, setPlacesTab] = useState<PlacesTab>('hotels');

  const deckHeight = Math.min(300, Math.round(SCREEN_H * 0.44));

  // ✅ Swipe: PanResponder para trocar os cards do deck
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx } = gestureState;
        if (dx > SWIPE_THRESHOLD) {
          goPrev();
        } else if (dx < -SWIPE_THRESHOLD) {
          goNext();
        }
      },
    })
  ).current;

  const onAction = (key: ActionKey) => {
    const labels: Record<ActionKey, string> = {
      social: 'Abrir rede social de viagens',
      promos: 'Ver promoções diárias',
      logbook: 'Abrir diário de bordo',
      ai: 'Abrir assistente de IA (ChatGPT)',
      itinerary: 'Criar itinerário',
      gastos: 'Gestão de gastos',
      agenda: 'Abrir agenda',
      fotos: 'Abrir câmera / galeria',
      expert: 'Falar com especialista via WhatsApp',
      currency: 'Ver cotação de moedas',
      advisory: 'Abrir assessoria', // ✅ novo
    };
    Alert.alert(labels[key] || (key as string));
  };

  const goPrev = () => setActive((i) => (i - 1 + trips.length) % trips.length);
  const goNext = () => setActive((i) => (i + 1) % trips.length);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % trips.length), 5000);
    return () => clearInterval(id);
  }, []);

  const containerW = Platform.OS === 'web' ? Math.min(FRAME_W, SCREEN_W * 0.92) : SCREEN_W;
  const containerOuterStyle: ViewStyle = Platform.select({
    web: { width: containerW, borderRadius: 35, backgroundColor: '#fff', overflow: 'visible', borderWidth: 1, borderColor: '#e5e7eb', ...shadow(20) },
    default: { width: containerW, backgroundColor: '#fff' },
  }) as ViewStyle;

  const placeData = placesTab === 'hotels' ? hotels : restaurants;

  // 🔢 largura de cada card para garantir 3 por linha
  const ACTION_W = (containerW - 20 * 2 - 12 * 2) / 3;

  // 🧩 ações + spacer invisível NO FIM se sobrar 2 na última linha (para ficarem nas colunas 1 e 2)
  const baseActions = [...quickActions, ...moreActions] as Array<Action | { key: '__spacer__'; label?: '' }>;
  if (baseActions.length % 3 === 2) {
    // 👉 spacer no FINAL (coluna 3 vazia)
    baseActions.push({ key: '__spacer__' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={[containerOuterStyle]}>
        <View style={{ height: Platform.OS === 'web' ? 20 : 0 }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 160 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Logo ✦ mantém original */}
              <View style={{ height: 32, width: 32, borderRadius: 16, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>✦</Text>
              </View>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>EasyTrip</Text>
            </View>
            <SafeAvatar />
          </View>

          {/* Greeting */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', lineHeight: 24 }}>Olá, João Pedro</Text>
            <Text style={{ color: '#6b7280', fontSize: 13, lineHeight: 20, marginTop: 2 }} numberOfLines={1} ellipsizeMode="tail">
              Pense no melhor design para sua próxima viagem ✨
            </Text>
          </View>

          {/* Search */}
          <View style={{ marginTop: 16 }}>
            <SearchBar />
          </View>

          {/* Title */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', lineHeight: 32 }}>
              Encontre o <Text style={{ color: BRAND }}>lugar perfeito</Text>
            </Text>
          </View>

          {/* Deck / carousel (look da imagem) - agora com swipe */}
          <View style={{ marginTop: 24, height: deckHeight + 24 }} {...panResponder.panHandlers}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 16 }}>
              {trips.map((t, i) => (
                <OverlapCard key={t.title} trip={t} index={i} activeIndex={active} onSelect={setActive} />
              ))}
            </View>
            <View style={{ position: 'absolute', left: -8, top: deckHeight / 2 - 18, flexDirection: 'row' }}>
              <TouchableOpacity onPress={goPrev} style={[styles.navCircle]}>
                <Ionicons name="chevron-back" size={18} color="#111" />
              </TouchableOpacity>
              <View style={{ width: 8 }} />
              <TouchableOpacity onPress={goNext} style={[styles.navCircle]}>
                <Ionicons name="chevron-forward" size={18} color="#111" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hotels / Restaurants toggle + carousel */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ marginRight: 8 }}>
                <Chip active={placesTab === 'hotels'} onPress={() => setPlacesTab('hotels')}>
                  Hotels
                </Chip>
              </View>
              <Chip active={placesTab === 'restaurants'} onPress={() => setPlacesTab('restaurants')}>
                Restaurants
              </Chip>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: CAROUSEL_PAD_H, paddingRight: CAROUSEL_PAD_H, paddingBottom: CAROUSEL_PAD_B }}
            >
              {placeData.map((h) => (
                <View key={(h as any).id} style={{ marginRight: 12 }}>
                  <MiniTile title={(h as any).title} img={(h as any).img} price={'price' in h ? (h as any).price : undefined} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Próximos - carousel */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>Próximos</Text>
              <TouchableOpacity onPress={() => Alert.alert('Abrir agenda')}>
                <Text style={{ color: BRAND, fontSize: 14 }}>Ver agenda</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: CAROUSEL_PAD_H, paddingRight: CAROUSEL_PAD_H, paddingBottom: CAROUSEL_PAD_B }}
            >
              {upcomingTrips.map((u) => (
                <View key={u.id} style={{ marginRight: 12 }}>
                  <UpcomingItem date={u.date} title={u.title} icon={u.icon} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Comunidade */}
          <CommunityCarousel />

          {/* Promotions banner */}
          <CardShell radius={24} elevation={8} style={{ marginTop: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: BRAND, fontWeight: '700', fontSize: 13 }}>Promoções</Text>
                <Text style={{ color: '#374151' }} numberOfLines={2} ellipsizeMode="tail">
                  Novas ofertas todos os dias
                </Text>
                <TouchableOpacity onPress={() => Alert.alert('Ver promoções')} style={[styles.btnOutline, { borderColor: BRAND, marginTop: 10, alignSelf: 'flex-start' }]}>
                  <Text style={{ color: BRAND, fontWeight: '700' }}>Ver agora</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 90, width: 140, borderRadius: 16, overflow: 'hidden' }}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?q=80&w=800&auto=format&fit=crop' }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
              </View>
            </View>
          </CardShell>

          {/* 🔁 No lugar do "Nearby / Recommend / Share" */}
          <View style={{ marginTop: 24, marginBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Seus atalhos</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Acelere seu planejamento com ferramentas úteis</Text>
          </View>

          {/* Quick + More actions — 3 por linha; última linha com spacer no fim (coluna 3) */}
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {baseActions.map((a, idx) => {
                if ((a as any).key === '__spacer__') {
                  // coluna 3 vazia
                  return <View key={`spacer-${idx}`} style={{ width: ACTION_W, marginBottom: 12 }} />;
                }
                const act = a as Action;
                return (
                  <TouchableOpacity
                    key={`${act.key}-${idx}`}
                    onPress={() => onAction(act.key)}
                    style={[styles.actionCard, shadow(6), { marginBottom: 12, width: ACTION_W }]}
                  >
                    <View style={{ height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: hexOpacity(BRAND, 0.12), marginBottom: 8 }}>
                      {actionIcon(act.key, '#111')}
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600' }} numberOfLines={2} ellipsizeMode="tail">
                      {act.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 📦 Benefícios movidos para baixo dos ícones */}
          <AboutSection />
        </ScrollView>

        {/* Bottom nav */}
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 16 }}>
          <View style={[{ borderRadius: 24, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, shadow(14)]}>
            {[
              { key: 'home', label: 'Home', icon: (active: boolean) => <Ionicons name={active ? 'home' : 'home-outline'} size={18} color={active ? '#fff' : '#6b7280'} /> },
              { key: 'discover', label: 'Discover', icon: (active: boolean) => <Ionicons name={active ? 'compass' : 'compass-outline'} size={18} color={active ? '#fff' : '#6b7280'} /> },
              { key: 'trips', label: 'Minhas viagens', icon: (active: boolean) => <Ionicons name={active ? 'briefcase' : 'briefcase-outline'} size={18} color={active ? '#fff' : '#6b7280'} /> },
              { key: 'profile', label: 'Profile', icon: (active: boolean) => <Ionicons name={active ? 'person' : 'person-outline'} size={18} color={active ? '#fff' : '#6b7280'} /> },
            ].map((item) => {
              const isActive = bottomTab === (item.key as BottomTab);
              return (
                <TouchableOpacity key={item.key} onPress={() => setBottomTab(item.key as BottomTab)} style={{ alignItems: 'center' }}>
                  <View style={[styles.navIconCircle, isActive && { backgroundColor: BRAND }]}>{item.icon(isActive)}</View>
                  <Text style={{ marginTop: 4, fontSize: 12, fontWeight: '600', color: isActive ? BRAND : '#6b7280' }}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  iconPill: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  btnPillWhite: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  btnGo: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  btnOutlineSm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  btnSolid: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: BRAND,
    borderWidth: 1,
    borderColor: BRAND,
  },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
  },
  // --- SearchBar styles ---
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  filterPill: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexOpacity(BRAND, 0.1),
    marginLeft: 8,
  },
  filterPillText: { color: BRAND, fontWeight: '700', fontSize: 12 },
  // dropdown
  dropdown: {
    position: 'absolute',
    top: 52,
    right: 0,
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    zIndex: 50,
  },
  dropdownTitle: { fontWeight: '800', color: '#111827', marginBottom: 6 },
  dropdownRow: { marginTop: 8 },
  dropdownLabel: { color: '#374151', fontWeight: '600' },
  dropdownChips: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' } as any,
  ddChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  ddChipText: { color: '#374151', fontSize: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  navIconCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  // glass panel do card principal
  glassBox: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(17,17,17,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  glassBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
});
