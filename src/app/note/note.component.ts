import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../note';
import { NoteWithFiles } from '../note-with-files';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
    @Input() note: NoteWithFiles;

    constructor() { }

    ngOnInit(): void {
    }

}
