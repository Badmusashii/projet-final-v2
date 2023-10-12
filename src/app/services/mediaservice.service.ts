import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaWithPlatform } from '../components/models/myApiResponse';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}
  addMediaToUserAndPlatform(platformId: number, mediaData: any): void {
    console.log("envoyé de l'input" + JSON.stringify(mediaData));
    const apiUrl = `https://localhost:8080/api/platforms/${platformId}/medias`; // Remplacer par l'URL de votre API
    // const token = localStorage.getItem('token');
    console.log(mediaData, "l'input envoyé");

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: `Bearer ${token}`,
    //   }),
    // };

    // const payload = {
    //   platformId,
    //   mediaData,
    // };

    this.http.post(apiUrl, mediaData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        // Gérez la réponse du serveur ici
        console.log('Média ajouté:', response);
      },
      error: (err) => {
        // Gérez les erreurs ici
        console.error("Erreur lors de l'ajout du média:", err);
      },
    });
  }
  searchMediaByTitle(title: string, platformId: number): Observable<any> {
    // Désinfection du champ de recherche
    const sanitizedSearchText = title.replace(/[^a-zA-Z0-9 ]/g, '');
    console.log(
      'input desinfecté dans le service front ' + sanitizedSearchText
    );
    console.log(platformId);
    return this.http.post(
      `https://localhost:8080/api/media/search/${platformId}`,
      {
        title: sanitizedSearchText,
      },
      { withCredentials: true }
    );
  }
  getAllMediaByPlatformAndUser(
    platformId: number
  ): Observable<MediaWithPlatform[]> {
    return this.http.get<MediaWithPlatform[]>(
      `https://localhost:8080/api/media/all/${platformId}`,
      { withCredentials: true }
    );
  }
  removeMediaRelation(mediaId: number): Observable<any> {
    return this.http.delete(
      `https://localhost:8080/api/media/deleteTitle/${mediaId}`,
      { withCredentials: true }
    );
  }
}
