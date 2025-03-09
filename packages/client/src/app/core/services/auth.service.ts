import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginData } from 'shared'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/v1/auth';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token') || !!this.getCookie('access_token');
  }

  login(loginData: LoginData): Observable<any> {
    console.log('Calling login API with credentials:', loginData);
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        console.log('Login API response:', response);
        const token = response.access_token;
        localStorage.setItem('access_token', token);
        this.setCookie('access_token', token, 1);
      })
    );
  }
  
  register(userDetails: { username: string; email: string; password: string }): Observable<any> {
    console.log('Calling register API with user details:', userDetails);
    return this.http.post<any>(`${this.apiUrl}/register`, userDetails).pipe(
      tap((response) => {
        console.log('Register API response:', response);
        const token = response.access_token;
        localStorage.setItem('access_token', token);
        this.setCookie('access_token', token, 1);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.deleteCookie('access_token');
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}