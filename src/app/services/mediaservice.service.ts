import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaWithPlatform } from '../components/models/myApiResponse';
import { MovieDetails } from '../components/models/movie-detail';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient, private toast: ToastrService) {}
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
        this.toast.success(
          `Le média "${mediaData.title}" a été ajouté avec succès!`,
          'Succès',
          {
            progressBar: true,
            timeOut: 3000,
            tapToDismiss: true,
            progressAnimation: 'increasing',
          }
        );
      },
      error: (err) => {
        // Gérez les erreurs ici
        console.error("Erreur lors de l'ajout du média:", err);
        this.toast.error('Erreur lors de l’ajout du média.');
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
  getGameInfoByGuid(guid: any): Observable<any> {
    return this.http.get(`https://localhost:8080/api/media/game-info/${guid}`, {
      withCredentials: true,
    });
  }
  getAdditionalImages(guid: any): Observable<any> {
    return this.http.get(
      `https://localhost:8080/api/media/game-images/${guid}`,
      {
        withCredentials: true,
      }
    );
  }
  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `https://localhost:8080/api/media/movie-videos/${id}`
    );
  }
  getRandomTitle(type: string): Observable<any> {
    const body = { type: type }; // Crée un objet avec la propriété 'type'
    return this.http.post<any>(
      'https://localhost:8080/api/media/random',
      body,
      { withCredentials: true }
    );
  }
}
