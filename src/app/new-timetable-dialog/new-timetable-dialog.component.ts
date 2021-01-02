import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { formatDateToAPIFormat } from '../api-utils';
import { Timetable } from '../timetable';
import { TimetableService } from '../timetable.service';

@Component({
    selector: 'app-new-timetable-dialog',
    templateUrl: './new-timetable-dialog.component.html',
    styleUrls: ['./new-timetable-dialog.component.css']
})
export class NewTimetableDialogComponent implements OnInit {
    timetableName;
    timetableStartDate;
    timetableEndDate;
    timetableNameControl = new FormControl('', [Validators.required]);
    startDateControl = new FormControl('', [Validators.required]);
    endDateControl = new FormControl('', [Validators.required]);
    newTimetableForm = new FormGroup({
        name: this.timetableNameControl,
        startDate: this.startDateControl,
        endDate: this.endDateControl,
    });
    newTimetableErrors;
    isLoading = false;

    constructor(
        private timetableService: TimetableService,
        public dialogRef: MatDialogRef<NewTimetableDialogComponent>,
    ) { }

    ngOnInit(): void {
    }

    close() {
        this.dialogRef.close();
    }

    saveTimetable(): void {
        this.newTimetableForm.setErrors(null);
        this.newTimetableErrors = null;
        if (this.newTimetableForm.invalid) { return; }

        const timetable = {
            name: this.timetableName,
            start_date: formatDateToAPIFormat(new Date(this.timetableStartDate)),
            end_date: formatDateToAPIFormat(new Date(this.timetableEndDate))
        } as Timetable;

        this.isLoading = true;
        this.timetableService.addTimetable(timetable)
            .subscribe(resultTimetable => {
                this.dialogRef.close(resultTimetable);
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                this.newTimetableForm.setErrors({ apiErrors: true });
                this.newTimetableErrors = error.error.end_date[0];
            });
    }

}
