import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { BASE_API_URL } from './api-utils';
import { AuthenticationService } from './authentication.service';

const USER_DATA = 'user_details';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    usersUrl = `${BASE_API_URL}/users`;

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService
    ) { }

    getCurrentUser() {
        return localStorage.getItem(USER_DATA) != null 
            ? JSON.parse(localStorage.getItem(USER_DATA))
            : this.http.get<any>(this.usersUrl, { headers: new HttpHeaders({ Authorization: `Bearer ${this.authenticationService.getToken()}` }) })
                .subscribe(data => {
                    this.setCurrentUser(data);
                    this.getCurrentUser();
                }, error => {
                    console.error(error);
                })
    }

    setCurrentUser(userData) {
        localStorage.setItem(USER_DATA, JSON.stringify(userData));
    }

    clearCurrentUser() {
        localStorage.removeItem(USER_DATA);
    }
}
