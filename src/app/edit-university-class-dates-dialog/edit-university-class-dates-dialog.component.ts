import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDatetimeToAPIFormat, formatDateToAPIFormat, getTimeFromDatetime, parseActivitiesToUniversityClassesWithDates } from '../api-utils';
import { getDayOfWeekByValue } from '../days-of-week';
import { Timetable } from '../timetable';
import { UniversityClass } from '../university-class';
import { UniversityClassDate } from '../university-class-date';
import { UniversityClassService } from '../university-class.service';

@Component({
    selector: 'app-edit-university-class-dates-dialog',
    templateUrl: './edit-university-class-dates-dialog.component.html',
    styleUrls: ['./edit-university-class-dates-dialog.component.css']
})
export class EditUniversityClassDatesDialogComponent implements OnInit {
    classStartDateControl = new FormControl('', [Validators.required]);
    classStartTimeControl = new FormControl('', [Validators.required]);
    classEndTimeControl = new FormControl('', [Validators.required]);
    weeklyCheckboxControl = new FormControl();
    newDateForm = new FormGroup({
        classStartDate: this.classStartDateControl,
        classStartTime: this.classStartTimeControl,
        classEndTime: this.classEndTimeControl,
        weekly: this.weeklyCheckboxControl,
    });
    isDialogLoading = false;
    areDatesLoading = false;
    isSingleDateLoading = new Set<number>();
    apiKeyToFormControl = new Map()
        .set('start_date', this.classStartTimeControl)
        .set('end_date', this.classEndTimeControl)

    // currentTimetable;
    // matcher = new MyErrorStateMatcher();

    isEditMode = false;
    apiErrors: any;
    genericError = 'Coś poszło nie tak...';
    currentTimetable: Timetable;
    currentUniversityClass: UniversityClass;
    currentUniversityClassDates: Map<number, UniversityClassDate[]>;
    minClassStartDate;
    maxClassEndDate;
    timetableComponent;

    constructor(
        public dialogRef: MatDialogRef<EditUniversityClassDatesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private universityClassService: UniversityClassService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.currentTimetable = this.data.timetable;
        this.timetableComponent = this.data.timetableComponent;
        this.currentUniversityClass = this.data.universityClass;
        this.currentUniversityClassDates = this.data.universityClassDates;
        this.weeklyCheckboxControl.setValue(true);
        this.minClassStartDate = this.currentTimetable.start_date;
        this.maxClassEndDate = this.currentTimetable.end_date;

        console.log(this.currentUniversityClassDates);
        this.innerWidth = window.innerWidth;
    }
    
    innerWidth;
    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.innerWidth = window.innerWidth;
    }

    addDate() {
        if (this.newDateForm.invalid) {
            return;
        }
        this.newDateForm.setErrors(null);
        const periodicity = this.weeklyCheckboxControl.value ? '1' : '0';

        const newDate = {
            start_date: formatDatetimeToAPIFormat(new Date(this.classStartDateControl.value + ' ' + this.classStartTimeControl.value)),
            end_date: formatDatetimeToAPIFormat(new Date(this.classStartDateControl.value + ' ' + this.classEndTimeControl.value)),
            periodicity
        } as UniversityClassDate;

        this.isDialogLoading = true;
        this.universityClassService.addUniversityClassDate(newDate, this.currentTimetable.id, this.currentUniversityClass.id)
            .subscribe(result => {
                console.log(result.activity);
                this.isDialogLoading = false;
                this.areDatesLoading = true;
                this.clearFormValues();
                this.getUniversityClassDates();
                // this.universityClassService.getUniversityClassDates(this.currentUniversityClass.id, this.currentTimetable.id)
                //     .subscribe(result => {
                //         this.areDatesLoading = false;
                //         this.currentUniversityClassDates = parseActivitiesToUniversityClassesWithDates(result)[0].dates;
                //         this.timetableComponent.addUniversityClassDate(this.currentUniversityClassDates, this.currentUniversityClass);
                //     }, error => {
                //         this.areDatesLoading = false;
                //     })
            }, error => {
                this.isDialogLoading = false;
                this.newDateForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                }
            })
    }

    getUniversityClassDates() {
        this.areDatesLoading = true;
        this.universityClassService.getUniversityClassDates(this.currentUniversityClass.id, this.currentTimetable.id)
        .subscribe(result => {
            this.areDatesLoading = false;
            this.currentUniversityClassDates = parseActivitiesToUniversityClassesWithDates(result)[0].dates;
            this.timetableComponent.addUniversityClassDate(this.currentUniversityClassDates, this.currentUniversityClass);
        }, error => {
            this.areDatesLoading = false;
        })
    }

    clearFormValues() {
        this.classEndTimeControl.setValue(null);
        this.classStartDateControl.setValue(null);
        this.classStartTimeControl.setValue(null);
    }

    getDayOfWeek(date: Date) {
        date = new Date(date);
        return getDayOfWeekByValue(date.getDay());
    }

    formatDate(date: Date) {
        return formatDateToAPIFormat(new Date(date));
    }

    getTime(date: Date) {
        return getTimeFromDatetime(new Date(date));
    }

    handleWeeklyCheckbox(event) {
        console.log(event.checked);

    }

    isSingleDateCurrentlyLoading(id) {
        return this.isSingleDateLoading.has(id);
    }

    deletePeriodicityDates(universityClassDate) {
        console.log(universityClassDate.key);
        
        this.isSingleDateLoading.add(universityClassDate.key);
        // console.log(id);
        // console.log(this.currentUniversityClassDates.get(id));
        this.universityClassService.deletePeriodicityDates(universityClassDate.value[0].id).subscribe(result => {
            console.log(result);
            this.isSingleDateLoading.delete(universityClassDate.key);
            this.getUniversityClassDates();
        }, error => {
            console.log(error);
            this.snackBar.open(error.error, null, {
                duration: 3500
            });
            this.isSingleDateLoading.delete(universityClassDate.key);
        })
        // console.log(id);
    }

    deleteSingleDate(singleDate, universityClassDate) {
        console.log(singleDate);
        console.log(universityClassDate);
        
        this.isSingleDateLoading.add(universityClassDate)
        this.universityClassService.deleteSingleDate(singleDate.id).subscribe(result => {
            console.log(result);
            this.isSingleDateLoading.delete(universityClassDate);
            this.getUniversityClassDates();
        }, error => {
            console.log(error);
            this.snackBar.open(error.error, null, {
                duration: 3500
            });
            this.isSingleDateLoading.delete(universityClassDate);
        })
    }
}
