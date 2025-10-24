export interface Trip {
  title: string;
  subtitle: string;
  price: string;
  city: string;
  img: string;
}

export type ActionKey =
  | "social"
  | "promos"
  | "logbook"
  | "ai"
  | "itinerary"
  | "gastos"
  | "agenda"
  | "fotos"
  | "expert"
  | "currency"
  | "advisory"; // Assessoria

export interface Action { key: ActionKey; label: string; }

export interface Benefit { key: string; title: string; text: string; icon: string; }

export type PlacesTab = "hotels" | "restaurants";
export type BottomTab = "home" | "discover" | "trips" | "profile";
