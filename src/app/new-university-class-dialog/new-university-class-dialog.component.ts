import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    classDay;
    classNameControl = new FormControl('', [Validators.required]);
    classRoomControl = new FormControl('', [Validators.required]);
    classStartTimeControl = new FormControl('', [Validators.required]);
    classEndTimeControl = new FormControl('', [Validators.required]);
    // classDayControl = new FormControl('', [Validators.required]);
    newUniversityClassForm = new FormGroup({
        name: this.classNameControl,
        classRoom: this.classNameControl,
        classStartTime: this.classStartTimeControl,
        classEndTime: this.classEndTimeControl,
        // classDay: this.classDayControl
    });
    matcher = new MyErrorStateMatcher();

    daysOfWeek: DayOfWeek[] = DAYS_OF_WEEK;

    constructor(
        public dialogRef: MatDialogRef<NewUniversityClassDialogComponent>
    ) { }

    ngOnInit(): void {
    }

    createUniversityClass(): void {
        const newUniversityClass = {
            classroom: this.classRoomControl.value,
            dayOfWeek: this.classDay,
            name: this.classNameControl.value,
            startTime: this.classStartTimeControl.value,
            endTime: this.classEndTimeControl.value
        } as UniversityClass;

        this.dialogRef.close(newUniversityClass);
    }
}
