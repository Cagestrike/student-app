import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UniversityClass } from './university-class';


@Injectable({
  providedIn: 'root'
})
export class UniversityClassService {
  private universityClassesUrl = 'api/universityClasses';

  constructor(
    private http: HttpClient
  ) { }

  getUniversityClasses(): Observable<UniversityClass[]> {
    return this.http.get<UniversityClass[]>(this.universityClassesUrl);
  }

  addUniversityClass(universityClass: UniversityClass) {
    return this.http.post<UniversityClass>(this.universityClassesUrl, universityClass);
  }
}
