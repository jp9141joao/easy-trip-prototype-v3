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
  KeyboardAvoidingView,
  FlatList,
  Linking,
} from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/* ============================ Theme / Layout ============================ */
const BRAND = '#00AF87' as const;
const FRAME_W = 390;
const VISIBLE_RANGE = 1;
const SWIPE_THRESHOLD = 40;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CAROUSEL_PAD_H = 14;
const CAROUSEL_PAD_B = Platform.OS === 'android' ? 32 : 24;

/* =============================== Types =============================== */
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
  | 'advisory';

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

/* =============================== Utils =============================== */
function hexOpacity(hex: string, alpha: number = 0.15): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const shadow = (elev: number = 12): ViewStyle => ({
  elevation: elev,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowOffset: { width: 0, height: Math.max(1, Math.round(elev / 3)) },
  shadowRadius: Math.max(3, elev * 0.8),
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

/* ============================ Small pieces ============================ */
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

/* ============================== Data ============================== */
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
// SUBSTITUA este bloco inteiro
const hotels = [
  {
    id: 'h1',
    title: 'Deep River',
    img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
    price: '$110 / night',
    gallery: [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521783988139-893ce3834f13?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'Av. Atlântica, 1200 - Rio de Janeiro, BR',
    openingHours: '24h (recepção)',
    features: ['Piscina', 'Wi-Fi grátis', 'Café da manhã'],
    priceLabel: 'R$ 550 / noite (média)',
    rating: 4.8,
    reviewsCount: 5000,
    specialty: 'Hotel boutique à beira-mar',
    specialties: ['Romântico', 'Vista para o mar', 'Design contemporâneo', 'Ideal para casais', 'Work-friendly'],
    description:
      'Hotel boutique à beira-mar com quartos recém-renovados e vista para a orla. Ideal para casais e viajantes que buscam conforto com toque contemporâneo.',
    reviews: [
      { author: 'Carolina M.', rating: 5, text: 'Quarto impecável e café da manhã delicioso. Localização perfeita para explorar a praia!', time: 'há 2 semanas' },
      { author: 'Rafael M.', rating: 4.5, text: 'Equipe atenciosa e piscina ótima. Poderia ter mais opções no room service.', time: 'há 1 mês' },
      { author: 'André M.', rating: 5, text: 'Varanda com vista linda e cama super confortável.', time: 'há 3 semanas' },
      { author: 'Bruna T.', rating: 4.5, text: 'Check-in rápido e bar de coquetéis excelente.', time: 'há 5 dias' },
      { author: 'Kátia L.', rating: 4.5, text: 'Ótimo custo/benefício e staff muito educado.', time: 'há 2 meses' },
      { author: 'Lucas P.', rating: 5, text: 'Quartos silenciosos, isolamento acústico realmente funciona.', time: 'há 3 semanas' },
      { author: 'Helena R.', rating: 4.5, text: 'Café da manhã com opções sem glúten, adorei!', time: 'há 1 mês' },
      { author: 'Gustavo A.', rating: 5, text: 'Wi-Fi estável, deu pra trabalhar remoto sem problemas.', time: 'há 2 meses' }
    ],
  },
  {
    id: 'h2',
    title: 'Arabella',
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
    price: '$120 / night',
    gallery: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501117716987-c8e1ecb21032?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'R. Augusta, 85 - São Paulo, BR',
    openingHours: '24h (recepção)',
    features: ['Academia', 'Spa', 'Bar no lobby'],
    priceLabel: 'R$ 620 / noite (média)',
    rating: 4.7,
    reviewsCount: 3200,
    specialty: 'Hotel urbano para negócios',
    specialties: ['Business-friendly', 'Spa & wellness', 'Quartos silenciosos', 'Localização central', 'Café no lobby'],
    description:
      'Endereço urbano com design elegante, quartos silenciosos e serviços de bem-estar. Ótimo para viagens de trabalho.',
    reviews: [
      { author: 'Marina M.', rating: 4.5, text: 'Quarto confortável e spa maravilhoso. Voltaria com certeza!', time: 'há 3 semanas' },
      { author: 'Felipe R.', rating: 4, text: 'Localização excelente. Cafezinho do lobby salvou minhas manhãs.', time: 'há 2 meses' },
      { author: 'Bruno K.', rating: 4.5, text: 'Academia bem equipada e limpa.', time: 'há 1 mês' },
      { author: 'Aline S.', rating: 5, text: 'Atendimento profissional e rápido, perfeito para negócios.', time: 'há 1 semana' },
      { author: 'Leandro T.', rating: 4.5, text: 'Quarto silencioso mesmo na Augusta, surpreendeu.', time: 'há 2 semanas' },
      { author: 'Paula C.', rating: 4, text: 'Cama muito boa, só senti falta de mais tomadas.', time: 'há 3 semanas' },
      { author: 'Rodrigo N.', rating: 5, text: 'Spa top! Massagem relaxante depois do expediente.', time: 'há 4 dias' },
      { author: 'Ana Luiza P.', rating: 4.5, text: 'Café da manhã variado, ótimo para começar o dia.', time: 'há 1 mês' }
    ],
  },
  {
    id: 'h3',
    title: 'Cyan Resort',
    img: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop',
    price: '$140 / night',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'Praia do Forte, BA - BR',
    openingHours: '24h (recepção)',
    features: ['Beira-mar', 'Piscina aquecida', 'Estacionamento'],
    priceLabel: 'R$ 780 / noite (média)',
    rating: 4.9,
    reviewsCount: 8700,
    specialty: 'Resort all-family pé na areia',
    specialties: ['Família', 'Pé na areia', 'Recreação infantil', 'Piscina aquecida', 'Atividades aquáticas'],
    description:
      'Resort pé na areia com estrutura completa para famílias e atividades aquáticas.',
    reviews: [
      { author: 'Laura M.', rating: 5, text: 'Perfeito para crianças! Monitores incríveis e praia linda.', time: 'há 5 dias' },
      { author: 'Tiago A.', rating: 4.5, text: 'Restaurantes variados e piscina aquecida top. Voltarei!', time: 'há 1 mês' },
      { author: 'Patrícia V.', rating: 5, text: 'Equipe de recreação sensacional, meus filhos amaram.', time: 'há 2 semanas' },
      { author: 'Eduardo S.', rating: 4.5, text: 'Quartos amplos e bem arejados, ótimo ar-condicionado.', time: 'há 3 semanas' },
      { author: 'Juliana P.', rating: 5, text: 'Programação diária de atividades, nunca ficamos entediados.', time: 'há 1 semana' },
      { author: 'Miguel D.', rating: 4.5, text: 'Praia limpa e cadeiras confortáveis.', time: 'há 2 meses' },
      { author: 'Renata C.', rating: 5, text: 'Café da manhã completo e staff atencioso.', time: 'há 1 mês' },
      { author: 'Breno G.', rating: 4.5, text: 'Estacionamento fácil e seguro, voltarei com certeza.', time: 'há 3 semanas' }
    ],
  },
];

const restaurants = [
  {
    id: 'r1',
    title: 'Pasta Nostra',
    img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop',
    price: '$$',
    gallery: [
      'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'R. Itália, 45 - São Paulo, BR',
    openingHours: '12:00–23:00 (seg–dom)',
    specialty: 'Massas artesanais',
    specialties: ['Carbonara', 'Cacio e Pepe', 'Ravioli de ricota e espinafre', 'Bruschetta al pomodoro', 'Tiramisu'],
    cuisine: ['Italiana', 'Mediterrânea'],
    pricePerPerson: 'R$ 80–120 / pessoa',
    rating: 4.8,
    reviewsCount: 5100,
    description: 'Trattoria aconchegante com massas frescas feitas diariamente e carta de vinhos autoral.',
    reviews: [
      { author: 'João V.', rating: 5, text: 'Carbonara perfeito e atendimento 10/10.', time: 'há 1 semana' },
      { author: 'Camila S.', rating: 4.5, text: 'Fila rápida e tiramisu divino!', time: 'há 3 semanas' },
      { author: 'Pedro R.', rating: 5, text: 'Massa fresca de verdade, ponto impecável.', time: 'há 4 dias' },
      { author: 'Lia N.', rating: 4.5, text: 'Ambiente aconchegante, ótimo para dates.', time: 'há 2 semanas' },
      { author: 'Mário D.', rating: 4.5, text: 'Carta de vinhos surpreendente pelo preço.', time: 'há 1 mês' },
      { author: 'Beatriz H.', rating: 5, text: 'Ravioli de ricota é obrigatório!', time: 'há 3 semanas' },
      { author: 'Daniel C.', rating: 4.5, text: 'Serviço ágil e educado, recomendo.', time: 'há 2 meses' },
      { author: 'Sofia L.', rating: 5, text: 'Cacio e pepe no ponto certo!', time: 'há 2 semanas' }
    ],
  },
  {
    id: 'r2',
    title: 'Sushi & Co',
    img: 'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1200&auto=format&fit=crop',
    price: '$$$',
    gallery: [
      'https://images.unsplash.rcom/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'Av. Paulista, 1578 - São Paulo, BR',
    openingHours: '12:00–22:30 (ter–dom)',
    specialty: 'Omakase',
    specialties: ['Omakase sazonal', 'Nigiri de toro', 'Seleção de sashimis', 'Tempurá leve', 'Mochi de sobremesa'],
    cuisine: ['Japonesa', 'Fusão'],
    pricePerPerson: 'R$ 140–220 / pessoa',
    rating: 4.7,
    reviewsCount: 4300,
    description: 'Casa de sushi focada em ingredientes sazonais e experiência no balcão com menu omakase.',
    reviews: [
      { author: 'Renato L.', rating: 5, text: 'Peixe fresquíssimo, experiência impecável.', time: 'há 2 dias' },
      { author: 'Yasmin P.', rating: 4.5, text: 'Vale o preço pelo omakase.', time: 'há 2 semanas' },
      { author: 'Karina O.', rating: 5, text: 'Nigiri de toro inesquecível.', time: 'há 1 semana' },
      { author: 'Marcelo G.', rating: 4.5, text: 'Balcão interativo, chef explica cada peça.', time: 'há 3 semanas' },
      { author: 'Heitor F.', rating: 4.5, text: 'Arroz no ponto, peixe derrete na boca.', time: 'há 1 mês' },
      { author: 'Luana T.', rating: 5, text: 'Ambiente intimista e elegante.', time: 'há 5 dias' },
      { author: 'Bruno Y.', rating: 4.5, text: 'Tempurá leve, sem óleo excessivo.', time: 'há 2 meses' },
      { author: 'Clara M.', rating: 5, text: 'Mochi finaliza a experiência com chave de ouro.', time: 'há 2 semanas' }
    ],
  },
  {
    id: 'r3',
    title: 'Choripán House',
    img: 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop',
    price: '$',
    gallery: [
      'https://images.unsplash.com/photo-1533777324565-a040eb52fac1?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'Rua Florida, 200 - Buenos Aires, AR',
    openingHours: '11:30–22:00 (seg–sáb)',
    specialty: 'Sanduíches e parrilla',
    specialties: ['Choripán clássico', 'Parrilla mista', 'Provoleta', 'Papas rústicas', 'Chopp gelado'],
    cuisine: ['Argentina', 'Lanches'],
    pricePerPerson: 'R$ 35–60 / pessoa',
    rating: 4.6,
    reviewsCount: 2100,
    description: 'Sanduíches clássicos argentinos com chimichurri da casa e chopp gelado.',
    reviews: [
      { author: 'Nati G.', rating: 4.5, text: 'Choripán muito bem feito, preço justo.', time: 'há 4 dias' },
      { author: 'Fernando T.', rating: 4, text: 'Ambiente simples e sabor autêntico.', time: 'há 1 mês' },
      { author: 'Agustín R.', rating: 4.5, text: 'Provoleta perfeita, derretendo!', time: 'há 2 semanas' },
      { author: 'Marina F.', rating: 4.5, text: 'Papas rústicas crocantes, adorei.', time: 'há 3 semanas' },
      { author: 'Carlos E.', rating: 4, text: 'Chopp bem tirado e gelado.', time: 'há 2 semanas' },
      { author: 'Santiago P.', rating: 4.5, text: 'Parrilla mista serve bem duas pessoas.', time: 'há 1 mês' },
      { author: 'Luiza M.', rating: 4.5, text: 'Molho chimichurri é o diferencial.', time: 'há 5 dias' },
      { author: 'Pablo J.', rating: 4, text: 'Atendimento rápido mesmo com casa cheia.', time: 'há 2 meses' }
    ],
  },
  {
    id: 'r4',
    title: 'Prime Steak',
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
    price: '$$$',
    gallery: [
      'https://images.unsplash.com/photo-1555992336-03a23c4a3f0b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'R. da Praia, 120 - Rio de Janeiro, BR',
    openingHours: '12:00–23:00 (seg–dom)',
    specialty: 'Cortes premium na brasa',
    specialties: ['Dry-aged ribeye', 'Picanha premium', 'Tomahawk', 'Purê trufado', 'Cheesecake de forno'],
    cuisine: ['Churrascaria', 'Steakhouse'],
    pricePerPerson: 'R$ 120–220 / pessoa',
    rating: 4.8,
    reviewsCount: 6900,
    description: 'Steakhouse contemporânea com cortes dry-aged e adega climatizada.',
    reviews: [
      { author: 'Priscila A.', rating: 5, text: 'Ponto da carne perfeito e atendimento excelente.', time: 'há 1 semana' },
      { author: 'Diego C.', rating: 4.5, text: 'Carta de vinhos muito boa. Ambiente sofisticado.', time: 'há 3 semanas' },
      { author: 'Henrique B.', rating: 5, text: 'Tomahawk surreal, suculento.', time: 'há 5 dias' },
      { author: 'Lara F.', rating: 4.5, text: 'Purê trufado maravilhoso.', time: 'há 2 semanas' },
      { author: 'Eduarda V.', rating: 4.5, text: 'Sobremesas excelentes, destaque pro cheesecake.', time: 'há 1 mês' },
      { author: 'Márcio Z.', rating: 4.5, text: 'Serviço atencioso e rápido.', time: 'há 3 semanas' },
      { author: 'Tatiane Q.', rating: 5, text: 'Melhor picanha que já comi.', time: 'há 1 semana' },
      { author: 'Vitor S.', rating: 4.5, text: 'Ambiente elegante, ideal pra celebrar.', time: 'há 2 meses' }
    ],
  },
  {
    id: 'r5',
    title: 'La Pizzeria',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
    price: '$$',
    gallery: [
      'https://images.unsplash.com/photo-1548365328-9f547fb09530?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541744572-880c30e57a29?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528731708534-816fe59f90c9?q=80&w=1600&auto=format&fit=crop'
    ],
    address: 'R. das Palmeiras, 300 - Recife, BR',
    openingHours: '18:00–23:30 (qua–seg)',
    specialty: 'Pizza napolitana',
    specialties: ['Margherita D.O.P.', 'Diavola', 'Funghi', 'Bufalina', 'Panna cotta'],
    cuisine: ['Italiana', 'Pizza'],
    pricePerPerson: 'R$ 50–90 / pessoa',
    rating: 4.7,
    reviewsCount: 3800,
    description: 'Pizzaria estilo napolitano com forno a lenha e ingredientes D.O.P.',
    reviews: [
      { author: 'Isabela R.', rating: 5, text: 'Massa leve e borda aerada perfeita.', time: 'há 2 semanas' },
      { author: 'Cauê P.', rating: 4.5, text: 'Aperitivos ótimos e serviço ágil.', time: 'há 1 mês' },
      { author: 'Rafael L.', rating: 5, text: 'Margherita D.O.P. é incrível.', time: 'há 6 dias' },
      { author: 'Nathalia V.', rating: 4.5, text: 'Forno a lenha faz toda a diferença.', time: 'há 2 semanas' },
      { author: 'João Pedro A.', rating: 4.5, text: 'Bufalina muito saborosa, ingredientes de qualidade.', time: 'há 3 semanas' },
      { author: 'Gabriela M.', rating: 5, text: 'Sobremesa de panna cotta perfeita.', time: 'há 1 mês' },
      { author: 'Thales R.', rating: 4.5, text: 'Ambiente charmoso e música boa.', time: 'há 2 meses' },
      { author: 'Letícia S.', rating: 5, text: 'A melhor pizza napolitana da cidade.', time: 'há 1 semana' }
    ],
  },
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

const moreActions: Action[] = [
  { key: 'ai', label: 'Ajuda por IA' },
  { key: 'itinerary', label: 'Itinerário' },
  { key: 'gastos', label: 'Gastos' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'fotos', label: 'Fotos' },
  { key: 'expert', label: 'Falar com especialista' },
  { key: 'currency', label: 'Cotação de moedas' },
  { key: 'advisory', label: 'Assessoria' },
];

const benefits: Benefit[] = [
  { key: 'culture', title: 'Exposição Cultural', text: 'Descubra tradições, culinárias e estilos de vida diferentes ao redor do mundo.', icon: 'image-multiple-outline' },
  { key: 'growth', title: 'Crescimento Pessoal', text: 'Planeje melhor, conheça pessoas novas e desenvolva autonomia viajando.', icon: 'star-outline' },
  { key: 'memories', title: 'Memórias', text: 'Registre fotos e diário de bordo, e guarde momentos para sempre.', icon: 'camera-outline' },
  { key: 'stress', title: 'Redução do Estresse', text: 'Organize sua viagem com agenda e gastos claros para curtir sem preocupação.', icon: 'calendar-month-outline' },
];

/* ============== Helpers: icons & chips ============== */
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

function SafeImage({ uri, alt, mode = 'cover' as 'cover' | 'contain' }: { uri: string; alt?: string; mode?: 'cover' | 'contain' }) {
  const [ok, setOk] = useState<boolean>(true);
  return ok ? (
    <Image source={{ uri }} onError={() => setOk(false)} resizeMode={mode} style={{ width: '100%', height: '100%' }} accessibilityLabel={alt || 'image'} />
  ) : (
    <View style={{ flex: 1, backgroundColor: hexOpacity(BRAND, 0.25), alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: BRAND, fontWeight: '700' }}>{alt || 'EasyTrip'}</Text>
    </View>
  );
}

/* ---------- Controlled Like / Flag Pills (sincronizados) ---------- */
function LikePill({ active, onToggle }: { active?: boolean; onToggle?: (next: boolean) => void }) {
  const isControlled = typeof active === 'boolean';
  const [internal, setInternal] = useState(false);
  const val = isControlled ? !!active : internal;

  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
    const next = !val;
    onToggle?.(next);
    if (!isControlled) setInternal(next);
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.iconPill, shadow(6), { transform: [{ scale }] }]}>
        {val ? <Ionicons name="heart" size={16} color="#ef4444" /> : <Ionicons name="heart-outline" size={16} color="#111" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

function FlagPill({ active, onToggle }: { active?: boolean; onToggle?: (next: boolean) => void }) {
  const isControlled = typeof active === 'boolean';
  const [internal, setInternal] = useState(false);
  const val = isControlled ? !!active : internal;

  const scale = useRef(new Animated.Value(1)).current;
  const onPress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
    const next = !val;
    onToggle?.(next);
    if (!isControlled) setInternal(next);
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.iconPill, shadow(6), { transform: [{ scale }] }]}>
        {val ? <Ionicons name="bookmark" size={16} color={BRAND} /> : <Ionicons name="bookmark-outline" size={16} color="#111" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

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
      return <Ionicons name="headset-outline" size={18} color={color} />;
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

/* ========================== SearchBar ========================== */
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

/* ====================== Bottom Sheet (Trips) ====================== */
type Affordability = 'Barato' | 'Médio' | 'Caro';

type TripMeta = {
  desc: string;
  more: string;
  things: string[];
  bestTime: string;
  dangers: string;
  currency: string;
  afford: Affordability;
  gallery: string[];
};

const metaByTrip: Record<string, TripMeta> = {
  'Mount Aconcagua – Circuito completo': {
    desc: 'Maior pico das Américas (6.962 m). Trekking em alta montanha com vistas glaciais e acampamentos.',
    more: 'A região combina trilhas técnicas e rotas mais acessíveis ao Campo Base, oferecendo uma experiência de montanha completa para quem busca desafio e paisagens dramáticas.',
    things: ['Trekking ao Campo Base', 'Mirantes glaciais', 'Parque Provincial Aconcágua'],
    bestTime: 'Dezembro a fevereiro (verão andino).',
    dangers: 'Altitude, clima imprevisível, necessidade de equipamento adequado e aclimatação.',
    currency: 'Peso argentino (ARS).',
    afford: 'Médio',
    gallery: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521292270410-a8c8261e5a29?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Rio de Janeiro — Pão de Açúcar + Cristo Redentor': {
    desc: 'Cartões-postais do Brasil com vistas panorâmicas da Baía de Guanabara e do litoral carioca.',
    more: 'A dobradinha bondinho + corcovado entrega um panorama completo da cidade, combinando natureza, arquitetura e cultura em um raio curto de deslocamento.',
    things: ['Bondinho do Pão de Açúcar', 'Cristo Redentor (Corcovado)', 'Praias de Copacabana e Ipanema'],
    bestTime: 'Maio a outubro (menos chuva).',
    dangers: 'Batedores de carteira em áreas turísticas; atenção a pertences.',
    currency: 'Real (BRL).',
    afford: 'Médio',
    gallery: [
      'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526401485004-2fda9f4e3b35?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Cusco & Machu Picchu': {
    desc: 'Coração do Império Inca e a cidadela mais famosa do Peru, cercada por Andes e selva.',
    more: 'Entre ruínas e vilarejos artesanais, Cusco serve como base para experiências arqueológicas e gastronômicas que conectam passado e presente.',
    things: ['Trilha Inca ou Trem a Aguas Calientes', 'Vale Sagrado', 'Sítios arqueológicos (Sacsayhuaman)'],
    bestTime: 'Maio a setembro (estação seca).',
    dangers: 'Soroche (mal da altitude) e forte incidência solar.',
    currency: 'Sol (PEN).',
    afford: 'Médio',
    gallery: [
      'https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Torres del Paine': {
    desc: 'Parque nacional patagônico com torres de granito, lagos azuis e trilhas icônicas (W e O).',
    more: 'O cenário de ventos fortes e clima mutável é recompensado por mirantes épicos e refúgios acolhedores ao longo das rotas.',
    things: ['Trilha W', 'Mirador Base Torres', 'Lago Grey (geleira)'],
    bestTime: 'Novembro a março (verão na Patagônia).',
    dangers: 'Ventos fortíssimos e clima muito variável.',
    currency: 'Peso chileno (CLP).',
    afford: 'Caro',
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Salar de Uyuni (Expedição 3 dias)': {
    desc: 'O maior deserto de sal do mundo, que vira espelho d’água em época de chuvas.',
    more: 'A experiência alterna trechos surreais de horizonte infinito com ilhas de cactos e hospedagens de sal, criando um roteiro único.',
    things: ['Isla Incahuasi', 'Cemitério de Trens', 'Hotéis de sal'],
    bestTime: 'Dez–mar (espelho), abr–nov (céu limpo e secura).',
    dangers: 'Radiação UV, frio noturno intenso e deslocamentos longos.',
    currency: 'Boliviano (BOB).',
    afford: 'Barato',
    gallery: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521292270410-a8c8261e5a29?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Deserto do Atacama': {
    desc: 'O deserto mais seco do mundo, com vales, geysers e céus estrelados.',
    more: 'San Pedro funciona como hub para saídas diárias versáteis, de lagunas altiplânicas a observação astronômica de alto nível.',
    things: ['Valle de la Luna', 'Geysers del Tatio', 'Lagunas Altiplânicas'],
    bestTime: 'Abr–nov (clima ameno e céu limpo).',
    dangers: 'Amplitude térmica grande; hidratação essencial.',
    currency: 'Peso chileno (CLP).',
    afford: 'Médio',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Cartagena das Índias': {
    desc: 'Cidade costeira colombiana com centro histórico colorido e praias próximas.',
    more: 'O contraste entre muralhas coloniais, música caribenha e cozinha de frutos do mar cria uma atmosfera vibrante e fotogênica.',
    things: ['Cidade Murada', 'Castelo de San Felipe', 'Praias das Ilhas do Rosário'],
    bestTime: 'Dez–abr (menos chuvas).',
    dangers: 'Calor úmido; atenção a preços em áreas turísticas.',
    currency: 'Peso colombiano (COP).',
    afford: 'Médio',
    gallery: [
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  'Fernando de Noronha': {
    desc: 'Arquipélago brasileiro com algumas das praias mais bonitas do mundo e vida marinha rica.',
    more: 'O controle de visitantes preserva o ecossistema e garante trilhas, mergulhos e mirantes sempre especiais — com custos mais altos.',
    things: ['Baía do Sancho', 'Mergulho e snorkeling', 'Trilha Atalaia'],
    bestTime: 'Ago–out (mar calmo) ou jan–mar (ondas para surf).',
    dangers: 'Taxas ambientais; sol forte; áreas com acesso controlado.',
    currency: 'Real (BRL).',
    afford: 'Caro',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534854638093-bada1813ca19?q=80&w=1600&auto=format&fit=crop',
    ],
  },
};

/* ======== Sheet UI atoms ======== */
function Overline({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: '#64748b', fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' }}>{children}</Text>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: '#0f172a', fontSize: 20, fontWeight: '800' }}>{children}</Text>;
}
function Subtle({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: '#475569' }}>{children}</Text>;
}
function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
      <Text style={{ color: '#0f172a', fontSize: 13 }}>{children}</Text>
    </View>
  );
}
function FactBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
      <View style={{ marginRight: 8 }}>{icon}</View>
      <Text style={{ color: '#0f172a', fontWeight: '600' }}>{text}</Text>
    </View>
  );
}
function Callout({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 12, backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fed7aa' }}>
      <View style={{ marginRight: 10, marginTop: 2 }}>{icon}</View>
      <Text style={{ color: '#9a3412', lineHeight: 20 }}>{text}</Text>
    </View>
  );
}
function StarRating({ rating, size = 14, color = BRAND }: { rating: number; size?: number, color?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: full }).map((_, i) => <Ionicons key={`f${i}`} name="star" size={size} color={color} />)}
      {half ? <Ionicons name="star-half" size={size} color={color} /> : null}
      {Array.from({ length: empty }).map((_, i) => <Ionicons key={`e${i}`} name="star-outline" size={size} color={color} />)}
    </View>
  );
}

function formatReviews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')} mi`;
  if (n >= 1000) return `${Math.round(n / 100) / 10} mil`;
  return `${n}`;
}

/** Gallery full-width (edge-to-edge) com snap - BottomSheet Trips */
function SheetGallery({ uris }: { uris: string[] }) {
  const ITEM_W = SCREEN_W; // full width
  const ITEM_H = Math.min(Math.round(SCREEN_W * 9 / 16), Math.round(SCREEN_H * 0.42));
  const [index, setIndex] = useState(0);

  return (
    <View style={{ width: SCREEN_W, marginLeft: 0 }}>
      <FlatList
        horizontal
        data={uris}
        keyExtractor={(u, i) => `${u}-${i}`}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_W}
        snapToAlignment="start"
        getItemLayout={(_, i) => ({ length: ITEM_W, offset: ITEM_W * i, index: i })}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const i = Math.round(x / ITEM_W);
          if (i !== index) setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_W, height: ITEM_H, backgroundColor: '#0b0b0b' }}>
            <SafeImage uri={item} alt="gallery" mode="cover" />
          </View>
        )}
      />
      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
        {uris.map((_, i) => (
          <View
            key={i}
            style={{
              height: 4,
              width: i === index ? 18 : 6,
              borderRadius: 999,
              marginHorizontal: 3,
              backgroundColor: i === index ? '#9ca3af' : '#e5e7eb',
            }}
          />
        ))}
      </View>
    </View>
  );
}

