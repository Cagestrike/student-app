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

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }
    registerUrl = `${BASE_API_URL}/register`;
    loginUrl = `${BASE_API_URL}/login`;
    logoutUrl = `${BASE_API_URL}/logout`;
    refreshUrl = `${BASE_API_URL}/refresh`;

    private refreshTokenTimeout;

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

    refreshToken() {
        return this.http.post<any>(this.refreshUrl, null).subscribe(result => {
            console.log('refreshing token...');
            console.log(result);
            this.setToken(result.access_token);
            this.startRefreshTokenTimer();
        });
    }

    logout() {
        this.clearToken();
        this.router.navigateByUrl('/login');
        this.stopRefreshTokenTimer();
    }

    setToken(token): void {
        localStorage.setItem(TOKEN, token);
        const TOKEN_VALIDITY_IN_MINUTES = 40;
        localStorage.setItem(EXPIRES_AT, new Date(new Date().getTime() + TOKEN_VALIDITY_IN_MINUTES * 60000).toString());
    }

    getToken(): string {
        return localStorage.getItem(TOKEN);
    }

    clearToken() {
        localStorage.clear();
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(TOKEN) != null;
    }

    startRefreshTokenTimer() {
        console.log('start refresh token timer...');

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(localStorage.getItem(EXPIRES_AT));
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }

    stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
