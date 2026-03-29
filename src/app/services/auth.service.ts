import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = environment.jwt.storageKey;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }
  
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }
  
  login(email: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }
  
  logout(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const tokenData = this.parseToken(token);
      if (!tokenData || this.isTokenExpired(tokenData)) {
        this.clearToken();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  checkAuthStatus(): void {
    const token = this.getToken();
    
    if (token && this.isTokenValid(token)) {
      const tokenData = this.parseToken(token);
      if (tokenData) {
        const user: User = {
          id: tokenData.userId || 0,
          email: tokenData.sub || '',
          firstName: tokenData.firstName || '',
          lastName: tokenData.lastName || '',
          createdAt: new Date(tokenData.iat * 1000),
          updatedAt: new Date()
        };
        this.currentUserSubject.next(user);
      }
    } else {
      this.clearToken();
      this.currentUserSubject.next(null);
    }
  }
  
  private handleAuthResponse(response: AuthResponse): void {
    this.storeToken(response.token);
    this.currentUserSubject.next(response.user);
  }
  
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
  
  private parseToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
  
  private isTokenValid(token: string): boolean {
    const tokenData = this.parseToken(token);
    return tokenData && !this.isTokenExpired(tokenData);
  }
  
  private isTokenExpired(tokenData: any): boolean {
    if (!tokenData.exp) return true;
    return Date.now() > tokenData.exp * 1000;
  }
  
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request';
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.status === 409) {
        errorMessage = 'Email already registered';
      } else {
        errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}