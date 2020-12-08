import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private eventUrl = 'api/events';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    addEvent(event: Event) {
        return this.http.post<Event>(this.eventUrl, event, this.httpOptions);
    }

    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(this.eventUrl);
    }
}
