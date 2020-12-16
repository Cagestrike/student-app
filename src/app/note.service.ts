import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from './note';

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    private noteUrl = 'api/notes';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    addNote(note: Note) {
        return this.http.post<Note>(this.noteUrl, note, this.httpOptions);
    }

    getNotes(): Observable<Note[]> {
        return this.http.get<Note[]>(this.noteUrl);
    }

    updateNote(note: Note) {
        return this.http.put<Note>(this.noteUrl, note);
    }
}
