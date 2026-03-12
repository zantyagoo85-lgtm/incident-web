import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, AuthState, User } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.initializeAuthFromStorage();
  }

  private initializeAuthFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token,
        });
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        console.log('AuthService login response:', response);
        // El ApiService ya extrae response.data, así que response es directamente el contenido
        if (response && response.accessToken) {
          console.log('Setting auth data with:', {
            token: response.accessToken.substring(0, 20) + '...',
            userId: response.email,
            fullName: response.fullName,
            email: response.email,
          });
          this.setAuthData(response.accessToken, response.email, response.fullName, response.email);
        }
      }),
    );
  }

  logout(): void {
    this.clearAuthData();
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  private setAuthData(token: string, userId: string, fullName?: string, email?: string): void {
    const user: User = {
      id: userId,
      email: email || '',
      fullName: fullName || '',
    };

    console.log('Setting auth data:', { token: token.substring(0, 20) + '...', user });

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    const newAuthState = {
      isAuthenticated: true,
      user,
      token,
    };

    console.log('New auth state:', newAuthState);
    this.authStateSubject.next(newAuthState);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  }
}
