import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UniversityClass } from './university-class';
import { BASE_API_URL } from './api-utils';
import { UniversityClassDate } from './university-class-date';

@Injectable({
    providedIn: 'root'
})
export class UniversityClassService {
    private universityClassesUrl = `${BASE_API_URL}/activities`;
    private universityClassDatesUrl = `${BASE_API_URL}/activitiesDate`;
    private universityClassUrl = `${BASE_API_URL}/activity`;
    constructor(
        private http: HttpClient
    ) { }

    getUniversityClasses(timetableId): Observable<any> {
        return this.http.get<any>(`${this.universityClassesUrl}/${timetableId}`);
    }

    addUniversityClass(universityClass: UniversityClass, timetableId): Observable<any> {
        return this.http.post<UniversityClass>(`${this.universityClassesUrl}/${timetableId}`, universityClass);
    }

    updateUniversityClass(universityClass: UniversityClass, id): Observable<any> {
        return this.http.put<UniversityClass>(`${this.universityClassesUrl}/${id}`, universityClass);
    }

    deleteUniversityClass(universityClassId): Observable<any> {
        return this.http.delete(`${this.universityClassesUrl}/${universityClassId}`);
    }

    addUniversityClassDate(universityClassDate: UniversityClassDate, timetableId, universityClassId): Observable<any> {
        // activitiesDate/{planId}/{activityId}
        return this.http.post(`${this.universityClassDatesUrl}/${timetableId}/${universityClassId}`, universityClassDate);
    }

    getUniversityClassDates(universityClassId, timetableId): Observable<any> {
        return this.http.get(`${this.universityClassUrl}/${universityClassId}/${timetableId}`);
    }
}
