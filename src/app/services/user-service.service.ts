import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api';
  private _accessToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(private http: HttpClient) {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this._accessToken.next(savedToken);
    }
  }

  getAccessToken(): string | null {
    return this._accessToken.value;
  }

  setAccessToken(token: string): void {
    localStorage.setItem('token', token);
    this._accessToken.next(token);
  }

  login(
    username: string,
    password: string
  ): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.setAccessToken(response.accessToken);
        })
      );
  }

  // Appelle cette méthode pour rafraîchir le token
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, {})
      .pipe(
        tap((response) => {
          this.setAccessToken(response.accessToken);
        })
      );
  }
}
