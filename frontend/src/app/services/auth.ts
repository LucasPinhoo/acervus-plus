import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Auth {
    private apiUrl = 'http://127.0.0.1:8000/api/auth';
    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register/`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login/`, credentials).pipe(
            tap(response => {
                if (response.access) {
                    localStorage.setItem('access_token', response.access);
                    localStorage.setItem('refresh_token', response.refresh);
                }
            })
        );
    }

    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile/`, { headers: this.getAuthHeaders() });
    }

    updateProfile(profileData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/profile/`, profileData, { headers: this.getAuthHeaders() });
    }

    deactivateAccount(): Observable<any> {
        return this.http.post(`${this.apiUrl}/deactivate/`, {}, { headers: this.getAuthHeaders() });
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('access_token');
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}
