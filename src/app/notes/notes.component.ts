import { Component, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Note } from '../note';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { NoteService } from '../note.service';
import Quill from 'quill';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { NgxMasonryComponent } from 'ngx-masonry';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class NotesComponent implements OnInit {
    notes: Note[] = [];
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;

    constructor(
        public dialog: MatDialog,
        private noteService: NoteService
    ) { }

    ngOnInit(): void {
        this.noteService.getNotes()
            .subscribe(notes => {
                this.notes = notes;
                this.rerenderMasonryLayout();
            })
    }

    rerenderMasonryLayout() {
        this.masonry.reloadItems();
        this.masonry.layout();
    }

    updateNote(note: Note) {
        const noteIndexToUpdate = this.notes.findIndex(noteToFind => noteToFind.id === note.id);
        this.notes[noteIndexToUpdate] = note;
        this.rerenderMasonryLayout();
    }

    openCreateNoteDialog() {
        const dialogRef = this.dialog.open(NoteDialogComponent, {
            panelClass: 'my-custom-dialog-class'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.noteService.addNote(result)
            .subscribe(noteResult => {
                if(noteResult) {
                    this.notes.unshift(noteResult);
                    this.rerenderMasonryLayout();
                }
            });
        })
    }

    openEditNoteDialog(noteToEdit: Note) {
        const dialogRef = this.dialog.open(NoteDialogComponent, {
            data: {
                noteToEdit
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.noteService.updateNote(result)
                .subscribe(() => {
                    this.updateNote(result);
                }, error => {
                    console.log(error);
                });
        })
    }
}