/* ====================== Modal para Hotéis/Restaurantes ====================== */
function PlaceGallery({ uris }: { uris: string[] }) {
  const ITEM_W = SCREEN_W;
  const ITEM_H = Math.min(Math.round(SCREEN_W * 9 / 16), Math.round(SCREEN_H * 0.42));
  const [index, setIndex] = useState(0);
  return (
    <View style={{ width: SCREEN_W }}>
      <FlatList
        horizontal
        data={uris}
        keyExtractor={(u, i) => `${u}-${i}`}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_W}
        snapToAlignment="start"
        getItemLayout={(_, i) => ({ length: ITEM_W, offset: ITEM_W * i, index: i })}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const i = Math.round(x / ITEM_W);
          if (i !== index) setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_W, height: ITEM_H, backgroundColor: '#0b0b0b' }}>
            <SafeImage uri={item} alt="gallery" mode="cover" />
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
        {uris.map((_, i) => (
          <View
            key={i}
            style={{
              height: 4,
              width: i === index ? 18 : 6,
              borderRadius: 999,
              marginHorizontal: 3,
              backgroundColor: i === index ? '#9ca3af' : '#e5e7eb',
            }}
          />
        ))}
      </View>
    </View>
  );
}

type Place = any;

function ReviewItem({ author, rating, text, time }: { author: string; rating: number; text: string; time: string }) {
  const initial = author.trim().charAt(0).toUpperCase();
  return (
    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ height: 28, width: 28, borderRadius: 14, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
          <Text style={{ color: '#334155', fontWeight: '800' }}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#0f172a', fontWeight: '700' }}>{author}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <StarRating rating={rating} size={12} />
            <Text style={{ marginLeft: 6, color: '#64748b', fontSize: 12 }}>{time}</Text>
          </View>
        </View>
      </View>
      <Text style={{ color: '#334155', marginTop: 6, lineHeight: 20 }}>{text}</Text>
    </View>
  );
}

