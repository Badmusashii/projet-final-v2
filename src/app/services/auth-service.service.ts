import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  // BehavoirSubject qui gerera l'etat de connection de mon User
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private accessToken: string | null = null;
  authStatusChanged = new EventEmitter<boolean>();
  // public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  // ------------------------------------------------------------------
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private route: Router
  ) {
    // this.checkInitialAuthentication().then(() => {
    //   console.log('l/etat dautentification à été verifie');
    // });
  }
  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  public initAuth() {
    return this.checkInitialAuthentication();
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // checkInitialAuthentication(): Promise<void> {
  //   return new Promise((resolve) => {
  //     const token = localStorage.getItem('token');
  //     console.log(`Token au démarrage: ${token}`);
  //     if (token) {
  //       this.validateToken(token).subscribe(
  //         (isValid) => {
  //           console.log(`Résultat de la validation du token: ${isValid}`);
  //           this.isAuthenticatedSubject.next(isValid);
  //           resolve();
  //         },
  //         (error) => {
  //           console.log(`Erreur lors de la validation du token:${error}`);

  //           this.isAuthenticatedSubject.next(false);
  //           resolve();
  //         }
  //       );
  //     } else {
  //       this.isAuthenticatedSubject.next(false);
  //       resolve();
  //     }
  //   });
  // }
  checkInitialAuthentication(): Promise<void> {
    return new Promise((resolve) => {
      const token = this.getAccessToken();
      console.log(`Token au démarrage: ${token}`);
      if (token) {
        this.validateToken(token).subscribe(
          (isValid) => {
            console.log(`Résultat de la validation du token: ${isValid}`);
            this.isAuthenticatedSubject.next(isValid);
            resolve();
          },
          (error) => {
            console.log(`Erreur lors de la validation du token: ${error}`);
            this.isAuthenticatedSubject.next(false);
            resolve();
          }
        );
      } else {
        this.isAuthenticatedSubject.next(false);
        resolve();
      }
    });
  }

  private validateToken(token: string) {
    // Envoie une requête au backend pour valider le token
    return this.http.post<boolean>(
      'https://localhost:8080/api/userdg/validate',
      {
        token: token,
      }
    );
  }

  // Méthode pour mettre à jour l'état d'authentification
  updateAuthenticationStatus(isAuthenticated: boolean): void {
    console.log(`Mise à jour de l'état d'authentification: ${isAuthenticated}`);
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.authStatusChanged.emit(isAuthenticated);
  }
  logout(): Observable<any> {
    return this.http
      .post(
        'https://localhost:8080/api/auth/logout',
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.setAccessToken(null); // Efface l'access token du BehaviorSubject

          this.isAuthenticatedSubject.next(false);
          this.authStatusChanged.emit(false);
          this.route.navigate(['/acceuil']);
        })
      );
  }
}
