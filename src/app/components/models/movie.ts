export interface Movie {
  id: number;
  title: string;
  format: string;
  director?: string;
  yearOfRelease?: number;
  genre?: string;
  duration?: number;
  cast?: string[];
  rating?: number;
  posterImage?: string;
}
