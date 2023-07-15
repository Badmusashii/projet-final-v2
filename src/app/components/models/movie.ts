export interface Movie {
  id: number;
  title: string;
  director?: string;
  yearOfRelease?: number;
  genre?: string;
  duration?: number;
  cast?: string[];
  rating?: number;
  posterImage?: string;
}
