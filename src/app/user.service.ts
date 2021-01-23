import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_API_URL } from './api-utils';
import { AuthenticationService } from './authentication.service';

const USER_DATA = 'user_details';
const USER_PROFILE_PIC = 'user_profile_pic_url';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    usersUrl = `${BASE_API_URL}/users`;
    userPicturesUrl = `${BASE_API_URL}/userPictures`;
    searchUsersUrl = `${BASE_API_URL}/searchUsers`;

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService
    ) { }

    getCurrentUser() {
        return localStorage.getItem(USER_DATA) != null
            ? JSON.parse(localStorage.getItem(USER_DATA))
            : this.http.get<any>(this.usersUrl)
                .subscribe(data => {
                    this.setCurrentUser(data);
                    this.getCurrentUser();
                }, error => {
                    console.error(error);
                })
    }

    updateUser(user): Observable<any> {
        return this.http.put(this.usersUrl, user);
    }

    deleteUser(): Observable<any> {
        return this.http.delete(this.usersUrl);
    }

    getUserProfilePic(): Observable<any> {
        return localStorage.getItem(USER_PROFILE_PIC) != null
            ? of(JSON.parse(localStorage.getItem(USER_PROFILE_PIC)))
            : this.http.get(this.userPicturesUrl)
                .pipe(
                    tap(userPicture => {
                        localStorage.setItem(USER_PROFILE_PIC, JSON.stringify(userPicture))
                        console.log()
                    })
                )
    }

    addUserProfilePic(data): Observable<any> {
        const filedata: FormData = new FormData();
        filedata.append('name', data, data.name);

        return this.http.post(this.userPicturesUrl, filedata);
    }

    deleteUserPicture(id): Observable<any> {
        return this.http.delete(`${this.userPicturesUrl}/${id}`).pipe(
            tap(userPicture => {
                // localStorage.removeItem(USER_PROFILE_PIC);
                // this.getUserProfilePic();
            })
        );
    }

    getCurrentUserFromServer(): Observable<any> {
        return this.http.get<any>(this.usersUrl);
    }

    setCurrentUser(userData) {
        localStorage.setItem(USER_DATA, JSON.stringify(userData));
    }

    clearUserProfilePic() {
        localStorage.removeItem(USER_PROFILE_PIC);
    }

    clearCurrentUser() {
        localStorage.removeItem(USER_DATA);
    }

    searchUsers(term): Observable<any> {
        return this.http.get(`${this.searchUsersUrl}/${term}`);
    }
}
