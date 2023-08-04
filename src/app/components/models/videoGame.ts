export interface VideoGame {
  id: number;
  title: string;
  publisher?: string;
  yearOfRelease?: number;
  genre: string;
  numberOfPlayers: number;
  platform: string[];
  rating?: number;
  coverImage?: string;
}
