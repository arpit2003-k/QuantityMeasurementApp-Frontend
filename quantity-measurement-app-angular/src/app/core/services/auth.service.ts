import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, SignupRequest, AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private api = environment.apiUrl;

    constructor(private http: HttpClient) { }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/auth/login', data).pipe(
            tap((res: AuthResponse) => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('userEmail', data.email);
            })
        );
    }

    signup(data: SignupRequest): Observable<any> {
        return this.http.post('/auth/register', data, { responseType: 'text' });
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getUserEmail(): string {
        return localStorage.getItem('userEmail') || '';
    }

    getUserInitial(): string {
        return this.getUserEmail().charAt(0).toUpperCase() || 'U';
    }
}