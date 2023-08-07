import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleService {
  private togglesSubject = new BehaviorSubject<{ [id: number]: boolean }>({});
  toggles$ = this.togglesSubject.asObservable();

  getCurrentToggles(): { [id: number]: boolean } {
    return this.togglesSubject.getValue();
  }

  // Utilisez cette méthode si vous voulez initialiser les boutons à bascule avec des valeurs

  updateToggle(id: number, value: boolean) {
    const currentToggles = { ...this.togglesSubject.getValue() };
    currentToggles[id] = value;
    this.togglesSubject.next(currentToggles);
  }
}
