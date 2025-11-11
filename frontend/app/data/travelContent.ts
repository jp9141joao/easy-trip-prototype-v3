import {
  CardItem,
  FeatureItem,
  UpcomingItem,
  CommunityPost,
  PromoContent,
  EditorialHighlight,
} from "../types/content";

export const stays: CardItem[] = [
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

export const experiences: CardItem[] = [
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
    rating: 5,
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

export const restaurants: CardItem[] = [
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

export const features: FeatureItem[] = [
  {
    key: "ai",
    title: "Ajuda por IA",
    subtitle: "Planeje em segundos",
    icon: "flash",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "diario",
    title: "Diário de bordo",
    subtitle: "Memórias da viagem",
    icon: "book",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "itinerario",
    title: "Itinerário",
    subtitle: "Dia a dia organizado",
    icon: "map",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "gastos",
    title: "Gastos",
    subtitle: "Controle de despesas",
    icon: "cash",
    image:
      "https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "agenda",
    title: "Agenda",
    subtitle: "Compromissos e alertas",
    icon: "calendar",
    image:
      "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "fotos",
    title: "Fotos",
    subtitle: "Álbuns compartilhados",
    icon: "images",
    image:
      "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "porquinho",
    title: "Porquinho",
    subtitle: "Cofrinho da viagem",
    icon: "wallet",
    image:
      "https://images.unsplash.com/photo-1605902711834-8b11c3a3e2d7?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "especialista",
    title: "Falar com especialista",
    subtitle: "Atendimento humano",
    icon: "chatbubbles",
    image:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "moedas",
    title: "Cotação de moedas",
    subtitle: "Câmbio em tempo real",
    icon: "swap-horizontal",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    key: "assessoria",
    title: "Assessoria",
    subtitle: "Vistos e suporte",
    icon: "shield-checkmark",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop",
  },
];

export const upcoming: UpcomingItem[] = [
  { id: "u1", dateLabel: "24 Nov", title: "Entrada: Rio de Janeiro", icon: "calendar" },
  { id: "u2", dateLabel: "02 Dez", title: "Trilha Aconcágua", icon: "map" },
  { id: "u3", dateLabel: "15 Dez", title: "Voo para Cusco", icon: "airplane" },
];

export const community: CommunityPost[] = [
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

export const promo: PromoContent = {
  title: "Promoções",
  subtitle: "Novas ofertas todos os dias",
  cta: "Ver agora",
  image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
};

export const editorialHighlight: EditorialHighlight = {
  title: "Estradas cênicas imperdíveis nesta temporada",
  image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1400&auto=format&fit=crop",
  cta: "Explorar",
};
