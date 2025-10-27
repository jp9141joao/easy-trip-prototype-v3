import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ACCENT = '#00AF87';
const BG = '#f4f6f5';
const TEXT = '#101623';
const SUBTLE = '#6c7a89';
const CARD = '#ffffff';
const { width } = Dimensions.get('window');

const quickActions = [
  { key: 'ofertas', label: 'Ofertas', icon: 'pricetags-outline' },
  { key: 'dicas', label: 'Dicas', icon: 'compass-outline' },
  { key: 'rede', label: 'Rede Social', icon: 'people-outline' },
  { key: 'especialista', label: 'Especialista', icon: 'chatbubbles-outline' },
  { key: 'vistos', label: 'Assessoria de Visto', icon: 'shield-checkmark-outline' },
  { key: 'currency', label: 'Currency', icon: 'cash-outline' },
  { key: 'ia', label: 'Assistente IA', icon: 'sparkles-outline' },
  { key: 'fotos', label: 'Capturar Fotos', icon: 'camera-outline' },
];

const serviceGroups = [
  {
    title: 'Planejamento Inteligente',
    description: 'Monte itinerários, organize agenda e deixe a IA otimizar sua viagem.',
    items: [
      { key: 'itinerario', title: 'Itinerários', icon: 'map-outline' },
      { key: 'agenda', title: 'Agenda', icon: 'calendar-outline' },
      { key: 'gastos', title: 'Controle de gastos', icon: 'wallet-outline' },
      { key: 'diario', title: 'Diário de bordo', icon: 'book-outline' },
    ],
  },
  {
    title: 'Conecte-se com a comunidade',
    description: 'Troque experiências, peça ajuda a especialistas e compartilhe memórias.',
    items: [
      { key: 'social', title: 'Feed de viajantes', icon: 'newspaper-outline' },
      { key: 'expert', title: 'Falar com especialista', icon: 'person-circle-outline' },
      { key: 'grupos', title: 'Grupos por destino', icon: 'chatbubble-ellipses-outline' },
    ],
  },
];

const offers = [
  {
    id: '1',
    title: 'Noronha Minimal Escape',
    subtitle: '4 noites com mergulho incluso',
    price: 'A partir de R$ 2.890',
    image:
      'https://images.unsplash.com/photo-1518544889280-4f66c7dbe4eb?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Buenos Aires Express',
    subtitle: 'City tour e show de tango',
    price: 'A partir de R$ 1.550',
    image:
      'https://images.unsplash.com/photo-1508599589921-901ea443707f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Patagônia Essential',
    subtitle: 'Expedição guiada com especialistas',
    price: 'A partir de R$ 4.320',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  },
];

const places = {
  hotels: [
    {
      id: 'h1',
      name: 'Hotel Horizonte Verde',
      description: 'Design minimalista, spa & rooftop garden.',
      image:
        'https://images.unsplash.com/photo-1512914890250-353c57b12435?q=80&w=1200&auto=format&fit=crop',
      rating: '4.8',
    },
    {
      id: 'h2',
      name: 'Aurora Boutique',
      description: 'Suites inteligentes com assistente virtual.',
      image:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop',
      rating: '4.9',
    },
  ],
  restaurants: [
    {
      id: 'r1',
      name: 'Verde + Mar',
      description: 'Mariscos frescos e atmosfera clean.',
      image:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
      rating: '4.7',
    },
    {
      id: 'r2',
      name: 'Minimal Coffee Lab',
      description: 'Cafés especiais e brunch autoral.',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      rating: '4.9',
    },
  ],
};

const communityPosts = [
  {
    id: 'p1',
    user: 'Gabriela M.',
    time: 'há 2h',
    text: 'Acabei de voltar da Chapada dos Veadeiros e deixei meu roteiro completo na seção de itinerários. Vale cada trilha! 💚',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'p2',
    user: 'Leo A.',
    time: 'há 5h',
    text: 'Alguém já usou a consultoria de vistos para o Canadá? Atendimento super rápido, recomendo!',
    image:
      'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
  },
];

