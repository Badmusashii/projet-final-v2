import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  // BehavoirSubject qui gerera l'etat de connection de mon User
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  authStatusChanged = new EventEmitter<boolean>();
  // public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  // ------------------------------------------------------------------
  constructor(private http: HttpClient) {
    this.checkInitialAuthentication();
  }
  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private checkInitialAuthentication() {
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken(token).subscribe(
        (isValid) => {
          this.isAuthenticatedSubject.next(isValid);
          this.authStatusChanged.emit(isValid);
        },
        (error) => {
          this.isAuthenticatedSubject.next(false);
          this.authStatusChanged.emit(false);
        }
      );
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private validateToken(token: string) {
    // Envoie une requête au backend pour valider le token
    return this.http.post<boolean>('https://localhost:8080/api/user/validate', {
      token: token,
    });
  }

  // Méthode pour mettre à jour l'état d'authentification
  updateAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.authStatusChanged.emit(isAuthenticated);
  }
  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.authStatusChanged.emit(false);
  }
}
