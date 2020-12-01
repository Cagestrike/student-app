import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TimetableService } from '../timetable.service';
import { Timetable } from '../timetable';
import { Router } from '@angular/router';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
// import plLocale from '@fullcalendar/core/locales/pl';
import { UniversityClassService } from '../university-class.service';
import { UniversityClass } from '../university-class';
import { MatDialog } from '@angular/material/dialog';
import { NewUniversityClassDialogComponent } from '../new-university-class-dialog/new-university-class-dialog.component';
import { getDayOfWeekByValue } from "../days-of-week";
// import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
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
    matcher = new MyErrorStateMatcher();

    currentStage;
    currentTimetable: Timetable;
    universityClasses: UniversityClass[] = [];

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    calendarOptions: CalendarOptions = {
        height: '70vh',
        initialView: 'timeGridWeek',
        allDaySlot: false,
        nowIndicator: true,
        locale: 'pl',
        slotMinTime: "06:00:00",
        slotMaxTime: "21:00:00",
        slotDuration: "00:15:00",
        firstDay: 1,
        dayHeaderFormat: { weekday: 'long' },
        headerToolbar: {
            start: 'title',
            center: '',
            end: ''
        },
    };

    constructor(
        private timetableService: TimetableService,
        private universityClassService: UniversityClassService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getCurrentTimetable();
    }

    getDayOfWeek(val) {
        return getDayOfWeekByValue(val);
    }

    startTimetableCreation(): void {
        this.currentStage = 'create new timetable';
    }

    getCurrentTimetable(): void {
        this.timetableService.getCurrentTimetable().subscribe(currentTimetable => {
            if (!currentTimetable.length) {
                this.currentStage = 'no timetable';
                return;
            }
            this.currentTimetable = currentTimetable[0];
            this.getInitialRelatedUniversityClasses();
            this.currentStage = 'current timetable';
        });
    }

    saveTimetable(): void {
        if (!this.newTimetableForm.valid) { return; }
        const timetable = {
            name: this.timetableName,
            startDate: this.timetableStartDate,
            endDate: this.timetableEndDate
        } as Timetable;

        this.timetableService.addTimetable(timetable)
            .subscribe(timetable => {
                if (timetable) {
                    this.getCurrentTimetable();
                }
            });
    }

    openCreateClassDialog(): void {
        const dialogRef = this.dialog.open(NewUniversityClassDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            this.universityClassService.addUniversityClass(result)
                .subscribe(uniClassResult => {
                    if(uniClassResult) {
                        this.addUniversityClass(uniClassResult);
                    }
                });
        });
    }

    getInitialRelatedUniversityClasses(): void {
        this.universityClassService.getUniversityClasses().subscribe(universityClasses => {
            this.universityClasses = universityClasses;
            const calendarEvents = this.universityClasses.map(universityClass => {
                return this.mapUniversityClassToEvent(universityClass);
            }).forEach(event => {
                this.calendarComponent.getApi().addEvent(event);
            });
        });
    }

    addUniversityClass(universityClass: UniversityClass) {
        this.universityClasses.push(universityClass);
        const calendarEvent = this.mapUniversityClassToEvent(universityClass);
        this.calendarComponent.getApi().addEvent(calendarEvent);
    }

    mapUniversityClassToEvent(universityClass: UniversityClass): {} {
        return {
            title: universityClass.name,
            startTime: universityClass.startTime,
            endTime: universityClass.endTime,
            daysOfWeek: [universityClass.dayOfWeek],
        };
    }

}
