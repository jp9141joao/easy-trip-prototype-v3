import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  stays,
  experiences,
  restaurants,
  features as featureData,
  upcoming as upcomingData,
  community as communityPosts,
  promo as promoContent,
  editorialHighlight,
} from "./data/travelContent";
import { CommunityCard } from "./components/cards/CommunityCard";
import { EditorialHighlight } from "./components/cards/EditorialHighlight";
import { FeatureCard } from "./components/cards/FeatureCard";
import { PromoCard } from "./components/cards/PromoCard";
import { SmallCard } from "./components/cards/SmallCard";
import { UpcomingCard } from "./components/cards/UpcomingCard";
import { SectionHeader } from "./components/common/SectionHeader";
import { BottomBar } from "./components/layout/BottomBar";
import { Header } from "./components/layout/Header";
import { createHomeStyles } from "./styles/home";
import { SafeImageBackground } from "./utils/safeImages";
import { DARK, LIGHT, type Theme } from "./theme";

type FavoritesState = Record<string, boolean>;
type ModalType = "stays" | "experiences" | "restaurants" | "upcoming" | "community";

export default function Home() {
  const [favorites, setFavorites] = useState<FavoritesState>({});
  const [isDark, setIsDark] = useState(true);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const theme: Theme = isDark ? DARK : LIGHT;
  const styles = useMemo(() => createHomeStyles(theme), [theme]);

  const toggleFav = (id: string) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  const modalTitles: Record<ModalType, string> = {
    stays: "Melhores hospedagens",
    experiences: "Experiências imperdíveis",
    restaurants: "Restaurantes populares",
    upcoming: "Próximos",
    community: "Da comunidade",
  };

  const renderModalContent = () => {
    if (!modalType) {
      return null;
    }

    if (modalType === "upcoming") {
      return (
        <FlatList
          key="upcoming"
          data={upcomingData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalList}
          renderItem={({ item }) => (
            <View style={styles.modalFullItem}>
              <UpcomingCard item={item} styles={styles} />
            </View>
          )}
          ListFooterComponent={<View style={{ height: 8 }} />}
        />
      );
    }

    if (modalType === "community") {
      return (
        <FlatList
          key="community"
          data={communityPosts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalList}
          renderItem={({ item }) => (
            <View style={styles.modalFullItem}>
              <CommunityCard post={item} styles={styles} />
            </View>
          )}
          ListFooterComponent={<View style={{ height: 8 }} />}
        />
      );
    }

    const data = modalType === "stays" ? stays : modalType === "experiences" ? experiences : restaurants;

    return (
      <FlatList
        key={modalType}
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.modalList}
        columnWrapperStyle={styles.modalColumn}
        renderItem={({ item }) => (
          <View style={styles.modalGridItem}>
            <SmallCard
              item={item}
              fav={!!favorites[item.id]}
              onToggleFav={() => toggleFav(item.id)}
              styles={styles}
            />
          </View>
        )}
        extraData={favorites}
        ListFooterComponent={<View style={{ height: 12 }} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      <Header theme={theme} styles={styles} onToggleTheme={() => setIsDark((value) => !value)} isDark={isDark} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, gap: 20 }}>
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

          <SectionHeader
            title="Melhores hospedagens"
            action={{ label: "Ver mais", onPress: () => openModal("stays") }}
            styles={styles}
          />
          <FlatList
            horizontal
            data={stays}
            keyExtractor={(item) => item.id}
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

          <SectionHeader
            title="Experiências imperdíveis"
            action={{ label: "Ver mais", onPress: () => openModal("experiences") }}
            styles={styles}
          />
          <FlatList
            horizontal
            data={experiences}
            keyExtractor={(item) => item.id}
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

          <SectionHeader
            title="Restaurantes populares"
            action={{ label: "Ver mais", onPress: () => openModal("restaurants") }}
            styles={styles}
          />
          <FlatList
            horizontal
            data={restaurants}
            keyExtractor={(item) => item.id}
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

          <SectionHeader
            title="Próximos"
            action={{ label: "Ver mais", onPress: () => openModal("upcoming") }}
            styles={styles}
          />
          <FlatList
            horizontal
            data={upcomingData}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <UpcomingCard item={item} styles={styles} />}
          />

          <SectionHeader
            title="Da comunidade"
            action={{ label: "Ver mais", onPress: () => openModal("community") }}
            styles={styles}
          />
          <FlatList
            horizontal
            data={communityPosts}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <CommunityCard post={item} styles={styles} />}
          />

          <PromoCard promo={promoContent} styles={styles} />

          <SectionHeader title="Central de recursos" styles={styles} />
          <FlatList
            horizontal
            data={featureData}
            keyExtractor={(item) => item.key}
            showsHorizontalScrollIndicator={false}
            style={styles.carouselList}
            contentContainerStyle={styles.featureCarousel}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <FeatureCard item={item} styles={styles} />}
          />

          <SectionHeader title="Dos nossos editores" styles={styles} />
          <EditorialHighlight highlight={editorialHighlight} styles={styles} />
        </View>
      </ScrollView>

      <Modal
        visible={modalType !== null}
        animationType="slide"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <Pressable
              onPress={closeModal}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              style={styles.modalClose}
            >
              <Ionicons name="close" size={22} color={theme.text} />
            </Pressable>
            <Text style={styles.h2}>{modalType ? modalTitles[modalType] : ""}</Text>
            <View style={{ width: 22 }} />
          </View>

          <View style={styles.modalSheet}>
            <View style={{ flex: 1 }}>{renderModalContent()}</View>
          </View>
        </SafeAreaView>
        transparent
        visible={modalType !== null}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Pressable
            onPress={closeModal}
            style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
            accessibilityRole="button"
            accessibilityLabel="Fechar modal"
          />

          <View style={[styles.modalSheet, styles.shadow]}>
            <View style={styles.modalHeader}>
              <Text style={styles.h2}>{modalType ? modalTitles[modalType] : ""}</Text>
              <Pressable onPress={closeModal} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fechar">
                <Ionicons name="close" size={22} color={theme.text} />
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>{renderModalContent()}</View>
          </View>
        </View>
      </Modal>

      <BottomBar theme={theme} styles={styles} />
    </SafeAreaView>
  );
}