const insights = [
  {
    id: 'i1',
    title: 'Câmbio em tempo real',
    description: 'Veja cotações atualizadas e receba alertas personalizados.',
    icon: 'trending-up',
  },
  {
    id: 'i2',
    title: 'Assistente IA 24/7',
    description: 'Crie itinerários, traduções e checklists instantâneos.',
    icon: 'robot-outline',
  },
  {
    id: 'i3',
    title: 'Linha do tempo da viagem',
    description: 'Sincronize agenda, reservas e lembretes num só lugar.',
    icon: 'timeline-clock-outline',
  },
];

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function ActionPill({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.actionPill} activeOpacity={0.8}>
      <View style={styles.actionIconBox}>
        <Ionicons name={icon as any} size={20} color={ACCENT} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function OfferCard({ item }: { item: (typeof offers)[number] }) {
  return (
    <TouchableOpacity style={styles.offerCard} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
        <View style={styles.offerFooter}>
          <Text style={styles.offerPrice}>{item.price}</Text>
          <Ionicons name="arrow-forward" size={18} color={ACCENT} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ServiceCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85}>
      <View style={styles.serviceIconBox}>
        <Ionicons name={icon as any} size={20} color={ACCENT} />
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

function InsightCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightIconCircle}>
        <MaterialCommunityIcons name={icon as any} size={20} color={ACCENT} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightDescription}>{description}</Text>
      </View>
    </View>
  );
}

