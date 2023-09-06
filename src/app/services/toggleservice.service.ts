import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

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
  savePlatformStates(platformStates: { [id: number]: boolean }) {
    // Ici, on suppose que ton API accepte ces données et que ton token d'authentification est correctement configuré dans les intercepteurs HTTP ou ailleurs
    console.log(
      'les toggles envoyé depuis le front => ' + JSON.stringify(platformStates)
    );
    return this.http
      .post('http://localhost:8080/api/platforms/assignUserToPlatform', {
        platformStates,
      })
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
        `http://localhost:8080/api/user_platforms/`
      )
      .pipe(
        catchError((error) => {
          // Gérer les erreurs ici
          console.log(error);
          throw error;
        })
      );
  }
}
