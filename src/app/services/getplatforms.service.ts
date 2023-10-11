import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetplatformsService {
  private apiUrl = 'http://localhost:8080/api/platforms';
  constructor(private http: HttpClient) {}
  getPlatforms(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }
  getPlatform(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detail/platform/${id}`, {
      withCredentials: true,
    });
  }
  addMediaToPlatform(platformId: number, mediaData: any) {
    // Remplacez par votre URL d'API et ajustez selon vos besoins
    const url = `${this.apiUrl}/${platformId}/medias`;
    return this.http.post(url, mediaData, { withCredentials: true });
  }
}

export interface Platform {
  id: number;
  name: string;
  platformConstructor: string;
}
