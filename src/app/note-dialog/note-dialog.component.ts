
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note } from '../note';
import Quill from 'quill';
import { NoteService } from '../note.service';
import { NoteWithFiles } from '../note-with-files';
var DirectionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(DirectionAttribute, true);
// var AlignClass = Quill.import('attributors/class/align');
// Quill.register(AlignClass, true);
// var BackgroundClass = Quill.import('attributors/class/background');
// Quill.register(BackgroundClass, true);
// var ColorClass = Quill.import('attributors/class/color');
// Quill.register(ColorClass, true);
// var DirectionClass = Quill.import('attributors/class/direction');
// Quill.register(DirectionClass, true);
// var FontClass = Quill.import('attributors/class/font');
// Quill.register(FontClass, true);
// var SizeClass = Quill.import('attributors/class/size');
// Quill.register(SizeClass, true);
var AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);
var BackgroundStyle = Quill.import('attributors/style/background');
Quill.register(BackgroundStyle, true);
var ColorStyle = Quill.import('attributors/style/color');
Quill.register(ColorStyle, true);
var DirectionStyle = Quill.import('attributors/style/direction');
Quill.register(DirectionStyle, true);
var FontStyle = Quill.import('attributors/style/font');
Quill.register(FontStyle, true);
var SizeStyle = Quill.import('attributors/style/size');
Quill.register(SizeStyle, true);


@Component({
    selector: 'app-note-dialog',
    templateUrl: './note-dialog.component.html',
    styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent implements OnInit {
    isEditMode = false;
    genericError;
    noteTitleControl = new FormControl('', [Validators.required]);
    noteForm = new FormGroup({
        title: this.noteTitleControl,
    });

    isLoading = false;
    htmlNoteContent;
    editor;
    noteToEdit: NoteWithFiles;

    constructor(
        public dialogRef: MatDialogRef<NoteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private noteService: NoteService
    ) { }

    ngOnInit(): void {
        this.editor = new Quill('#editor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote'],

                    [{ header: 1 }, { header: 2 }],               // custom button values
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }],      // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }],          // outdent/indent
                    [{ direction: 'rtl' }],                         // text direction

                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
                    [{ font: [] }],
                    [{ align: [] }],

                    ['clean'],                                         // remove formatting button

                    ['link']                         // link and image, video
                ]
            },
            theme: 'snow'
        });
        const noteWithFilesToEdit: NoteWithFiles = this.data?.noteWithFiles;
        this.noteToEdit = noteWithFilesToEdit;
        if (this.noteToEdit) {
            this.noteTitleControl.setValue(this.noteToEdit.note.title);
            this.editor.root.innerHTML = this.noteToEdit.note.note;
            this.isEditMode = true;
        }
    }

    deleteNote(): void {
        this.isLoading = true;
        this.genericError = null;
        this.noteService.deleteNote(this.noteToEdit.note.id)
            .subscribe(result => {
                console.log(result);
                this.dialogRef.close({ deleted: true, deletedNoteId: this.noteToEdit.note.id });
            }, error => {
                console.log(error);
                this.genericError = error;
            });
    }

    saveNote(): void {
        this.genericError = null;
        if (!this.noteTitleControl.valid) {
            return;
        }

        const note = {
            title: this.noteTitleControl.value,
            note: this.editor.root.innerHTML
        } as Note;

        this.isLoading = true;
        if (this.isEditMode) {
            this.noteService.updateNote(note, this.noteToEdit.note.id)
                .subscribe(result => {
                    console.log(result);
                    this.isLoading = false;
                    note.id = this.noteToEdit.note.id;
                    this.dialogRef.close(note);
                }, error => {
                    console.log(error);
                    this.genericError = error;
                    this.isLoading = false;
                })
        } else {
            this.noteService.addNote(note)
                .subscribe(result => {
                    console.log(result);
                    this.isLoading = false;
                    this.dialogRef.close(note);
                }, error => {
                    console.log(error);
                    this.genericError = error;
                    this.isLoading = false;
                });
        }
    }

}
