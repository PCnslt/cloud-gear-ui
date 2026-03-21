import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { 
  User, 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  UpdateProfileRequest,
  UserSession 
} from '../models/user.model';

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
    // Check for existing token on service initialization
    this.checkAuthStatus();
  }
  
  /**
   * Register a new user.
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Login with email and password.
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Logout the current user.
   */
  logout(): void {
    // Clear token from storage
    this.clearToken();
    
    // Clear current user
    this.currentUserSubject.next(null);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
  
  /**
   * Check if user is authenticated.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    const tokenData = this.parseToken(token);
    if (!tokenData || this.isTokenExpired(tokenData)) {
      this.clearToken();
      return false;
    }
    
    return true;
  }
  
  /**
   * Get current user token.
   */
  getToken(): string | null {
    if (environment.jwt.storageType === 'localStorage') {
      return localStorage.getItem(this.tokenKey);
    } else {
      // For cookie storage, we would need server-side implementation
      return null;
    }
  }
  
  /**
   * Get current user.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  /**
   * Update user profile.
   */
  updateProfile(updateRequest: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, updateRequest)
      .pipe(
        tap(user => {
          // Update current user with new data
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...user };
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * Check authentication status on app initialization.
   */
  checkAuthStatus(): void {
    const token = this.getToken();
    
    if (token && this.isTokenValid(token)) {
      // Token exists and is valid, try to get user info
      this.getUserInfo().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          // Token might be invalid, clear it
          this.clearToken();
          this.currentUserSubject.next(null);
        }
      });
    } else {
      // No valid token, clear any existing token
      this.clearToken();
      this.currentUserSubject.next(null);
    }
  }
  
  /**
   * Get user information from token or API.
   */
  private getUserInfo(): Observable<User> {
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    
    const tokenData = this.parseToken(token);
    
    if (!tokenData || !tokenData.sub) {
      return throwError(() => new Error('Invalid token'));
    }
    
    // For now, extract user info from token
    // In a real app, you might want to call an API endpoint
    const user: User = {
      id: tokenData.userId || 0,
      email: tokenData.sub,
      firstName: tokenData.firstName || '',
      lastName: tokenData.lastName || '',
      createdAt: new Date(tokenData.iat * 1000),
      updatedAt: new Date(),
      enabled: true,
      locked: false
    };
    
    return of(user);
  }
  
  /**
   * Handle authentication response (login/register).
   */
  private handleAuthResponse(response: AuthResponse): void {
    // Store token
    this.storeToken(response.token);
    
    // Update current user
    this.currentUserSubject.next(response.user);
    
    // Store session info if needed
    const session: UserSession = {
      user: response.user,
      token: response.token,
      expiresAt: response.expiresAt,
      lastActivity: new Date()
    };
    
    // You could store session in localStorage if needed
    // localStorage.setItem('cloudgear_session', JSON.stringify(session));
  }
  
  /**
   * Store JWT token.
   */
  private storeToken(token: string): void {
    if (environment.jwt.storageType === 'localStorage') {
      localStorage.setItem(this.tokenKey, token);
    }
    // For cookie storage, server should set HttpOnly cookie
  }
  
  /**
   * Clear JWT token.
   */
  private clearToken(): void {
    if (environment.jwt.storageType === 'localStorage') {
      localStorage.removeItem(this.tokenKey);
    }
    // For cookie storage, server should clear cookie
  }
  
  /**
   * Parse JWT token.
   */
  private parseToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
  
  /**
   * Check if token is valid.
   */
  private isTokenValid(token: string): boolean {
    const tokenData = this.parseToken(token);
    return tokenData && !this.isTokenExpired(tokenData);
  }
  
  /**
   * Check if token is expired.
   */
  private isTokenExpired(tokenData: any): boolean {
    if (!tokenData.exp) {
      return true;
    }
    
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    return Date.now() > expirationTime;
  }
  
  /**
   * Handle HTTP errors.
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request';
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.status === 409) {
        errorMessage = 'Email already registered';
      } else if (error.status === 429) {
        errorMessage = 'Too many attempts. Please try again later.';
      } else {
        errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }
    
    console.error('AuthService error:', error);
    return throwError(() => new Error(errorMessage));
  }
  
  /**
   * Validate email format.
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate password strength.
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get password strength score.
   */
  getPasswordStrength(password: string): number {
    let score = 0;
    
    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    // Maximum score is 7
    return Math.min(score, 7);
  }
  
  /**
   * Get password strength label.
   */
  getPasswordStrengthLabel(score: number): string {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Fair';
    if (score <= 6) return 'Good';
    return 'Strong';
  }
  
  /**
   * Get password strength color.
   */
  getPasswordStrengthColor(score: number): string {
    if (score <= 2) return '#f44336'; // Red
    if (score <= 4) return '#ff9800'; // Orange
    if (score <= 6) return '#4caf50'; // Green
    return '#2e7d32'; // Dark green
  }
}