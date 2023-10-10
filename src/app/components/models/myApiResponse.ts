import { Media } from './media';
import { Platform } from './platform';

export interface MediaWithPlatform extends Media {
  platforms: Platform[];
}

type ApiResponse = MediaWithPlatform[];
