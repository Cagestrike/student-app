import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationResultModel} from './model/authenticationResultModel.model';
import { Router } from '@angular/router';

const TOKEN = 'authentication_token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    constructor(
      private http: HttpClient,
      private router: Router
    ) { }

    login(email, password): Observable<AuthenticationResultModel>{
      return this.http.post<AuthenticationResultModel>('https://reqres.in/api/login', {
        email,
        password
      });
    }

    logout() {
        this.clearToken();
        this.router.navigateByUrl('/login');
    }

    setToken(token): void {
      localStorage.setItem(TOKEN, token);
    }

    clearToken() {
        localStorage.removeItem(TOKEN);
    }

    isLoggedIn(): boolean {
      return localStorage.getItem(TOKEN) != null;
    }
}
