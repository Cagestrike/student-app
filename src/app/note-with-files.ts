import { Note } from './note';
import { NoteFile } from './note-file';

export interface NoteWithFiles {
    note: Note;
    files: NoteFile[];
}