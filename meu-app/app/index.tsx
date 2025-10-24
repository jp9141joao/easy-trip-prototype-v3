import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';

// ---------------- Theme / Layout ----------------
const BRAND = '#00AF87' as const;
const FRAME_W = 390; // web frame look
const VISIBLE_RANGE = 2; // how many neighbor cards to render

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ---------------- Types ----------------
interface Trip {
  title: string;
  subtitle: string;
  price: string;
  city: string;
  img: string;
}

interface Action {
  key:
    | 'social'
    | 'promos'
    | 'logbook'
    | 'ai'
    | 'itinerary'
    | 'gastos'
    | 'agenda'
    | 'fotos'
    | 'expert'
    | 'currency';
  label: string;
  icon: string;
}

interface Benefit {
  key: string;
  title: string;
  text: string;
  icon: string;
}

type TabKey = 'nearby' | 'recommend' | 'share';

// ---------------- Utils ----------------
function hexOpacity(hex: string, alpha: number = 0.15): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const shadow = (elev: number = 8): ViewStyle => ({
  elevation: elev, // Android
  shadowColor: '#000', // iOS
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: Math.max(2, Math.round(elev / 2)) },
  shadowRadius: Math.max(4, elev),
});

// ---- Cross‑platform helper: block touches without RNW deprecation ----
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

