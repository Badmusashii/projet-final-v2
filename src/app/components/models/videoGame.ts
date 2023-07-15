export interface VideoGame {
  id: number;
  title: string;
  publisher?: string;
  yearOfRelease?: number;
  genre: string;
  numberOfPlayers: number;
  platform: string[];
  rating?: number; // ou utilisez une interface distincte pour les évaluations si elles sont plus complexes
  coverImage?: string;
}
