import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationResultModel } from './model/authenticationResultModel.model';
import { BASE_API_URL, formatDateToAPIFormat } from './api-utils';
import { Router } from '@angular/router';

const TOKEN = 'authentication_token';
const EXPIRES_AT = 'expires_at';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    registerUrl = `${BASE_API_URL}/register`;
    loginUrl = `${BASE_API_URL}/login`;
    logoutUrl = `${BASE_API_URL}/logout`;
    refreshUrl = `${BASE_API_URL}/refresh`;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    register(userData) {
        return this.http.post(this.registerUrl, userData);
    }

    login(email, password) {
        return this.http.post<any>(this.loginUrl, {
            email,
            password,
            VerySecureKey: "abcd"
        });
    }

    logout() {
        this.clearToken();
        this.router.navigateByUrl('/login');
    }

    setToken(token): void {
        localStorage.setItem(TOKEN, token);
        localStorage.setItem(EXPIRES_AT, new Date(new Date().getTime() + 50 * 60000).toString());
    }

    getToken(): string {
        const expiresAt = new Date(localStorage.getItem(EXPIRES_AT));
        if (new Date() >= expiresAt) {
            this.http.post<any>(this.refreshUrl, null, { headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` }) })
                .subscribe(refreshResult => {
                    console.log(refreshResult);
                    this.setToken(refreshResult.access_token);
                }, error => {
                    console.error(error);
                })
        }
        return localStorage.getItem(TOKEN);
    }

    clearToken() {
        localStorage.removeItem(EXPIRES_AT);
        localStorage.removeItem(TOKEN);
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(TOKEN) != null;
    }
}
