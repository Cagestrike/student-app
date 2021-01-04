import { Component, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Note } from '../note';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { NoteService } from '../note.service';
import Quill from 'quill';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { NgxMasonryComponent } from 'ngx-masonry';
import { NoteWithFiles } from '../note-with-files';
import { parseNotesToNotesWithFiles } from '../api-utils';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class NotesComponent implements OnInit {
    notes: NoteWithFiles[] = [];
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
    isLoading = true;

    constructor(
        public dialog: MatDialog,
        private noteService: NoteService
    ) { }

    ngOnInit(): void {
        this.getNotes();
    }

    getNotes(): void {
        this.isLoading = true;
        this.noteService.getNotes()
            .subscribe(notes => {
                this.notes = parseNotesToNotesWithFiles(notes);
                this.rerenderMasonryLayout();
                this.isLoading = false;
                console.log(notes);
                console.log(this.notes);
            }, error => {
                this.isLoading = false;
                console.log(error);
            });
    }

    rerenderMasonryLayout() {
        this.masonry.reloadItems();
        this.masonry.layout();
    }

    updateNote(note: Note) {
        // const noteIndexToUpdate = this.notes.findIndex(noteToFind => noteToFind.id === note.id);
        // this.notes[noteIndexToUpdate] = note;
        // this.rerenderMasonryLayout();
    }

    openCreateNoteDialog() {
        const dialogRef = this.dialog.open(NoteDialogComponent, {
            panelClass: 'my-custom-dialog-class'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.rerenderMasonryLayout();
                this.getNotes();
            }
            // this.notes.unshift({note: result, files: []});
        })
    }

    openEditNoteDialog(noteWithFiles: NoteWithFiles) {
        console.log(noteWithFiles);

        const dialogRef = this.dialog.open(NoteDialogComponent, {
            data: {
                noteWithFiles
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.deleted) {
                this.notes.splice(this.notes.findIndex(nt => nt.note.id === result.deletedNoteId), 1);
                this.rerenderMasonryLayout();
                return;
            }

            this.notes[this.notes.findIndex(nt => nt.note.id === result.id)].note = result;
            this.rerenderMasonryLayout();
        });
    }
}