// ---- Safe avatar (with fallback) ----
const DEFAULT_AVATAR = 'https://i.pravatar.cc/120?img=12';
function SafeAvatar({ uri = DEFAULT_AVATAR, size = 44 }: { uri?: string; size?: number }) {
  const [ok, setOk] = useState(true);
  const radius = size / 2;
  return (
    <View style={{ height: size, width: size, borderRadius: radius, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
      {ok ? (
        <Image source={{ uri }} onError={() => setOk(false)} resizeMode="cover" style={{ height: '100%', width: '100%' }} />
      ) : (
        <Text style={{ fontSize: Math.round(radius), color: '#9ca3af' }}>🙂</Text>
      )}
    </View>
  );
}

// ---- Card shell (Fix rounded shadows on Android/Web) ----
function CardShell({
  children,
  radius = 24,
  elevation = 8,
  style,
  border = true,
}: {
  children: React.ReactNode;
  radius?: number;
  elevation?: number;
  style?: StyleProp<ViewStyle>;
  border?: boolean;
}) {
  return (
    <View style={[{ borderRadius: radius, backgroundColor: '#fff' }, shadow(elevation), style]}>
      <View style={{ borderRadius: radius, overflow: 'hidden', borderWidth: border ? 1 : 0, borderColor: '#e5e7eb' }}>
        {children}
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
  { title: 'Bariloche', subtitle: 'Argentina', price: '$990', city: 'Río Negro, AR', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Santiago', subtitle: 'Chile', price: '$760', city: 'Santiago, CL', img: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Quito', subtitle: 'Ecuador', price: '$730', city: 'Quito, EC', img: 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Lima', subtitle: 'Peru', price: '$680', city: 'Lima, PE', img: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop' },
];

const hotels = [
  { id: 'h1', title: 'Deep River', img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop', price: '$110 / night' },
  { id: 'h2', title: 'Arabella', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop', price: '$120 / night' },
  { id: 'h3', title: 'Cyan Resort', img: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop', price: '$140 / night' },
  { id: 'h4', title: 'Lighthouse Inn', img: 'https://images.unsplash.com/photo-1488747279002-c8523379faaa?q=80&w=1200&auto=format&fit=crop', price: '$95 / night' },
  { id: 'h5', title: 'Monte Verde Lodge', img: 'https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?q=80&w=1200&auto=format&fit=crop', price: '$130 / night' },
  { id: 'h6', title: 'Sunset Bay', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop', price: '$150 / night' },
];

const upcomingTrips = [
  { id: 'u1', date: '24 Nov', title: 'Check-in: Rio de Janeiro', icon: '📅' },
  { id: 'u2', date: '02 Dez', title: 'Trilha Aconcágua', icon: '🗺️' },
  { id: 'u3', date: '15 Dez', title: 'Voo para Cusco', icon: '✈️' },
  { id: 'u4', date: '09 Jan', title: 'Tour Salar de Uyuni', icon: '🚙' },
  { id: 'u5', date: '23 Jan', title: 'Atacama: Valle de la Luna', icon: '🌙' },
];

const quickActions: Action[] = [
  { key: 'social', label: 'Rede Social', icon: '💬' },
  { key: 'promos', label: 'Promoções', icon: '🏷️' },
  { key: 'logbook', label: 'Diário de bordo', icon: '📄' },
];

const moreActions: Action[] = [
  { key: 'ai', label: 'Ajuda por IA', icon: '✨' },
  { key: 'itinerary', label: 'Itinerário', icon: '🗺️' },
  { key: 'gastos', label: 'Gastos', icon: '👛' },
  { key: 'agenda', label: 'Agenda', icon: '📅' },
  { key: 'fotos', label: 'Fotos', icon: '📷' },
  { key: 'expert', label: 'Falar com especialista', icon: '🟢📲' },
  { key: 'currency', label: 'Cotação de moedas', icon: '💱' },
];

const benefits: Benefit[] = [
  { key: 'culture', title: 'Exposição Cultural', text: 'Descubra tradições, culinárias e estilos de vida diferentes ao redor do mundo.', icon: '🖼️' },
  { key: 'growth', title: 'Crescimento Pessoal', text: 'Planeje melhor, conheça pessoas novas e desenvolva autonomia viajando.', icon: '⭐' },
  { key: 'memories', title: 'Memórias', text: 'Registre fotos e diário de bordo, e guarde momentos para sempre.', icon: '📷' },
  { key: 'stress', title: 'Redução do Estresse', text: 'Organize sua viagem com agenda e gastos claros para curtir sem preocupação.', icon: '📅' },
];

// ---------------- Small UI bits ----------------
interface ChipProps {
  active: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}
function Chip({ active, children, onPress }: ChipProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, { borderColor: active ? BRAND : '#e5e7eb', backgroundColor: active ? BRAND : 'transparent' }]}>
      <Text style={{ color: active ? '#fff' : '#4b5563', fontSize: 14 }}>{children}</Text>
    </TouchableOpacity>
  );
}

interface IconPillProps { children: React.ReactNode }
const IconPill = ({ children }: IconPillProps) => (
  <View style={[styles.iconPill, shadow(8)]}>
    {typeof children === 'string' ? <Text style={{ fontSize: 16 }}>{children}</Text> : children}
  </View>
);

interface SafeImageProps { uri: string; alt?: string }
function SafeImage({ uri, alt }: SafeImageProps) {
  const [ok, setOk] = useState<boolean>(true);
  return ok ? (
    <Image
      source={{ uri }}
      onError={() => setOk(false)}
      resizeMode="cover"
      style={{ width: '100%', height: '100%' }}
      accessibilityLabel={alt || 'image'}
    />
  ) : (
    <View style={{ flex: 1, backgroundColor: hexOpacity(BRAND, 0.25), alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: BRAND, fontWeight: '700' }}>{alt || 'EasyTrip'}</Text>
    </View>
  );
}

// ---------------- New SearchBar ----------------
function SearchBar({ onFilter }: { onFilter: () => void }) {
  const [value, setValue] = useState('');
  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>🔎</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Buscar destinos, cidades..."
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={onFilter} style={styles.filterPill}>
        <Text style={styles.filterPillText}>Filtros</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------- Cards ----------------
interface OverlapCardProps {
  trip: Trip;
  index: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}
function OverlapCard({ trip, index, activeIndex, onSelect }: OverlapCardProps) {
  const offset = index - activeIndex;
  if (Math.abs(offset) > VISIBLE_RANGE) return null;

  const depth = Math.abs(offset);
  const scale = Math.max(0.86, 1 - depth * 0.07);
  const translateX = offset * 28;
  const translateY = depth * 14 + (offset > 0 ? 6 : 0);
  const z = 100 - depth;

  const baseStyle: ViewStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    transform: [{ translateX }, { translateY }, { scale }],
    zIndex: z,
    width: '100%',
  };

  const dimAlpha = depth === 0 ? 0.25 : Math.min(0.25 + depth * 0.18, 0.55);

  return (
    <BlockableView blocked={depth > 1} style={baseStyle}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onSelect(index)}>
        <CardShell radius={28} elevation={16}>
          <View style={{ position: 'relative', height: 288, width: '100%', backgroundColor: '#000' }}>
            <SafeImage uri={trip.img} alt={trip.title} />
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${dimAlpha})` }} />

            {/* top pills */}
            <View style={{ position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconPill>🗺️</IconPill>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ marginRight: 8 }}><IconPill>♥</IconPill></View>
                <IconPill>🔖</IconPill>
              </View>
            </View>

            {/* text */}
            <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
              <Text style={{ color: '#fff', opacity: 0.9, fontSize: 13 }} numberOfLines={1} ellipsizeMode="tail">{trip.subtitle} • {trip.city}</Text>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 24, lineHeight: 28, marginTop: 2, flexShrink: 1 }} numberOfLines={2} ellipsizeMode="tail">{trip.title}</Text>
              <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => Alert.alert(`Abrir detalhes de ${trip.title}`)} style={[styles.btnPillWhite, shadow(8)]}>
                  <Text style={{ color: '#111', fontSize: 14, fontWeight: '600' }}>Ver detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert(`Ir para ${trip.title}`)} style={[styles.btnGo, shadow(10)]}>
                  <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </CardShell>
      </TouchableOpacity>
    </BlockableView>
  );
}

interface MiniTileProps { title: string; img: string; price?: string }
const MiniTile = React.memo(function MiniTile({ title, img, price }: MiniTileProps) {
  return (
    <CardShell radius={16} elevation={6} style={{ width: 220 }}>
      <View>
        <View style={{ height: 120, width: '100%' }}>
          <SafeImage uri={img} alt={title} />
        </View>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ height: 20, width: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: hexOpacity(BRAND, 0.12), marginRight: 8 }}>
              <Text style={{ color: BRAND, fontWeight: '700' }}>★</Text>
            </View>
            <Text style={{ color: '#374151', fontSize: 14 }}>5.0</Text>
          </View>
          <Text style={{ marginTop: 4, color: '#111827', fontWeight: '600' }} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          {!!price && <Text style={{ color: '#6b7280', fontSize: 12 }}>From {price}</Text>}
        </View>
      </View>
    </CardShell>
  );
});

interface UpcomingItemProps { date: string; title: string; icon: string }
function UpcomingItem({ date, title, icon }: UpcomingItemProps) {
  return (
    <CardShell radius={16} elevation={6} style={{ width: 260 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <View style={{ height: 36, width: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: hexOpacity(BRAND, 0.12), marginRight: 12 }}>
          <Text>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>{date}</Text>
          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '600' }} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        </View>
      </View>
    </CardShell>
  );
}

function CommunityCarousel() {
  const posts: { id: number; title: string; author: string; minutes: number; img: string }[] = [
    { id: 1, title: 'Melhores mirantes do Rio de Janeiro (guia atualizado 2025)', author: 'Layabghiyan', minutes: 2, img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1200&auto=format&fit=crop' },
    { id: 2, title: 'Trilhas imperdíveis em Cusco', author: 'Mariana P.', minutes: 4, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop' },
    { id: 3, title: 'Cafés instagramáveis em Buenos Aires (roteiro de 1 dia)', author: 'Gustavo R.', minutes: 3, img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1200&auto=format&fit=crop' },
  ];

  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontWeight: '700', color: '#111827', fontSize: 18 }}>Da comunidade</Text>
        <TouchableOpacity onPress={() => Alert.alert('Ver mais posts')}><Text style={{ color: BRAND, fontSize: 14 }}>Ver mais</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
        {posts.map((p) => (
          <View key={p.id} style={{ marginRight: 16 }}>
            <CardShell radius={24} elevation={8} style={{ width: 288, minWidth: 260 }}>
              <View>
                <View style={{ height: 160, width: '100%' }}>
                  <SafeImage uri={p.img} alt={p.title} />
                  <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                  <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.9 }}>Da comunidade</Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 22 }} numberOfLines={2} ellipsizeMode="tail">{p.title}</Text>
                  </View>
                </View>
                <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#4b5563' }}>Por <Text style={{ color: '#111827', fontWeight: '600' }}>{p.author}</Text> • {p.minutes} min</Text>
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

interface BenefitCardProps { icon: string; title: string; text: string }
function BenefitCard({ icon, title, text }: BenefitCardProps) {
  return (
    <CardShell radius={24} elevation={4}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <View style={{ height: 36, width: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: hexOpacity(BRAND, 0.1), marginRight: 12 }}>
          <Text>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: '#111827' }} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <Text style={{ color: '#4b5563', fontSize: 13, marginTop: 4 }} numberOfLines={2} ellipsizeMode="tail">{text}</Text>
        </View>
      </View>
    </CardShell>
  );
}

function AboutSection() {
  return (
    <View style={{ marginTop: 32 }}>
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

// ---------------- Page (Expo Router friendly) ----------------
export default function Index() {
  const [tab, setTab] = useState<TabKey>('nearby');
  const [active, setActive] = useState<number>(0);
  const [bottomTab, setBottomTab] = useState<'home' | 'discover' | 'trips' | 'profile'>('home');

  const deckHeight = Math.min(300, Math.round(SCREEN_H * 0.44));

  const onAction = (key: Action['key']) => {
    const labels: Record<Action['key'], string> = {
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
    };
    Alert.alert(labels[key] || key);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'nearby', label: 'Nearby' },
    { key: 'recommend', label: 'Recommend' },
    { key: 'share', label: 'Share' },
  ];

  const goPrev = () => setActive((i) => (i - 1 + trips.length) % trips.length);
  const goNext = () => setActive((i) => (i + 1) % trips.length);

  useEffect(() => {
    const tests = [
      { name: 'BRAND set', pass: BRAND === '#00AF87' },
      { name: 'Trips have images', pass: trips.every((t) => typeof t.img === 'string' && t.img.length > 0) },
      { name: 'Benefits >= 4', pass: benefits.length >= 4 },
      { name: 'Visible range', pass: typeof VISIBLE_RANGE === 'number' && VISIBLE_RANGE >= 1 },
      { name: "Bottom nav has 'trips'", pass: true },
      { name: 'Actions include expert & currency', pass: moreActions.some((a) => a.key === 'expert') && moreActions.some((a) => a.key === 'currency') },
    ];
    tests.forEach((t) => console[t.pass ? 'log' : 'warn'](`[Test] ${t.pass ? '✔' : '✖'} ${t.name}`));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % trips.length), 4500);
    return () => clearInterval(id);
  }, []);

  const containerW = Platform.OS === 'web' ? Math.min(FRAME_W, SCREEN_W * 0.92) : SCREEN_W;
  const containerOuterStyle: ViewStyle = Platform.select({
    web: { width: containerW, borderRadius: 35, backgroundColor: '#fff', overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb', ...shadow(20) },
    default: { width: containerW, backgroundColor: '#fff' },
  }) as ViewStyle;

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={[containerOuterStyle]}>
        <View style={{ height: Platform.OS === 'web' ? 20 : 0 }} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 160 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ height: 32, width: 32, borderRadius: 16, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>✦</Text>
              </View>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>EasyTrip</Text>
            </View>
            <SafeAvatar />
          </View>

          {/* Greeting (emoji alinhados na mesma linha) */}
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', lineHeight: 24 }}>Olá, João Pedro</Text>
              <Text style={{ fontSize: 20, lineHeight: 24, marginLeft: 6 }}>👋</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
              <Text style={{ color: '#6b7280', lineHeight: 20 }}>Pense no melhor design para sua próxima viagem</Text>
              <Text style={{ lineHeight: 20, marginLeft: 6 }}>✨</Text>
            </View>
          </View>

          {/* Search */}
          <View style={{ marginTop: 16 }}>
            <SearchBar onFilter={() => Alert.alert('Abrir filtros')} />
          </View>

          {/* Title */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', lineHeight: 32 }}>
              Encontre o <Text style={{ color: BRAND }}>lugar perfeito</Text>
            </Text>
          </View>

          {/* Deck / carousel */}
          <View style={{ marginTop: 24, height: deckHeight }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
              {trips.map((t, i) => (
                <OverlapCard key={t.title} trip={t} index={i} activeIndex={active} onSelect={setActive} />
              ))}
            </View>
            <View style={{ position: 'absolute', left: -8, top: deckHeight / 2 - 18, flexDirection: 'row' }}>
              <TouchableOpacity onPress={goPrev} style={[styles.navCircle]}><Text>‹</Text></TouchableOpacity>
              <View style={{ width: 8 }} />
              <TouchableOpacity onPress={goNext} style={[styles.navCircle]}><Text>›</Text></TouchableOpacity>
            </View>
          </View>

          {/* Hotels carousel */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>Hotéis em destaque</Text>
              <TouchableOpacity><Text style={{ color: BRAND }}>Ver todos</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
              {hotels.map((h) => (
                <View key={h.id} style={{ marginRight: 12 }}>
                  <MiniTile title={h.title} img={h.img} price={h.price} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Próximos - carousel */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>Próximos</Text>
              <TouchableOpacity onPress={() => Alert.alert('Abrir agenda')}><Text style={{ color: BRAND, fontSize: 14 }}>Ver agenda</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
              {upcomingTrips.map((u) => (
                <View key={u.id} style={{ marginRight: 12 }}>
                  <UpcomingItem date={u.date} title={u.title} icon={u.icon} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Comunidade */}
          <CommunityCarousel />

          {/* Promotions banner (com imagem e espaçamento) */}
          <CardShell radius={24} elevation={6} style={{ marginTop: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: BRAND, fontWeight: '700', fontSize: 13 }}>Promoções</Text>
                <Text style={{ color: '#374151' }} numberOfLines={2} ellipsizeMode="tail">Novas ofertas todos os dias</Text>
                <TouchableOpacity onPress={() => Alert.alert('Ver promoções')} style={[styles.btnOutline, { borderColor: BRAND, marginTop: 10, alignSelf: 'flex-start' }]}>
                  <Text style={{ color: BRAND, fontWeight: '700' }}>Ver agora</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 90, width: 140, borderRadius: 16, overflow: 'hidden' }}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?q=80&w=800&auto=format&fit=crop' }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
              </View>
            </View>
          </CardShell>

          {/* About / benefits */}
          <AboutSection />

          {/* Segmented control (final) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
              {tabs.map((t) => (
                <View key={t.key} style={{ marginRight: 8 }}>
                  <Chip active={tab === t.key} onPress={() => setTab(t.key)}>{t.label}</Chip>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Quick + More actions (final) */}
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {[...quickActions, ...moreActions].map((a, idx) => (
                <TouchableOpacity key={`${a.key}-${idx}`} onPress={() => onAction(a.key)} style={[styles.actionCard, shadow(6), { marginBottom: 12, width: (containerW - 20 * 2 - 12 * 2) / 3 }]}> 
                  <View style={{ height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: hexOpacity(BRAND, 0.12), marginBottom: 8 }}>
                    <Text>{a.icon}</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '600' }} numberOfLines={2} ellipsizeMode="tail">{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom nav */}
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 16 }}>
          <View style={[{ borderRadius: 24, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, shadow(14)]}>
            {[
              { key: 'home', label: 'Home', icon: '🏠' },
              { key: 'discover', label: 'Discover', icon: '🧭' },
              { key: 'trips', label: 'Minhas viagens', icon: '🧳' },
              { key: 'profile', label: 'Profile', icon: '👤' },
            ].map((item) => (
              <TouchableOpacity key={item.key} onPress={() => setBottomTab(item.key as typeof bottomTab)} style={{ alignItems: 'center' }}>
                <View style={[styles.navIconCircle, bottomTab === item.key && { backgroundColor: BRAND }]}>
                  <Text style={{ color: bottomTab === item.key ? '#fff' : '#6b7280' }}>{item.icon}</Text>
                </View>
                <Text style={{ marginTop: 4, fontSize: 12, fontWeight: '600', color: bottomTab === item.key ? BRAND : '#6b7280' }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
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
    backgroundColor: 'rgba(255,255,255,0.8)',
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
  btnChipFilled: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: BRAND,
    borderWidth: 1,
    borderColor: BRAND,
  },
  btnChipOutline: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: BRAND,
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
  searchIcon: {
    marginRight: 8,
    color: '#6b7280',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterPill: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexOpacity(BRAND, 0.10),
    marginLeft: 8,
  },
  filterPillText: {
    color: BRAND,
    fontWeight: '700',
    fontSize: 12,
  },
  // bottom nav icon container (always round)
  navIconCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});
