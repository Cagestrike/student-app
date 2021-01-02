import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Timetable } from './timetable';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './api-utils';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class TimetableService {
    private timetableUrl = `${BASE_API_URL}/plans`;

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService
    ) { }

    addTimetable(timetable: Timetable): Observable<any> {
        // return this.http.post<Timetable>(this.timetableUrl, timetable, { headers: new HttpHeaders({ Authorization: `Bearer ${this.authenticationService.getToken()}` }) });
        return this.http.post<Timetable>(this.timetableUrl, timetable);
    }

    getTimetables(): Observable<Timetable[]> {
        // return this.http.get<Timetable[]>(this.timetableUrl, { headers: new HttpHeaders({ Authorization: `Bearer ${this.authenticationService.getToken()}` }) });
        return this.http.get<Timetable[]>(this.timetableUrl);
    }
    
    deleteTimetable(timetableId): Observable<any> {
        return this.http.delete(`${this.timetableUrl}/${timetableId}`);
    }
}
