export interface Palace {
  id: string;
  name: string;
  koreanName: string;
  founded: string;
  description: string;
  keyHighlight: string;
  image: string;
  location: string;
  detailedTips: string;
}

export interface HeritageItem {
  id: string;
  name: string;
  category: "Artifact" | "Architecture" | "Living Heritage" | "Natural Heritage";
  description: string;
  image: string;
  period: string;
  keyHighlight: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  period: string;
  summary: string;
  details: string;
  image: string;
}

export interface CultureCategory {
  id: "gastronomy" | "arts" | "global" | "innovation";
  title: string;
  subtitle: string;
  coverImage: string;
  intro: string;
}

export interface CultureItem {
  id: string;
  categoryId: "gastronomy" | "arts" | "global" | "innovation";
  title: string;
  koreanName: string;
  summary: string;
  details: string;
  image: string;
  highlights: string[];
  tips?: string;
}

export interface Attraction {
  name: string;
  desc: string;
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  koreanName: string;
  tagline: string;
  description: string;
  coverImage: string;
  locationLabel: string;
  highlights: string[];
  travelTips: {
    bestTime: string;
    mustTry: string;
    hiddenGem: string;
  };
  attractions: Attraction[];
  isCustom?: boolean;
  region?: string;
}

export interface Festival {
  id: string;
  name: string;
  koreanName: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  region?: "Seoul/Capital" | "Gangwon" | "Chungcheong" | "Jeolla" | "Gyeongsang" | "Jeju" | string;
  category?: "Flower & Nature" | "Traditional & Culture" | "Food & Gourmet" | "Night & Lights" | "Music & Arts" | "Winter & Ice" | string;
  location: string;
  dateRange: string;
  description: string;
  image: string;
  highlight: string;
  features: string[];
  month: number; // 1-12
  isCustom?: boolean;
}

export interface HangulConcept {
  hangul: string;
  romanization: string;
  meaning: string;
  poeticDescription: string;
}

export interface CardStyle {
  id: string;
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  bgImage?: string;
  fontStyle: string;
}

export interface PostcardLog {
  id: string;
  createdAt: string; // ISO string
  cardNumber: number;
  recipientName: string;
  customMessage: string;
  conceptHangul: string;
  conceptRomanization: string;
  conceptMeaning: string;
  styleId: string;
  styleName: string;
  bgGradient: string;
  textColor: string;
  fontStyle: string;
}
