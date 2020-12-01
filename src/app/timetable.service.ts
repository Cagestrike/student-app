import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Timetable } from './timetable';
import { TimetableComponent } from './timetable/timetable.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private timetableUrl = 'api/timetable';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  addTimetable(timetable: Timetable) {
    return this.http.post<Timetable>(this.timetableUrl, timetable, this.httpOptions);
  }

  getCurrentTimetable(): Observable<Timetable[]> {
    return this.http.get<Timetable[]>(this.timetableUrl);
  }
}
