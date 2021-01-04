import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from './note';
import { BASE_API_URL } from './api-utils';

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    private userNotesUrl = `${BASE_API_URL}/userNotes`;

    constructor(
        private http: HttpClient
    ) { }

    addNote(note: Note): Observable<any> {
        return this.http.post<Note>(this.userNotesUrl, note);
    }

    getNotes(): Observable<any> {
        return this.http.get<any>(this.userNotesUrl);
    }

    deleteNote(noteId): Observable<any> {
        return this.http.delete<any>(`${this.userNotesUrl}/${noteId}`);
    }

    updateNote(note: Note, noteId): Observable<any> {
        return this.http.put<any>(`${this.userNotesUrl}/${noteId}`, note);
    }
}