function PlaceCard({ item }: { item: (typeof places.hotels)[number] }) {
  return (
    <TouchableOpacity style={styles.placeCard} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      <View style={styles.placeContent}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeDescription}>{item.description}</Text>
        <View style={styles.placeFooter}>
          <Ionicons name="star" size={16} color={ACCENT} />
          <Text style={styles.placeRating}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CommunityCard({ post }: { post: (typeof communityPosts)[number] }) {
  return (
    <View style={styles.communityCard}>
      <View style={styles.communityHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{post.user.slice(0, 1)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.communityUser}>{post.user}</Text>
          <Text style={styles.communityTime}>{post.time}</Text>
        </View>
        <Ionicons name="heart-outline" size={20} color={SUBTLE} />
      </View>
      <Text style={styles.communityText}>{post.text}</Text>
      <Image source={{ uri: post.image }} style={styles.communityImage} />
      <View style={styles.communityFooter}>
        <TouchableOpacity style={styles.communityButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={ACCENT} />
          <Text style={styles.communityButtonText}>Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.communityButton}>
          <Ionicons name="share-outline" size={16} color={ACCENT} />
          <Text style={styles.communityButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroGreeting}>Olá, explorador(a)</Text>
              <Text style={styles.heroTitle}>Planeje viagens memoráveis com tranquilidade</Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={18} color={ACCENT} />
              <Text style={styles.heroBadgeText}>IA ativa</Text>
            </View>
          </View>
          <Text style={styles.heroSubtitle}>
            Ofertas, dicas, rede social, consultoria especializada e ferramentas inteligentes reunidas em uma
            experiência minimalista.
          </Text>
          <View style={styles.heroCTAGroup}>
            <TouchableOpacity style={[styles.heroButton, styles.primaryButton]} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Criar roteiro com IA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.heroButton, styles.secondaryButton]} activeOpacity={0.9}>
              <Text style={styles.secondaryButtonText}>Ver próximas viagens</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Ferramentas rápidas" subtitle="Acesse tudo o que precisa em poucos toques." />
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <ActionPill key={action.key} icon={action.icon} label={action.label} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Ofertas selecionadas"
            subtitle="Viagens curadas para diferentes estilos e orçamentos."
          />
          <FlatList
            horizontal
            data={offers}
            renderItem={({ item }) => <OfferCard item={item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Serviços essenciais"
            subtitle="Tudo integrado para uma jornada completa."
          />
          <View style={styles.insightGrid}>
            {insights.map((insight) => (
              <InsightCard key={insight.id} title={insight.title} description={insight.description} icon={insight.icon} />
            ))}
          </View>
        </View>

        {serviceGroups.map((group) => (
          <View key={group.title} style={styles.section}>
            <SectionHeader title={group.title} subtitle={group.description} />
            <View style={styles.serviceGrid}>
              {group.items.map((item) => (
                <ServiceCard
                  key={item.key}
                  title={item.title}
                  description={
                    item.key === 'itinerario'
                      ? 'Monte roteiros inteligentes com alertas.'
                      : item.key === 'agenda'
                      ? 'Sincronize compromissos e notificações.'
                      : item.key === 'gastos'
                      ? 'Acompanhe o orçamento em tempo real.'
                      : item.key === 'diario'
                      ? 'Registre sentimentos, fotos e notas.'
                      : item.key === 'social'
                      ? 'Descubra posts e roteiros da comunidade.'
                      : item.key === 'expert'
                      ? 'Converse com consultores especializados.'
                      : 'Participe de chats segmentados por destino.'
                  }
                  icon={item.icon}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <SectionHeader
            title="Hotéis e restaurantes"
            subtitle="Sugestões alinhadas ao seu perfil de viagem."
          />
          <Text style={styles.placeCategory}>Hotéis</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placeRow}
          >
            {places.hotels.map((hotel) => (
              <PlaceCard key={hotel.id} item={hotel} />
            ))}
          </ScrollView>
          <Text style={[styles.placeCategory, { marginTop: 16 }]}>Restaurantes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placeRow}
          >
            {places.restaurants.map((restaurant) => (
              <PlaceCard key={restaurant.id} item={restaurant} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Comunidade EasyTrip"
            subtitle="Compartilhe memórias, peça recomendações e inspire outros viajantes."
          />
          {communityPosts.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    marginTop: 8,
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: CARD,
    borderRadius: 28,
    gap: 12,
    shadowColor: '#0c1812',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroGreeting: {
    fontSize: 14,
    color: SUBTLE,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    color: TEXT,
  },
  heroBadge: {
    backgroundColor: '#e8f9f4',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: SUBTLE,
  },
  heroCTAGroup: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroButton: {
    flexGrow: 1,
    flexBasis: '48%',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: ACCENT,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: ACCENT,
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    gap: 6,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: SUBTLE,
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionPill: {
    width: (width - 20 * 2 - 12 * 3) / 2,
    minHeight: 64,
    borderRadius: 18,
    padding: 14,
    backgroundColor: CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0c1812',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#e8f9f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: TEXT,
  },
  offerCard: {
    width: 260,
    marginRight: 16,
    backgroundColor: CARD,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0c1812',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  offerImage: {
    width: '100%',
    height: 150,
  },
  offerContent: {
    padding: 16,
    gap: 8,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  offerSubtitle: {
    fontSize: 13,
    color: SUBTLE,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT,
  },
  insightGrid: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 18,
    backgroundColor: CARD,
    borderRadius: 20,
    shadowColor: '#0c1812',
    shadowOpacity: 0.06,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  insightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#e8f9f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },
  insightDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: SUBTLE,
    marginTop: 4,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  serviceCard: {
    width: (width - 20 * 2 - 14) / 2,
    borderRadius: 20,
    padding: 18,
    backgroundColor: CARD,
    gap: 10,
    shadowColor: '#0c1812',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  serviceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#e8f9f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },
  serviceDescription: {
    fontSize: 13,
    color: SUBTLE,
    lineHeight: 18,
  },
  placeCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 12,
  },
  placeRow: {
    gap: 14,
    paddingRight: 6,
  },
  placeCard: {
    width: 220,
    backgroundColor: CARD,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#0c1812',
    shadowOpacity: 0.06,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  placeImage: {
    width: '100%',
    height: 128,
  },
  placeContent: {
    padding: 16,
    gap: 6,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },
  placeDescription: {
    fontSize: 13,
    color: SUBTLE,
    lineHeight: 18,
  },
  placeFooter: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  placeRating: {
    fontSize: 13,
    color: TEXT,
  },
  communityCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    marginBottom: 16,
    shadowColor: '#0c1812',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#d3f1e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT,
  },
  communityUser: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },
  communityTime: {
    fontSize: 12,
    color: SUBTLE,
  },
  communityText: {
    fontSize: 14,
    color: TEXT,
    lineHeight: 20,
  },
  communityImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  communityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  communityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  communityButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
  },
  bottomSpacing: {
    height: 40,
  },
});

