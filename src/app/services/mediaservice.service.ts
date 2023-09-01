import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}
  addMediaToUserAndPlatform(platformId: number, mediaData: any): void {
    console.log("envoyé de l'input" + mediaData);
    const apiUrl = `http://localhost:8080/api/platforms/${platformId}/medias`; // Remplacer par l'URL de votre API
    const token = localStorage.getItem('token');
    console.log(mediaData, "l'input envoyé");

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };

    const payload = {
      platformId,
      mediaData,
    };

    this.http.post(apiUrl, payload, httpOptions).subscribe({
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
}
