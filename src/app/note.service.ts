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
    private userNotesFileUrl = `${BASE_API_URL}/userNotesData`

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

    addFileToNote(data, noteId): Observable<any> {
        const filedata: FormData = new FormData();
        // filedata.append('dataName', data, data.name);
        filedata.append('data', data, data.name);
        console.log(filedata)
        return this.http.post(`${this.userNotesFileUrl}/${noteId}`, filedata);
    }

    deleteFileFromNote(fileId): Observable<any> {
        return this.http.delete(`${this.userNotesFileUrl}/${fileId}`);
    }
}
