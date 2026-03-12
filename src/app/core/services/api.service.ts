import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    // Use Docker URL when in production or explicitly in Docker environment
    this.baseUrl =
      environment.isDocker || environment.production
        ? environment.dockerApiBaseUrl
        : environment.apiBaseUrl;
  }

  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { params: httpParams })
      .pipe(map((response) => response.data));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body)
      .pipe(map((response) => response.data));
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('ApiService.patch called:', { url, endpoint, body });
    return this.http.patch<ApiResponse<T>>(url, body).pipe(map((response) => response.data));
  }
}
