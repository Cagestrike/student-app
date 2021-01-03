import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEvent } from './user-event';
import { BASE_API_URL } from './api-utils';
import { UserEventDate } from './user-event-date';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private eventUrl = `${BASE_API_URL}/userEvents`;
    private eventDateUrl = `${BASE_API_URL}/userEventsDate`;

    constructor(
        private http: HttpClient
    ) { }

    addEvent(event: UserEvent): Observable<any> {
        return this.http.post<any>(this.eventUrl, event);
    }

    addEventDate(eventDate: UserEventDate, eventId): Observable<any> {
        return this.http.post<any>(`${this.eventDateUrl}/${eventId}`, eventDate);
    }

    getEvents(): Observable<any> {
        return this.http.get<any>(this.eventUrl);
    }

    deleteEvent(eventId): Observable<any> {
        return this.http.delete<any>(`${this.eventUrl}/${eventId}`);
    }

    updateEvent(event: UserEvent, eventId): Observable<any> {
        return this.http.put<any>(`${this.eventUrl}/${eventId}`, event);
    }

    updateEventDate(eventDate: UserEventDate, eventDateId): Observable<any> {
        return this.http.put<any>(`${this.eventDateUrl}/${eventDateId}`, eventDate);
    }
}
