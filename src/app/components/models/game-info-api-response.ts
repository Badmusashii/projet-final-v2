import { GameInfo } from './game-info';

export interface gameInfoApiResponse {
  error: string;
  limit: number;
  offset: number;
  number_of_page_results: number;
  number_of_total_results: number;
  status_code: number;
  results: GameInfo;
  version: string;
}
