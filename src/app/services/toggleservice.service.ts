import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ToggleService {
  private togglesSubject = new BehaviorSubject<{ [id: number]: boolean }>({});
  toggles$ = this.togglesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentToggles(): { [id: number]: boolean } {
    return this.togglesSubject.getValue();
  }

  // Utilisez cette méthode si vous voulez initialiser les boutons à bascule avec des valeurs

  updateToggle(id: number, value: boolean) {
    const currentToggles = { ...this.togglesSubject.getValue() };
    currentToggles[id] = value;
    this.togglesSubject.next(currentToggles);
  }
  resetToggles() {
    this.togglesSubject.next({}); // Réinitialise le BehaviorSubject à un objet vide
  }
  savePlatformStates(platformStates: { [id: number]: boolean }) {
    // Ici, on suppose que ton API accepte ces données et que ton token d'authentification est correctement configuré dans les intercepteurs HTTP ou ailleurs
    console.log(
      'les toggles envoyé depuis le front => ' + JSON.stringify(platformStates)
    );
    return this.http
      .post(
        `${environment.api}/api/platforms/assignUserToPlatform`,
        {
          platformStates,
        },
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          // Gère les erreurs ici
          console.log(error);
          throw error;
        })
      );
  }
  fetchInitialToggles() {
    return this.http
      .get<{ [id: number]: boolean }>(
        `${environment.api}/api/platforms/toggle`,
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          // Gérer les erreurs ici
          console.log(error);
          throw error;
        })
      );
  }
  fetchAndSetTogglesForUser() {
    this.http
      .get<{ [id: number]: boolean }>(
        environment.api + `/api/platforms/toggle`,
        { withCredentials: true }
      )
      .subscribe(
        (data) => {
          this.togglesSubject.next(data);
        },
        (error) => {
          console.log(
            'Erreur lors de la récupération des états des toggles :',
            error
          );
        }
      );
  }
}
