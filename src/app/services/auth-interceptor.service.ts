import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpClient,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from './user-service.service';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private authServiceService: AuthServiceService
  ) {}

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     let cloned = this.addToken(req);
  //     return next.handle(cloned).pipe(
  //       catchError((error) => {
  //         if (error.status === 401) {
  //           // Si on reçoit une erreur 401, tente de rafraîchir le token
  //           return this.handle401Error(req, next);
  //         }
  //         // Si ce n'est pas une erreur 401, ou si le rafraîchissement du token échoue, rejette l'erreur
  //         return throwError(error);
  //       })
  //     );
  //   }
  // }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const token = localStorage.getItem('token');

    let clonedReq = this.addToken(req); // On utilise la méthode addToken pour gérer le token, même s'il est null.

    return next.handle(clonedReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Si on reçoit une erreur 401, on tente de rafraîchir le token
          return this.handle401Error(req, next);
        }
        // Si ce n'est pas une erreur 401, ou si le rafraîchissement du token échoue, on rejette l'erreur
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.authService.getAccessToken();
    // console.log('coté interceptor ', accessToken);
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return request;
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((response: { accessToken: string }) => {
        // Stocker le nouveau token et réessayer la requête
        // this.authService.setAccessToken(response.accessToken);
        // const clonedReq = this.addToken(request);
        // return next.handle(clonedReq);
        if (response && response.accessToken) {
          this.authService.setAccessToken(response.accessToken);
          const clonedReq = this.addToken(request);
          this.authServiceService.isAuthenticatedSubject.next(true);
          return next.handle(clonedReq);
        } else {
          // Gérer l'échec du rafraîchissement du token ici
          this.authServiceService.logout(); // Déconnecter l'utilisateur
          return throwError(
            () => new Error('Échec du rafraîchissement du token')
          );
        }
      }),
      catchError((error) => {
        // Gérer les erreurs de rafraîchissement ici
        this.authServiceService.logout(); // Déconnecter l'utilisateur
        this.authServiceService.isAuthenticatedSubject.next(false);
        return throwError(() => error);
      })
    );
  }
}
