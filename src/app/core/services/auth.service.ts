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
        this.setAuthData(response.token, response.userId, credentials.email);
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

  private setAuthData(token: string, userId: string, email?: string): void {
    const user: User = {
      id: userId,
      email: email || '',
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.authStateSubject.next({
      isAuthenticated: true,
      user,
      token,
    });
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
