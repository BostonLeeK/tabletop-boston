export interface Game {
  id: string;
  name: string;
  nameEn?: string;
  shortDescription?: string;
  fullDescription?: string;
  description: string;
  rating: number;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  image?: string;
  category?: string;
  videoUrl?: string;
}

export const GAME_CATEGORIES = [
  "Стратегія",
  "Сімейна",
  "Природа",
  "Кооперативна",
  "Абстрактна",
  "Економічна",
  "Військова",
  "Детективна",
  "Фентезі",
  "Наукова фантастика",
] as const;
