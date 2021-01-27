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
import { Router } from '@angular/router';

export interface NoteTag {
    id;
    name;
}

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class NotesComponent implements OnInit {
    allNotes: NoteWithFiles[] = [];
    currentNotes: NoteWithFiles[] = [];
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
    isLoading = true;
    noteTags: NoteTag[] = [];

    constructor(
        public dialog: MatDialog,
        private noteService: NoteService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getNotes();
        this.getAllNoteTags();
    }

    getAllNoteTags() {
        this.noteService.getAllNoteTags().subscribe(result => {
            console.log(result);
            this.noteTags = result;
        }, error => {
            console.log(error);
        })
    }

    getNoteTags() {
        return this.noteTags;
    }

    filterNotesByTag(tagId) {
        console.log(this.allNotes);
        console.log(this.currentNotes);
        if(tagId == -1) {
            this.currentNotes = this.allNotes;
            this.rerenderMasonryLayout();
        } else {
            this.isLoading = true;
            this.noteService. getNotesWithTag(tagId).subscribe(result => {
                console.log(result);
                const noteIds = new Set<number>();
                result.forEach(note => {
                    noteIds.add(note.id);
                })
                console.log(noteIds);
                this.currentNotes = this.allNotes.filter(note => noteIds.has(note.note.id));
                this.rerenderMasonryLayout()
                this.isLoading = false;
            }, error => {
                console.log(error);
                this.isLoading = false;
            })
        }
    }

    getNotes(): void {
        this.isLoading = true;
        this.noteService.getNotes()
            .subscribe(notes => {
                this.currentNotes = parseNotesToNotesWithFiles(notes);
                this.allNotes = this.currentNotes;
                this.rerenderMasonryLayout();
                this.isLoading = false;
                console.log(this.allNotes);
            }, error => {
                this.isLoading = false;
                console.log(error);
            });
    }

    rerenderMasonryLayout() {
        this.masonry.reloadItems();
        this.masonry.layout();
    }

    clearQueryParams() {
        this.router.navigate(
            [],
            {
                queryParams: { noteDialog: null, },
                queryParamsHandling: 'merge',
            }
        );
    }

    openCreateNoteDialog() {
        this.router.navigate(
            [],
            {
                queryParams: { noteDialog: 1 },
                queryParamsHandling: 'merge',
            }
        );
        const dialogRef = this.dialog.open(NoteDialogComponent, {
            panelClass: 'my-custom-dialog-class',
            data: {
                self: this,
                availableTags: this.noteTags
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.clearQueryParams();
            this.getAllNoteTags();
            if (result) {
                this.rerenderMasonryLayout();
                this.getNotes();
            }
        })
    }

    openEditNoteDialog(noteWithFiles: NoteWithFiles) {
        this.router.navigate(
            [],
            {
                queryParams: { noteDialog: 1 },
                queryParamsHandling: 'merge',
            }
        );
        const dialogRef = this.dialog.open(NoteDialogComponent, {
            panelClass: 'my-custom-dialog-class',
            data: {
                noteWithFiles,
                availableTags: this.noteTags,
                self: this
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.clearQueryParams();
            this.getAllNoteTags();
            if (result?.deleted) {
                this.allNotes.splice(this.allNotes.findIndex(nt => nt.note.id === result.deletedNoteId), 1);
                this.currentNotes.splice(this.currentNotes.findIndex(nt => nt.note.id === result.deletedNoteId), 1);
                this.rerenderMasonryLayout();
                return;
            }
            if(result) {
                this.allNotes[this.allNotes.findIndex(nt => nt.note.id === result.id)].note = result;
                this.currentNotes[this.currentNotes.findIndex(nt => nt.note.id === result.id)].note = result;
            }

            this.rerenderMasonryLayout();
        });
    }

    onNoteTagChange(event) {
        this.filterNotesByTag(event.value);
    }
}
