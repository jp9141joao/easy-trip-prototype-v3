import type { Trip, Benefit, Action } from "@/types";

export const trips: Trip[] = [
  { title: "Mount Aconcagua – Circuito completo", subtitle: "South America", price: "$1,250", city: "Mendoza, AR", img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop" },
  { title: "Rio de Janeiro — Pão de Açúcar + Cristo Redentor", subtitle: "Brazil", price: "$980", city: "Rio, BR", img: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop" },
  { title: "Cusco & Machu Picchu", subtitle: "Peru", price: "$1,420", city: "Cusco, PE", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=1200&auto=format&fit=crop" },
  { title: "Torres del Paine", subtitle: "Chile", price: "$1,150", city: "Puerto Natales, CL", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop" },
  { title: "Salar de Uyuni (Expedição 3 dias)", subtitle: "Bolivia", price: "$890", city: "Uyuni, BO", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop" },
  { title: "Deserto do Atacama", subtitle: "Chile", price: "$960", city: "San Pedro de Atacama, CL", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" },
  { title: "Cartagena das Índias", subtitle: "Colombia", price: "$820", city: "Cartagena, CO", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop" },
  { title: "Fernando de Noronha", subtitle: "Brazil", price: "$1,480", city: "Pernambuco, BR", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop" },
];

export const hotels = [
  { id: "h1", title: "Deep River", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop", price: "$110 / night" },
  { id: "h2", title: "Arabella",  img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop", price: "$120 / night" },
  { id: "h3", title: "Cyan Resort", img: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop", price: "$140 / night" },
];

export const restaurants = [
  { id: "r1", title: "Pasta Nostra",   img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", price: "$$" },
  { id: "r2", title: "Sushi & Co",     img: "https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1200&auto=format&fit=crop", price: "$$$" },
  { id: "r3", title: "Choripán House", img: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop", price: "$" },
  { id: "r4", title: "Prime Steak",    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop", price: "$$$" },
  { id: "r5", title: "La Pizzeria",    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop", price: "$$" },
];

export const upcomingTrips = [
  { id: "u1", date: "24 Nov", title: "Check-in: Rio de Janeiro", icon: "calendar" as const },
  { id: "u2", date: "02 Dez", title: "Trilha Aconcágua",         icon: "map" as const },
  { id: "u3", date: "15 Dez", title: "Voo para Cusco",           icon: "airplane" as const },
];

export const quickActions: Action[] = [
  { key: "social", label: "Rede Social" },
  { key: "promos", label: "Promoções" },
  { key: "logbook", label: "Diário de bordo" },
];

export const moreActions: Action[] = [
  { key: "ai",        label: "Ajuda por IA" },
  { key: "itinerary", label: "Itinerário" },
  { key: "gastos",    label: "Gastos" },
  { key: "agenda",    label: "Agenda" },
  { key: "fotos",     label: "Fotos" },
  { key: "expert",    label: "Falar com especialista" },
  { key: "currency",  label: "Cotação de moedas" },
  { key: "advisory",  label: "Assessoria" },
];

export const benefits: Benefit[] = [
  { key: "culture", title: "Exposição Cultural", text: "Descubra tradições, culinárias e estilos de vida diferentes ao redor do mundo.", icon: "image-multiple-outline" },
  { key: "growth",  title: "Crescimento Pessoal", text: "Planeje melhor, conheça pessoas novas e desenvolva autonomia viajando.", icon: "star-outline" },
  { key: "memories",title: "Memórias", text: "Registre fotos e diário de bordo, e guarde momentos para sempre.", icon: "camera-outline" },
  { key: "stress",  title: "Redução do Estresse", text: "Organize sua viagem com agenda e gastos claros para curtir sem preocupação.", icon: "calendar-month-outline" },
];
