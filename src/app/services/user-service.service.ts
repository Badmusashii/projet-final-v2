import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDg } from '../components/models/user-dg';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.api + `/api`;
  private _accessToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(private http: HttpClient) {
    // const savedToken = localStorage.getItem('token');
  }

  getAccessToken(): string | null {
    return this._accessToken.value;
  }

  setAccessToken(token: string): void {
    // localStorage.setItem('token', token);
    this._accessToken.next(token);
  }

  login(
    username: string,
    password: string
  ): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(
        `${this.apiUrl}/auth/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this.setAccessToken(response.accessToken);
        })
      );
  }

  // Appelle cette méthode pour rafraîchir le token
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(
        `${this.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this.setAccessToken(response.accessToken);
        })
      );
  }
  getOne(): Observable<UserDg> {
    return this.http.get<UserDg>(`${this.apiUrl}/userdg/user/find`);
  }
  resetState(): void {
    this._accessToken.next(null);
  }
  updateProfile(updateDto: { [key: string]: any }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': updateDto['csrfToken'], // Envoyer le CSRF token dans les en-têtes
    });
    const options = {
      headers: headers,
      withCredentials: true,
    };
    return this.http.patch(`${this.apiUrl}/auth/update`, updateDto, options);
  }
  getCsrfToken() {
    return this.http.get<{ csrfToken: string }>(
      `${this.apiUrl}/auth/csrf-token`
    );
  }
}
