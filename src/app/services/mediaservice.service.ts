import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MediaWithPlatform } from '../components/models/myApiResponse';
import { MovieDetails } from '../components/models/movie-detail';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient, private toast: ToastrService) {}
  addMediaToUserAndPlatform(platformId: number, mediaData: any): void {
    console.log("envoyé de l'input" + JSON.stringify(mediaData));
    const apiUrl = `${environment.api}/api/platforms/${platformId}/medias`; // Remplacer par l'URL de votre API
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
      `${environment.api}/api/media/search/${platformId}`,
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
      `${environment.api}/api/media/all/${platformId}`,
      { withCredentials: true }
    );
  }
  removeMediaRelation(mediaId: number): Observable<any> {
    return this.http.delete(
      `${environment.api}/api/media/deleteTitle/${mediaId}`,
      { withCredentials: true }
    );
  }
  getGameInfoByGuid(guid: any): Observable<any> {
    return this.http.get(`${environment.api}/api/media/game-info/${guid}`, {
      withCredentials: true,
    });
  }
  getAdditionalImages(guid: any): Observable<any> {
    return this.http.get(`${environment.api}/api/media/game-images/${guid}`, {
      withCredentials: true,
    });
  }
  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `${environment.api}/api/media/movie-videos/${id}`
    );
  }
  getRandomTitle(type: string): Observable<any> {
    const body = { type: type }; // Crée un objet avec la propriété 'type'
    return this.http.post<any>(`${environment.api}/api/media/random`, body, {
      withCredentials: true,
    });
  }
  getMoviePoster(idApi: string, platformId: number): Observable<any> {
    if (platformId <= 3) {
      return this.http
        .get<any>(`${environment.api}/api/media/movie-poster/${idApi}`)
        .pipe(map((res) => `https://image.tmdb.org/t/p/w500${res.posterPath}`));
    } else {
      return this.http
        .get<any>(`${environment.api}/api/media/game-poster/${idApi}`)
        .pipe(map((res) => res.posterPath));
    }
  }
}
