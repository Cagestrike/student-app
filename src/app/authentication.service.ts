import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationResultModel} from './model/authenticationResultModel.model';

const TOKEN = 'authentication_token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    constructor(
      private http: HttpClient
    ) { }

    login(email, password): Observable<AuthenticationResultModel>{
      return this.http.post<AuthenticationResultModel>('https://reqres.in/api/login', {
        email,
        password
      });
    }

    setToken(token): void {
      localStorage.setItem(TOKEN, token);
    }

    isLoggedIn(): boolean {
      return localStorage.getItem(TOKEN) != null;
    }
}