function PlaceModal({
  visible,
  place,
  onClose,
}: {
  visible: boolean;
  place: Place | null;
  onClose: () => void;
}) {
  const SHEET_H = Math.round(SCREEN_H * 0.9);
  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 230, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SHEET_H, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_e, g) => {
        const ny = Math.max(0, Math.min(g.dy, SHEET_H));
        translateY.setValue(ny);
      },
      onPanResponderRelease: (_e, g) => {
        const shouldClose = g.vy > 1.1 || g.dy > SHEET_H * 0.22;
        if (shouldClose) {
          Animated.parallel([
            Animated.timing(translateY, { toValue: SHEET_H, duration: 180, useNativeDriver: true }),
            Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: true }),
          ]).start(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, bounciness: 4, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (!place) return null;

  const isHotel = (!!place.price && /night|noite/i.test(place.price)) || !!place.priceLabel;
  const gallery = place.gallery?.length ? place.gallery : [place.img];
  const mapsUrl = place.lat && place.lng
    ? `https://www.google.com/maps/?q=${place.lat},${place.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.title} ${place.address || ''}`.trim())}`;
  const googleReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + (place.address || ''))}`;

  const openMaps = () => {
    try { Linking.openURL(mapsUrl); } catch { }
  };
  const openSite = () => {
    if (place.website) {
      try { Linking.openURL(place.website); } catch { }
    }
  };
  const callPhone = () => {
    if (place.phone) {
      try { Linking.openURL(`tel:${place.phone}`); } catch { }
    }
  };
  const openReviews = () => {
    try { Linking.openURL(googleReviewsUrl); } catch { }
  };

  return (
    <>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.28)',
          opacity: backdrop,
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: SHEET_H,
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [{ translateY }],
            overflow: 'hidden',
          },
          shadow(8),
        ]}
      >
        {/* Close */}
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            right: 10,
            top: 6,
            height: 36,
            width: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            zIndex: 40,
          }}
        >
          <Ionicons name="close" size={18} color="#0f172a" />
        </TouchableOpacity>

        {/* Handle */}
        <View {...pan.panHandlers} style={{ paddingTop: 18, alignItems: 'center' }}>
          <View style={{ height: 4, width: 44, borderRadius: 999, backgroundColor: '#e5e7eb' }} />
        </View>

        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}>
          <Overline>{isHotel ? 'Hotel' : 'Restaurante'}</Overline>
          <Title>{place.title}</Title>
          {place.address ? <Text style={{ color: '#64748b', marginTop: 4 }}>{place.address}</Text> : null}

          {(place.rating || place.reviewsCount) ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              {place.rating ? <StarRating rating={place.rating} /> : null}
              <Text style={{ marginLeft: 8, color: '#111827', fontWeight: '700' }}>{place.rating?.toFixed(1)}</Text>
              <Text style={{ marginLeft: 6, color: '#64748b' }}>• {formatReviews(place.reviewsCount || 0)} avaliações</Text>
            </View>
          ) : null}
        </View>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <PlaceGallery uris={gallery} />

          {/* Quick facts */}
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {isHotel && place.priceLabel ? (
                <FactBadge icon={<Ionicons name="bed-outline" size={16} color="#0f172a" />} text={place.priceLabel} />
              ) : null}
              {!isHotel && place.pricePerPerson ? (
                <FactBadge icon={<Ionicons name="pricetag-outline" size={16} color="#0f172a" />} text={place.pricePerPerson} />
              ) : null}
              {place.openingHours ? (
                <FactBadge icon={<Ionicons name="time-outline" size={16} color="#0f172a" />} text={place.openingHours} />
              ) : null}
              {place.specialty ? (
                <FactBadge icon={<Ionicons name="restaurant-outline" size={16} color="#0f172a" />} text={place.specialty} />
              ) : null}
            </View>
          </View>

          {/* Sobre o lugar */}
          {place.description ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Subtle>Sobre o lugar</Subtle>
              <Text style={{ color: '#0f172a', marginTop: 6, lineHeight: 22 }}>{place.description}</Text>
            </View>
          ) : null}

          {/* Cuisine / Features */}
          {(!isHotel && place.cuisine?.length) ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Subtle>Tipo de comida</Subtle>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {place.cuisine.map((c: string, i: number) => <TagChip key={i}>{c}</TagChip>)}
              </View>
            </View>
          ) : null}

          {(isHotel && place.features?.length) ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Subtle>Amenidades</Subtle>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {place.features.map((f: string, i: number) => <TagChip key={i}>{f}</TagChip>)}
              </View>
            </View>
          ) : null}

          {/* Avaliações */}
          {place.reviews?.length ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Subtle>Avaliações</Subtle>
                <TouchableOpacity onPress={openReviews}>
                  <Text style={{ color: BRAND, fontWeight: '700' }}>Ver mais no Google</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 6 }}>
                {place.reviews.slice(0, 3).map((r: any, idx: number) => (
                  <ReviewItem key={idx} author={r.author} rating={r.rating} text={r.text} time={r.time} />
                ))}
              </View>
            </View>
          ) : null}

          {/* Actions */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={openMaps} activeOpacity={0.9} style={[styles.btnSolid, { flex: 1, borderRadius: 14, paddingVertical: 12 }]}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>Abrir no Maps</Text>
              </TouchableOpacity>
              {place.phone ? (
                <TouchableOpacity onPress={callPhone} activeOpacity={0.9} style={[styles.btnOutline, { flex: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderColor: '#e5e7eb' }]}>
                  <Text style={{ color: '#0f172a', fontWeight: '800' }}>Ligar</Text>
                </TouchableOpacity>
              ) : null}
              {place.website ? (
                <TouchableOpacity onPress={openSite} activeOpacity={0.9} style={[styles.btnOutline, { flex: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderColor: BRAND }]}>
                  <Text style={{ color: BRAND, fontWeight: '800' }}>Ver site</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

/* ====================== Bottom Sheet (FOCUS ON CAROUSEL + CTA) ====================== */
function BottomSheet({
  visible,
  trip,
  onClose,
  liked,
  flagged,
  onToggleLike,
  onToggleFlag,
}: {
  visible: boolean;
  trip: Trip | null;
  onClose: () => void;
  liked: boolean;
  flagged: boolean;
  onToggleLike: () => void;
  onToggleFlag: () => void;
}) {
  const SHEET_H = Math.round(SCREEN_H * 0.92);
  const SAFE_PAD_B = Platform.OS === 'ios' ? 22 : 16; // margem segura inferior

  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 230, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SHEET_H, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // Drag para fechar
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_e, g) => {
        const ny = Math.max(0, Math.min(g.dy, SHEET_H));
        translateY.setValue(ny);
      },
      onPanResponderRelease: (_e, g) => {
        const shouldClose = g.vy > 1.1 || g.dy > SHEET_H * 0.22;
        if (shouldClose) {
          Animated.parallel([
            Animated.timing(translateY, { toValue: SHEET_H, duration: 180, useNativeDriver: true }),
            Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: true }),
          ]).start(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, bounciness: 4, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (!trip) return null;
  const meta = metaByTrip[trip.title];

  const CTA = () => (
    <TouchableOpacity
      onPress={() => Alert.alert('Guia', `Abrindo detalhes para: ${trip.title}`)}
      activeOpacity={0.9}
      style={{
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '800' }}>Ir para esse lugar</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.28)',
          opacity: backdrop,
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: SHEET_H,
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [{ translateY }],
            overflow: 'hidden',
          },
          shadow(8),
        ]}
      >
        {/* Floating Close Button (icon-only) */}
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.9}
          style={{
            position: 'absolute',
            right: 10,
            top: 6,
            height: 36,
            width: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            zIndex: 40,
          }}
        >
          <Ionicons name="close" size={18} color="#0f172a" />
        </TouchableOpacity>

        {/* Header */}
        <View {...pan.panHandlers} style={{ paddingTop: 18, alignItems: 'center' }}>
          <View style={{ height: 4, width: 44, borderRadius: 999, backgroundColor: '#e5e7eb' }} />
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }}>
          <Overline>{trip.subtitle} • {trip.city}</Overline>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Title>{trip.title}</Title>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Bandeira + Gostei controlados */}
              <View style={{ marginRight: 6 }}>
                <FlagPill active={flagged} onToggle={onToggleFlag} />
              </View>
              <View>
                <LikePill active={liked} onToggle={onToggleLike} />
              </View>
            </View>
          </View>
        </View>

        {/* Conteúdo */}
        <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SAFE_PAD_B + 100 }}>
            {/* Gallery full width */}
            <SheetGallery uris={meta.gallery} />

            {/* Facts */}
            <View style={{ paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <FactBadge icon={<Ionicons name="wallet-outline" size={16} color="#0f172a" />} text={`Custo: ${meta.afford}`} />
                <FactBadge icon={<Ionicons name="cash-outline" size={16} color="#0f172a" />} text={meta.currency} />
                <FactBadge icon={<Ionicons name="sunny-outline" size={16} color="#0f172a" />} text={meta.bestTime} />
              </View>
            </View>

            {/* Descrição expandida */}
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Subtle>O que é o local</Subtle>
              <Text style={{ color: '#0f172a', lineHeight: 22, fontSize: 14, marginTop: 6 }}>{meta.desc}</Text>
              <Text style={{ color: '#334155', lineHeight: 22, fontSize: 14, marginTop: 8 }}>{meta.more}</Text>
            </View>

            {/* Coisas para fazer - chips */}
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Subtle>Coisas para fazer</Subtle>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                {meta.things.map((t, idx) => (
                  <TagChip key={idx}>{t}</TagChip>
                ))}
              </View>
            </View>

            {/* Perigos / Atenções */}
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Subtle>Perigos / Atenções</Subtle>
              <View style={{ marginTop: 8 }}>
                <Callout icon={<Ionicons name="warning-outline" size={18} color="#c2410c" />} text={meta.dangers} />
              </View>
            </View>
          </ScrollView>

          {/* CTA fixo */}
          <View style={{ padding: 16, paddingBottom: SAFE_PAD_B + 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
            <CTA />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}

/* ============================== Cards ============================== */
function OverlapCard({
  trip,
  index,
  activeIndex,
  onPressCard,
  liked,
  flagged,
  onToggleLike,
  onToggleFlag,
}: {
  trip: Trip;
  index: number;
  activeIndex: number;
  onPressCard: (index: number) => void;
  liked: boolean;
  flagged: boolean;
  onToggleLike: () => void;
  onToggleFlag: () => void;
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

  const dimAlpha = depth === 0 ? 0.2 : 0.32;
  const sideTint = offset === 0 ? 'transparent' : offset < 0 ? 'rgba(80,140,255,0.14)' : 'rgba(255,120,120,0.14)';

  return (
    <BlockableView blocked={depth > 1} style={baseStyle}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPressCard(index)}>
        <CardShell radius={26} elevation={14}>
          <View style={{ position: 'relative', height: 288, width: '100%', backgroundColor: '#000' }}>
            <SafeImage uri={trip.img} alt={trip.title} />
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${dimAlpha})` }} />
            {depth > 0 && <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: sideTint }} />}

            <View style={{ position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ opacity: 0.9 }}>
                <FlagPill active={flagged} onToggle={onToggleFlag} />
              </View>
              <View style={{ opacity: 0.9 }}>
                <LikePill active={liked} onToggle={onToggleLike} />
              </View>
            </View>

            <View style={styles.glassBox}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }} numberOfLines={1}>
                  {trip.title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }} numberOfLines={1}>
                  {trip.subtitle} • {trip.city}
                </Text>
              </View>
              <View style={styles.glassBtn}>
                <Ionicons name="time-outline" size={18} color="#fff" />
              </View>
            </View>
          </View>
        </CardShell>
      </TouchableOpacity>
    </BlockableView>
  );
}

const MiniTile = React.memo(function MiniTile({ title, img, price, onPress }: { title: string; img: string; price?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
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
    </TouchableOpacity>
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

/* ============================== Page ============================== */
export default function Index() {
  const [active, setActive] = useState<number>(0);
  const [bottomTab, setBottomTab] = useState<BottomTab>('home');
  const [placesTab, setPlacesTab] = useState<PlacesTab>('hotels');

  // Bottom Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Place Modal state
  const [placeOpen, setPlaceOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  // SYNC state: liked / flagged por título
  const [likedBy, setLikedBy] = useState<Record<string, boolean>>({});
  const [flaggedBy, setFlaggedBy] = useState<Record<string, boolean>>({});

  const toggleLikeByTitle = (title: string) =>
    setLikedBy((prev) => ({ ...prev, [title]: !prev[title] }));
  const toggleFlagByTitle = (title: string) =>
    setFlaggedBy((prev) => ({ ...prev, [title]: !prev[title] }));

  const deckHeight = Math.min(300, Math.round(SCREEN_H * 0.44));

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
      advisory: 'Abrir assessoria',
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

  const ACTION_W = (containerW - 20 * 2 - 12 * 2) / 3;

  const baseActions = [...quickActions, ...moreActions] as Array<Action | { key: '__spacer__'; label?: '' }>;
  if (baseActions.length % 3 === 2) {
    baseActions.push({ key: '__spacer__' } as any);
  }

  // open bottom sheet from carousel
  const openSheetFor = (idx: number) => {
    setActive(idx);
    const t = trips[idx];
    setSelectedTrip(t);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
  };

  // open place modal
  const openPlace = (place: any) => { setSelectedPlace(place); setPlaceOpen(true); };
  const closePlace = () => setPlaceOpen(false);

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

          {/* Deck / carousel */}
          <View style={{ marginTop: 24, height: deckHeight + 24 }} {...panResponder.panHandlers}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 16 }}>
              {trips.map((t, i) => (
                <OverlapCard
                  key={t.title}
                  trip={t}
                  index={i}
                  activeIndex={active}
                  onPressCard={openSheetFor}
                  liked={!!likedBy[t.title]}
                  flagged={!!flaggedBy[t.title]}
                  onToggleLike={() => toggleLikeByTitle(t.title)}
                  onToggleFlag={() => toggleFlagByTitle(t.title)}
                />
              ))}
            </View>
            <View style={{ position: 'absolute', left: -8, top: deckHeight / 2 - 18, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => openSheetFor((active - 1 + trips.length) % trips.length)} style={[styles.navCircle]}>
                <Ionicons name="chevron-back" size={18} color="#111" />
              </TouchableOpacity>
              <View style={{ width: 8 }} />
              <TouchableOpacity onPress={() => openSheetFor((active + 1) % trips.length)} style={[styles.navCircle]}>
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
                  <MiniTile title={(h as any).title} img={(h as any).img} price={'price' in h ? (h as any).price : undefined} onPress={() => openPlace(h)} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Próximos */}
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

          {/* Atalhos */}
          <View style={{ marginTop: 24, marginBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Seus atalhos</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Acelere seu planejamento com ferramentas úteis</Text>
          </View>

          {/* Quick + More actions */}
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {baseActions.map((a, idx) => {
                if ((a as any).key === '__spacer__') {
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

          {/* Benefícios */}
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

      {/* Place Modal */}
      <PlaceModal visible={placeOpen} place={selectedPlace} onClose={closePlace} />

      {/* Bottom Sheet overlay */}
      <BottomSheet
        visible={sheetOpen}
        trip={selectedTrip}
        onClose={closeSheet}
        liked={!!(selectedTrip && likedBy[selectedTrip.title])}
        flagged={!!(selectedTrip && flaggedBy[selectedTrip.title])}
        onToggleLike={() => selectedTrip && toggleLikeByTitle(selectedTrip.title)}
        onToggleFlag={() => selectedTrip && toggleFlagByTitle(selectedTrip.title)}
      />
    </View>
  );
}

/* ============================== Styles ============================== */
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
  // SearchBar
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
