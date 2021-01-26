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
    private noteTagsUrl = `${BASE_API_URL}/noteTags`;
    private noteTagUrl = `${BASE_API_URL}/noteTag`;

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
        filedata.append('data', data, data.name);
        return this.http.post(`${this.userNotesFileUrl}/${noteId}`, filedata);
    }

    deleteFileFromNote(fileId): Observable<any> {
        return this.http.delete(`${this.userNotesFileUrl}/${fileId}`);
    }

    getAllNoteTags(): Observable<any> {
        return this.http.get(this.noteTagsUrl);
    }

    getNoteTags(noteId): Observable<any> {
        return this.http.get(`${this.noteTagsUrl}/${noteId}`);
    }

    addTagToNote(noteId, tagName): Observable<any> {
        return this.http.post(`${this.noteTagUrl}/${noteId}`, {"name": tagName});
    }
    
    deleteTag(tagId): Observable<any> {
        return this.http.delete(`${this.noteTagUrl}/${tagId}`);
    }

    getNotesWithTag(tagId): Observable<any> {
        return this.http.get(`${this.noteTagUrl}/${tagId}`);
    }
}
