import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UniversityClass } from '../university-class';
import { UniversityClassService } from '../university-class.service';
import { DayOfWeek, DAYS_OF_WEEK } from "../days-of-week";

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}



@Component({
    selector: 'app-new-university-class-dialog',
    templateUrl: './new-university-class-dialog.component.html',
    styleUrls: ['./new-university-class-dialog.component.css']
})
export class NewUniversityClassDialogComponent implements OnInit {
    // className;
    // classRoom;
    // classStartTime;
    // classEndTime;
    // classDay;
    classNameControl = new FormControl('', [Validators.required]);
    classRoomControl = new FormControl('', [Validators.required]);
    classStartTimeControl = new FormControl('', [Validators.required]);
    classEndTimeControl = new FormControl('', [Validators.required]);
    classDayControl = new FormControl();
    classColorControl = new FormControl();
    newUniversityClassForm = new FormGroup({
        name: this.classNameControl,
        classRoom: this.classNameControl,
        classStartTime: this.classStartTimeControl,
        classEndTime: this.classEndTimeControl,
        classDay: this.classDayControl,
        color: this.classColorControl
    });
    matcher = new MyErrorStateMatcher();

    daysOfWeek: DayOfWeek[] = DAYS_OF_WEEK;

    isEditMode = false;
    dialogHeader = 'Nowy Przedmiot';
    universityClassToEdit;

    constructor(
        public dialogRef: MatDialogRef<NewUniversityClassDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit(): void {
        const universityClassToEdit: UniversityClass = this.data?.universityClassToEdit;
        this.universityClassToEdit = universityClassToEdit;
        this.classColorControl.setValue('#3498DB');
        if(this.data?.universityClassToEdit) {
            this.isEditMode = true;
            this.dialogHeader = 'Edytuj Przedmiot';
            this.classNameControl.setValue(universityClassToEdit.name);
            this.classRoomControl.setValue(universityClassToEdit.classroom);
            this.classStartTimeControl.setValue(universityClassToEdit.startTime);
            this.classEndTimeControl.setValue(universityClassToEdit.endTime);
            this.classDayControl.setValue(universityClassToEdit.dayOfWeek);
            this.classColorControl.setValue(universityClassToEdit.color);
        }
    }

    saveUniversityClass(): void {
        const newUniversityClass = {
            classroom: this.classRoomControl.value,
            dayOfWeek: this.classDayControl.value,
            name: this.classNameControl.value,
            startTime: this.classStartTimeControl.value,
            endTime: this.classEndTimeControl.value,
            color: this.classColorControl.value
        } as UniversityClass;

        if(this.universityClassToEdit?.id) {
            newUniversityClass.id = this.universityClassToEdit.id;
        }

        this.dialogRef.close(newUniversityClass);
    }
}
