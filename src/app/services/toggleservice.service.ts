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
    return this.http.post('/api/savePlatformStates', { platformStates }).pipe(
      catchError((error) => {
        // Gère les erreurs ici
        console.log(error);
        throw error;
      })
    );
  }
}
