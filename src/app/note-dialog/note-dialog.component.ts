
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note } from '../note';
import Quill from 'quill';
import { NoteService } from '../note.service';
import { NoteWithFiles } from '../note-with-files';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesComponent } from '../notes/notes.component';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';

var DirectionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(DirectionAttribute, true);
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
    visible = true;
    selectable = true;
    removable = true;
    isEditMode = false;
    genericError;
    noteTitleControl = new FormControl('', [Validators.required]);
    noteForm = new FormGroup({
        title: this.noteTitleControl,
    });
    noteFiles: FileList;
    availableTags = [];
    tags = [];
    filteredTags: Observable<any>;
    @ViewChild('noteFilesInput') noteFilesInput;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    tagControl = new FormControl();

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    isLoading = false;
    areFilesLoading;
    htmlNoteContent;
    editor;
    noteToEdit: NoteWithFiles;
    notesComponent: NotesComponent
    areTagsLoading;
    constructor(
        public dialogRef: MatDialogRef<NoteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private noteService: NoteService,
        private snackBar: MatSnackBar
    ) {
        this.filteredTags = this.tagControl.valueChanges.pipe(
            startWith(null),
            map((tagName: string | null) => tagName ? this._filter(tagName) : this.availableTags.slice()));
     }

     _filter(tagName) {
         console.log('tagName ' + tagName)
         console.log(tagName);
         if(tagName) {
            const filterValue = tagName.toLowerCase();
            return this.availableTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0)
         } else {
             return this.availableTags;
         }
     }

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
        this.notesComponent = this.data?.self;
        this.availableTags = this.data.availableTags;
        this.noteToEdit = noteWithFilesToEdit;
        if (this.noteToEdit) {
            this.noteTitleControl.setValue(this.noteToEdit.note.title);
            this.editor.root.innerHTML = this.noteToEdit.note.note;
            this.isEditMode = true;
            this.getNoteTags();
        }
    }

    getNoteTags() {
        this.areTagsLoading = true;
        this.noteService.getNoteTags(this.noteToEdit.note.id).subscribe(result => {
            console.log(result);
            this.tags = result;
            this.areTagsLoading = false;
        }, error => {
            console.log(error);
            this.areTagsLoading = false;
        })
    }

    isTagLoading = new Set<number>();
    remove(tagToRemove): void {
        this.isTagLoading.add(tagToRemove.id);
        this.noteService.deleteTag(tagToRemove.id).subscribe(result => {
            this.tags.splice(this.tags.findIndex(tag => tag.id === tagToRemove.id), 1);
            this.isTagLoading.delete(tagToRemove.id);
        }, error => {
            this.isTagLoading.delete(tagToRemove.id);
        })
    }

    add(event) {
        console.log('add tag: ');
        console.log(event.value);

        const input = event.input;
        const value = event.value;

        // Add new tag
        if ((value || '').trim()) {
            this.addTagToNote(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.tagControl.setValue(null);
    }

    selected(event: MatAutocompleteSelectedEvent) {
        console.log('selected tag ');
        console.log(event.option.value.name);
        this.addTagToNote(event.option.value);
        this.tagControl.setValue(null);
        this.tagInput.nativeElement.value = null;
    }

    addTagToNote(tagName) {
        this.areTagsLoading = true;
        this.noteService.addTagToNote(this.noteToEdit.note.id, tagName).subscribe(result => {
            console.log(result);
            this.tags.push(result.post);
            if(this.availableTags.findIndex(tag => tag.name == tagName) == -1) {
                this.availableTags.push(result.post);
            }
            this.areTagsLoading = false;
        }, error => {
            console.log(error);
            if(error.status == 400) {
                error.error = JSON.parse(error.error);
            }
            const err = error.error?.name[0] || error.error;
            this.snackBar.open(err, null, {
                duration: 6000
            });
            this.areTagsLoading = false;
        })
    }

    containsTag(tagName) {
        return this.availableTags.indexOf(tag => tag.name === tagName) != -1;
    }

    onNoteFilesChange(event): void {
        console.log(event);
        this.noteFiles = null;
        if (event.target.files.length > 0) {
            const files: FileList = event.target.files;
            this.noteFiles = files;
            this.saveFiles(files);
        }
    }

    deleteFile(file): void {
        this.areFilesLoading = true;
        this.noteService.deleteFileFromNote(file.id).subscribe(result => {
            this.areFilesLoading = false;
            this.noteToEdit.files.splice(this.noteToEdit.files.findIndex(noteFile => file.id === noteFile.id), 1);
        }, error => {
            console.log(error);
            this.areFilesLoading = false;
        })
    }

    saveFiles(files) {
        const file = files[0];
        this.areFilesLoading = true;
        this.noteService.addFileToNote(file, this.noteToEdit.note.id)
            .subscribe(result => {
                console.log(result);
                this.noteToEdit.files.push(result.userPicture);
                this.areFilesLoading = false;
                this.noteFilesInput.nativeElement.value = null;
            }, error => {
                console.log(error);
                let err = '';
                for (let msg of error.error.error.data) {
                    err += msg + '\n';
                }
                this.snackBar.open(err, null, {
                    duration: 6000
                });
                this.areFilesLoading = false;
                this.noteFilesInput.nativeElement.value = null;
            })
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
                    this.snackBar.open('Zapisano pomyślnie', null, {
                        duration: 3500
                    });
                    this.noteToEdit.note = note;
                    // this.dialogRef.close(note);
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
                    this.notesComponent.rerenderMasonryLayout();
                    this.notesComponent.getNotes();
                    this.snackBar.open('Zapisano pomyślnie', null, {
                        duration: 3500
                    });
                    this.noteToEdit = { note: null, files: [] };
                    this.noteToEdit.note = result["0"];
                    this.noteToEdit.files = [];
                    // this.dialogRef.close(note);
                }, error => {
                    console.log(error);
                    this.genericError = error;
                    this.isLoading = false;
                });
        }
    }

}
